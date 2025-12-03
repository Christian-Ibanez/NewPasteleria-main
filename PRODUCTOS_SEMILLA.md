# Productos Semilla - Pastelería Mil Sabores

Este documento contiene los 18 productos que deben ser creados en la base de datos como datos semilla (seed data).

---

## Formato de Producto

Cada producto debe crearse con los siguientes atributos:

```json
{
  "codigo": "string",           // Código único del producto
  "nombre": "string",           // Nombre del producto
  "descripcion": "string",      // Descripción detallada
  "precio": number,             // Precio en CLP
  "categoria": "string",        // Categoría del producto
  "esPersonalizable": boolean,  // Si admite personalización
  "imagen": "string",           // Nombre del archivo de imagen
  "stock": number               // Cantidad disponible
}
```

---

## 1. Tortas Cuadradas (2 productos)

### TC001 - Torta Cuadrada de Chocolate
```json
{
  "codigo": "TC001",
  "nombre": "Torta Cuadrada de Chocolate",
  "descripcion": "Deliciosa torta de chocolate con capas de ganache y un toque de avellanas. Personalizable con mensajes especiales.",
  "precio": 45000,
  "categoria": "Tortas Cuadradas",
  "esPersonalizable": true,
  "imagen": "tc001.jpg",
  "stock": 10
}
```

### TC002 - Torta Cuadrada de Frutas
```json
{
  "codigo": "TC002",
  "nombre": "Torta Cuadrada de Frutas",
  "descripcion": "Una mezcla de frutas frescas y crema chantilly sobre un suave bizcocho de vainilla, ideal para celebraciones.",
  "precio": 50000,
  "categoria": "Tortas Cuadradas",
  "esPersonalizable": false,
  "imagen": "tc002.jpg",
  "stock": 8
}
```

---

## 2. Tortas Circulares (2 productos)

### TT001 - Torta Circular de Vainilla
```json
{
  "codigo": "TT001",
  "nombre": "Torta Circular de Vainilla",
  "descripcion": "Bizcocho de vainilla clásico relleno con crema pastelera y cubierto con un glaseado dulce, perfecto para cualquier ocasión.",
  "precio": 40000,
  "categoria": "Tortas Circulares",
  "esPersonalizable": false,
  "imagen": "tt001.jpg",
  "stock": 12
}
```

### TT002 - Torta Circular de Manjar
```json
{
  "codigo": "TT002",
  "nombre": "Torta Circular de Manjar",
  "descripcion": "Torta tradicional chilena con manjar y nueces, un deleite para los amantes de los sabores dulces y clásicos.",
  "precio": 42000,
  "categoria": "Tortas Circulares",
  "esPersonalizable": false,
  "imagen": "tt002.jpg",
  "stock": 15
}
```

---

## 3. Postres Individuales (2 productos)

### P1001 - Mousse de Chocolate
```json
{
  "codigo": "P1001",
  "nombre": "Mousse de Chocolate",
  "descripcion": "Postre individual cremoso y suave, hecho con chocolate de alta calidad, ideal para los amantes del chocolate.",
  "precio": 5000,
  "categoria": "Postres Individuales",
  "esPersonalizable": false,
  "imagen": "pi001.jpg",
  "stock": 20
}
```

### P1002 - Tiramisú Clásico
```json
{
  "codigo": "P1002",
  "nombre": "Tiramisú Clásico",
  "descripcion": "Un postre italiano individual con capas de café, mascarpone y cacao, perfecto para finalizar cualquier comida.",
  "precio": 5500,
  "categoria": "Postres Individuales",
  "esPersonalizable": false,
  "imagen": "pi002.jpg",
  "stock": 18
}
```

---

## 4. Productos Sin Azúcar (2 productos)

### PSA001 - Torta Sin Azúcar de Naranja
```json
{
  "codigo": "PSA001",
  "nombre": "Torta Sin Azúcar de Naranja",
  "descripcion": "Torta ligera y deliciosa, endulzada naturalmente, ideal para quienes buscan opciones más saludables.",
  "precio": 48000,
  "categoria": "Productos Sin Azúcar",
  "esPersonalizable": false,
  "imagen": "psa001.jpg",
  "stock": 8
}
```

### PSA002 - Cheesecake Sin Azúcar
```json
{
  "codigo": "PSA002",
  "nombre": "Cheesecake Sin Azúcar",
  "descripcion": "Suave y cremoso, este cheesecake es una opción perfecta para disfrutar sin culpa.",
  "precio": 47000,
  "categoria": "Productos Sin Azúcar",
  "esPersonalizable": false,
  "imagen": "psa002.jpg",
  "stock": 6
}
```

---

## 5. Pastelería Tradicional (2 productos)

