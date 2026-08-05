#!/usr/bin/env python3
"""Generate deterministic, printable PDF exports for Rarámuri Digital.

The PDFs are derived from data/lexicon-master.csv. They never become an
independent source of truth: rerun this script whenever the master lexicon or
project metadata changes.
"""

from __future__ import annotations

import argparse
import csv
import hashlib
import json
import os
import re
import sys
import unicodedata
import zipfile
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable, Sequence
from xml.sax.saxutils import escape

import reportlab
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import LETTER
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    PageBreak,
    PageTemplate,
    Paragraph,
    Spacer,
)

PROJECT_ROOT = Path(__file__).resolve().parents[1]
DEFAULT_SOURCE = PROJECT_ROOT / "data" / "lexicon-master.csv"
DEFAULT_METADATA = PROJECT_ROOT / "project-metadata.json"
DEFAULT_OUTPUT = PROJECT_ROOT / "dist" / "pdf"
LICENSE_ID = "CC BY-NC-SA 4.0"
LICENSE_URL = "https://creativecommons.org/licenses/by-nc-sa/4.0/"
RESPONSIBLE = "Fernando Sandoval Gutiérrez"
PUBLISHERS = "Universidad CEEES; Universidad Autónoma de Ciudad Juárez; Cuerpo Académico UACJ-113"


@dataclass(frozen=True)
class Entry:
    record_id: str
    headword: str
    headword_raw: str
    headword_normalized: str
    homonym_number: str
    classification: str
    translation_raw: str
    senses: tuple[str, ...]
    examples: tuple[str, ...]
    variants: tuple[str, ...]
    comments_raw: str
    source_code: str
    source_document: str
    page_start: str
    page_end: str
    status: str


class DeterministicCanvas(canvas.Canvas):
    """Canvas with deterministic identifiers and timestamps."""

    def __init__(self, *args, **kwargs):
        kwargs["invariant"] = 1
        super().__init__(*args, **kwargs)


def parse_json_list(value: str) -> tuple[str, ...]:
    if not value:
        return ()
    try:
        parsed = json.loads(value)
    except json.JSONDecodeError as exc:
        raise ValueError(f"Invalid JSON list in CSV: {value[:120]!r}") from exc
    if not isinstance(parsed, list):
        raise ValueError(f"Expected a JSON list, got {type(parsed).__name__}")
    return tuple(str(item).strip() for item in parsed if str(item).strip())


def read_entries(path: Path) -> list[Entry]:
    with path.open("r", encoding="utf-8-sig", newline="") as handle:
        reader = csv.DictReader(handle)
        required = {
            "record_id", "headword", "headword_raw", "headword_normalized",
            "homonym_number", "classification", "translation_raw", "senses",
            "examples", "variants", "comments_raw", "source_code",
            "source_document", "page_start", "page_end", "status",
        }
        missing = required.difference(reader.fieldnames or [])
        if missing:
            raise ValueError(f"Missing CSV columns: {', '.join(sorted(missing))}")
        entries = [
            Entry(
                record_id=row["record_id"].strip(),
                headword=row["headword"].strip(),
                headword_raw=row["headword_raw"].strip(),
                headword_normalized=row["headword_normalized"].strip(),
                homonym_number=row["homonym_number"].strip(),
                classification=row["classification"].strip(),
                translation_raw=row["translation_raw"].strip(),
                senses=parse_json_list(row["senses"]),
                examples=parse_json_list(row["examples"]),
                variants=parse_json_list(row["variants"]),
                comments_raw=row["comments_raw"].strip(),
                source_code=row["source_code"].strip(),
                source_document=row["source_document"].strip(),
                page_start=row["page_start"].strip(),
                page_end=row["page_end"].strip(),
                status=row["status"].strip(),
            )
            for row in reader
        ]
    if not entries:
        raise ValueError("The master lexicon is empty")
    ids = [entry.record_id for entry in entries]
    if len(ids) != len(set(ids)):
        raise ValueError("Duplicate record_id values found")
    return sorted(entries, key=entry_sort_key)


def fold_text(value: str) -> str:
    normalized = unicodedata.normalize("NFKD", value.casefold())
    return "".join(ch for ch in normalized if not unicodedata.combining(ch))


def entry_sort_key(entry: Entry) -> tuple[str, int, str]:
    try:
        homonym = int(entry.homonym_number or 0)
    except ValueError:
        homonym = 0
    return (fold_text(entry.headword_normalized or entry.headword), homonym, entry.record_id)


def alphabet_group(entry: Entry) -> str:
    folded = fold_text(entry.headword_normalized or entry.headword).strip()
    match = re.search(r"[a-z]", folded)
    return match.group(0).upper() if match else "OTROS"


