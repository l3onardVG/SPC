#!/bin/bash

# Script para ejecutar el seeding de datos
# Uso: ./seed-data.sh [all|authors|books]

echo "=== Script de Seeding de Datos ==="

# Verificar si el contenedor está ejecutándose
if ! docker ps | grep -q spc_api; then
    echo "Error: El contenedor spc_api no está ejecutándose"
    echo "Ejecuta: docker-compose up -d"
    exit 1
fi

# Función para ejecutar seeding
run_seeding() {
    local endpoint=$1
    local description=$2
    
    echo "Ejecutando seeding de $description..."
    
    # Obtener token de admin (asumiendo que existe un usuario admin)
    echo "Obteniendo token de autenticación..."
    
    # Ejecutar el seeding
    response=$(docker exec spc_api curl -s -X POST \
        -H "Content-Type: application/json" \
        "http://localhost:5197/api/seed/$endpoint")
    
    if [ $? -eq 0 ]; then
        echo "✅ Seeding de $description completado exitosamente"
        echo "Respuesta: $response"
    else
        echo "❌ Error durante el seeding de $description"
        echo "Respuesta: $response"
    fi
}

# Procesar argumentos
case "${1:-all}" in
    "all")
        run_seeding "all" "todos los datos"
        ;;
    "authors")
        run_seeding "authors" "autores"
        ;;
    "books")
        run_seeding "books" "libros"
        ;;
    *)
        echo "Uso: $0 [all|authors|books]"
        echo "  all     - Ejecutar seeding de autores y libros"
        echo "  authors - Ejecutar solo seeding de autores"
        echo "  books   - Ejecutar solo seeding de libros"
        exit 1
        ;;
esac

echo "=== Fin del script ===" 