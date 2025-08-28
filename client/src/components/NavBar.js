import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './NavBar.css';
import logo from '../assets/logo.jpeg';
import BackupButton from '../components/BackUpButtom.jsx';
import RestartButton from '../components/RestartButtom.jsx';

function Navbar() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const toggleSidebar = () => {
    const newState = !sidebarOpen;
    setSidebarOpen(newState);
    window.dispatchEvent(
      new CustomEvent('sidebarToggle', { detail: { isOpen: newState } })
    );
  };

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent('sidebarToggle', { detail: { isOpen: sidebarOpen } })
    );
  }, []);

  return (
    <>
      
      <nav className="navbar navbar-expand-lg bg-body-tertiary fixed-top">
        <div className="container-fluid">
          <a className="navbar-brand" onClick={toggleSidebar} style={{ cursor: 'pointer' }}>
            <span className="bg-primary text-white p-2 rounded">
              <i className="bi bi-list"></i>
            </span>
          </a>
          <img
            src={logo}
            alt="Logo"
            className="navbar-logo"
            style={{ width: '70px', height: '60px', objectFit: 'cover' }}
          />
        </div>
        
      </nav>

      {/* Sidebar */}
      <div className={`sidebar bg-white ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <h5 className="text-black">Menú</h5>
          <button type="button" className="btn-close btn-close-white d-lg-none" onClick={toggleSidebar}></button>
        </div>
        <hr className="text-white-50" />
        <ul className="nav flex-column">
          <li className="nav-item">
            <Link className="nav-link text-black" to="/">
              <i className="bi bi-house-door me-2"></i>Inicio
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-black" to="/Proveedores">
              <i className="bi bi-truck me-2"></i>Proveedores
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-black" to="/Pedidos">
              <i className="bi bi-bag me-2"></i>Pedidos
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-black" to="/Inventario">
              <i className="bi bi-box me-2"></i>Inventario
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-black" to="/Cliente">
              <i className="bi bi-person me-2"></i>Clientes
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-black" to="/Tipo_prenda">
              <i className="bi bi-tags me-2"></i>Tipo de Prenda
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-black" to="/Historial">
              <i className="bi bi-clock-history me-2"></i>Historial
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-black" to="/Mantenimiento">
              <i className="bi bi-wrench me-2"></i>Mantenimiento
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-black" to="/Bajas">
              <i className="bi bi-trash me-2"></i>Bajas
            </Link>
          </li>
          <BackupButton />
          {/* <RestartButton /> */}
          
        </ul>
      </div>

      {/* Overlay */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}
    </>
  );
}

export default Navbar;