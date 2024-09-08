#!/bin/bash

#
#   Wipe all Django databases (prod and test) and zap migrations and cache, excluding
#   the cookiecutter-django specific ones
#

# zap migration files (excluding /contrib/sites/migrations and /users/migrations)
echo "ZAP MIGRATIONS AND CACHE"
find . -path "*/migrations/*.py" -not -name "__init__.py" \
    ! -path "*/contrib/sites/migrations/*" \
    ! -path "*/users/migrations/*" -delete
find . -path "*/migrations/*.pyc" \
    ! -path "*/contrib/sites/migrations/*" \
    ! -path "*/users/migrations/*" -delete
# cache
find . -name "__pycache__" -type d -exec rm -r {} +
find . -name "*.pyc" -exec rm -f {} +

# reset test & main db
echo "RESET DBs"
python manage.py reset_db --noinput

# make & apply migrations
echo "MAKE AND APPLY MIGRATIONS"
python manage.py makemigrations
python manage.py migrate

# apply to test db
echo "FORCE MIGRATE TEST DB"
export DJANGO_SETTINGS_MODULE=config.settings.test
python manage.py migrate --settings=config.settings.test

# debug test db migrations
# echo "TEST DB MIGRATION STATE"
# python manage.py showmigrations --settings=config.settings.test