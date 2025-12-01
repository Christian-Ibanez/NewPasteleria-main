# Endpoints Requeridos - Sistema de Autenticación JWT

Este documento detalla los endpoints necesarios para reemplazar el sistema actual de localStorage por un backend completo con autenticación JWT en Spring Boot.

---

## Base URL
```
http://localhost:8080/api
```

---

## 1. AUTENTICACIÓN CON JWT

### 1.1 Registro de Usuario
**POST** `/auth/register`

**Request Body:**
```json
{
  "email": "usuario@example.com",
  "password": "contraseña123",
  "nombre": "Juan Pérez",
  "telefono": "+56912345678",
  "direccion": "Av. Principal 123, Santiago, Región Metropolitana"
}
```

**Response Success (201 Created):**
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "usuario": {
      "id": "uuid-123",
      "email": "usuario@example.com",
      "nombre": "Juan Pérez",
      "rol": "USER",
      "telefono": "+56912345678",
      "direccion": "Av. Principal 123, Santiago, Región Metropolitana",
      "fechaNacimiento": null,
      "descuentoEspecial": 0,
      "esDuoc": false,
      "codigoDescuento": null,
      "direccionesEntrega": ["Av. Principal 123, Santiago, Región Metropolitana"]
    }
  }
}
```

**Response Error (409 Conflict):**
```json
{
  "success": false,
  "message": "El email ya está registrado",
  "error": "EMAIL_EXISTS"
}
```

**Response Error (400 Bad Request):**
```json
{
  "success": false,
  "message": "Datos inválidos",
  "error": "INVALID_DATA",
  "details": {
    "email": "Email inválido",
    "password": "La contraseña debe tener al menos 6 caracteres"
  }
}
```

---

### 1.2 Login
**POST** `/auth/login`

**Request Body:**
```json
{
  "email": "usuario@example.com",
  "password": "contraseña123"
}
```

**Response Success (200 OK):**
```json
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "usuario": {
      "id": "uuid-123",
      "email": "usuario@example.com",
      "nombre": "Juan Pérez",
      "rol": "USER",
      "telefono": "+56912345678",
      "direccion": "Av. Principal 123, Santiago, Región Metropolitana",
      "fechaNacimiento": "1990-05-15",
      "descuentoEspecial": 0,
      "esDuoc": false,
      "codigoDescuento": null,
      "direccionesEntrega": [
        "Av. Principal 123, Santiago, Región Metropolitana",
        "Calle Secundaria 456, Valparaíso"
      ],
      "historialPedidos": []
    }
  }
}
```

**Response Error (401 Unauthorized):**
```json
{
  "success": false,
  "message": "Email o contraseña incorrectos",
  "error": "INVALID_CREDENTIALS"
}
```

---

### 1.3 Verificar Token
**GET** `/auth/verify`

**Headers:**
```
Authorization: Bearer {token}
```

**Response Success (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "uuid-123",
    "email": "usuario@example.com",
    "nombre": "Juan Pérez",
    "rol": "USER",
    "telefono": "+56912345678",
    "direccion": "Av. Principal 123, Santiago, Región Metropolitana",
    "fechaNacimiento": "1990-05-15",
    "descuentoEspecial": 0,
    "esDuoc": false,
    "codigoDescuento": null
  }
}
```

**Response Error (401 Unauthorized):**
```json
{
  "success": false,
  "message": "Token inválido o expirado",
  "error": "INVALID_TOKEN"
}
```

---

### 1.4 Logout
**POST** `/auth/logout`

**Headers:**
```
Authorization: Bearer {token}
```

**Response Success (200 OK):**
```json
{
  "success": true,
  "message": "Sesión cerrada exitosamente"
}
```

---

## 2. GESTIÓN DE USUARIOS

### 2.1 Obtener Perfil del Usuario
**GET** `/usuarios/perfil`

**Headers:**
```
Authorization: Bearer {token}
```

