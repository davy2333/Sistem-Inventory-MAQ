import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function RestartButton() {
  const [busy, setBusy] = useState(false);

  const handleRestart = async () => {
    setBusy(true);
    try {
      const { data } = await axios.post('http://localhost:3001/restart');
      if (data.success) {
        Swal.fire({
          icon: 'info',
          title: 'Reinicio en curso',
          text: data.message,
          timer: 2000
        });
      } else {
        throw new Error(data.message || 'Error desconocido');
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'No se pudo reiniciar',
        text: err.message
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      className="btn btn-warning"
      onClick={handleRestart}
      disabled={busy}
    >
      {busy ? 'Reiniciando...' : 'Reiniciar servidor'}
    </button>
  );
}
