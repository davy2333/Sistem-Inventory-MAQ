import '../App.css';
import { useState, useEffect } from "react";
import Axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Swal from 'sweetalert2';
import Navbar from '../components/NavBar';

function Mantenimiento() {
  const [mantenimientos, setMantenimientos] = useState([]);
  const [inventario, setInventario] = useState([]);
  const [detalleProblema, setDetalleProblema] = useState("");
  const [tecnicoEncargado, setTecnicoEncargado] = useState("");
  const [estadoReparacion, setEstadoReparacion] = useState("");
  const [fecha, setFecha] = useState("");
  const [costo, setCosto] = useState("");
  const [idInventario, setIdInventario] = useState("");
  const [idMantenimiento, setIdMantenimiento] = useState();
  const [editar, setEditar] = useState(false);
  const [busqueda, setBusqueda] = useState("");
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
    getMantenimientos();
    getInventario();
  }, []);

  const getMantenimientos = () => {
    Axios.get("http://localhost:3001/mantenimiento")
      .then((res) => setMantenimientos(res.data))
      .catch(err => console.error("Error al obtener mantenimientos:", err));
  };

  const getInventario = () => {
    Axios.get("http://localhost:3001/inventario")
      .then((res) => setInventario(res.data))
      .catch(err => console.error("Error al obtener inventario:", err));
  };

  // Filtrar mantenimientos según la búsqueda
  const mantenimientosFiltrados = mantenimientos.filter(mant => {
    const equipo = inventario.find(i => i.id_inventario === mant.id_inventario);
    const equipoInfo = equipo ? `${equipo.tipo_De_Equipo} ${equipo.Marca} ${equipo.Modelo}` : '';
    
    return (
      equipoInfo.toLowerCase().includes(busqueda.toLowerCase()) ||
      (mant.detalle_problema && mant.detalle_problema.toLowerCase().includes(busqueda.toLowerCase())) ||
      (mant.tecnico_encargado && mant.tecnico_encargado.toLowerCase().includes(busqueda.toLowerCase())) ||
      (mant.estado_de_reparacion && mant.estado_de_reparacion.toLowerCase().includes(busqueda.toLowerCase())) ||
      (mant.Fecha && mant.Fecha.includes(busqueda)) ||
      (mant.Costo && mant.Costo.toString().includes(busqueda))
    );
  });

  const LimpiarCampos = () => {
    setDetalleProblema("");
    setTecnicoEncargado("");
    setEstadoReparacion("");
    setFecha("");
    setCosto("");
    setIdInventario("");
    setEditar(false);
  };

  const add = () => {
    if (!idInventario) {
      Swal.fire("Campo obligatorio", "Debe seleccionar un equipo del inventario", "warning");
      return;
    }
    
    Axios.post("http://localhost:3001/mantenimiento/create", {
      id_inventario: idInventario,
      detalle_problema: detalleProblema,
      tecnico_encargado: tecnicoEncargado,
      estado_de_reparacion: estadoReparacion,
      Fecha: fecha,
      Costo: costo
    }).then(() => {
      getMantenimientos();
      LimpiarCampos();
      Swal.fire("Mantenimiento registrado", "", "success");
    }).catch(() => Swal.fire("Error", "No se pudo registrar el mantenimiento", "error"));
  };

  const update = () => {
    if (!idInventario) {
      Swal.fire("Campo obligatorio", "Debe seleccionar un equipo del inventario", "warning");
      return;
    }
    
    Axios.put("http://localhost:3001/mantenimiento/update", {
      id_mantenimiento: idMantenimiento,
      id_inventario: idInventario,
      detalle_problema: detalleProblema,
      tecnico_encargado: tecnicoEncargado,
      estado_de_reparacion: estadoReparacion,
      Fecha: fecha,
      Costo: costo
    }).then(() => {
      getMantenimientos();
      LimpiarCampos();
      Swal.fire("Mantenimiento actualizado", "", "success");
    }).catch(() => Swal.fire("Error", "No se pudo actualizar el mantenimiento", "error"));
  };

  const eliminar = (val) => {
    Swal.fire({
      title: `¿Eliminar el mantenimiento #${val.id_mantenimiento}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar"
    }).then((result) => {
      if (result.isConfirmed) {
        Axios.delete(`http://localhost:3001/mantenimiento/delete/${val.id_mantenimiento}`)
          .then(() => {
            getMantenimientos();
            Swal.fire("Mantenimiento eliminado", "", "success");
          });
      }
    });
  };

  const editarMantenimiento = (val) => {
    setEditar(true);
    setIdMantenimiento(val.id_mantenimiento);
    setIdInventario(val.id_inventario);
    setDetalleProblema(val.detalle_problema);
    setTecnicoEncargado(val.tecnico_encargado);
    setEstadoReparacion(val.estado_de_reparacion);
    setFecha(val.Fecha?.slice(0, 10));
    setCosto(val.Costo);
  };

  // Estilo para el fondo gradiente
  const backgroundStyle = {
    background: 'linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 50%, #80deea 100%)',
    minHeight: '100vh',
    padding: '20px'
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
                    placeholder="Buscar mantenimientos por equipo, problema, técnico, estado, fecha o costo..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row justify-content-center">
          <div className="col-12 col-md-10">
            <div className="card text-center my-4">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">REGISTRO DE MANTENIMIENTOS</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6 mb-2">
                    <select 
                      className="form-control" 
                      value={idInventario} 
                      onChange={e => setIdInventario(e.target.value)}
                      required
                    >
                      <option value="">Seleccione un equipo</option>
                      {inventario.map(item => (
                        <option key={item.id_inventario} value={item.id_inventario}>
                          {item.tipo_De_Equipo} - {item.Marca} {item.Modelo}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6 mb-2">
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Técnico encargado" 
                      value={tecnicoEncargado} 
                      onChange={e => setTecnicoEncargado(e.target.value)} 
                    />
                  </div>
                  <div className="col-md-6 mb-2">
                    <select 
                      className="form-control" 
                      value={estadoReparacion} 
                      onChange={e => setEstadoReparacion(e.target.value)}
                    >
                      <option value="">Estado de reparación</option>
                      <option value="Pendiente">Pendiente</option>
                      <option value="En revisión">En revisión</option>
                      <option value="En reparación">En reparación</option>
                      <option value="Reparado">Reparado</option>
                      <option value="No reparable">No reparable</option>
                    </select>
                  </div>
                  <div className="col-md-6 mb-2">
                    <input 
                      type="date" 
                      className="form-control" 
                      value={fecha} 
                      onChange={e => setFecha(e.target.value)} 
                    />
                  </div>
                  <div className="col-md-6 mb-2">
                    <input 
                      type="number" 
                      className="form-control" 
                      placeholder="Costo" 
                      value={costo} 
                      onChange={e => setCosto(e.target.value)} 
                      step="0.01"
                    />
                  </div>
                  <div className="col-md-12 mb-2">
                    <textarea 
                      className="form-control" 
                      placeholder="Detalle del problema" 
                      value={detalleProblema} 
                      onChange={e => setDetalleProblema(e.target.value)}
                      rows="3"
                    />
                  </div>
                </div>
              </div>
              <div className="card-footer text-muted">
                {editar ? (
                  <>
                    <button className="btn btn-warning me-2" onClick={update}>Actualizar</button>
                    <button className="btn btn-info" onClick={LimpiarCampos}>Cancelar</button>
                  </>
                ) : (
                  <button className="btn btn-success" onClick={add}>Registrar</button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="row justify-content-center">
          <div className="col-12">
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead className="table-dark">
                  <tr>
                    <th>ID</th>
                    <th>Equipo</th>
                    <th>Problema</th>
                    <th>Técnico</th>
                    <th>Estado</th>
                    <th>Fecha</th>
                    <th>Costo</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {mantenimientosFiltrados.map((val) => {
                    const equipo = inventario.find(i => i.id_inventario === val.id_inventario);
                    return (
                      <tr key={val.id_mantenimiento}>
                        <td>{val.id_mantenimiento}</td>
                        <td>{equipo ? `${equipo.tipo_De_Equipo} ${equipo.Marca}` : 'N/A'}</td>
                        <td>{val.detalle_problema}</td>
                        <td>{val.tecnico_encargado}</td>
                        <td>{val.estado_de_reparacion}</td>
                        <td>{val.Fecha?.slice(0, 10)}</td>
                        <td>${val.Costo}</td>
                        <td>
                          <button className="btn btn-info btn-sm me-1" onClick={() => editarMantenimiento(val)}>
                            Editar
                          </button>
                          <button className="btn btn-danger btn-sm" onClick={() => eliminar(val)}>
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Mantenimiento;