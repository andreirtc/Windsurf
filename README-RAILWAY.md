# Windsurf deployment notes

This pack prepares the Flask application for deployment on Railway with a
Railway PostgreSQL service.

## Files

- `app.py` — secure replacement for the existing application entry point.
- `requirements.txt` — adds PostgreSQL and local environment support.
- `.gitignore` — prevents secrets, local databases, caches, and virtual
  environments from being committed.
- `Procfile` — optional process declaration. Railway can also use the start
  command in the dashboard.
- `.env.example` — safe local configuration template; do not commit a real `.env`.

## Local test

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

cp .env.example .env
# Edit .env with a random SECRET_KEY and a new ADMIN_PASSWORD.
python app.py
```

Open http://127.0.0.1:5001 .

## Railway environment variables

Add these to the web service:

- `DATABASE_URL` — reference the PostgreSQL service `DATABASE_URL`.
- `SECRET_KEY` — generate a long random value.
- `ADMIN_USERNAME` — e.g. `admin`.
- `ADMIN_PASSWORD` — a new unique password.

Use this Railway Start Command:

```text
gunicorn app:app --bind 0.0.0.0:$PORT --workers 1 --timeout 120
```

Do not enable app sleeping / serverless mode if the portfolio needs a fast
first visit. Keep an eye on Railway usage costs.
