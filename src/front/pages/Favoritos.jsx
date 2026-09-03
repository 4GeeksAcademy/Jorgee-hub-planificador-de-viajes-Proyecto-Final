import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchConSesion } from "../utils/sesion.mjs";

export const Favoritos = () => {
	const [favoritos, setFavoritos] = useState([]);
	const [cargando, setCargando] = useState(true);
	const [error, setError] = useState("");
	const token = localStorage.getItem("token");

	useEffect(() => {
		const cargarFavoritos = async () => {
			try {
				const res = await fetchConSesion(`${import.meta.env.VITE_BACKEND_URL}/api/favorites`, {
					headers: { 
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}` 
					}
				});

				console.log("Status de /api/favorites:", res.status);
				const text = await res.text();
				console.log("Respuesta cruda de /api/favorites:", text);

				if (!res.ok) {
					throw new Error(`Error ${res.status}: ${text}`);
				}

				const data = JSON.parse(text);
				console.log("Favoritos cargados:", data);
				setFavoritos(data);
			} catch (err) {
				console.error("Error al cargar favoritos:", err);
				setError(err.message || "Error al cargar favoritos");
			} finally {
				setCargando(false);
			}
		};
		cargarFavoritos();
	}, []);

	const handleEliminarFavorito = async (favoritoId) => {
		if (!window.confirm("¿Eliminar este favorito?")) return;
		
		try {
			const res = await fetchConSesion(`${import.meta.env.VITE_BACKEND_URL}/api/favorites/${favoritoId}`, {
				method: "DELETE",
				headers: { 
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}` 
				}
			});
			
			if (res.ok) {
				setFavoritos(favoritos.filter(f => f.id !== favoritoId));
				console.log("Favorito eliminado correctamente");
			} else {
				const text = await res.text();
				console.error("Error al eliminar:", text);
				alert("No se pudo eliminar el favorito");
			}
		} catch (error) {
			console.error("Error en la petición:", error);
			alert("Error al eliminar favorito");
		}
	};

	if (cargando) {
		return (
			<main className="min-vh-100 py-5" style={{ backgroundColor: "#EAF7FA" }}>
				<div className="container text-center">
					<p style={{ color: "#456B75" }}>Cargando favoritos...</p>
				</div>
			</main>
		);
	}

	return (
		<main className="min-vh-100 py-5" style={{ backgroundColor: "#EAF7FA" }}>
			<div className="container">
				<div className="d-flex justify-content-between align-items-center mb-4">
					<div>
						<p
							className="text-uppercase fw-semibold mb-1"
							style={{ color: "#078A9A", letterSpacing: "0.14em", fontSize: "0.75rem" }}
						>
							Tus intereses
						</p>
						<h1
							className="display-6 mb-0"
							style={{ fontFamily: "Fraunces, Georgia, serif", color: "#12343B", fontWeight: 600 }}
						>
							⭐ Lugares Favoritos
						</h1>
					</div>
					<Link to="/mis-viajes" className="btn btn-outline-secondary">
						← Volver a Mis Viajes
					</Link>
				</div>

				{error && (
					<div className="alert alert-danger rounded-0" role="alert">
						{error}
					</div>
				)}

				{favoritos.length === 0 ? (
					<div className="text-center py-5" style={{ backgroundColor: "#FFFFFF", padding: "3rem" }}>
						<p className="h3" style={{ fontFamily: "Fraunces, Georgia, serif", color: "#12343B" }}>
							📌 No tienes lugares favoritos
						</p>
						<p style={{ color: "#456B75" }}>
							Explora destinos y marca lugares como favoritos para encontrarlos aquí.
						</p>
						<Link to="/explorar" className="btn" style={{ backgroundColor: "#28C3D4", color: "#FFFFFF" }}>
							🌍 Explorar destinos
						</Link>
					</div>
				) : (
					<div className="row g-4">
						{favoritos.map((favorito) => (
							<div key={favorito.id} className="col-md-6 col-lg-4">
								<div
									className="p-4 h-100"
									style={{ backgroundColor: "#FFFFFF", borderTop: "3px solid #F5A623", borderRadius: "4px" }}
								>
									<div className="d-flex justify-content-between align-items-start">
										<div>
											<h3
												style={{
													fontFamily: "Fraunces, Georgia, serif",
													color: "#12343B",
													fontSize: "1.25rem"
												}}
											>
												{favorito.place?.name || "Lugar sin nombre"}
											</h3>
											{favorito.place?.category && (
												<p style={{ color: "#078A9A", fontSize: "0.85rem" }}>
													🏷️ {favorito.place.category}
												</p>
											)}
											{favorito.place?.address && (
												<p style={{ color: "#456B75", fontSize: "0.9rem" }}>
													📍 {favorito.place.address}
												</p>
											)}
											{favorito.place?.city && (
												<p style={{ color: "#456B75", fontSize: "0.9rem" }}>
													🏙️ {favorito.place.city}, {favorito.place.country || ""}
												</p>
											)}
											{favorito.notes && (
												<p
													style={{
														color: "#456B75",
														fontSize: "0.85rem",
														fontStyle: "italic"
													}}
												>
													{favorito.notes}
												</p>
											)}
										</div>
										<button
											className="btn btn-sm btn-outline-danger"
											onClick={() => handleEliminarFavorito(favorito.id)}
											title="Eliminar de favoritos"
										>
											❌
										</button>
									</div>
									<div className="mt-3 pt-3 border-top">
										<Link
											to={`/explorar/${favorito.place?.slug || favorito.place?.id}`}
											className="text-decoration-none"
											style={{ color: "#078A9A", fontSize: "0.85rem" }}
										>
											🌍 Ver en explorar
										</Link>
									</div>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</main>
	);
};
