import React, { useState } from "react";
import { CircleMarker, MapContainer, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const destinations = {
	"Valparaíso, Chile": { latitude: -33.0458456, longitude: -71.6196749 },
	"San José, Costa Rica": { latitude: 9.9327707, longitude: -84.0796144 },
	"Río de Janeiro, Brasil": { latitude: -22.9110137, longitude: -43.2093727 },
	"Buenos Aires, Argentina": { latitude: -34.6095579, longitude: -58.3887904 },
	"Lima, Perú": { latitude: -12.0459808, longitude: -77.0305912 },
};

const categories = [
	{ label: "Museos", group: "tourism", query: '["tourism"="museum"]', tag: "tourism", value: "museum", color: "#6f42c1" },
	{ label: "Miradores", group: "tourism", query: '["tourism"="viewpoint"]', tag: "tourism", value: "viewpoint", color: "#fd7e14" },
	{ label: "Parques", group: "tourism", query: '["leisure"="park"]', tag: "leisure", value: "park", color: "#198754" },
	{ label: "Monumentos", group: "tourism", query: '["historic"="monument"]', tag: "historic", value: "monument", color: "#6c757d" },
	{ label: "Restaurantes", group: "food", query: '["amenity"="restaurant"]', tag: "amenity", value: "restaurant", color: "#dc3545" },
	{ label: "Cafeterías", group: "food", query: '["amenity"="cafe"]', tag: "amenity", value: "cafe", color: "#795548" },
	{ label: "Bares", group: "food", query: '["amenity"="bar"]', tag: "amenity", value: "bar", color: "#0dcaf0" },
	{ label: "Hoteles", group: "lodging", query: '["tourism"="hotel"]', tag: "tourism", value: "hotel", color: "#0d6efd" },
	{ label: "Hostales", group: "lodging", query: '["tourism"="hostel"]', tag: "tourism", value: "hostel", color: "#6610f2" },
];

const groupSettings = {
	tourism: { label: "Turismo y cultura", limit: 20 },
	food: { label: "Comida y vida nocturna", limit: 30 },
	lodging: { label: "Alojamiento", limit: 20 },
};

const fetchGroup = async (group, groupCategories, destination) => {
	const around = `around:5000,${destination.latitude},${destination.longitude}`;
	const selectors = groupCategories.flatMap((category) => [
		`node${category.query}(${around});`,
		`way${category.query}(${around});`,
	]).join("");
	const query = `[out:json][timeout:25];(${selectors});out center ${groupSettings[group].limit};`;
	const response = await fetch("https://overpass-api.de/api/interpreter", {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		body: new URLSearchParams({ data: query }),
	});

	if (!response.ok) {
		throw new Error(`Overpass respondió con HTTP ${response.status}.`);
	}

	return response.json();
};

export const PlacesMapLab = () => {
	const [destinationName, setDestinationName] = useState("Valparaíso, Chile");
	const [selectedLabels, setSelectedLabels] = useState(["Museos"]);
	const [places, setPlaces] = useState([]);
	const [groupResults, setGroupResults] = useState([]);
	const [groupErrors, setGroupErrors] = useState([]);
	const [status, setStatus] = useState("idle");
	const selectedDestination = destinations[destinationName];
	const selectedCategories = categories.filter((category) => selectedLabels.includes(category.label));

	const toggleCategory = (label) => {
		setSelectedLabels((currentLabels) => {
			if (currentLabels.includes(label)) {
				return currentLabels.length === 1 ? currentLabels : currentLabels.filter((currentLabel) => currentLabel !== label);
			}
			return [...currentLabels, label];
		});
	};

	const searchPlaces = async (event) => {
		event.preventDefault();
		setStatus("loading");
		setPlaces([]);
		setGroupResults([]);
		setGroupErrors([]);

		const selectedGroups = Object.keys(groupSettings).filter((group) => selectedCategories.some((category) => category.group === group));
		const successfulPlaces = [];
		const successfulGroups = [];
		const failedGroups = [];

		for (const group of selectedGroups) {
			const groupCategories = selectedCategories.filter((category) => category.group === group);
			try {
				const data = await fetchGroup(group, groupCategories, selectedDestination);
				const normalizedPlaces = data.elements
					.map((element) => {
						const matchedCategory = groupCategories.find((category) => element.tags?.[category.tag] === category.value);
						return {
							id: `${element.type}/${element.id}`,
							name: element.tags?.name || "Sin nombre",
							category: matchedCategory?.label || "No disponible",
							color: matchedCategory?.color || "#6c757d",
							latitude: element.lat || element.center?.lat || null,
							longitude: element.lon || element.center?.lon || null,
						};
					})
					.filter((place) => place.name !== "Sin nombre" && place.latitude !== null && place.longitude !== null);
				successfulPlaces.push(...normalizedPlaces);
				successfulGroups.push({ group, count: normalizedPlaces.length, limit: groupSettings[group].limit });
			} catch (error) {
				failedGroups.push({ group, message: error.message || "No se pudo consultar este grupo." });
			}
		}

		setPlaces(successfulPlaces);
		setGroupResults(successfulGroups);
		setGroupErrors(failedGroups);
		setStatus(successfulPlaces.length ? "success" : failedGroups.length ? "error" : "empty");
	};

	return (
		<div className="container py-5">
			<h1>Laboratorio: lugares sobre el mapa</h1>
			<p className="lead">Prueba conjunta temporal: Overpass se consulta por grupos y Leaflet representa los resultados como marcadores. No guarda datos en la base de datos.</p>

			<form className="mb-4" onSubmit={searchPlaces}>
				<div className="row g-3">
					<div className="col-md-5">
						<label className="form-label" htmlFor="places-map-destination">Destino</label>
						<select className="form-select" id="places-map-destination" onChange={(event) => setDestinationName(event.target.value)} value={destinationName}>
							{Object.keys(destinations).map((destination) => <option key={destination}>{destination}</option>)}
						</select>
					</div>
					<div className="col-md-7 d-flex align-items-end">
						<button className="btn btn-primary w-100" disabled={status === "loading"} type="submit">
							{status === "loading" ? "Consultando resultados..." : "Mostrar resultados"}
						</button>
					</div>
				</div>

				<fieldset className="mt-3">
					<legend className="fs-6">Categorías (puedes elegir varias)</legend>
					<div className="d-flex flex-wrap gap-3">
						{categories.map((category) => (
							<label className="form-check" key={category.label}>
								<input checked={selectedLabels.includes(category.label)} className="form-check-input" onChange={() => toggleCategory(category.label)} type="checkbox" />
								<span className="form-check-label"><span aria-hidden="true" className="d-inline-block rounded-circle me-1" style={{ backgroundColor: category.color, height: "0.75rem", width: "0.75rem" }} />{category.label}</span>
							</label>
						))}
					</div>
				</fieldset>
			</form>

			{status === "idle" && <div className="alert alert-secondary" role="status">Elige un destino y una o más categorías; luego consulta los resultados.</div>}
			{status === "loading" && <div className="alert alert-info" role="status">Consultando grupos de Overpass y preparando marcadores...</div>}
			{status === "empty" && <div className="alert alert-warning" role="status">No se encontraron lugares con nombre y coordenadas.</div>}
			{status === "error" && <div className="alert alert-danger" role="alert">No se pudo cargar ningún grupo de resultados.</div>}
			{groupErrors.map((error) => <div className="alert alert-warning" key={error.group} role="alert"><strong>{groupSettings[error.group].label}:</strong> {error.message} Los demás grupos pueden mostrarse normalmente.</div>)}
			{groupResults.length > 0 && <div className="alert alert-success" role="status">{groupResults.map((result) => <span className="me-3" key={result.group}><strong>{groupSettings[result.group].label}:</strong> {result.count} de hasta {result.limit}</span>)}</div>}

			<MapContainer center={[selectedDestination.latitude, selectedDestination.longitude]} key={destinationName} style={{ height: "560px", width: "100%" }} zoom={12}>
				<TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
				<CircleMarker center={[selectedDestination.latitude, selectedDestination.longitude]} fillOpacity={1} pathOptions={{ color: "#0d6efd", fillColor: "#0d6efd" }} radius={10}><Popup><strong>Centro: {destinationName}</strong></Popup></CircleMarker>
				{places.map((place) => (
					<CircleMarker center={[place.latitude, place.longitude]} fillOpacity={0.85} key={place.id} pathOptions={{ color: place.color, fillColor: place.color }} radius={7}>
						<Popup><strong>{place.name}</strong><br />Categoría: {place.category}<br />Coordenadas: {place.latitude}, {place.longitude}<br />ID OSM: {place.id}</Popup>
					</CircleMarker>
				))}
			</MapContainer>
			{status === "success" && <p className="text-muted mt-3 mb-0">Los colores identifican categorías; el marcador azul representa el centro del destino.</p>}
		</div>
	);
};
