import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { REGIONES_COMUNAS, validateName, validateEmail, validateAge, validatePhone } from '../../utils/validations';

const USERS_KEY_OLD = 'users';
const USERS_KEY_CONTEXT = 'np_users_v1';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: '',
    calle: '',
    numero: '',
    telefono: '',
    fechaNacimiento: '',
    codigoDescuento: ''
  });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [region, setRegion] = useState('');
  const [comuna, setComuna] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target as HTMLInputElement;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    const nameError = validateName(formData.nombre);
    if (nameError) newErrors.nombre = nameError;

    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;

    const ageError = validateAge(formData.fechaNacimiento);
    if (ageError) newErrors.fechaNacimiento = ageError;

    const phoneError = validatePhone(formData.telefono);
    if (phoneError) newErrors.telefono = phoneError;

    if (!region) newErrors.region = 'Debes seleccionar una región';
    if (!comuna) newErrors.comuna = 'Debes seleccionar una comuna';
    if (!formData.calle) newErrors.calle = 'Debes ingresar una calle';
    if (!formData.numero) newErrors.numero = 'Debes ingresar un número';

    // Validar confirmación de contraseña
    if (!formData.password) newErrors.password = 'Debes ingresar una contraseña';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Las contraseñas no coinciden';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const persistToBothKeys = (newUser: any) => {
    // Guardar en key antigua 'users'
    try {
      const usersOld = JSON.parse(localStorage.getItem(USERS_KEY_OLD) || '[]');
      usersOld.push(newUser);
      localStorage.setItem(USERS_KEY_OLD, JSON.stringify(usersOld));
    } catch {
      // ignore
    }

    // Guardar también en la key usada por el contexto (np_users_v1) para consistencia
    try {
      const usersCtx = JSON.parse(localStorage.getItem(USERS_KEY_CONTEXT) || '[]');
      // evitar duplicados por email
      const exists = usersCtx.some((u: any) => u.email?.toLowerCase() === newUser.email.toLowerCase());
      if (!exists) {
        usersCtx.push(newUser);
        localStorage.setItem(USERS_KEY_CONTEXT, JSON.stringify(usersCtx));
      }
    } catch {
      // ignore
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    if (existingUsers.some((u: { email: string }) => u.email.toLowerCase() === formData.email.toLowerCase())) {
      setError('Este email ya está registrado');
      setTimeout(() => setError(''), 4000);
      return;
    }

    try {
      const fechaNacimiento = new Date(formData.fechaNacimiento);
      const hoy = new Date();
      let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
      const mes = hoy.getMonth() - fechaNacimiento.getMonth();
      if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) edad--;

      const esDuoc = formData.email.toLowerCase().endsWith('@duocuc.cl');
      const descuentoEdad = edad >= 50 ? 50 : 0;
      const descuentoCodigo = formData.codigoDescuento === 'FELICES50' ? 10 : 0;
      const cumpleanos = !!formData.fechaNacimiento;

      const newUser = {
        id: crypto.randomUUID(),
        nombre: formData.nombre,
        email: formData.email,
        // <-- La contraseña se almacena aquí en localStorage
        password: formData.password,
        direccion: `${formData.calle} ${formData.numero}, ${comuna}, ${region}`,
        telefono: formData.telefono,
        direccionesEntrega: [`${formData.calle} ${formData.numero}, ${comuna}, ${region}`],
        historialPedidos: [],
        fechaNacimiento: formData.fechaNacimiento,
        descuentoEspecial: Math.max(descuentoEdad, descuentoCodigo),
        codigoDescuento: formData.codigoDescuento,
        esDuoc,
        cumpleanos
      };

      // Persistir en localStorage (ambas keys para compatibilidad)
      persistToBothKeys(newUser);

      // Mensajes/redirect
      let beneficiosMessage = '';
      if (newUser.esDuoc) beneficiosMessage += '¡Felicitaciones! Como estudiante DUOC, recibirás una torta gratis en tu cumpleaños. ';
      if (newUser.descuentoEspecial > 0) beneficiosMessage += `Se ha aplicado un descuento especial del ${newUser.descuentoEspecial}% a tu cuenta. `;

      setMessage(beneficiosMessage || 'Registro exitoso');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      if (err instanceof Error) setError(`Error al registrar usuario: ${err.message}`);
      else setError('Ocurrió un error inesperado durante el registro.');
      setTimeout(() => setError(''), 5000);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow" style={{ backgroundColor: '#FFF5E1' }}>
            <div className="card-body">
              <h2 className="text-center mb-4" style={{ fontFamily: 'Pacifico, cursive', color: '#5D4037' }}>
                Registro
              </h2>

              {error && <div className="alert alert-danger">{error}</div>}
              {message && <div className="alert alert-success">{message}</div>}

              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="nombre" className="form-label">Nombre completo</label>
                    <input
                      type="text"
                      className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
                      id="nombre"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      required
                    />
                    {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
                  </div>

                  <div className="col-md-6 mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                      type="email"
                      className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="password" className="form-label">Contraseña</label>
                    <input
                      type="password"
                      className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                    {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                  </div>

                  <div className="col-md-6 mb-3">
                    <label htmlFor="confirmPassword" className="form-label">Confirmar contraseña</label>
                    <input
                      type="password"
                      className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                    {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="telefono" className="form-label">Teléfono</label>
                    <input
                      type="tel"
                      className={`form-control ${errors.telefono ? 'is-invalid' : ''}`}
                      id="telefono"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                    />
                    {errors.telefono && <div className="invalid-feedback">{errors.telefono}</div>}
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="fechaNacimiento" className="form-label">Fecha de Nacimiento</label>
                  <input
                    type="date"
                    className={`form-control ${errors.fechaNacimiento ? 'is-invalid' : ''}`}
                    id="fechaNacimiento"
                    name="fechaNacimiento"
                    value={formData.fechaNacimiento}
                    onChange={handleChange}
                    required
                    max={new Date().toISOString().split('T')[0]}
                  />
                  {errors.fechaNacimiento && (
                    <div className="invalid-feedback">
                      {errors.fechaNacimiento}
                    </div>
                  )}
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="codigoDescuento" className="form-label">Código de descuento (opcional)</label>
                    <input
                      type="text"
                      className="form-control"
                      id="codigoDescuento"
                      name="codigoDescuento"
                      value={formData.codigoDescuento}
                      onChange={handleChange}
                      placeholder="FELICES50"
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="region" className="form-label">Región</label>
                    <select
                      className={`form-select ${errors.region ? 'is-invalid' : ''}`}
                      id="region"
                      value={region}
                      onChange={(e) => {
                        setRegion(e.target.value);
                        setComuna('');
                      }}
                      required
                    >
                      <option value="">Seleccione una región</option>
                      {Object.keys(REGIONES_COMUNAS).map(r => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                    {errors.region && <div className="invalid-feedback">{errors.region}</div>}
                  </div>

                  <div className="col-md-6 mb-3">
                    <label htmlFor="comuna" className="form-label">Comuna</label>
                    <select
                      className={`form-select ${errors.comuna ? 'is-invalid' : ''}`}
                      id="comuna"
                      value={comuna}
                      onChange={(e) => setComuna(e.target.value)}
                      disabled={!region}
                      required
                    >
                      <option value="">Seleccione una comuna</option>
                      {region && REGIONES_COMUNAS[region]?.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    {errors.comuna && <div className="invalid-feedback">{errors.comuna}</div>}
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-8 mb-3">
                    <label htmlFor="calle" className="form-label">Calle</label>
                    <input
                      type="text"
                      className={`form-control ${errors.calle ? 'is-invalid' : ''}`}
                      id="calle"
                      name="calle"
                      value={formData.calle}
                      onChange={handleChange}
                      placeholder="Ej: Av. Principal"
                      required
                    />
                    {errors.calle && <div className="invalid-feedback">{errors.calle}</div>}
                  </div>

                  <div className="col-md-4 mb-3">
                    <label htmlFor="numero" className="form-label">Número</label>
                    <input
                      type="text"
                      className={`form-control ${errors.numero ? 'is-invalid' : ''}`}
                      id="numero"
                      name="numero"
                      value={formData.numero}
                      onChange={handleChange}
                      placeholder="Ej: 123"
                      required
                    />
                    {errors.numero && <div className="invalid-feedback">{errors.numero}</div>}
                  </div>

                  <div className="col-12 mb-3">
                    <label className="form-label">Dirección completa</label>
                    <input
                      type="text"
                      className="form-control"
                      value={`${formData.calle} ${formData.numero}, ${comuna}, ${region}`}
                      readOnly
                      disabled
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn w-100 mb-3"
                  style={{ backgroundColor: '#FFC0CB', borderColor: '#FFC0CB', color: 'black' }}
                >
                  Registrarse
                </button>

                <div className="text-center">
                  <p>
                    ¿Ya tienes cuenta?{' '}
                    <Link to="/login" style={{ color: '#5D4037' }}>
                      Inicia sesión aquí
                    </Link>
                  </p>
                </div>
              </form>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;