def page_label(entry: Entry) -> str:
    return entry.page_start if entry.page_start == entry.page_end else f"{entry.page_start}-{entry.page_end}"


def find_font() -> tuple[Path, Path]:
    configured = os.getenv("RARAMURI_PDF_FONT")
    configured_bold = os.getenv("RARAMURI_PDF_FONT_BOLD")
    candidates = []
    if configured:
        candidates.append((Path(configured), Path(configured_bold or configured)))
    candidates.extend(
        [
            (Path("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"), Path("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf")),
            (Path("/usr/share/fonts/truetype/noto/NotoSans-Regular.ttf"), Path("/usr/share/fonts/truetype/noto/NotoSans-Bold.ttf")),
            (Path(reportlab.__file__).resolve().parent / "fonts" / "Vera.ttf", Path(reportlab.__file__).resolve().parent / "fonts" / "VeraBd.ttf"),
        ]
    )
    for regular, bold in candidates:
        if regular.exists() and bold.exists():
            return regular, bold
    raise FileNotFoundError(
        "No Unicode TrueType font was found. Install fonts-dejavu-core or set "
        "RARAMURI_PDF_FONT and RARAMURI_PDF_FONT_BOLD."
    )


def register_fonts() -> tuple[str, str]:
    regular, bold = find_font()
    pdfmetrics.registerFont(TTFont("RaramuriSans", str(regular), subfontIndex=0))
    pdfmetrics.registerFont(TTFont("RaramuriSans-Bold", str(bold), subfontIndex=0))
    return "RaramuriSans", "RaramuriSans-Bold"


def build_styles(font: str, font_bold: str):
    base = getSampleStyleSheet()
    return {
        "cover_title": ParagraphStyle(
            "CoverTitle", parent=base["Title"], fontName=font_bold,
            fontSize=26, leading=31, alignment=TA_CENTER, textColor=colors.HexColor("#173F35"),
            spaceAfter=9 * mm,
        ),
        "cover_subtitle": ParagraphStyle(
            "CoverSubtitle", parent=base["Normal"], fontName=font,
            fontSize=12, leading=17, alignment=TA_CENTER, textColor=colors.HexColor("#364A45"),
            spaceAfter=7 * mm,
        ),
        "cover_meta": ParagraphStyle(
            "CoverMeta", parent=base["Normal"], fontName=font,
            fontSize=9.5, leading=14, alignment=TA_CENTER, textColor=colors.HexColor("#333333"),
            spaceAfter=4 * mm,
        ),
        "notice": ParagraphStyle(
            "Notice", parent=base["Normal"], fontName=font,
            fontSize=9, leading=13, alignment=TA_LEFT, backColor=colors.HexColor("#F2F5F3"),
            borderColor=colors.HexColor("#8AA69E"), borderWidth=0.5, borderPadding=7,
            spaceBefore=4 * mm, spaceAfter=5 * mm,
        ),
        "section": ParagraphStyle(
            "Section", parent=base["Heading1"], fontName=font_bold,
            fontSize=19, leading=23, textColor=colors.HexColor("#173F35"),
            spaceBefore=5 * mm, spaceAfter=4 * mm, keepWithNext=True,
        ),
        "entry": ParagraphStyle(
            "Entry", parent=base["Heading2"], fontName=font_bold,
            fontSize=11.5, leading=14, textColor=colors.HexColor("#173F35"),
            spaceBefore=4 * mm, spaceAfter=1.5 * mm, keepWithNext=True,
        ),
        "body": ParagraphStyle(
            "Body", parent=base["BodyText"], fontName=font,
            fontSize=8.7, leading=12.2, textColor=colors.HexColor("#222222"),
            spaceAfter=1.6 * mm,
        ),
        "label": ParagraphStyle(
            "Label", parent=base["BodyText"], fontName=font,
            fontSize=8, leading=11, textColor=colors.HexColor("#455B55"),
            spaceAfter=1.2 * mm,
        ),
        "small": ParagraphStyle(
            "Small", parent=base["BodyText"], fontName=font,
            fontSize=7.2, leading=9.5, textColor=colors.HexColor("#5A5A5A"),
            spaceAfter=3 * mm,
        ),
    }


def safe(value: str) -> str:
    return escape(value or "").replace("\n", "<br/>")


