# Planificador de viajes

Aplicación web para crear viajes, organizar destinos y actividades, y guardar lugares favoritos.

## Tecnologías

- Frontend: React + Vite
- Backend: Flask
- Base de datos: PostgreSQL + SQLAlchemy + Flask-Migrate
- Estado global: Context API con patrón Flux

## Requisitos locales

- Node.js y npm
- Python 3.13
- Pipenv
- PostgreSQL en ejecución

## Configuración inicial

### 1. Instalar dependencias

```bash
npm install
pipenv install
```

### 2. Configurar variables de entorno

Crea tu archivo local a partir del ejemplo:

```bash
cp .env.example .env
```

Edita `DATABASE_URL` para tu instalación de PostgreSQL. En Linux, si PostgreSQL permite usar el usuario local mediante socket Unix:

```env
DATABASE_URL=postgresql:///planificador_viajes_dev
```

Si tu instalación exige conexión TCP con contraseña, usa una URL con usuario y contraseña:

```env
DATABASE_URL=postgresql://TU_USUARIO:TU_CONTRASENA@localhost:5432/planificador_viajes_dev
```

> `.env` está ignorado por Git. No subas contraseñas, tokens ni claves al repositorio.

### 3. Crear la base de datos local

```bash
createdb planificador_viajes_dev
```

Si la base ya existe, PostgreSQL mostrará un aviso y puedes continuar.

### 4. Crear y aplicar migraciones

Cuando cambien los modelos en `src/api/models.py`:

```bash
pipenv run migrate
pipenv run upgrade
```

Para aplicar migraciones que ya existan:

```bash
pipenv run upgrade
```

### 5. Ejecutar la aplicación

En una terminal, inicia Flask:

```bash
pipenv run start
```

El backend queda disponible en `http://127.0.0.1:3001`.

En otra terminal, inicia Vite:

```bash
npm run dev
```

Vite mostrará la URL local del frontend, normalmente `http://localhost:3000`.

## Comprobaciones rápidas

```bash
npm run lint
npm run build
```

La salud del backend estará disponible en:

```text
GET /api/health
```

## Destinos iniciales

Durante el MVP, los destinos disponibles inicialmente son:

- Valparaíso, Chile
- San José, Costa Rica
- Río de Janeiro, Brasil
- Buenos Aires, Argentina
- Lima, Perú

La selección y las pruebas de las APIs externas de ciudades, lugares y mapas se documentarán como la última tarea de EN-01.

## Modelo actual

El proyecto incluye los modelos `User`, `Trip`, `Destination`, `Activity`, `Place` y `Favorite`. Antes de implementar endpoints o pantallas, las modificaciones de los modelos deben ir acompañadas de su migración correspondiente.
