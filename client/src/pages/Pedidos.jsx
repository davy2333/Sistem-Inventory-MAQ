import React, { useState, useEffect } from "react";
import Axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Swal from 'sweetalert2';
import Navbar from '../components/NavBar';

const Pedidos = () => {
  const [Talla, setTalla] = useState("");
  const [cantidad_confeccionada, setCantidadConfeccionada] = useState("");
  const [fecha_de_confeccion, setFechaConfeccion] = useState("");
  const [Fecha_estimada_de_entrega, setFechaEstimada] = useState("");
  const [costo_por_unidad, setCostoUnidad] = useState("");
  const [Foto, setFoto] = useState("");
  const [Estado, setEstado] = useState("Pendiente");
  const [id_tipo_prenda, setIdTipoPrenda] = useState("");
  const [id_cliente, setIdCliente] = useState("");
  const [id_pedidos, setIdPedido] = useState("");
  const [editar, setEditar] = useState(false);
  const [pedidosList, setPedidos] = useState([]);
  const [tipoPrendaList, setTipoPrenda] = useState([]);
  const [clientesList, setClientes] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

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

  const getPedidos = () => {
    Axios.get("http://localhost:3001/pedidos")
      .then((response) => {
        setPedidos(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener pedidos:", error);
      });
  };

  const getTipoPrenda = () => {
    Axios.get("http://localhost:3001/tipoprenda")
      .then((response) => {
        setTipoPrenda(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener tipos de prenda:", error);
      });
  };

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
    getPedidos();
    getTipoPrenda();
    getClientes();
  }, []);

  // Filtrar pedidos según la búsqueda
  const pedidosFiltrados = pedidosList.filter(pedido => {
    return (
      (pedido.Talla && pedido.Talla.toLowerCase().includes(busqueda.toLowerCase())) ||
      (pedido.nombre_cliente && pedido.nombre_cliente.toLowerCase().includes(busqueda.toLowerCase())) ||
      (pedido.nombre_prenda && pedido.nombre_prenda.toLowerCase().includes(busqueda.toLowerCase())) ||
      (pedido.Estado && pedido.Estado.toLowerCase().includes(busqueda.toLowerCase()))
    );
  });

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const uploadImage = () => {
    if (!selectedFile) return Promise.resolve(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    return Axios.post("http://localhost:3001/upload", formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(response => {
      return response.data.filename;
    }).catch(error => {
      console.error("Error al subir la imagen:", error);
      return null;
    });
  };

  const add = async () => {
    let imageFilename = Foto;
    
    if (selectedFile) {
      imageFilename = await uploadImage();
      if (!imageFilename) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo subir la imagen"
        });
        return;
      }
    }

    Axios.post("http://localhost:3001/pedidos/create", {
      Talla: Talla,
      cantidad_confeccionada: cantidad_confeccionada,
      fecha_de_confeccion: fecha_de_confeccion,
      Fecha_estimada_de_entrega: Fecha_estimada_de_entrega,
      costo_por_unidad: costo_por_unidad,
      Foto: imageFilename,
      Estado: Estado,
      id_tipo_prenda: id_tipo_prenda,
      id_cliente: id_cliente
    })
      .then(() => {
        getPedidos();
        LimpiarCampos();
        Swal.fire({
          title: "<strong>Registro exitoso!</strong>",
          html: "<i>El pedido fue registrado con éxito!</i>",
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

  const update = async () => {
    let imageFilename = Foto;
    
    if (selectedFile) {
      imageFilename = await uploadImage();
      if (!imageFilename) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo subir la imagen"
        });
        return;
      }
    }

    Axios.put("http://localhost:3001/pedidos/update", {
      id_pedidos: id_pedidos,
      Talla: Talla,
      cantidad_confeccionada: cantidad_confeccionada,
      fecha_de_confeccion: fecha_de_confeccion,
      Fecha_estimada_de_entrega: Fecha_estimada_de_entrega,
      costo_por_unidad: costo_por_unidad,
      Foto: imageFilename,
      Estado: Estado,
      id_tipo_prenda: id_tipo_prenda,
      id_cliente: id_cliente
    })
      .then(() => {
        getPedidos();
        LimpiarCampos();
        Swal.fire({
          title: "<strong>Actualización exitosa!</strong>",
          html: "<i>El pedido fue actualizado con éxito!</i>",
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

  const deletePedido = (val) => {
    Swal.fire({
      title: "¿Confirmar?",
      html: "<i>¿Realmente desea eliminar este pedido?</i>",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminarlo!"
    }).then((result) => {
      if (result.isConfirmed) {
        Axios.delete(`http://localhost:3001/pedidos/delete/${val.id_pedidos}`).then(() => {
          getPedidos();
          LimpiarCampos();
          Swal.fire({
            title: "Eliminado!",
            text: "El pedido fue eliminado",
            icon: "success",
            timer: 850
          });
        }).catch(function(error) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "No se logró eliminar el pedido",
            footer: JSON.parse(JSON.stringify(error)).message === "Network Error" ? "Intente más tarde" : JSON.parse(JSON.stringify(error)).message
          });
        });
      }
    });
  };

  const LimpiarCampos = () => {
    setTalla("");
    setCantidadConfeccionada("");
    setFechaConfeccion("");
    setFechaEstimada("");
    setCostoUnidad("");
    setFoto("");
    setEstado("Pendiente");
    setIdTipoPrenda("");
    setIdCliente("");
    setSelectedFile(null);
    setEditar(false);
  };

  const editarPedido = (val) => {
    setEditar(true);
    setTalla(val.Talla);
    setCantidadConfeccionada(val.cantidad_confeccionada);
    setFechaConfeccion(val.fecha_de_confeccion);
    setFechaEstimada(val.Fecha_estimada_de_entrega);
    setCostoUnidad(val.costo_por_unidad);
    setFoto(val.Foto);
    setEstado(val.Estado);
    setIdTipoPrenda(val.id_tipo_prenda);
    setIdCliente(val.id_cliente);
    setIdPedido(val.id_pedidos);
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
                    placeholder="Buscar pedidos por talla, cliente, prenda o estado..."
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
                <h1 className="h5 mb-0">GESTIÓN DE PEDIDOS</h1>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-12 col-md-6 mb-3">
                    <div className="input-group">
                      <span className="input-group-text">Talla:</span>
                      <input 
                        type="text" 
                        onChange={(event) => setTalla(event.target.value)}
                        className="form-control" 
                        value={Talla} 
                        placeholder="Ingrese la talla" 
                      />
                    </div>
                  </div>

                  <div className="col-12 col-md-6 mb-3">
                    <div className="input-group">
                      <span className="input-group-text">Cantidad:</span>
                      <input 
                        type="number" 
                        onChange={(event) => setCantidadConfeccionada(event.target.value)}
                        className="form-control" 
                        value={cantidad_confeccionada} 
                        placeholder="Ingrese la cantidad" 
                      />
                    </div>
                  </div>

                  <div className="col-12 col-md-6 mb-3">
                    <div className="input-group">
                      <span className="input-group-text">Fecha confección:</span>
                      <input 
                        type="date" 
                        onChange={(event) => setFechaConfeccion(event.target.value)}
                        className="form-control" 
                        value={fecha_de_confeccion} 
                      />
                    </div>
                  </div>

                  <div className="col-12 col-md-6 mb-3">
                    <div className="input-group">
                      <span className="input-group-text">Fecha estimada:</span>
                      <input 
                        type="date" 
                        value={Fecha_estimada_de_entrega}
                        onChange={(event) => setFechaEstimada(event.target.value)}
                        className="form-control"  
                      />
                    </div>
                  </div>

                  <div className="col-12 col-md-6 mb-3">
                    <div className="input-group">
                      <span className="input-group-text">Costo por unidad:</span>
                      <input 
                        type="number" 
                        step="0.01"
                        onChange={(event) => setCostoUnidad(event.target.value)}
                        className="form-control" 
                        value={costo_por_unidad} 
                        placeholder="Ingrese el costo" 
                      />
                    </div>
                  </div>

                  <div className="col-12 col-md-6 mb-3">
                    <div className="input-group">
                      <span className="input-group-text">Estado:</span>
                      <select
                        className="form-select"
                        value={Estado}
                        onChange={(event) => setEstado(event.target.value)}
                      >
                        <option value="Pendiente">Pendiente</option>
                        <option value="En proceso">En proceso</option>
                        <option value="Completado">Completado</option>
                        <option value="Cancelado">Cancelado</option>
                      </select>
                    </div>
                  </div>

                  <div className="col-12 col-md-6 mb-3">
                    <div className="input-group">
                      <span className="input-group-text">Tipo de prenda:</span>
                      <select
                        className="form-select"
                        value={id_tipo_prenda}
                        onChange={(event) => setIdTipoPrenda(event.target.value)}
                      >
                        <option value="">Seleccione...</option>
                        {tipoPrendaList.map((tipo) => (
                          <option key={tipo.id_tipo_prenda} value={tipo.id_tipo_prenda}>
                            {tipo.tipo_prenda}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="col-12 col-md-6 mb-3">
                    <div className="input-group">
                      <span className="input-group-text">Cliente:</span>
                      <select
                        className="form-select"
                        value={id_cliente}
                        onChange={(event) => setIdCliente(event.target.value)}
                      >
                        <option value="">Seleccione...</option>
                        {clientesList.map((cliente) => (
                          <option key={cliente.id_cliente} value={cliente.id_cliente}>
                            {cliente.Cliente}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="col-12 mb-3">
                    <div className="input-group">
                      <span className="input-group-text">Imagen:</span>
                      <input 
                        type="file" 
                        onChange={handleFileChange}
                        className="form-control" 
                        accept="image/*"
                      />
                    </div>
                    {Foto && (
                      <div className="mt-2">
                        <small>Imagen actual:</small>
                        <img 
                          src={`http://localhost:3001/uploads/${Foto}`} 
                          alt="Prenda" 
                          style={{ maxWidth: '100px', maxHeight: '100px', display: 'block', margin: '5px auto' }}
                        />
                      </div>
                    )}
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
              <table className="table table-hover">
                <thead className="table-dark">
                  <tr>
                    <th scope="col">Talla</th>
                    <th scope="col">Cantidad</th>
                    <th scope="col">Fecha Confección</th>
                    <th scope="col">Fecha Estimada</th>
                    <th scope="col">Costo Unitario</th>
                    <th scope="col">Imagen</th>
                    <th scope="col">Estado</th>
                    <th scope="col">Tipo Prenda</th>
                    <th scope="col">Cliente</th>
                    <th scope="col">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {pedidosFiltrados.map((val) => (
                    <tr key={val.id_pedidos}>
                      <td>{val.Talla}</td>
                      <td>{val.cantidad_confeccionada}</td>
                      <td>{new Date(val.fecha_de_confeccion).toLocaleDateString()}</td>
                      <td>{new Date(val.Fecha_estimada_de_entrega).toLocaleDateString()}</td>
                      <td>${val.costo_por_unidad}</td>
                      <td>
                        {val.Foto && (
                          <img 
                            src={`http://localhost:3001/uploads/${val.Foto}`} 
                            alt="Prenda" 
                            style={{ maxWidth: '50px', maxHeight: '50px' }}
                          />
                        )}
                      </td>
                      <td>{val.Estado}</td>
                      <td>{val.nombre_prenda}</td>
                      <td>{val.nombre_cliente}</td>
                      <td>
                        <div className="btn-group" role="group">
                          <button 
                            type="button" 
                            onClick={() => editarPedido(val)}
                            className="btn btn-info btn-sm text-white"
                          >
                            Editar
                          </button>
                          <button 
                            type="button" 
                            onClick={() => deletePedido(val)}  
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
};

export default Pedidos;