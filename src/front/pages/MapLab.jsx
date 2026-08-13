import React, { useState } from "react";
import { CircleMarker, MapContainer, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const destinations = [
	{ name: "Valparaíso, Chile", latitude: -33.0458456, longitude: -71.6196749 },
	{ name: "San José, Costa Rica", latitude: 9.9327707, longitude: -84.0796144 },
	{ name: "Río de Janeiro, Brasil", latitude: -22.9110137, longitude: -43.2093727 },
	{ name: "Buenos Aires, Argentina", latitude: -34.6095579, longitude: -58.3887904 },
	{ name: "Lima, Perú", latitude: -12.0459808, longitude: -77.0305912 },
];

export const MapLab = () => {
	const [selectedDestination, setSelectedDestination] = useState(destinations[0].name);
	const selected = destinations.find((destination) => destination.name === selectedDestination);

	return (
		<div className="container py-5">
			<h1>Laboratorio de mapa</h1>
			<p className="lead">
				Prueba temporal de Leaflet + tiles de OpenStreetMap. No guarda datos en la base de datos.
			</p>

			<div className="row g-3 mb-4">
				<div className="col-md-5">
					<label className="form-label" htmlFor="map-destination">Centrar mapa en</label>
					<select
						className="form-select"
						id="map-destination"
						value={selectedDestination}
						onChange={(event) => setSelectedDestination(event.target.value)}
					>
						{destinations.map((destination) => (
							<option key={destination.name}>{destination.name}</option>
						))}
					</select>
				</div>
				<div className="col-md-7 d-flex align-items-end">
					<p className="mb-2 text-muted">
						Coordenadas: {selected.latitude}, {selected.longitude}
					</p>
				</div>
			</div>

			<MapContainer
				center={[selected.latitude, selected.longitude]}
				key={selected.name}
				style={{ height: "560px", width: "100%" }}
				zoom={12}
			>
				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>
				{destinations.map((destination) => {
					const isSelected = destination.name === selected.name;
					return (
						<CircleMarker
							center={[destination.latitude, destination.longitude]}
							fillOpacity={0.9}
							key={destination.name}
							pathOptions={{ color: isSelected ? "#0d6efd" : "#6c757d", fillColor: isSelected ? "#0d6efd" : "#6c757d" }}
							radius={isSelected ? 10 : 7}
						>
							<Popup>
								<strong>{destination.name}</strong><br />
								{destination.latitude}, {destination.longitude}
							</Popup>
						</CircleMarker>
					);
				})}
			</MapContainer>

			<p className="small text-muted mt-3 mb-0">
				Los círculos representan los destinos iniciales. En la siguiente etapa podremos usar los lugares de Overpass como marcadores y evaluar cuántos se pueden mostrar sin saturar el mapa.
			</p>
		</div>
	);
};
