# 📦 Documentación POST /api/admin/productos

## 🎯 Información General

### Endpoint
```
POST /api/admin/productos
```

### Autenticación
✅ **REQUERIDA** - Solo usuarios con rol `ADMIN`

```
Authorization: Bearer {token_admin}
```

---

## 📋 Formato de Datos

### Content-Type
```
application/json
```

**NO** se usa `multipart/form-data` para este endpoint.

---

## 🔑 Campos del Request Body

### Estructura JSON

```typescript
interface CrearProductoRequest {
  id: string;              // OBLIGATORIO - Código único del producto (ej: TC001, TT001)
  nombre: string;          // OBLIGATORIO - Nombre del producto
  descripcion?: string;    // OPCIONAL - Descripción detallada
  precio: number;          // OBLIGATORIO - Precio en CLP (usar número decimal)
  imagen?: string;         // OPCIONAL - Nombre del archivo de imagen o URL (puede ser null)
  stock: number;           // OBLIGATORIO - Cantidad disponible (número entero >= 0)
  categoria?: string;      // OPCIONAL - Categoría del producto
  disponible?: boolean;    // OPCIONAL - Si está disponible para venta (default: true)
}
```

---

## ✅ Campos Obligatorios

| Campo | Tipo | Validación | Ejemplo |
|-------|------|------------|---------|
| `id` | string | No vacío, único | "TC001" |
| `nombre` | string | No vacío | "Torta Cuadrada de Chocolate" |
| `precio` | number | >= 0 | 45000 |
| `stock` | number | >= 0 | 10 |

---

## ❓ Campos Opcionales

| Campo | Tipo | Default | Ejemplo |
|-------|------|---------|---------|
| `descripcion` | string | null | "Deliciosa torta de chocolate..." |
| `imagen` | string | null | "tc001.jpg" |
| `categoria` | string | null | "Tortas Cuadradas" |
| `disponible` | boolean | true | true |

---

## 📝 Sobre el campo `imagen`

### ¿Es obligatorio?
**NO** - El campo `imagen` puede ser:
- `null`
- `undefined` (no enviarlo en el JSON)
- Una cadena vacía `""`
- Un nombre de archivo: `"tc001.jpg"`
- Una URL completa: `"https://ejemplo.com/imagen.jpg"`

### Recomendaciones
Si tienes imágenes para subir, considera:
1. **Subir la imagen primero** a un servicio de almacenamiento (AWS S3, Cloudinary, etc.)
2. **Obtener la URL** de la imagen subida
3. **Enviar la URL** en el campo `imagen` del producto

---

## 🆔 Sobre el campo `id`

### ¿Debe ser igual al código?
**SÍ** - El campo `id` ES el código del producto.

- No se genera automáticamente
- Debe ser único en la base de datos
- Se usa como identificador principal
- Recomendamos seguir el patrón de códigos:
  - `TC001`, `TC002` → Tortas Cuadradas
  - `TT001`, `TT002` → Tortas Circulares
  - `P1001`, `P1002` → Postres Individuales
  - `PSA001`, `PSA002` → Productos Sin Azúcar
  - `PT001`, `PT002` → Pastelería Tradicional
  - `PG001`, `PG002` → Productos Sin Gluten
  - `PV001`, `PV002` → Productos Veganos
  - `TE001`, `TE002` → Tortas Especiales

---

## 📤 Ejemplo Completo de Request

### Con todos los campos

```json
{
  "id": "TC003",
  "nombre": "Torta Cuadrada de Frutilla",
  "descripcion": "Deliciosa torta con crema y frutillas frescas, perfecta para celebraciones especiales",
  "precio": 48000,
  "imagen": "tc003.jpg",
  "stock": 15,
  "categoria": "Tortas Cuadradas",
  "disponible": true
}
```

### Solo campos obligatorios

```json
{
  "id": "TC004",
  "nombre": "Torta Cuadrada de Vainilla",
  "precio": 42000,
  "stock": 20
}
```

### Con imagen null

```json
{
  "id": "PT005",
  "nombre": "Alfajores de Chocolate",
  "descripcion": "Set de 12 alfajores artesanales",
  "precio": 8000,
  "imagen": null,
  "stock": 50,
  "categoria": "Pastelería Tradicional"
}
```

---

## 📥 Respuestas del Servidor

### ✅ Success (201 Created)

```json
{
  "success": true,
  "message": "Producto creado exitosamente",
  "data": {
    "id": "TC003",
    "nombre": "Torta Cuadrada de Frutilla",
    "descripcion": "Deliciosa torta con crema y frutillas frescas",
    "precio": 48000,
    "imagen": "tc003.jpg",
    "stock": 15,
    "categoria": "Tortas Cuadradas",
    "disponible": true,
    "fechaCreacion": "2025-12-02T21:45:00",
    "fechaActualizacion": "2025-12-02T21:45:00"
  }
}
```

