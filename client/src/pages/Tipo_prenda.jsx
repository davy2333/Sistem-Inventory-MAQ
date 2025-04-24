import '../App.css';
import { useState, useEffect } from "react";
import Axios from "axios"; 
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Swal from 'sweetalert2';
import Navbar from '../components/NavBar';

function TipoPrenda() {
  const [tipoPrenda, setTipoPrenda] = useState("");
  const [idTipoPrenda, setIdTipoPrenda] = useState();
  const [editar, setEditar] = useState(false);
  const [tiposPrendaList, setTiposPrenda] = useState([]);
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

  const getTiposPrenda = () => {
    Axios.get("http://localhost:3001/tipoprenda")
      .then((response) => {
        setTiposPrenda(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener tipos de prenda:", error);
      });
  };

  useEffect(() => {
    getTiposPrenda();
  }, []);

  const add = () => {
    Axios.post("http://localhost:3001/tipoprenda/create", {
      tipo_prenda: tipoPrenda
    })
      .then(() => {
        getTiposPrenda();
        LimpiarCampos();
        Swal.fire({
          title: "<strong>Registro exitoso!!</strong>",
          html: `<i>El tipo de prenda <strong>${tipoPrenda}</strong> fue registrado con éxito!!</i>`,
          icon: 'success',
          timer: 3000
        })
      }).catch(function(error){
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: JSON.parse(JSON.stringify(error)).message==="Network Error"?"Intente más tarde":JSON.parse(JSON.stringify(error)).message
        })
      });
  }

  const update = () => {
    Axios.put("http://localhost:3001/tipoprenda/update", {
      id_tipo_prenda: idTipoPrenda,
      tipo_prenda: tipoPrenda
    })
      .then(() => {
        getTiposPrenda();
        LimpiarCampos();
        Swal.fire({
          title: "<strong>Actualización exitosa!!</strong>",
          html: `<i>El tipo de prenda <strong>${tipoPrenda}</strong> fue actualizado con éxito!!</i>`,
          icon: 'success',
          timer: 3000
        })
      }).catch(function(error){
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: JSON.parse(JSON.stringify(error)).message==="Network Error"?"Intente más tarde":JSON.parse(JSON.stringify(error)).message
        })
      });
  }

  const deleteTipoPrenda = (val) => {
    Swal.fire({
      title: "¿Confirmar?",
      html: `<i>¿Realmente desea eliminar el tipo de prenda <strong>${val.tipo_prenda}</strong>?</i>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminarlo!"
    }).then((result) => {
      if (result.isConfirmed) {
        Axios.delete(`http://localhost:3001/tipoprenda/delete/${val.id_tipo_prenda}`).then(() => {
          getTiposPrenda();
          LimpiarCampos();
          Swal.fire({
            title: "¡Eliminado!",
            text: val.tipo_prenda + " fue eliminado",
            icon: "success",
            timer: 850
          });
        }).catch(function(error){
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "No se logró eliminar el tipo de prenda",
            footer: JSON.parse(JSON.stringify(error)).message==="Network Error"?"Intente más tarde":JSON.parse(JSON.stringify(error)).message
          })
        });
      }
    });
  }

  const LimpiarCampos = () => {
    setTipoPrenda("");
    setEditar(false);
  }     

  const editarTipoPrenda = (val) => {
    setEditar(true);
    setTipoPrenda(val.tipo_prenda);
    setIdTipoPrenda(val.id_tipo_prenda);
  }

  return (
    <>
      <Navbar />
      <div className={`container px-md-4 content ${sidebarOpen ? 'sidebar-expanded' : ''}`}>
        <div className="row justify-content-center">
          <div className="col-12 col-md-10">
            <div className="card text-center my-4">
              <div className="card-header bg-primary text-white">
                <h1 className="h5 mb-0">TIPOS DE PRENDA</h1>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-12 mb-3">
                    <div className="input-group">
                      <span className="input-group-text">Tipo de prenda:</span>
                      <input 
                        type="text" 
                        onChange={(event) => setTipoPrenda(event.target.value)}
                        className="form-control" 
                        value={tipoPrenda} 
                        placeholder="Ingrese el tipo de prenda" 
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
                    <th scope="col">ID</th>
                    <th scope="col">Tipo de Prenda</th>
                    <th scope="col">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {tiposPrendaList.map((val) => (
                    <tr key={val.id_tipo_prenda}>
                      <td>{val.id_tipo_prenda}</td>
                      <td>{val.tipo_prenda}</td>
                      <td>
                        <div className="btn-group" role="group">
                          <button 
                            type="button" 
                            onClick={() => editarTipoPrenda(val)}
                            className="btn btn-info btn-sm text-white"
                          >
                            Editar
                          </button>
                          <button 
                            type="button" 
                            onClick={() => deleteTipoPrenda(val)}  
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

export default TipoPrenda;