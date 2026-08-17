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
