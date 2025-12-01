# Endpoints Backend - Pastelería Mil Sabores

Documento de especificación de endpoints necesarios para el backend del sistema de e-commerce de Pastelería Mil Sabores.

---

## Base URL
```
http://localhost:8080/api
```

---

## 1. AUTENTICACIÓN Y USUARIOS

### 1.1 Registro de Usuario
**POST** `/auth/register`

**Body:**
```json
{
  "email": "usuario@example.com",
  "password": "contraseña",
  "nombre": "Juan Pérez",
  "direccion": "Calle Principal 123",
  "telefono": "987654321"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "usuario": {
    "id": "uuid",
    "email": "usuario@example.com",
    "nombre": "Juan Pérez",
    "rol": "user"
  }
}
```

---

### 1.2 Login
**POST** `/auth/login`

**Body:**
```json
{
  "email": "usuario@example.com",
  "password": "contraseña"
}
```

**Response (200):**
```json
{
  "success": true,
  "token": "jwt_token_here",
  "usuario": {
    "id": "uuid",
    "email": "usuario@example.com",
    "nombre": "Juan Pérez",
    "rol": "user",
    "descuentoEspecial": 0,
    "esDuoc": false
  }
}
```

---

### 1.3 Logout
**POST** `/auth/logout`

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Sesión cerrada exitosamente"
}
```

---

### 1.4 Obtener Perfil del Usuario
**GET** `/usuarios/perfil`

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "id": "uuid",
  "email": "usuario@example.com",
  "nombre": "Juan Pérez",
  "direccion": "Calle Principal 123",
  "telefono": "987654321",
  "rol": "user",
  "fechaNacimiento": "1990-05-15",
  "descuentoEspecial": 0,
  "codigoDescuento": null,
  "esDuoc": false,
  "direccionesEntrega": ["Calle Principal 123", "Calle Secundaria 456"],
  "historialPedidos": []
}
```

---

### 1.5 Actualizar Perfil del Usuario
**PUT** `/usuarios/perfil`

**Headers:**
```
Authorization: Bearer {token}
```

**Body:**
```json
{
  "nombre": "Juan Pérez Actualizado",
  "telefono": "987654321",
  "fechaNacimiento": "1990-05-15",
  "direccion": "Nueva Dirección 789"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Perfil actualizado exitosamente",
  "usuario": {
    "id": "uuid",
    "email": "usuario@example.com",
    "nombre": "Juan Pérez Actualizado",
    "telefono": "987654321",
    "fechaNacimiento": "1990-05-15"
  }
}
```

---

### 1.6 Cambiar Contraseña
**POST** `/usuarios/cambiar-password`

**Headers:**
```
Authorization: Bearer {token}
```

**Body:**
```json
{
  "passwordActual": "contraseña_actual",
  "passwordNueva": "contraseña_nueva"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Contraseña actualizada exitosamente"
}
```

---

### 1.7 Agregar Dirección de Entrega
**POST** `/usuarios/direcciones`

**Headers:**
```
Authorization: Bearer {token}
```

**Body:**
```json
{
  "direccion": "Calle Terciaria 999, Depto 5"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Dirección agregada exitosamente",
  "direccionesEntrega": ["Calle Principal 123", "Calle Secundaria 456", "Calle Terciaria 999, Depto 5"]
}
```

---

### 1.8 Listar Direcciones de Entrega
**GET** `/usuarios/direcciones`

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "direccionesEntrega": [
    "Calle Principal 123",
    "Calle Secundaria 456",
    "Calle Terciaria 999, Depto 5"
  ]
}
```

---

### 1.9 Eliminar Dirección de Entrega
**DELETE** `/usuarios/direcciones/{index}`

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Dirección eliminada exitosamente",
  "direccionesEntrega": ["Calle Principal 123", "Calle Terciaria 999, Depto 5"]
}
```

---

### 1.10 Eliminar Usuario
**DELETE** `/usuarios/{email}`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Response (200):**
```json
{
  "success": true,
  "message": "Usuario eliminado exitosamente"
}
```

---

