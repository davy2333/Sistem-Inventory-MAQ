import '../App.css';
import { useState, useEffect } from "react";
import Axios from "axios"; 
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Swal from 'sweetalert2';
import Navbar from '../components/NavBar';

function Bajas() {
  const [motivo, setMotivo] = useState("");
  const [fecha, setFecha] = useState("");
  const [personaEncargada, setPersonaEncargada] = useState("");
  const [idInventario, setIdInventario] = useState("");
  const [idBajas, setIdBajas] = useState();
  const [editar, setEditar] = useState(false);
  const [bajasList, setBajasList] = useState([]);
  const [inventarioList, setInventarioList] = useState([]);
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

  const getBajas = () => {
    Axios.get("http://localhost:3001/bajas")
      .then((response) => {
        setBajasList(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener bajas:", error);
      });
  };

  const getInventario = () => {
    Axios.get("http://localhost:3001/inventario")
      .then((response) => {
        setInventarioList(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener inventario:", error);
      });
  };

  useEffect(() => {
    getBajas();
    getInventario();
  }, []);

  const add = () => {
    Axios.post("http://localhost:3001/bajas/create", {
      id_inventario: idInventario,
      motivo: motivo,
      fecha: fecha,
      persona_encargada: personaEncargada
    })
      .then(() => {
        getBajas();
        LimpiarCampos();
        Swal.fire({
          title: "<strong>Registro exitoso!!</strong>",
          html: "<i>La baja fue registrada con éxito!!</i>",
          icon: 'success',
          timer: 3000
        })
      }).catch(function(error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: JSON.parse(JSON.stringify(error)).message === "Network Error" ? "Intente más tarde" : JSON.parse(JSON.stringify(error)).message
        })
      });
  }

  const update = () => {
    Axios.put("http://localhost:3001/bajas/update", {
      id_bajas: idBajas,
      id_inventario: idInventario,
      motivo: motivo,
      fecha: fecha,
      persona_encargada: personaEncargada
    })
      .then(() => {
        getBajas();
        LimpiarCampos();
        Swal.fire({
          title: "<strong>Actualización exitosa!!</strong>",
          html: "<i>La baja fue actualizada con éxito!!</i>",
          icon: 'success',
          timer: 3000
        })
      }).catch(function(error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: JSON.parse(JSON.stringify(error)).message === "Network Error" ? "Intente más tarde" : JSON.parse(JSON.stringify(error)).message
        })
      });
  }

  const deleteBaja = (val) => {
    Swal.fire({
      title: "Confirmar?",
      html: `<i>Realmente desea eliminar la baja del equipo ID: <strong>${val.id_inventario}</strong>?</i>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, eliminarlo!"
    }).then((result) => {
      if (result.isConfirmed) {
        Axios.delete(`http://localhost:3001/bajas/delete/${val.id_bajas}`).then(() => {
          getBajas();
          LimpiarCampos();
          Swal.fire({
            title: "Eliminado!",
            text: "La baja fue eliminada",
            icon: "success",
            timer: 850
          });
        }).catch(function(error) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "No se logró eliminar la baja",
            footer: JSON.parse(JSON.stringify(error)).message === "Network Error" ? "Intente más tarde" : JSON.parse(JSON.stringify(error)).message
          })
        });
      }
    });
  }

  const LimpiarCampos = () => {
    setMotivo("");
    setFecha("");
    setPersonaEncargada("");
    setIdInventario("");
    setEditar(false);
  }     

  const editarBaja = (val) => {
    setEditar(true);
    setMotivo(val.motivo);
    setFecha(val.fecha.split('T')[0]); // Formatear fecha para input type="date"
    setPersonaEncargada(val.persona_encargada);
    setIdInventario(val.id_inventario);
    setIdBajas(val.id_bajas);
  }

  const getEquipoInfo = (id) => {
    const equipo = inventarioList.find(item => item.id_inventario == id);
    return equipo ? `${equipo.tipo_De_Equipo} - ${equipo.Marca} ${equipo.Modelo}` : 'Equipo no encontrado';
  }

  return (
    <>
      <Navbar />
      <div className={`container px-md-4 content ${sidebarOpen ? 'sidebar-expanded' : ''}`}>
        <div className="row justify-content-center">
          <div className="col-12 col-md-10">
            <div className="card text-center my-4">
              <div className="card-header bg-primary text-white">
                <h1 className="h5 mb-0">REGISTRO DE BAJAS</h1>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-12 col-md-6 mb-3">
                    <div className="input-group">
                      <span className="input-group-text">Equipo:</span>
                      <select
                        className="form-control"
                        value={idInventario}
                        onChange={(event) => setIdInventario(event.target.value)}
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
                      <span className="input-group-text">Motivo:</span>
                      <input 
                        type="text" 
                        onChange={(event) => setMotivo(event.target.value)}
                        className="form-control" 
                        value={motivo} 
                        placeholder="Ingrese el motivo de la baja" 
                      />
                    </div>
                  </div>

                  <div className="col-12 col-md-6 mb-3">
                    <div className="input-group">
                      <span className="input-group-text">Fecha:</span>
                      <input 
                        type="date" 
                        value={fecha}
                        onChange={(event) => setFecha(event.target.value)}
                        className="form-control"  
                      />
                    </div>
                  </div>
              
                  <div className="col-12 col-md-6 mb-3">
                    <div className="input-group">
                      <span className="input-group-text">Encargado:</span>
                      <input 
                        type="text" 
                        onChange={(event) => setPersonaEncargada(event.target.value)}
                        className="form-control" 
                        value={personaEncargada} 
                        placeholder="Persona encargada" 
                      />
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
                    <th scope="col">Motivo</th>
                    <th scope="col">Fecha</th>
                    <th scope="col">Encargado</th>
                    <th scope="col">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {bajasList.map((val) => (
                    <tr key={val.id_bajas}>
                      <td>{getEquipoInfo(val.id_inventario)}</td>
                      <td>{val.motivo}</td>
                      <td>{new Date(val.fecha).toLocaleDateString()}</td>
                      <td>{val.persona_encargada}</td>
                      <td>
                        <div className="btn-group" role="group">
                          <button 
                            type="button" 
                            onClick={() => editarBaja(val)}
                            className="btn btn-info btn-sm text-white"
                          >
                            Editar
                          </button>
                          <button 
                            type="button" 
                            onClick={() => deleteBaja(val)}  
                            className="btn btn-danger btn-sm"
                          >
                            Eliminar
                          </button>
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
    </>
  );
}

export default Bajas;
