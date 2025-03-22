import './App.css';
import { useState, useEffect } from "react";
import Axios from "axios"; 

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
    <div className="App">
      <div className="datos">
        <label>Nombre: 
          <input 
            onChange={(event) => setNombre(event.target.value)}
            type="text"
          />
        </label>
        <label>Dirección: 
          <input 
            onChange={(event) => setDireccion(event.target.value)}
            type="text"
          />
        </label>
        <label>Número Telefónico: 
          <input
            onChange={(event) => setNumero_telefonico(event.target.value)}
            type="number"
          />
        </label>
        <label>Empresa: 
          <input 
            onChange={(event) => setEmpresa(event.target.value)}
            type="text"
          />
        </label>
        <button onClick={add}>Registrar</button>
      </div>

      <div className="lista">
        {proveedoresList.map((val, key) => (
          <div key={key}>{val.nombre}</div>
        ))}
      </div>
    </div>
  );
}

export default App;