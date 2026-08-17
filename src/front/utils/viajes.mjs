const mesesCortos = [
	"ene",
	"feb",
	"mar",
	"abr",
	"may",
	"jun",
	"jul",
	"ago",
	"sept",
	"oct",
	"nov",
	"dic",
];

export const obtenerFechaMinimaViaje = (fechaActual) => {
	const anio = fechaActual.getFullYear();
	const mes = String(fechaActual.getMonth() + 1).padStart(2, "0");
	const dia = String(fechaActual.getDate()).padStart(2, "0");
	return `${anio}-${mes}-${dia}`;
};

export const validarFechaInicioViaje = (fechaInicio, fechaMinima) => {
	if (fechaInicio < fechaMinima) {
		return "La fecha de inicio no puede ser anterior a hoy.";
	}

	return "";
};

export const validarFechasViaje = (fechaInicio, fechaFin) => {
	if (fechaFin <= fechaInicio) {
		return "La fecha de regreso debe ser posterior a la fecha de inicio.";
	}

	return "";
};

export const formatearFechaViaje = (fechaIso) => {
	if (!fechaIso) {
		return "Sin fecha";
	}

	const [anio, mes, dia] = fechaIso.split("-");
	return `${Number(dia)} ${mesesCortos[Number(mes) - 1]} ${anio}`;
};
