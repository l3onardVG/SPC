# Proceso de Seeding de Datos

Este documento describe el proceso de carga de datos desde el archivo `DB.json` a la base de datos PostgreSQL.

## Arquitectura del Sistema de Seeding

### 1. Archivos de Datos

- **`DB.json`**: Contiene los datos de autores y libros en formato JSON
- **`AuthorBookMapping.json`**: Configuración de mapeo entre IDs ficticios del JSON y autores reales

### 2. Componentes del Sistema

#### DTOs (Data Transfer Objects)
- `SeedDataDto`: Estructura principal del JSON de datos
- `AuthorSeedDto`: Datos de autores del JSON
- `BookSeedDto`: Datos de libros del JSON
- `AuthorBookMappingConfigDto`: Configuración de mapeo
- `AuthorMappingDto`: Mapeo individual de autor
- `BookAuthorMappingDto`: Mapeo individual de libro-autor

#### Servicios
- `ISeedService`: Interfaz del servicio de seeding
- `SeedService`: Implementación del servicio de seeding

#### Controladores
- `SeedController`: Endpoints para ejecutar seeding manualmente

## Proceso de Mapeo de Autores

### Problema Original
Los `AuthorId` en el JSON son ficticios (1, 2, 3, etc.) y no corresponden a IDs reales de la base de datos.

### Solución Implementada
1. **Mapeo Explícito**: Se crea un archivo de configuración que define qué `AuthorId` del JSON corresponde a qué autor real
2. **Validación por Nombre**: Se usa el nombre y apellido del autor para verificar la correspondencia
3. **Logging Detallado**: Se registra cada mapeo para auditoría

### Estructura del Mapeo
```json
{
  "authorMappings": [
    {
      "jsonAuthorId": 1,
      "authorName": "Tita",
      "authorSurname": "Maya",
      "description": "Tita Maya - Fundadora de Secretos para contar"
    }
  ]
}
```

## Flujo de Seeding

### 1. Seeding Automático (Al Iniciar la Aplicación)
```csharp
// En Program.cs
async void PopulateDB(WebApplication app)
{
    // ... código existente ...
    
    // Seed de datos desde JSON
    var seedService = scope.ServiceProvider.GetRequiredService<ISeedService>();
    await seedService.SeedDataFromJsonAsync();
}
```

### 2. Seeding Manual
```bash
# Ejecutar seeding completo
curl -X POST http://localhost:5197/api/seed/all

# Ejecutar solo seeding de autores
curl -X POST http://localhost:5197/api/seed/authors

# Ejecutar solo seeding de libros
curl -X POST http://localhost:5197/api/seed/books
```

## Scripts de Utilidad

### 1. `seed-data.sh`
Script para ejecutar seeding manualmente:
```bash
./seed-data.sh [all|authors|books]
```

### 2. `test-seeding.sh`
Script para verificar que el seeding funcionó correctamente:
```bash
./test-seeding.sh
```

## Validaciones y Logging

### Validaciones Implementadas
1. **Verificación de Datos Existentes**: No se ejecuta seeding si ya hay datos
2. **Validación de Mapeo**: Se verifica que los `AuthorId` del JSON coincidan con la configuración
3. **Verificación de Autores**: Se valida que los autores existan en el JSON antes de mapear

### Logging Detallado
- Información de cada autor agregado con su mapeo
- Advertencias para libros sin mapeo de autor
- Errores de validación en el mapeo
- Estadísticas de seeding completado

## Configuración en Docker

### Archivos Copiados al Contenedor
- `DB.json` → `/app/DB.json`
- `AuthorBookMapping.json` → `/app/AuthorBookMapping.json`

### Rutas de Búsqueda
El servicio busca los archivos en múltiples rutas:
1. `/app/DB.json` (contenedor Docker)
2. `./DB.json` (ruta local)
3. `../../../../DB/DB.json` (ruta relativa)
4. `../DB/DB.json` (ruta alternativa)

## Ejemplo de Uso

### 1. Configurar el Mapeo
Editar `AuthorBookMapping.json` para definir las relaciones:
```json
{
  "authorMappings": [
    {
      "jsonAuthorId": 1,
      "authorName": "Tita",
      "authorSurname": "Maya"
    }
  ],
  "bookAuthorMappings": [
    {
      "bookName": "Cuentos y pasatiempos",
      "jsonAuthorId": 1,
      "expectedAuthor": "Tita Maya"
    }
  ]
}
```

### 2. Ejecutar Seeding
```bash
# Reconstruir y ejecutar contenedores
docker-compose down
docker-compose up --build -d

# Verificar logs
docker logs spc_api

# Probar seeding manual
./Backend/seed-data.sh all
```

### 3. Verificar Resultados
```bash
# Verificar autores
curl http://localhost:5197/api/Author

# Verificar libros
curl http://localhost:5197/api/Book

# Ejecutar script de prueba
./Backend/test-seeding.sh
```

## Troubleshooting

### Problemas Comunes

1. **Archivo JSON no encontrado**
   - Verificar que `DB.json` esté en la carpeta `DB/`
   - Verificar que se copie correctamente al contenedor

2. **Errores de mapeo**
   - Verificar que los nombres en `AuthorBookMapping.json` coincidan exactamente con los del `DB.json`
   - Revisar logs para ver qué autores no se encontraron

3. **Seeding no se ejecuta**
   - Verificar que no haya datos existentes en la base de datos
   - Revisar logs del contenedor para errores

### Logs Útiles
```bash
# Ver logs del contenedor
docker logs spc_api

# Ver logs en tiempo real
docker logs -f spc_api

# Ver logs específicos de seeding
docker logs spc_api | grep -i seed
```

## Mantenimiento

### Agregar Nuevos Autores
1. Agregar el autor al `DB.json`
2. Agregar el mapeo correspondiente en `AuthorBookMapping.json`
3. Ejecutar seeding

### Agregar Nuevos Libros
1. Agregar el libro al `DB.json` con el `AuthorId` correcto
2. Agregar el mapeo correspondiente en `AuthorBookMapping.json`
3. Ejecutar seeding

### Modificar Mapeos Existentes
1. Editar `AuthorBookMapping.json`
2. Limpiar la base de datos si es necesario
3. Ejecutar seeding nuevamente 