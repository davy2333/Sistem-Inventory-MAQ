import '../App.css';
import { useState, useEffect } from "react";
import Axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Swal from 'sweetalert2';
import Navbar from '../components/NavBar';

function Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [prendas, setPrendas] = useState([]);

  const [talla, setTalla] = useState("");
  const [cantidad_confeccionada, setCantidad] = useState(0);
  const [fecha_de_confeccion, setFechaConfeccion] = useState("");
  const [fecha_estimada, setFechaEntrega] = useState("");
  const [costo_por_unidad, setCosto] = useState("");
  const [foto, setFoto] = useState("");
  const [estado, setEstado] = useState("");
  const [id_tipo_prenda, setTipoPrenda] = useState("");
  const [id_cliente, setCliente] = useState("");
  const [id_pedidos, setId] = useState();
  const [editar, setEditar] = useState(false);

  useEffect(() => {
    getPedidos();
    getClientes();
    getPrendas();
  }, []);

  const getPedidos = () => Axios.get("http://localhost:3001/pedidos").then((res) => setPedidos(res.data));
  const getClientes = () => Axios.get("http://localhost:3001/clientes").then((res) => setClientes(res.data));
  const getPrendas = () => Axios.get("http://localhost:3001/tipoprenda").then((res) => setPrendas(res.data));

  const LimpiarCampos = () => {
    setTalla(""); setCantidad(0); setFechaConfeccion("");
    setFechaEntrega(""); setCosto(""); setFoto(""); setEstado("");
    setTipoPrenda(""); setCliente(""); setEditar(false);
  };

  const subirFoto = (e) => {
    const formData = new FormData();
    formData.append("file", e.target.files[0]);

    Axios.post("http://localhost:3001/upload", formData)
      .then(res => setFoto(`http://localhost:3001/uploads/${res.data.filename}`))
      .catch(() => Swal.fire("Error", "No se pudo subir la imagen", "error"));
  };

  const add = () => {
    if (!id_tipo_prenda || !id_cliente) {
      Swal.fire("Campos obligatorios", "Debe seleccionar un cliente y una prenda.", "warning");
      return;
    }
    Axios.post("http://localhost:3001/pedidos/create", {
      talla, cantidad_confeccionada, fecha_de_confeccion,
      Fecha_estimada_de_entrega: fecha_estimada, costo_por_unidad,
      Foto: foto, Estado: estado, id_tipo_prenda, id_cliente
    }).then(() => {
      getPedidos(); LimpiarCampos();
      Swal.fire("Pedido registrado exitosamente", "", "success");
    }).catch(() => Swal.fire("Error", "No se pudo registrar el pedido", "error"));
  };

  const update = () => {
    if (!id_tipo_prenda || !id_cliente) {
      Swal.fire("Campos obligatorios", "Debe seleccionar un cliente y una prenda.", "warning");
      return;
    }
    Axios.put("http://localhost:3001/pedidos/update", {
      id_pedidos, talla, cantidad_confeccionada, fecha_de_confeccion,
      Fecha_estimada_de_entrega: fecha_estimada, costo_por_unidad,
      Foto: foto, Estado: estado, id_tipo_prenda, id_cliente
    }).then(() => {
      getPedidos(); LimpiarCampos();
      Swal.fire("Pedido actualizado", "", "success");
    }).catch(() => Swal.fire("Error", "No se pudo actualizar el pedido", "error"));
  };

  const eliminar = (val) => {
    Swal.fire({
      title: `¿Eliminar el pedido ${val.id_pedidos}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar"
    }).then((result) => {
      if (result.isConfirmed) {
        Axios.delete(`http://localhost:3001/pedidos/delete/${val.id_pedidos}`)
          .then(() => {
            getPedidos();
            Swal.fire("Pedido eliminado", "", "success");
          });
      }
    });
  };

  const editarPedido = (val) => {
    setEditar(true);
    setId(val.id_pedidos);
    setTalla(val.Talla);
    setCantidad(val.cantidad_confeccionada);
    setFechaConfeccion(val.fecha_de_confeccion?.slice(0, 10));
    setFechaEntrega(val.Fecha_estimada_de_entrega?.slice(0, 10));
    setCosto(val.costo_por_unidad);
    setFoto(val.Foto);
    setEstado(val.Estado);
    setTipoPrenda(val.id_tipo_prenda);
    setCliente(val.id_cliente);
  };

  return (
    <>
      <Navbar />
      <div className="container px-md-4 content">
        <div className="row justify-content-center">
          <div className="col-12 col-md-10">
            <div className="card text-center my-4">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">GESTIÓN DE PEDIDOS</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6 mb-2">
                    <input className="form-control" placeholder="Talla" value={talla} onChange={e => setTalla(e.target.value)} />
                  </div>
                  <div className="col-md-6 mb-2">
                    <input type="number" className="form-control" placeholder="Cantidad" value={cantidad_confeccionada} onChange={e => setCantidad(e.target.value)} />
                  </div>
                  <div className="col-md-6 mb-2">
                    <input type="date" className="form-control" value={fecha_de_confeccion} onChange={e => setFechaConfeccion(e.target.value)} />
                  </div>
                  <div className="col-md-6 mb-2">
                    <input type="date" className="form-control" value={fecha_estimada} onChange={e => setFechaEntrega(e.target.value)} />
                  </div>
                  <div className="col-md-6 mb-2">
                    <input type="number" className="form-control" placeholder="Costo por unidad" value={costo_por_unidad} onChange={e => setCosto(e.target.value)} />
                  </div>
                  <div className="col-md-6 mb-2">
                    <input type="file" className="form-control" onChange={subirFoto} />
                    {foto && <img src={foto} alt="Preview" className="mt-2" width="80" />}
                  </div>
                  <div className="col-md-6 mb-2">
                    <input className="form-control" placeholder="Estado" value={estado} onChange={e => setEstado(e.target.value)} />
                  </div>
                  <div className="col-md-6 mb-2">
                    <select className="form-control" value={id_tipo_prenda} onChange={e => setTipoPrenda(e.target.value)}>
                      <option value="">Seleccione una prenda</option>
                      {prendas.map(p => (
                        <option key={p.id_tipo_prenda} value={p.id_tipo_prenda}>{p.tipo_prenda}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-12 mb-2">
                    <select className="form-control" value={id_cliente} onChange={e => setCliente(e.target.value)}>
                      <option value="">Seleccione un cliente</option>
                      {clientes.map(c => (
                        <option key={c.id_cliente} value={c.id_cliente}>{c.Cliente}</option>
                      ))}
                    </select>
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
                    <th>Talla</th><th>Cantidad</th><th>Fecha Conf.</th><th>Entrega</th><th>Costo</th><th>Foto</th><th>Estado</th><th>Prenda</th><th>Cliente</th><th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {pedidos.map((val) => (
                    <tr key={val.id_pedidos}>
                      <td>{val.Talla}</td>
                      <td>{val.cantidad_confeccionada}</td>
                      <td>{val.fecha_de_confeccion?.slice(0, 10)}</td>
                      <td>{val.Fecha_estimada_de_entrega?.slice(0, 10)}</td>
                      <td>{val.costo_por_unidad}</td>
                      <td><img src={val.Foto} width="50" alt="img" /></td>
                      <td>{val.Estado}</td>
                      <td>{val.nombre_prenda}</td>
                      <td>{val.nombre_cliente}</td>
                      <td>
                        <button className="btn btn-info btn-sm me-1" onClick={() => editarPedido(val)}>Editar</button>
                        <button className="btn btn-danger btn-sm" onClick={() => eliminar(val)}>Eliminar</button>
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

export default Pedidos;
