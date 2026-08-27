import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { MapaCiudad } from "../components/MapaCiudad";
import { LUGAR_ESTILOS, obtenerCiudad } from "../data/ciudades.mjs";

const categorias = [
	{ key: "attraction", label: "Atracciones" },
	{ key: "museum", label: "Museos" },
	{ key: "park", label: "Parques" },
	{ key: "restaurant", label: "Restaurantes" },
];

const estiloTitulo = {
	fontFamily: "Fraunces, Georgia, serif",
	color: "#12343B",
	fontWeight: 600,
};

const consultarLugares = async (ciudad, categoria) => {
	const around = `around:5000,${ciudad.latitude},${ciudad.longitude}`;
	const estilo = LUGAR_ESTILOS[categoria.key];
	const [clave, valor] = estilo.selector;
	const selector = `[${clave}="${valor}"]`;
	const query = `[out:json][timeout:25];(node${selector}(${around});way${selector}(${around}););out center 40;`;
	const respuesta = await fetch("https://overpass-api.de/api/interpreter", {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		body: new URLSearchParams({ data: query }),
	});

	if (!respuesta.ok) {
		throw new Error(`Overpass respondió con HTTP ${respuesta.status}.`);
	}

	const datos = await respuesta.json();
	return datos.elements
		.map((elemento) => ({
			id: `${elemento.type}/${elemento.id}`,
			name: elemento.tags?.name || "Sin nombre",
			category: categoria.key,
			latitude: elemento.lat || elemento.center?.lat || null,
			longitude: elemento.lon || elemento.center?.lon || null,
			address: elemento.tags?.["addr:street"] || "Dirección no disponible",
			style: estilo,
		}))
		.filter((lugar) => lugar.name !== "Sin nombre" && lugar.latitude !== null && lugar.longitude !== null);
};

export const Ciudad = () => {
	const { citySlug } = useParams();
	const ciudad = obtenerCiudad(citySlug);
	const [categoria, setCategoria] = useState(categorias[0]);
	const [lugares, setLugares] = useState([]);
	const [estado, setEstado] = useState("idle");
	const [error, setError] = useState("");

	useEffect(() => {
		if (!ciudad) return;
		let activa = true;
		setEstado("loading");
		setError("");
		consultarLugares(ciudad, categoria)
			.then((resultados) => {
				if (activa) {
					setLugares(resultados);
					setEstado(resultados.length ? "success" : "empty");
				}
			})
			.catch((errorDeRed) => {
				if (activa) {
					setLugares([]);
					setError(errorDeRed.message || "No se pudieron cargar los lugares.");
					setEstado("error");
				}
			});
		return () => { activa = false; };
	}, [ciudad, categoria]);

	if (!ciudad) {
		return (
			<main className="min-vh-100 py-5" style={{ backgroundColor: "#EAF7FA" }}>
				<div className="container">
					<h1 style={estiloTitulo}>Ciudad no encontrada</h1>
					<Link to="/explorar" style={{ color: "#078A9A" }}>Volver a explorar</Link>
				</div>
			</main>
		);
	}

	return (
		<main className="min-vh-100 py-5" style={{ backgroundColor: "#EAF7FA" }}>
			<div className="container">
				<Link className="text-decoration-none d-inline-block mb-4" style={{ color: "#078A9A" }} to="/explorar">
					← Volver a explorar
				</Link>
				<div className="row g-4 align-items-stretch mb-5">
					<div className="col-lg-5">
						<div className="h-100 p-4 p-lg-5" style={{ backgroundColor: "#FFFFFF", borderTop: "3px solid #28C3D4" }}>
							<p className="text-uppercase fw-semibold mb-2" style={{ color: "#078A9A", letterSpacing: "0.14em", fontSize: "0.75rem" }}>{ciudad.country}</p>
							<h1 className="display-5 mb-4" style={estiloTitulo}>{ciudad.city}</h1>
							<p className="mb-4" style={{ color: "#456B75", lineHeight: 1.7 }}>{ciudad.description}</p>
							<p className="mb-0" style={{ color: "#12343B" }}><strong>Ideal para:</strong> {ciudad.bestFor}</p>
						</div>
					</div>
					<div className="col-lg-7">
						<div className="ciudad-imagen-wrapper">
							<img alt={`${ciudad.city}, ${ciudad.country}`} className="w-100 h-100 d-block object-fit-cover" src={ciudad.image} />
						</div>
					</div>
				</div>

				<section>
					<div className="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-3">
						<div>
							<p className="text-uppercase fw-semibold mb-2" style={{ color: "#078A9A", letterSpacing: "0.14em", fontSize: "0.75rem" }}>Descubre la ciudad</p>
							<h2 className="h1 mb-0" style={estiloTitulo}>Lugares para explorar</h2>
						</div>
						<div className="d-flex flex-wrap gap-2" role="group" aria-label="Filtrar lugares por categoría">
							{categorias.map((opcion) => (
								<button
									className="btn px-3 py-2"
									key={opcion.key}
									onClick={() => setCategoria(opcion)}
									type="button"
									style={{ backgroundColor: categoria.key === opcion.key ? "#12343B" : "#FFFFFF", borderColor: "#B8DCE3", borderRadius: 0, color: categoria.key === opcion.key ? "#FFFFFF" : "#12343B" }}
								>
									{opcion.label}
								</button>
							))}
						</div>
					</div>
					{estado === "loading" && <p role="status" style={{ color: "#456B75" }}>Cargando lugares cercanos...</p>}
					{estado === "error" && <div className="alert alert-warning rounded-0" role="alert">{error}</div>}
					{estado === "empty" && <div className="alert alert-secondary rounded-0" role="status">No encontramos lugares con nombre en esta categoría.</div>}
					<div className="row g-4">
						<div className="col-lg-8">
							<div style={{ backgroundColor: "#FFFFFF" }}>
								<MapaCiudad ciudad={ciudad} lugares={lugares} />
							</div>
						</div>
						<div className="col-lg-4">
							<div className="p-4 h-100" style={{ backgroundColor: "#FFFFFF" }}>
								<h3 className="h4 mb-3" style={estiloTitulo}>En el mapa</h3>
								{lugares.length > 0 ? (
									<ul className="list-unstyled mb-0">
										{lugares.map((lugar) => <li className="border-bottom py-2" key={lugar.id} style={{ color: "#456B75" }}>{lugar.name}</li>)}
									</ul>
								) : <p className="mb-0" style={{ color: "#456B75" }}>Los lugares encontrados aparecerán aquí.</p>}
							</div>
						</div>
					</div>
				</section>
			</div>
		</main>
	);
};