### PT001 - Empanada de Manzana
```json
{
  "codigo": "PT001",
  "nombre": "Empanada de Manzana",
  "descripcion": "Pastelería tradicional rellena de manzanas especiadas, perfecta para un dulce desayuno o merienda.",
  "precio": 3000,
  "categoria": "Pastelería Tradicional",
  "esPersonalizable": false,
  "imagen": "pt001.jpg",
  "stock": 25
}
```

### PT002 - Tarta de Santiago
```json
{
  "codigo": "PT002",
  "nombre": "Tarta de Santiago",
  "descripcion": "Tradicional tarta española hecha con almendras, azúcar, y huevos, una delicia para los amantes de los postres clásicos.",
  "precio": 6000,
  "categoria": "Pastelería Tradicional",
  "esPersonalizable": false,
  "imagen": "pt002.jpg",
  "stock": 15
}
```

---

## 6. Productos Sin Gluten (2 productos)

### PG001 - Brownie Sin Gluten
```json
{
  "codigo": "PG001",
  "nombre": "Brownie Sin Gluten",
  "descripcion": "Rico y denso, este brownie es perfecto para quienes necesitan evitar el gluten sin sacrificar el sabor.",
  "precio": 4000,
  "categoria": "Productos Sin Gluten",
  "esPersonalizable": false,
  "imagen": "pg001.jpg",
  "stock": 30
}
```

### PG002 - Pan Sin Gluten
```json
{
  "codigo": "PG002",
  "nombre": "Pan Sin Gluten",
  "descripcion": "Suave y esponjoso, ideal para sandwiches o para acompañar cualquier comida.",
  "precio": 3500,
  "categoria": "Productos Sin Gluten",
  "esPersonalizable": false,
  "imagen": "pg002.jpg",
  "stock": 40
}
```

---

## 7. Productos Veganos (2 productos)

### PV001 - Torta Vegana de Chocolate
```json
{
  "codigo": "PV001",
  "nombre": "Torta Vegana de Chocolate",
  "descripcion": "Torta de chocolate húmeda y deliciosa, hecha sin productos de origen animal, perfecta para veganos.",
  "precio": 50000,
  "categoria": "Productos Vegana",
  "esPersonalizable": false,
  "imagen": "pv001.jpg",
  "stock": 10
}
```

### PV002 - Galletas Veganas de Avena
```json
{
  "codigo": "PV002",
  "nombre": "Galletas Veganas de Avena",
  "descripcion": "Crujientes y sabrosas, estas galletas son una excelente opción para un snack saludable y vegano.",
  "precio": 4500,
  "categoria": "Productos Vegana",
  "esPersonalizable": false,
  "imagen": "pv002.jpg",
  "stock": 45
}
```

---

## 8. Tortas Especiales (2 productos)

### TE001 - Torta Especial de Cumpleaños
```json
{
  "codigo": "TE001",
  "nombre": "Torta Especial de Cumpleaños",
  "descripcion": "Diseñada especialmente para celebraciones, personalizable con decoraciones y mensajes únicos.",
  "precio": 55000,
  "categoria": "Tortas Especiales",
  "esPersonalizable": true,
  "imagen": "te001.jpg",
  "stock": 5
}
```

### TE002 - Torta Especial de Boda
```json
{
  "codigo": "TE002",
  "nombre": "Torta Especial de Boda",
  "descripcion": "Elegante y deliciosa, esta torta está diseñada para ser el centro de atención en cualquier boda.",
  "precio": 60000,
  "categoria": "Tortas Especiales",
  "esPersonalizable": true,
  "imagen": "te002.jpg",
  "stock": 3
}
```

---

## Resumen de Categorías

| Categoría | Cantidad de Productos | Rango de Precios |
|-----------|----------------------|------------------|
| Tortas Cuadradas | 2 | $45.000 - $50.000 |
| Tortas Circulares | 2 | $40.000 - $42.000 |
| Postres Individuales | 2 | $5.000 - $5.500 |
| Productos Sin Azúcar | 2 | $47.000 - $48.000 |
| Pastelería Tradicional | 2 | $3.000 - $6.000 |
| Productos Sin Gluten | 2 | $3.500 - $4.000 |
| Productos Vegana | 2 | $4.500 - $50.000 |
| Tortas Especiales | 2 | $55.000 - $60.000 |
| **TOTAL** | **18 productos** | $3.000 - $60.000 |

---

## Notas para el Backend

1. **Imágenes**: Las imágenes deben estar ubicadas en `/public/images/productos/` o en el directorio configurado en el backend.

2. **Stock**: Los valores de stock son iniciales. El sistema debe decrementar automáticamente el stock al crear pedidos.

3. **Personalización**: Solo 3 productos tienen `esPersonalizable: true`:
   - TC001 (Torta Cuadrada de Chocolate)
   - TE001 (Torta Especial de Cumpleaños)
   - TE002 (Torta Especial de Boda)

