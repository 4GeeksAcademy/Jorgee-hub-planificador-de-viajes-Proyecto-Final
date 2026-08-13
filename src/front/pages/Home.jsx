import React, { useEffect, useState } from "react";

export const Home = () => {
	const [healthStatus, setHealthStatus] = useState("checking");

	useEffect(() => {
		const checkBackendHealth = async () => {
			try {
				const backendUrl = import.meta.env.VITE_BACKEND_URL;
				if (!backendUrl) {
					throw new Error("VITE_BACKEND_URL is not defined");
				}

				const response = await fetch(`${backendUrl}/api/health`);
				const data = await response.json();

				if (!response.ok || data.status !== "ok") {
					throw new Error("The health endpoint did not return ok");
				}

				setHealthStatus("available");
			} catch (error) {
				setHealthStatus("unavailable");
			}
		};

		checkBackendHealth();
	}, []);

	return (
		<div className="container py-5">
			<h1>Planificador de viajes</h1>
			<p>Base técnica del proyecto.</p>
			<div
				className={`alert ${healthStatus === "available" ? "alert-success" : healthStatus === "unavailable" ? "alert-danger" : "alert-secondary"}`}
				role="status"
			>
				{healthStatus === "checking" && "Comprobando conexión con el backend..."}
				{healthStatus === "available" && "Backend disponible."}
				{healthStatus === "unavailable" && "No se pudo conectar con el backend."}
			</div>
		</div>
	);
};
