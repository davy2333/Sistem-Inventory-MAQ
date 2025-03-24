import './App.css';
import { useState, useEffect } from "react";
import Axios from "axios"; 
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [nombre, setNombre] = useState("");
  const [direccion, setDireccion] = useState("");
  const [numero_telefonico, setNumero_telefonico] = useState(0);
  const [empresa, setEmpresa] = useState("");
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
        alert("Proveedor registrado");
      })
      .catch((error) => {
        console.error("Error al registrar el proveedor:", error);
      });
  };

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
            className="form-control" placeholder="Ingrese el nombre" aria-label="Username" aria-describedby="basic-addon1"/>
            
            </div>

            <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">Direccion:</span>
            <input type="text" 
             onChange={(event) => {
              setDireccion(event.target.value);
            }}
            className="form-control" placeholder="Ingrese la direccion" aria-label="Username" aria-describedby="basic-addon1"/>
            
            </div>

            <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">Numero de telefono:</span>
            <input type="number" 
            onChange={(event) =>{ 
              setNumero_telefonico(Number(event.target.value));
            }}
            className="form-control" placeholder="Ingrese su telefono" aria-label="Username" aria-describedby="basic-addon1"/>
            
            </div>
        
            <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">Empresa:</span>
            <input type="text" 
              onChange={(event) =>{ 
                setEmpresa(event.target.value);
              }}
            className="form-control" placeholder="Ingrese el nombre de la empresa" aria-label="Username" aria-describedby="basic-addon1"/>
            
            </div>
      </div>
      <div className="card-footer text-body-secondary">
      <button className='btn btn-success' onClick={add}>Registrar</button>

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
                </tr>

          })
        }
  </tbody>
    </table>

  </div>
  
  );
  
}

export default App;