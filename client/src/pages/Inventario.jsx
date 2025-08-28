import '../App.css';
import { useState, useEffect } from "react";
import Axios from "axios"; 
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Swal from 'sweetalert2';
import Navbar from '../components/NavBar';

function Inventario() {
  const [tipoDeEquipo, setTipoDeEquipo] = useState("");
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [precio, setPrecio] = useState("");
  const [fechaDeAdquisicion, setFechaDeAdquisicion] = useState("");
  const [condicion, setCondicion] = useState("");
  const [codigo, setCodigo] = useState("");
  const [idProveedor, setIdProveedor] = useState("");
  const [idInventario, setIdInventario] = useState();
  const [editar, setEditar] = useState(false);
  const [inventarioList, setInventario] = useState([]);
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

  const getInventario = () => {
    Axios.get("http://localhost:3001/inventario")
      .then((response) => {
        console.log('Datos recibidos del inventario:', response.data); // ← PARA DEBUG
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
    getInventario();
    getProveedores();
  }, []);

  // Filtrar inventario según la búsqueda (CAMBIADO a minúsculas)
  const inventarioFiltrado = inventarioList.filter(item => {
    return (
      (item.tipo_de_equipo && item.tipo_de_equipo.toLowerCase().includes(busqueda.toLowerCase())) ||
      (item.marca && item.marca.toLowerCase().includes(busqueda.toLowerCase())) ||
      (item.modelo && item.modelo.toLowerCase().includes(busqueda.toLowerCase())) ||
      (item.codigo && item.codigo.toString().includes(busqueda)) ||
      (item.condicion && item.condicion.toLowerCase().includes(busqueda.toLowerCase()))
    );
  });

  const add = () => {
    Axios.post("http://localhost:3001/create-inventario", {
      tipoDeEquipo: tipoDeEquipo,
      marca: marca,
      modelo: modelo,
      precio: precio,
      fechaDeAdquisicion: fechaDeAdquisicion,
      condicion: condicion,
      codigo: codigo,
      idProveedor: idProveedor
    })
      .then(() => {
        getInventario();
        LimpiarCampos();
        Swal.fire({
          title: "<strong>Registro exitoso!!</strong>",
          html: `<i>El equipo <strong>${tipoDeEquipo}</strong> fue registrado con éxito!!</i>`,
          icon: 'success',
          timer: 3000
        });
      }).catch(function(error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: JSON.parse(JSON.stringify(error)).message === "Network Error" ? "Intente más tarde" : JSON.parse(JSON.stringify(error)).message
        });
      });
  };

  const update = () => {
    Axios.put("http://localhost:3001/update-inventario", {
      idInventario: idInventario,
      tipoDeEquipo: tipoDeEquipo,
      marca: marca,
      modelo: modelo,
      precio: precio,
      fechaDeAdquisicion: fechaDeAdquisicion,
      condicion: condicion,
      codigo: codigo,
      idProveedor: idProveedor
    })
      .then(() => {
        getInventario();
        LimpiarCampos();
        Swal.fire({
          title: "<strong>Actualización exitosa!!</strong>",
          html: `<i>El equipo <strong>${tipoDeEquipo}</strong> fue actualizado con éxito!!</i>`,
          icon: 'success',
          timer: 3000
        });
      }).catch(function(error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: JSON.parse(JSON.stringify(error)).message === "Network Error" ? "Intente más tarde" : JSON.parse(JSON.stringify(error)).message
        });
      });
  };

  const deleteItem = (val) => {
    Swal.fire({
      title: "¿Confirmar?",
      html: `<i>¿Realmente desea eliminar el equipo <strong>${val.tipo_de_equipo}</strong>?</i>`, // ← CAMBIADO
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "¡Sí, eliminarlo!"
    }).then((result) => {
      if (result.isConfirmed) {
        Axios.delete(`http://localhost:3001/delete-inventario/${val.id_inventario}`).then(() => {
          getInventario();
          LimpiarCampos();
          Swal.fire({
            title: "¡Eliminado!",
            text: `${val.tipo_de_equipo} fue eliminado`, // ← CAMBIADO
            icon: "success",
            timer: 850
          });
        }).catch(function(error) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "No se logró eliminar el equipo",
            footer: JSON.parse(JSON.stringify(error)).message === "Network Error" ? "Intente más tarde" : JSON.parse(JSON.stringify(error)).message
          });
        });
      }
    });
  };

  const LimpiarCampos = () => {
    setTipoDeEquipo("");
    setMarca("");
    setModelo("");
    setPrecio("");
    setFechaDeAdquisicion("");
    setCondicion("");
    setCodigo("");
    setIdProveedor("");
    setEditar(false);
  };

  const editarItem = (val) => {
    setEditar(true);
    setTipoDeEquipo(val.tipo_de_equipo); // ← CAMBIADO
    setMarca(val.marca); // ← CAMBIADO
    setModelo(val.modelo); // ← CAMBIADO
    setPrecio(val.precio); // ← CAMBIADO
    setFechaDeAdquisicion(val.fecha_de_adquisicion); // ← CAMBIADO
    setCondicion(val.condicion); // ← CAMBIADO
    setCodigo(val.codigo); // ← CAMBIADO
    setIdProveedor(val.id_proveedores);
    setIdInventario(val.id_inventario);
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
                    placeholder="Buscar equipos por tipo, marca, modelo, código o condición..."
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
              <div className="card-header  text-black bg-light">
                <h1 className="h5 mb-0">INVENTARIO</h1>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-12 col-md-6 mb-3">
                    <div className="input-group">
                      <span className="input-group-text">Tipo de Equipo:</span>
                      <input 
                        type="text" 
                        onChange={(event) => setTipoDeEquipo(event.target.value)}
                        className="form-control" 
                        value={tipoDeEquipo} 
                        placeholder="Ingrese el tipo de equipo" 
                      />
                    </div>
                  </div>

                  <div className="col-12 col-md-6 mb-3">
                    <div className="input-group">
                      <span className="input-group-text">Marca:</span>
                      <input 
                        type="text" 
                        onChange={(event) => setMarca(event.target.value)}
                        className="form-control" 
                        value={marca} 
                        placeholder="Ingrese la marca" 
                      />
                    </div>
                  </div>

                  <div className="col-12 col-md-6 mb-3">
                    <div className="input-group">
                      <span className="input-group-text">Modelo:</span>
                      <input 
                        type="text" 
                        value={modelo}
                        onChange={(event) => setModelo(event.target.value)}
                        className="form-control"  
                        placeholder="Ingrese el modelo" 
                      />
                    </div>
                  </div>
              
                  <div className="col-12 col-md-6 mb-3">
                    <div className="input-group">
                      <span className="input-group-text">Precio:</span>
                      <input 
                        type="number" 
                        onChange={(event) => setPrecio(event.target.value)}
                        className="form-control" 
                        value={precio} 
                        placeholder="Ingrese el precio" 
                      />
                    </div>
                  </div>

                  <div className="col-12 col-md-6 mb-3">
                    <div className="input-group">
                      <span className="input-group-text">Fecha Adquisición:</span>
                      <input 
                        type="date" 
                        onChange={(event) => setFechaDeAdquisicion(event.target.value)}
                        className="form-control" 
                        value={fechaDeAdquisicion} 
                      />
                    </div>
                  </div>

                  <div className="col-12 col-md-6 mb-3">
                    <div className="input-group">
                      <span className="input-group-text">Condición:</span>
                      <select
                        className="form-select"
                        value={condicion}
                        onChange={(event) => setCondicion(event.target.value)}
                      >
                        <option value="">Seleccione...</option>
                        <option value="Nuevo">Nuevo</option>
                        <option value="Usado">Usado</option>
                        <option value="Reparado">Reparado</option>
                        <option value="Dañado">Dañado</option>
                      </select>
                    </div>
                  </div>

                  <div className="col-12 col-md-6 mb-3">
                    <div className="input-group">
                      <span className="input-group-text">Código:</span>
                      <input 
                        type="number" 
                        onChange={(event) => setCodigo(event.target.value)}
                        className="form-control" 
                        value={codigo} 
                        placeholder="Ingrese el código" 
                      />
                    </div>
                  </div>

                  <div className="col-12 col-md-6 mb-3">
                    <div className="input-group">
                      <span className="input-group-text">Proveedor:</span>
                      <select
                        className="form-select"
                        value={idProveedor}
                        onChange={(event) => setIdProveedor(event.target.value)}
                      >
                        <option value="">Seleccione un proveedor</option>
                        {proveedoresList.map((proveedor) => (
                          <option key={proveedor.id_proveedores} value={proveedor.id_proveedores}>
                            {proveedor.empresa} - {proveedor.nombre}
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
              <table className="table table-hover ">
                <thead className="table">
                  <tr>
                    <th scope="col">Tipo de Equipo</th>
                    <th scope="col">Marca</th>
                    <th scope="col">Modelo</th>
                    <th scope="col">Precio</th>
                    <th scope="col">Fecha Adquisición</th>
                    <th scope="col">Condición</th>
                    <th scope="col">Código</th>
                    <th scope="col">Proveedor</th>
                    <th scope="col">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {inventarioFiltrado.map((val) => {
                    const proveedor = proveedoresList.find(p => p.id_proveedores === val.id_proveedores);
                    return (
                      <tr key={val.id_inventario}>
                        <td>{val.tipo_de_equipo}</td> {/* ← CAMBIADO */}
                        <td>{val.marca}</td> {/* ← CAMBIADO */}
                        <td>{val.modelo}</td> {/* ← CAMBIADO */}
                        <td>{val.precio}</td> {/* ← CAMBIADO */}
                        <td>{val.fecha_de_adquisicion}</td> {/* ← CAMBIADO */}
                        <td>{val.condicion}</td> {/* ← CAMBIADO */}
                        <td>{val.codigo}</td> {/* ← CAMBIADO */}
                        <td>{proveedor ? `${proveedor.empresa} - ${proveedor.nombre}` : 'N/A'}</td>
                        <td>
                          <div className="btn-group" role="group">
                            <button 
                              type="button" 
                              onClick={() => editarItem(val)}
                              className="btn btn-info btn-sm text-white"
                            >
                              Editar
                            </button>
                            <button 
                              type="button" 
                              onClick={() => deleteItem(val)}  
                              className="btn btn-danger btn-sm"
                            >
                              Eliminar
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
    </div>
  );
}

export default Inventario;