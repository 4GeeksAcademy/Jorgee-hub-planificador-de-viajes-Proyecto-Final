import test from "node:test";
import assert from "node:assert/strict";
import { obtenerMensajeErrorInicioSesion } from "../src/front/utils/autenticacion.mjs";

test("muestra el mensaje requerido cuando el backend rechaza las credenciales", () => {
	const mensaje = obtenerMensajeErrorInicioSesion(401, "Credenciales inválidas");

	assert.equal(mensaje, "Las credenciales son incorrectas.");
});

test("conserva un error distinto cuando no corresponde a credenciales", () => {
	const mensaje = obtenerMensajeErrorInicioSesion(500, "No fue posible iniciar sesión.");

	assert.equal(mensaje, "No fue posible iniciar sesión.");
});
