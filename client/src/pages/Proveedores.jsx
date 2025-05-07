import '../App.css';
import { useState, useEffect } from "react";
import Axios from "axios"; 
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Swal from 'sweetalert2';
import Navbar from '../components/NavBar';

function App() {
  const [nombre, setNombre] = useState("");
  const [direccion, setDireccion] = useState("");
  const [numero_telefonico, setNumero_telefonico] = useState();
  const [empresa, setEmpresa] = useState("");
  const [id_proveedores, setId] = useState();
  const [editar, setEditar] = useState(false);
  const [proveedoresList, setProveedores] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [busqueda, setBusqueda] = useState("");

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
    getProveedores();
  }, []);

  // Filtrar proveedores según la búsqueda
  const proveedoresFiltrados = proveedoresList.filter(proveedor => {
    return (
      proveedor.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      proveedor.empresa.toLowerCase().includes(busqueda.toLowerCase()) ||
      (proveedor.direccion && proveedor.direccion.toLowerCase().includes(busqueda.toLowerCase())) ||
      (proveedor.Numero_telefonico && proveedor.Numero_telefonico.toString().includes(busqueda))
    );
  });

  const add = () => {
    Axios.post("http://localhost:3001/create", {
      nombre: nombre,
      direccion: direccion,
      numero_telefonico: numero_telefonico,
      empresa: empresa
    })
      .then(() => {
        getProveedores();
        LimpiarCampos();
        Swal.fire({
          title: "<strong>Registro exitoso!!</strong>",
          html: "<i>El proveedor <strong>"+nombre+"</strong> fue registrado con exito!!</i>",
          icon: 'success',
          timer:3000
        })
      }).catch(function(error){
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: JSON.parse(JSON.stringify(error)).message==="Network Error"?"Intente mas tarde":JSON.parse(JSON.stringify(error)).message
        })
      });
  }

  const update = () => {
    Axios.put("http://localhost:3001/update", {
      id_proveedores:id_proveedores,
      nombre: nombre,
      direccion: direccion,
      numero_telefonico: numero_telefonico,
      empresa: empresa
    })
      .then(() => {
        getProveedores();
        LimpiarCampos();
        Swal.fire({
          title: "<strong>Actualizacion exitosa!!</strong>",
          html: "<i>El proveedor <strong>"+nombre+"</strong> fue actualizado con exito!!</i>",
          icon: 'success',
          timer:3000
        })
      }).catch(function(error){
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: JSON.parse(JSON.stringify(error)).message==="Network Error"?"Intente mas tarde":JSON.parse(JSON.stringify(error)).message
        })
      });
  }

  const deleteProv = (val) => {
    Swal.fire({
      title: "Confirmar?",
      html: "<i>Realmente desea eliminar a <strong>"+val.nombre+"</strong>?</i>",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, eliminarlo!"
    }).then((result) => {
      if (result.isConfirmed) {
        Axios.delete(`http://localhost:3001/delete/${val.id_proveedores}`).then(() => {
          getProveedores();
          LimpiarCampos();
          Swal.fire({
            title: "Eliminado!",
            text: val.nombre + " fue eliminado",
            icon: "success",
            timer: 850
          });
        }).catch(function(error){
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "No se logro eliminar el emlpeado",
            footer: JSON.parse(JSON.stringify(error)).message==="Network Error"?"Intente mas tarde":JSON.parse(JSON.stringify(error)).message
          })
        });
      }
    });
  }

  const LimpiarCampos = () => {
    setNombre("");
    setDireccion("");
    setNumero_telefonico("");
    setEmpresa("");
    setEditar(false);
  }     

  const editarProveedor = (val) => {
    setEditar(true);
    setNombre(val.nombre);
    setDireccion(val.direccion);
    setNumero_telefonico(val.Numero_telefonico);
    setEmpresa(val.empresa);
    setId(val.id_proveedores);
  }

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
                    placeholder="Buscar proveedores por nombre, empresa, dirección o teléfono..."
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
                <h1 className="h5 mb-0">PROVEEDORES</h1>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-12 col-md-6 mb-3">
                    <div className="input-group">
                      <span className="input-group-text">Nombre:</span>
                      <input 
                        type="text" 
                        onChange={(event) => setNombre(event.target.value)}
                        className="form-control" 
                        value={nombre} 
                        placeholder="Ingrese el nombre" 
                      />
                    </div>
                  </div>

                  <div className="col-12 col-md-6 mb-3">
                    <div className="input-group">
                      <span className="input-group-text">Dirección:</span>
                      <input 
                        type="text" 
                        onChange={(event) => setDireccion(event.target.value)}
                        className="form-control" 
                        value={direccion} 
                        placeholder="Ingrese la dirección" 
                      />
                    </div>
                  </div>

                  <div className="col-12 col-md-6 mb-3">
                    <div className="input-group">
                      <span className="input-group-text">Teléfono:</span>
                      <input 
                        type="number" 
                        value={numero_telefonico}
                        onChange={(event) => setNumero_telefonico(event.target.value)}
                        className="form-control"  
                        placeholder="Ingrese su teléfono" 
                      />
                    </div>
                  </div>
              
                  <div className="col-12 col-md-6 mb-3">
                    <div className="input-group">
                      <span className="input-group-text">Empresa:</span>
                      <input 
                        type="text" 
                        onChange={(event) => setEmpresa(event.target.value)}
                        className="form-control" 
                        value={empresa} 
                        placeholder="Ingrese el nombre de la empresa" 
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
                    <th scope="col">Nombre</th>
                    <th scope="col">Dirección</th>
                    <th scope="col">Teléfono</th>
                    <th scope="col">Empresa</th>
                    <th scope="col">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {proveedoresFiltrados.map((val) => (
                    <tr key={val.id_proveedores}>
                      <td>{val.nombre}</td>
                      <td>{val.direccion}</td>
                      <td>{val.Numero_telefonico}</td>
                      <td>{val.empresa}</td>
                      <td>
                        <div className="btn-group" role="group">
                          <button 
                            type="button" 
                            onClick={() => editarProveedor(val)}
                            className="btn btn-info btn-sm text-white"
                          >
                            Editar
                          </button>
                          <button 
                            type="button" 
                            onClick={() => deleteProv(val)}  
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
    </div>
  );
}

export default App;