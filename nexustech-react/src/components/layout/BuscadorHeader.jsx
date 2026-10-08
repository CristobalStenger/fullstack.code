import { useState } from 'react';
import { useNavigate } from 'react-router';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

// Buscador de la barra superior: envía el texto al catálogo como ?q=
export default function BuscadorHeader() {
  const [texto, setTexto] = useState('');
  const navigate = useNavigate();

  function buscar(evento) {
    evento.preventDefault();
    const q = texto.trim();
    navigate(q ? `/productos?q=${encodeURIComponent(q)}` : '/productos');
  }

  return (
    <Form className="d-flex gap-2 buscador-header mx-lg-auto my-2 my-lg-0" role="search" onSubmit={buscar}>
      <Form.Control
        type="search"
        placeholder="Buscar productos"
        aria-label="Buscar productos"
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
      />
      <Button type="submit" variant="nexus-claro">
        Buscar
      </Button>
    </Form>
  );
}
