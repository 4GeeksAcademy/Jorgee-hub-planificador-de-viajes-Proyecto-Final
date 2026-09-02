// src/front/components/TarjetaCiudad.jsx
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

export const TarjetaCiudad = ({ ciudad, seleccionada, onSeleccionar }) => {
	const [esFavorito, setEsFavorito] = useState(false);
	const [favoriteId, setFavoriteId] = useState(null);
	const [cargando, setCargando] = useState(false);
	const token = localStorage.getItem("token");
	const placeId = ciudad.id || ciudad.place_id || ciudad.placeId;

	// Cargar estado de favorito desde el backend
	useEffect(() => {
		const verificarFavorito = async () => {
			if (!placeId || !token) return;

			try {
				const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/favorites`, {
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`
					}
				});

				if (res.ok) {
					const data = await res.json();
					const encontrado = data.find(fav => fav.place_id === placeId || fav.place?.id === placeId);
					if (encontrado) {
						setEsFavorito(true);
						setFavoriteId(encontrado.id);
					}
				}
			} catch (error) {
				console.error("Error al verificar favorito:", error);
			}
		};

		verificarFavorito();
	}, [placeId, token]);

	const handleToggleFavorito = async (e) => {
		e.stopPropagation();
		e.preventDefault();
		setCargando(true);

		if (!placeId) {
			console.error("No se encontró ID para el lugar");
			setCargando(false);
			return;
		}

		try {
			if (esFavorito) {
				// Eliminar favorito
				const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/favorites/${favoriteId}`, {
					method: "DELETE",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`
					}
				});

				if (res.ok) {
					setEsFavorito(false);
					setFavoriteId(null);
					console.log("Favorito eliminado");
				} else {
					const text = await res.text();
					console.error("Error al eliminar:", text);
				}
			} else {
				// Agregar favorito
				const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/places/${placeId}/favorites`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`
					}
				});

				if (res.ok) {
					const data = await res.json();
					setEsFavorito(true);
					setFavoriteId(data.id);
					console.log("Favorito agregado correctamente");
				} else {
					const text = await res.text();
					console.error("Error al agregar:", text);
				}
			}
		} catch (error) {
			console.error("Error en la petición:", error);
		} finally {
			setCargando(false);
		}
	};

	return (
		<article className={`explorar-ciudad-card ${seleccionada ? "explorar-ciudad-card-activa" : ""}`}>
			<button
				aria-pressed={seleccionada}
				className="explorar-ciudad-imagen-boton"
				onClick={() => onSeleccionar(ciudad)}
				type="button"
			>
				<span className="explorar-ciudad-imagen-wrapper">
					<img
						alt={`${ciudad.city}, ${ciudad.country}`}
						className="explorar-ciudad-imagen"
						src={ciudad.image}
						style={{ transform: `scale(${ciudad.imageScale || 1})` }}
					/>
				</span>
			</button>
			<div className="explorar-ciudad-contenido">
				<div className="d-flex justify-content-between align-items-start w-100">
					<button
						aria-pressed={seleccionada}
						className="explorar-ciudad-seleccion flex-grow-1"
						onClick={() => onSeleccionar(ciudad)}
						type="button"
					>
						<span className="explorar-ciudad-copy">
							<span className="explorar-ciudad-titulo">
								<strong>{ciudad.city}</strong>
								<span>, {ciudad.country}</span>
							</span>
							<span className="explorar-ciudad-categorias">{ciudad.bestFor}</span>
						</span>
					</button>

					<button
						className="btn btn-sm ms-2"
						onClick={handleToggleFavorito}
						disabled={cargando}
						style={{
							backgroundColor: esFavorito ? "#28C3D4" : "transparent",
							border: esFavorito ? "2px solid #28C3D4" : "none",
							borderRadius: "50%",
							width: "2.2rem",
							height: "2.2rem",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							fontSize: "1.2rem",
							padding: "0",
							cursor: "pointer",
							transition: "all 0.3s ease",
							flexShrink: 0,
							color: esFavorito ? "#FFFFFF" : "#12343B",
							boxShadow: esFavorito ? "0 2px 8px rgba(40, 195, 212, 0.4)" : "none"
						}}
						onMouseEnter={(e) => {
							if (!esFavorito) {
								e.target.style.backgroundColor = "#EAF7FA";
								e.target.style.border = "2px solid #28C3D4";
							}
							e.target.style.transform = "scale(1.1)";
						}}
						onMouseLeave={(e) => {
							if (!esFavorito) {
								e.target.style.backgroundColor = "transparent";
								e.target.style.border = "none";
							}
							e.target.style.transform = "scale(1)";
						}}
						title={esFavorito ? "Eliminar de favoritos" : "Agregar a favoritos"}
					>
						{esFavorito ? "⭐" : "☆"}
					</button>
				</div>

				<Link className="explorar-ciudad-ver-mas" to={`/explorar/${ciudad.slug}`}>
					Ver más →
				</Link>
			</div>
		</article>
	);
};

TarjetaCiudad.propTypes = {
	ciudad: PropTypes.shape({
		id: PropTypes.number,
		place_id: PropTypes.number,
		placeId: PropTypes.number,
		slug: PropTypes.string.isRequired,
		city: PropTypes.string.isRequired,
		country: PropTypes.string.isRequired,
		image: PropTypes.string.isRequired,
		imageScale: PropTypes.number,
		bestFor: PropTypes.string.isRequired,
	}).isRequired,
	seleccionada: PropTypes.bool.isRequired,
	onSeleccionar: PropTypes.func.isRequired,
};