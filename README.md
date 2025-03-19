# Proyecto_SPC

----

## Secretos para Contar

Este repositorio contiene el código fuente del Proyecto_SPC para la fundación Secretos para Contar, una plataforma web que facilita el acceso a libros y materiales digitales. Los usuarios pueden explorar audiocuentos, biografías en audio, videos y otros recursos interactivos para mejorar su experiencia de lectura.

### **Sitio Web**
[Secretos para Contar](https://secretosparacontar.org/)

----

## Equipo de Desarrollo
- **Jaime Andrés Vélez Rojas**
- **Leonard Villegas Guerra**
- **Lorena Quiceno Giraldo**
- **Marcela Molina Ordoñez**
- **Angie Arango Zapata**

----

## Lenguajes y Tecnologías Utilizadas

### Frontend
- **React** - Biblioteca para la creación de interfaces de usuario interactivas y dinámicas.
- **Remix** - Framework para el desarrollo de aplicaciones web rápidas y optimizadas.


### Backend
- **.NET 9** - Framework para el desarrollo de aplicaciones escalables y seguras.
- **C#** - Lenguaje de programación utilizado para la lógica del servidor.


### Herramientas de Desarrollo
- **GitHub** - Plataforma para la gestión de versiones y colaboración en el código.
- **GitHub Projects** - Herramienta para la planificación y seguimiento del desarrollo del proyecto.
- **Visual Studio Code (VSC)** - Editor de código ligero y potente con soporte para múltiples extensiones.

----

## 🚀 Cómo levantar el proyecto

📌 Prerrequisitos
Antes de comenzar, asegúrate de tener instalado lo siguiente en tu sistema:

* Git
* Docker y Docker Compose
* .NET SDK

### ⚙️ Pasos para iniciar el proyecto

#### 1. Clonar el repositorio
````
git clone git@github.com:Angiea18/Proyecto_SPC.git
````

#### 2. Verificar que Docker está en ejecución

Ejecuta el siguiente comando para comprobar que Docker está corriendo:
````
docker info
````
Si Docker está en funcionamiento, verás información detallada. En caso contrario, inicia el servicio antes de continuar.

#### 3. Levantar la base de datos
Navega a la carpeta `DB` y ejecuta Docker Compose para iniciar el contenedor de PostgreSQL:

````
cd DB
docker-compose up -d
`````
#### 4. Configurar el backend
Muévete al directorio del backend:

````
cd ../Backend
`````

#### 5. Instala la herramienta de Entity Framework para manejar migraciones:

````
dotnet tool install --global dotnet-ef
````
#### 6. Crear y aplicar migraciones
Genera la migración inicial para la base de datos:

````
dotnet ef migrations add InitialCreate --project SPC.Data --startup-project SPC.API/
````
Accede a la carpeta `SPC.API`:

````
cd SPC.API
````
Aplica las migraciones a la base de datos:

````
dotnet ef database update
````
#### 7. Iniciar el servidor
````
 dotnet watch
`````

## Contribución
Si deseas aportar al desarrollo de esta plataforma, ¡tus contribuciones son bienvenidas! Haz un fork del repositorio, realiza tus cambios y envía un pull request.

----

## Recursos
