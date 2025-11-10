import { vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import renderWithProviders from '../utils/renderWithProviders';
import ProductModal from '../../src/components/ProductModal';

const sampleProduct = {
  id: 'TEST1',
  codigo: 'TEST1',
  categoria: 'Test',
  nombre: 'Producto Test',
  precio: 12345,
  descripcion: 'Descripción de prueba',
  esPersonalizable: false,
  imagen: 'pt001.jpg',
  stock: 5,
};

describe('Modal de producto', () => {
  test('renderiza información del producto y llama a onClose', () => {
    const onClose = vi.fn();
    renderWithProviders(<ProductModal producto={sampleProduct as any} visible={true} onClose={onClose} />);
    expect(screen.getByText('Producto Test')).toBeInTheDocument();
    // check add to cart button exists
    expect(screen.getByText('Agregar al carrito')).toBeInTheDocument();
    const closeBtn = screen.getByLabelText('Cerrar');
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalled();
  });
});