### 1.11 Verificar Token
**GET** `/auth/verify`

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "valid": true,
  "usuario": {
    "id": "uuid",
    "email": "usuario@example.com",
    "rol": "user"
  }
}
```

---

## 2. PRODUCTOS

### 2.1 Listar Todos los Productos
**GET** `/productos`

**Query Parameters (opcional):**
- `categoria`: Filtrar por categoría
- `busqueda`: Buscar por nombre o descripción
- `page`: Número de página (paginación)
- `limit`: Cantidad de productos por página

**Response (200):**
```json
{
  "total": 18,
  "page": 1,
  "limit": 10,
  "productos": [
    {
      "id": "TC001",
      "codigo": "TC001",
      "nombre": "Torta Cuadrada de Chocolate",
      "descripcion": "Deliciosa torta de chocolate...",
      "precio": 45000,
      "categoria": "Tortas Cuadradas",
      "esPersonalizable": true,
      "imagen": "tc001.jpg",
      "stock": 10
    }
  ]
}
```

---

### 2.2 Obtener Producto por ID
**GET** `/productos/{productoId}`

**Response (200):**
```json
{
  "id": "TC001",
  "codigo": "TC001",
  "nombre": "Torta Cuadrada de Chocolate",
  "descripcion": "Deliciosa torta de chocolate con capas de ganache...",
  "precio": 45000,
  "categoria": "Tortas Cuadradas",
  "esPersonalizable": true,
  "imagen": "tc001.jpg",
  "stock": 10
}
```

---

### 2.3 Listar Categorías
**GET** `/productos/categorias`

**Response (200):**
```json
{
  "categorias": [
    "Tortas Cuadradas",
    "Tortas Circulares",
    "Postres Individuales",
    "Productos Sin Azúcar",
    "Pastelería Tradicional",
    "Productos Sin Gluten",
    "Productos Vegana",
    "Tortas Especiales"
  ]
}
```

---

### 2.4 Crear Producto (Admin)
**POST** `/productos`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Body (form-data):**
```
- nombre: "Torta Nueva"
- descripcion: "Descripción de la torta"
- precio: 50000
- categoria: "Tortas Especiales"
- stock: 15
- esPersonalizable: true
- imagen: (archivo de imagen)
```

**Response (201):**
```json
{
  "success": true,
  "message": "Producto creado exitosamente",
  "producto": {
    "id": "TE003",
    "codigo": "TE003",
    "nombre": "Torta Nueva",
    "descripcion": "Descripción de la torta",
    "precio": 50000,
    "categoria": "Tortas Especiales",
    "esPersonalizable": true,
    "imagen": "te003.jpg",
    "stock": 15
  }
}
```

---

### 2.5 Actualizar Producto (Admin)
**PUT** `/productos/{productoId}`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body:**
```json
{
  "nombre": "Torta Actualizada",
  "descripcion": "Nueva descripción",
  "precio": 52000,
  "stock": 20,
  "esPersonalizable": true
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Producto actualizado exitosamente",
  "producto": {
    "id": "TC001",
    "codigo": "TC001",
    "nombre": "Torta Actualizada",
    "descripcion": "Nueva descripción",
    "precio": 52000,
    "stock": 20
  }
}
```

---

### 2.6 Eliminar Producto (Admin)
**DELETE** `/productos/{productoId}`

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Producto eliminado exitosamente"
}
```

---

### 2.7 Actualizar Stock de Producto (Admin)
**PATCH** `/productos/{productoId}/stock`

**Headers:**
```
Authorization: Bearer {token}
```

**Body:**
```json
{
  "nuevoStock": 25
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Stock actualizado exitosamente",
  "producto": {
    "id": "TC001",
    "nombre": "Torta Cuadrada de Chocolate",
    "stock": 25
  }
}
```

---

## 3. PEDIDOS

### 3.1 Crear Pedido
**POST** `/pedidos`

**Headers:**
```
Authorization: Bearer {token}
```

