// src/components/Navbar.js
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './NavBar.css'; // Importamos los estilos del sidebar

function Navbar() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const toggleSidebar = () => {
    const newState = !sidebarOpen;
    setSidebarOpen(newState);
    
    // Dispatch event para comunicar con otros componentes
    window.dispatchEvent(
      new CustomEvent('sidebarToggle', { detail: { isOpen: newState } })
    );
  };

  // Inicializar el estado del sidebar cuando se monta el componente
  useEffect(() => {
    // Asegurar que el evento se dispare al cargar
    window.dispatchEvent(
      new CustomEvent('sidebarToggle', { detail: { isOpen: sidebarOpen } })
    );
  }, []);

  return (
    <>
      {/* Navbar superior */}
      <nav className="navbar navbar-expand-lg bg-body-tertiary fixed-top">
        <div className="container-fluid">
          {/* Botón "B" que ahora funciona como toggle del sidebar */}
          <a 
            className="navbar-brand" 
            href="#"
            onClick={toggleSidebar}
            style={{ cursor: 'pointer' }}
          >
            <span className="bg-primary text-white p-2 rounded">
              <i className="bi bi-list"></i> {}
            </span>
          </a>
          
          {/* Eliminamos el botón de toggle separado, ahora la B sirve para eso */}
          <span className="navbar-text">
            Sistema de Gestión
          </span>
        </div>
      </nav>

      {/* Sidebar lateral */}
      <div className={`sidebar bg-dark ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <h5 className="text-white">Menú</h5>
          <button 
            type="button" 
            className="btn-close btn-close-white d-lg-none" 
            onClick={toggleSidebar}
            aria-label="Close"
          ></button>
        </div>
        <hr className="text-white-50" />
        <ul className="nav flex-column">
          <li className="nav-item">
            <a className="nav-link text-white" href="#">
              <i className="bi bi-house-door me-2"></i>Inicio
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link text-white" href="#">
              <i className="bi bi-people me-2"></i>Proveedores
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link text-white" href="#">
              <i className="bi bi-bag me-2"></i>Productos
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link text-white" href="#">
              <i className="bi bi-file-earmark-text me-2"></i>Reportes
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link text-white" href="#">
              <i className="bi bi-gear me-2"></i>Configuración
            </a>
          </li>
        </ul>
      </div>

      {/* Overlay para cerrar el sidebar al hacer clic fuera */}
      {sidebarOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
}

export default Navbar;