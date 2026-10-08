import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import CampoFormulario from './CampoFormulario.jsx';
import { iconosCategoria } from '../../data/categoriasIniciales.js';
import { crearSlug } from '../../utils/formatos.js';
import { validarCategoria } from '../../utils/validaciones.js';
import { useFormulario } from '../../hooks/useFormulario.js';

export default function CategoriaForm({ categoria = null, categorias, onGuardar, onCancelar }) {
  const id = categoria?.id ?? null;
  const form = useFormulario(
    {
      nombre: categoria?.nombre ?? '',
      descripcion: categoria?.descripcion ?? '',
      icono: categoria?.icono ?? 'bi-tag',
    },
    (v) => validarCategoria(v, categorias, id),
  );
  const { valores } = form;

  return (
    <Form noValidate onSubmit={form.enviar((datos) => onGuardar(datos, id))}>
      <CampoFormulario
        id="categoria-nombre"
        name="nombre"
        etiqueta="Nombre de la categoría"
        ayuda="entre 3 y 50"
        maxLength={50}
        value={valores.nombre}
        onChange={form.cambiar}
        error={form.error('nombre')}
        valido={form.valido('nombre')}
      />
      <p className="small text-muted">
        Dirección en la tienda: /categorias/{crearSlug(valores.nombre) || '...'}
      </p>
      <CampoFormulario
        id="categoria-descripcion"
        name="descripcion"
        etiqueta="Descripción"
        ayuda="opcional, máx. 200"
        as="textarea"
        rows={2}
        maxLength={200}
        value={valores.descripcion}
        onChange={form.cambiar}
        error={form.error('descripcion')}
      />
      <fieldset className="mb-3">
        <legend className="form-label fw-bold fs-6">Ícono</legend>
        <div className="d-flex flex-wrap gap-2">
          {iconosCategoria.map((icono) => (
            <Form.Check
              key={icono}
              type="radio"
              id={`icono-${icono}`}
              name="icono"
              value={icono}
              checked={valores.icono === icono}
              onChange={form.cambiar}
              aria-label={icono.replace('bi-', 'Ícono ')}
              label={<i className={`bi ${icono} fs-4`} aria-hidden="true"></i>}
              className="border rounded px-4 py-1 bg-white"
            />
          ))}
        </div>
      </fieldset>
      <div className="d-flex gap-2 flex-wrap">
        <Button type="submit" variant="nexus" className="flex-grow-1">
          Guardar categoría
        </Button>
        <Button type="button" variant="secondary" onClick={onCancelar}>
          Cancelar
        </Button>
      </div>
    </Form>
  );
}