**Body:**
```json
{
  "productos": [
    {
      "productoId": "TC001",
      "cantidad": 2,
      "personalizacion": "Feliz Cumpleaños, María"
    },
    {
      "productoId": "P1001",
      "cantidad": 3,
      "personalizacion": null
    }
  ],
  "direccionEnvio": "Calle Principal 123",
  "metodoPago": "tarjeta",
  "tarjetaUltimos4": "4567"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Pedido creado exitosamente",
  "pedido": {
    "id": "PED-001",
    "usuarioId": "uuid",
    "productos": [
      {
        "productoId": "TC001",
        "cantidad": 2,
        "precio": 45000,
        "nombre": "Torta Cuadrada de Chocolate",
        "personalizacion": "Feliz Cumpleaños, María"
      }
    ],
    "subtotal": 90000,
    "descuento": 0,
    "total": 90000,
    "metodoPago": "tarjeta",
    "tarjetaUltimos4": "4567",
    "estado": "pendiente",
    "fechaPedido": "2024-11-30T10:30:00Z",
    "direccionEnvio": "Calle Principal 123"
  }
}
```

---

### 3.2 Obtener Pedido por ID
**GET** `/pedidos/{pedidoId}`

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "id": "PED-001",
  "usuarioId": "uuid",
  "productos": [
    {
      "productoId": "TC001",
      "cantidad": 2,
      "precio": 45000,
      "nombre": "Torta Cuadrada de Chocolate",
      "imagen": "tc001.jpg",
      "personalizacion": "Feliz Cumpleaños, María"
    }
  ],
  "subtotal": 90000,
  "descuento": 0,
  "total": 90000,
  "metodoPago": "tarjeta",
  "tarjetaUltimos4": "4567",
  "estado": "pendiente",
  "fechaPedido": "2024-11-30T10:30:00Z",
  "direccionEnvio": "Calle Principal 123"
}
```

---

### 3.3 Listar Pedidos del Usuario
**GET** `/pedidos`

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters (opcional):**
- `estado`: Filtrar por estado (pendiente, preparacion, enviado, entregado)
- `page`: Número de página
- `limit`: Cantidad de pedidos por página

**Response (200):**
```json
{
  "total": 5,
  "page": 1,
  "limit": 10,
  "pedidos": [
    {
      "id": "PED-001",
      "usuarioId": "uuid",
      "productos": [...],
      "total": 90000,
      "estado": "pendiente",
      "fechaPedido": "2024-11-30T10:30:00Z"
    }
  ]
}
```

---

### 3.4 Listar Todos los Pedidos (Admin)
**GET** `/admin/pedidos`

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters (opcional):**
- `estado`: Filtrar por estado
- `email`: Filtrar por email del usuario
- `fechaInicio`: Fecha de inicio (YYYY-MM-DD)
- `fechaFin`: Fecha final (YYYY-MM-DD)
- `page`: Número de página
- `limit`: Cantidad de pedidos por página

**Response (200):**
```json
{
  "total": 25,
  "page": 1,
  "limit": 10,
  "pedidos": [
    {
      "id": "PED-001",
      "usuarioId": "uuid",
      "usuarioEmail": "usuario@example.com",
      "productos": [...],
      "total": 90000,
      "estado": "pendiente",
      "fechaPedido": "2024-11-30T10:30:00Z"
    }
  ]
}
```

---

### 3.5 Actualizar Estado de Pedido (Admin)
**PATCH** `/pedidos/{pedidoId}/estado`

**Headers:**
```
Authorization: Bearer {token}
```

**Body:**
```json
{
  "estado": "preparacion"
}
```

Estados válidos: `pendiente`, `preparacion`, `enviado`, `entregado`

**Response (200):**
```json
{
  "success": true,
  "message": "Estado del pedido actualizado exitosamente",
  "pedido": {
    "id": "PED-001",
    "estado": "preparacion",
    "actualizadoEn": "2024-11-30T11:00:00Z"
  }
}
```

---

### 3.6 Cancelar Pedido
**POST** `/pedidos/{pedidoId}/cancelar`

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Pedido cancelado exitosamente",
  "pedido": {
    "id": "PED-001",
    "estado": "cancelado",
    "fechaCancelacion": "2024-11-30T11:15:00Z"
  }
}
```

---

## 4. DESCUENTOS Y CÓDIGOS PROMOCIONALES

### 4.1 Aplicar Código de Descuento
**POST** `/descuentos/aplicar`

