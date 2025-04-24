const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "systeminventorymaq"
});

// Conexión a la base de datos
db.connect((err) => {
    if (err) {
        console.error('Error conectando a la base de datos:', err);
        return;
    }
    console.log('Conectado a la base de datos MySQL');
});

// ------------------------- RUTAS PARA PROVEEDORES -------------------------
app.post("/create", (req, res) => {
    const { nombre, direccion, numero_telefonico, empresa } = req.body;

    db.query('INSERT INTO proveedores(nombre, direccion, numero_telefonico, empresa) VALUES(?, ?, ?, ?)',
        [nombre, direccion, numero_telefonico, empresa],
        (error, result) => {
            if (error) {
                console.log(error);
                res.status(500).send(error);
            } else {
                res.send(result);
            }
        }
    );
});

app.get("/proveedores", (req, res) => {
    db.query('SELECT * FROM proveedores',
        (error, result) => {
            if (error) {
                console.log(error);
                res.status(500).send(error);
            } else {
                res.send(result);
            }
        }
    );
});

app.put("/update", (req, res) => {
    const { id_proveedores, nombre, direccion, numero_telefonico, empresa } = req.body;

    db.query('UPDATE proveedores SET nombre=?, direccion=?, numero_telefonico=?, empresa=? WHERE id_proveedores=?',
        [nombre, direccion, numero_telefonico, empresa, id_proveedores],
        (error, result) => {
            if (error) {
                console.log(error);
                res.status(500).send(error);
            } else {
                res.send(result);
            }
        }
    );
});

app.delete("/delete/:id_proveedores", (req, res) => {
    const id_proveedores = req.params.id_proveedores;

    db.query('DELETE FROM proveedores WHERE id_proveedores=?', id_proveedores,
        (error, result) => {
            if (error) {
                console.log(error);
                res.status(500).send(error);
            } else {
                res.send(result);
            }
        }
    );
});

// ------------------------- RUTAS PARA INVENTARIO -------------------------
app.post("/inventario/create", (req, res) => {
    const {
        tipo_De_Equipo,
        Marca,
        Modelo,
        Precio,
        Fecha_De_Adquisicion,
        Condicion,
        Codigo,
        id_proveedores
    } = req.body;

    db.query(
        `INSERT INTO inventario 
         (tipo_De_Equipo, Marca, Modelo, Precio, Fecha_De_Adquisicion, Condicion, Codigo, id_proveedores)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [tipo_De_Equipo, Marca, Modelo, Precio, Fecha_De_Adquisicion, Condicion, Codigo, id_proveedores],
        (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send(err);
            } else {
                res.send(result);
            }
        }
    );
});

app.get("/inventario", (req, res) => {
    db.query(
        `SELECT i.*, p.nombre AS proveedor_nombre 
         FROM inventario i 
         LEFT JOIN proveedores p ON i.id_proveedores = p.id_proveedores`,
        (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send(err);
            } else {
                res.send(result);
            }
        }
    );
});

app.put("/inventario/update", (req, res) => {
    const {
        id_inventario,
        tipo_De_Equipo,
        Marca,
        Modelo,
        Precio,
        Fecha_De_Adquisicion,
        Condicion,
        Codigo,
        id_proveedores
    } = req.body;

    db.query(
        `UPDATE inventario 
         SET tipo_De_Equipo=?, Marca=?, Modelo=?, Precio=?, Fecha_De_Adquisicion=?, Condicion=?, Codigo=?, id_proveedores=?
         WHERE id_inventario=?`,
        [tipo_De_Equipo, Marca, Modelo, Precio, Fecha_De_Adquisicion, Condicion, Codigo, id_proveedores, id_inventario],
        (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send(err);
            } else {
                res.send(result);
            }
        }
    );
});

app.delete("/inventario/delete/:id", (req, res) => {
    const id = req.params.id;
    db.query("DELETE FROM inventario WHERE id_inventario = ?", id, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send(err);
        } else {
            res.send(result);
        }
    });
});

// ------------------------- RUTAS PARA TIPO DE PRENDA -------------------------
app.post("/tipoprenda/create", (req, res) => {
    const { tipo_prenda } = req.body;

    db.query('INSERT INTO tipo_prenda(tipo_prenda) VALUES(?)', [tipo_prenda],
        (error, result) => {
            if (error) {
                console.log(error);
                res.status(500).send(error);
            } else {
                res.send(result);
            }
        }
    );
});

app.get("/tipoprenda", (req, res) => {
    db.query('SELECT * FROM tipo_prenda',
        (error, result) => {
            if (error) {
                console.log(error);
                res.status(500).send(error);
            } else {
                res.send(result);
            }
        }
    );
});

app.put("/tipoprenda/update", (req, res) => {
    const { id_tipo_prenda, tipo_prenda } = req.body;

    db.query('UPDATE tipo_prenda SET tipo_prenda=? WHERE id_tipo_prenda=?', 
        [tipo_prenda, id_tipo_prenda],
        (error, result) => {
            if (error) {
                console.log(error);
                res.status(500).send(error);
            } else {
                res.send(result);
            }
        }
    );
});

app.delete("/tipoprenda/delete/:id", (req, res) => {
    const id = req.params.id;

    db.query('DELETE FROM tipo_prenda WHERE id_tipo_prenda=?', id,
        (error, result) => {
            if (error) {
                console.log(error);
                res.status(500).send(error);
            } else {
                res.send(result);
            }
        }
    );
});

// Iniciar servidor
app.listen(3001, () => {
    console.log("Servidor corriendo en el puerto 3001");
});