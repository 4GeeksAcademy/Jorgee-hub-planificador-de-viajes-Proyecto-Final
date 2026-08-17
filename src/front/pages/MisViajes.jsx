import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { formatearFechaViaje } from "../utils/viajes.mjs";

export const MisViajes = () => {
	const location = useLocation();
	const [viajes, setViajes] = useState([]);
	const [cargando, setCargando] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		const cargarViajes = async () => {
			const token = localStorage.getItem("token");
			if (!token) {
				setError("Debes iniciar sesión para consultar tus viajes.");
				setCargando(false);
				return;
			}

			try {
				const respuesta = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/trips`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				const datos = await respuesta.json();

				if (!respuesta.ok) {
					throw new Error(datos.error || "No fue posible cargar tus viajes.");
				}

				setViajes(datos);
			} catch (errorDeRed) {
				setError(errorDeRed.message || "No fue posible conectar con el servidor.");
			} finally {
				setCargando(false);
			}
		};

		cargarViajes();
	}, []);

	return (
		<main className="min-vh-100 py-5" style={{ backgroundColor: "#EAF7FA" }}>
			<div className="container">
				{/* Encabezado de Mis viajes */}
				<div className="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-5">
					<div>
						<p className="text-uppercase fw-semibold mb-2" style={{ color: "#078A9A", letterSpacing: "0.14em", fontSize: "0.75rem" }}>
							Tu planificación
						</p>
						<h1 className="display-6 mb-0" style={{ fontFamily: "Fraunces, Georgia, serif", color: "#12343B", fontWeight: 600 }}>
							Mis viajes
						</h1>
					</div>
					<Link to="/trips/new" className="btn px-4 py-3" style={{ backgroundColor: "#12343B", color: "#FFFFFF", borderRadius: 0 }}>
						Crear viaje
					</Link>
				</div>

				{location.state?.mensaje && (
					<div className="alert alert-success rounded-0" role="status">
						{location.state.mensaje}
					</div>
				)}
				{cargando && <p style={{ color: "#456B75" }}>Cargando tus viajes...</p>}
				{error && <div className="alert alert-danger rounded-0" role="alert">{error}</div>}
				{!cargando && !error && viajes.length === 0 && (
					<div className="p-5 text-center" style={{ backgroundColor: "#FFFFFF" }}>
						<h2 className="h3" style={{ ...{ fontFamily: "Fraunces, Georgia, serif" }, color: "#12343B" }}>Aún no tienes viajes.</h2>
						<p style={{ color: "#456B75" }}>Crea uno para comenzar a organizar tu próxima aventura.</p>
					</div>
				)}
				<div className="row g-4">
					{viajes.map((viaje) => (
						<div key={viaje.id} className="col-md-6 col-lg-4">
							<Link to={`/trips/${viaje.id}`} className="text-decoration-none d-block h-100">
								<article className="h-100 p-4" style={{ backgroundColor: "#FFFFFF", borderTop: "3px solid #28C3D4" }}>
									<p className="small mb-2" style={{ color: "#078A9A" }}>Viaje #{viaje.id}</p>
									<h2 className="h3 mb-3" style={{ fontFamily: "Fraunces, Georgia, serif", color: "#12343B" }}>{viaje.name}</h2>
									<p className="mb-0" style={{ color: "#456B75" }}>
										{formatearFechaViaje(viaje.start_date)} — {formatearFechaViaje(viaje.end_date)}
									</p>
								</article>
							</Link>
						</div>
					))}
				</div>
			</div>
		</main>
	);
};
