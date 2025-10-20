# 🔐 Microservicio de Autenticación - Sistema de Quejas EPB

Microservicio independiente para gestionar la autenticación de usuarios administradores del Sistema de Quejas de Entidades Públicas de Boyacá.

## 📋 Descripción

Este microservicio maneja la autenticación de usuarios administradores, controlando el estado de sesión (`islogged`) en la base de datos. Proporciona endpoints para login, logout y verificación de estado de usuarios.

## 🚀 Instalación

```bash
npm install
```

## ⚙️ Configuración

Asegúrate de tener el archivo `.env` configurado correctamente con las variables de entorno necesarias:

```env
NODE_ENV=production
AUTH_SERVICE_PORT=3001
MYSQL_ADDON_DB=tu_base_de_datos
MYSQL_ADDON_HOST=tu_host
MYSQL_ADDON_PASSWORD=tu_password
MYSQL_ADDON_PORT=tu_puerto
MYSQL_ADDON_USER=tu_usuario
```

## 🏃‍♂️ Ejecución

### Modo desarrollo
```bash
npm run dev
```

### Modo producción
```bash
npm start
```

## 📡 Endpoints

### 1. Login
Inicia sesión de un usuario administrador.

**Endpoint:** `POST /auth/login`

**Body:**
```json
{
  "username": "admin",
  "password": "password123"
}
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "username": "admin",
  "message": "Login exitoso",
  "timestamp": "2025-10-19T12:00:00.000Z"
}
```

**Respuesta de error (401):**
```json
{
  "success": false,
  "message": "Credenciales inválidas",
  "timestamp": "2025-10-19T12:00:00.000Z"
}
```

---

### 2. Logout
Cierra la sesión de un usuario administrador.

**Endpoint:** `POST /auth/logout`

**Body:**
```json
{
  "username": "admin"
}
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Logout exitoso",
  "timestamp": "2025-10-19T12:00:00.000Z"
}
```

**Respuesta de error (404):**
```json
{
  "success": false,
  "message": "Usuario no encontrado",
  "timestamp": "2025-10-19T12:00:00.000Z"
}
```

---

### 3. Verificar Estado de Usuario
Verifica si un usuario específico está logueado.

**Endpoint:** `GET /auth/verify/:username`

**Parámetros:**
- `username`: Nombre de usuario a verificar

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "isLogged": true,
  "username": "admin",
  "timestamp": "2025-10-19T12:00:00.000Z"
}
```

**Respuesta de error (404):**
```json
{
  "success": false,
  "message": "Usuario no encontrado",
  "timestamp": "2025-10-19T12:00:00.000Z"
}
```

---

## 📊 Estructura del Proyecto

```
Nuevo_microservicio/
├── .env                          # Variables de entorno
├── package.json                  # Dependencias y scripts
├── server.js                     # Punto de entrada principal
├── Reglas-Desarrollo.md         # Reglas de desarrollo del proyecto
├── README.md                     # Documentación
└── src/
    ├── config/
    │   └── database.js          # Configuración de base de datos
    ├── controllers/
    │   └── authController.js    # Controlador de autenticación
    ├── services/
    │   └── authService.js       # Lógica de negocio de autenticación
    ├── routes/
    │   └── authRoutes.js        # Definición de rutas
    └── middleware/
        └── errorHandler.js      # Manejo de errores
```

## 🗄️ Tabla de Base de Datos

El microservicio trabaja con la tabla `users`:

```sql
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    userpassword VARCHAR(255) NOT NULL,
    islogged BOOLEAN NOT NULL DEFAULT FALSE
)
```

## 🔒 Seguridad

- Las contraseñas se almacenan en texto plano (para entorno de desarrollo)
- En producción se recomienda implementar hashing (bcrypt, argon2)
- El microservicio valida la longitud mínima de credenciales
- Se implementa manejo de errores centralizado

## 🌐 Despliegue en Render

### Configuración
1. Crear nuevo Web Service en Render
2. Conectar el repositorio
3. Configurar las variables de entorno en Render
4. Establecer el comando de inicio: `npm start`
5. Configurar el puerto en las variables de entorno

### Variables de entorno en Render
```
NODE_ENV=production
AUTH_SERVICE_PORT=3001
MYSQL_ADDON_DB=<tu_base_de_datos>
MYSQL_ADDON_HOST=<tu_host>
MYSQL_ADDON_PASSWORD=<tu_password>
MYSQL_ADDON_PORT=<tu_puerto>
MYSQL_ADDON_USER=<tu_usuario>
```

## 📝 Notas Importantes

- Cada conexión de usuario es independiente (varios usuarios pueden estar logueados simultáneamente)
- El estado de sesión persiste en la base de datos
- No se implementa JWT ni tokens (verificación directa con BD)
- El logout es manual (no hay timeout automático)


## 📄 Licencia

ISC
