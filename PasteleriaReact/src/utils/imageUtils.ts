/**
 * Imagen placeholder - ruta a la imagen por defecto
 */
const PLACEHOLDER_IMAGE = '/images/productos/imagenpasteleria.jpg';

/**
 * Cache de imágenes que no existen para evitar reintentarlas
 */
const failedImages = new Set<string>();

/**
 * Resuelve la ruta de la imagen de un producto
 * @param imagen - Nombre del archivo de imagen, URL completa, o base64
 * @param codigo - Código del producto (opcional, para fallback)
 * @returns URL completa de la imagen o placeholder
 */
export const resolveImageSrc = (imagen?: string | null, codigo?: string): string => {
  // Si no hay imagen, usar placeholder
  if (!imagen || imagen.trim() === '') {
    return PLACEHOLDER_IMAGE;
  }

  // Si es una imagen base64
  if (imagen.startsWith('data:')) {
    return imagen;
  }

  // Si es una URL completa (http:// o https://)
  if (imagen.startsWith('http://') || imagen.startsWith('https://')) {
    // Si esta URL ya falló antes, usar placeholder
    if (failedImages.has(imagen)) {
      return PLACEHOLDER_IMAGE;
    }
    return imagen;
  }

  // Construir la ruta de la imagen
  let imagePath: string;
  
  // Si es una ruta absoluta que empieza con /
  if (imagen.startsWith('/')) {
    imagePath = imagen;
  } else {
    // Si es solo el nombre del archivo, agregarlo a la ruta de productos
    imagePath = `/images/productos/${imagen}`;
  }

  // Si esta ruta ya falló antes, usar placeholder directamente
  if (failedImages.has(imagePath)) {
    return PLACEHOLDER_IMAGE;
  }

  return imagePath;
};

/**
 * Handler para cuando una imagen falla al cargar
 * Reemplaza la imagen con un placeholder
 */
export const handleImageError = (
  e: React.SyntheticEvent<HTMLImageElement, Event>
): void => {
  const target = e.target as HTMLImageElement;
  
  // Agregar la URL que falló al cache
  if (target.src && !target.src.includes('imagenpasteleria.jpg')) {
    failedImages.add(target.src);
  }
  
  // Evitar loop infinito - solo reemplazar una vez
  if (!target.dataset.errorHandled) {
    target.dataset.errorHandled = 'true';
    target.src = PLACEHOLDER_IMAGE;
  }
};

/**
 * Estilos comunes para imágenes de productos
 */
export const productImageStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
};