### ❌ Error - ID Duplicado (409 Conflict)

```json
{
  "success": false,
  "message": "Ya existe un producto con el código: TC003",
  "error": "DUPLICATE_ID"
}
```

### ❌ Error - Validación (400 Bad Request)

```json
{
  "success": false,
  "message": "Error de validación",
  "error": "VALIDATION_ERROR",
  "details": [
    "El código (ID) es obligatorio",
    "El precio debe ser mayor o igual a 0"
  ]
}
```

### ❌ Error - No Autorizado (401 Unauthorized)

```json
{
  "success": false,
  "message": "No autorizado",
  "error": "UNAUTHORIZED"
}
```

### ❌ Error - Sin Permisos (403 Forbidden)

```json
{
  "success": false,
  "message": "Acceso denegado. Se requiere rol ADMIN",
  "error": "FORBIDDEN"
}
```

---

## 🔧 Ejemplos de Código

### Fetch (JavaScript/TypeScript)

```typescript
const crearProducto = async (producto: CrearProductoRequest) => {
  const token = localStorage.getItem('authToken');
  
  const response = await fetch('http://localhost:8080/api/admin/productos', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(producto),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }
  
  return await response.json();
};

// Uso:
try {
  const result = await crearProducto({
    id: 'TC005',
    nombre: 'Torta de Chocolate Premium',
    descripcion: 'Torta de chocolate con ganache',
    precio: 52000,
    imagen: 'tc005.jpg',
    stock: 8,
    categoria: 'Tortas Cuadradas',
    disponible: true
  });
  
  console.log('Producto creado:', result.data);
} catch (error) {
  console.error('Error:', error.message);
}
```

### Axios (TypeScript)

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const crearProducto = async (producto: CrearProductoRequest) => {
  const response = await api.post('/admin/productos', producto);
  return response.data;
};

// Uso:
try {
  const result = await crearProducto({
    id: 'PV003',
    nombre: 'Brownies Veganos',
    precio: 12000,
    stock: 30,
    categoria: 'Productos Vegana'
  });
  
  console.log('Producto creado:', result.data);
} catch (error) {
  if (axios.isAxiosError(error)) {
    console.error('Error:', error.response?.data.message);
  }
}
```

### React Hook

```typescript
import { useState } from 'react';

interface CrearProductoRequest {
  id: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  imagen?: string;
  stock: number;
  categoria?: string;
  disponible?: boolean;
}

const useCrearProducto = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const crearProducto = async (producto: CrearProductoRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:8080/api/admin/productos', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(producto),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { crearProducto, loading, error };
};

// Uso en componente:
const FormularioProducto = () => {
  const { crearProducto, loading, error } = useCrearProducto();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const result = await crearProducto({
        id: 'TC006',
        nombre: 'Torta Red Velvet',
        precio: 55000,
        stock: 6,
        categoria: 'Tortas Cuadradas'
      });
      
      alert('Producto creado: ' + result.data.nombre);
    } catch (err) {
      console.error('Error al crear producto');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Formulario aquí */}
      {loading && <p>Creando producto...</p>}
      {error && <p className="error">{error}</p>}
    </form>
  );
};
```

---

## ⚠️ Notas Importantes

1. **Autenticación obligatoria**: El usuario debe tener rol `ADMIN`
2. **ID único**: No puedes crear dos productos con el mismo `id`
3. **Precio como número**: Envía `45000`, no `"45000"` (sin comillas)
4. **Stock como número entero**: Envía `10`, no `"10"` o `10.5`
5. **El campo `imagen` es opcional**: Puede ser `null`, `undefined`, o una URL/nombre de archivo
6. **Content-Type JSON**: Siempre usa `application/json`, **NO** `multipart/form-data`

---

## 🧪 Prueba con cURL

```bash
curl -X POST http://localhost:8080/api/admin/productos \
  -H "Authorization: Bearer TU_TOKEN_ADMIN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "TC007",
    "nombre": "Torta de Zanahoria",
    "descripcion": "Torta saludable con nueces y pasas",
    "precio": 38000,
    "imagen": "tc007.jpg",
    "stock": 12,
    "categoria": "Tortas Cuadradas",
    "disponible": true
  }'
```

---

## 📞 Contacto

Si tienes dudas sobre la integración, revisa:
- `FRONTEND-API-DOCS.md` - Documentación completa de la API
- `ENDPOINTS_JWT_REQUERIDOS.md` - Todos los endpoints disponibles

---

**Fecha de creación**: 02/12/2025  
**Backend**: Spring Boot 3.4.12 + Java 24  
**Base de datos**: MySQL (Railway)
