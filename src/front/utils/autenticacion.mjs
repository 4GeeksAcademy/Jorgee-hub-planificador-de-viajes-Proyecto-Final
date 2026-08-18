export const cerrarSesion = (almacenamiento) => {
	almacenamiento.removeItem("token");
	almacenamiento.removeItem("user");
};

export const obtenerMensajeErrorInicioSesion = (estado, mensajeBackend) => {
	if (estado === 401) {
		return "Las credenciales son incorrectas.";
	}

	return mensajeBackend || "No fue posible iniciar sesión.";
};
