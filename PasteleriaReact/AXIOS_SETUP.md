# Guía de Uso de Axios y Servicios API

Este proyecto utiliza **Axios** para conectarse con el backend. Se han creado servicios reutilizables para facilitar la integración.

## Estructura

```
src/
├── services/
│   ├── api.ts                 # Configuración de axios
│   ├── authService.ts         # Servicios de autenticación
│   ├── productosService.ts    # Servicios de productos
│   ├── pedidosService.ts      # Servicios de pedidos
│   ├── descuentosService.ts   # Servicios de descuentos
│   └── adminService.ts        # Servicios de administración
├── hooks/
│   └── useApi.ts              # Hook personalizado para usar API
└── .env.local                 # Variables de entorno (no commitar)
```

## Configuración

### 1. Variables de Entorno

Copia `.env.example` a `.env.local` y configura la URL del backend:

```bash
VITE_API_URL=http://localhost:8080/api
```

### 2. Autenticación

El token JWT se guarda automáticamente en `localStorage` con la clave `authToken`. El interceptor de axios agrega el token a todas las peticiones protegidas.

## Ejemplos de Uso

### Autenticación

```typescript
import { authService } from '../services/authService';

// Login
try {
  const response = await authService.login('usuario@example.com', 'contraseña');
  console.log('Token:', response.token);
  console.log('Usuario:', response.usuario);
} catch (error) {
  console.error('Error al iniciar sesión:', error);
}

// Registro
try {
  const response = await authService.register(
    'nuevo@example.com',
    'contraseña',
    'Juan Pérez',
    '987654321',
    'Calle Principal 123'
  );
  console.log('Usuario registrado:', response.usuario);
} catch (error) {
  console.error('Error al registrar:', error);
}

// Logout
await authService.logout();
```

### Productos

```typescript
import { productosService } from '../services/productosService';

// Listar productos
try {
  const response = await productosService.listarProductos(
    'Tortas Cuadradas', // categoria
    'chocolate',        // busqueda
    1,                  // page
    10                  // limit
  );
  console.log('Productos:', response.productos);
  console.log('Total:', response.total);
} catch (error) {
  console.error('Error:', error);
}

// Obtener un producto
try {
  const producto = await productosService.obtenerProducto('TC001');
  console.log('Producto:', producto);
} catch (error) {
  console.error('Error:', error);
}

// Listar categorías
try {
  const { categorias } = await productosService.listarCategorias();
  console.log('Categorías:', categorias);
} catch (error) {
  console.error('Error:', error);
}
```

### Pedidos

```typescript
import { pedidosService } from '../services/pedidosService';

// Crear pedido
try {
  const response = await pedidosService.crearPedido({
    productos: [
      {
        productoId: 'TC001',
        cantidad: 2,
        personalizacion: 'Feliz Cumpleaños'
      }
    ],
    direccionEnvio: 'Calle Principal 123',
    metodoPago: 'tarjeta',
    tarjetaUltimos4: '4567'
  });
  console.log('Pedido creado:', response.pedido);
} catch (error) {
  console.error('Error:', error);
}

// Listar mis pedidos
try {
  const response = await pedidosService.listarPedidos(
    'pendiente',  // estado (opcional)
    1,            // page
    10            // limit
  );
  console.log('Mis pedidos:', response.pedidos);
} catch (error) {
  console.error('Error:', error);
}

// Obtener un pedido
try {
  const pedido = await pedidosService.obtenerPedido('PED-001');
  console.log('Pedido:', pedido);
} catch (error) {
  console.error('Error:', error);
}

// Cancelar pedido
try {
  const response = await pedidosService.cancelarPedido('PED-001');
  console.log('Pedido cancelado:', response);
} catch (error) {
  console.error('Error:', error);
}
```

### Descuentos

```typescript
import { descuentosService } from '../services/descuentosService';

// Validar código
try {
  const { valido, porcentaje } = await descuentosService.validarCodigo('DUOC2024');
  if (valido) {
    console.log('Descuento válido:', porcentaje, '%');
  }
} catch (error) {
  console.error('Código inválido:', error);
}

// Aplicar descuento
try {
  const response = await descuentosService.aplicarDescuento('DUOC2024', 90000);
  console.log('Descuento:', response.descuento);
  console.log('Monto final:', response.montoFinal);
} catch (error) {
  console.error('Error:', error);
}
```

