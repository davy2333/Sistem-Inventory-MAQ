import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBoxOpen, FaChartLine, FaUsers, FaTools, FaClipboardCheck, FaWarehouse } from 'react-icons/fa';

const Home = () => {
  const navigate = useNavigate();

  // Estilos en línea mejorados
  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 50%, #80deea 100%)',
      padding: '20px',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    content: {
      maxWidth: '1000px',
      width: '100%',
      background: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '16px',
      padding: '40px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      backdropFilter: 'blur(4px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
    },
    header: {
      textAlign: 'center',
      color: '#0C7FA0',
      marginBottom: '30px',
      position: 'relative',
    },
    title: {
      fontSize: '2.5rem',
      fontWeight: '700',
      marginBottom: '10px',
      background: 'linear-gradient(to right, #0C7FA0, #00acc1)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    subtitle: {
      fontSize: '1.2rem',
      color: '#555',
      fontWeight: '300',
      maxWidth: '700px',
      margin: '0 auto',
    },
    featuresContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '25px',
      margin: '40px 0',
    },
    featureCard: {
      background: 'white',
      borderRadius: '12px',
      padding: '25px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      cursor: 'pointer',
      borderTop: '4px solid #0C7FA0',
      ':hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
      },
    },
    featureIcon: {
      fontSize: '2.5rem',
      color: '#0C7FA0',
      marginBottom: '15px',
    },
    featureTitle: {
      fontSize: '1.3rem',
      color: '#0C7FA0',
      marginBottom: '10px',
      fontWeight: '600',
    },
    featureText: {
      color: '#555',
      lineHeight: '1.6',
    },
    actionButtons: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '15px',
      justifyContent: 'center',
      marginTop: '40px',
    },
    button: {
      padding: '15px 30px',
      fontSize: '1rem',
      backgroundColor: '#0C7FA0',
      color: 'white',
      border: 'none',
      borderRadius: '50px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      fontWeight: '500',
      boxShadow: '0 4px 8px rgba(12, 127, 160, 0.2)',
      ':hover': {
        backgroundColor: '#00acc1',
        transform: 'translateY(-2px)',
        boxShadow: '0 6px 12px rgba(12, 127, 160, 0.3)',
      },
    },
    footer: {
      textAlign: 'center',
      marginTop: '50px',
      fontSize: '0.9rem',
      color: '#777',
      borderTop: '1px solid #eee',
      paddingTop: '20px',
    },
    highlight: {
      color: '#0C7FA0',
      fontWeight: '600',
    },
  };

  const features = [
    {
      icon: <FaBoxOpen />,
      title: 'Gestión de Inventario',
      description: 'Control completo de tu inventario con seguimiento en tiempo real de todos tus productos y materiales.'
    },
    {
      icon: <FaChartLine />,
      title: 'Reportes y Análisis',
      description: 'Genera reportes detallados y análisis para tomar decisiones informadas sobre tu negocio.'
    },
    {
      icon: <FaUsers />,
      title: 'Gestión de Clientes',
      description: 'Administra la información de tus clientes y mantén un historial completo de sus pedidos.'
    },
    {
      icon: <FaTools />,
      title: 'Mantenimiento',
      description: 'Registra y da seguimiento al mantenimiento de tu maquinaria y equipo.'
    },
    {
      icon: <FaClipboardCheck />,
      description: 'Sistema completo para gestionar todos los pedidos de tus clientes de manera eficiente.'
    },
    {
      icon: <FaWarehouse />,
      title: 'Control de Proveedores',
      description: 'Mantén un registro organizado de todos tus proveedores y sus productos.'
    }
  ];

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <header style={styles.header}>
          <h1 style={styles.title}>Bienvenido a System Inventory MAQ</h1>
          <p style={styles.subtitle}>
            La solución <span style={styles.highlight}>integral</span> para la administración eficiente de los procesos y recursos de tu maquila.
          </p>
        </header>

        <div style={styles.featuresContainer}>
          {features.map((feature, index) => (
            <div 
              key={index} 
              style={styles.featureCard}
              onClick={() => navigate(index === 0 ? '/inventario' : index === 2 ? '/clientes' : '/proveedores')}
            >
              <div style={styles.featureIcon}>{feature.icon}</div>
              <h3 style={styles.featureTitle}>{feature.title}</h3>
              <p style={styles.featureText}>{feature.description}</p>
            </div>
          ))}
        </div>

        <div style={styles.actionButtons}>
          <button 
            style={styles.button} 
            onClick={() => navigate('/inventario')}
          >
            <FaBoxOpen /> Comenzar con el Inventario
          </button>
          <button 
            style={{...styles.button, backgroundColor: '#00acc1'}} 
            onClick={() => navigate('/proveedores')}
          >
            <FaUsers /> Ver Proveedores
          </button>
        </div>

        <footer style={styles.footer}>
          <p>&copy; 2025 System Inventory MAQ. Todos los derechos reservados.</p>
        </footer>
      </div>
    </div>
  );
};

export default Home;