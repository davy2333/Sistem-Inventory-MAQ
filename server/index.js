const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configuración de conexión a MySQL
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "systeminventorymaq",
    port: 3307
});

// Conexión
db.connect((err) => {
    if (err) {
        console.error('Error conectando a la base de datos:', err);
        return;
    }
    console.log('Conectado a la base de datos MySQL');
});


// ------------------------- CRUD PROVEEDORES -------------------------
app.post("/create", (req, res) => {
    const { nombre, direccion, numero_telefonico, empresa } = req.body;
    db.query('INSERT INTO proveedores(nombre, direccion, numero_telefonico, empresa) VALUES(?, ?, ?, ?)',
        [nombre, direccion, numero_telefonico, empresa],
        (error, result) => error ? res.status(500).send(error) : res.send(result));
});

app.get("/proveedores", (req, res) => {
    db.query('SELECT * FROM proveedores', (error, result) =>
        error ? res.status(500).send(error) : res.send(result));
});

app.put("/update", (req, res) => {
    const { id_proveedores, nombre, direccion, numero_telefonico, empresa } = req.body;
    db.query('UPDATE proveedores SET nombre=?, direccion=?, numero_telefonico=?, empresa=? WHERE id_proveedores=?',
        [nombre, direccion, numero_telefonico, empresa, id_proveedores],
        (error, result) => error ? res.status(500).send(error) : res.send(result));
});

app.delete("/delete/:id_proveedores", (req, res) => {
    const id_proveedores = req.params.id_proveedores;
    db.query('DELETE FROM proveedores WHERE id_proveedores=?', id_proveedores,
        (error, result) => error ? res.status(500).send(error) : res.send(result));
});


// ------------------------- CRUD TIPO PRENDA -------------------------
app.post("/tipoprenda/create", (req, res) => {
    const { tipo_prenda } = req.body;
    db.query('INSERT INTO tipo_prenda(tipo_prenda) VALUES(?)', [tipo_prenda],
        (error, result) => error ? res.status(500).send(error) : res.send(result));
});

app.get("/tipoprenda", (req, res) => {
    db.query('SELECT * FROM tipo_prenda', (error, result) =>
        error ? res.status(500).send(error) : res.send(result));
});

app.put("/tipoprenda/update", (req, res) => {
    const { id_tipo_prenda, tipo_prenda } = req.body;
    db.query('UPDATE tipo_prenda SET tipo_prenda=? WHERE id_tipo_prenda=?',
        [tipo_prenda, id_tipo_prenda],
        (error, result) => error ? res.status(500).send(error) : res.send(result));
});

app.delete("/tipoprenda/delete/:id", (req, res) => {
    const id = req.params.id;
    db.query('DELETE FROM tipo_prenda WHERE id_tipo_prenda=?', id,
        (error, result) => error ? res.status(500).send(error) : res.send(result));
});


// ------------------------- CRUD PEDIDOS -------------------------
app.get("/pedidos", (req, res) => {
    const query = `
      SELECT 
        p.*, 
        c.Cliente AS nombre_cliente,
        t.tipo_prenda AS nombre_prenda
      FROM pedidos p
      LEFT JOIN cliente c ON p.id_cliente = c.id_cliente
      LEFT JOIN tipo_prenda t ON p.id_tipo_prenda = t.id_tipo_prenda
    `;
  
    db.query(query, (err, result) => {
      if (err) res.status(500).send(err);
      else res.send(result);
    });
  });
  

