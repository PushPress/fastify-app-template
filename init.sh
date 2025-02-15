#!/bin/bash
set -e

# Create test database with same user as main database
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE DATABASE ${POSTGRES_DB}_test;
    GRANT ALL PRIVILEGES ON DATABASE ${POSTGRES_DB}_test TO $POSTGRES_USER;
EOSQL

# Set ownership and permissions for test database
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "${POSTGRES_DB}_test" <<-EOSQL
    ALTER SCHEMA public OWNER TO $POSTGRES_USER;
    GRANT ALL ON SCHEMA public TO $POSTGRES_USER;
EOSQL
