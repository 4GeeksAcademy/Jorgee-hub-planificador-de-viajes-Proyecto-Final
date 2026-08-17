import test from "node:test";
import assert from "node:assert/strict";
import { validarNuevaContrasena } from "../src/front/utils/recuperacionContrasena.mjs";

test("acepta contraseñas nuevas iguales de al menos ocho caracteres", () => {
	assert.equal(validarNuevaContrasena("viajes2026", "viajes2026"), "");
});

test("rechaza contraseñas nuevas que no coinciden", () => {
	assert.equal(
		validarNuevaContrasena("viajes2026", "destinos2026"),
		"Las contraseñas no coinciden."
	);
});
