<p style="text-align: right;"><img src="Frontend\SPC\public\LogoSPC.png" alt="Logo" width="90"/></p>

# **Proyecto: Secretos para Contar**

![Biblioteca Digital Secretos para Contar](Frontend/SPC/public/inicio.png)

![.NET](https://img.shields.io/badge/.NET-512BD4?style=for-the-badge&logo=dotnet&logoColor=white)
![Remix](https://img.shields.io/badge/Remix-000000?style=for-the-badge&logo=remix&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![DaisyUI](https://img.shields.io/badge/DaisyUI-FF69B4?style=for-the-badge)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=jsonwebtokens)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

---

## Tabla de Contenido

- [Descripción](#descripción)
- [Repositorio](#repositorio)
- [Estructura y Características](#estructura-y-características-de-la-plataforma)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Cómo Levantar el Proyecto](#cómo-levantar-el-proyecto)
- [🐳 Docker Setup](#-docker-setup)
- [Conoce al Equipo](#conoce-al-equipo)
- [Contribución](#contribución)
- [Referencias](#referencias)

---

## **Descripción**

Somos la **Biblioteca Digital** de la `Fundación Secretos para Contar`, un espacio pensado para llevar el conocimiento a las familias del campo. Aquí encontrarás libros y recursos educativos gratuitos, diseñados para apoyar a docentes, estudiantes y comunidades rurales en su proceso de aprendizaje.

A través de esta plataforma, seguimos fortaleciendo la misión de la Fundación: **acercar la lectura y la educación a todos**, sin importar la distancia, promoviendo el desarrollo y el acceso al conocimiento en las zonas rurales.

## 📁 **Repositorio**

Este repositorio contiene tanto el **backend** como el **frontend** de la aplicación, desarrollados en **.NET** y **Remix (React)**.

## **Estructura y Características de la Plataforma**

### **Backend**

#### 🔐 Autenticación y Gestión de Acceso

- Registro e inicio de sesión para acceder a los recursos educativos.
- Solo los **administradores** pueden acceder al **panel de gestión**.
- Autenticación segura mediante **JWT**.

#### Roles de Usuario

- Administrador / Fundación
- Docente
- Estudiante
- Otro / Externo

#### Panel de Administración

Los administradores pueden gestionar:

- Libros
- Audiolibros
- Autores
- Usuarios

#### Base de Datos

- Base de datos relacional **PostgreSQL**.
- Configurada con **Entity Framework** y soporte para **migraciones**.

#### Seguridad

- Autenticación con **JWT**.
- Validación rigurosa de datos.
- Aplicación de buenas prácticas contra ataques:
  - Inyección SQL
  - XSS
  - Otros ataques comunes en entornos web

#### Escalabilidad y Mantenimiento

Estructura modular, limpia y mantenible, lista para escalar en el futuro.

#### CRUD para Recursos

Se han implementado operaciones **CRUD** para libros, autores, usuarios y audiolibros.

#### Integración con el Frontend

El frontend consume los endpoints del backend para mostrar el contenido dinámicamente.

---

### **Frontend**

La plataforma se compone de una **aplicación web con múltiples páginas**. La navegación se hace desde la página principal `Inicio` usando la **barra de navegación** superior `navbar`.

#### Inicio

- Página principal de la plataforma.
- Introducción al proyecto y acceso directo a otras secciones.

#### Nosotros

- Explicación breve sobre el propósito de la biblioteca digital.

#### Biblioteca Digital

Organizada en tres secciones principales:

##### 1. Libros

- Detalles del libro
- Opción de leer online
- Descarga en PDF
- Conexión al audiolibro (si existe)
- Calificación del libro
- Compartir
- Barra de progreso de lectura
- Agregar a lista de deseos
- Categorizados por género
- Recomendaciones basadas en el contenido

##### 2. Audiolibros

- Reproductor de audiolibros y videolibros
- Opción de descarga
- Acceso al PDF del libro (si está disponible)
- Funcionalidades similares a la de los libros

##### 3. Autores

- Biografía breve de cada autor
- Vinculación con sus libros/audiolibros

#### Tienda

- Visualización de archivos físicos disponibles
- Enlace directo a la librería donde se encuentran los productos
- Enlace a **WhatsApp** para **asesoría personalizada**

#### Mi Cuenta

- Formulario de **inicio de sesión**
- Recuperación y **restablecimiento de contraseña**
- Formulario de **registro**
- Solo los usuarios registrados pueden acceder al contenido protegido

#### Donaciones

- Botón flotante disponible en **todas las páginas**
- Redirige a un formulario para realizar donaciones a la plataforma

#### Panel Administrativo

- Solo accesible para usuarios con rol **administrador**
- Gestión completa de recursos educativos y usuarios

#### Footer

- Información de contacto disponible en el pie de página de todas las secciones

## **Tecnologías Utilizadas**

### Backend:

- `.NET`
- `Entity Framework`
- `PostgreSQL`
- `JWT (JSON Web Token)`

### Frontend:

- `Remix`
- `React`
- `TailwindCSS`
- `DaisyUI`
- `Chart.js` _(para visualizaciones)_

### Herramientas:

- Visual Studio Code
- GitHub + GitHub Projects
- Docker
- Figma
- DBeaver
- Bruno _(para probar APIs)_

## 🚀 **Cómo Levantar el Proyecto**

### Prerrequisitos

Asegúrate de tener instalado:

- Git
- Docker y Docker Compose
- .NET SDK

### 📝 Configuración Inicial

## 🐳 **Docker Setup**

### **Inicio Rápido con Docker**

El proyecto incluye una configuración completa de Docker que permite ejecutar tanto el backend como la base de datos PostgreSQL con un solo comando.

#### **🚀 Ejecutar con Docker**

```bash
# Clonar el repositorio
git clone <repository-url>
cd Proyecto_SPC

# Construir y ejecutar todos los servicios
docker-compose up --build

# Ejecutar en segundo plano
docker-compose up -d --build
```

#### **📋 Servicios Disponibles**

- **PostgreSQL Database**: `localhost:5432`
- **ASP.NET Core API**: `http://localhost:5197`
- **Swagger UI**: `http://localhost:5197/swagger`

#### **🔧 Comandos Útiles**

```bash
# Ver estado de los servicios
docker-compose ps

# Ver logs en tiempo real
docker-compose logs -f

# Detener servicios
docker-compose down

# Reconstruir solo la API
docker-compose build api
```

#### **✨ Características del Setup Docker**

- **Multi-stage build** para optimizar el tamaño de la imagen
- **Migraciones automáticas** al iniciar el contenedor
- **Health checks** para la base de datos
- **Seguridad** con usuario no-root para la aplicación
- **Networking** dedicado entre servicios

#### **📚 Documentación Detallada**

Para información completa sobre la configuración de Docker, consulta:
- **[README-Docker.md](README-Docker.md)** - Documentación detallada del setup Docker
- Troubleshooting y configuración avanzada
- Guías de desarrollo y producción

#### **🔄 Migraciones Automáticas**

El sistema incluye:
- Ejecución automática de migraciones de Entity Framework
- Seed de datos iniciales (usuario administrador)
- Health checks para asegurar que la base de datos esté lista

#### **🔐 Seguridad**

- Usuario no-root para la aplicación
- Variables de entorno para configuración
- JWT configurado para autenticación
- Permisos mínimos necesarios

---

## **Conoce al Equipo**

**Angie Arango**

- Cargo: Full Stack Developer y Team Lead
- Funciones: Diseño UI, Desarrollo Frontend y apoyo backend, liderazgo de equipo.

**Leonard Villegas**

- Cargo: Backend Developer
- Funciones: Desarrollo Backend y apoyo frontend, liderazgo de backend.

**Lorena Quiceno**

- Cargo: Backend Developer
- Funciones: Desarrollo Backend y apoyo frontend.

**Jaime Vélez**

- Cargo: Backend Developer
- Funciones: Desarrollo Backend y apoyo frontend.

**Marcela Molina**

- Cargo: Frontend Developer
- Funciones: Desarrollo Frontend.

## **Contribución**

Si deseas aportar al desarrollo de esta plataforma, ¡tus contribuciones son bienvenidas!

1. Haz un fork del repositorio.
2. Crea una rama nueva: `git checkout -b feature/mi-nueva-funcionalidad`
3. Realiza tus cambios y haz commits claros.
4. Haz push a tu rama: `git push origin feature/mi-nueva-funcionalidad`
5. Abre un Pull Request describiendo tu contribución.

## **Referencias**

- **Fundación Secretos para Contar** – [Página oficial](https://secretosparacontar.org/)

### Documentación oficial:

- [.NET](https://learn.microsoft.com/dotnet/)
- [Remix](https://remix.run/docs)
- [React](https://reactjs.org/)
- [TailwindCSS](https://tailwindcss.com/docs)
- [DaisyUI](https://daisyui.com/docs/)

### Otros recursos:

- Manual de marca de la Fundación Secretos para Contar
- El contenido de la plataforma fue proporcionado directamente por la Fundación y cargado en la base de datos.