**Response Success (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "uuid-123",
    "email": "usuario@example.com",
    "nombre": "Juan Pérez",
    "rol": "USER",
    "telefono": "+56912345678",
    "direccion": "Av. Principal 123, Santiago, Región Metropolitana",
    "fechaNacimiento": "1990-05-15",
    "descuentoEspecial": 10,
    "esDuoc": false,
    "codigoDescuento": "FELICES50",
    "direccionesEntrega": [
      "Av. Principal 123, Santiago, Región Metropolitana",
      "Calle Secundaria 456, Valparaíso"
    ]
  }
}
```

**Response Error (401 Unauthorized):**
```json
{
  "success": false,
  "message": "No autorizado",
  "error": "UNAUTHORIZED"
}
```

---

### 2.2 Actualizar Perfil
**PUT** `/usuarios/perfil`

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body (campos opcionales):**
```json
{
  "nombre": "Juan Pérez Actualizado",
  "telefono": "+56987654321",
  "direccion": "Nueva Dirección 789",
  "fechaNacimiento": "1990-05-15",
  "codigoDescuento": "FELICES50"
}
```

**Response Success (200 OK):**
```json
{
  "success": true,
  "message": "Perfil actualizado exitosamente",
  "data": {
    "id": "uuid-123",
    "email": "usuario@example.com",
    "nombre": "Juan Pérez Actualizado",
    "telefono": "+56987654321",
    "direccion": "Nueva Dirección 789",
    "fechaNacimiento": "1990-05-15",
    "descuentoEspecial": 10,
    "codigoDescuento": "FELICES50"
  }
}
```

**Response Error (400 Bad Request):**
```json
{
  "success": false,
  "message": "Datos inválidos",
  "error": "INVALID_DATA"
}
```

---

### 2.3 Cambiar Contraseña
**PUT** `/usuarios/perfil/password`

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "oldPassword": "contraseñaAntigua",
  "newPassword": "contraseñaNueva123"
}
```

**Response Success (200 OK):**
```json
{
  "success": true,
  "message": "Contraseña actualizada exitosamente"
}
```

**Response Error (400 Bad Request):**
```json
{
  "success": false,
  "message": "La contraseña actual es incorrecta",
  "error": "INVALID_PASSWORD"
}
```

---

### 2.4 Agregar Dirección de Entrega
**POST** `/usuarios/perfil/direcciones`

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "direccion": "Calle Nueva 999, Concepción, Región del Biobío"
}
```

**Response Success (201 Created):**
```json
{
  "success": true,
  "message": "Dirección agregada exitosamente",
  "data": {
    "direccionesEntrega": [
      "Av. Principal 123, Santiago, Región Metropolitana",
      "Calle Secundaria 456, Valparaíso",
      "Calle Nueva 999, Concepción, Región del Biobío"
    ]
  }
}
```

---

### 2.5 Eliminar Dirección de Entrega
**DELETE** `/usuarios/perfil/direcciones`

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "direccion": "Calle Secundaria 456, Valparaíso"
}
```

**Response Success (200 OK):**
```json
{
  "success": true,
  "message": "Dirección eliminada exitosamente",
  "data": {
    "direccionesEntrega": [
      "Av. Principal 123, Santiago, Región Metropolitana",
      "Calle Nueva 999, Concepción, Región del Biobío"
    ]
  }
}
```

---

## 3. GESTIÓN DE PEDIDOS

