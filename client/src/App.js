import './App.css';
import { useState, useEffect } from "react";
import Axios from "axios"; 
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [nombre, setNombre] = useState("");
  const [direccion, setDireccion] = useState("");
  const [numero_telefonico, setNumero_telefonico] = useState();
  const [empresa, setEmpresa] = useState("");
  const [id_proveedores, setId] = useState();

  const [editar, setEditar] = useState(false);
  
  const [proveedoresList, setProveedores] = useState([]);

  // Definir la función antes de usarla
  const getProveedores = () => {
    Axios.get("http://localhost:3001/proveedores")
      .then((response) => {
        setProveedores(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener proveedores:", error);
      });
  };

    // Llamar a getProveedores() cuando el componente se monta
    useEffect(() => {
      getProveedores();
    }, []);

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
      })
      .catch((error) => {
        console.error("Error al registrar el proveedor:", error);
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
      });
  }

  const LimpiarCampos = ()=>{
    setNombre("");
    setDireccion("");
    setNumero_telefonico("");
    setEmpresa("");
  }

      const editarProveedor = (val) =>{
        setEditar(true);

        setNombre(val.nombre);
        setDireccion(val.direccion);
        setNumero_telefonico(val.Numero_telefonico);
        setEmpresa(val.empresa);
        setId(val.id_proveedores);

      }

  return (
    <div className="container">
    
    <div className="card text-center">
      <div className="card-header">
        Inventariado
      </div>
      <div className="card-body">
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">Nombre:</span>
            <input type="text" 
            onChange={(event) => {
              setNombre(event.target.value);
            }}
            className="form-control" value={nombre} placeholder="Ingrese el nombre" aria-label="Username" aria-describedby="basic-addon1"/>
            
            </div>

            <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">Direccion:</span>
            <input type="text" 
             onChange={(event) => {
              setDireccion(event.target.value);
            }}
            className="form-control" value={direccion} placeholder="Ingrese la direccion" aria-label="Username" aria-describedby="basic-addon1"/>
            
            </div>

            <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">Numero de telefono:</span>
            <input type="number" value={numero_telefonico}
            onChange={(event) =>{ 
              setNumero_telefonico(event.target.value);
            }}
            className="form-control"  placeholder="Ingrese su telefono" aria-label="Username" aria-describedby="basic-addon1"/>
            
            </div>
        
            <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">Empresa:</span>
            <input type="text" 
              onChange={(event) =>{ 
                setEmpresa(event.target.value);
              }}
            className="form-control" value={empresa} placeholder="Ingrese el nombre de la empresa" aria-label="Username" aria-describedby="basic-addon1"/>
            
            </div>
      </div>
      <div className="card-footer text-muted">
        {
          editar?
          <div>
          <button className='btn btn-warning m-2' onClick={update}>Actualizar</button> 
          <button className='btn btn-info m-2' onClick={add}>Cancelar</button>
          </div>
          :<button className='btn btn-success' onClick={add}>Registrar</button>
          

        }

      </div>
      
    </div>
    
    <table className="table table-striped">
    <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">Nombre</th>
      <th scope="col">Direccion</th>
      <th scope="col">Telefono</th>
      <th scope="col">Empresa</th>
      <th scope="col">Acciones</th>
    </tr>
  </thead>
  <tbody>

  {
        proveedoresList.map((val, key) => {
          return <tr key={val.id_proveedores}>
                  <th>{val.id_proveedores}</th>
                  <td>{val.nombre}</td>
                  <td>{val.direccion}</td>
                  <td>{val.Numero_telefonico}</td>
                  <td>{val.empresa}</td>
                  <td>
                  <div className="btn-group" role="group" aria-label="Basic example">
                  <button type="button" 
                  
                  onClick={()=>{
                    editarProveedor(val);
                  }}

                  className="btn btn-info">Editar</button>
                  <button type="button" className="btn btn-danger">Eliminar</button>
                  </div>
                  </td>
                </tr>

          })
        }
  </tbody>
    </table>

  </div>
  
  );
  
}

export default App;