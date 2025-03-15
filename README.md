# Solventum API

API REST para el sistema Solventum, desarrollada con NestJS y Supabase.

## Contenido
- [Tecnologías](#tecnologías)
- [Requisitos](#requisitos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Módulos](#módulos)
  - [Distribuidores](#módulo-distribuidores)
- [Manejo de Errores](#manejo-de-errores)
- [Seguridad](#seguridad)

## Tecnologías

- NestJS v11.0.1
- Supabase
- TypeScript
- Node.js

## Requisitos

- Node.js (v14 o superior)
- yarn
- Cuenta en Supabase

## Instalación

1. Clonar el repositorio:
```bash
git clone [url-del-repositorio]
cd solventum
```

2. Instalar dependencias:
```bash
yarn install
```

3. Configurar variables de entorno:
```bash
cp .env.example .env
```

## Configuración

### Variables de Entorno

Crear archivo `.env` en la raíz del proyecto:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Scripts Disponibles

```bash
# Desarrollo
yarn start:dev

# Compilar
yarn build

# Producción
yarn start:prod

# Tests
yarn test
yarn test:e2e
```

## Módulos

### Módulo Distribuidores

Gestión de distribuidores del sistema.

#### Base URL


# Solventum API

## Módulo de Distribuidores

### Estructura de Datos
```typescript
{
  id: number;          // Identificador único
  name: string;        // Nombre del distribuidor
  active: boolean;     // Estado del distribuidor
  created_at: string;  // Fecha de creación
  update_at: string;   // Fecha de última actualización
}
```

### Endpoints Disponibles

#### 1. Obtener Distribuidores
```http
GET /distributors
```

**Parámetros de consulta opcionales:**
- `active`: boolean - Filtrar distribuidores por estado

**Ejemplo de respuesta:**
```json
[
  {
    "id": 1,
    "name": "Distribuidor Example",
    "active": true,
    "created_at": "2024-03-15T00:00:00Z",
    "update_at": "2024-03-15T00:00:00Z"
  }
]
```

#### 2. Obtener un Distribuidor
```http
GET /distributors/:id
```

**Ejemplo de respuesta:**
```json
{
  "id": 1,
  "name": "Distribuidor Example",
  "active": true,
  "created_at": "2024-03-15T00:00:00Z",
  "update_at": "2024-03-15T00:00:00Z"
}
```

#### 3. Crear Distribuidor
```http
POST /distributors
```

**Body requerido:**
```json
{
  "name": "Nuevo Distribuidor",
  "active": true
}
```

**Ejemplo de respuesta:**
```json
{
  "id": 1,
  "name": "Nuevo Distribuidor",
  "active": true,
  "created_at": "2024-03-15T00:00:00Z",
  "update_at": "2024-03-15T00:00:00Z"
}
```

#### 4. Actualizar Distribuidor
```http
PUT /distributors/:id
```

**Body:**
```json
{
  "name": "Nombre Actualizado",
  "active": false
}
```

**Ejemplo de respuesta:**
```json
{
  "id": 1,
  "name": "Nombre Actualizado",
  "active": false,
  "created_at": "2024-03-15T00:00:00Z",
  "update_at": "2024-03-15T00:00:00Z"
}
```

