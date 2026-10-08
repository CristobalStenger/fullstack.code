import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

// Confirmación reutilizable. Se abre con la prop "abierto";
// confirmar y cancelar son funciones que entrega el padre.
export default function ConfirmarModal({
  abierto,
  titulo,
  children,
  textoConfirmar = 'Confirmar',
  variante = 'danger',
  confirmar,
  cancelar,
}) {
  return (
    <Modal show={abierto} onHide={cancelar} centered aria-labelledby="titulo-confirmar">
      <Modal.Header closeButton>
        <Modal.Title id="titulo-confirmar">{titulo}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{children}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={cancelar}>
          Cancelar
        </Button>
        <Button variant={variante} onClick={confirmar}>
          {textoConfirmar}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
