#!/bin/sh
set -e

echo "Running database migrations..."
yarn prisma db push

echo "Seeding database..."
yarn seed || echo "Seed already done or skipped"

echo "Starting application..."
exec node dist/main
