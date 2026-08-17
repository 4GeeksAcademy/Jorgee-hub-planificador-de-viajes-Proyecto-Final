export const validarNuevaContrasena = (contrasena, confirmacion) => {
	if (contrasena !== confirmacion) {
		return "Las contraseñas no coinciden.";
	}

	return "";
};
