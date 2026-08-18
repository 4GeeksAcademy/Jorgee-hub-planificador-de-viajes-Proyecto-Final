// Import necessary components and functions from react-router-dom.

import {
	createBrowserRouter,
	createRoutesFromElements,
	Route,
} from "react-router-dom";
import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { Single } from "./pages/Single";
import { Demo } from "./pages/Demo";
import { CitiesLab } from "./pages/CitiesLab";
import { PlacesLab } from "./pages/PlacesLab";
import { MapLab } from "./pages/MapLab";
import { PlacesMapLab } from "./pages/PlacesMapLab";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { RecuperarContr } from "./pages/RecuperarContr";
import { CrearViaje } from "./pages/CrearViaje";
import { DetalleViaje } from "./pages/DetalleViaje";
import { MisViajes } from "./pages/MisViajes";
import { RutaProtegida } from "./components/RutaProtegida";

export const router = createBrowserRouter(
	createRoutesFromElements(
		<Route
			path="/"
			element={<Layout />}
			errorElement={<h1>Not found!</h1>}
		>
			{/* Rutas principales */}
			<Route path="/" element={<Home />} />
			<Route path="/single/:theId" element={<Single />} />
			<Route path="/demo" element={<Demo />} />
			<Route path="/lab/ciudades" element={<CitiesLab />} />
			<Route path="/lab/lugares" element={<PlacesLab />} />
			<Route path="/lab/mapa" element={<MapLab />} />
			<Route path="/lab/mapa-lugares" element={<PlacesMapLab />} />
			<Route path="/login" element={<Login />} />
			<Route path="/register" element={<Register />} />
			<Route path="/password-recovery" element={<RecuperarContr />} />
			<Route element={<RutaProtegida />}>
				<Route path="/trips/new" element={<CrearViaje />} />
				<Route path="/trips" element={<MisViajes />} />
				<Route path="/trips/:tripId" element={<DetalleViaje />} />
			</Route>
		</Route>
	)
);
