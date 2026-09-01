import {
	createBrowserRouter,
	createRoutesFromElements,
	Route
} from "react-router-dom";
import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { Single } from "./pages/Single";
import { Demo } from "./pages/Demo";
import { CitiesLab } from "./pages/CitiesLab";
import { PlacesLab } from "./pages/PlacesLab";
import { MapLab } from "./pages/MapLab";
import { PlacesMapLab } from "./pages/PlacesMapLab";
import { AnimacionesDev } from "./pages/AnimacionesDev";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { RecuperarContr } from "./pages/RecuperarContr";
import { CrearViaje } from "./pages/CrearViaje";
import { DetalleViaje } from "./pages/DetalleViaje";
import { MisViajes } from "./pages/MisViajes";
import { RutaProtegida } from "./components/RutaProtegida";
import React from "react";
export const router = createBrowserRouter(
	createRoutesFromElements(
		// Definir la raíz del proyecto inyectando el diseño base global de la aplicación
		<Route
			path="/"
			element={<Layout />}
			errorElement={<h1>Not found!</h1>}
		>
			{/* Habilitar la ruta raíz para cargar la pantalla de bienvenida */}
			<Route path="/" element={<Home />} />
			
			{/* Declarar parámetros variables dinámicos para vistas específicas */}
			<Route path="/single/:theId" element={<Single />} />
			<Route path="/demo" element={<Demo />} />
			
			{/* Configurar los accesos a los diferentes laboratorios de desarrollo técnico */}
			<Route path="/lab/ciudades" element={<CitiesLab />} />
			<Route path="/lab/lugares" element={<PlacesLab />} />
			<Route path="/lab/mapa" element={<MapLab />} />
			<Route path="/lab/mapa-lugares" element={<PlacesMapLab />} />
			<Route path="/dev/animaciones" element={<AnimacionesDev />} />
			
			{/* Registrar las rutas necesarias para los formularios de credenciales */}
			<Route path="/login" element={<Login />} />
			<Route path="/register" element={<Register />} />
			<Route path="/recuperacion" element={<RecuperarContr />} />
			
			{/* Anidar rutas bajo el validador de sesiones privadas obligatorias */}
			<Route element={<RutaProtegida />}>
				{/* Cargar el formulario para dar de alta nuevas aventuras */}
				<Route path="/trips/new" element={<CrearViaje />} />
				
				{/* Desplegar la lista con la totalidad de itinerarios del usuario */}
				<Route path="/trips" element={<MisViajes />} />
				
				{/* Resolver la coincidencia exacta de redirección tras crear el viaje */}
				<Route path="/trips/:id" element={<DetalleViaje />} />
			</Route>
		</Route>
	)
);
