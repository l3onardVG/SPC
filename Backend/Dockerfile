# Multi-stage build para optimizar el tamaño de la imagen final
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 5197

# Etapa de construcción
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copiar archivos de proyecto y restaurar dependencias
COPY ["SPC.API/SPC.API.csproj", "SPC.API/"]
COPY ["SPC.Business/SPC.Business.csproj", "SPC.Business/"]
COPY ["SPC.Data/SPC.Data.csproj", "SPC.Data/"]
RUN dotnet restore "SPC.API/SPC.API.csproj"

# Copiar el resto del código fuente
COPY . .
WORKDIR "/src/SPC.API"

# Construir la aplicación
RUN dotnet build "SPC.API.csproj" -c Release -o /app/build

# Etapa de publicación
FROM build AS publish
RUN dotnet publish "SPC.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Etapa final
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS final
WORKDIR /app

# Instalar herramientas de Entity Framework como root
RUN dotnet tool install --global dotnet-ef

# Crear usuario no-root para seguridad
RUN adduser --disabled-password --gecos '' appuser && chown -R appuser /app

# Copiar archivos publicados
COPY --from=publish /app/publish .

# Copiar todo el código fuente para las migraciones
COPY --from=build --chown=appuser:appuser /src /src

# Copiar archivo DB.json para seeding
COPY --from=build --chown=appuser:appuser /src/SPC.Data/Data/DB.json /app/DB.json

# Copiar archivo de mapeo de autores y libros
COPY --from=build --chown=appuser:appuser /src/SPC.Data/Data/AuthorBookMapping.json /app/AuthorBookMapping.json

# Copiar script de entrada
COPY --chown=root:root entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

# Crear directorio para uploads si no existe
RUN mkdir -p uploads && chown appuser:appuser uploads

# Configurar PATH para incluir dotnet tools
ENV PATH="/root/.dotnet/tools:${PATH}"

# Punto de entrada usando el script (se ejecuta como root)
ENTRYPOINT ["/app/entrypoint.sh"] 