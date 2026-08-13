import React, { useState } from "react";

const destinations = {
	"Valparaíso, Chile": { latitude: -33.0458456, longitude: -71.6196749 },
	"San José, Costa Rica": { latitude: 9.9327707, longitude: -84.0796144 },
	"Río de Janeiro, Brasil": { latitude: -22.9110137, longitude: -43.2093727 },
	"Buenos Aires, Argentina": { latitude: -34.6095579, longitude: -58.3887904 },
	"Lima, Perú": { latitude: -12.0459808, longitude: -77.0305912 },
};

const categories = [
	{ label: "Turismo (general)", query: '["tourism"]' },
	{ label: "Atracciones", query: '["tourism"="attraction"]' },
	{ label: "Museos", query: '["tourism"="museum"]' },
	{ label: "Miradores", query: '["tourism"="viewpoint"]' },
	{ label: "Parques", query: '["leisure"="park"]' },
	{ label: "Restaurantes", query: '["amenity"="restaurant"]' },
	{ label: "Cafeterías", query: '["amenity"="cafe"]' },
	{ label: "Bares", query: '["amenity"="bar"]' },
	{ label: "Hoteles", query: '["tourism"="hotel"]' },
	{ label: "Hostales", query: '["tourism"="hostel"]' },
	{ label: "Monumentos", query: '["historic"="monument"]' },
];

export const PlacesLab = () => {
	const [destinationName, setDestinationName] = useState("Valparaíso, Chile");
	const [category, setCategory] = useState(categories[0]);
	const [radius, setRadius] = useState(5000);
	const [resultLimit, setResultLimit] = useState(20);
	const [results, setResults] = useState([]);
	const [status, setStatus] = useState("idle");
	const [errorMessage, setErrorMessage] = useState("");

	const searchPlaces = async (event) => {
		event.preventDefault();
		const destination = destinations[destinationName];
		const radiusInMeters = Number(radius);

		if (!destination || !Number.isFinite(radiusInMeters) || radiusInMeters < 500 || radiusInMeters > 10000) {
			setErrorMessage("El radio debe estar entre 500 y 10000 metros.");
			setStatus("error");
			return;
		}

		setStatus("loading");
		setErrorMessage("");
		setResults([]);

		const around = `around:${radiusInMeters},${destination.latitude},${destination.longitude}`;
		const query = `[out:json][timeout:25];(node${category.query}(${around});way${category.query}(${around}););out center ${resultLimit};`;

		try {
			const response = await fetch("https://overpass-api.de/api/interpreter", {
				method: "POST",
				headers: { "Content-Type": "application/x-www-form-urlencoded" },
				body: new URLSearchParams({ data: query }),
			});

			if (!response.ok) {
				throw new Error(`Overpass respondió con HTTP ${response.status}.`);
			}

			const data = await response.json();
			const normalizedResults = data.elements
				.map((element) => ({
					id: `${element.type}/${element.id}`,
					name: element.tags?.name || "Sin nombre",
					category: element.tags?.tourism || element.tags?.leisure || "No disponible",
					latitude: element.lat || element.center?.lat || null,
					longitude: element.lon || element.center?.lon || null,
					tags: element.tags || {},
				}))
				.filter((place) => place.name !== "Sin nombre" && place.latitude !== null && place.longitude !== null);

			setResults(normalizedResults);
			setStatus(normalizedResults.length ? "success" : "empty");
		} catch (error) {
			setErrorMessage(error.message || "No se pudo consultar Overpass.");
			setStatus("error");
		}
	};

	return (
		<div className="container py-5">
			<h1>Laboratorio de lugares</h1>
			<p className="lead">
				Prueba temporal de Overpass / OpenStreetMap. No guarda datos en la base de datos.
			</p>

			<form className="row g-3 mb-4" onSubmit={searchPlaces}>
				<div className="col-md-4">
					<label className="form-label" htmlFor="place-destination">Destino</label>
					<select
						className="form-select"
						id="place-destination"
						value={destinationName}
						onChange={(event) => setDestinationName(event.target.value)}
					>
						{Object.keys(destinations).map((destination) => (
							<option key={destination}>{destination}</option>
						))}
					</select>
				</div>
				<div className="col-md-3">
					<label className="form-label" htmlFor="place-category">Categoría</label>
					<select
						className="form-select"
						id="place-category"
						value={category.label}
						onChange={(event) => setCategory(categories.find((item) => item.label === event.target.value))}
					>
						{categories.map((item) => (
							<option key={item.label}>{item.label}</option>
						))}
					</select>
				</div>
				<div className="col-md-2">
					<label className="form-label" htmlFor="place-radius">Radio (m)</label>
					<input
						className="form-control"
						id="place-radius"
						max="10000"
						min="500"
						onChange={(event) => setRadius(event.target.value)}
						type="number"
						value={radius}
					/>
				</div>
				<div className="col-md-2">
					<label className="form-label" htmlFor="place-limit">Resultados</label>
					<select
						className="form-select"
						id="place-limit"
						value={resultLimit}
						onChange={(event) => setResultLimit(Number(event.target.value))}
					>
						<option value="20">20</option>
						<option value="50">50</option>
						<option value="100">100</option>
					</select>
				</div>
				<div className="col-md-2 d-flex align-items-end">
					<button className="btn btn-primary w-100" disabled={status === "loading"} type="submit">
						{status === "loading" ? "Consultando..." : "Buscar lugares"}
					</button>
				</div>
			</form>

			{status === "idle" && <div className="alert alert-secondary" role="status">Configura la búsqueda y consulta lugares.</div>}
			{status === "loading" && <div className="alert alert-info" role="status">Consultando Overpass...</div>}
			{status === "empty" && <div className="alert alert-warning" role="status">No se encontraron lugares con nombre y coordenadas.</div>}
			{status === "error" && <div className="alert alert-danger" role="alert">{errorMessage}</div>}

			{status === "success" && (
				<>
					<p className="text-muted">Se muestran hasta {resultLimit} resultados con nombre y coordenadas.</p>
					<div className="row g-3">
						{results.map((place) => (
							<div className="col-lg-6" key={place.id}>
								<article className="card h-100">
									<div className="card-body">
										<h2 className="h5 card-title">{place.name}</h2>
										<dl className="mb-0">
											<dt>Categoría OSM</dt>
											<dd>{place.category}</dd>
											<dt>Coordenadas</dt>
											<dd>{place.latitude}, {place.longitude}</dd>
											<dt>ID externo OSM</dt>
											<dd>{place.id}</dd>
										</dl>
										<details className="mt-3">
											<summary>Etiquetas originales</summary>
											<pre className="bg-light p-2 mt-2 mb-0 overflow-auto">{JSON.stringify(place.tags, null, 2)}</pre>
										</details>
									</div>
								</article>
							</div>
						))}
					</div>
				</>
			)}
		</div>
	);
};
