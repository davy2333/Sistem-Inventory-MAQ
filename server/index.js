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

app.get("/proveedores", (req, res)=>{
    db.query('SELECT  *  FROM proveedores',
        (error,result)=>{
            if(error){
                console.log(err);
            }else{
                res.send(result);
            }
        }
    );
});

app.put("/update", (req, res)=>{
    const id_proveedores = req.body.id_proveedores;
    const nombre = req.body.nombre;
    const direccion = req.body.direccion;
    const numero_telefonico= req.body.numero_telefonico;
    const empresa = req.body.empresa;
   

    db.query('UPDATE proveedores SET nombre=?,direccion=?,numero_telefonico=?,empresa=? WHERE id_proveedores=?' ,[nombre,direccion,numero_telefonico,empresa,id_proveedores],
        (error,result)=>{
            if(error){
                console.log(err);
            }else{
                res.send("proveedor actualizado con exito!!");
            }
        }
    );
});

app.listen(3001,()=>{
    console.log("Corriendo en el puerto 3001")
})