### Usuario (Perfil)

```typescript
import { usuarioService } from '../services/authService';

// Obtener perfil
try {
  const perfil = await usuarioService.getPerfil();
  console.log('Mi perfil:', perfil);
} catch (error) {
  console.error('Error:', error);
}

// Actualizar perfil
try {
  const response = await usuarioService.updatePerfil({
    nombre: 'Nuevo Nombre',
    telefono: '987654321'
  });
  console.log('Perfil actualizado:', response.usuario);
} catch (error) {
  console.error('Error:', error);
}

// Cambiar contraseña
try {
  const response = await usuarioService.cambiarPassword(
    'contraseña_actual',
    'contraseña_nueva'
  );
  console.log('Contraseña actualizada');
} catch (error) {
  console.error('Error:', error);
}

// Agregar dirección
try {
  const response = await usuarioService.agregarDireccion('Calle Nueva 999');
  console.log('Dirección agregada');
} catch (error) {
  console.error('Error:', error);
}

// Listar direcciones
try {
  const { direccionesEntrega } = await usuarioService.listarDirecciones();
  console.log('Mis direcciones:', direccionesEntrega);
} catch (error) {
  console.error('Error:', error);
}
```

### Admin - Administración

```typescript
import { adminService } from '../services/adminService';

// Listar usuarios
try {
  const response = await adminService.listarUsuarios(
    'user',        // rol (opcional)
    'juan',        // busqueda (opcional)
    1,             // page
    10             // limit
  );
  console.log('Usuarios:', response.usuarios);
} catch (error) {
  console.error('Error:', error);
}

// Estadísticas de ventas
try {
  const stats = await adminService.obtenerEstadisticasVentas(
    '2024-11-01',  // fechaInicio
    '2024-11-30'   // fechaFin
  );
  console.log('Total ventas:', stats.totalVentas);
  console.log('Total pedidos:', stats.totalPedidos);
} catch (error) {
  console.error('Error:', error);
}

// Productos populares
try {
  const { productosPopulares } = await adminService.obtenerProductosPopulares(10);
  console.log('Productos más vendidos:', productosPopulares);
} catch (error) {
  console.error('Error:', error);
}

// Pedidos por estado
try {
  const { estadisticas } = await adminService.obtenerPedidosPorEstado();
  console.log('Pendientes:', estadisticas.pendiente);
  console.log('En preparación:', estadisticas.preparacion);
  console.log('Entregados:', estadisticas.entregado);
} catch (error) {
  console.error('Error:', error);
}
```

## Hook useApi (Alternativa)

Para una integración más fácil con componentes React, puedes usar el hook `useApi`:

```typescript
import { useApi } from '../hooks/useApi';
import { productosService } from '../services/productosService';

export const MisProductos = () => {
  const { data, loading, error, execute } = useApi(
    () => productosService.listarProductos()
  );

  useEffect(() => {
    execute();
  }, []);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data?.productos.map(p => (
        <div key={p.id}>{p.nombre}</div>
      ))}
    </div>
  );
};
```

## Manejo de Errores

Todos los servicios lanzan excepciones (AxiosError). Usa try-catch:

```typescript
try {
  const resultado = await algúnServicio.operación();
} catch (error) {
  if (error.response) {
    // El servidor respondió con un código de error
    console.error('Respuesta de error:', error.response.data);
    console.error('Status:', error.response.status);
  } else if (error.request) {
    // La petición se hizo pero no hubo respuesta
    console.error('No hay respuesta del servidor');
  } else {
    // Error al configurar la petición
    console.error('Error:', error.message);
  }
}
```

## Interceptores

El archivo `api.ts` incluye:

1. **Request Interceptor**: Agrega automáticamente el token JWT a las peticiones
2. **Response Interceptor**: Si recibe 401, limpia el token y redirige al login

## Próximos Pasos

1. Configura el backend en `VITE_API_URL` (`.env.local`)
2. Comienza a usar los servicios en tus componentes
3. Reemplaza las llamadas a localStorage con llamadas al backend
4. Prueba cada servicio antes de ir a producción

## Notas

- El token JWT se envía automáticamente en el header `Authorization: Bearer {token}`
- Las variables de entorno deben empezar con `VITE_` para ser accesibles en el cliente
- Los servicios devuelven la respuesta completa del servidor
- Siempre usa try-catch para manejar errores
