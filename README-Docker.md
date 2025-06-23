# 🐳 Docker Setup - Proyecto SPC

Este documento describe la configuración completa de Docker para el proyecto SPC, incluyendo el backend ASP.NET Core y la base de datos PostgreSQL.

## 📋 Tabla de Contenidos

- [Arquitectura](#arquitectura)
- [Servicios](#servicios)
- [Configuración](#configuración)
- [Uso](#uso)
- [Desarrollo](#desarrollo)
- [Troubleshooting](#troubleshooting)
- [Archivos de Configuración](#archivos-de-configuración)

## 🏗️ Arquitectura

### **Diseño Multi-Service**
```
┌─────────────────┐    ┌─────────────────┐
│   PostgreSQL    │    │  ASP.NET Core   │
│   Database      │    │      API        │
│   (Port 5432)   │◄──►│   (Port 5197)   │
└─────────────────┘    └─────────────────┘
```

### **Características**
- **Multi-stage build** para optimizar el tamaño de la imagen
- **Health checks** para la base de datos
- **Migraciones automáticas** al iniciar el contenedor
- **Seguridad** con usuario no-root para la aplicación
- **Networking** dedicado entre servicios

## 🚀 Servicios

### **1. PostgreSQL Database (`db`)**
- **Imagen**: `postgres:latest`
- **Puerto**: `5432:5432`
- **Variables de entorno**:
  - `POSTGRES_USER=secretos`
  - `POSTGRES_PASSWORD=secretos`
  - `POSTGRES_DB=spc`
- **Volumen**: `postgres_data` (datos persistentes)
- **Health check**: Verifica que PostgreSQL esté listo

### **2. ASP.NET Core API (`api`)**
- **Build**: Multi-stage desde `./Backend/Dockerfile`
- **Puerto**: `5197:5197`
- **Variables de entorno**:
  - `ASPNETCORE_ENVIRONMENT=Development`
  - `ASPNETCORE_URLS=http://+:5197`
  - `NIKOLA_DATABASE=Host=db;Port=5432;Database=spc;Username=secretos;Password=secretos`
- **Dependencias**: Espera a que `db` esté healthy

## ⚙️ Configuración

### **Variables de Entorno**
```bash
# Database
POSTGRES_USER=secretos
POSTGRES_PASSWORD=secretos
POSTGRES_DB=spc

# JWT
JWT_SECRET_KEY=your_secret_key_here
JWT_VALID_AUDIENCE=http://localhost:5197
JWT_VALID_ISSUER=http://localhost:5197

# Application
ASPNETCORE_ENVIRONMENT=Development
ASPNETCORE_URLS=http://+:5197
```

### **Redes**
- **`spc_network`**: Red bridge para comunicación entre servicios

### **Volúmenes**
- **`postgres_data`**: Datos persistentes de PostgreSQL

## 🚀 Uso

### **Inicio Rápido**
```bash
# Construir y ejecutar todos los servicios
docker-compose up --build

# Ejecutar en segundo plano
docker-compose up -d --build

# Ver logs
docker-compose logs -f api
```

### **Comandos Útiles**
```bash
# Ver estado de los servicios
docker-compose ps

# Detener servicios
docker-compose down

# Reconstruir solo la API
docker-compose build api

# Ver logs de un servicio específico
docker-compose logs -f db
docker-compose logs -f api

# Entrar al contenedor de la API
docker exec -it spc_api /bin/bash

# Entrar al contenedor de la base de datos
docker exec -it spc_postgres psql -U secretos -d spc
```

### **URLs de Acceso**
- **API Base**: `http://localhost:5197`
- **Swagger UI**: `http://localhost:5197/swagger`
- **OpenAPI JSON**: `http://localhost:5197/swagger/v1/swagger.json`
- **PostgreSQL**: `localhost:5432`

## 💻 Desarrollo

### **Flujo de Migraciones**
1. **Inicio del contenedor**: El script `entrypoint.sh` se ejecuta
2. **Verificación de herramientas**: Confirma que `dotnet-ef` esté disponible
3. **Espera de base de datos**: Health check hasta que PostgreSQL esté listo
4. **Ejecución de migraciones**: `dotnet ef database update`
5. **Inicio de aplicación**: Ejecuta la API como usuario `appuser`

### **Estructura de Archivos**
```
Backend/
├── Dockerfile              # Configuración de Docker
├── .dockerignore          # Archivos a ignorar
├── entrypoint.sh          # Script de inicio
└── SPC.API/
    ├── Program.cs          # Configuración de la aplicación
    └── ...

docker-compose.yml          # Orquestación de servicios
```

### **Seguridad**
- **Usuario no-root**: La aplicación se ejecuta como `appuser`
- **Migraciones como root**: Solo para acceder a herramientas de EF
- **Permisos mínimos**: Solo los necesarios para cada operación

## 🔧 Troubleshooting

### **Problemas Comunes**

#### **1. Puerto ya en uso**
```bash
# Verificar qué está usando el puerto
lsof -i :5197
lsof -i :5432

# Cambiar puertos en docker-compose.yml si es necesario
```

#### **2. Error de conexión a la base de datos**
```bash
# Verificar que PostgreSQL esté ejecutándose
docker-compose ps

# Ver logs de la base de datos
docker-compose logs db

# Verificar health check
docker-compose exec db pg_isready -U secretos -d spc
```

#### **3. Error de migraciones**
```bash
# Ver logs de migraciones
docker-compose logs api | grep -i migration

# Ejecutar migraciones manualmente
docker-compose exec api dotnet ef database update --project /src/SPC.API
```

#### **4. Problemas de permisos**
```bash
# Verificar permisos dentro del contenedor
docker-compose exec api ls -la /src/SPC.API/

# Reconstruir con --no-cache
docker-compose build --no-cache api
```

### **Logs Útiles**
```bash
# Ver todos los logs
docker-compose logs

# Ver logs en tiempo real
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs -f api
```

## 📁 Archivos de Configuración

### **docker-compose.yml**
```yaml
version: '3.8'
services:
  db:
    image: postgres:latest
    environment:
      POSTGRES_USER: secretos
      POSTGRES_PASSWORD: secretos
      POSTGRES_DB: spc
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U secretos -d spc"]
  
  api:
    build:
      context: ./Backend
      dockerfile: Dockerfile
    ports:
      - "5197:5197"
    depends_on:
      db:
        condition: service_healthy
```

### **Backend/Dockerfile**
```dockerfile
# Multi-stage build
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
# ... configuración de build

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS final
# ... configuración final con herramientas EF
```

### **Backend/entrypoint.sh**
```bash
#!/bin/bash
# Verificar herramientas EF
# Ejecutar migraciones
# Iniciar aplicación
```

**Última actualización**: $(date)
**Versión**: 1.0.0 