### 3.1 Crear Pedido
**POST** `/pedidos`

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "productos": [
    {
      "productoId": "producto-uuid-1",
      "cantidad": 2,
      "personalizacion": "Feliz cumpleaños María"
    },
    {
      "productoId": "producto-uuid-2",
      "cantidad": 1,
      "personalizacion": null
    }
  ],
  "direccionEnvio": "Av. Principal 123, Santiago, Región Metropolitana",
  "metodoPago": "tarjeta",
  "tarjetaUltimos4": "1234",
  "codigoDescuento": "FELICES50"
}
```

**Response Success (201 Created):**
```json
{
  "success": true,
  "message": "Pedido creado exitosamente",
  "data": {
    "id": "pedido-uuid-123",
    "usuarioId": "uuid-123",
    "productos": [
      {
        "productoId": "producto-uuid-1",
        "cantidad": 2,
        "precio": 15000,
        "nombre": "Torta de Chocolate",
        "imagen": "/images/productos/torta-chocolate.jpg",
        "personalizacion": "Feliz cumpleaños María"
      },
      {
        "productoId": "producto-uuid-2",
        "cantidad": 1,
        "precio": 8000,
        "nombre": "Pie de Limón",
        "imagen": "/images/productos/pie-limon.jpg",
        "personalizacion": null
      }
    ],
    "subtotal": 38000,
    "descuento": 3800,
    "total": 34200,
    "estado": "PENDIENTE",
    "fechaPedido": "2025-12-01T14:30:00Z",
    "direccionEnvio": "Av. Principal 123, Santiago, Región Metropolitana",
    "metodoPago": "tarjeta",
    "tarjetaUltimos4": "1234"
  }
}
```

**Response Error (400 Bad Request):**
```json
{
  "success": false,
  "message": "Stock insuficiente para: Torta de Chocolate",
  "error": "INSUFFICIENT_STOCK"
}
```

**Response Error (401 Unauthorized):**
```json
{
  "success": false,
  "message": "No autorizado",
  "error": "UNAUTHORIZED"
}
```

---

### 3.2 Obtener Historial de Pedidos
**GET** `/pedidos`

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `estado` (opcional): PENDIENTE | EN_PROCESO | ENTREGADO | CANCELADO
- `page` (opcional, default: 1): Número de página
- `limit` (opcional, default: 10): Cantidad por página

**Request Example:**
```
GET /pedidos?estado=PENDIENTE&page=1&limit=10
```

**Response Success (200 OK):**
```json
{
  "success": true,
  "data": {
    "total": 25,
    "page": 1,
    "limit": 10,
    "pedidos": [
      {
        "id": "pedido-uuid-123",
        "usuarioId": "uuid-123",
        "productos": [
          {
            "productoId": "producto-uuid-1",
            "cantidad": 2,
            "precio": 15000,
            "nombre": "Torta de Chocolate",
            "imagen": "/images/productos/torta-chocolate.jpg",
            "personalizacion": "Feliz cumpleaños María"
          }
        ],
        "subtotal": 30000,
        "descuento": 3000,
        "total": 27000,
        "estado": "PENDIENTE",
        "fechaPedido": "2025-12-01T14:30:00Z",
        "direccionEnvio": "Av. Principal 123, Santiago",
        "metodoPago": "tarjeta",
        "tarjetaUltimos4": "1234"
      }
    ]
  }
}
```

---

### 3.3 Obtener Detalle de un Pedido
**GET** `/pedidos/{pedidoId}`

**Headers:**
```
Authorization: Bearer {token}
```

**Response Success (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "pedido-uuid-123",
    "usuarioId": "uuid-123",
    "productos": [
      {
        "productoId": "producto-uuid-1",
        "cantidad": 2,
        "precio": 15000,
        "nombre": "Torta de Chocolate",
        "imagen": "/images/productos/torta-chocolate.jpg",
        "personalizacion": "Feliz cumpleaños María"
      }
    ],
    "subtotal": 30000,
    "descuento": 3000,
    "total": 27000,
    "estado": "PENDIENTE",
    "fechaPedido": "2025-12-01T14:30:00Z",
    "fechaEntrega": null,
    "fechaCancelacion": null,
    "direccionEnvio": "Av. Principal 123, Santiago",
    "metodoPago": "tarjeta",
    "tarjetaUltimos4": "1234"
  }
}
```

**Response Error (404 Not Found):**
```json
{
  "success": false,
  "message": "Pedido no encontrado",
  "error": "NOT_FOUND"
}
```

**Response Error (403 Forbidden):**
```json
{
  "success": false,
  "message": "No tiene permiso para ver este pedido",
  "error": "FORBIDDEN"
}
```

---

### 3.4 Cancelar Pedido
**POST** `/pedidos/{pedidoId}/cancelar`

**Headers:**
```
Authorization: Bearer {token}
```

**Response Success (200 OK):**
```json
{
  "success": true,
  "message": "Pedido cancelado exitosamente",
  "data": {
    "id": "pedido-uuid-123",
    "estado": "CANCELADO",
    "fechaCancelacion": "2025-12-01T15:00:00Z"
  }
}
```

