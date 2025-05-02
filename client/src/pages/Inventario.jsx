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
  const [precio, setPrecio] = useState(0);
  const [fechaDeAdquisicion, setFechaDeAdquisicion] = useState("");
  const [condicion, setCondicion] = useState("");
  const [codigo, setCodigo] = useState("");
  const [idProveedor, setIdProveedor] = useState("");
  const [idInventario, setIdInventario] = useState();
  const [editar, setEditar] = useState(false);
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
    getInventario();
    getProveedores();
  }, []);

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
          html: `<i>El equipo <strong>${tipoDeEquipo} - ${marca}</strong> fue registrado con éxito!!</i>`,
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
  }

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
          html: `<i>El equipo <strong>${tipoDeEquipo} - ${marca}</strong> fue actualizado con éxito!!</i>`,
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
  }

  const deleteItem = (val) => {
    Swal.fire({
      title: "Confirmar?",
      html: `<i>Realmente desea eliminar el equipo <strong>${val.tipo_De_Equipo} - ${val.Marca}</strong>?</i>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, eliminarlo!"
    }).then((result) => {
      if (result.isConfirmed) {
        Axios.delete(`http://localhost:3001/delete-inventario/${val.id_inventario}`).then(() => {
          getInventario();
          LimpiarCampos();
          Swal.fire({
            title: "Eliminado!",
            text: `${val.tipo_De_Equipo} - ${val.Marca} fue eliminado`,
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
  }

  const LimpiarCampos = () => {
    setTipoDeEquipo("");
    setMarca("");
    setModelo("");
    setPrecio(0);
    setFechaDeAdquisicion("");
    setCondicion("");
    setCodigo("");
    setIdProveedor("");
    setEditar(false);
  }     

  const editarItem = (val) => {
    setEditar(true);
    setTipoDeEquipo(val.tipo_De_Equipo);
    setMarca(val.Marca);
    setModelo(val.Modelo);
    setPrecio(val.Precio);
    setFechaDeAdquisicion(val.Fecha_De_Adquisicion);
    setCondicion(val.Condicion);
    setCodigo(val.Codigo);
    setIdProveedor(val.id_proveedores);
    setIdInventario(val.id_inventario);
  }

  return (
    <>
      <Navbar />
      <div className={`container px-md-4 content ${sidebarOpen ? 'sidebar-expanded' : ''}`}>
        <div className="row justify-content-center">
          <div className="col-12 col-md-10">
            <div className="card text-center my-4">
              <div className="card-header bg-primary text-white">
                <h1 className="h5 mb-0">INVENTARIO DE EQUIPOS</h1>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-12 col-md-6 mb-3">
                    <div className="input-group">
                      <span className="input-group-text">Tipo de equipo:</span>
                      <input 
                        type="text" 
                        onChange={(event) => setTipoDeEquipo(event.target.value)}
                        className="form-control" 
                        value={tipoDeEquipo} 
                        placeholder="Ej: Máquina de coser" 
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
                        onChange={(event) => setModelo(event.target.value)}
                        className="form-control" 
                        value={modelo} 
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
                        step="0.01"
                      />
                    </div>
                  </div>

                  <div className="col-12 col-md-6 mb-3">
                    <div className="input-group">
                      <span className="input-group-text">Fecha adquisición:</span>
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
                        type="text" 
                        onChange={(event) => setCodigo(event.target.value)}
                        className="form-control" 
                        value={codigo} 
                        placeholder="Código interno" 
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
                            {proveedor.nombre} - {proveedor.empresa}
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
                    <th scope="col">Tipo</th>
                    <th scope="col">Marca</th>
                    <th scope="col">Modelo</th>
                    <th scope="col">Precio</th>
                    <th scope="col">Fecha Adq.</th>
                    <th scope="col">Condición</th>
                    <th scope="col">Proveedor</th>
                    <th scope="col">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {inventarioList.map((val) => {
                    const proveedor = proveedoresList.find(p => p.id_proveedores === val.id_proveedores);
                    return (
                      <tr key={val.id_inventario}>
                        <td>{val.tipo_De_Equipo}</td>
                        <td>{val.Marca}</td>
                        <td>{val.Modelo}</td>
                        <td>${val.Precio?.toFixed(2)}</td>
                        <td>{new Date(val.Fecha_De_Adquisicion).toLocaleDateString()}</td>
                        <td>{val.Condicion}</td>
                        <td>{proveedor ? `${proveedor.nombre} (${proveedor.empresa})` : 'N/A'}</td>
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
    </>
  );
}

export default Inventario;