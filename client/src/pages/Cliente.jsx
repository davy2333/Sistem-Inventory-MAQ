import '../App.css';
import { useState, useEffect } from "react";
import Axios from "axios"; 
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Swal from 'sweetalert2';
import Navbar from '../components/NavBar';

function Cliente() {
  const [cliente, setCliente] = useState("");
  const [numeroTelefonico, setNumeroTelefonico] = useState("");
  const [email, setEmail] = useState("");
  const [idCliente, setIdCliente] = useState();
  const [editar, setEditar] = useState(false);
  const [clientesList, setClientes] = useState([]);
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

  const getClientes = () => {
    Axios.get("http://localhost:3001/clientes")
      .then((response) => {
        setClientes(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener clientes:", error);
      });
  };

  useEffect(() => {
    getClientes();
  }, []);

  // Filtrar clientes según la búsqueda
  const clientesFiltrados = clientesList.filter(cli => {
    return (
      cli.Cliente.toLowerCase().includes(busqueda.toLowerCase()) ||
      (cli.numero_telefonico && cli.numero_telefonico.toString().includes(busqueda)) ||
      (cli.Email && cli.Email.toLowerCase().includes(busqueda.toLowerCase()))
    );
  });

  const add = () => {
    Axios.post("http://localhost:3001/clientes/create", {
      Cliente: cliente,
      numero_telefonico: numeroTelefonico,
      Email: email
    })
      .then(() => {
        getClientes();
        LimpiarCampos();
        Swal.fire({
          title: "<strong>Registro exitoso!</strong>",
          html: `<i>El cliente <strong>${cliente}</strong> fue registrado con éxito!</i>`,
          icon: 'success',
          timer: 3000
        });
      })
      .catch(function(error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: JSON.parse(JSON.stringify(error)).message === "Network Error" 
            ? "Intente más tarde" 
            : JSON.parse(JSON.stringify(error)).message
        });
      });
  };

  const update = () => {
    Axios.put("http://localhost:3001/clientes/update", {
      id_cliente: idCliente,
      Cliente: cliente,
      numero_telefonico: numeroTelefonico,
      Email: email
    })
      .then(() => {
        getClientes();
        LimpiarCampos();
        Swal.fire({
          title: "<strong>Actualización exitosa!</strong>",
          html: `<i>El cliente <strong>${cliente}</strong> fue actualizado con éxito!</i>`,
          icon: 'success',
          timer: 3000
        });
      })
      .catch(function(error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: JSON.parse(JSON.stringify(error)).message === "Network Error" 
            ? "Intente más tarde" 
            : JSON.parse(JSON.stringify(error)).message
        });
      });
  };

  const deleteCliente = (val) => {
    Swal.fire({
      title: "¿Confirmar?",
      html: `<i>¿Realmente desea eliminar al cliente <strong>${val.Cliente}</strong>?</i>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminarlo!"
    }).then((result) => {
      if (result.isConfirmed) {
        Axios.delete(`http://localhost:3001/clientes/delete/${val.id_cliente}`)
          .then(() => {
            getClientes();
            LimpiarCampos();
            Swal.fire({
              title: "¡Eliminado!",
              text: val.Cliente + " fue eliminado",
              icon: "success",
              timer: 850
            });
          })
          .catch(function(error) {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "No se logró eliminar el cliente",
              footer: JSON.parse(JSON.stringify(error)).message === "Network Error" 
                ? "Intente más tarde" 
                : JSON.parse(JSON.stringify(error)).message
            });
          });
      }
    });
  };

  const LimpiarCampos = () => {
    setCliente("");
    setNumeroTelefonico("");
    setEmail("");
    setEditar(false);
  };

  const editarCliente = (val) => {
    setEditar(true);
    setCliente(val.Cliente);
    setNumeroTelefonico(val.numero_telefonico);
    setEmail(val.Email);
    setIdCliente(val.id_cliente);
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
                    placeholder="Buscar clientes por nombre, teléfono o email..."
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
                <h1 className="h5 mb-0">CLIENTES</h1>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-12 col-md-6 mb-3">
                    <div className="input-group">
                      <span className="input-group-text">Nombre:</span>
                      <input 
                        type="text" 
                        onChange={(event) => setCliente(event.target.value)}
                        className="form-control" 
                        value={cliente} 
                        placeholder="Ingrese el nombre del cliente" 
                      />
                    </div>
                  </div>

                  <div className="col-12 col-md-6 mb-3">
                    <div className="input-group">
                      <span className="input-group-text">Teléfono:</span>
                      <input 
                        type="text" 
                        onChange={(event) => setNumeroTelefonico(event.target.value)}
                        className="form-control" 
                        value={numeroTelefonico} 
                        placeholder="Ingrese el teléfono" 
                      />
                    </div>
                  </div>

                  <div className="col-12 mb-3">
                    <div className="input-group">
                      <span className="input-group-text">Email:</span>
                      <input 
                        type="email" 
                        onChange={(event) => setEmail(event.target.value)}
                        className="form-control" 
                        value={email} 
                        placeholder="Ingrese el email" 
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
                    <th scope="col">Teléfono</th>
                    <th scope="col">Email</th>
                    <th scope="col">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {clientesFiltrados.map((val) => (
                    <tr key={val.id_cliente}>
                      <td>{val.Cliente}</td>
                      <td>{val.numero_telefonico}</td>
                      <td>{val.Email}</td>
                      <td>
                        <div className="btn-group" role="group">
                          <button 
                            type="button" 
                            onClick={() => editarCliente(val)}
                            className="btn btn-info btn-sm text-white"
                          >
                            Editar
                          </button>
                          <button 
                            type="button" 
                            onClick={() => deleteCliente(val)}  
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

export default Cliente;