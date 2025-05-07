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
  const [busqueda, setBusqueda] = useState("");

  // Estilos para el fondo gradiente y contenido (igual que Home)
  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 50%, #80deea 100%)',
    padding: '20px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  };

  const contentStyle = {
    maxWidth: '100%',
    width: '100%',
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '16px',
    padding: '40px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    backdropFilter: 'blur(4px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    margin: '20px',
  };

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

  const inventarioFiltrado = inventarioList.filter(item => {
    const proveedor = proveedoresList.find(p => p.id_proveedores === item.id_proveedores);
    const proveedorInfo = proveedor ? `${proveedor.nombre} ${proveedor.empresa}` : '';
    
    return (
      item.tipo_De_Equipo.toLowerCase().includes(busqueda.toLowerCase()) ||
      item.Marca.toLowerCase().includes(busqueda.toLowerCase()) ||
      item.Modelo.toLowerCase().includes(busqueda.toLowerCase()) ||
      (item.Precio && item.Precio.toString().includes(busqueda)) ||
      (item.Condicion && item.Condicion.toLowerCase().includes(busqueda.toLowerCase())) ||
      (item.Codigo && item.Codigo.toLowerCase().includes(busqueda.toLowerCase())) ||
      (proveedorInfo.toLowerCase().includes(busqueda.toLowerCase()))
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
    <div style={containerStyle}>
      <Navbar />
      <div style={contentStyle} className={`container px-md-4 content ${sidebarOpen ? 'sidebar-expanded' : ''}`}>
        {/* Barra de búsqueda idéntica a Proveedores */}
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
                    placeholder="Buscar equipos por tipo, marca, modelo, precio, condición, código o proveedor..."
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
                <h1 className="h5 mb-0">INVENTARIO DE EQUIPOS</h1>
              </div>
              <div className="card-body">
                <div className="row">
                  {/* Resto del formulario permanece igual */}
                  {/* ... */}
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
                  {inventarioFiltrado.map((val) => {
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
    </div>
  );
}

export default Inventario;