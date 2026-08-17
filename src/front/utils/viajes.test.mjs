import test from "node:test";
import assert from "node:assert/strict";
import {
	formatearFechaViaje,
	obtenerFechaMinimaViaje,
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
