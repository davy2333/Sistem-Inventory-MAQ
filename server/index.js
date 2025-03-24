const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());


// Configuración de la base de datos para proveedores
const dbProveedores = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'systeminventorymaq',
});

// Ruta para obtener todo el inventario con el nombre del proveedor
app.get('/inventario', (req, res) => {
  const sql =
    'SELECT inventario.*, proveedores.Nombre FROM inventario JOIN proveedores ON ON inventario.id_proveedores = proveedores.id_proveedores;';
  dbInventario.query(sql, (err, results) => {
    if (err) {
      console.error('Error al consultar la base de datos de inventario:', err);
      res.status(500).json({ error: 'Error interno del servidor' });
      return;
    }
    res.json(results);
  });
});

// Ruta para eliminar un inventario por ID
app.delete('/inventario/:id', (req, res) => {
  const id = req.params.id;
  const sql = 'DELETE FROM inventario WHERE id_inventario = ?';

  dbInventario.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error al eliminar el inventario:', err);
      res.status(500).json({ error: 'Error interno del servidor' });
      return;
    }
    res.json({ message: 'Inventario eliminado con éxito' });
  });
});

// Ruta para obtener los datos filtrados del inventario
app.get('/buscar', (req, res) => {
  const columna = req.query.columna;
  const valor = req.query.valor;

  if (!columna || !valor) {
    return res.status(400).send('Se requieren columna y valor');
  }

  const query = `SELECT inventario.*, proveedores.Nombre FROM inventario JOIN proveedores ON inventario.id_proveedores = proveedores.id_proveedores WHERE ${columna} LIKE ?`;
  dbInventario.query(query, [`%${valor}%`], (err, results) => {
    if (err) {
      console.error('Error en la consulta de inventario:', err);
      return res.status(500).send('Error en la consulta');
    }
    res.json(results);
  });
});

// Ruta para crear un nuevo proveedor
app.post('/proveedores/create', (req, res) => {
  const nombre = req.body.nombre;
  const direccion = req.body.direccion;
  const numero_telefonico = req.body.numero_telefonico;
  const empresa = req.body.empresa;

  dbProveedores.query(
    'INSERT INTO proveedores(nombre,direccion,numero_telefonico,empresa) VALUES(?,?,?,?)',
    [nombre, direccion, numero_telefonico, empresa],
    (error, result) => {
      if (error) {
        console.error('Error al crear proveedor:', error);
        res.status(500).send('Error al crear proveedor');
      } else {
        res.send('Proveedor registrado con éxito!!');
      }
    }
  );
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});