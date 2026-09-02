import React from "react";
import { Link, useParams } from "react-router-dom";
import { obtenerCiudad } from "../data/ciudades.mjs";

export const Ciudad = () => {
	const { citySlug } = useParams();
	const ciudad = obtenerCiudad(citySlug);

	if (!ciudad) {
		return (
			<main className="min-vh-100 d-flex align-items-center" style={{ backgroundColor: "#EAF7FA" }}>
				<div className="container py-5">
					<div className="col-12 col-md-8 col-lg-6">
						<p className="small text-uppercase fw-semibold" style={{ color: "#078A9A", letterSpacing: "0.14em" }}>Destino</p>
						<h1 style={{ color: "#12343B", fontFamily: "Fraunces, Georgia, serif", fontSize: "clamp(2.5rem, 7vw, 5rem)", fontWeight: 600 }}>Ciudad no encontrada</h1>
						<p className="mb-4" style={{ color: "#6B8991" }}>Este destino no está disponible en nuestro catálogo.</p>
						<Link to="/explorar" className="btn px-4 py-2" style={{ backgroundColor: "#12343B", color: "#FFFFFF", borderRadius: 0 }}>Volver a explorar</Link>
					</div>
				</div>
			</main>
		);
	}

	return (
		<main className="min-vh-100 py-3 py-md-4" style={{ backgroundColor: "#EAF7FA" }}>
			<div className="container-fluid px-3 px-md-4 px-xl-5" style={{ maxWidth: "1440px" }}>
				{/* Navegación */}
				<header className="d-flex justify-content-between align-items-center py-2 mb-3">
					<Link to="/explorar" className="text-decoration-none small" style={{ color: "#078A9A" }}><i className="fa-solid fa-arrow-left me-2" aria-hidden="true" />Explorar ciudades</Link>
					<span className="small text-uppercase fw-semibold" style={{ color: "#6B8991", letterSpacing: "0.12em" }}>Destino</span>
				</header>

				{/* Portada de la ciudad */}
				<section className="row g-0 align-items-stretch mb-4" style={{ backgroundColor: "#12343B" }}>
					<div className="col-12 col-lg-5 d-flex align-items-center p-4 p-md-5">
						<div style={{ color: "#FFFFFF" }}>
							<p className="mb-3 text-uppercase fw-semibold" style={{ color: "#8CE3ED", letterSpacing: "0.14em", fontSize: "0.74rem" }}>{ciudad.country} · {ciudad.region}</p>
							<h1 className="mb-3" style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "clamp(3rem, 7vw, 6.5rem)", lineHeight: 0.92, fontWeight: 600 }}>{ciudad.city}</h1>
							<div style={{ width: "4rem", height: "3px", backgroundColor: "#28C3D4" }} />
						</div>
					</div>
					<div className="col-12 col-lg-7" style={{ minHeight: "360px" }}>
						<img src={ciudad.image} alt={`${ciudad.city}, ${ciudad.country}`} className="w-100 h-100 d-block object-fit-cover" style={{ minHeight: "360px", objectPosition: "center" }} />
					</div>
				</section>

				<div className="row g-4">
					{/* Historia y contexto */}
					<section className="col-12 col-lg-7">
						<div className="h-100 p-4 p-md-5" style={{ backgroundColor: "#FFFFFF" }}>
							<p className="mb-2 small text-uppercase fw-semibold" style={{ color: "#078A9A", letterSpacing: "0.14em" }}>Sobre el destino</p>
							<h2 className="mb-4" style={{ color: "#12343B", fontFamily: "Fraunces, Georgia, serif", fontSize: "clamp(2rem, 4vw, 3.2rem)", fontWeight: 600 }}>Una ciudad para recorrer a tu manera.</h2>
							<p className="mb-0" style={{ color: "#456B75", fontSize: "1.1rem", lineHeight: 1.8 }}>{ciudad.description}</p>
						</div>
					</section>

					{/* Ficha rápida */}
					<section className="col-12 col-lg-5">
						<div className="h-100 p-4 p-md-5" style={{ backgroundColor: "#D4F0F5" }}>
							<p className="mb-2 small text-uppercase fw-semibold" style={{ color: "#078A9A", letterSpacing: "0.14em" }}>Ficha rápida</p>
							<h2 className="h4 mb-4" style={{ color: "#12343B", fontWeight: 600 }}>Antes de empezar</h2>
							<dl className="mb-0">
								<div className="py-3" style={{ borderTop: "1px solid rgba(18, 52, 59, 0.18)" }}><dt className="small text-uppercase fw-semibold" style={{ color: "#6B8991", letterSpacing: "0.08em" }}>País</dt><dd className="mb-0 mt-1" style={{ color: "#12343B" }}>{ciudad.country}</dd></div>
								<div className="py-3" style={{ borderTop: "1px solid rgba(18, 52, 59, 0.18)" }}><dt className="small text-uppercase fw-semibold" style={{ color: "#6B8991", letterSpacing: "0.08em" }}>Región</dt><dd className="mb-0 mt-1" style={{ color: "#12343B" }}>{ciudad.region}</dd></div>
								<div className="py-3" style={{ borderTop: "1px solid rgba(18, 52, 59, 0.18)" }}><dt className="small text-uppercase fw-semibold" style={{ color: "#6B8991", letterSpacing: "0.08em" }}>Ideal para</dt><dd className="mb-0 mt-1" style={{ color: "#12343B" }}>{ciudad.bestFor}</dd></div>
							</dl>
						</div>
					</section>

					{/* Continuación del recorrido */}
					<section className="col-12">
						<div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-4 p-4 p-md-5" style={{ backgroundColor: "#12343B", color: "#FFFFFF" }}>
							<div><p className="mb-2 small text-uppercase fw-semibold" style={{ color: "#8CE3ED", letterSpacing: "0.14em" }}>Siguiente paso</p><h2 className="h3 mb-0" style={{ fontFamily: "Fraunces, Georgia, serif", fontWeight: 600 }}>Encuentra lugares para tu recorrido.</h2></div>
							<Link to="/explorar" className="btn flex-shrink-0 px-4 py-2" style={{ backgroundColor: "#28C3D4", color: "#12343B", borderRadius: 0 }}>Explorar lugares <i className="fa-solid fa-arrow-right ms-2" aria-hidden="true" /></Link>
						</div>
					</section>
				</div>
			</div>
		</main>
	);
};
