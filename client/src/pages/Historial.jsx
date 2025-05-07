import '../App.css';
import { useState, useEffect } from "react";
import Axios from "axios"; 
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Swal from 'sweetalert2';
import Navbar from '../components/NavBar';

function Historial() {
  const [id_inventario, setIdInventario] = useState("");
  const [fecha_compra, setFechaCompra] = useState("");
  const [costo, setCosto] = useState("");
  const [proveedor, setProveedor] = useState("");
  const [id_historial, setId] = useState();
  const [editar, setEditar] = useState(false);
  const [historialList, setHistorial] = useState([]);
  const [inventarioList, setInventario] = useState([]);
  const [proveedoresList, setProveedores] = useState([]);
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

  const getHistorial = () => {
    Axios.get("http://localhost:3001/historial")
      .then((response) => {
        setHistorial(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener historial:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo obtener el historial de compras"
        });
      });
  };

  const getInventario = () => {
    Axios.get("http://localhost:3001/inventario")
      .then((response) => {
        setInventario(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener inventario:", error);
      });
  };

  const getProveedores = () => {
    Axios.get("http://localhost:3001/proveedores")
      .then((response) => {
        setProveedores(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener proveedores:", error);
      });
  };

  useEffect(() => {
    getHistorial();
    getInventario();
    getProveedores();
  }, []);

  const validarCampos = () => {
    if (!id_inventario) {
      Swal.fire({
        icon: "error",
        title: "Campo requerido",
        text: "Debe seleccionar un equipo del inventario"
      });
      return false;
    }
    if (!fecha_compra) {
      Swal.fire({
        icon: "error",
        title: "Campo requerido",
        text: "La fecha de compra es obligatoria"
      });
      return false;
    }
    if (!costo || isNaN(costo) || parseFloat(costo) <= 0) {
      Swal.fire({
        icon: "error",
        title: "Campo inválido",
        text: "El costo debe ser un número mayor a cero"
      });
      return false;
    }
    return true;
  };

  const add = () => {
    if (!validarCampos()) return;

    Axios.post("http://localhost:3001/historial/create", {
      id_inventario: id_inventario,
      fecha_compra: fecha_compra,
      costo: costo,
      proveedor: proveedor || null
    })
      .then(() => {
        getHistorial();
        LimpiarCampos();
        Swal.fire({
          title: "<strong>Registro exitoso!</strong>",
          html: "<i>El registro de compra fue agregado al historial!</i>",
          icon: 'success',
          timer: 3000
        });
      }).catch(function(error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error.response?.data?.message || "Error al registrar la compra"
        });
      });
  }

  const update = () => {
    if (!validarCampos()) return;

    Axios.put("http://localhost:3001/historial/update", {
      id_historial: id_historial,
      id_inventario: id_inventario,
      fecha_compra: fecha_compra,
      costo: costo,
      proveedor: proveedor || null
    })
      .then(() => {
        getHistorial();
        LimpiarCampos();
        Swal.fire({
          title: "<strong>Actualización exitosa!</strong>",
          html: "<i>El registro de compra fue actualizado!</i>",
          icon: 'success',
          timer: 3000
        });
      }).catch(function(error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error.response?.data?.message || "Error al actualizar la compra"
        });
      });
  }

  const deleteHistorial = (val) => {
    Swal.fire({
      title: "Confirmar?",
      html: "<i>Realmente desea eliminar este registro del historial?</i>",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminarlo!"
    }).then((result) => {
      if (result.isConfirmed) {
        Axios.delete(`http://localhost:3001/historial/delete/${val.id_historial}`).then(() => {
          getHistorial();
          LimpiarCampos();
          Swal.fire({
            title: "Eliminado!",
            text: "El registro fue eliminado",
            icon: "success",
            timer: 850
          });
        }).catch(function(error) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "No se logró eliminar el registro",
            footer: error.response?.data?.message || "Error al eliminar"
          });
        });
      }
    });
  }

  const LimpiarCampos = () => {
    setIdInventario("");
    setFechaCompra("");
    setCosto("");
    setProveedor("");
    setEditar(false);
  }     

  const editarRegistro = (val) => {
    setEditar(true);
    setIdInventario(val.id_inventario);
    setFechaCompra(val.fecha_compra);
    setCosto(val.costo);
    setProveedor(val.proveedor || "");
    setId(val.id_historial);
  }

  return (
    <>
      <Navbar />
      <div className={`container px-md-4 content ${sidebarOpen ? 'sidebar-expanded' : ''}`}>
        <div className="row justify-content-center">
          <div className="col-12 col-md-10">
            <div className="card text-center my-4">
              <div className="card-header bg-primary text-white">
                <h1 className="h5 mb-0">HISTORIAL DE COMPRAS</h1>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-12 col-md-6 mb-3">
                    <div className="input-group">
                      <span className="input-group-text">Equipo:</span>
                      <select
                        className="form-select"
                        value={id_inventario}
                        onChange={(event) => setIdInventario(event.target.value)}
                        required
                      >
                        <option value="">Seleccione un equipo</option>
                        {inventarioList.map((item) => (
                          <option key={item.id_inventario} value={item.id_inventario}>
                            {item.tipo_De_Equipo} - {item.Marca} {item.Modelo}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="col-12 col-md-6 mb-3">
                    <div className="input-group">
                      <span className="input-group-text">Fecha compra:</span>
                      <input 
                        type="date" 
                        onChange={(event) => setFechaCompra(event.target.value)}
                        className="form-control" 
                        value={fecha_compra} 
                        required
                      />
                    </div>
                  </div>

                  <div className="col-12 col-md-6 mb-3">
                    <div className="input-group">
                      <span className="input-group-text">Costo:</span>
                      <input 
                        type="number" 
                        step="0.01"
                        min="0.01"
                        value={costo}
                        onChange={(event) => setCosto(event.target.value)}
                        className="form-control"  
                        placeholder="Ingrese el costo" 
                        required
                      />
                    </div>
                  </div>
              
                  <div className="col-12 col-md-6 mb-3">
                    <div className="input-group">
                      <span className="input-group-text">Proveedor:</span>
                      <select
                        className="form-select"
                        value={proveedor}
                        onChange={(event) => setProveedor(event.target.value)}
                      >
                        <option value="">Seleccione un proveedor (opcional)</option>
                        {proveedoresList.map((prov) => (
                          <option key={prov.id_proveedores} value={prov.id_proveedores}>
                            {prov.empresa} - {prov.nombre}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-footer text-muted">
                {editar ? (
                  <div>
                    <button className='btn btn-warning m-2' onClick={update}>Actualizar</button> 
                    <button className='btn btn-info m-2' onClick={LimpiarCampos}>Cancelar</button>
                  </div>
                ) : (
                  <button className='btn btn-success' onClick={add}>Registrar</button>
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
                    <th scope="col">Equipo</th>
                    <th scope="col">Fecha Compra</th>
                    <th scope="col">Costo</th>
                    <th scope="col">Proveedor</th>
                    <th scope="col">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {historialList.map((val) => {
                    const equipo = inventarioList.find(i => i.id_inventario === val.id_inventario);
                    const prov = proveedoresList.find(p => p.id_proveedores === val.proveedor);
                    
                    return (
                      <tr key={val.id_historial}>
                        <td>{equipo ? `${equipo.tipo_De_Equipo} ${equipo.Marca} ${equipo.Modelo}` : 'N/A'}</td>
                        <td>{new Date(val.fecha_compra).toLocaleDateString()}</td>
                        <td>${parseFloat(val.costo).toFixed(2)}</td>
                        <td>{prov ? `${prov.empresa} (${prov.nombre})` : 'N/A'}</td>
                        <td>
                          <div className="btn-group" role="group">
                            <button 
                              type="button" 
                              onClick={() => editarRegistro(val)}
                              className="btn btn-info btn-sm text-white"
                            >
                              <i className="bi bi-pencil"></i> Editar
                            </button>
                            <button 
                              type="button" 
                              onClick={() => deleteHistorial(val)}  
                              className="btn btn-danger btn-sm"
                            >
                              <i className="bi bi-trash"></i> Eliminar
                            </button>
                          </div>
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
    </>
  );
}

export default Historial;