def entry_story(entry: Entry, styles) -> list:
    homonym = f" <super>{safe(entry.homonym_number)}</super>" if entry.homonym_number else ""
    story = [
        Paragraph(
            f"{safe(entry.headword)}{homonym} <font name='RaramuriSans' size='8.5'>[{safe(entry.classification or 's/c')}]</font>",
            styles["entry"],
        ),
        Paragraph(f"<b>Español:</b> {safe(entry.translation_raw or 'Sin traducción consignada')}", styles["body"]),
    ]
    if len(entry.senses) > 1:
        story.append(Paragraph("<b>Acepciones:</b> " + " · ".join(f"{i + 1}. {safe(v)}" for i, v in enumerate(entry.senses)), styles["body"]))
    if entry.variants:
        story.append(Paragraph("<b>Variantes:</b> " + "; ".join(safe(v) for v in entry.variants), styles["label"]))
    if entry.examples:
        story.append(Paragraph("<b>Ejemplos y notas de uso:</b> " + " ".join(safe(v) for v in entry.examples), styles["body"]))
    elif entry.comments_raw and entry.comments_raw != entry.translation_raw:
        story.append(Paragraph("<b>Nota de la fuente:</b> " + safe(entry.comments_raw), styles["body"]))
    source = f"{entry.source_code}; {entry.source_document}, p. {page_label(entry)}; {entry.status}; {entry.record_id}"
    story.append(Paragraph("<b>Procedencia:</b> " + safe(source), styles["small"]))
    return story


def cover_story(metadata: dict, entry_count: int, scope_label: str, styles) -> list:
    return [
        Spacer(1, 28 * mm),
        Paragraph("Rarámuri Digital", styles["cover_title"]),
        Paragraph("Edición lexicográfica rarámuri-español para consulta, impresión y lectura sin conexión", styles["cover_subtitle"]),
        Paragraph(f"<b>{safe(scope_label)}</b><br/>{entry_count:,} entradas", styles["cover_meta"]),
        Spacer(1, 9 * mm),
        Paragraph(
            f"Versión de datos {safe(str(metadata['dataset_version']))} · Plataforma {safe(str(metadata['platform_version']))}<br/>"
            f"DOI: {safe(str(metadata['doi']))}<br/>"
            f"Responsable: {RESPONSIBLE}<br/>"
            f"Instituciones: {PUBLISHERS}",
            styles["cover_meta"],
        ),
        Paragraph(
            f"<b>Estado de publicación:</b> {safe(str(metadata['publication_status']))}.<br/>"
            f"<b>Estado lingüístico:</b> {safe(str(metadata['validation_status']))}.<br/>"
            "Este PDF es una exportación derivada. La base maestra estructurada del repositorio es la fuente de verdad y debe usarse para correcciones, análisis y reutilización computacional.",
            styles["notice"],
        ),
        Paragraph(
            f"Datos y documentación: {LICENSE_ID}. Código fuente: MIT. "
            "Los facsímiles, textos fuente, logotipos y materiales de terceros conservan sus propios derechos. "
            "La disponibilidad de los datos no sustituye la autoridad lingüística, cultural o política de las comunidades y personas hablantes rarámuri.",
            styles["small"],
        ),
        PageBreak(),
    ]


def make_page_callback(metadata: dict, font: str):
    footer_text = f"Rarámuri Digital · datos {metadata['dataset_version']} · DOI {metadata['doi']} · {metadata['validation_status']}"

    def draw_page(canvas_obj, doc):
        canvas_obj.saveState()
        canvas_obj.setFont(font, 7)
        canvas_obj.setFillColor(colors.HexColor("#556A64"))
        width, _ = LETTER
        canvas_obj.drawString(doc.leftMargin, 11 * mm, footer_text[:125])
        canvas_obj.drawRightString(width - doc.rightMargin, 11 * mm, f"p. {doc.page}")
        canvas_obj.setStrokeColor(colors.HexColor("#C8D4D0"))
        canvas_obj.setLineWidth(0.4)
        canvas_obj.line(doc.leftMargin, 14 * mm, width - doc.rightMargin, 14 * mm)
        canvas_obj.restoreState()

    return draw_page


