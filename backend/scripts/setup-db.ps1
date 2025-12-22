# PowerShell script to set up local PostgreSQL database for Compayre

param(
    [string]$DBName = "compayre_db",
    [string]$DBUser = "compayre_user",
    [string]$DBPassword = "compayre_password",
    [string]$DBPort = "5432",
    [string]$DBHost = "localhost"
)

Write-Host "Compayre PostgreSQL Setup Script" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# Check if Docker is installed
Write-Host "Checking for Docker installation..." -ForegroundColor Yellow
$dockerCheck = Get-Command docker -ErrorAction SilentlyContinue
if (-not $dockerCheck) {
    Write-Host "Docker is not installed. Please install Docker Desktop and try again." -ForegroundColor Red
    exit 1
}

Write-Host "Docker found" -ForegroundColor Green
Write-Host ""

# Check if Docker daemon is running
Write-Host "Checking if Docker daemon is running..." -ForegroundColor Yellow
$dockerRunning = $false
try {
    docker ps > $null 2>&1
    $dockerRunning = $true
    Write-Host "Docker daemon is running" -ForegroundColor Green
}
catch {
    Write-Host "Docker daemon is not running. Please start Docker Desktop and try again." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Starting PostgreSQL container..." -ForegroundColor Yellow
Write-Host ""

# Start Docker Compose services
$env:DB_NAME = $DBName
$env:DB_USER = $DBUser
$env:DB_PASSWORD = $DBPassword
$env:DB_HOST = $DBHost
$env:DB_PORT = $DBPort

docker-compose -f docker-compose.yml down --remove-orphans 2>$null
docker-compose -f docker-compose.yml up -d

if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to start Docker Compose services" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Waiting for PostgreSQL to be ready..." -ForegroundColor Yellow
$retries = 0
$max_retries = 30
$ready = $false

while ($retries -lt $max_retries -and -not $ready) {
    try {
        $testResult = docker exec compayre_postgres pg_isready -U $DBUser -h localhost
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "PostgreSQL is ready" -ForegroundColor Green
            $ready = $true
            break
        }
    }
    catch {
        # Continue waiting
    }
    
    $retries++
    Start-Sleep -Seconds 1
    Write-Host "." -NoNewline
}

if (-not $ready) {
    Write-Host ""
    Write-Host "PostgreSQL failed to start within timeout period" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "PostgreSQL Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Database Details:" -ForegroundColor Cyan
Write-Host "  Host:     $DBHost"
Write-Host "  Port:     $DBPort"
Write-Host "  Database: $DBName"
Write-Host "  User:     $DBUser"
Write-Host "  Password: $DBPassword"
Write-Host ""
Write-Host "Services:" -ForegroundColor Cyan
Write-Host "  PostgreSQL: Running on port $DBPort"
Write-Host "  PgAdmin:    Accessible at http://localhost:5050"
Write-Host "              Email: admin@compayre.local"
Write-Host "              Password: admin"
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "  1. Copy .env.local to .env in the backend directory"
Write-Host "  2. Run: pip install -r requirements.txt"
Write-Host "  3. Run: python manage.py migrate"
Write-Host "  4. Run: python manage.py createsuperuser"
Write-Host "  5. Run: python manage.py runserver"
Write-Host ""
Write-Host "To stop the database:" -ForegroundColor Yellow
Write-Host "  docker-compose down"
Write-Host ""
Write-Host "To stop and remove all data:" -ForegroundColor Yellow
Write-Host "  docker-compose down -v"
Write-Host ""
