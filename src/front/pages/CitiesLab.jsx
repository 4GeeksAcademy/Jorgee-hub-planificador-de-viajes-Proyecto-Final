import React, { useState } from "react";

const initialDestinations = [
	"Valparaíso, Chile",
	"San José, Costa Rica",
	"Río de Janeiro, Brasil",
	"Buenos Aires, Argentina",
	"Lima, Perú",
];

export const CitiesLab = () => {
	const [query, setQuery] = useState(initialDestinations[0]);
	const [results, setResults] = useState([]);
	const [status, setStatus] = useState("idle");
	const [errorMessage, setErrorMessage] = useState("");

	const searchCities = async (searchQuery = query) => {
		const cleanQuery = searchQuery.trim();
		if (!cleanQuery) {
			setErrorMessage("Escribe una ciudad o selecciona un destino inicial.");
			setStatus("error");
			return;
		}

		setQuery(cleanQuery);
		setStatus("loading");
		setErrorMessage("");
		setResults([]);

		const params = new URLSearchParams({
			q: cleanQuery,
			format: "jsonv2",
			limit: "5",
			addressdetails: "1",
		});

		try {
			const response = await fetch(
				`https://nominatim.openstreetmap.org/search?${params.toString()}`
			);

			if (!response.ok) {
				throw new Error(`Nominatim respondió con HTTP ${response.status}.`);
			}

			const data = await response.json();
			setResults(data);
			setStatus(data.length ? "success" : "empty");
		} catch (error) {
			setErrorMessage(error.message || "No se pudo consultar Nominatim.");
			setStatus("error");
		}
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		searchCities();
	};

	return (
		<div className="container py-5">
			<h1>Laboratorio de ciudades</h1>
			<p className="lead">
				Prueba temporal de Nominatim / OpenStreetMap. No guarda datos en la base de datos.
			</p>

			<form className="row g-2 mb-3" onSubmit={handleSubmit}>
				<div className="col-md-8">
					<label className="form-label" htmlFor="city-query">Ciudad o pueblo</label>
					<input
						className="form-control"
						id="city-query"
						value={query}
						onChange={(event) => setQuery(event.target.value)}
						placeholder="Ejemplo: Valparaíso, Chile"
					/>
				</div>
				<div className="col-md-4 d-flex align-items-end">
					<button className="btn btn-primary w-100" disabled={status === "loading"} type="submit">
						{status === "loading" ? "Consultando..." : "Buscar ciudad"}
					</button>
				</div>
			</form>

			<div className="mb-4">
				<p className="mb-2"><strong>Destinos iniciales:</strong></p>
				<div className="d-flex flex-wrap gap-2">
					{initialDestinations.map((destination) => (
						<button
							className="btn btn-outline-secondary btn-sm"
							key={destination}
							onClick={() => searchCities(destination)}
							type="button"
						>
							{destination}
						</button>
					))}
				</div>
			</div>

			{status === "idle" && (
				<div className="alert alert-secondary" role="status">
					Selecciona un destino inicial o escribe una búsqueda para comenzar.
				</div>
			)}
			{status === "loading" && <div className="alert alert-info" role="status">Consultando Nominatim...</div>}
			{status === "empty" && <div className="alert alert-warning" role="status">No se encontraron resultados.</div>}
			{status === "error" && <div className="alert alert-danger" role="alert">{errorMessage}</div>}

			{status === "success" && (
				<>
					<h2 className="h3">Datos normalizados</h2>
					<div className="row g-3 mb-5">
						{results.map((result) => (
							<div className="col-lg-6" key={result.place_id}>
								<article className="card h-100">
									<div className="card-body">
										<h3 className="h5 card-title">{result.name || result.display_name}</h3>
										<dl className="mb-0">
											<dt>Nombre completo</dt>
											<dd>{result.display_name}</dd>
											<dt>Tipo</dt>
											<dd>{result.type} ({result.category})</dd>
											<dt>País</dt>
											<dd>{result.address?.country || "No disponible"}</dd>
											<dt>Coordenadas</dt>
											<dd>{result.lat}, {result.lon}</dd>
											<dt>ID externo OSM</dt>
											<dd>{result.osm_type}/{result.osm_id}</dd>
										</dl>
									</div>
								</article>
							</div>
						))}
					</div>

					<h2 className="h3">Respuesta JSON original</h2>
					<pre className="bg-dark text-light p-3 rounded overflow-auto" style={{ maxHeight: "500px" }}>
						{JSON.stringify(results, null, 2)}
					</pre>
				</>
			)}
		</div>
	);
};
