import React from 'react';
import { render } from '@testing-library/react';
import type { RenderResult } from '@testing-library/react';
import { UserProvider } from '../../src/context/UserContext';
import { CartProvider } from '../../src/context/CartContext';
import { ProductsProvider } from '../../src/context/ProductsContext';

export default function renderWithProviders(ui: React.ReactElement): RenderResult {
  return render(
    <UserProvider>
      <CartProvider>
        <ProductsProvider>{ui}</ProductsProvider>
      </CartProvider>
    </UserProvider>
  );
}
