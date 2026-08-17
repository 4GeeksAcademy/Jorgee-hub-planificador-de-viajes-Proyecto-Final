export const validarFechasViaje = (fechaInicio, fechaFin) => {
	if (fechaFin <= fechaInicio) {
		return "La fecha de regreso debe ser posterior a la fecha de inicio.";
	}

	return "";
};
