import '../App.css';
import { useState, useEffect } from "react";
import Axios from "axios"; 
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Swal from 'sweetalert2';
import Navbar from '../components/NavBar';

function Pedidos() {
  const [talla, setTalla] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [fechaConfeccion, setFechaConfeccion] = useState("");
  const [fechaEntrega, setFechaEntrega] = useState("");
  const [costo, setCosto] = useState("");
  const [estado, setEstado] = useState("");
  const [idPedido, setIdPedido] = useState();
  const [idTipoPrenda, setIdTipoPrenda] = useState("");
  const [idCliente, setIdCliente] = useState("");
  const [editar, setEditar] = useState(false);
  const [pedidosList, setPedidos] = useState([]);
  const [tiposPrenda, setTiposPrenda] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Efectos para el sidebar
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

  // Obtener datos iniciales
  const getPedidos = () => {
    Axios.get("http://localhost:3001/pedidos")
      .then((response) => {
        setPedidos(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener pedidos:", error);
      });
  };

  const getTiposPrenda = () => {
    Axios.get("http://localhost:3001/tipoprenda")
      .then((response) => {
        setTiposPrenda(response.data);
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
    getTiposPrenda();
    getClientes();
  }, []);

  // Operaciones CRUD
  const add = () => {
    Axios.post("http://localhost:3001/pedidos/create", {
      Talla: talla,
      cantidad_confeccionada: cantidad,
      fecha_de_confeccion: fechaConfeccion,
      Fecha_estimada_de_entrega: fechaEntrega,
      costo_por_unidad: costo,
      Estado: estado,
      id_tipo_prenda: idTipoPrenda,
      id_cliente: idCliente
    })
      .then(() => {
        getPedidos();
        LimpiarCampos();
        Swal.fire({
          title: "<strong>Pedido registrado!</strong>",
          html: "<i>El pedido fue registrado con éxito!</i>",
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
    Axios.put("http://localhost:3001/pedidos/update", {
      id_pedidos: idPedido,
      Talla: talla,
      cantidad_confeccionada: cantidad,
      fecha_de_confeccion: fechaConfeccion,
      Fecha_estimada_de_entrega: fechaEntrega,
      costo_por_unidad: costo,
      Estado: estado,
      id_tipo_prenda: idTipoPrenda,
      id_cliente: idCliente
    })
      .then(() => {
        getPedidos();
        LimpiarCampos();
        Swal.fire({
          title: "<strong>Pedido actualizado!</strong>",
          html: "<i>El pedido fue actualizado con éxito!</i>",
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
        Axios.delete(`http://localhost:3001/pedidos/delete/${val.id_pedidos}`)
          .then(() => {
            getPedidos();
            LimpiarCampos();
            Swal.fire({
              title: "¡Eliminado!",
              text: "El pedido fue eliminado",
              icon: "success",
              timer: 850
            });
          })
          .catch(function(error) {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "No se logró eliminar el pedido",
              footer: JSON.parse(JSON.stringify(error)).message === "Network Error" 
                ? "Intente más tarde" 
                : JSON.parse(JSON.stringify(error)).message
            });
          });
      }
    });
  };

  const LimpiarCampos = () => {
    setTalla("");
    setCantidad("");
    setFechaConfeccion("");
    setFechaEntrega("");
    setCosto("");
    setEstado("");
    setIdTipoPrenda("");
    setIdCliente("");
    setEditar(false);
  };

  const editarPedido = (val) => {
    setEditar(true);
    setTalla(val.Talla);
    setCantidad(val.cantidad_confeccionada);
    setFechaConfeccion(val.fecha_de_confeccion);
    setFechaEntrega(val.Fecha_estimada_de_entrega);
    setCosto(val.costo_por_unidad);
    setEstado(val.Estado);
    setIdTipoPrenda(val.id_tipo_prenda);
    setIdCliente(val.id_cliente);
    setIdPedido(val.id_pedidos);
  };

  return (
    <>
      <Navbar />
      <div className={`container px-md-4 content ${sidebarOpen ? 'sidebar-expanded' : ''}`}>
        <div className="row justify-content-center">
          <div className="col-12 col-md-10">
            <div className="card text-center my-4">
              <div className="card-header bg-primary text-white">
                <h1 className="h5 mb-0">REGISTRO DE PEDIDOS</h1>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-12 col-md-6 mb-3">
                    <div className="input-group">
                      <span className="input-group-text">Talla:</span>
                      <input 
                        type="text" 
                        onChange={(e) => setTalla(e.target.value)}
                        className="form-control" 
                        value={talla} 
                        placeholder="Ej: M, L, XL" 
                      />
                    </div>
                  </div>

                  <div className="col-12 col-md-6 mb-3">
                    <div className="input-group">
                      <span className="input-group-text">Cantidad:</span>
                      <input 
                        type="number" 
                        onChange={(e) => setCantidad(e.target.value)}
                        className="form-control" 
                        value={cantidad} 
                        placeholder="Cantidad de prendas" 
                      />
                    </div>
                  </div>

                  <div className="col-12 col-md-6 mb-3">
                    <div className="input-group">
                      <span className="input-group-text">Fecha Confección:</span>
                      <input 
                        type="date" 
                        onChange={(e) => setFechaConfeccion(e.target.value)}
                        className="form-control" 
                        value={fechaConfeccion} 
                      />
                    </div>
                  </div>

                  <div className="col-12 col-md-6 mb-3">
                    <div className="input-group">
                      <span className="input-group-text">Fecha Entrega:</span>
                      <input 
                        type="date" 
                        onChange={(e) => setFechaEntrega(e.target.value)}
                        className="form-control" 
                        value={fechaEntrega} 
                      />
                    </div>
                  </div>

                  <div className="col-12 col-md-6 mb-3">
                    <div className="input-group">
                      <span className="input-group-text">Costo por unidad:</span>
                      <input 
                        type="number" 
                        step="0.01"
                        onChange={(e) => setCosto(e.target.value)}
                        className="form-control" 
                        value={costo} 
                        placeholder="Costo unitario" 
                      />
                    </div>
                  </div>

                  <div className="col-12 col-md-6 mb-3">
                    <div className="input-group">
                      <span className="input-group-text">Estado:</span>
                      <select
                        className="form-select"
                        value={estado}
                        onChange={(e) => setEstado(e.target.value)}
                      >
                        <option value="">Seleccione...</option>
                        <option value="Pendiente">Pendiente</option>
                        <option value="En proceso">En proceso</option>
                        <option value="Terminado">Terminado</option>
                        <option value="Entregado">Entregado</option>
                      </select>
                    </div>
                  </div>

                  <div className="col-12 col-md-6 mb-3">
                    <div className="input-group">
                      <span className="input-group-text">Tipo de Prenda:</span>
                      <select
                        className="form-select"
                        value={idTipoPrenda}
                        onChange={(e) => setIdTipoPrenda(e.target.value)}
                      >
                        <option value="">Seleccione...</option>
                        {tiposPrenda.map((tipo) => (
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
                        value={idCliente}
                        onChange={(e) => setIdCliente(e.target.value)}
                      >
                        <option value="">Seleccione...</option>
                        {clientes.map((cliente) => (
                          <option key={cliente.id_cliente} value={cliente.id_cliente}>
                            {cliente.Cliente}
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
                    <th>ID</th>
                    <th>Talla</th>
                    <th>Cantidad</th>
                    <th>Fecha Confección</th>
                    <th>Fecha Entrega</th>
                    <th>Costo Unitario</th>
                    <th>Estado</th>
                    <th>Tipo Prenda</th>
                    <th>Cliente</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {pedidosList.map((val) => {
                    const tipoPrenda = tiposPrenda.find(t => t.id_tipo_prenda === val.id_tipo_prenda)?.tipo_prenda || '';
                    const cliente = clientes.find(c => c.id_cliente === val.id_cliente)?.Cliente || '';
                    
                    return (
                      <tr key={val.id_pedidos}>
                        <td>{val.id_pedidos}</td>
                        <td>{val.Talla}</td>
                        <td>{val.cantidad_confeccionada}</td>
                        <td>{new Date(val.fecha_de_confeccion).toLocaleDateString()}</td>
                        <td>{new Date(val.Fecha_estimada_de_entrega).toLocaleDateString()}</td>
                        <td>${val.costo_por_unidad}</td>
                        <td>{val.Estado}</td>
                        <td>{tipoPrenda}</td>
                        <td>{cliente}</td>
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

export default Pedidos;
