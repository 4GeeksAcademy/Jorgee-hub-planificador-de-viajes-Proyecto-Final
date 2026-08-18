const estiloTitulo = {
	fontFamily: "Fraunces, Georgia, serif",
	fontWeight: 600,
	color: "#12343B",
};

const estiloInput = {
	border: "1px solid #B8DCE3",
	borderRadius: 0,
	color: "#12343B",
	padding: "0.75rem 0.9rem",
};

export const FormularioNuevaContrasena = ({
	nuevaContrasena,
	setNuevaContrasena,
	confirmacion,
	setConfirmacion,
	manejarRestablecimiento,
}) => {
	return (
		<form onSubmit={manejarRestablecimiento}>
			<h1
				className="display-6 mb-3"
				style={estiloTitulo}
			>
				Establece una nueva contraseña
			</h1>
			<p
				className="mb-4"
				style={{ color: "#456B75", lineHeight: 1.6 }}
			>
				Elige una contraseña segura para recuperar tu acceso.
			</p>

			<div className="mb-3">
				<label
					htmlFor="new-password"
					className="form-label small fw-semibold"
					style={{ color: "#12343B" }}
				>
					Nueva contraseña
				</label>
				<input
					id="new-password"
					type="password"
					required
					minLength="8"
					value={nuevaContrasena}
					onChange={(event) => setNuevaContrasena(event.target.value)}
					className="form-control"
					style={estiloInput}
				/>
			</div>

			<div className="mb-4">
				<label
					htmlFor="confirm-password"
					className="form-label small fw-semibold"
					style={{ color: "#12343B" }}
				>
					Confirma tu nueva contraseña
				</label>
				<input
					id="confirm-password"
					type="password"
					required
					minLength="8"
					value={confirmacion}
					onChange={(event) => setConfirmacion(event.target.value)}
					className="form-control"
					style={estiloInput}
				/>
			</div>

			<button
				type="submit"
				className="btn w-100 py-3"
				style={{
					backgroundColor: "#28C3D4",
					color: "#12343B",
					borderRadius: 0,
				}}
			>
				Guardar nueva contraseña
			</button>
		</form>
	);
};
