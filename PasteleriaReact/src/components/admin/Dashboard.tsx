import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../../context/UserContext';

const Dashboard: React.FC = () => {
  const { currentUser, users, deleteUser, logout, isAdmin } = useUser();
  const navigate = useNavigate();
  const [message, setMessage] = useState<string>('');
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // comprobación segura: si el contexto aún no tiene usuario, esperar un tick
    const ok = isAdmin();
    if (!ok) {
      // redirigir y evitar que la UI intente renderizar datos protegidos
      navigate('/login', { replace: true });
    } else {
      setChecking(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin, navigate]);

  if (checking) return <div className="container mt-5">Comprobando permisos...</div>;

  const handleDelete = (email: string) => {
    const res = deleteUser(email);
    setMessage(res.message ?? (res.success ? 'Usuario eliminado' : 'No se pudo eliminar'));
    setTimeout(() => setMessage(''), 4000);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 style={{ fontFamily: 'Pacifico, cursive', color: '#5D4037' }}>Panel de Administrador</h1>
        <div>
          <span className="me-3 text-muted">Sesión: {currentUser?.email}</span>
          <button className="btn btn-sm btn-outline-secondary" onClick={handleLogout}>Cerrar sesión</button>
        </div>
      </div>

      {message && <div className="alert alert-info">{message}</div>}

      <section className="mb-4">
        <h5>Usuarios registrados</h5>
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Email</th>
                <th>Rol</th>
                <th>Inmutable</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => {
                const isSystem = u.email.toLowerCase() === 'system@admin.cl' || u.immutable || u.role === 'system';
                return (
                  <tr key={u.email}>
                    <td>{u.email}</td>
                    <td>{u.role}</td>
                    <td>{isSystem ? 'Sí' : 'No'}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(u.email)}
                        disabled={isSystem}
                        title={isSystem ? 'Este usuario no puede eliminarse' : `Eliminar ${u.email}`}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <div className="mt-4">
        <Link to="/" className="btn btn-sm" style={{ backgroundColor: '#FFC0CB', borderColor: '#FFC0CB', color: '#5D4037' }}>
          Volver al sitio
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;