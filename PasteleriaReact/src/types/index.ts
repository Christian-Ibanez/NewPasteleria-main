export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  password?: string;
  direccion?: string;
  direccionesEntrega?: string[];
  telefono?: string;
  historialPedidos?: Pedido[];
  fechaNacimiento: string;
  descuentoEspecial?: number;
  codigoDescuento?: string;
  esDuoc?: boolean;
  cumpleanos?: string;
}

export interface Producto {
  id: string;
  codigo: string;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
  imagen?: string;
  esPersonalizable?: boolean;
  stock: number;
}

export interface Pedido {
  id: string;
  usuarioId: string;
  productos: {
    productoId: string;
    cantidad: number;
    precio: number;
    nombre: string;
    imagen: string;
  }[];
  total: number;
  estado: 'pendiente' | 'preparacion' | 'enviado' | 'entregado';
  fechaPedido: Date;
  direccionEnvio: string;
}

export interface CarritoItem {
  producto: Producto;
  cantidad: number;
  // Mensaje opcional de personalización para el producto (ej. dedicatoria en tortas)
  personalizacion?: string;
}

export interface AuthState {
  user: Usuario | null;
  loading: boolean;
  error: string | null;
}