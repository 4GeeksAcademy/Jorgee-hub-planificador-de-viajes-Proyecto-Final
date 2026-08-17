import test from "node:test";
import assert from "node:assert/strict";
import {
	cerrarSesion,
	obtenerMensajeErrorInicioSesion,
} from "../src/front/utils/autenticacion.mjs";

test("muestra el mensaje requerido cuando el backend rechaza las credenciales", () => {
	const mensaje = obtenerMensajeErrorInicioSesion(401, "Credenciales inválidas");

	assert.equal(mensaje, "Las credenciales son incorrectas.");
});

test("conserva un error distinto cuando no corresponde a credenciales", () => {
	const mensaje = obtenerMensajeErrorInicioSesion(500, "No fue posible iniciar sesión.");

	assert.equal(mensaje, "No fue posible iniciar sesión.");
});

test("elimina el token y los datos del usuario al cerrar sesión", () => {
	const clavesEliminadas = [];
	const almacenamiento = {
		removeItem: (clave) => clavesEliminadas.push(clave),
	};

	cerrarSesion(almacenamiento);

	assert.deepEqual(clavesEliminadas, ["token", "user"]);
});
