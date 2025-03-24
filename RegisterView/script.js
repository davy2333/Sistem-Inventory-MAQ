const filtro = document.getElementById('filtro');
const valorBusqueda = document.getElementById('busqueda');
const buscarBtn = document.getElementById('botonBuscar');

function eliminarInventario(id) {
  fetch(`http://localhost:3001/inventario/${id}`, {
    method: 'DELETE',
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Error al eliminar el inventario: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log(data.message);
      // Actualiza la tabla después de eliminar el elemento
      actualizarTabla();
    })
    .catch(error => console.error('Error al eliminar el inventario:', error));
}

function actualizarTabla(columna, valor) {
  let url = 'http://localhost:3001/inventario';
  if (columna && valor) {
    url = `http://localhost:3001/buscar?columna=${columna}&valor=${valor}`;
  }

  fetch(url)
    .then(response => response.json())
    .then(data => {
      const tabla = document.getElementById('tabla-inventario').getElementsByTagName('tbody')[0];
      tabla.innerHTML = ''; // Limpia la tabla antes de agregar nuevos datos
      data.forEach(item => {
        const fila = tabla.insertRow();
        const celdaId = fila.insertCell();
        const celdaTipo_De_Equipo = fila.insertCell();
        const celdaMarca = fila.insertCell();
        const celdaNumero_De_Serie = fila.insertCell();
        const celdaPrecio = fila.insertCell();
        const celdaFecha_De_Adquisicion = fila.insertCell();
        const celdaCondicion = fila.insertCell();
        const celdaCodigo = fila.insertCell();
        const celdaProvedores = fila.insertCell();
        const celdaAcciones = fila.insertCell();
        celdaId.textContent = item.id_inventario;
        celdaTipo_De_Equipo.textContent = item.tipo_De_Equipo ;
        celdaMarca.textContent = item.Marca;
        celdaNumero_De_Serie.textContent = item.Numero_De_Serie;
        celdaPrecio.textContent = item.Precio;
       
          // Formatear la fecha
          const fecha = new Date(item.Fecha_De_Adquisicion);
          const año = fecha.getFullYear();
          const mes = String(fecha.getMonth() + 1).padStart(2, '0'); // Añade 1 porque los meses son de 0 a 11
          const dia = String(fecha.getDate()).padStart(2, '0');
          celdaFecha_De_Adquisicion.textContent = `${mes}/${dia}/${año}`;
       

        celdaCondicion.textContent = item.Condicion;
        celdaCodigo.textContent = item.Codigo;
        celdaProvedores.textContent = item.Nombre;
        const botonEliminar = document.createElement('button');
        botonEliminar.textContent = 'Eliminar';
        botonEliminar.classList.add('Eliminar-btn');
        botonEliminar.onclick = function() {
          eliminarInventario(item.id_inventario);
        };
        celdaAcciones.appendChild(botonEliminar);
      });
    })
    .catch(error => console.error('Error al obtener datos:', error));
}

// Carga inicial de la tabla
actualizarTabla();

buscarBtn.addEventListener('click', () => {
  const columnaSeleccionada = filtro.value;
  const valorBusquedaTexto = valorBusqueda.value;
  actualizarTabla(columnaSeleccionada, valorBusquedaTexto);
});