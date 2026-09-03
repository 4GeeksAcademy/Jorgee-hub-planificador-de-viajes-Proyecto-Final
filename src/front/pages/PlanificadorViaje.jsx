import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CargadorMapa } from "../animaciones/CargadorMapa";
import { MapaCiudad } from "../components/MapaCiudad";
import { ciudades, LUGAR_ESTILOS } from "../data/ciudades.mjs";
import { obtenerMensajeErrorBackend } from "../utils/autenticacion.mjs";
import { fetchConSesion } from "../utils/sesion.mjs";

const gruposConsulta = ["turismo_cultura", "comida", "vida_nocturna", "paseos"];

const formatearFechaInput = (fecha) => {
	const year = fecha.getFullYear();
	const month = String(fecha.getMonth() + 1).padStart(2, "0");
	const day = String(fecha.getDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
};

const obtenerDias = (inicio, fin) => {
	if (!inicio || !fin) return [];
	const dias = [];
	const fechaActual = new Date(`${inicio}T12:00:00`);
	const fechaFinal = new Date(`${fin}T12:00:00`);

	while (fechaActual <= fechaFinal) {
		dias.push(formatearFechaInput(fechaActual));
		fechaActual.setDate(fechaActual.getDate() + 1);
	}

	return dias;
};

const formatearDia = (fecha, indice) => {
	const texto = new Intl.DateTimeFormat("es", { weekday: "short", day: "numeric", month: "short" }).format(new Date(`${fecha}T12:00:00`));
	return `Día ${indice + 1} · ${texto.replaceAll(".", "")}`;
};

const esCoordenadaValida = (lugar) => Number.isFinite(lugar.latitude) && Number.isFinite(lugar.longitude) && lugar.latitude >= -90 && lugar.latitude <= 90 && lugar.longitude >= -180 && lugar.longitude <= 180;

const cargarLugares = async (ciudad) => {
	const respuestas = await Promise.allSettled(gruposConsulta.map(async (grupo) => {
		const parametros = new URLSearchParams({ lat: ciudad.latitude, lon: ciudad.longitude, grupo });
		const respuesta = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/explorar/lugares?${parametros}`);
		const datos = await respuesta.json().catch(() => ({}));
		if (!respuesta.ok) throw new Error(obtenerMensajeErrorBackend(datos, "No fue posible cargar los lugares."));
		return (datos.places || []).filter(esCoordenadaValida).map((lugar) => ({
			...lugar,
			city: ciudad.city,
			style: LUGAR_ESTILOS[lugar.category] || LUGAR_ESTILOS.attraction
		}));
	}));

	const lugares = new Map();
	let error = "";
	respuestas.forEach((resultado) => {
		if (resultado.status === "fulfilled") resultado.value.forEach((lugar) => lugares.set(lugar.id, lugar));
		if (resultado.status === "rejected") error = resultado.reason.message;
	});
	return { lugares: [...lugares.values()], error };
};

export const PlanificadorViaje = () => {
	const { tripId } = useParams();
	const navigate = useNavigate();
	const token = localStorage.getItem("token");
	const [viaje, setViaje] = useState(null);
	const [destino, setDestino] = useState(null);
	const [ciudad, setCiudad] = useState(null);
	const [lugares, setLugares] = useState([]);
	const [lugarSeleccionado, setLugarSeleccionado] = useState(null);
	const [actividades, setActividades] = useState([]);
	const [diaActivo, setDiaActivo] = useState("");
	const [hora, setHora] = useState("");
	const [actividadEditando, setActividadEditando] = useState(null);
	const [horaEdicion, setHoraEdicion] = useState("");
	const [cargando, setCargando] = useState(true);
	const [cargandoLugares, setCargandoLugares] = useState(false);
	const [guardando, setGuardando] = useState(false);
	const [error, setError] = useState("");
	const [aviso, setAviso] = useState("");

	const dias = useMemo(() => obtenerDias(viaje?.start_date, viaje?.end_date), [viaje]);
	const actividadesDelDia = actividades.filter((actividad) => actividad.date === diaActivo).sort((a, b) => (a.time || "").localeCompare(b.time || ""));

	useEffect(() => {
		let activa = true;
		const cargarViaje = async () => {
			if (!token) {
				navigate("/login", { replace: true });
				return;
			}

			try {
				const encabezados = { Authorization: `Bearer ${token}` };
				const [respuestaViaje, respuestaDestinos] = await Promise.all([
					fetchConSesion(`${import.meta.env.VITE_BACKEND_URL}/api/trips/${tripId}`, { headers: encabezados }),
					fetchConSesion(`${import.meta.env.VITE_BACKEND_URL}/api/trips/${tripId}/destinations`, { headers: encabezados })
				]);
				const datosViaje = await respuestaViaje.json();
				const datosDestinos = await respuestaDestinos.json();
				if (!respuestaViaje.ok) throw new Error(obtenerMensajeErrorBackend(datosViaje, "No fue posible cargar el viaje."));
				if (!respuestaDestinos.ok) throw new Error(obtenerMensajeErrorBackend(datosDestinos, "No fue posible cargar el destino."));
				if (!activa) return;
				setViaje(datosViaje);
				setDiaActivo(datosViaje.start_date);
				const primerDestino = Array.isArray(datosDestinos) ? datosDestinos[0] : null;
				if (primerDestino) {
					setDestino(primerDestino);
					setCiudad(ciudades.find((item) => item.city === primerDestino.name && item.country === primerDestino.country) || null);
				}
			} catch (errorDeRed) {
				if (activa) setError(errorDeRed.message || "No fue posible cargar el planificador.");
			} finally {
				if (activa) setCargando(false);
			}
		};
		cargarViaje();
		return () => { activa = false; };
	}, [navigate, token, tripId]);

	useEffect(() => {
		if (!destino) return undefined;
		let activa = true;
		const cargarActividades = async () => {
			try {
				const respuesta = await fetchConSesion(`${import.meta.env.VITE_BACKEND_URL}/api/destinations/${destino.id}/activities`, { headers: { Authorization: `Bearer ${token}` } });
				const datos = await respuesta.json();
				if (!respuesta.ok) throw new Error(obtenerMensajeErrorBackend(datos, "No fue posible cargar la agenda."));
				if (activa) setActividades(Array.isArray(datos) ? datos : []);
			} catch (errorDeRed) {
				if (activa) setError(errorDeRed.message || "No fue posible cargar la agenda.");
			}
		};
		cargarActividades();
		return () => { activa = false; };
	}, [destino, token]);

	useEffect(() => {
		if (!ciudad) return undefined;
		let activa = true;
		setCargandoLugares(true);
		setLugares([]);
		setLugarSeleccionado(null);
		cargarLugares(ciudad).then(({ lugares: lugaresCargados, error: errorLugares }) => {
			if (!activa) return;
			setLugares(lugaresCargados);
			if (errorLugares && lugaresCargados.length === 0) setError(errorLugares);
		}).finally(() => {
			if (activa) setCargandoLugares(false);
		});
		return () => { activa = false; };
	}, [ciudad]);

	const cambiarCiudad = () => {
		setCiudad(null);
		setDestino(null);
		setLugares([]);
		setLugarSeleccionado(null);
		setAviso("");
	};

	const seleccionarCiudad = async (ciudadElegida) => {
		setError("");
		setAviso("");
		setGuardando(true);
		try {
			const respuesta = await fetchConSesion(`${import.meta.env.VITE_BACKEND_URL}/api/trips/${tripId}/destinations`, {
			method: "POST",
			headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
			body: JSON.stringify({ name: ciudadElegida.city, country: ciudadElegida.country })
			});
			const datos = await respuesta.json();
			if (!respuesta.ok) throw new Error(obtenerMensajeErrorBackend(datos, "No fue posible seleccionar la ciudad."));
			setDestino(datos);
			setCiudad(ciudadElegida);
			setAviso(`${ciudadElegida.city} quedó como destino del viaje.`);
		} catch (errorDeRed) {
			setError(errorDeRed.message || "No fue posible seleccionar la ciudad.");
		} finally {
			setGuardando(false);
		}
	};

	const agregarLugarAlDia = async () => {
		if (!lugarSeleccionado || !diaActivo || !destino) return;
		setError("");
		setAviso("");
		setGuardando(true);
		try {
			const respuesta = await fetchConSesion(`${import.meta.env.VITE_BACKEND_URL}/api/destinations/${destino.id}/activities`, {
			method: "POST",
			headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
			body: JSON.stringify({
				name: lugarSeleccionado.name,
				date: diaActivo,
				time: hora || null,
				notes: lugarSeleccionado.address || "",
				place_id: String(lugarSeleccionado.id),
				place_category: lugarSeleccionado.category || null,
				place_address: lugarSeleccionado.address || null,
				place_city: lugarSeleccionado.city || ciudad.city,
				place_source: "OpenStreetMap",
				place_latitude: lugarSeleccionado.latitude,
				place_longitude: lugarSeleccionado.longitude
			})
		});
		const datos = await respuesta.json();
		if (!respuesta.ok) throw new Error(obtenerMensajeErrorBackend(datos, "No fue posible agregar el lugar al día."));
		setActividades((actuales) => [...actuales, datos]);
		setHora("");
		setAviso(`${lugarSeleccionado.name} se agregó a ${formatearDia(diaActivo, dias.indexOf(diaActivo))}.`);
	} catch (errorDeRed) {
		setError(errorDeRed.message || "No fue posible agregar el lugar.");
	} finally {
		setGuardando(false);
	}
	};

	const guardarHoraActividad = async (actividad) => {
		setError("");
		try {
			const respuesta = await fetchConSesion(`${import.meta.env.VITE_BACKEND_URL}/api/activities/${actividad.id}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
				body: JSON.stringify({ time: horaEdicion || null })
			});
			const datos = await respuesta.json();
			if (!respuesta.ok) throw new Error(obtenerMensajeErrorBackend(datos, "No fue posible editar la actividad."));
			setActividades((actuales) => actuales.map((actual) => actual.id === actividad.id ? datos : actual));
			setActividadEditando(null);
			setAviso("La hora de la actividad se actualizó.");
		} catch (errorDeRed) {
			setError(errorDeRed.message || "No fue posible editar la actividad.");
		}
	};

	const eliminarActividad = async (actividadId) => {
		setError("");
		try {
			const respuesta = await fetchConSesion(`${import.meta.env.VITE_BACKEND_URL}/api/activities/${actividadId}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
			const datos = await respuesta.json();
			if (!respuesta.ok) throw new Error(obtenerMensajeErrorBackend(datos, "No fue posible quitar la actividad."));
			setActividades((actuales) => actuales.filter((actividad) => actividad.id !== actividadId));
		} catch (errorDeRed) {
			setError(errorDeRed.message || "No fue posible quitar la actividad.");
		}
	};

	if (cargando) return <main className="min-vh-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: "#EAF7FA", color: "#456B75" }}>Cargando tu planificador...</main>;
	if (error && !viaje) return <main className="min-vh-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: "#EAF7FA" }}><div className="alert alert-danger rounded-0">{error}</div></main>;

	return (
		<main className="min-vh-100" style={{ backgroundColor: "#EAF7FA" }}>
			<div className="container-fluid px-3 px-md-4 py-3" style={{ maxWidth: "1600px" }}>
				{/* Cabecera del viaje */}
				<header className="d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-3 mb-3">
					<div><Link to="/trips" className="small text-decoration-none" style={{ color: "#078A9A" }}><i className="fa-solid fa-arrow-left me-2" aria-hidden="true" />Mis viajes</Link><h1 className="mb-0 mt-2" style={{ fontFamily: "Fraunces, Georgia, serif", color: "#12343B", fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 600 }}>{viaje.name}</h1></div>
					<div className="small" style={{ color: "#456B75" }}>{viaje.start_date} · {viaje.end_date}</div>
				</header>

				{error && <div className="alert alert-danger rounded-0" role="alert">{error}</div>}
				{aviso && <div className="alert alert-success rounded-0" role="status">{aviso}</div>}

				{!ciudad ? (
					<section className="p-4 p-md-5" style={{ backgroundColor: "#FFFFFF" }}><p className="small text-uppercase fw-semibold" style={{ color: "#078A9A", letterSpacing: "0.12em" }}>Primer paso</p><h2 style={{ color: "#12343B", fontFamily: "Fraunces, Georgia, serif" }}>¿Qué ciudad quieres recorrer?</h2><p style={{ color: "#6B8991" }}>Elige un destino para preparar su mapa y comenzar tu agenda.</p><div className="row g-3 mt-3">{ciudades.map((item) => <div className="col-12 col-md-6 col-xl-4" key={item.slug}><button type="button" onClick={() => seleccionarCiudad(item)} disabled={guardando} className="w-100 text-start p-3" style={{ backgroundColor: "#EAF7FA", border: "1px solid #DDECEF", color: "#12343B" }}><strong className="d-block">{item.city}</strong><span className="small" style={{ color: "#6B8991" }}>{item.country}</span></button></div>)}</div></section>
				) : (
					<div className="row g-3 g-xl-4">
						{/* Días y agenda */}
						<aside className="col-12 col-xl-3">
							<section className="p-3 p-md-4 h-100" style={{ backgroundColor: "#12343B", color: "#FFFFFF" }}><p className="small text-uppercase fw-semibold mb-2" style={{ color: "#8CE3ED", letterSpacing: "0.12em" }}>Itinerario</p><h2 className="h4 mb-4" style={{ fontFamily: "Fraunces, Georgia, serif" }}>{ciudad.city}</h2><div className="d-flex flex-column">{dias.map((dia, indice) => <button type="button" key={dia} onClick={() => setDiaActivo(dia)} className="text-start px-3 py-3" style={{ backgroundColor: diaActivo === dia ? "#28C3D4" : "transparent", color: diaActivo === dia ? "#12343B" : "#D4F0F5", border: 0, borderTop: "1px solid rgba(212, 240, 245, 0.25)" }}>{formatearDia(dia, indice)}<span className="d-block small mt-1" style={{ opacity: 0.75 }}>{actividades.filter((actividad) => actividad.date === dia).length} lugares</span></button>)}</div><button type="button" onClick={cambiarCiudad} className="btn btn-sm mt-4 px-0" style={{ color: "#8CE3ED", border: 0 }}>Cambiar ciudad</button></section>
						</aside>

						{/* Mapa y selección */}
						<section className="col-12 col-xl-6"><div className="explorar-mapa-wrapper" style={{ height: "min(68vh, 700px)", minHeight: "480px" }}><MapaCiudad altura="100%" ciudad={ciudad} lugares={lugares} lugarSeleccionado={lugarSeleccionado} onLugarClick={setLugarSeleccionado} onClusterClick={() => setLugarSeleccionado(null)} />{cargandoLugares && <CargadorMapa />}{lugarSeleccionado && <article className="explorar-lugar-detalle" style={{ bottom: "1rem", left: "1rem", width: "min(32rem, calc(100% - 2rem))" }}><div className="explorar-lugar-detalle-contenido"><p className="small text-uppercase fw-semibold mb-1" style={{ color: lugarSeleccionado.style.color, letterSpacing: "0.1em" }}>{lugarSeleccionado.style.label}</p><h3 className="h5 mb-2" style={{ color: "#12343B" }}>{lugarSeleccionado.name}</h3><p className="small mb-3" style={{ color: "#6B8991" }}>{lugarSeleccionado.address || "Dirección no disponible"}</p><div className="d-flex flex-column flex-sm-row align-items-sm-center gap-2"><input aria-label="Hora de la actividad" type="time" value={hora} onChange={(evento) => setHora(evento.target.value)} className="form-control form-control-sm rounded-0" style={{ width: "auto" }} /><button type="button" onClick={agregarLugarAlDia} disabled={guardando} className="btn btn-sm px-3" style={{ backgroundColor: "#12343B", color: "#FFFFFF", borderRadius: 0 }}>Agregar al día</button></div></div><button type="button" onClick={() => setLugarSeleccionado(null)} className="btn-close" aria-label="Cerrar información del lugar" /></article>}</div></section>

						{/* Agenda del día */}
						<section className="col-12 col-xl-3"><div className="p-3 p-md-4 h-100" style={{ backgroundColor: "#FFFFFF", border: "1px solid #DDECEF" }}><div className="d-flex justify-content-between align-items-start gap-2 mb-4"><div><p className="small text-uppercase fw-semibold mb-2" style={{ color: "#078A9A", letterSpacing: "0.12em" }}>Día {dias.indexOf(diaActivo) + 1}</p><h2 className="h5 mb-0" style={{ color: "#12343B" }}>{diaActivo}</h2></div><i className="fa-regular fa-calendar" style={{ color: "#28C3D4" }} aria-hidden="true" /></div>{actividadesDelDia.length === 0 ? <div className="py-4" style={{ borderTop: "1px solid #DDECEF" }}><p className="mb-2" style={{ color: "#6B8991" }}>Este día todavía está libre.</p><small style={{ color: "#6B8991" }}>Selecciona un lugar en el mapa para comenzar.</small></div> : <ul className="list-unstyled mb-0">{actividadesDelDia.map((actividad) => <li key={actividad.id} className="py-3" style={{ borderTop: "1px solid #DDECEF" }}>{actividadEditando === actividad.id ? <div><strong className="d-block mb-2" style={{ color: "#12343B" }}>{actividad.name}</strong><div className="d-flex gap-2"><input aria-label={`Editar hora de ${actividad.name}`} type="time" value={horaEdicion} onChange={(evento) => setHoraEdicion(evento.target.value)} className="form-control form-control-sm rounded-0" /><button type="button" onClick={() => guardarHoraActividad(actividad)} className="btn btn-sm" style={{ backgroundColor: "#12343B", color: "#FFFFFF", borderRadius: 0 }}>Guardar</button><button type="button" onClick={() => setActividadEditando(null)} className="btn btn-sm btn-light rounded-0">Cancelar</button></div></div> : <div className="d-flex justify-content-between gap-2"><div><strong className="d-block" style={{ color: "#12343B" }}>{actividad.name}</strong><small style={{ color: "#078A9A" }}>{actividad.time || "Sin hora"}</small>{(actividad.place_address || actividad.notes) && <small className="d-block mt-2" style={{ color: "#6B8991" }}>{actividad.place_address || actividad.notes}</small>}</div><div className="d-flex gap-2"><button type="button" onClick={() => { setActividadEditando(actividad.id); setHoraEdicion(actividad.time || ""); }} className="btn btn-sm p-0" aria-label={`Editar ${actividad.name}`} style={{ color: "#078A9A" }}><i className="fa-solid fa-pen" aria-hidden="true" /></button><button type="button" onClick={() => eliminarActividad(actividad.id)} className="btn btn-sm p-0" aria-label={`Quitar ${actividad.name}`} style={{ color: "#6B8991" }}><i className="fa-solid fa-xmark" aria-hidden="true" /></button></div></div>}</li>)}</ul>}</div></section>
					</div>
				)}
			</div>
		</main>
	);
};
