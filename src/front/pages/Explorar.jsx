import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MapaCiudad } from "../components/MapaCiudad";
import { TarjetaCiudad } from "../components/TarjetaCiudad";
import { ciudades, GRUPOS_LUGARES, LUGAR_ESTILOS } from "../data/ciudades.mjs";
import "../explorar.css";

const LIMITE_TOTAL = Object.values(GRUPOS_LUGARES).reduce((total, grupo) => total + grupo.limit, 0);


const estiloTitulo = {
	color: "#12343B",
	fontFamily: "Fraunces, Georgia, serif",
	fontWeight: 600,
};

const ESPERAS_REINTENTO_MS = [1000, 3000];

const esperar = (milisegundos) => new Promise((resolve) => window.setTimeout(resolve, milisegundos));

const esErrorTransitorio = (error) => !error.status || [429, 502, 503, 504].includes(error.status);

const consultarGrupoConReintentos = async (ciudad, nombreGrupo, grupo) => {
	for (let intento = 0; intento <= ESPERAS_REINTENTO_MS.length; intento += 1) {
		try {
			return await consultarGrupo(ciudad, grupo);
		} catch (error) {
			const quedanReintentos = intento < ESPERAS_REINTENTO_MS.length;
			if (!quedanReintentos || !esErrorTransitorio(error)) {
				// eslint-disable-next-line no-console -- Diagnóstico solicitado para fallos definitivos de Overpass.
				console.log("Overpass: grupo no cargado tras los reintentos.", {
					ciudad: ciudad.city,
					grupo: nombreGrupo,
					error: error.message,
				});
				throw error;
			}

			await esperar(ESPERAS_REINTENTO_MS[intento]);
		}
	}

	return [];
};

const consultarGrupo = async (ciudad, grupo) => {
	const around = `around:5000,${ciudad.latitude},${ciudad.longitude}`;
	const clauses = grupo.categorias.flatMap((categoria) => {
		const [clave, valor] = LUGAR_ESTILOS[categoria].selector;
		const selector = `[${clave}="${valor}"]`;
		return [`node${selector}(${around});`, `way${selector}(${around});`];
	});
	const query = `[out:json][timeout:25];(${clauses.join("")});out center ${grupo.limit};`;
	const respuesta = await fetch("https://overpass-api.de/api/interpreter", {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		body: new URLSearchParams({ data: query }),
	});

	if (!respuesta.ok) {
		const error = new Error(`Overpass respondió con HTTP ${respuesta.status}.`);
		error.status = respuesta.status;
		throw error;
	}

	const datos = await respuesta.json();
	return datos.elements
		.map((elemento) => {
			const categoria = grupo.categorias.find((item) => {
				const [clave, valor] = LUGAR_ESTILOS[item].selector;
				return elemento.tags?.[clave] === valor;
			});
			return {
				id: `${elemento.type}/${elemento.id}`,
				category: categoria || "attraction",
				name: elemento.tags?.name || "Sin nombre",
				latitude: elemento.lat || elemento.center?.lat || null,
				longitude: elemento.lon || elemento.center?.lon || null,
				address: elemento.tags?.["addr:street"] || "Dirección no disponible",
				style: LUGAR_ESTILOS[categoria] || LUGAR_ESTILOS.attraction,
			};
		})
		.filter((lugar) => lugar.name !== "Sin nombre" && lugar.latitude !== null && lugar.longitude !== null);
};

export const Explorar = () => {
	const [ciudadSeleccionada, setCiudadSeleccionada] = useState(null);
	const [lugares, setLugares] = useState([]);
	const [lugarSeleccionado, setLugarSeleccionado] = useState(null);
	const [estado, setEstado] = useState("idle");
	const [error, setError] = useState("");

	useEffect(() => {
		if (!ciudadSeleccionada) return undefined;
		let activa = true;
		setEstado("loading");
		setError("");
		setLugares([]);
		setLugarSeleccionado(null);

		Promise.allSettled(
			Object.entries(GRUPOS_LUGARES).map(([nombreGrupo, grupo]) => (
				consultarGrupoConReintentos(ciudadSeleccionada, nombreGrupo, grupo)
			)),
		)
			.then((resultados) => {
				if (!activa) return;
				const respuestasCorrectas = resultados
					.filter((resultado) => resultado.status === "fulfilled")
					.flatMap((resultado) => resultado.value);
				const hayFallos = resultados.some((resultado) => resultado.status === "rejected");
				const unicos = [...new Map(respuestasCorrectas.map((lugar) => [lugar.id, lugar])).values()];
				setLugares(unicos.slice(0, LIMITE_TOTAL));

				if (unicos.length) {
					setEstado("success");
					return;
				}

				if (hayFallos) {
					setError("No pudimos cargar los lugares en este momento. Intenta nuevamente más tarde.");
					setEstado("error");
					return;
				}

				setEstado("empty");
			});

		return () => { activa = false; };
	}, [ciudadSeleccionada]);

	const lugaresConSeleccion = lugares;

	return (
		<main className="explorar-page" style={{ backgroundColor: "#EAF7FA" }}>
			<section className="explorar-panel container-xl py-4 py-lg-5">
				<div className="row g-4 align-items-start">
					<aside className="col-lg-6 explorar-ciudades-panel">
						<div className="explorar-ciudades-cabecera">
							<Link
								className="explorar-volver-inicio text-decoration-none small"
								style={{ color: "#078A9A" }}
								to="/"
								aria-label="Volver al inicio"
							>
								←
							</Link>
							<h1 className="display-5 mb-0" style={estiloTitulo}>Explora ciudades</h1>
						</div>
						<div className="explorar-ciudades-list px-3 pb-3" aria-label="Ciudades disponibles">
								{ciudades.map((ciudad) => (
								<TarjetaCiudad
									ciudad={ciudad}
									key={ciudad.slug}
									onSeleccionar={setCiudadSeleccionada}
									seleccionada={ciudadSeleccionada?.slug === ciudad.slug}
								/>
								))}
							</div>
					</aside>

					<section className="col-lg-6 explorar-mapa-panel">
						<div className="explorar-mapa-wrapper">
							<MapaCiudad
								altura="620px"
								ciudad={ciudadSeleccionada}
								lugares={lugaresConSeleccion}
								lugarSeleccionado={lugarSeleccionado}
								onLugarClick={setLugarSeleccionado}
							/>
							{lugarSeleccionado && (
								<article className="explorar-lugar-detalle" aria-live="polite">
									<div><p className="small text-uppercase fw-semibold mb-1" style={{ color: lugarSeleccionado.style.color, letterSpacing: "0.1em" }}>{lugarSeleccionado.style.label}</p><h3 className="h4 mb-2" style={estiloTitulo}>{lugarSeleccionado.name}</h3><p className="mb-0" style={{ color: "#456B75" }}>{lugarSeleccionado.address}</p></div>
									<button className="btn-close" aria-label="Cerrar información del lugar" onClick={() => setLugarSeleccionado(null)} type="button" />
								</article>
							)}
						</div>
						<div className="visually-hidden" aria-live="polite">
							{estado === "loading" && <p role="status">Cargando lugares de la ciudad...</p>}
							{estado === "error" && <p role="alert">{error}</p>}
							{estado === "empty" && <p role="status">No encontramos lugares con nombre y coordenadas.</p>}
							{estado === "success" && <p>{lugares.length} lugares mostrados.</p>}
						</div>
					</section>
				</div>
			</section>
		</main>
	);
};
