const express = require ("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"systeminventorymaq"
})

app.post("/create", (req, res)=>{
    const nombre = req.body.nombre;
    const direccion = req.body.direccion;
    const numero_telefonico= req.body.numero_telefonico;
    const empresa = req.body.empresa;
   

    db.query('INSERT INTO proveedores(nombre,direccion,numero_telefonico,empresa) VALUES(?,?,?,?)',[nombre,direccion,numero_telefonico,empresa],
        (error,result)=>{
            if(error){
                console.log(err);
            }else{
                res.send("proveedor registrado con exito!!");
            }
        }
    );
});

app.listen(3001,()=>{
    console.log("Corriendo en el puerto 3001")
})