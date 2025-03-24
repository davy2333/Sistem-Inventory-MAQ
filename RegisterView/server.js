const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'systeminventorymaq',
});

// Ruta para obtener todo el inventario con el nombre del proveedor
app.get('/inventario', (req, res) => {
  const sql =
    'SELECT inventario.*, proveedores.Nombre FROM inventario JOIN proveedores ON inventario.id_proveedores = proveedores.id_proveedores;';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error al consultar la base de datos:', err);
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

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error al eliminar el inventario:', err);
      res.status(500).json({ error: 'Error interno del servidor' });
      return;
    }
    res.json({ message: 'Inventario eliminado con éxito' });
  });
});

// Ruta para obtener los datos filtrados
app.get('/buscar', (req, res) => {
  const columna = req.query.columna;
  const valor = req.query.valor;

  if (!columna || !valor) {
    return res.status(400).send('Se requieren columna y valor');
  }

  const query = `SELECT inventario.*, proveedores.Nombre FROM inventario JOIN proveedores ON inventario.id_proveedores = proveedores.id_proveedores WHERE ${columna} LIKE ?`;
  db.query(query, [`%${valor}%`], (err, results) => {
    if (err) {
      console.error('Error en la consulta:', err);
      return res.status(500).send('Error en la consulta');
    }
    res.json(results);
  });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});