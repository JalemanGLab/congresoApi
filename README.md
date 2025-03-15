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
  id: number; // Identificador único
  name: string; // Nombre del distribuidor
  active: boolean; // Estado del distribuidor
  created_at: string; // Fecha de creación
  update_at: string; // Fecha de última actualización
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

## Módulo Asistentes

### Estructura de Datos

```typescript
{
  id: number; // Identificador único
  first_name: string; // Nombre del asistente
  last_name: string; // Apellido del asistente
  phone: string; // Teléfono de contacto
  email: string; // Correo electrónico
  main_procedure: string; // Procedimiento principal
  product_brand: string; // Marca del producto
  weekly_procedure: string; // Procedimiento semanal
  contact: boolean; // Estado de contacto
  payment: string; // Información de pago
  payment_update: string; // Fecha de actualización del pago
  entry: boolean; // Estado de entrada
  entry_datetime: string; // Fecha y hora de entrada
  created_at: string; // Fecha de creación
}
```

### Endpoints Disponibles

#### 1. Obtener Asistentes

```http
GET /assistants
```

**Ejemplo de respuesta:**

```json
[
  {
    "id": 1,
    "first_name": "Juan",
    "last_name": "Pérez",
    "phone": "1234567890",
    "email": "juan@ejemplo.com",
    "main_procedure": "Procedimiento A",
    "product_brand": "Marca X",
    "weekly_procedure": "Semanal 1",
    "contact": true,
    "payment": "efectivo",
    "payment_update": "2024-03-15T00:00:00Z",
    "entry": true,
    "entry_datetime": "2024-03-15T00:00:00Z",
    "created_at": "2024-03-15T00:00:00Z"
  }
]
```

#### 2. Obtener un Asistente

```http
GET /assistants/:id
```

**Ejemplo de respuesta:**

```json
{
  "id": 1,
  "first_name": "Juan",
  "last_name": "Pérez",
  "phone": "1234567890",
  "email": "juan@ejemplo.com",
  "main_procedure": "Procedimiento A",
  "product_brand": "Marca X",
  "weekly_procedure": "Semanal 1",
  "contact": true,
  "payment": "efectivo",
  "payment_update": "2024-03-15T00:00:00Z",
  "entry": true,
  "entry_datetime": "2024-03-15T00:00:00Z",
  "created_at": "2024-03-15T00:00:00Z"
}
```

#### 3. Crear Asistente

```http
POST /assistants
```

**Body requerido:**

```json
{
  "first_name": "Juan",
  "last_name": "Pérez",
  "phone": "1234567890",
  "email": "juan@ejemplo.com",
  "main_procedure": "Procedimiento A",
  "product_brand": "Marca X",
  "weekly_procedure": "Semanal 1",
  "contact": true,
  "payment": "efectivo",
  "entry": true,
  "entry_datetime": "2024-03-15T00:00:00Z"
}
```

**Ejemplo de respuesta:**

```json
{
  "id": 1,
  "first_name": "Juan",
  "last_name": "Pérez",
  "phone": "1234567890",
  "email": "juan@ejemplo.com",
  "main_procedure": "Procedimiento A",
  "product_brand": "Marca X",
  "weekly_procedure": "Semanal 1",
  "contact": true,
  "payment": "efectivo",
  "payment_update": "2024-03-15T00:00:00Z",
  "entry": true,
  "entry_datetime": "2024-03-15T00:00:00Z",
  "created_at": "2024-03-15T00:00:00Z"
}
```

#### 4. Actualizar Asistente

```http
PUT /assistants/:id
```

**Body:**

```json
{
  "phone": "0987654321",
  "contact": false,
  "payment": "tarjeta"
}
```

**Ejemplo de respuesta:**

```json
{
  "id": 1,
  "first_name": "Juan",
  "last_name": "Pérez",
  "phone": "0987654321",
  "email": "juan@ejemplo.com",
  "main_procedure": "Procedimiento A",
  "product_brand": "Marca X",
  "weekly_procedure": "Semanal 1",
  "contact": false,
  "payment": "tarjeta",
  "payment_update": "2024-03-15T00:00:00Z",
  "entry": true,
  "entry_datetime": "2024-03-15T00:00:00Z",
  "created_at": "2024-03-15T00:00:00Z"
}
```

## Módulo de Autenticación

### Estructura de Datos

#### Login Request

```typescript
{
  email: string; // Correo electrónico del usuario
  password: string; // Contraseña del usuario
}
```

#### Login Response

```typescript
{
  access_token: string; // Token JWT de acceso
  user: {
    identification: number; // Número de identificación
    first_name: string; // Nombre del usuario
    last_name: string; // Apellido del usuario
    email: string; // Correo electrónico
    rol: string; // Rol del usuario
  }
}
```

### Endpoints Disponibles

#### 1. Iniciar Sesión

```http
POST /auth/login
```

**Body requerido:**

```json
{
  "email": "usuario@ejemplo.com",
  "password": "contraseña123"
}
```

**Ejemplo de respuesta:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "identification": 1234567890,
    "first_name": "Juan",
    "last_name": "Pérez",
    "email": "usuario@ejemplo.com",
    "rol": "assistant"
  }
}
```

#### 2. Cerrar Sesión

```http
POST /auth/logout
```

**Headers requeridos:**

```http
Authorization: Bearer <token>
```

**Respuesta exitosa:**

```json
{
  "message": "Sesión cerrada correctamente"
}
```

### Notas de Seguridad

- El token JWT expira después de 15 minutos
- El token se almacena en la base de datos y se invalida al hacer logout
- Se requiere el token en el header Authorization para acceder a rutas protegidas
- Las contraseñas se almacenan hasheadas usando bcrypt
