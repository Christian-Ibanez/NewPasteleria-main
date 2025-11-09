import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useUser } from '../../context/UserContext';
import { useProducts } from '../../context/ProductsContext';

const Cart: React.FC = () => {
  const { items, updateQuantity, clearCart } = useCart();
  const { user, addPedido } = useUser();
  const { products, updateProduct } = useProducts();
  const navigate = useNavigate();
  
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<string | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<string>('');

  const subtotal = items.reduce((sum, item) => 
    sum + (item.producto.precio * item.cantidad), 0
  );

  const calculateDiscount = () => {
    if (!user) return 0;
    const descuentoEspecial = user.descuentoEspecial || 0;
    return (subtotal * descuentoEspecial) / 100;
  };

  const total = subtotal - calculateDiscount();

  const handleUpdateQuantity = (productoId: string, newQuantity: number) => {
    const item = items.find(i => i.producto.id === productoId);
    const prod = products.find(p => p.id === productoId) || item?.producto;
    const available = prod?.stock ?? 0;
    const capped = Math.max(0, Math.min(newQuantity, available));
    if (item && item.cantidad === 1 && capped === 0) {
      setItemToRemove(productoId);
      setShowRemoveModal(true);
    } else {
      updateQuantity(productoId, capped);
    }
  };

  const handleConfirmRemove = () => {
    if (itemToRemove) {
      updateQuantity(itemToRemove, 0);
      setShowRemoveModal(false);
      setItemToRemove(null);
    }
  };

  const handleCheckout = () => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    // Preselect an address if none chosen yet
    const defaultAddr = user.direccionesEntrega && user.direccionesEntrega.length > 0
      ? user.direccionesEntrega[0]
      : (user.direccion || '');
    if (!selectedAddress && defaultAddr) setSelectedAddress(defaultAddr);

    setShowCheckoutModal(true);
  };

  const handleConfirmPurchase = (metodoPago?: 'efectivo' | 'tarjeta', tarjetaUltimos4?: string) => {
    if (!user) return;
    // Antes de crear el pedido, validar stock disponible
    const insuficientes = items.filter(it => {
      const prodLatest = products.find(p => p.id === it.producto.id);
      const available = prodLatest?.stock ?? it.producto.stock ?? 0;
      return it.cantidad > available;
    });
    if (insuficientes.length > 0) {
      const notification = document.createElement('div');
      notification.style.position = 'fixed';
      notification.style.bottom = '20px';
      notification.style.right = '20px';
      notification.style.backgroundColor = '#ffdddd';
      notification.style.color = '#5D4037';
      notification.style.padding = '12px 18px';
      notification.style.borderRadius = '5px';
      notification.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
      notification.style.zIndex = '2000';
      notification.textContent = `Algunos productos no tienen suficiente stock. Revisa tu carrito.`;
      document.body.appendChild(notification);
      setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => document.body.removeChild(notification), 400);
      }, 2200);
      return;
    }

    // Crear el pedido
    const newPedido = {
      id: Math.random().toString(36).substring(2, 11),
      usuarioId: (user as any).id || user.email,
      productos: items.map(item => ({
        productoId: item.producto.id,
        cantidad: item.cantidad,
        precio: item.producto.precio,
        nombre: item.producto.nombre,
        imagen: item.producto.imagen,
        personalizacion: item.personalizacion // Añadir el mensaje personalizado
      })),
      subtotal: subtotal,
      descuento: calculateDiscount(),
      total: total,
      estado: 'pendiente' as const,
      fechaPedido: new Date(),
      direccionEnvio: selectedAddress || user.direccion || '',
      metodoPago: metodoPago || 'efectivo',
      tarjetaUltimos4: tarjetaUltimos4
    };

    // Guardar el pedido en el historial del usuario
    addPedido(newPedido);
    setShowCheckoutModal(false);
    setShowSuccessModal(true);
    
    // Limpiar el carrito después de 2 segundos y redirigir al perfil
    setTimeout(() => {
      // Reducir stock de los productos comprados
      try {
        items.forEach(item => {
          const prodLatest = products.find(p => p.id === item.producto.id);
          const currentStock = prodLatest?.stock ?? item.producto.stock ?? 0;
          const newStock = Math.max(0, currentStock - item.cantidad);
          updateProduct(item.producto.id, { stock: newStock });
        });
      } catch (e) {
        // si algo falla, no bloqueamos el flujo de compra; la persistencia en products puede fallar si providers cambian
        console.error('Error actualizando stock:', e);
      }

      clearCart();
      setShowSuccessModal(false);
      navigate('/profile');
    }, 2000);
  };

  // Payment form state for checkout modal
  const [paymentMethod, setPaymentMethod] = useState<'efectivo' | 'tarjeta'>('efectivo');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [paymentErrors, setPaymentErrors] = useState<string[]>([]);

  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0,16);
    return digits.replace(/(.{4})/g, '$1 ').trim();
  };

  const validateCardFields = () => {
    const errors: string[] = [];
    const digits = cardNumber.replace(/\s/g, '');
    if (digits.length !== 16) errors.push('El número de tarjeta debe tener 16 dígitos.');
    // expiry MM/YY or MM/YYYY
    const exp = cardExpiry.replace(/\s/g, '');
    const mmyy = exp.split('/');
    if (mmyy.length !== 2) errors.push('La fecha de vencimiento debe tener formato MM/AA.');
    else {
      const mm = parseInt(mmyy[0], 10);
      const yy = parseInt(mmyy[1], 10);
      if (!(mm >=1 && mm <=12)) errors.push('Mes de vencimiento inválido.');
      // basic future check (assume YY or YYYY)
      const now = new Date();
      let year = yy;
      if (mmyy[1].length === 2) year = 2000 + yy;
      if (mmyy[1].length === 4) year = yy;
      const expDate = new Date(year, mm - 1, 1);
      if (expDate < new Date(now.getFullYear(), now.getMonth(), 1)) errors.push('La tarjeta está vencida.');
    }
  if (!cardName || cardName.trim().length < 2) errors.push('Ingresa el nombre en la tarjeta.');
  if (!/^[0-9]{3}$/.test(cardCvv)) errors.push('CVV inválido (3 dígitos).');
    setPaymentErrors(errors);
    return errors.length === 0;
  };

  const handleConfirmPayment = () => {
    if (paymentMethod === 'efectivo') {
      handleConfirmPurchase('efectivo');
      return;
    }

    // tarjeta
    if (validateCardFields()) {
      // could store partial payment info like last4 if desired
      const digits = cardNumber.replace(/\s/g, '');
      const last4 = digits.slice(-4);
      handleConfirmPurchase('tarjeta', last4);
    }
  };

  // Añade esta función helper dentro del componente Cart
  const resolveImageSrc = (imagen?: string) => {
    if (!imagen) return '/images/productos/placeholder.jpg';
    if (imagen.startsWith('data:')) return imagen; // Si es base64
    if (imagen.startsWith('http') || imagen.startsWith('/')) return imagen; // Si es URL o ruta absoluta
    return `/images/productos/${imagen}`; // Si es nombre de archivo
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4" style={{ fontFamily: 'Pacifico, cursive', color: '#5D4037' }}>
        Tu Carrito
      </h2>

      {items.length === 0 ? (
        <div className="text-center">
          <p>Tu carrito está vacío</p>
          <button
            className="btn"
            onClick={() => navigate('/catalogo')}
            style={{ backgroundColor: '#FFC0CB', borderColor: '#FFC0CB', color: 'black' }}
          >
            Ver Catálogo
          </button>
        </div>
      ) : (
        <>
          <div className="card shadow" style={{ backgroundColor: '#FFF5E1' }}>
            <div className="card-body">
              {items.map((item) => (
                <div key={item.producto.id} className="row mb-4 align-items-center p-3 bg-white rounded shadow-sm">
                  <div className="col-md-3">
                    <div className="position-relative" style={{ 
                      height: '120px',
                      width: '120px',
                      overflow: 'hidden',
                      borderRadius: '10px',
                      margin: '0 auto',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}>
                      <img
                        src={resolveImageSrc(item.producto.imagen)}
                        alt={item.producto.nombre}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/images/productos/placeholder.jpg';
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <h5>{item.producto.nombre}</h5>
                    <p className="text-muted">${item.producto.precio.toLocaleString('es-CL')} CLP</p>
                    {item.personalizacion && (
                      <small className="d-block text-muted">
                        <i className="bi bi-pencil-square me-1"></i>
                        Mensaje: {item.personalizacion}
                      </small>
                    )}
                  </div>
                  <div className="col-md-3">
                    <div className="input-group">
                      <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={() => handleUpdateQuantity(item.producto.id, item.cantidad - 1)}
                      >
                        -
                      </button>
                      <input
                        type="number"
                        className="form-control text-center"
                        value={item.cantidad}
                        onChange={(e) => handleUpdateQuantity(item.producto.id, parseInt(e.target.value) || 0)}
                      />
                      <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={() => handleUpdateQuantity(item.producto.id, item.cantidad + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="col-md-2 text-end">
                    <p className="fw-bold">
                      ${(item.producto.precio * item.cantidad).toLocaleString('es-CL')} CLP
                    </p>
                  </div>
                </div>
              ))}
              <div className="my-3">
                <label className="form-label">Dirección de entrega</label>
                {user?.direccionesEntrega && user.direccionesEntrega.length > 0 ? (
                  <select
                    className="form-select"
                    value={selectedAddress}
                    onChange={(e) => setSelectedAddress(e.target.value)}
                  >
                    {user.direccionesEntrega.map((d: string, idx: number) => (
                      <option key={idx} value={d}>{d}</option>
                    ))}
                  </select>
                ) : (
                  <div className="text-muted">No tienes direcciones guardadas. Se usará tu dirección principal si está disponible.</div>
                )}
                <div className="mt-2">
                  <button
                    type="button"
                    className="btn btn-link p-0"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowCheckoutModal(false);
                      navigate('/profile');
                    }}
                  >
                    Agregar/editar direcciones
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="card mt-3 shadow" style={{ backgroundColor: '#FFF5E1' }}>
            <div className="card-body">
              <div className="d-flex flex-column">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h5 className="mb-0">Subtotal:</h5>
                  <h5 className="mb-0">${subtotal.toLocaleString('es-CL')} CLP</h5>
                </div>

                {user?.descuentoEspecial && user.descuentoEspecial > 0 && (
                  <div className="d-flex justify-content-between align-items-center mb-2 text-success">
                    <h6 className="mb-0">
                      <i className="bi bi-tag-fill me-2"></i>
                      Descuento ({user.descuentoEspecial}%):
                    </h6>
                    <h6 className="mb-0">-${calculateDiscount().toLocaleString('es-CL')} CLP</h6>
                  </div>
                )}

                <div className="d-flex justify-content-between align-items-center mt-2">
                  <h4 className="mb-0">Total a pagar:</h4>
                  <h4 className="mb-0">${total.toLocaleString('es-CL')} CLP</h4>
                </div>
              </div>
              <button
                className="btn w-100 mt-3"
                onClick={handleCheckout}
                style={{ backgroundColor: '#FFC0CB', borderColor: '#FFC0CB', color: 'black' }}
              >
                Proceder al Pago
              </button>
            </div>
          </div>
        </>
      )}

      {/* Modal de confirmación para eliminar producto */}
      {showRemoveModal && (
        <div className="modal-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="modal-content" style={{
            backgroundColor: '#FFF5E1',
            padding: '20px',
            borderRadius: '8px',
            maxWidth: '400px',
            width: '90%'
          }}>
            <div className="modal-header">
              <h5 className="modal-title">Confirmar eliminación</h5>
              <button
                onClick={() => setShowRemoveModal(false)}
                className="btn-close"
                style={{ float: 'right' }}
              ></button>
            </div>
            <div className="modal-body my-3">
              ¿Estás seguro que deseas eliminar este producto del carrito?
            </div>
            <div className="modal-footer">
              <button
                className="btn"
                onClick={() => setShowRemoveModal(false)}
                style={{ backgroundColor: '#8B4513', borderColor: '#8B4513', color: 'white' }}
              >
                Cancelar
              </button>
              <button
                className="btn ms-2"
                onClick={handleConfirmRemove}
                style={{ backgroundColor: '#FFC0CB', borderColor: '#FFC0CB', color: '#5D4037' }}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de checkout */}
      {showCheckoutModal && (
        <div className="modal-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="modal-content" style={{
            backgroundColor: '#FFF5E1',
            padding: '20px',
            borderRadius: '8px',
            maxWidth: '800px',
            width: '90%'
          }}>
            <div className="modal-header">
              <h5 className="modal-title">Confirmar Compra</h5>
              <button
                onClick={() => setShowCheckoutModal(false)}
                className="btn-close"
                style={{ float: 'right' }}
              ></button>
            </div>
            <div className="modal-body my-3">
              <h5 className="mb-4">Resumen de tu pedido:</h5>
              {items.map((item) => (
                <div key={item.producto.id} className="d-flex justify-content-between align-items-center mb-3">
                  <div className="d-flex align-items-center">
                    <img
                      src={resolveImageSrc(item.producto.imagen)}
                      alt={item.producto.nombre}
                      style={{ width: '50px', height: '50px', objectFit: 'cover', marginRight: '15px', borderRadius: '5px' }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/images/productos/placeholder.jpg';
                      }}
                    />
                    <div>
                      <h6 className="mb-0">{item.producto.nombre}</h6>
                      <small className="text-muted">Cantidad: {item.cantidad}</small>
                      {item.personalizacion && (
                        <small className="d-block text-muted">
                          <i className="bi bi-pencil-square me-1"></i>
                          {item.personalizacion}
                        </small>
                      )}
                    </div>
                  </div>
                  <div className="text-end">
                    <div>${item.producto.precio.toLocaleString('es-CL')} CLP c/u</div>
                    <strong>${(item.producto.precio * item.cantidad).toLocaleString('es-CL')} CLP</strong>
                  </div>
                </div>
              ))}
              <div className="border-top pt-3 mt-3">
                <div className="row align-items-center mb-2">
                  <div className="col">
                    <h5 className="mb-0">Subtotal:</h5>
                  </div>
                  <div className="col-auto">
                    <h5 className="mb-0">${subtotal.toLocaleString('es-CL')} CLP</h5>
                  </div>
                </div>
                
                {user?.descuentoEspecial && user.descuentoEspecial > 0 && (
                  <div className="row align-items-center mb-2 text-success">
                    <div className="col">
                      <h6 className="mb-0">
                        <i className="bi bi-tag-fill me-2"></i>
                        Descuento ({user.descuentoEspecial}%):
                      </h6>
                    </div>
                    <div className="col-auto">
                      <h6 className="mb-0">-${calculateDiscount().toLocaleString('es-CL')} CLP</h6>
                    </div>
                  </div>
                )}

                <div className="row align-items-center mt-3">
                  <div className="col">
                    <h4 className="mb-0">Total a pagar:</h4>
                  </div>
                  <div className="col-auto">
                    <h4 className="mb-0">${total.toLocaleString('es-CL')} CLP</h4>
                  </div>
                </div>

                {/* Payment method selector */}
                <div className="mt-4">
                  <label className="form-label">Método de Pago</label>
                  <div className="d-flex gap-3 mb-3">
                    <div>
                      <label style={{ cursor: 'pointer' }}>
                        <input type="radio" name="payment" checked={paymentMethod === 'efectivo'} onChange={() => setPaymentMethod('efectivo')} />{' '}
                        Efectivo
                      </label>
                    </div>
                    <div>
                      <label style={{ cursor: 'pointer' }}>
                        <input type="radio" name="payment" checked={paymentMethod === 'tarjeta'} onChange={() => setPaymentMethod('tarjeta')} />{' '}
                        Tarjeta (débito/crédito)
                      </label>
                    </div>
                  </div>

                  {paymentMethod === 'tarjeta' && (
                    <div className="card p-3" style={{ background: '#fff' }}>
                      <div className="mb-3">
                        <label className="form-label">Número de tarjeta</label>
                        <input
                          className="form-control"
                          placeholder="1234 5678 9012 3456"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                        />
                      </div>

                      <div className="row">
                        <div className="col-md-4 mb-3">
                          <label className="form-label">Fecha de vencimiento (MM/AA)</label>
                          <input
                            className="form-control"
                            placeholder="MM/AA"
                            value={cardExpiry}
                            onChange={(e) => {
                              // format simple MM/YY
                              const digits = e.target.value.replace(/\D/g, '').slice(0,4);
                              let formatted = digits;
                              if (digits.length > 2) formatted = digits.slice(0,2) + '/' + digits.slice(2);
                              setCardExpiry(formatted);
                            }}
                          />
                        </div>
                        <div className="col-md-5 mb-3">
                          <label className="form-label">Nombre en la tarjeta</label>
                          <input
                            className="form-control"
                            value={cardName}
                            aria-describedby="cardNameHelp"
                            onChange={(e) => {
                              // permitir sólo letras (incluye acentos) y espacios
                              const cleaned = e.target.value.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ\s]/g, '');
                              setCardName(cleaned);
                            }}
                          />
                          <div id="cardNameHelp" className="form-text text-muted">Solo letras y espacios.</div>
                        </div>
                        <div className="col-md-3 mb-3">
                          <label className="form-label">CVV</label>
                          <input
                            className="form-control"
                            value={cardCvv}
                            aria-describedby="cardCvvHelp"
                            onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0,3))}
                            placeholder="123"
                          />
                          <div id="cardCvvHelp" className="form-text text-muted">CVV: 3 dígitos.</div>
                        </div>
                      </div>

                      {paymentErrors.length > 0 && (
                        <div className="mt-2 text-danger">
                          {paymentErrors.map((err, idx) => (
                            <div key={idx}>{err}</div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn"
                onClick={() => setShowCheckoutModal(false)}
                style={{ backgroundColor: '#8B4513', borderColor: '#8B4513', color: 'white' }}
              >
                Cancelar
              </button>
              <button
                className="btn ms-2"
                onClick={handleConfirmPayment}
                style={{ backgroundColor: '#FFC0CB', borderColor: '#FFC0CB', color: '#5D4037' }}
              >
                Pagar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de compra exitosa */}
      {showSuccessModal && (
        <div className="modal-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="modal-content text-center" style={{
            backgroundColor: '#FFF5E1',
            padding: '30px',
            borderRadius: '8px',
            maxWidth: '400px',
            width: '90%'
          }}>
            <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '3rem' }}></i>
            <h4 className="mt-3">¡Compra realizada con éxito!</h4>
            <p className="mb-0">Tu pedido ha sido registrado correctamente.</p>
          </div>
        </div>
      )}

      {/* Modal de inicio de sesión requerido */}
      {showLoginModal && (
        <div className="modal-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="modal-content" style={{
            backgroundColor: '#FFF5E1',
            padding: '30px',
            borderRadius: '8px',
            maxWidth: '400px',
            width: '90%'
          }}>
            <div className="text-center">
              <i className="bi bi-person-x-fill text-danger" style={{ fontSize: '3rem' }}></i>
              <h4 className="mt-3">Inicio de sesión requerido</h4>
              <p className="mb-4">Para realizar la compra, necesitas iniciar sesión en tu cuenta.</p>
              <button
                className="btn w-100 mb-3"
                onClick={() => {
                  setShowLoginModal(false);
                  navigate('/login');
                }}
                style={{ backgroundColor: '#FFC0CB', borderColor: '#FFC0CB', color: '#5D4037' }}
              >
                Iniciar Sesión
              </button>
              <button
                className="btn w-100"
                onClick={() => setShowLoginModal(false)}
                style={{ backgroundColor: '#8B4513', borderColor: '#8B4513', color: 'white' }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;