4. **Códigos**: Los códigos son únicos y siguen el patrón:
   - TC: Tortas Cuadradas
   - TT: Tortas Circulares
   - P1: Postres Individuales
   - PSA: Productos Sin Azúcar
   - PT: Pastelería Tradicional
   - PG: Productos Sin Gluten
   - PV: Productos Veganos
   - TE: Tortas Especiales

5. **Endpoint para crear**: `POST /productos` (requiere autenticación ADMIN)

6. **Validaciones recomendadas**:
   - Precio > 0
   - Stock >= 0
   - Código único
   - Nombre no vacío
   - Categoría válida

---

## Script SQL de Ejemplo (PostgreSQL)

```sql
-- Asumiendo una tabla 'productos' con las columnas apropiadas
INSERT INTO productos (codigo, nombre, descripcion, precio, categoria, es_personalizable, imagen, stock) VALUES
('TC001', 'Torta Cuadrada de Chocolate', 'Deliciosa torta de chocolate con capas de ganache y un toque de avellanas. Personalizable con mensajes especiales.', 45000, 'Tortas Cuadradas', true, 'tc001.jpg', 10),
('TC002', 'Torta Cuadrada de Frutas', 'Una mezcla de frutas frescas y crema chantilly sobre un suave bizcocho de vainilla, ideal para celebraciones.', 50000, 'Tortas Cuadradas', false, 'tc002.jpg', 8),
('TT001', 'Torta Circular de Vainilla', 'Bizcocho de vainilla clásico relleno con crema pastelera y cubierto con un glaseado dulce, perfecto para cualquier ocasión.', 40000, 'Tortas Circulares', false, 'tt001.jpg', 12),
('TT002', 'Torta Circular de Manjar', 'Torta tradicional chilena con manjar y nueces, un deleite para los amantes de los sabores dulces y clásicos.', 42000, 'Tortas Circulares', false, 'tt002.jpg', 15),
('P1001', 'Mousse de Chocolate', 'Postre individual cremoso y suave, hecho con chocolate de alta calidad, ideal para los amantes del chocolate.', 5000, 'Postres Individuales', false, 'pi001.jpg', 20),
('P1002', 'Tiramisú Clásico', 'Un postre italiano individual con capas de café, mascarpone y cacao, perfecto para finalizar cualquier comida.', 5500, 'Postres Individuales', false, 'pi002.jpg', 18),
('PSA001', 'Torta Sin Azúcar de Naranja', 'Torta ligera y deliciosa, endulzada naturalmente, ideal para quienes buscan opciones más saludables.', 48000, 'Productos Sin Azúcar', false, 'psa001.jpg', 8),
('PSA002', 'Cheesecake Sin Azúcar', 'Suave y cremoso, este cheesecake es una opción perfecta para disfrutar sin culpa.', 47000, 'Productos Sin Azúcar', false, 'psa002.jpg', 6),
('PT001', 'Empanada de Manzana', 'Pastelería tradicional rellena de manzanas especiadas, perfecta para un dulce desayuno o merienda.', 3000, 'Pastelería Tradicional', false, 'pt001.jpg', 25),
('PT002', 'Tarta de Santiago', 'Tradicional tarta española hecha con almendras, azúcar, y huevos, una delicia para los amantes de los postres clásicos.', 6000, 'Pastelería Tradicional', false, 'pt002.jpg', 15),
('PG001', 'Brownie Sin Gluten', 'Rico y denso, este brownie es perfecto para quienes necesitan evitar el gluten sin sacrificar el sabor.', 4000, 'Productos Sin Gluten', false, 'pg001.jpg', 30),
('PG002', 'Pan Sin Gluten', 'Suave y esponjoso, ideal para sandwiches o para acompañar cualquier comida.', 3500, 'Productos Sin Gluten', false, 'pg002.jpg', 40),
('PV001', 'Torta Vegana de Chocolate', 'Torta de chocolate húmeda y deliciosa, hecha sin productos de origen animal, perfecta para veganos.', 50000, 'Productos Vegana', false, 'pv001.jpg', 10),
('PV002', 'Galletas Veganas de Avena', 'Crujientes y sabrosas, estas galletas son una excelente opción para un snack saludable y vegano.', 4500, 'Productos Vegana', false, 'pv002.jpg', 45),
('TE001', 'Torta Especial de Cumpleaños', 'Diseñada especialmente para celebraciones, personalizable con decoraciones y mensajes únicos.', 55000, 'Tortas Especiales', true, 'te001.jpg', 5),
('TE002', 'Torta Especial de Boda', 'Elegante y deliciosa, esta torta está diseñada para ser el centro de atención en cualquier boda.', 60000, 'Tortas Especiales', true, 'te002.jpg', 3);
```

---

**Generado el:** 02/12/2025  
**Total de productos:** 18  
**Proyecto:** Pastelería Mil Sabores - Sistema de E-commerce
