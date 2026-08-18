import test from "node:test";
import assert from "node:assert/strict";
import {
	formatearFechaViaje,
	obtenerFechaMinimaViaje,
	ordenarViajes,
	truncarNombreViaje,
	validarFechasViaje,
	validarFechaInicioViaje,
} from "./viajes.mjs";

test("acepta fechas de viaje en orden cronológico", () => {
	assert.equal(validarFechasViaje("2026-09-10", "2026-09-15"), "");
});

test("rechaza una fecha final anterior a la inicial", () => {
	assert.equal(
		validarFechasViaje("2026-09-15", "2026-09-10"),
		"La fecha de regreso debe ser posterior a la fecha de inicio."
	);
});

test("rechaza fechas de inicio y regreso iguales", () => {
	assert.equal(
		validarFechasViaje("2026-09-15", "2026-09-15"),
		"La fecha de regreso debe ser posterior a la fecha de inicio."
	);
});

test("formatea una fecha ISO para mostrarla en español", () => {
	assert.equal(formatearFechaViaje("2026-09-15"), "15 sept 2026");
});

test("obtiene la fecha mínima local para un viaje", () => {
	assert.equal(
		obtenerFechaMinimaViaje(new Date(2026, 8, 10)),
		"2026-09-10"
	);
});

test("rechaza un viaje que inicia antes de la fecha mínima", () => {
	assert.equal(
		validarFechaInicioViaje("2026-09-09", "2026-09-10"),
		"La fecha de inicio no puede ser anterior a hoy."
	);
});

test("ordena viajes por nombre de forma ascendente sin modificar la lista original", () => {
	const viajes = [
		{ id: 1, name: "Roma", start_date: "2026-10-01" },
		{ id: 2, name: "Atenas", start_date: "2026-09-01" },
	];

	const resultado = ordenarViajes(viajes, "name", "asc");

	assert.deepEqual(resultado.map((viaje) => viaje.name), ["Atenas", "Roma"]);
	assert.deepEqual(viajes.map((viaje) => viaje.name), ["Roma", "Atenas"]);
});

test("ordena viajes por fecha de inicio de forma descendente", () => {
	const viajes = [
		{ id: 1, name: "Roma", start_date: "2026-10-01" },
		{ id: 2, name: "Atenas", start_date: "2026-09-01" },
	];

	const resultado = ordenarViajes(viajes, "start_date", "desc");

	assert.deepEqual(resultado.map((viaje) => viaje.id), [1, 2]);
});

test("trunca el nombre de viaje que supera dieciocho caracteres", () => {
	assert.equal(
		truncarNombreViaje("1234567890123456789"),
		"123456789012345678..."
	);
});
