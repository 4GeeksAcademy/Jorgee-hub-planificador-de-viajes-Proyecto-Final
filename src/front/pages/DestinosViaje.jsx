import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export const DestinosViaje = () => {
	const { id } = useParams();
	const [destinos, setDestinos] = useState([]);
	const [cargando, setCargando] = useState(true);
	const [mostrarFormulario, setMostrarFormulario] = useState(false);
	const [nuevoDestino, setNuevoDestino] = useState({
		city: "",
		country: "",
		start_date: "",
		end_date: ""
	});
	const token = localStorage.getItem("token");

	useEffect(() => {
		const cargarDestinos = async () => {
			try {
				const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/trips/${id}/destinations`, {
					headers: { Authorization: `Bearer ${token}` }
				});
				const data = await res.json();
				setDestinos(data);
			} catch (error) {
				console.error("Error:", error);
			} finally {
				setCargando(false);
			}
		};
		cargarDestinos();
	}, [id]);

	const handleAgregarDestino = async (e) => {
		e.preventDefault();
		try {
			const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/trips/${id}/destinations`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`
				},
				body: JSON.stringify(nuevoDestino)
			});
			const data = await res.json();
			if (res.ok) {
				setDestinos([...destinos, data]);
				setMostrarFormulario(false);
				setNuevoDestino({ city: "", country: "", start_date: "", end_date: "" });
			}
		} catch (error) {
			console.error("Error:", error);
		}
	};

	const handleEliminarDestino = async (destinoId) => {
		if (!window.confirm("¿Eliminar este destino?")) return;
		try {
			const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/destinations/${destinoId}`, {
				method: "DELETE",
				headers: { Authorization: `Bearer ${token}` }
			});
			if (res.ok) {
				setDestinos(destinos.filter(d => d.id !== destinoId));
			}
		} catch (error) {
			console.error("Error:", error);
		}
	};

	const handleToggleFavorito = async (destino) => {
		try {
			const esFavorito = destino.is_favorite || false;

			if (esFavorito) {
				const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/favorites/${destino.favorite_id}`, {
					method: "DELETE",
					headers: { Authorization: `Bearer ${token}` }
				});
				if (res.ok) {
					setDestinos(destinos.map(d =>
						d.id === destino.id
							? { ...d, is_favorite: false, favorite_id: null }
							: d
					));
				}
			} else {
				const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/favorites`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`
					},
					body: JSON.stringify({
						destination_id: destino.id,
						trip_id: parseInt(id)
					})
				});
				const data = await res.json();
				if (res.ok) {
					setDestinos(destinos.map(d =>
						d.id === destino.id
							? { ...d, is_favorite: true, favorite_id: data.id }
							: d
					));
				}
			}
		} catch (error) {
			console.error("Error al cambiar favorito:", error);
		}
	};

	if (cargando) {
		return (
			<div className="container py-5 text-center">
				<p style={{ color: "#456B75" }}>Cargando destinos...</p>
			</div>
		);
	}

	return (
		<div className="container py-4">
			<div className="d-flex justify-content-between align-items-center mb-4">
				<h2 style={{ fontFamily: "Fraunces, Georgia, serif", color: "#12343B" }}>
					🌍 Destinos del viaje
				</h2>
				<Link to={`/trips/${id}`} className="btn btn-outline-secondary">
					← Volver al viaje
				</Link>
			</div>

			<div className="d-flex justify-content-end mb-4">
				<button
					className="btn"
					style={{ backgroundColor: "#28C3D4", color: "#FFFFFF", fontWeight: "bold" }}
					onClick={() => setMostrarFormulario(!mostrarFormulario)}
				>
					{mostrarFormulario ? "✕ Cancelar" : "+ Agregar Destino"}
				</button>
			</div>

			{mostrarFormulario && (
				<div className="mb-4 p-4" style={{ backgroundColor: "#FFFFFF" }}>
					<form onSubmit={handleAgregarDestino}>
						<div className="row g-3">
							<div className="col-md-3">
								<input type="text" className="form-control" placeholder="Ciudad" required
									value={nuevoDestino.city} onChange={(e) => setNuevoDestino({ ...nuevoDestino, city: e.target.value })} />
							</div>
							<div className="col-md-3">
								<input type="text" className="form-control" placeholder="País" required
									value={nuevoDestino.country} onChange={(e) => setNuevoDestino({ ...nuevoDestino, country: e.target.value })} />
							</div>
							<div className="col-md-2">
								<input type="date" className="form-control" required
									value={nuevoDestino.start_date} onChange={(e) => setNuevoDestino({ ...nuevoDestino, start_date: e.target.value })} />
							</div>
							<div className="col-md-2">
								<input type="date" className="form-control" required
									value={nuevoDestino.end_date} onChange={(e) => setNuevoDestino({ ...nuevoDestino, end_date: e.target.value })} />
							</div>
							<div className="col-md-2">
								<button type="submit" className="btn w-100" style={{ backgroundColor: "#28C3D4", color: "#FFFFFF" }}>
									Guardar
								</button>
							</div>
						</div>
					</form>
				</div>
			)}

			{destinos.length === 0 ? (
				<div className="text-center py-4" style={{ color: "#456B75" }}>
					No hay destinos agregados aún
				</div>
			) : (
				<div className="row g-4">
					{destinos.map(destino => (
						<div key={destino.id} className="col-md-6 col-lg-4">
							<div className="p-4 h-100" style={{ backgroundColor: "#FFFFFF", borderTop: "3px solid #28C3D4" }}>
								<div className="d-flex justify-content-between align-items-start">
									<div>
										<h4 style={{ fontFamily: "Fraunces, Georgia, serif", color: "#12343B" }}>
											{destino.city}, {destino.country}
										</h4>
										<p style={{ color: "#456B75", fontSize: "0.9rem" }}>
											{destino.start_date} — {destino.end_date}
										</p>
									</div>
									<div className="d-flex gap-2">
										<button
											className="btn btn-sm"
											onClick={() => handleToggleFavorito(destino)}
											style={{
												backgroundColor: "transparent",
												border: "none",
												fontSize: "1.5rem",
												padding: "0",
												cursor: "pointer",
												transition: "transform 0.2s"
											}}
											onMouseEnter={(e) => e.target.style.transform = "scale(1.2)"}
											onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
											title={destino.is_favorite ? "Eliminar de favoritos" : "Agregar a favoritos"}
										>
											{destino.is_favorite ? "⭐" : "☆"}
										</button>
										<button
											className="btn btn-sm btn-outline-danger"
											onClick={() => handleEliminarDestino(destino.id)}
										>
											🗑️
										</button>
									</div>
								</div>
								<div className="mt-3">
									<Link
										to={`/trips/${id}/destinos/${destino.id}/actividades`}
										className="btn w-100"
										style={{
											backgroundColor: "#EAF7FA",
											color: "#12343B",
											border: "1px solid #28C3D4"
										}}
									>
										📋 Ver Actividades
									</Link>
								</div>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
};
