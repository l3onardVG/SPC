#!/bin/bash

# Script para probar el seeding de datos
echo "=== Script de Prueba de Seeding ==="

# Verificar si el contenedor está ejecutándose
if ! docker ps | grep -q spc_api; then
    echo "Error: El contenedor spc_api no está ejecutándose"
    echo "Ejecuta: docker-compose up -d"
    exit 1
fi

echo "1. Verificando logs del contenedor para ver el proceso de seeding..."
docker logs spc_api --tail 50

echo ""
echo "2. Verificando si los autores se cargaron correctamente..."
docker exec spc_api curl -s -X GET "http://localhost:5197/api/Author" | jq '.[] | {id: .id, name: .name, surname: .surname}' 2>/dev/null || echo "No se pudieron obtener los autores"

echo ""
echo "3. Verificando si los libros se cargaron correctamente..."
docker exec spc_api curl -s -X GET "http://localhost:5197/api/Book" | jq '.[] | {id: .id, name: .name, authorId: .authorId}' 2>/dev/null || echo "No se pudieron obtener los libros"

echo ""
echo "4. Verificando la relación entre autores y libros..."
docker exec spc_api curl -s -X GET "http://localhost:5197/api/Book" | jq '.[] | {bookName: .name, authorId: .authorId}' 2>/dev/null || echo "No se pudieron obtener las relaciones"

echo ""
echo "=== Fin de la prueba ===" 