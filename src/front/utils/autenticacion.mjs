export const obtenerMensajeErrorInicioSesion = (estado, mensajeBackend) => {
	if (estado === 401) {
		return "Las credenciales son incorrectas.";
	}

	return mensajeBackend || "No fue posible iniciar sesión.";
};