**Headers:**
```
Authorization: Bearer {token}
```

**Body:**
```json
{
  "codigoDescuento": "DUOC2024",
  "montoOriginal": 90000
}
```

**Response (200):**
```json
{
  "success": true,
  "descuento": 9000,
  "porcentaje": 10,
  "montoFinal": 81000,
  "mensaje": "Descuento aplicado exitosamente"
}
```

---

### 4.2 Validar Código de Descuento
**GET** `/descuentos/validar/{codigo}`

**Response (200):**
```json
{
  "valido": true,
  "porcentaje": 10,
  "descripcion": "Descuento DUOC - 10%"
}
```

---

### 4.3 Listar Códigos de Descuento (Admin)
**GET** `/admin/descuentos`

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "descuentos": [
    {
      "id": "DESC-001",
      "codigo": "DUOC2024",
      "porcentaje": 10,
      "descripcion": "Descuento para estudiantes DUOC",
      "activo": true,
      "fechaCreacion": "2024-11-01T00:00:00Z"
    }
  ]
}
```

---

### 4.4 Crear Código de Descuento (Admin)
**POST** `/admin/descuentos`

**Headers:**
```
Authorization: Bearer {token}
```

**Body:**
```json
{
  "codigo": "NAVIDAD2024",
  "porcentaje": 15,
  "descripcion": "Descuento Navidad 2024",
  "activo": true
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Código de descuento creado exitosamente",
  "descuento": {
    "id": "DESC-002",
    "codigo": "NAVIDAD2024",
    "porcentaje": 15
  }
}
```

---

## 5. ADMINISTRACIÓN DE USUARIOS (Admin)

### 5.1 Listar Todos los Usuarios (Admin)
**GET** `/admin/usuarios`

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters (opcional):**
- `rol`: Filtrar por rol (user, admin)
- `busqueda`: Buscar por email o nombre
- `page`: Número de página
- `limit`: Cantidad de usuarios por página

**Response (200):**
```json
{
  "total": 45,
  "page": 1,
  "limit": 10,
  "usuarios": [
    {
      "id": "uuid",
      "email": "usuario@example.com",
      "nombre": "Juan Pérez",
      "rol": "user",
      "descuentoEspecial": 0,
      "esDuoc": false,
      "fechaRegistro": "2024-11-15T10:30:00Z"
    }
  ]
}
```

---

### 5.2 Obtener Usuario por Email (Admin)
**GET** `/admin/usuarios/{email}`

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "id": "uuid",
  "email": "usuario@example.com",
  "nombre": "Juan Pérez",
  "direccion": "Calle Principal 123",
  "telefono": "987654321",
  "rol": "user",
  "descuentoEspecial": 0,
  "codigoDescuento": null,
  "esDuoc": false,
  "direccionesEntrega": [...],
  "historialPedidos": [...],
  "fechaRegistro": "2024-11-15T10:30:00Z"
}
```

---

### 5.3 Actualizar Usuario (Admin)
**PUT** `/admin/usuarios/{email}`

**Headers:**
```
Authorization: Bearer {token}
```

**Body:**
```json
{
  "nombre": "Juan Pérez Actualizado",
  "descuentoEspecial": 15,
  "esDuoc": true,
  "rol": "user"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Usuario actualizado exitosamente",
  "usuario": {
    "id": "uuid",
    "email": "usuario@example.com",
    "nombre": "Juan Pérez Actualizado",
    "descuentoEspecial": 15,
    "esDuoc": true
  }
}
```

---

### 5.4 Cambiar Rol de Usuario (Admin)
**PATCH** `/admin/usuarios/{email}/rol`

**Headers:**
```
Authorization: Bearer {token}
```

**Body:**
```json
{
  "rol": "admin"
}
```

Roles válidos: `user`, `admin`

**Response (200):**
```json
{
  "success": true,
  "message": "Rol actualizado exitosamente",
  "usuario": {
    "email": "usuario@example.com",
    "rol": "admin"
  }
}
```

---

## 6. REPORTES Y ESTADÍSTICAS (Admin)

