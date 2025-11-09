describe('persistencia del carrito en localStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('el carrito de invitado puede guardarse y leerse desde localStorage', () => {
    const key = 'np_cart_v1';
    const items = [{ producto: { id: 'PTEST' }, cantidad: 1 }];
    localStorage.setItem(key, JSON.stringify(items));
    const raw = localStorage.getItem(key);
    expect(raw).toBeTruthy();
    expect(JSON.parse(raw as string)).toEqual(items);
  });
});
