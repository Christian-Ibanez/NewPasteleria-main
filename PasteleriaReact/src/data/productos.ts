// Define la interfaz (forma) de un producto
export interface Producto {
  id: string;
  codigo: string;
  categoria: string;
  nombre: string;
  precio: number;
  descripcion: string;
  esPersonalizable: boolean;
  imagen?: string; // nombre del archivo en /public/images/productos/
  stock: number;
}

// Array de productos (usando datos del documento)
export const CATALOGO_PRODUCTOS: Producto[] = [
  // --- TORTAS CUADRADAS ---
  {
    id: "TC001",
    codigo: "TC001",
    categoria: "Tortas Cuadradas",
    nombre: "Torta Cuadrada de Chocolate",
    precio: 45000,
    descripcion: "Deliciosa torta de chocolate con capas de ganache y un toque de avellanas. Personalizable con mensajes especiales.",
    esPersonalizable: true,
    imagen: 'tc001.jpg',
    stock: 10,
  },
  {
    id: "TC002",
    codigo: "TC002",
    categoria: "Tortas Cuadradas",
    nombre: "Torta Cuadrada de Frutas",
    precio: 50000,
    descripcion: "Una mezcla de frutas frescas y crema chantilly sobre un suave bizcocho de vainilla, ideal para celebraciones.",
    esPersonalizable: false,
    imagen: 'tc002.jpg',
    stock: 8,
  },

  // --- TORTAS CIRCULARES ---
  {
    id: "TT001",
    codigo: "TT001",
    categoria: "Tortas Circulares",
    nombre: "Torta Circular de Vainilla",
    precio: 40000,
    descripcion: "Bizcocho de vainilla clásico relleno con crema pastelera y cubierto con un glaseado dulce, perfecto para cualquier ocasión.",
    esPersonalizable: false,
    imagen: 'tt001.jpg',
    stock: 12,
  },
  {
    id: "TT002",
    codigo: "TT002",
    categoria: "Tortas Circulares",
    nombre: "Torta Circular de Manjar",
    precio: 42000,
    descripcion: "Torta tradicional chilena con manjar y nueces, un deleite para los amantes de los sabores dulces y clásicos.",
    esPersonalizable: false,
    imagen: 'tt002.jpg',
    stock: 15,
  },

  // --- POSTRES INDIVIDUALES ---
  {
    id: "P1001",
    codigo: "P1001",
    categoria: "Postres Individuales",
    nombre: "Mousse de Chocolate",
    precio: 5000,
    descripcion: "Postre individual cremoso y suave, hecho con chocolate de alta calidad, ideal para los amantes del chocolate.",
    esPersonalizable: false,
    imagen: 'pi001.jpg',
    stock: 20,
  },
  {
    id: "P1002",
    codigo: "P1002",
    categoria: "Postres Individuales",
    nombre: "Tiramisú Clásico",
    precio: 5500,
    descripcion: "Un postre italiano individual con capas de café, mascarpone y cacao, perfecto para finalizar cualquier comida.",
    esPersonalizable: false,
    imagen: 'pi002.jpg',
    stock: 18,
  },

  // --- PRODUCTOS SIN AZÚCAR ---
  {
    id: "PSA001",
    codigo: "PSA001",
    categoria: "Productos Sin Azúcar",
    nombre: "Torta Sin Azúcar de Naranja",
    precio: 48000,
    descripcion: "Torta ligera y deliciosa, endulzada naturalmente, ideal para quienes buscan opciones más saludables.",
    esPersonalizable: false,
    imagen: 'psa001.jpg',
    stock: 8,
  },
  {
    id: "PSA002",
    codigo: "PSA002",
    categoria: "Productos Sin Azúcar",
    nombre: "Cheesecake Sin Azúcar",
    precio: 47000,
    descripcion: "Suave y cremoso, este cheesecake es una opción perfecta para disfrutar sin culpa.",
    esPersonalizable: false,
    imagen: 'psa002.jpg',
    stock: 6,
  },

  // --- PASTELERÍA TRADICIONAL ---
  {
    id: "PT001",
    codigo: "PT001",
    categoria: "Pastelería Tradicional",
    nombre: "Empanada de Manzana",
    precio: 3000,
    descripcion: "Pastelería tradicional rellena de manzanas especiadas, perfecta para un dulce desayuno o merienda.",
    esPersonalizable: false,
    imagen: 'pt001.jpg',
    stock: 25,
  },
  {
    id: "PT002",
    codigo: "PT002",
    categoria: "Pastelería Tradicional",
    nombre: "Tarta de Santiago",
    precio: 6000,
    descripcion: "Tradicional tarta española hecha con almendras, azúcar, y huevos, una delicia para los amantes de los postres clásicos.",
    esPersonalizable: false,
    imagen: 'pt002.jpg',
    stock: 15,
  },

  // --- PRODUCTOS SIN GLUTEN ---
  {
    id: "PG001",
    codigo: "PG001",
    categoria: "Productos Sin Gluten",
    nombre: "Brownie Sin Gluten",
    precio: 4000,
    descripcion: "Rico y denso, este brownie es perfecto para quienes necesitan evitar el gluten sin sacrificar el sabor.",
    esPersonalizable: false,
    imagen: 'pg001.jpg',
    stock: 30,
  },
  {
    id: "PG002",
    codigo: "PG002",
    categoria: "Productos Sin Gluten",
    nombre: "Pan Sin Gluten",
    precio: 3500,
    descripcion: "Suave y esponjoso, ideal para sandwiches o para acompañar cualquier comida.",
    esPersonalizable: false,
    imagen: 'pg002.jpg',
    stock: 40,
  },

  // --- PRODUCTOS VEGANOS ---
  {
    id: "PV001",
    codigo: "PV001",
    categoria: "Productos Vegana",
    nombre: "Torta Vegana de Chocolate",
    precio: 50000,
    descripcion: "Torta de chocolate húmeda y deliciosa, hecha sin productos de origen animal, perfecta para veganos.",
    esPersonalizable: false,
    imagen: 'pv001.jpg',
    stock: 10,
  },
  {
    id: "PV002",
    codigo: "PV002",
    categoria: "Productos Vegana",
    nombre: "Galletas Veganas de Avena",
    precio: 4500,
    descripcion: "Crujientes y sabrosas, estas galletas son una excelente opción para un snack saludable y vegano.",
    esPersonalizable: false,
    imagen: 'pv002.jpg',
    stock: 45,
  },

  // --- TORTAS ESPECIALES ---
  {
    id: "TE001",
    codigo: "TE001",
    categoria: "Tortas Especiales",
    nombre: "Torta Especial de Cumpleaños",
    precio: 55000,
    descripcion: "Diseñada especialmente para celebraciones, personalizable con decoraciones y mensajes únicos.",
    esPersonalizable: true,
    imagen: 'te001.jpg',
    stock: 5,
  },
  {
    id: "TE002",
    codigo: "TE002",
    categoria: "Tortas Especiales",
    nombre: "Torta Especial de Boda",
    precio: 60000,
    descripcion: "Elegante y deliciosa, esta torta está diseñada para ser el centro de atención en cualquier boda.",
    esPersonalizable: true,
    imagen: 'te002.jpg',
    stock: 3,
  },
];