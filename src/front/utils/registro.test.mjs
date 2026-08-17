import test from "node:test";
import assert from "node:assert/strict";
import { validarDatosPersonalesRegistro } from "./registro.mjs";

test("rechaza nombre y apellido compuestos solo por espacios", () => {
	assert.equal(
		validarDatosPersonalesRegistro("   ", "Pérez"),
		"El nombre y el apellido son obligatorios."
	);
});
