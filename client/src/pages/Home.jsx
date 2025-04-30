import React from 'react';
import { useNavigate } from 'react-router-dom'; 

const Home = () => {
  const navigate = useNavigate(); 

  // Estilos en línea
  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(to right, #e0f7fa, #ffffff)',
      padding: '20px',
    },
    content: {
      maxWidth: '900px',
      width: '100%',
      background: 'white',
      borderRadius: '12px',
      padding: '30px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    },
    header: {
      textAlign: 'center',
      color: '#0C7FA0',
    },
    paragraph: {
      textAlign: 'center',
      fontSize: '1.1rem',
      color: '#333',
    },
    sectionTitle: {
      marginTop: '30px',
      color: '#0C7FA0',
    },
    ul: {
      listStyleType: 'square',
      paddingLeft: '20px',
      color: '#555',
    },
    actionButtons: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '15px',
      justifyContent: 'center',
      marginTop: '15px',
    },
    button: {
      padding: '12px 20px',
      fontSize: '1rem',
      backgroundColor: '#0C7FA0',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
    },
    footer: {
      textAlign: 'center',
      marginTop: '40px',
      fontSize: '0.9rem',
      color: '#777',
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <header>
          <h1 style={styles.header}>Bienvenido a System Inventory MAQ</h1>
          <p style={styles.paragraph}>Administra eficientemente los procesos y recursos de tu maquila.</p>
        </header>

        <main>
          <section>
            <h2 style={styles.sectionTitle}>¿Qué puedes hacer aquí?</h2>
            <ul style={styles.ul}>
              <li>Registrar y gestionar productos e insumos.</li>
              <li>Controlar el stock en tiempo real.</li>
            </ul>
          </section>

          <section>
            <h2 style={styles.sectionTitle}>Accesos rápidos</h2>
            <div style={styles.actionButtons}>
              <button style={styles.button} onClick={() => navigate('/proveedores')}>
                Gestionar Productos
              </button>
            </div>
          </section>
        </main>

        <footer style={styles.footer}>
          <p>&copy; 2025 System Inventory MAQ. Todos los derechos reservados.</p>
        </footer>
      </div>
    </div>
  );
};

export default Home;