**Response Error (400 Bad Request):**
```json
{
  "success": false,
  "message": "No se puede cancelar un pedido entregado",
  "error": "CANNOT_CANCEL"
}
```

---

## 4. ENDPOINTS DE ADMINISTRADOR (ROL: ADMIN)

### 4.1 Listar Todos los Usuarios
**GET** `/admin/usuarios`

**Headers:**
```
Authorization: Bearer {admin-token}
```

**Query Parameters:**
- `page` (opcional, default: 1)
- `limit` (opcional, default: 20)
- `rol` (opcional): USER | ADMIN

**Response Success (200 OK):**
```json
{
  "success": true,
  "data": {
    "total": 150,
    "page": 1,
    "limit": 20,
    "usuarios": [
      {
        "id": "uuid-123",
        "email": "usuario@example.com",
        "nombre": "Juan Pérez",
        "rol": "USER",
        "fechaRegistro": "2025-11-15T10:00:00Z",
        "ultimoAcceso": "2025-12-01T12:00:00Z"
      }
    ]
  }
}
```

**Response Error (403 Forbidden):**
```json
{
  "success": false,
  "message": "Acceso denegado. Se requiere rol de administrador",
  "error": "FORBIDDEN"
}
```

---

### 4.2 Actualizar Usuario (Admin)
**PATCH** `/admin/usuarios/{usuarioId}`

**Headers:**
```
Authorization: Bearer {admin-token}
```

**Request Body:**
```json
{
  "nombre": "Nombre Actualizado",
  "rol": "ADMIN",
  "descuentoEspecial": 20
}
```

**Response Success (200 OK):**
```json
{
  "success": true,
  "message": "Usuario actualizado exitosamente",
  "data": {
    "id": "uuid-123",
    "email": "usuario@example.com",
    "nombre": "Nombre Actualizado",
    "rol": "ADMIN",
    "descuentoEspecial": 20
  }
}
```

---

### 4.3 Eliminar Usuario
**DELETE** `/admin/usuarios/{usuarioId}`

**Headers:**
```
Authorization: Bearer {admin-token}
```

**Response Success (200 OK):**
```json
{
  "success": true,
  "message": "Usuario eliminado exitosamente"
}
```

**Response Error (400 Bad Request):**
```json
{
  "success": false,
  "message": "Este usuario no puede eliminarse",
  "error": "CANNOT_DELETE"
}
```

---

### 4.4 Listar Todos los Pedidos (Admin)
**GET** `/admin/pedidos`

**Headers:**
```
Authorization: Bearer {admin-token}
```

**Query Parameters:**
- `estado` (opcional): PENDIENTE | EN_PROCESO | ENTREGADO | CANCELADO
- `email` (opcional): Filtrar por email de usuario
- `fechaInicio` (opcional): Formato ISO 8601
- `fechaFin` (opcional): Formato ISO 8601
- `page` (opcional, default: 1)
- `limit` (opcional, default: 20)

**Response Success (200 OK):**
```json
{
  "success": true,
  "data": {
    "total": 500,
    "page": 1,
    "limit": 20,
    "pedidos": [
      {
        "id": "pedido-uuid-123",
        "usuarioEmail": "usuario@example.com",
        "usuarioNombre": "Juan Pérez",
        "total": 34200,
        "estado": "PENDIENTE",
        "fechaPedido": "2025-12-01T14:30:00Z"
      }
    ]
  }
}
```

---

### 4.5 Actualizar Estado de Pedido (Admin)
**PATCH** `/admin/pedidos/{pedidoId}/estado`

**Headers:**
```
Authorization: Bearer {admin-token}
```

**Request Body:**
```json
{
  "estado": "EN_PROCESO"
}
```

**Estados válidos:**
- `PENDIENTE`
- `EN_PROCESO`
- `ENTREGADO`
- `CANCELADO`

**Response Success (200 OK):**
```json
{
  "success": true,
  "message": "Estado del pedido actualizado exitosamente",
  "data": {
    "id": "pedido-uuid-123",
    "estado": "EN_PROCESO"
  }
}
```

---

## 5. CÓDIGOS DE ERROR COMUNES

