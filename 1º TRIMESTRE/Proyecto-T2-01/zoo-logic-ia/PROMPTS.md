# Prompts utilizados

Este documento recoge el prompt con el que se generó el proyecto **Zoo-Logic IA** y las interacciones posteriores necesarias para dejarlo funcionando.

| Dato | Valor |
|---|---|
| Herramienta | Claude (chat de Anthropic) |
| Modelo | Claude Sonnet 5.5 |
| Fecha | 5 de noviembre de 2026 |
| Resultado | Estructura completa del proyecto: frontend Angular + Tailwind, backend ASP.NET, PostgreSQL y Docker |

---

## Prompt 1: generación completa del proyecto

Este fue el primer prompt enviado, copiado de forma literal. Con él se generó toda la estructura del proyecto (carpetas, código fuente, Dockerfiles, `docker-compose.yml`, scripts SQL, `.gitignore` y `README.md`).

~~~~text
Quiero que actúes como un desarrollador full-stack senior con experiencia en Angular, ASP.NET, PostgreSQL y Docker, y que generes de una sola vez la estructura completa, todas las carpetas y todos los archivos, de una aplicación web para mi proyecto de asignatura. Trabaja en Claude y entrégamelo todo en una única respuesta, lista para subir a GitHub.

**Contexto del proyecto**

El proyecto se llama **Zoo-Logic IA**, un servicio SaaS B2B impulsado por inteligencia artificial para optimizar la gestión y el bienestar animal en parques naturales y zoológicos. El sistema recopila información multimodal mediante visión computacional, sensores de IoT y registros estructurados para construir gemelos digitales y detectar anomalías tempranas. La plataforma atiende a dos públicos: profesionales veterinarios, a través de un panel web especializado, y visitantes del parque, a través de un chatbot educativo. Su metodología de aprendizaje es mixta: aprendizaje supervisado, generación de datos sintéticos y validación continua por expertos humanos. Su impacto está en la conservación de la biodiversidad.

**Requisitos técnicos obligatorios**

- **Frontend:** Angular con Tailwind CSS.
- **Backend:** C# con ASP.NET (Web API).
- **Base de datos:** PostgreSQL.
- **Despliegue:** Docker, con un `docker-compose.yml` que levante frontend, backend y base de datos.
- **CRUD básico** funcional sobre al menos una entidad relevante del dominio (por ejemplo, animales, especies o registros de seguimiento veterinario).
- **README.md** en la raíz que explique las tecnologías utilizadas, la arquitectura, cómo ejecutar el proyecto con Docker y qué hace la aplicación.

**Página de inicio**

Diseña una página de inicio minimalista con información sobre el proyecto. A medida que el usuario hace scroll, las secciones deben aparecer y dividirse en apartados con interacción automática (animaciones de entrada al hacer scroll, por ejemplo mediante Intersection Observer o las utilidades de Tailwind). Incluye como mínimo estas secciones: presentación, problema que resuelve, funcionamiento (visión computacional, IoT y registros), dos públicos (panel veterinario y chatbot educativo), metodología de aprendizaje e impacto en la biodiversidad.

**Paleta de colores**

Los colores principales deben combinar tonos naturales inspirados en la biodiversidad (verdes bosque, tierra, ocres suaves) con colores propios de la tecnología actual (cian eléctrico, azul profundo o acentos luminosos sobre fondos oscuros). Define estos colores como tokens en la configuración de Tailwind.

**Entregable**

Genera la estructura completa del proyecto con todas las carpetas y archivos, incluyendo el código fuente del frontend Angular, el backend ASP.NET con su capa de acceso a datos, las migraciones o script de inicialización de PostgreSQL, los Dockerfile de cada servicio, el `docker-compose.yml`, el `.gitignore` y el `README.md`. Escribe el código completo de cada archivo, sin placeholders ni fragmentos omitidos, de modo que el proyecto pueda ejecutarse tras un `docker compose up`. Al final, indica el árbol de carpetas resultante.
~~~~

---

## Prompts posteriores (ajustes y consultas)

Tras el prompt principal hubo estas interacciones. Se incluyen para que el historial del proyecto sea completo.

| N.º | Motivo | Resumen | Resultado |
|---|---|---|---|
| 2 | Error al ejecutar | Captura del error `failed to connect to the docker API` al lanzar `docker compose up --build`. | El problema era que Docker Desktop no estaba en marcha. Se indicó cómo arrancarlo y comprobarlo con `docker version`. |
| 3 | Error de compilación | Captura del fallo de `npm ci` en el Dockerfile del frontend (lockfile desincronizado con `chokidar`). | Se sustituyó `npm ci` por `npm install` en `frontend/Dockerfile` y se eliminó `package-lock.json`. |
| 4 | Consulta | Cómo ver el CRUD en la base de datos y dónde está el comando que ejecuta el proyecto. | Se explicó el uso de `psql`, DBeaver o pgAdmin y Adminer (web), y que el comando se ejecuta desde la carpeta que contiene `docker-compose.yml`. |
| 5 | Documentación | Petición de este archivo `PROMPTS.md`. | Archivo generado. |
