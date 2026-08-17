import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { formatearFechaViaje } from "../utils/viajes.mjs";

export const DetalleViaje = () => {
	const { tripId } = useParams();
	const [viaje, setViaje] = useState(null);
	const [cargando, setCargando] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		const cargarViaje = async () => {
			const token = localStorage.getItem("token");
			if (!token) {
				setError("Debes iniciar sesión para consultar este viaje.");
				setCargando(false);
				return;
			}

			try {
				const respuesta = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/trips/${tripId}`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				const datos = await respuesta.json();

				if (!respuesta.ok) {
					throw new Error(datos.error || "No fue posible cargar el viaje.");
				}

				setViaje(datos);
			} catch (errorDeRed) {
				setError(errorDeRed.message || "No fue posible conectar con el servidor.");
			} finally {
				setCargando(false);
			}
		};

		cargarViaje();
	}, [tripId]);

	return (
		<main className="min-vh-100 py-5" style={{ backgroundColor: "#EAF7FA" }}>
			<div className="container">
				<Link to="/trips" className="text-decoration-none d-inline-block mb-4" style={{ color: "#078A9A" }}>
					← Volver a Mis viajes
				</Link>
				{cargando && <p style={{ color: "#456B75" }}>Cargando viaje...</p>}
				{error && <div className="alert alert-danger rounded-0" role="alert">{error}</div>}
				{viaje && (
					<section className="p-4 p-lg-5" style={{ backgroundColor: "#FFFFFF", borderTop: "3px solid #28C3D4" }}>
						<p className="text-uppercase fw-semibold mb-2" style={{ color: "#078A9A", letterSpacing: "0.14em", fontSize: "0.75rem" }}>Detalle del viaje</p>
						<h1 className="display-6 mb-4" style={{ fontFamily: "Fraunces, Georgia, serif", color: "#12343B", fontWeight: 600 }}>{viaje.name}</h1>
						<div className="row g-4">
							<div className="col-md-6"><p className="small mb-1" style={{ color: "#456B75" }}>Inicio</p><p className="h5 mb-0" style={{ color: "#12343B" }}>{formatearFechaViaje(viaje.start_date)}</p></div>
							<div className="col-md-6"><p className="small mb-1" style={{ color: "#456B75" }}>Regreso</p><p className="h5 mb-0" style={{ color: "#12343B" }}>{formatearFechaViaje(viaje.end_date)}</p></div>
						</div>
					</section>
				)}
			</div>
		</main>
	);
};
