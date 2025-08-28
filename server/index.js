const express = require("express");
const app = express();
const { Pool } = require("pg"); // ← Cambiado de mysql a pg
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { exec } = require("child_process");
require('dotenv').config(); // ← Añadido para variables de entorno

// middlewares
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configuración de conexión a PostgreSQL ← TOTALMENTE CAMBIADO
const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'systeminventorymaq',
    password: process.env.DB_PASSWORD || '',
    port: process.env.DB_PORT || 5432,
});

// Verificar conexión
pool.connect((err, client, release) => {
    if (err) {
        console.error('Error conectando a la base de datos PostgreSQL:', err);
        return;
    }
    console.log('Conectado a la base de datos PostgreSQL');
    release();
});

// Ruta para generar backup de la base de datos (DESACTIVADA temporalmente)
app.get('/backup', (req, res) => {
    res.json({ 
        success: false, 
        message: 'Función de backup desactivada durante migración a PostgreSQL' 
    });
});

// Ruta para reiniciar el servidor
app.post('/restart', (req, res) => {
    res.json({ success: true, message: 'El servidor se reiniciará en breve.' });
    setTimeout(() => {
        console.log('✋ Servidor deteniéndose para reinicio...');
        process.exit(0);
    }, 500);
});

// ------------------------- CRUD PROVEEDORES -------------------------
app.post("/create", async (req, res) => {
    const { nombre, direccion, numero_telefonico, empresa } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO proveedores(nombre, direccion, numero_telefonico, empresa) VALUES($1, $2, $3, $4) RETURNING *',
            [nombre, direccion, numero_telefonico, empresa]
        );
        res.send(result.rows[0]);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.get("/proveedores", async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM proveedores');
        res.send(result.rows);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.put("/update", async (req, res) => {
    const { id_proveedores, nombre, direccion, numero_telefonico, empresa } = req.body;
    try {
        const result = await pool.query(
            'UPDATE proveedores SET nombre=$1, direccion=$2, numero_telefonico=$3, empresa=$4 WHERE id_proveedores=$5 RETURNING *',
            [nombre, direccion, numero_telefonico, empresa, id_proveedores]
        );
        res.send(result.rows[0]);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.delete("/delete/:id_proveedores", async (req, res) => {
    const id_proveedores = req.params.id_proveedores;
    try {
        const result = await pool.query(
            'DELETE FROM proveedores WHERE id_proveedores=$1 RETURNING *',
            [id_proveedores]
        );
        res.send(result.rows[0]);
    } catch (error) {
        res.status(500).send(error);
    }
});

// ------------------------- CRUD TIPO PRENDA -------------------------
app.post("/tipoprenda/create", async (req, res) => {
    const { tipo_prenda } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO tipo_prenda(tipo_prenda) VALUES($1) RETURNING *',
            [tipo_prenda]
        );
        res.send(result.rows[0]);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.get("/tipoprenda", async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM tipo_prenda');
        res.send(result.rows);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.put("/tipoprenda/update", async (req, res) => {
    const { id_tipo_prenda, tipo_prenda } = req.body;
    try {
        const result = await pool.query(
            'UPDATE tipo_prenda SET tipo_prenda=$1 WHERE id_tipo_prenda=$2 RETURNING *',
            [tipo_prenda, id_tipo_prenda]
        );
        res.send(result.rows[0]);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.delete("/tipoprenda/delete/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const result = await pool.query(
            'DELETE FROM tipo_prenda WHERE id_tipo_prenda=$1 RETURNING *',
            [id]
        );
        res.send(result.rows[0]);
    } catch (error) {
        res.status(500).send(error);
    }
});

// ------------------------- CRUD PEDIDOS --------------------------
app.get("/pedidos", async (req, res) => {
    const query = `
      SELECT 
        p.*, 
        c.Cliente AS nombre_cliente,
        t.tipo_prenda AS nombre_prenda
      FROM pedidos p
      LEFT JOIN cliente c ON p.id_cliente = c.id_cliente
      LEFT JOIN tipo_prenda t ON p.id_tipo_prenda = t.id_tipo_prenda
    `;
    try {
        const result = await pool.query(query);
        res.send(result.rows);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.post("/pedidos/create", async (req, res) => {
    const { Talla, cantidad_confeccionada, fecha_de_confeccion, Fecha_estimada_de_entrega, costo_por_unidad, Foto, Estado, id_tipo_prenda, id_cliente } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO pedidos 
                (Talla, cantidad_confeccionada, fecha_de_confeccion, Fecha_estimada_de_entrega, costo_por_unidad, Foto, Estado, id_tipo_prenda, id_cliente)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
            [Talla, cantidad_confeccionada, fecha_de_confeccion, Fecha_estimada_de_entrega, costo_por_unidad, Foto, Estado, id_tipo_prenda, id_cliente]
        );
        res.send(result.rows[0]);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.put("/pedidos/update", async (req, res) => {
    const { id_pedidos, Talla, cantidad_confeccionada, fecha_de_confeccion, Fecha_estimada_de_entrega, costo_por_unidad, Foto, Estado, id_tipo_prenda, id_cliente } = req.body;
    try {
        const result = await pool.query(
            `UPDATE pedidos SET 
                Talla=$1, cantidad_confeccionada=$2, fecha_de_confeccion=$3, Fecha_estimada_de_entrega=$4, 
                costo_por_unidad=$5, Foto=$6, Estado=$7, id_tipo_prenda=$8, id_cliente=$9
                WHERE id_pedidos=$10 RETURNING *`,
            [Talla, cantidad_confeccionada, fecha_de_confeccion, Fecha_estimada_de_entrega, costo_por_unidad, Foto, Estado, id_tipo_prenda, id_cliente, id_pedidos]
        );
        res.send(result.rows[0]);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.delete("/pedidos/delete/:id_pedidos", async (req, res) => {
    const id = req.params.id_pedidos;
    try {
        const result = await pool.query(
            'DELETE FROM pedidos WHERE id_pedidos=$1 RETURNING *',
            [id]
        );
        res.send(result.rows[0]);
    } catch (err) {
        res.status(500).send(err);
    }
});

// ------------------------- CLIENTES -------------------------
app.get("/clientes", async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM cliente');
        res.send(result.rows);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.post("/clientes/create", async (req, res) => {
    const { Cliente, numero_telefonico, Email } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO cliente(Cliente, numero_telefonico, Email) VALUES($1, $2, $3) RETURNING *',
            [Cliente, numero_telefonico, Email]
        );
        res.send(result.rows[0]);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.put("/clientes/update", async (req, res) => {
    const { id_cliente, Cliente, numero_telefonico, Email } = req.body;
    try {
        const result = await pool.query(
            'UPDATE cliente SET Cliente=$1, numero_telefonico=$2, Email=$3 WHERE id_cliente=$4 RETURNING *',
            [Cliente, numero_telefonico, Email, id_cliente]
        );
        res.send(result.rows[0]);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.delete("/clientes/delete/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const result = await pool.query(
            'DELETE FROM cliente WHERE id_cliente=$1 RETURNING *',
            [id]
        );
        res.send(result.rows[0]);
    } catch (error) {
        res.status(500).send(error);
    }
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

// ------------------------- INVENTARIO -------------------------
app.get('/inventario', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM inventario');
        res.send(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

app.post('/create-inventario', async (req, res) => {
    const { tipoDeEquipo, marca, modelo, precio, fechaDeAdquisicion, condicion, codigo, idProveedor } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO inventario (tipo_De_Equipo, Marca, Modelo, Precio, Fecha_De_Adquisicion, Condicion, Codigo, id_proveedores) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
            [tipoDeEquipo, marca, modelo, precio, fechaDeAdquisicion, condicion, codigo, idProveedor]
        );
        
        // Insertar en historial de compras
        await pool.query(
            'INSERT INTO historial_de_compras (id_inventario) VALUES ($1)',
            [result.rows[0].id_inventario]
        );
        
        res.send(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

app.put('/update-inventario', async (req, res) => {
    const { idInventario, tipoDeEquipo, marca, modelo, precio, fechaDeAdquisicion, condicion, codigo, idProveedor } = req.body;
    try {
        const result = await pool.query(
            'UPDATE inventario SET tipo_De_Equipo = $1, Marca = $2, Modelo = $3, Precio = $4, Fecha_De_Adquisicion = $5, Condicion = $6, Codigo = $7, id_proveedores = $8 WHERE id_inventario = $9 RETURNING *',
            [tipoDeEquipo, marca, modelo, precio, fechaDeAdquisicion, condicion, codigo, idProveedor, idInventario]
        );
        res.send(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

app.delete('/delete-inventario/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const result = await pool.query(
            'DELETE FROM inventario WHERE id_inventario = $1 RETURNING *',
            [id]
        );
        res.send(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

// ------------------------- MANTENIMIENTO -------------------------
app.post("/mantenimiento/create", async (req, res) => {
    const { id_inventario, detalle_problema, tecnico_encargado, estado_de_reparacion, Fecha, Costo } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO mantenimiento 
                (id_inventario, detalle_problema, tecnico_encargado, estado_de_reparacion, Fecha, Costo)
                VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [id_inventario, detalle_problema, tecnico_encargado, estado_de_reparacion, Fecha, Costo]
        );
        res.send(result.rows[0]);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.get("/mantenimiento", async (req, res) => {
    const query = `
      SELECT m.*, i.tipo_De_Equipo, i.Marca, i.Modelo 
      FROM mantenimiento m
      LEFT JOIN inventario i ON m.id_inventario = i.id_inventario
    `;
    try {
        const result = await pool.query(query);
        res.send(result.rows);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.put("/mantenimiento/update", async (req, res) => {
    const { id_mantenimiento, id_inventario, detalle_problema, tecnico_encargado, estado_de_reparacion, Fecha, Costo } = req.body;
    try {
        const result = await pool.query(
            `UPDATE mantenimiento SET 
                id_inventario=$1, detalle_problema=$2, tecnico_encargado=$3, estado_de_reparacion=$4, Fecha=$5, Costo=$6
                WHERE id_mantenimiento=$7 RETURNING *`,
            [id_inventario, detalle_problema, tecnico_encargado, estado_de_reparacion, Fecha, Costo, id_mantenimiento]
        );
        res.send(result.rows[0]);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.delete("/mantenimiento/delete/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const result = await pool.query(
            'DELETE FROM mantenimiento WHERE id_mantenimiento=$1 RETURNING *',
            [id]
        );
        res.send(result.rows[0]);
    } catch (err) {
        res.status(500).send(err);
    }
});

// ------------------------- BAJAS -------------------------
app.post("/bajas/create", async (req, res) => {
    const { id_inventario, motivo, fecha, persona_encargada } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO bajas 
                (id_inventario, motivo, fecha, persona_encargada)
                VALUES ($1, $2, $3, $4) RETURNING *`,
            [id_inventario, motivo, fecha, persona_encargada]
        );
        res.send(result.rows[0]);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.get("/bajas", async (req, res) => {
    const query = `
      SELECT b.*, i.tipo_De_Equipo, i.Marca, i.Modelo 
      FROM bajas b
      LEFT JOIN inventario i ON b.id_inventario = i.id_inventario
    `;
    try {
        const result = await pool.query(query);
        res.send(result.rows);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.put("/bajas/update", async (req, res) => {
    const { id_bajas, id_inventario, motivo, fecha, persona_encargada } = req.body;
    try {
        const result = await pool.query(
            `UPDATE bajas SET 
                id_inventario=$1, motivo=$2, fecha=$3, persona_encargada=$4
                WHERE id_bajas=$5 RETURNING *`,
            [id_inventario, motivo, fecha, persona_encargada, id_bajas]
        );
        res.send(result.rows[0]);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.delete("/bajas/delete/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const result = await pool.query(
            'DELETE FROM bajas WHERE id_bajas=$1 RETURNING *',
            [id]
        );
        res.send(result.rows[0]);
    } catch (err) {
        res.status(500).send(err);
    }
});

// ------------------------- HISTORIAL DE COMPRAS -------------------------
app.get("/historial", async (req, res) => {
    const query = `
      SELECT 
        h.id_historial,
        i.tipo_De_Equipo,
        i.Marca,
        i.Modelo,
        i.Precio,
        i.Fecha_De_Adquisicion,
        p.nombre AS proveedor
      FROM historial_de_compras h
      LEFT JOIN inventario i ON h.id_inventario = i.id_inventario
      LEFT JOIN proveedores p ON i.id_proveedores = p.id_proveedores
      ORDER BY i.Fecha_De_Adquisicion DESC
    `;
    try {
        const result = await pool.query(query);
        res.send(result.rows);
    } catch (err) {
        console.error('Error al obtener historial:', err);
        res.status(500).send(err);
    }
});

app.delete("/historial/delete/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const result = await pool.query(
            'DELETE FROM historial_de_compras WHERE id_historial = $1 RETURNING *',
            [id]
        );
        res.send(result.rows[0]);
    } catch (err) {
        console.error('Error al eliminar historial:', err);
        res.status(500).send(err);
    }
});

// ------------------------- INICIAR SERVIDOR -------------------------
app.listen(3001, () => {
    console.log("Servidor corriendo en el puerto 3001 (PostgreSQL)");
});