# Zoo-Logic IA

Servicio SaaS B2B impulsado por inteligencia artificial para optimizar la gestión y el bienestar animal en parques naturales y zoológicos.

La plataforma construye un **gemelo digital** de cada animal a partir de tres fuentes de datos (visión computacional, sensores IoT y registros estructurados) y detecta anomalías de forma temprana. Atiende a dos públicos:

- **Profesionales veterinarios**, mediante un panel web de gestión y seguimiento.
- **Visitantes del parque**, mediante un chatbot educativo sobre las especies.

Su metodología de aprendizaje es mixta: aprendizaje supervisado, generación de datos sintéticos y validación continua por expertos humanos. Su impacto está en la conservación de la biodiversidad.

## Qué incluye esta versión (MVP académico)

| Funcionalidad | Estado |
|---|---|
| Página de inicio con 6 secciones y animaciones al hacer scroll | Implementada |
| CRUD completo de **animales** (crear, listar con filtros, editar, eliminar) | Implementada |
| Seguimiento veterinario por animal (registros con origen del dato y puntuación de anomalía) | Implementada |
| Validación de alertas por un experto humano | Implementada |
| Regla de negocio: anomalía igual o superior a 0,6 pasa un animal sano a «En observación» | Implementada |
| Chatbot educativo para visitantes | Implementado como asistente **basado en reglas** sobre la tabla de especies |
| Modelos de visión computacional, ingesta real de sensores IoT y entrenamiento de IA | **Fuera del alcance del MVP**: se representan con datos sintéticos y el campo `anomaly_score` |

Los modelos de IA reales son la evolución natural del proyecto (ver «Siguientes pasos»).

## Tecnologías

| Capa | Tecnología |
|---|---|
| Frontend | Angular 18 (componentes standalone, signals, formularios reactivos) y Tailwind CSS 3 |
| Backend | C# con ASP.NET Core 8 (Web API) y Entity Framework Core 8 |
| Base de datos | PostgreSQL 16 |
| Despliegue | Docker y Docker Compose (nginx sirve el frontend y actúa de proxy inverso) |
| Documentación de la API | Swagger / OpenAPI (Swashbuckle) |

## Arquitectura

```
                  http://localhost:4200
 Navegador ───────────────────────────────►  frontend (nginx)
                                               │  sirve la SPA de Angular
                                               │  /api/*  ──proxy──►  backend (ASP.NET, :8080)
                                                                         │  EF Core + Npgsql
                                                                         ▼
                                                                   db (PostgreSQL, :5432)
                                                                   volumen "pgdata"
```

- El navegador solo habla con nginx. Las llamadas a `/api` se reenvían al backend, por lo que no hace falta CORS en producción.
- El backend sigue una estructura sencilla por capas: `Controllers` (HTTP) → `Dtos` (contratos y validación) → `Data` (DbContext de EF Core) → `Models` (entidades).
- El esquema de PostgreSQL se crea con scripts SQL (`database/init`) que se ejecutan una sola vez al crear el volumen. EF Core mapea las tablas en `snake_case`.

### Modelo de datos

```
species (1) ──< animals (1) ──< vet_records
```

- `species`: nombre común y científico, estado de conservación UICN, hábitat, dieta y dato educativo.
- `animals`: nombre, código único de chip o sensor, especie, sexo, nacimiento, peso, recinto, estado de salud y notas.
- `vet_records`: fecha, tipo, descripción, temperatura, pulso, origen (Veterinario, IoT, Visión o IA), puntuación de anomalía, responsable y si está validado por un experto.

## Cómo ejecutarlo con Docker

Requisitos: Docker y Docker Compose v2.

```bash
git clone <url-de-tu-repositorio>
cd zoo-logic-ia
docker compose up --build
```

Cuando termine de arrancar:

| Servicio | URL |
|---|---|
| Aplicación web | http://localhost:4200 |
| Panel veterinario | http://localhost:4200/panel |
| Chatbot educativo | http://localhost:4200/chatbot |
| API (Swagger) | http://localhost:8080/swagger |
| Comprobación de salud | http://localhost:8080/health |
| PostgreSQL | `localhost:5432` (usuario, contraseña y base `zoologic` por defecto) |

