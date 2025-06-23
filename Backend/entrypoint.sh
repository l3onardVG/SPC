#!/bin/bash

# Script de entrada para ejecutar migraciones y luego iniciar la aplicación
set -e

echo "Iniciando aplicación SPC..."

# Verificar que dotnet-ef esté disponible
echo "Verificando herramientas de Entity Framework..."
dotnet ef --version

# Cambiar al directorio de desarrollo para ejecutar migraciones
cd /src/SPC.API

# Esperar a que la base de datos esté disponible y ejecutar migraciones como root
echo "Esperando a que la base de datos esté disponible..."
until dotnet ef database update; do
    echo "Base de datos no disponible, esperando..."
    sleep 2
done

echo "Migraciones completadas exitosamente!"

# Cambiar al directorio de la aplicación compilada
cd /app

# Cambiar al usuario appuser para ejecutar la aplicación
echo "Cambiando al usuario appuser..."
#exec su appuser -c "dotnet SPC.API.dll"
exec su appuser -c "dotnet watch" 