def write_pdf(path: Path, entries: Sequence[Entry], metadata: dict, scope_label: str, styles, font: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    doc = BaseDocTemplate(
        str(path), pagesize=LETTER,
        leftMargin=17 * mm, rightMargin=17 * mm, topMargin=17 * mm, bottomMargin=20 * mm,
        title=f"Rarámuri Digital - {scope_label}", author=RESPONSIBLE,
        subject="Exportación lexicográfica reproducible rarámuri-español",
        keywords="Rarámuri, Tarahumara, lexicografía, humanidades digitales",
    )
    frame = Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height, id="normal")
    doc.addPageTemplates([PageTemplate(id="lexicon", frames=[frame], onPage=make_page_callback(metadata, font))])

    grouped: dict[str, list[Entry]] = {}
    for entry in entries:
        grouped.setdefault(alphabet_group(entry), []).append(entry)

    story = cover_story(metadata, len(entries), scope_label, styles)
    for group_index, group in enumerate(sorted(grouped, key=lambda item: (item == "OTROS", item))):
        if group_index:
            story.append(PageBreak())
        story.append(Paragraph(group, styles["section"]))
        story.append(Paragraph(f"{len(grouped[group]):,} entradas en esta sección", styles["label"]))
        for entry in grouped[group]:
            story.extend(entry_story(entry, styles))
    doc.build(story, canvasmaker=DeterministicCanvas)


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def deterministic_zip(zip_path: Path, files: Iterable[Path], root: Path) -> None:
    with zipfile.ZipFile(zip_path, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=9) as archive:
        for path in sorted(files, key=lambda item: item.name):
            info = zipfile.ZipInfo(str(path.relative_to(root)), date_time=(1980, 1, 1, 0, 0, 0))
            info.compress_type = zipfile.ZIP_DEFLATED
            info.external_attr = 0o100644 << 16
            archive.writestr(info, path.read_bytes())


def build_exports(entries: list[Entry], metadata: dict, output: Path, alphabetical: bool) -> dict:
    font, font_bold = register_fonts()
    styles = build_styles(font, font_bold)
    output.mkdir(parents=True, exist_ok=True)

    generated_files: list[dict] = []
    complete = output / "raramuri-lexico-completo.pdf"
    write_pdf(complete, entries, metadata, "Edición completa", styles, font)
    generated_files.append({"label": "Edición completa", "file": complete.name, "entries": len(entries), "scope": "complete"})

    alphabet_files: list[Path] = []
    if alphabetical:
        groups: dict[str, list[Entry]] = {}
        for entry in entries:
            groups.setdefault(alphabet_group(entry), []).append(entry)
        for group in sorted(groups, key=lambda item: (item == "OTROS", item)):
            slug = group.lower() if group != "OTROS" else "otros"
            path = output / f"raramuri-lexico-{slug}.pdf"
            write_pdf(path, groups[group], metadata, f"Sección alfabética {group}", styles, font)
            alphabet_files.append(path)
            generated_files.append({"label": f"Sección {group}", "file": path.name, "entries": len(groups[group]), "scope": "alphabetical", "group": group})
        zip_path = output / "raramuri-lexico-alfabetico.zip"
        deterministic_zip(zip_path, alphabet_files, output)
        generated_files.append({"label": "Secciones alfabéticas (ZIP)", "file": zip_path.name, "entries": len(entries), "scope": "bundle"})

    for item in generated_files:
        path = output / item["file"]
        item["bytes"] = path.stat().st_size
        item["sha256"] = sha256(path)
        item["media_type"] = "application/zip" if path.suffix == ".zip" else "application/pdf"

    manifest = {
        "dataset": "Rarámuri Digital: conjunto de datos lexicográficos rarámuri-español",
        "dataset_version": metadata["dataset_version"],
        "platform_version": metadata["platform_version"],
        "generated": metadata["release_date"],
        "entry_count": len(entries),
        "publication_status": metadata["publication_status"],
        "validation_status": metadata["validation_status"],
        "license": {"id": LICENSE_ID, "url": LICENSE_URL},
        "source": "data/lexicon-master.csv",
        "files": generated_files,
    }
    manifest_path = output / "manifest-pdf.json"
    manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return manifest


def parse_args(argv: Sequence[str]) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source", type=Path, default=DEFAULT_SOURCE)
    parser.add_argument("--metadata", type=Path, default=DEFAULT_METADATA)
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)
    parser.add_argument("--max-entries", type=int, default=None, help="CI smoke-test limit; do not use for publication")
    parser.add_argument("--no-alphabetical", action="store_true", help="Generate only the complete PDF")
    return parser.parse_args(argv)


def main(argv: Sequence[str] | None = None) -> int:
    args = parse_args(argv or sys.argv[1:])
    metadata = json.loads(args.metadata.read_text(encoding="utf-8"))
    required_metadata = {"dataset_version", "platform_version", "release_date", "publication_status", "validation_status", "doi"}
    missing = required_metadata.difference(metadata)
    if missing:
        raise ValueError(f"Missing metadata keys: {', '.join(sorted(missing))}")
    entries = read_entries(args.source)
    if args.max_entries is not None:
        if args.max_entries < 1:
            raise ValueError("--max-entries must be positive")
        entries = entries[: args.max_entries]
    manifest = build_exports(entries, metadata, args.output, alphabetical=not args.no_alphabetical)
    print(json.dumps(manifest, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
