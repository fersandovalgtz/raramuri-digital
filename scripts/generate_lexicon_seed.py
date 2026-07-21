#!/usr/bin/env python3
"""Append the complete extracted lexicon to the initial Drizzle migration."""

from __future__ import annotations

import argparse
import json
from pathlib import Path


SEED_MARKER = "-- LEXICON-SEED-BEGIN"
COLUMNS = [
    "record_id", "headword", "headword_raw", "headword_normalized",
    "homonym_number", "classification", "classification_family",
    "translation_raw", "senses_json", "examples_json", "variants_json",
    "comments_raw", "source_code", "source_document", "page_start",
    "page_end", "status",
]


def sql_value(value: object) -> str:
    if value is None:
        return "NULL"
    if isinstance(value, int):
        return str(value)
    return "'" + str(value).replace("'", "''") + "'"


def record_values(record: dict[str, object]) -> list[object]:
    return [
        record["record_id"], record["headword"], record["headword_raw"],
        record["headword_normalized"], record["homonym_number"],
        record["classification"], record["classification_family"],
        record["translation_raw"],
        json.dumps(record["senses"], ensure_ascii=False, separators=(",", ":")),
        json.dumps(record["examples"], ensure_ascii=False, separators=(",", ":")),
        json.dumps(record["variants"], ensure_ascii=False, separators=(",", ":")),
        record["comments_raw"], record["source_code"], record["source_document"],
        record["page_start"], record["page_end"], record["status"],
    ]


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("json", type=Path)
    parser.add_argument("migration", type=Path)
    parser.add_argument("--batch-size", type=int, default=100)
    args = parser.parse_args()

    records = json.loads(args.json.read_text(encoding="utf-8"))
    migration = args.migration.read_text(encoding="utf-8")
    if SEED_MARKER in migration:
        migration = migration.split(SEED_MARKER, 1)[0].rstrip() + "\n"

    chunks = [migration, f"\n{SEED_MARKER}\n"]
    quoted_columns = ", ".join(f"`{column}`" for column in COLUMNS)
    for offset in range(0, len(records), args.batch_size):
        batch = records[offset:offset + args.batch_size]
        rows = ["(" + ", ".join(sql_value(value) for value in record_values(record)) + ")" for record in batch]
        chunks.append(
            f"INSERT INTO `lexical_entries` ({quoted_columns}) VALUES\n"
            + ",\n".join(rows)
            + ";--> statement-breakpoint\n"
        )

    args.migration.write_text("".join(chunks), encoding="utf-8")
    print(f"Seeded {len(records)} records in {(len(records) + args.batch_size - 1) // args.batch_size} batches")


if __name__ == "__main__":
    main()