### 6.1 Obtener Estadísticas de Ventas
**GET** `/admin/estadisticas/ventas`

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters (opcional):**
- `fechaInicio`: Fecha de inicio (YYYY-MM-DD)
- `fechaFin`: Fecha final (YYYY-MM-DD)

**Response (200):**
```json
{
  "totalVentas": 2500000,
  "totalPedidos": 45,
  "ventaPromedio": 55555.56,
  "productoMasVendido": {
    "id": "TC001",
    "nombre": "Torta Cuadrada de Chocolate",
    "cantidadVendida": 25
  },
  "ingresosPorMetodoPago": {
    "efectivo": 1000000,
    "tarjeta": 1500000
  }
}
```

---

### 6.2 Obtener Productos Populares
**GET** `/admin/estadisticas/productos-populares`

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters (opcional):**
- `limite`: Cantidad de productos a mostrar (default: 10)

**Response (200):**
```json
{
  "productosPopulares": [
    {
      "id": "TC001",
      "nombre": "Torta Cuadrada de Chocolate",
      "cantidadVendida": 25,
      "ingresoTotal": 1125000
    }
  ]
}
```

---

### 6.3 Obtener Resumen de Pedidos por Estado
**GET** `/admin/estadisticas/pedidos-por-estado`

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "estadisticas": {
    "pendiente": 5,
    "preparacion": 3,
    "enviado": 8,
    "entregado": 29,
    "cancelado": 0
  }
}
```

---

## 7. CARRITO (Opcional - puede manejarse en frontend)

### 7.1 Guardar Carrito en Backend
**POST** `/carrito/guardar`

**Headers:**
```
Authorization: Bearer {token}
```

**Body:**
```json
{
  "items": [
    {
      "productoId": "TC001",
      "cantidad": 2,
      "personalizacion": "Feliz Cumpleaños"
    }
  ]
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Carrito guardado exitosamente"
}
```

---

### 7.2 Obtener Carrito del Usuario
**GET** `/carrito`

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "items": [
    {
      "productoId": "TC001",
      "cantidad": 2,
      "personalizacion": "Feliz Cumpleaños",
      "producto": {
        "id": "TC001",
        "nombre": "Torta Cuadrada de Chocolate",
        "precio": 45000
      }
    }
  ]
}
```

---

## Códigos de Estado HTTP

- **200**: OK - Solicitud exitosa
- **201**: Created - Recurso creado exitosamente
- **400**: Bad Request - Datos inválidos
- **401**: Unauthorized - Token inválido o expirado
- **403**: Forbidden - No tiene permisos
- **404**: Not Found - Recurso no encontrado
- **409**: Conflict - El recurso ya existe
- **500**: Internal Server Error - Error en el servidor

---

## Manejo de Errores

Todos los errores devuelven un objeto con la siguiente estructura:

```json
{
  "success": false,
  "message": "Descripción del error",
  "error": "CODIGO_ERROR",
  "details": {}
}
```

**Ejemplo:**
```json
{
  "success": false,
  "message": "El email ya está registrado",
  "error": "EMAIL_EXISTS",
  "details": {
    "email": "usuario@example.com"
  }
}
```

---

## Autenticación

Todos los endpoints protegidos requieren un token JWT en el header:

```
Authorization: Bearer {token}
```

El token se obtiene en el endpoint de login y típicamente expira en 24 horas.

---

## Roles y Permisos

- **user**: Acceso a su propio perfil, pedidos y carrito
- **admin**: Acceso a toda la administración del sistema

---

## Notas Importantes

1. **Stock**: Al crear un pedido, el stock se reduce automáticamente
2. **Descuentos**: Los descuentos se aplican solo a usuarios registrados y con código válido
3. **Imágenes**: Las imágenes de productos se almacenan en `/public/images/productos/`
4. **Personalización**: Los productos pueden tener un mensaje de personalización (max 200 caracteres)
5. **Métodos de Pago**: Solo se soportan efectivo y tarjeta (débito/crédito)

---

## Categorías de Productos

- Tortas Cuadradas
- Tortas Circulares
- Postres Individuales
- Productos Sin Azúcar
- Pastelería Tradicional
- Productos Sin Gluten
- Productos Vegana
- Tortas Especiales
