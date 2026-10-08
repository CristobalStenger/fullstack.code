import { useEffect, useReducer, useState } from 'react';
import { AuthContext } from './contextos.js';
import {
  cargarSesion,
  cargarUsuarios,
  guardarAutenticacion,
} from '../services/persistencia.js';
import {
  authReducer,
  buscarCredenciales,
  crearEstadoAuth,
} from '../store/authReducer.js';
import { sinErrores, validarUsuario } from '../utils/validaciones.js';

function cargarAutenticacion() {
  const usuarios = cargarUsuarios();
  return crearEstadoAuth(usuarios, cargarSesion(usuarios));
}

// Comparte usuarios y sesión. Las funciones validan primero para
// devolver los errores al formulario y luego despachan la acción.
export function AuthProvider({ children }) {
  const [estado, dispatch] = useReducer(authReducer, undefined, cargarAutenticacion);
  const [errorGuardado, setErrorGuardado] = useState(false);
  const { usuarios, sesion } = estado;

  useEffect(() => {
    setErrorGuardado(!guardarAutenticacion({ usuarios, sesion }));
  }, [usuarios, sesion]);

  function ingresar(correo, clave) {
    const usuario = buscarCredenciales(usuarios, correo, clave);
    if (!usuario) return { ok: false, error: 'Correo o contraseña incorrectos. Revisa tus datos.' };
    dispatch({ type: 'INGRESAR', correo, clave });
    return { ok: true, usuario };
  }

  function registrar(datos) {
    const errores = validarUsuario(datos, usuarios, null, {
      confirmarClave: true,
      conTerminos: true,
    });
    if (sinErrores(errores)) dispatch({ type: 'REGISTRAR', datos });
    return { ok: sinErrores(errores), errores };
  }

  function guardarUsuario(datos, runOriginal = null) {
    const errores = validarUsuario(datos, usuarios, runOriginal, { conTipo: true });
    if (sinErrores(errores)) dispatch({ type: 'GUARDAR_USUARIO', datos, runOriginal });
    return { ok: sinErrores(errores), errores };
  }

  function eliminarUsuario(run) {
    if (sesion?.run === run)
      return { ok: false, error: 'No puedes eliminar tu propia cuenta mientras la estás usando.' };
    dispatch({ type: 'ELIMINAR_USUARIO', run });
    return { ok: true };
  }

  const valor = {
    usuarios,
    sesion,
    aviso: estado.aviso,
    errorGuardado,
    ingresar,
    registrar,
    guardarUsuario,
    eliminarUsuario,
    cerrarSesion: () => dispatch({ type: 'SALIR' }),
    cerrarAviso: () => dispatch({ type: 'CERRAR_AVISO' }),
  };

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}
