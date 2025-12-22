# PostgreSQL Setup Guide for Compayre Backend

This guide walks you through setting up a local PostgreSQL database for Compayre development.

## Prerequisites

- **Docker Desktop**: Required for running PostgreSQL in a container
  - Download: https://www.docker.com/products/docker-desktop/
  - Ensure Docker daemon is running before proceeding

## Quick Setup (Recommended)

### Windows PowerShell

Run the automated setup script:

```powershell
cd backend
.\scripts\setup-db.ps1
```

This script will:
1. Verify Docker is installed and running
2. Start PostgreSQL container
3. Initialize the database
4. Start PgAdmin for database management
5. Display connection details

---

## Manual Setup

### Step 1: Copy Environment Variables

```powershell
cd backend
Copy-Item .env.local -Destination .env
```

### Step 2: Start PostgreSQL Container

```powershell
docker-compose up -d
```

Wait for PostgreSQL to be ready (check logs):
```powershell
docker-compose logs postgres
```

You should see: `"database system is ready to accept connections"`

### Step 3: Verify Connection

```powershell
docker exec -it compayre_postgres psql -U compayre_user -d compayre_db -c "\dt"
```

---

## Django Setup

Once PostgreSQL is running:

### Step 1: Install Python Dependencies

```powershell
# Create virtual environment (if not already done)
python -m venv venv
.\venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt
```

### Step 2: Apply Migrations

```powershell
python manage.py migrate
```

This creates all database tables defined in your models.

### Step 3: Create Superuser

```powershell
python manage.py createsuperuser
```

Follow the prompts to create an admin account.

### Step 4: Load Initial Data (Optional)

```powershell
python manage.py loaddata initial_data.json
```

### Step 5: Start Django Development Server

```powershell
python manage.py runserver
```

Django will be available at: `http://localhost:8000`

---

## Database Management

### Access PgAdmin

- **URL**: http://localhost:5050
- **Email**: admin@compayre.local
- **Password**: admin

### Connect to PostgreSQL Directly

```powershell
# Using psql in the container
docker exec -it compayre_postgres psql -U compayre_user -d compayre_db

# Common commands:
# \dt              - List all tables
# \du              - List all users/roles
# \db              - List databases
# \q               - Quit psql
```

### Backup Database

```powershell
$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
docker exec compayre_postgres pg_dump -U compayre_user compayre_db | Out-File "backup_$timestamp.sql"
```

### Restore Database

```powershell
Get-Content backup_2024-12-04_10-30-45.sql | docker exec -i compayre_postgres psql -U compayre_user -d compayre_db
```

### Reset Database (Destructive)

```powershell
# Stop containers
docker-compose down -v

# Remove volume data
docker volume rm compayre_postgres

# Restart fresh
docker-compose up -d
```

---

## Environment Variables

### Development (.env.local)

```env
SECRET_KEY=django-insecure-dev-key-not-for-production
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1,127.0.0.1:8000,localhost:8000

# PostgreSQL
DB_ENGINE=django.db.backends.postgresql
DB_NAME=compayre_db
DB_USER=compayre_user
DB_PASSWORD=compayre_password
DB_HOST=localhost
DB_PORT=5432

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000,http://localhost:8000
```

### Production (.env)

**⚠️ Security Note**: Never commit `.env` to version control

```env
SECRET_KEY=<use-a-secure-random-key>
DEBUG=False
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com

DB_ENGINE=django.db.backends.postgresql
DB_NAME=compayre_db_prod
DB_USER=<secure-username>
DB_PASSWORD=<secure-password>
DB_HOST=<rds-endpoint-or-managed-postgres>
DB_PORT=5432

CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

---

## Troubleshooting

### PostgreSQL Connection Refused

```powershell
# Check if container is running
docker ps

# Check PostgreSQL logs
docker-compose logs postgres

# Restart PostgreSQL
docker-compose restart postgres
```

### Port Already in Use

If port 5432 is already in use, modify `docker-compose.yml`:

```yaml
ports:
  - "5433:5432"  # Changed from 5432 to 5433
```

Then update `.env`:
```env
DB_PORT=5433
```

### Migration Errors

```powershell
# Check migration status
python manage.py showmigrations

# Roll back a migration
python manage.py migrate api 0001  # Specify migration number

# Create new migration (if models changed)
python manage.py makemigrations
python manage.py migrate
```

### Django Can't Connect to Database

1. Ensure PostgreSQL container is running: `docker ps`
2. Verify environment variables in `.env`
3. Test connection: `python manage.py dbshell`
4. Check Django logs for detailed errors

---

## Database Schema

Current models in `api/models.py`:

- **CustomUser**: Extended user model with subscription tiers
  - Fields: username, email, subscription_type, is_staff, created_at, updated_at
  - Choices: free, basic, advanced

Future models to add:
- **UserCompany**: Link users to companies
- **Report**: Store generated reports
- **DataUpload**: Track Excel file uploads
- **PayData**: Store pay information
- **TransparencyIndex**: Calculated metrics

---

## Performance Tuning

For development, current settings are fine. For production:

### 1. Create Indexes

```sql
CREATE INDEX idx_user_subscription ON api_customuser(subscription_type);
CREATE INDEX idx_user_email ON api_customuser(email);
CREATE INDEX idx_created_at ON api_customuser(created_at);
```

### 2. Enable Connection Pooling

Use PgBouncer or Django's connection pooling:

```python
DATABASES['default']['CONN_MAX_AGE'] = 600  # Already in settings
```

### 3. Enable Query Logging

```python
LOGGING = {
    'version': 1,
    'handlers': {
        'console': {'class': 'logging.StreamHandler'},
    },
    'loggers': {
        'django.db.backends': {
            'handlers': ['console'],
            'level': 'DEBUG',
        },
    },
}
```

---

## Next Steps

1. ✅ PostgreSQL running locally
2. ✅ Django connected to PostgreSQL
3. ⬜ Set up Next.js frontend connection
4. ⬜ Implement API authentication endpoints
5. ⬜ Create data models for reports/uploads
6. ⬜ Build CSV/Excel ingestion pipeline

See `API_SETUP.md` for authentication and API endpoint details.
