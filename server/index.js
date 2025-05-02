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


// ------------------------- CRUD PEDIDOS CON IMAGENES -------------------------
app.post("/pedidos/create", upload.single('foto'), (req, res) => {
    const {
        Talla,
        cantidad_confeccionada,
        fecha_de_confeccion,
        Fecha_estimada_de_entrega,
        costo_por_unidad,
        Estado,
        id_tipo_prenda,
        id_cliente
    } = req.body;

    const foto = req.file ? req.file.filename : null;

    db.query(
        `INSERT INTO pedidos 
         (Talla, cantidad_confeccionada, fecha_de_confeccion, Fecha_estimada_de_entrega, 
          costo_por_unidad, Estado, id_tipo_prenda, id_cliente, Foto)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [Talla, cantidad_confeccionada, fecha_de_confeccion, Fecha_estimada_de_entrega, 
         costo_por_unidad, Estado, id_tipo_prenda, id_cliente, foto],
        (error, result) => {
            if (error) {
                console.log(error);
                // Si hay error, elimina la imagen subida
                if (req.file) {
                    fs.unlinkSync(req.file.path);
                }
                res.status(500).send(error);
            } else {
                res.send(result);
            }
        }
    );
});

app.get("/pedidos", (req, res) => {
    db.query(
        `SELECT p.*, tp.tipo_prenda, c.Cliente 
         FROM pedidos p
         LEFT JOIN tipo_prenda tp ON p.id_tipo_prenda = tp.id_tipo_prenda
         LEFT JOIN cliente c ON p.id_cliente = c.id_cliente`,
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

app.put("/pedidos/update", upload.single('foto'), (req, res) => {
    const {
        id_pedidos,
        Talla,
        cantidad_confeccionada,
        fecha_de_confeccion,
        Fecha_estimada_de_entrega,
        costo_por_unidad,
        Estado,
        id_tipo_prenda,
        id_cliente,
        foto_existente
    } = req.body;

    const foto = req.file ? req.file.filename : foto_existente;

    // Primero obtenemos la foto anterior para eliminarla si se sube una nueva
    db.query("SELECT Foto FROM pedidos WHERE id_pedidos = ?", [id_pedidos], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).send(err);
        }

        const oldFoto = result[0]?.Foto;
        
        db.query(
            `UPDATE pedidos 
             SET Talla=?, cantidad_confeccionada=?, fecha_de_confeccion=?, Fecha_estimada_de_entrega=?, 
                 costo_por_unidad=?, Estado=?, id_tipo_prenda=?, id_cliente=?, Foto=?
             WHERE id_pedidos=?`,
            [Talla, cantidad_confeccionada, fecha_de_confeccion, Fecha_estimada_de_entrega, 
             costo_por_unidad, Estado, id_tipo_prenda, id_cliente, foto, id_pedidos],
            (error, result) => {
                if (error) {
                    console.log(error);
                    if (req.file) {
                        fs.unlinkSync(req.file.path);
                    }
                    res.status(500).send(error);
                } else {
                    // Eliminar la imagen anterior si se subió una nueva
                    if (req.file && oldFoto) {
                        try {
                            fs.unlinkSync(path.join(__dirname, 'uploads', oldFoto));
                        } catch (err) {
                            console.error("Error al eliminar la imagen anterior:", err);
                        }
                    }
                    res.send(result);
                }
            }
        );
    });
});

app.delete("/pedidos/delete/:id", (req, res) => {
    const id = req.params.id;
    
    // Primero obtenemos la foto para eliminarla del sistema de archivos
    db.query("SELECT Foto FROM pedidos WHERE id_pedidos = ?", [id], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).send(err);
        }

        const foto = result[0]?.Foto;
        
        db.query("DELETE FROM pedidos WHERE id_pedidos = ?", [id], (error, result) => {
            if (error) {
                console.log(error);
                res.status(500).send(error);
            } else {
                // Eliminar la imagen asociada si existe
                if (foto) {
                    try {
                        fs.unlinkSync(path.join(__dirname, 'uploads', foto));
                    } catch (err) {
                        console.error("Error al eliminar la imagen:", err);
                    }
                }
                res.send(result);
            }
        });
    });
});


// ------------------------- RUTAS PARA CLIENTES -------------------------
app.get("/clientes", (req, res) => {
    db.query('SELECT * FROM cliente',
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


// ------------------------- CRUD MANTENIMIENTO -------------------------
app.post("/mantenimiento/create", (req, res) => {
    const { id_inventario, detalle_problema, tecnico_encargado, estado_de_reparacion, Fecha, Costo } = req.body;
    
    db.query(`INSERT INTO mantenimiento 
        (id_inventario, detalle_problema, tecnico_encargado, estado_de_reparacion, Fecha, Costo)
        VALUES (?, ?, ?, ?, ?, ?)`,
        [id_inventario, detalle_problema, tecnico_encargado, estado_de_reparacion, Fecha, Costo],
        (err, result) => err ? res.status(500).send(err) : res.send(result));
});

app.get("/mantenimiento", (req, res) => {
    const query = `
      SELECT m.*, i.tipo_De_Equipo, i.Marca, i.Modelo 
      FROM mantenimiento m
      LEFT JOIN inventario i ON m.id_inventario = i.id_inventario
    `;
    
    db.query(query, (err, result) => {
      if (err) res.status(500).send(err);
      else res.send(result);
    });
});

app.put("/mantenimiento/update", (req, res) => {
    const { id_mantenimiento, id_inventario, detalle_problema, tecnico_encargado, estado_de_reparacion, Fecha, Costo } = req.body;
    
    db.query(`UPDATE mantenimiento SET 
        id_inventario=?, detalle_problema=?, tecnico_encargado=?, estado_de_reparacion=?, Fecha=?, Costo=?
        WHERE id_mantenimiento=?`,
        [id_inventario, detalle_problema, tecnico_encargado, estado_de_reparacion, Fecha, Costo, id_mantenimiento],
        (err, result) => err ? res.status(500).send(err) : res.send(result));
});

app.delete("/mantenimiento/delete/:id", (req, res) => {
    const id = req.params.id;
    db.query('DELETE FROM mantenimiento WHERE id_mantenimiento=?', id,
        (err, result) => err ? res.status(500).send(err) : res.send(result));
});


// ------------------------- CRUD BAJAS -------------------------
app.post("/bajas/create", (req, res) => {
    const { id_inventario, motivo, fecha, persona_encargada } = req.body;
    
    db.query(`INSERT INTO bajas 
        (id_inventario, motivo, fecha, persona_encargada)
        VALUES (?, ?, ?, ?)`,
        [id_inventario, motivo, fecha, persona_encargada],
        (err, result) => err ? res.status(500).send(err) : res.send(result));
});

app.get("/bajas", (req, res) => {
    const query = `
      SELECT b.*, i.tipo_De_Equipo, i.Marca, i.Modelo 
      FROM bajas b
      LEFT JOIN inventario i ON b.id_inventario = i.id_inventario
    `;
    
    db.query(query, (err, result) => {
      if (err) res.status(500).send(err);
      else res.send(result);
    });
});

app.put("/bajas/update", (req, res) => {
    const { id_bajas, id_inventario, motivo, fecha, persona_encargada } = req.body;
    
    db.query(`UPDATE bajas SET 
        id_inventario=?, motivo=?, fecha=?, persona_encargada=?
        WHERE id_bajas=?`,
        [id_inventario, motivo, fecha, persona_encargada, id_bajas],
        (err, result) => err ? res.status(500).send(err) : res.send(result));
});

app.delete("/bajas/delete/:id", (req, res) => {
    const id = req.params.id;
    db.query('DELETE FROM bajas WHERE id_bajas=?', id,
        (err, result) => err ? res.status(500).send(err) : res.send(result));
});




// ------------------------- INICIAR SERVIDOR -------------------------
app.listen(3001, () => {
    console.log("Servidor corriendo en el puerto 3001");
});