Comandos útiles:

```bash
docker compose up -d --build      # arrancar en segundo plano
docker compose logs -f backend    # ver los logs de la API
docker compose down               # parar los contenedores (conserva los datos)
docker compose down -v            # parar y BORRAR la base de datos (se vuelve a sembrar al arrancar)
```

Para cambiar las credenciales de la base de datos, copia `.env.example` a `.env` y edítalo antes de la primera ejecución.

> Los scripts de `database/init` solo se ejecutan cuando el volumen está vacío. Si cambias el esquema, usa `docker compose down -v` para recrearlo.

## Desarrollo local sin Docker (opcional)

```bash
# 1. Base de datos (solo PostgreSQL en Docker)
docker compose up -d db

# 2. Backend (requiere .NET 8 SDK). Escucha en http://localhost:8080
cd backend/ZooLogic.Api
dotnet run

# 3. Frontend (requiere Node 20+). Escucha en http://localhost:4200 y reenvía /api al backend
cd frontend
npm install
npm start
```

## API REST

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/animals?search=&status=` | Lista animales con filtros opcionales |
| GET | `/api/animals/stats` | Resumen por estado de salud y alertas pendientes |
| GET | `/api/animals/{id}` | Detalle de un animal |
| POST | `/api/animals` | Crea un animal |
| PUT | `/api/animals/{id}` | Actualiza un animal |
| DELETE | `/api/animals/{id}` | Elimina un animal y su historial |
| GET | `/api/species` | Lista de especies |
| GET | `/api/animals/{id}/records` | Historial de seguimiento |
| POST | `/api/animals/{id}/records` | Añade un registro de seguimiento |
| PUT | `/api/records/{id}/validate` | Marca un registro como validado por un experto |
| DELETE | `/api/records/{id}` | Elimina un registro |
| POST | `/api/chatbot/ask` | Pregunta al chatbot educativo (`{ "question": "..." }`) |

## Diseño

- **Paleta como tokens de Tailwind** (`frontend/tailwind.config.js`): `forest`, `earth` y `ochre` para la biodiversidad; `electric`, `deepblue` e `ink` para la tecnología.
- **Tipografía**: Fraunces para titulares y Instrument Sans para el texto.
- **Animaciones de scroll**: la directiva `appReveal` usa Intersection Observer y respeta `prefers-reduced-motion`. La página de inicio añade una barra de progreso y una navegación lateral que sigue la sección activa.

## Estructura del repositorio

```
zoo-logic-ia/
├── docker-compose.yml
├── .env.example
├── database/init/            Scripts SQL (esquema y datos de ejemplo)
├── backend/                  API ASP.NET Core 8
│   ├── Dockerfile
│   └── ZooLogic.Api/
│       ├── Controllers/      Animals, Species, VetRecords, Chatbot
│       ├── Data/             AppDbContext (EF Core)
│       ├── Dtos/             Contratos y validación
│       └── Models/           Entidades
└── frontend/                 SPA Angular + Tailwind
    ├── Dockerfile
    ├── nginx.conf
    └── src/app/
        ├── core/             Modelos y servicio HTTP
        ├── shared/           Navbar, footer y directiva de scroll
        └── pages/            home, panel y chatbot
```

## Siguientes pasos

1. Sustituir el campo `anomaly_score` manual por la salida de un modelo de visión computacional entrenado con vídeo de los recintos.
2. Ingerir telemetría de sensores IoT en tiempo real (MQTT) y guardarla en una tabla de series temporales.
3. Generar datos sintéticos para enfermedades poco frecuentes y reentrenar con las alertas validadas por los veterinarios.
4. Reemplazar el chatbot basado en reglas por un modelo de lenguaje con recuperación sobre la base de especies.
5. Añadir autenticación y roles (veterinario, administrador) y migraciones con EF Core.
6. Pruebas automáticas del backend y del frontend e integración continua.

## Licencia

Proyecto académico. Añade aquí la licencia que prefieras antes de publicarlo.
