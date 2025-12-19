# Desktop apps

This folder hosts the desktop stack. The Python pipeline lives under `apps/desktop/python-blogger`.

## Python apps

Apps:
- `apps/desktop/python-blogger/creator-app`
- `apps/desktop/python-blogger/translator-app`
- `apps/desktop/python-blogger/distribution-prompt-builder`

Shared schema:
- `<repo_root>/schemas/content_package.schema.json`

Storage (per app, inside its root):
- Outputs: `outputs/`
- Drafts/data: `data/`
- Logs: `logs/errors.log`

All apps resolve paths from their own `src/` location (no CWD dependency).

## Run from the monorepo root

Linux/macOS:
```bash
python apps/desktop/python-blogger/creator-app/src/main.py
python apps/desktop/python-blogger/translator-app/src/main.py
python apps/desktop/python-blogger/distribution-prompt-builder/src/main.py
```

Windows (PowerShell):
```powershell
python apps/desktop/python-blogger/creator-app/src/main.py
python apps/desktop/python-blogger/translator-app/src/main.py
python apps/desktop/python-blogger/distribution-prompt-builder/src/main.py
```

Dependencies must be installed per app (see app README files).
