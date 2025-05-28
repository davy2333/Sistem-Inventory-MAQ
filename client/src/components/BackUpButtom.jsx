import React, { useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';

export default function BackupButton() {
  const [loading, setLoading] = useState(false);

  const handleBackup = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('http://localhost:3001/backup');
      if (data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Backup generado',
          text: `Archivo: ${data.file}`,
          timer: 3000
        });
      } else {
        throw new Error(data.error || 'Error desconocido');
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Falló el backup',
        text: err.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className="btn btn-secondary"
      onClick={handleBackup}
      disabled={loading}
    >
      {loading ? 'Generando copia...' : 'Hacer copia de seguridad'}
    </button>
  );
}
