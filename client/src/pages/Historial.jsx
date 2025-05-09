import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Historial.css';
import Navbar from '../components/NavBar';
import Swal from 'sweetalert2';

const Historial = () => {
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (sidebarOpen) {
      document.body.classList.add('sidebar-expanded');
    } else {
      document.body.classList.remove('sidebar-expanded');
    }
  }, [sidebarOpen]);

  useEffect(() => {
    const handleSidebarToggle = (e) => {
      setSidebarOpen(e.detail.isOpen);
    };
    
    window.addEventListener('sidebarToggle', handleSidebarToggle);
    
    return () => {
      window.removeEventListener('sidebarToggle', handleSidebarToggle);
    };
  }, []);

  useEffect(() => {
    const fetchHistorial = async () => {
      try {
        const response = await axios.get('http://localhost:3001/historial');
        setHistorial(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        Swal.fire({
          icon: "error",
          title: "Error al cargar historial",
          text: err.message === "Network Error" ? "Intente más tarde" : err.message
        });
      }
    };

    fetchHistorial();
  }, []);

  // Estilo para el fondo gradiente (igual que en Proveedores)
  const backgroundStyle = {
    background: 'linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 50%, #80deea 100%)',
    minHeight: '100vh',
    padding: '20px'
  };

  if (loading) return (
    <div style={backgroundStyle}>
      <Navbar />
      <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div style={backgroundStyle}>
      <Navbar />
      <div className="alert alert-danger m-4">
        Error: {error}
      </div>
    </div>
  );

  return (
    <div style={backgroundStyle}>
      <Navbar />
      <div className={`container px-md-4 content ${sidebarOpen ? 'sidebar-expanded' : ''}`}>
        <div className="row justify-content-center">
          <div className="col-12 col-md-10">
            <div className="card text-center my-4">
              <div className="card-header bg-primary text-white">
                <h1 className="h5 mb-0">HISTORIAL DE INVENTARIO</h1>
              </div>
              <div className="card-body">
                <div className="historial-list">
                  {historial.map((item) => (
                    <div key={item.id_historial} className="historial-item">
                      <div className="historial-info">
                        <span className="equipo-nombre">
                          {item.tipo_De_Equipo} {item.Marca} - ${item.Precio}
                        </span>
                        <span className="fecha">
                          {new Date(item.Fecha_De_Adquisicion).toLocaleDateString('es-ES', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Historial;