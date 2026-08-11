# Python reuse example

This directory shows the smallest useful path from the public Rarámuri Digital API to a Python workflow. `raramuri_api.py` uses only the standard library, so it can be copied into a notebook or research script without installing a project-specific package.

```bash
python examples/python/raramuri_api.py
```

```python
from examples.python.raramuri_api import entry, search

results = search("agua", limit=5)
record = entry("RD-000001")
```

The public API remains the source of truth. Reusers should preserve persistent record IDs, provenance, attribution, the dataset license and the explicit pending linguistic-validation status.
