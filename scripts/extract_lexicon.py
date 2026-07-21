#!/usr/bin/env python3
"""Extract the complete Rarámuri-Spanish master lexicon from the working PDF.

The PDF is a paginated four-column table. This script keeps the first page on
which an entry appears and merges continuation rows that flow onto later pages.
"""

from __future__ import annotations

import argparse
import csv
import json
import re
import unicodedata
from pathlib import Path

import pdfplumber


HEADER_MARKERS = {"palabra en", "rarámuri", "clasif", "traducción", "ejemplos y comentarios"}


def clean_text(value: str | None) -> str:
    if not value:
        return ""
    return re.sub(r"\s+", " ", value).strip()


def normalize_headword(value: str) -> str:
    value = value.replace("’", "'").replace("‘", "'").lower()
    value = "".join(
        char for char in unicodedata.normalize("NFD", value)
        if unicodedata.category(char) != "Mn"
    )
    return re.sub(r"\s+", " ", value).strip()


def split_homonym(raw: str) -> tuple[str, int | None]:
    match = re.match(r"^([1-9])(?=[A-Za-zÁÉÍÓÚÜÑáéíóúüñ'’‘])", raw)
    if not match:
        return raw, None
    return raw[1:].strip(), int(match.group(1))


def classification_family(raw: str) -> str:
    compact = raw.strip()
    for prefix in ("Vt", "Vi", "Vr", "Adj", "Adv", "Pron", "Interj", "Conj", "Prep", "Pp", "Imper", "Interr", "S", "V"):
        if compact.lower().startswith(prefix.lower()):
            return prefix
    return "Sin clasificar" if not compact else "Otra"


def split_senses(translation: str) -> list[str]:
    if not translation:
        return []
    matches = list(re.finditer(r"(?:^|\s)(\d+)\.\s*", translation))
    if len(matches) < 2:
        return [translation]
    senses: list[str] = []
    for index, match in enumerate(matches):
        start = match.end()
        end = matches[index + 1].start() if index + 1 < len(matches) else len(translation)
        value = translation[start:end].strip(" ;,")
        if value:
            senses.append(value)
    return senses or [translation]


def extract_variants(headword: str, comments: str) -> list[str]:
    variants: list[str] = []
    if "," in headword:
        variants.extend(part.strip() for part in headword.split(",")[1:] if part.strip())
    variants.extend(clean_text(value) for value in re.findall(r"\[([^\]]+)\]", comments))
    for match in re.finditer(r"\b[Vv]e(?:a|á)se\s+([^.;\]]+)", comments):
        variants.append(f"véase {clean_text(match.group(1))}")
    unique: list[str] = []
    seen: set[str] = set()
    for value in variants:
        key = normalize_headword(value)
        if value and key not in seen:
            seen.add(key)
            unique.append(value)
    return unique


def table_values(row: list[str | None]) -> tuple[str, str, str, str]:
    cells = [clean_text(cell) for cell in row]
    if len(cells) >= 6:
        return cells[0], cells[3], cells[4], cells[5]
    if len(cells) == 4:
        return cells[0], cells[1], cells[2], cells[3]
    cells.extend([""] * (4 - len(cells)))
    return cells[0], cells[1], cells[2], " ".join(cells[3:]).strip()


def is_header(row: list[str | None]) -> bool:
    compact = {clean_text(cell).lower() for cell in row if clean_text(cell)}
    return bool(compact & HEADER_MARKERS) and not any(
        value and value not in HEADER_MARKERS for value in compact
    )


def extract(pdf_path: Path) -> list[dict[str, object]]:
    records: list[dict[str, object]] = []
    with pdfplumber.open(pdf_path) as pdf:
        for page_number, page in enumerate(pdf.pages, start=1):
            if page_number < 3:
                continue
            tables = page.extract_tables()
            if not tables:
                continue
            for row in tables[0]:
                if is_header(row):
                    continue
                lemma_raw, classification, translation, comments = table_values(row)
                if not any((lemma_raw, classification, translation, comments)):
                    continue
                if not lemma_raw:
                    if not records:
                        continue
                    record = records[-1]
                    if translation:
                        record["translation_raw"] = clean_text(f"{record['translation_raw']} {translation}")
                        record["senses"] = split_senses(str(record["translation_raw"]))
                    if comments:
                        record["comments_raw"] = clean_text(f"{record['comments_raw']} {comments}")
                        record["examples"] = [record["comments_raw"]]
                        record["variants"] = extract_variants(str(record["headword_raw"]), str(record["comments_raw"]))
                    record["page_end"] = page_number
                    continue

                headword, homonym_number = split_homonym(lemma_raw)
                record_id = f"RD-{len(records) + 1:06d}"
                records.append({
                    "record_id": record_id,
                    "headword": headword,
                    "headword_raw": lemma_raw,
                    "headword_normalized": normalize_headword(headword),
                    "homonym_number": homonym_number,
                    "classification": classification,
                    "classification_family": classification_family(classification),
                    "translation_raw": translation,
                    "senses": split_senses(translation),
                    "examples": [comments] if comments else [],
                    "variants": extract_variants(lemma_raw, comments),
                    "comments_raw": comments,
                    "source_code": "SRC-02",
                    "source_document": pdf_path.name,
                    "page_start": page_number,
                    "page_end": page_number,
                    "status": "Transcrito",
                })
    return records


def write_csv(path: Path, records: list[dict[str, object]]) -> None:
    columns = [
        "record_id", "headword", "headword_raw", "headword_normalized", "homonym_number", "classification",
        "classification_family", "translation_raw", "senses", "examples", "variants",
        "comments_raw", "source_code", "source_document", "page_start", "page_end", "status",
    ]
    with path.open("w", encoding="utf-8-sig", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=columns)
        writer.writeheader()
        for record in records:
            row = dict(record)
            for key in ("senses", "examples", "variants"):
                row[key] = json.dumps(row[key], ensure_ascii=False)
            writer.writerow(row)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("pdf", type=Path)
    parser.add_argument("output_dir", type=Path)
    args = parser.parse_args()

    args.output_dir.mkdir(parents=True, exist_ok=True)
    records = extract(args.pdf)
    json_path = args.output_dir / "lexicon-master.json"
    csv_path = args.output_dir / "lexicon-master.csv"
    report_path = args.output_dir / "extraction-report.json"

    json_path.write_text(json.dumps(records, ensure_ascii=False, indent=2), encoding="utf-8")
    write_csv(csv_path, records)

    report = {
        "records": len(records),
        "pages": sorted({record["page_start"] for record in records}),
        "page_min": min((record["page_start"] for record in records), default=None),
        "page_max": max((record["page_end"] for record in records), default=None),
        "with_examples": sum(bool(record["examples"]) for record in records),
        "with_variants": sum(bool(record["variants"]) for record in records),
        "without_classification": sum(not record["classification"] for record in records),
        "without_translation": sum(not record["translation_raw"] for record in records),
        "classification_families": sorted({str(record["classification_family"]) for record in records}),
        "first_record": records[0] if records else None,
        "last_record": records[-1] if records else None,
    }
    report_path.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps({key: value for key, value in report.items() if key not in {"first_record", "last_record", "pages"}}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