app.post("/pedidos/create", (req, res) => {
    const { Talla, cantidad_confeccionada, fecha_de_confeccion, Fecha_estimada_de_entrega, costo_por_unidad, Foto, Estado, id_tipo_prenda, id_cliente } = req.body;
    db.query(`INSERT INTO pedidos 
        (Talla, cantidad_confeccionada, fecha_de_confeccion, Fecha_estimada_de_entrega, costo_por_unidad, Foto, Estado, id_tipo_prenda, id_cliente)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [Talla, cantidad_confeccionada, fecha_de_confeccion, Fecha_estimada_de_entrega, costo_por_unidad, Foto, Estado, id_tipo_prenda, id_cliente],
        (err, result) => err ? res.status(500).send(err) : res.send(result));
});

app.put("/pedidos/update", (req, res) => {
    const { id_pedidos, Talla, cantidad_confeccionada, fecha_de_confeccion, Fecha_estimada_de_entrega, costo_por_unidad, Foto, Estado, id_tipo_prenda, id_cliente } = req.body;
    db.query(`UPDATE pedidos SET 
        Talla=?, cantidad_confeccionada=?, fecha_de_confeccion=?, Fecha_estimada_de_entrega=?, 
        costo_por_unidad=?, Foto=?, Estado=?, id_tipo_prenda=?, id_cliente=?
        WHERE id_pedidos=?`,
        [Talla, cantidad_confeccionada, fecha_de_confeccion, Fecha_estimada_de_entrega, costo_por_unidad, Foto, Estado, id_tipo_prenda, id_cliente, id_pedidos],
        (err, result) => err ? res.status(500).send(err) : res.send(result));
});

app.delete("/pedidos/delete/:id_pedidos", (req, res) => {
    const id = req.params.id_pedidos;
    db.query('DELETE FROM pedidos WHERE id_pedidos=?', [id],
        (err, result) => err ? res.status(500).send(err) : res.send(result));
});


// ------------------------- CLIENTES (solo GET) -------------------------
app.get("/clientes", (req, res) => {
    db.query('SELECT * FROM cliente', (err, result) =>
        err ? res.status(500).send(err) : res.send(result));
});


// ------------------------- SUBIR IMÁGENES -------------------------
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});
const upload = multer({ storage: storage });

app.post("/upload", upload.single('file'), (req, res) => {
    res.json({ filename: req.file.filename });
});


// ------------------------- CRUD CLIENTES -------------------------
app.post("/clientes/create", (req, res) => {
    const { Cliente, numero_telefonico, Email } = req.body;
    db.query('INSERT INTO cliente(Cliente, numero_telefonico, Email) VALUES(?, ?, ?)',
        [Cliente, numero_telefonico, Email],
        (error, result) => error ? res.status(500).send(error) : res.send(result));
});

app.get("/clientes", (req, res) => {
    db.query('SELECT * FROM cliente', (error, result) =>
        error ? res.status(500).send(error) : res.send(result));
});

app.put("/clientes/update", (req, res) => {
    const { id_cliente, Cliente, numero_telefonico, Email } = req.body;
    db.query('UPDATE cliente SET Cliente=?, numero_telefonico=?, Email=? WHERE id_cliente=?',
        [Cliente, numero_telefonico, Email, id_cliente],
        (error, result) => error ? res.status(500).send(error) : res.send(result));
});

app.delete("/clientes/delete/:id", (req, res) => {
    const id = req.params.id;
    db.query('DELETE FROM cliente WHERE id_cliente=?', id,
        (error, result) => error ? res.status(500).send(error) : res.send(result));
});

// ----------------- Rutas para Inventario ------------------
app.get('/inventario', (req, res) => {
    db.query('SELECT * FROM inventario', (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send(err);
      } else {
        res.send(result);
      }
    });
  });
  
  app.post('/create-inventario', (req, res) => {
    const { tipoDeEquipo, marca, modelo, precio, fechaDeAdquisicion, condicion, codigo, idProveedor } = req.body;
    db.query(
      'INSERT INTO inventario (tipo_De_Equipo, Marca, Modelo, Precio, Fecha_De_Adquisicion, Condicion, Codigo, id_proveedores) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [tipoDeEquipo, marca, modelo, precio, fechaDeAdquisicion, condicion, codigo, idProveedor],
      (err, result) => {
        if (err) {
          console.error(err);
          res.status(500).send(err);
        } else {
          res.send(result);
        }
      }
    );
  });
  
  app.put('/update-inventario', (req, res) => {
    const { idInventario, tipoDeEquipo, marca, modelo, precio, fechaDeAdquisicion, condicion, codigo, idProveedor } = req.body;
    db.query(
      'UPDATE inventario SET tipo_De_Equipo = ?, Marca = ?, Modelo = ?, Precio = ?, Fecha_De_Adquisicion = ?, Condicion = ?, Codigo = ?, id_proveedores = ? WHERE id_inventario = ?',
      [tipoDeEquipo, marca, modelo, precio, fechaDeAdquisicion, condicion, codigo, idProveedor, idInventario],
      (err, result) => {
        if (err) {
          console.error(err);
          res.status(500).send(err);
        } else {
          res.send(result);
        }
      }
    );
  });
  
  app.delete('/delete-inventario/:id', (req, res) => {
    const id = req.params.id;
    db.query('DELETE FROM inventario WHERE id_inventario = ?', id, (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send(err);
      } else {
        res.send(result);
      }
    });
  });


// ------------------------- INICIAR SERVIDOR -------------------------
app.listen(3001, () => {
    console.log("Servidor corriendo en el puerto 3001");
});

