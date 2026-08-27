import React, { useEffect } from "react";
import PropTypes from "prop-types";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const MapaCentrado = ({ ciudad = null }) => {
	const mapa = useMap();

	useEffect(() => {
		if (ciudad) {
			mapa.flyTo([ciudad.latitude, ciudad.longitude], 13, { duration: 1.2 });
		} else {
			mapa.setView([20, 0], 2);
		}
	}, [ciudad, mapa]);

	return null;
};

const crearIconoLugar = (lugar, seleccionado = false) => {
	const { color } = lugar.style;
	const size = seleccionado ? 42 : 32;
	const offset = size / 2;
	const icono = lugar.style.icon || "fa-location-dot";
	return L.divIcon({
		className: "",
		html: `<span style="align-items:center;background:${seleccionado ? "#12343B" : color};border:2px solid #fff;border-radius:50%;box-shadow:0 2px 6px rgba(18,52,59,.3);color:#fff;display:flex;font-size:${seleccionado ? 17 : 14}px;height:${size}px;justify-content:center;width:${size}px"><i class="fa-solid ${icono}" aria-hidden="true"></i></span>`,
		iconAnchor: [offset, offset],
		popupAnchor: [0, -offset],
	});
};

export const MapaCiudad = ({
	ciudad = null,
	lugares,
	lugarSeleccionado = null,
	onLugarClick = () => {},
	altura = "520px",
}) => (
	<MapContainer center={[20, 0]} className="w-100" style={{ height: altura }} zoom={2}>
		<MapaCentrado ciudad={ciudad} />
		<TileLayer
			attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
			url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
		/>
		{lugares.filter((lugar) => lugar.id !== lugarSeleccionado?.id).map((lugar) => (
			<Marker
				eventHandlers={{ click: () => onLugarClick(lugar) }}
				icon={crearIconoLugar(lugar)}
				key={lugar.id}
				position={[lugar.latitude, lugar.longitude]}
			>
				<Popup>
					<strong>{lugar.name}</strong>
					<br />
					<span>{lugar.style.label}</span>
					<br />
					<span>{lugar.address}</span>
				</Popup>
			</Marker>
		))}
		{lugarSeleccionado && (
			<Marker
				icon={crearIconoLugar(lugarSeleccionado, true)}
				position={[lugarSeleccionado.latitude, lugarSeleccionado.longitude]}
			>
				<Popup autoClose={false} closeOnClick={false} open>
					<strong>{lugarSeleccionado.name}</strong>
					<br />
					<span>{lugarSeleccionado.style.label}</span>
					<br />
					<span>{lugarSeleccionado.address}</span>
				</Popup>
			</Marker>
		)}
	</MapContainer>
);

MapaCentrado.propTypes = {
	ciudad: PropTypes.shape({
		latitude: PropTypes.number.isRequired,
		longitude: PropTypes.number.isRequired,
	}),
};

MapaCiudad.propTypes = {
	ciudad: PropTypes.shape({
		latitude: PropTypes.number.isRequired,
		longitude: PropTypes.number.isRequired,
	}),
	lugares: PropTypes.arrayOf(PropTypes.shape({
		id: PropTypes.string.isRequired,
		category: PropTypes.string.isRequired,
		name: PropTypes.string.isRequired,
		address: PropTypes.string.isRequired,
		latitude: PropTypes.number.isRequired,
		longitude: PropTypes.number.isRequired,
		style: PropTypes.shape({
			label: PropTypes.string.isRequired,
			color: PropTypes.string.isRequired,
			icon: PropTypes.string.isRequired,
		}).isRequired,
	})).isRequired,
	lugarSeleccionado: PropTypes.shape({
		id: PropTypes.string.isRequired,
		category: PropTypes.string.isRequired,
		name: PropTypes.string.isRequired,
		address: PropTypes.string.isRequired,
		latitude: PropTypes.number.isRequired,
		longitude: PropTypes.number.isRequired,
		style: PropTypes.shape({
			label: PropTypes.string.isRequired,
			color: PropTypes.string.isRequired,
			icon: PropTypes.string.isRequired,
		}).isRequired,
	}),
	onLugarClick: PropTypes.func,
	altura: PropTypes.string,
};


