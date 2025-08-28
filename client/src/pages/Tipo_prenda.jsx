import React, { useState, useEffect } from 'react';
import '../App.css';
import Axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Swal from 'sweetalert2';
import Navbar from '../components/NavBar';

function TipoPrenda() {
  const [tipoPrenda, setTipoPrenda] = useState("");
  const [idTipoPrenda, setIdTipoPrenda] = useState(null);
  const [editar, setEditar] = useState(false);
  const [tiposPrendaList, setTiposPrenda] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [busqueda, setBusqueda] = useState("");

  // Estilo de fondo degradado idéntico a Inventario
  const backgroundStyle = {
    background: 'linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 50%, #80deea 100%)',
    minHeight: '100vh',
    padding: '20px'
  };

  // Manejo de sidebar
  useEffect(() => {
    document.body.classList.toggle('sidebar-expanded', sidebarOpen);
  }, [sidebarOpen]);

  useEffect(() => {
    const handleSidebarToggle = (e) => setSidebarOpen(e.detail.isOpen);
    window.addEventListener('sidebarToggle', handleSidebarToggle);
    return () => window.removeEventListener('sidebarToggle', handleSidebarToggle);
  }, []);

  // Carga de datos
  const getTiposPrenda = () => {
    Axios.get('http://localhost:3001/tipoprenda')
      .then(res => setTiposPrenda(res.data))
      .catch(err => console.error('Error al obtener tipos de prenda:', err));
  };

  useEffect(() => { getTiposPrenda(); }, []);

  // Filtrado según búsqueda
  const tiposPrendaFiltrados = tiposPrendaList.filter(tipo =>
    tipo.tipo_prenda.toLowerCase().includes(busqueda.toLowerCase()) ||
    tipo.id_tipo_prenda.toString().includes(busqueda)
  );

  // Limpia formulario
  const limpiarCampos = () => {
    setTipoPrenda("");
    setIdTipoPrenda(null);
    setEditar(false);
  };

  // CRUD
  const add = () => {
    Axios.post('http://localhost:3001/tipoprenda/create', { tipo_prenda: tipoPrenda })
      .then(() => {
        getTiposPrenda(); limpiarCampos();
        Swal.fire({
          title: '<strong>Registro exitoso!</strong>',
          html: `<i>El tipo de prenda <strong>${tipoPrenda}</strong> fue registrado.</i>`,
          icon: 'success', timer: 3000
        });
      })
      .catch(error => {
        Swal.fire({
          icon: 'error', title: 'Oops...',
          text: error.message === 'Network Error' ? 'Intente más tarde' : error.message
        });
      });
  };

  const update = () => {
    Axios.put('http://localhost:3001/tipoprenda/update', { id_tipo_prenda: idTipoPrenda, tipo_prenda: tipoPrenda })
      .then(() => {
        getTiposPrenda(); limpiarCampos();
        Swal.fire({
          title: '<strong>Actualización exitosa!</strong>',
          html: `<i>El tipo de prenda <strong>${tipoPrenda}</strong> fue actualizado.</i>`,
          icon: 'success', timer: 3000
        });
      })
      .catch(error => {
        Swal.fire({
          icon: 'error', title: 'Oops...',
          text: error.message === 'Network Error' ? 'Intente más tarde' : error.message
        });
      });
  };

  const deleteTipoPrenda = (val) => {
    Swal.fire({
      title: '¿Confirmar eliminación?',
      html: `<i>¿Eliminar <strong>${val.tipo_prenda}</strong>?</i>`,
      icon: 'warning', showCancelButton: true,
      confirmButtonColor: '#3085d6', cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar'
    }).then(result => {
      if (result.isConfirmed) {
        Axios.delete(`http://localhost:3001/tipoprenda/delete/${val.id_tipo_prenda}`)
          .then(() => { getTiposPrenda(); limpiarCampos();
            Swal.fire({ title: '¡Eliminado!', text: val.tipo_prenda + ' ha sido eliminado', icon: 'success', timer: 1500 });
          })
          .catch(error => {
            Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo eliminar: ' + error.message });
          });
      }
    });
  };

  const editarTipoPrenda = (val) => {
    setEditar(true);
    setTipoPrenda(val.tipo_prenda);
    setIdTipoPrenda(val.id_tipo_prenda);
  };

  return (
    <div style={backgroundStyle}>
      <Navbar />
      <div className={`container px-md-4 content ${sidebarOpen ? 'sidebar-expanded' : ''}`}>

        {/* Barra de búsqueda */}
        <div className="row justify-content-center mb-4">
          <div className="col-12 col-md-10">
            <div className="card">
              <div className="card-body p-3">
                <div className="input-group">
                  <span className="input-group-text bg-primary text-white">
                    <i className="bi bi-search"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Buscar tipos de prenda..."
                    value={busqueda}
                    onChange={e => setBusqueda(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card de formulario */}
        <div className="row justify-content-center">
          <div className="col-12 col-md-10">
            <div className="card text-center my-4">
              <div className="card-header bg-primary text-white">
                <h1 className="h5 mb-0">TIPOS DE PRENDA</h1>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-12 mb-3">
                    <div className="input-group">
                      <span className="input-group-text">Tipo de prenda:</span>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Ingrese el tipo de prenda"
                        value={tipoPrenda}
                        onChange={e => setTipoPrenda(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-footer text-muted">
                {editar ? (
                  <>
                    <button className="btn btn-warning m-2" onClick={update}>Actualizar</button>
                    <button className="btn btn-info m-2" onClick={limpiarCampos}>Cancelar</button>
                  </>
                ) : (
                  <button className="btn btn-success" onClick={add}>Registrar</button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tabla de datos */}
        <div className="row justify-content-center">
          <div className="col-12">
            <div className="table-responsive">
              <table className="table table-hover ">
                <thead className="table">
                  <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Tipo de Prenda</th>
                    <th scope="col">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {tiposPrendaFiltrados.map(val => (
                    <tr key={val.id_tipo_prenda}>
                      <td>{val.id_tipo_prenda}</td>
                      <td>{val.tipo_prenda}</td>
                      <td>
                        <div className="btn-group" role="group">
                          <button
                            type="button"
                            onClick={() => editarTipoPrenda(val)}
                            className="btn btn-info btn-sm text-white"
                          >Editar</button>
                          <button
                            type="button"
                            onClick={() => deleteTipoPrenda(val)}
                            className="btn btn-danger btn-sm"
                          >Eliminar</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default TipoPrenda;
