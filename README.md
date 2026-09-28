# UniAdmit - Render-ready Full-Stack College Admissions System

This package contains the Django REST API and React/Vite frontend configured to run together as **one Render web service**.

## Production routes

- `/` - React frontend
- `/colleges` - React frontend route
- `/apply` - React frontend route
- `/track` - React frontend route
- `/admin/` - Django admin
- `/api/` - Django REST API root
- `/api/colleges/` - College API
- `/api/courses/` - Course API
- `/api/applications/` - Application API
- `/static/` - Django/WhiteNoise static assets

## Deploy with Render Blueprint

The repository root contains `render.yaml`. In Render, create a Blueprint from this project. The Blueprint configures:

1. A Python web service.
2. A PostgreSQL database.
3. A generated Django `SECRET_KEY`.
4. A production build that installs Python/Node dependencies, builds React, and collects static files.
5. A start command that runs migrations, safely seeds an empty database, and starts Gunicorn.

If you are updating an **existing Render service** instead of creating a Blueprint, use these commands:

**Build command**

```bash
pip install -r backend/requirements.txt && cd frontend && npm ci && npm run build && cd ../backend && python manage.py collectstatic --noinput
```

**Start command**

```bash
cd backend && python manage.py migrate && python manage.py seed_data && gunicorn backend.wsgi:application --bind 0.0.0.0:$PORT --workers 2 --timeout 120
```

Set these environment variables in Render:

```text
SECRET_KEY=<generate-a-new-secret>
DEBUG=False
ALLOWED_HOSTS=.onrender.com,localhost,127.0.0.1
DATABASE_URL=<your Render PostgreSQL connection string>
```

`RENDER_EXTERNAL_URL`, when provided by Render, is automatically added to Django's CSRF trusted origins.

## Local development

### Backend

```bash
cd backend
python -m venv .venv
# Windows: .venv\\Scripts\\activate
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_data
python manage.py runserver
```

### Frontend

```bash
cd frontend
npm ci
npm run dev
```

The Vite development server proxies `/api` to Django on `127.0.0.1:8000`.

## Database

The project supports PostgreSQL through `DATABASE_URL`. SQLite remains available as a local fallback when `DATABASE_URL` is not set. The included `backend/db.sqlite3` is the original local database and is retained for local use; Render should use PostgreSQL for persistent production data.

The seed command is deployment-safe: it seeds the sample data only when the database has no colleges, so normal service restarts do not erase existing production records.

## Important security note

The original development `.env` file and virtual environment were removed from this deployment package. Do not put production secrets in the ZIP or source repository. Configure secrets in Render environment variables.
