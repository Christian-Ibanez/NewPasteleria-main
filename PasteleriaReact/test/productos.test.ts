import { CATALOGO_PRODUCTOS } from '../src/data/productos';

describe('catálogo de productos', () => {
  test('debería tener al menos un producto', () => {
    expect(Array.isArray(CATALOGO_PRODUCTOS)).toBe(true);
    expect(CATALOGO_PRODUCTOS.length).toBeGreaterThan(0);
  });

  test('debería contener el producto con id TC001', () => {
    const p = CATALOGO_PRODUCTOS.find(p => p.id === 'TC001');
    expect(p).toBeDefined();
    if (p) expect(p.precio).toBeGreaterThan(0);
  });
});
