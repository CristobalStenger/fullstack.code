import { useState } from 'react';
import { sinErrores } from '../utils/validaciones.js';

// Estado de un formulario controlado con validación en vivo.
// Los errores se calculan en cada render con la función "validar"
// y se muestran cuando el campo fue tocado o se intentó enviar.
export function useFormulario(inicial, validar) {
  const [valores, setValores] = useState(inicial);
  const [tocados, setTocados] = useState({});
  const [intentado, setIntentado] = useState(false);
  const errores = validar(valores);
  const mostrar = (campo) => Boolean(tocados[campo] || intentado);

  function actualizar(cambios) {
    setValores((actual) => ({ ...actual, ...cambios }));
    setTocados((actual) => ({
      ...actual,
      ...Object.fromEntries(Object.keys(cambios).map((campo) => [campo, true])),
    }));
  }

  // Para usar directo en onChange de inputs, selects y checkboxes con "name"
  function cambiar(evento) {
    const { name, value, type, checked } = evento.target;
    actualizar({ [name]: type === 'checkbox' ? checked : value });
  }

  function enviar(alSerValido) {
    return (evento) => {
      evento.preventDefault();
      setIntentado(true);
      if (sinErrores(errores)) alSerValido(valores);
    };
  }

  function reiniciar(nuevos = inicial) {
    setValores(nuevos);
    setTocados({});
    setIntentado(false);
  }

  return {
    valores,
    errores,
    error: (campo) => (mostrar(campo) ? errores[campo] : undefined),
    valido: (campo) => mostrar(campo) && !errores[campo],
    cambiar,
    actualizar,
    enviar,
    reiniciar,
  };
}
