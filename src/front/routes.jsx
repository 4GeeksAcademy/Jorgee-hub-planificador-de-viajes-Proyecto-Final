// Import necessary components and functions from react-router-dom.

import {
	createBrowserRouter,
	createRoutesFromElements,
	Route,
} from "react-router-dom";
import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { RecuperarContr } from "./pages/RecuperarContr";
import { CrearViaje } from "./pages/CrearViaje";
import { DetalleViaje } from "./pages/DetalleViaje";
import { MisViajes } from "./pages/MisViajes";
import { RutaProtegida } from "./components/RutaProtegida";
import { AnimacionesDev } from "./pages/AnimacionesDev";
import { Explorar } from "./pages/Explorar";
import { Ciudad } from "./pages/Ciudad";

export const router = createBrowserRouter(
	createRoutesFromElements(
		<Route
			path="/"
			element={<Layout />}
			errorElement={<h1>Not found!</h1>}
		>
			{/* Rutas principales */}
			<Route path="/" element={<Home />} />
			<Route path="/dev/animaciones" element={<AnimacionesDev />} />
			<Route path="/explorar" element={<Explorar />} />
			<Route path="/explorar/:citySlug" element={<Ciudad />} />
			<Route path="/login" element={<Login />} />
			<Route path="/register" element={<Register />} />
			<Route path="/recuperacion" element={<RecuperarContr />} />
			<Route element={<RutaProtegida />}>
				<Route path="/trips/new" element={<CrearViaje />} />
				<Route path="/trips" element={<MisViajes />} />
				<Route path="/trips/:tripId" element={<DetalleViaje />} />
			</Route>
		</Route>
	)
);
