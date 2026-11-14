import os
from datetime import timedelta
from pathlib import Path

from django.core.exceptions import ImproperlyConfigured
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent
# Load variables from the project-root .env (one level above backend/)
load_dotenv(BASE_DIR.parent / ".env")
DEBUG = os.environ.get("DJANGO_DEBUG", "true").lower() == "true"
_DEV_SECRET_KEY = "development-only-change-me-use-a-long-random-key-in-production"
SECRET_KEY = os.environ.get("DJANGO_SECRET_KEY", _DEV_SECRET_KEY)
if not DEBUG and SECRET_KEY == _DEV_SECRET_KEY:
    # Never run in production with the public development key.
    raise ImproperlyConfigured("Set DJANGO_SECRET_KEY to a long random value when DJANGO_DEBUG is false.")
ALLOWED_HOSTS = [x for x in os.environ.get("DJANGO_ALLOWED_HOSTS", "localhost,127.0.0.1").split(",") if x]
if os.environ.get("RENDER_EXTERNAL_HOSTNAME"):
    # Render sets this automatically to the public host name of the service.
    ALLOWED_HOSTS.append(os.environ["RENDER_EXTERNAL_HOSTNAME"])

INSTALLED_APPS = [
    "django.contrib.admin", "django.contrib.auth", "django.contrib.contenttypes",
    "django.contrib.sessions", "django.contrib.messages", "django.contrib.staticfiles",
    "corsheaders", "rest_framework", "rest_framework_simplejwt.token_blacklist",
    "django_filters", "drf_spectacular", "accounts", "properties",
]
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "corsheaders.middleware.CorsMiddleware", "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware", "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware", "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]
if not DEBUG:
    MIDDLEWARE.insert(1, "whitenoise.middleware.WhiteNoiseMiddleware")
ROOT_URLCONF = "config.urls"
TEMPLATES = [{"BACKEND": "django.template.backends.django.DjangoTemplates", "DIRS": [], "APP_DIRS": True, "OPTIONS": {"context_processors": [
    "django.template.context_processors.request", "django.contrib.auth.context_processors.auth",
    "django.contrib.messages.context_processors.messages",
]}}]
WSGI_APPLICATION = "config.wsgi.application"

if os.environ.get("DATABASE_URL"):
    from urllib.parse import urlparse
    db = urlparse(os.environ["DATABASE_URL"])
    DATABASES = {"default": {"ENGINE": "django.db.backends.postgresql", "NAME": db.path[1:], "USER": db.username, "PASSWORD": db.password, "HOST": db.hostname, "PORT": db.port or 5432, "CONN_MAX_AGE": 60, "OPTIONS": {"sslmode": os.environ.get("DB_SSLMODE", "require")}}}
else:
    DATABASES = {"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": BASE_DIR / "db.sqlite3"}}

AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]
LANGUAGE_CODE = "en-gb"
TIME_ZONE = "Africa/Lagos"
USE_I18N = True
USE_TZ = True
STATIC_URL = "static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
MEDIA_URL = "media/"
MEDIA_ROOT = BASE_DIR / "media"
if os.environ.get("CLOUDINARY_URL"):
    # Uploaded photos live on Cloudinary so they survive redeploys (see config/storage.py).
    STORAGES = {
        "default": {"BACKEND": "config.storage.CloudinaryMediaStorage"},
        "staticfiles": {"BACKEND": "django.contrib.staticfiles.storage.StaticFilesStorage"},
    }
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
AUTH_USER_MODEL = "accounts.User"
CORS_ALLOWED_ORIGINS = [x for x in os.environ.get("CORS_ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:8443").split(",") if x]
CSRF_TRUSTED_ORIGINS = [x for x in os.environ.get("CSRF_TRUSTED_ORIGINS", "").split(",") if x]
FILE_UPLOAD_MAX_MEMORY_SIZE = 8 * 1024 * 1024
DATA_UPLOAD_MAX_MEMORY_SIZE = 10 * 1024 * 1024
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": ["rest_framework_simplejwt.authentication.JWTAuthentication"],
    "DEFAULT_PERMISSION_CLASSES": ["rest_framework.permissions.IsAuthenticatedOrReadOnly"],
    "DEFAULT_FILTER_BACKENDS": ["django_filters.rest_framework.DjangoFilterBackend", "rest_framework.filters.SearchFilter", "rest_framework.filters.OrderingFilter"],
    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 12,
}
SIMPLE_JWT = {"ACCESS_TOKEN_LIFETIME": timedelta(minutes=15), "REFRESH_TOKEN_LIFETIME": timedelta(days=7), "ROTATE_REFRESH_TOKENS": True, "BLACKLIST_AFTER_ROTATION": True}
SPECTACULAR_SETTINGS = {"TITLE": "Hexagon Homes API", "DESCRIPTION": "Secure property management API", "VERSION": "1.0.0", "SERVE_INCLUDE_SCHEMA": False}

if not DEBUG:
    # Render terminates HTTPS at its proxy; without this the redirect below loops forever.
    SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
    SECURE_SSL_REDIRECT = os.environ.get("SECURE_SSL_REDIRECT", "true").lower() == "true"
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SECURE_HSTS_SECONDS = 31536000
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_CONTENT_TYPE_NOSNIFF = True
    X_FRAME_OPTIONS = "DENY"
