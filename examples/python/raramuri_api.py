"""Minimal standard-library client for the public Rarámuri Digital API."""

from __future__ import annotations

import json
from urllib.parse import urlencode
from urllib.request import urlopen

BASE_URL = "https://raramuri.ceees.mx/api/lexicon"


def query(**params):
    """Return the decoded JSON response for supported API query parameters."""
    url = f"{BASE_URL}?{urlencode(params)}" if params else BASE_URL
    with urlopen(url, timeout=30) as response:
        return json.load(response)


def search(text: str, limit: int = 5):
    """Search headwords, translations, classifications and comments."""
    return query(q=text, limit=limit)


def entry(record_id: str):
    """Retrieve an exact persistent record identifier such as RD-000001."""
    return query(id=record_id, limit=1)


if __name__ == "__main__":
    result = search("agua", limit=5)
    for item in result.get("entries", []):
        print(item["recordId"], item["headword"], "—", item["translationRaw"])
