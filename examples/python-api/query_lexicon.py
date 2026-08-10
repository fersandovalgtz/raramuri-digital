#!/usr/bin/env python3
"""Consulta mínima reproducible de la API pública de Rarámuri Digital."""

from __future__ import annotations

import argparse
import json
import sys
import urllib.error
import urllib.parse
import urllib.request

API_URL = "https://raramuri.ceees.mx/api/lexicon"


def query_lexicon(query: str, limit: int) -> dict:
    params = urllib.parse.urlencode({"q": query, "limit": limit})
    request = urllib.request.Request(
        f"{API_URL}?{params}",
        headers={"Accept": "application/json", "User-Agent": "raramuri-digital-example/1.0"},
    )
    with urllib.request.urlopen(request, timeout=20) as response:
        if response.status != 200:
            raise RuntimeError(f"HTTP {response.status}")
        return json.load(response)


def main() -> int:
    parser = argparse.ArgumentParser(description="Consulta la API lexicográfica de Rarámuri Digital")
    parser.add_argument("q", nargs="?", default="agua", help="Texto de búsqueda (por defecto: agua)")
    parser.add_argument("--limit", type=int, default=5, help="Número de resultados, entre 1 y 200")
    args = parser.parse_args()

    if not 1 <= args.limit <= 200:
        parser.error("--limit debe estar entre 1 y 200")

    try:
        payload = query_lexicon(args.q, args.limit)
    except (urllib.error.URLError, TimeoutError, RuntimeError, json.JSONDecodeError) as exc:
        print(f"Error al consultar la API: {exc}", file=sys.stderr)
        return 1

    entries = payload.get("entries", [])
    if not entries:
        print("No se encontraron resultados.")
        return 0

    for entry in entries:
        print(
            f"{entry.get('recordId', '')}\t"
            f"{entry.get('headword', '')}\t"
            f"{entry.get('translationRaw', '')}"
        )

    print(
        f"\nEstado: {payload.get('publicationStatus', '')}; "
        f"{payload.get('validationStatus', '')}",
        file=sys.stderr,
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