### Autenticación y Autorización
- `UNAUTHORIZED` (401): No se proporcionó token o es inválido
- `FORBIDDEN` (403): El usuario no tiene permisos para realizar esta acción
- `INVALID_TOKEN` (401): Token JWT expirado o malformado
- `INVALID_CREDENTIALS` (401): Email o contraseña incorrectos

### Validación de Datos
- `INVALID_DATA` (400): Datos de entrada inválidos o incompletos
- `EMAIL_EXISTS` (409): El email ya está registrado
- `INVALID_PASSWORD` (400): La contraseña no cumple los requisitos

### Recursos
- `NOT_FOUND` (404): Recurso no encontrado
- `INSUFFICIENT_STOCK` (400): No hay suficiente stock del producto
- `CANNOT_CANCEL` (400): No se puede cancelar el pedido en su estado actual
- `CANNOT_DELETE` (400): El recurso no puede ser eliminado

### Servidor
- `SERVER_ERROR` (500): Error interno del servidor

---

## 6. HEADERS REQUERIDOS

### Para endpoints públicos:
```
Content-Type: application/json
```

### Para endpoints protegidos:
```
Content-Type: application/json
Authorization: Bearer {jwt-token}
```

---

## 7. NOTAS IMPORTANTES PARA EL BACKEND

### JWT (JSON Web Token)
1. **Duración del token**: Recomendado 24 horas
2. **Refresh token**: Opcional, pero recomendado (duración: 7 días)
3. **Claims del JWT**:
   ```json
   {
     "sub": "uuid-123",
     "email": "usuario@example.com",
     "rol": "USER",
     "iat": 1701435600,
     "exp": 1701522000
   }
   ```

### Seguridad
1. Las contraseñas deben estar hasheadas con **BCrypt**
2. Implementar **rate limiting** para endpoints de autenticación
3. Validar todos los inputs del lado del servidor
4. CORS configurado para permitir el origen del frontend

### Base de Datos
1. Los IDs pueden ser **UUID** o **auto-increment**
2. Relaciones:
   - Usuario → Pedidos (1:N)
   - Pedido → DetallePedidos (1:N)
   - Producto → DetallePedidos (1:N)

### Estados de Pedido
```java
public enum EstadoPedido {
    PENDIENTE,
    EN_PROCESO,
    ENTREGADO,
    CANCELADO
}
```

### Roles de Usuario
```java
public enum Rol {
    USER,
    ADMIN,
    SYSTEM
}
```

---

## 8. MIGRACIÓN DESDE LOCALSTORAGE

### Datos actuales en localStorage:
1. **`authToken`**: Reemplazar con JWT del backend
2. **`np_current_user_v1`**: Obtener desde `/usuarios/perfil`
3. **`np_users_v1`**: Ya no necesario (manejado por backend)
4. **Historial de pedidos**: Obtener desde `/pedidos`

### Proceso de migración:
1. Implementar endpoints en backend
2. Actualizar servicios en frontend para usar API
3. Remover lógica de localStorage
4. Probar flujo completo de autenticación
5. Probar creación y consulta de pedidos

---

## 9. EJEMPLOS DE USO EN EL FRONTEND

### Registro:
```typescript
const response = await api.post('/auth/register', {
  email: 'usuario@example.com',
  password: 'contraseña123',
  nombre: 'Juan Pérez'
});
localStorage.setItem('authToken', response.data.data.token);
```

### Login:
```typescript
const response = await api.post('/auth/login', {
  email: 'usuario@example.com',
  password: 'contraseña123'
});
localStorage.setItem('authToken', response.data.data.token);
```

### Crear Pedido:
```typescript
const response = await api.post('/pedidos', {
  productos: [
    { productoId: 'prod-1', cantidad: 2, personalizacion: 'Mensaje' }
  ],
  direccionEnvio: 'Dirección completa',
  metodoPago: 'tarjeta',
  tarjetaUltimos4: '1234'
}, {
  headers: {
    Authorization: `Bearer ${localStorage.getItem('authToken')}`
  }
});
```

---

**Fecha de creación**: 01/12/2025  
**Versión**: 1.0  
**Frontend**: React + TypeScript + Vite  
**Backend**: Spring Boot + Java + JWT
