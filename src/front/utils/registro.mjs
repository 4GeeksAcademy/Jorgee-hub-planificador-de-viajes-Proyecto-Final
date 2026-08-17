export const validarDatosPersonalesRegistro = (nombre, apellido) => {
	if (!nombre.trim() || !apellido.trim()) {
		return "El nombre y el apellido son obligatorios.";
	}

	return "";
};
