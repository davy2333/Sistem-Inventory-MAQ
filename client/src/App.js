import './App.css';
import{ useState } from "react";
import Axios from "axios"; 


function App() {

  const [nombre,setNombre] = useState("");
  const [direccion,setDireccion] = useState("");
  const [numero_telefonico,setNumero_telefonico] = useState(0);
  const [empresa,setEmpresa] = useState("");
  
  
  const add = ()=> {
    Axios.post("http://localhost:3001/create",{
      nombre:nombre,
      direccion:direccion,
      numero_telefonico:numero_telefonico,
      empresa:empresa
    }).then(()=>{
      alert("Proveedor registrado");
    });
  }

  return (
    <div className="App">
      <div className="datos">
        <label>nombre: <input 
        onChange={(event)=>{
          setNombre(event.target.value);
        }}
        type="text"/></label>
        <label>direccion: <input 
        onChange={(event)=>{
          setDireccion(event.target.value);
        }}
        type="text"/></label>
        <label>numero telefonico: <input
        onChange={(event)=>{
          setNumero_telefonico(event.target.value);
        }}
         type="number"/></label>
        <label>empresa: <input 
        onChange={(event)=>{
          setEmpresa(event.target.value);
        }}
        type="text"/></label>
        <button onClick={add}>registrar</button>
      </div>
    </div>
  );
}

export default App;
