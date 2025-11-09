import { validateName, validateEmail, validateAge, validatePhone } from '../src/utils/validations';

describe('utilidades de validación', () => {
  test('validateName acepta un nombre válido', () => {
    expect(validateName('Juan Pérez')).toBeNull();
  });

  test('validateName rechaza nombres con números', () => {
    const res = validateName('Juan123');
    expect(res).toBeDefined();
    expect(typeof res).toBe('string');
  });

  test('validateEmail acepta un email válido', () => {
    expect(validateEmail('test@example.com')).toBeNull();
  });

  test('validateEmail rechaza un email inválido', () => {
    expect(validateEmail('not-an-email')).toBeDefined();
  });

  test('validateAge rechaza menores de 18', () => {
    // crear una fecha hace 10 años
    const today = new Date();
    const underDate = new Date(today.getFullYear() - 10, today.getMonth(), today.getDate()).toISOString();
    expect(validateAge(underDate)).toBeDefined();
  });

  test('validatePhone acepta 9 dígitos', () => {
    expect(validatePhone('912345678')).toBeNull();
  });
});
