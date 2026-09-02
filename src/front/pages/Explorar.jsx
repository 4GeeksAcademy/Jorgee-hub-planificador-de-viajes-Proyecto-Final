// src/front/pages/Explorar.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { TarjetaCiudad } from "../components/TarjetaCiudad";
import { ciudades } from "../data/ciudades.mjs";
import "../explorar.css";

export const Explorar = () => {
  const [ciudadSeleccionada, setCiudadSeleccionada] = useState(null);

  const handleSeleccionarCiudad = (ciudad) => {
    setCiudadSeleccionada(ciudad);
  };

  return (
    <main className="explorar-page">
      <section className="explorar-panel container-xl py-4 py-lg-5">
        <div className="row g-4 align-items-start">
          <aside className="col-lg-6 explorar-ciudades-panel">
            <div className="explorar-ciudades-cabecera">
              <Link
                className="explorar-volver-inicio text-decoration-none small"
                style={{ color: "#078A9A" }}
                to="/"
                aria-label="Volver al inicio"
              >
                ←
              </Link>
              <h1 className="display-5 mb-0" style={{ fontFamily: "Fraunces, Georgia, serif", color: "#12343B", fontWeight: 600 }}>
                Explora ciudades
              </h1>
            </div>

            <div className="explorar-ciudades-list px-3 pb-3">
              {ciudades.map((ciudad, index) => (
                <TarjetaCiudad
                  key={ciudad.slug}
                  ciudad={{
                    ...ciudad,
                    id: index + 1,
                    place_id: index + 1,
                    is_favorite: false,
                    favorite_id: null
                  }}
                  seleccionada={ciudadSeleccionada?.slug === ciudad.slug}
                  onSeleccionar={handleSeleccionarCiudad}
                />
              ))}
            </div>
          </aside>

          <section className="col-lg-6 explorar-mapa-panel">
            <div className="explorar-mapa-wrapper d-flex align-items-center justify-content-center" style={{ backgroundColor: "#E8F4F6", borderRadius: "8px" }}>
              <div className="text-center">
                <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🗺️</div>
                <p style={{ color: "#12343B", fontWeight: "bold" }}>
                  {ciudadSeleccionada ? `${ciudadSeleccionada.city}, ${ciudadSeleccionada.country}` : "Selecciona una ciudad"}
                </p>
                <p style={{ color: "#456B75", fontSize: "0.9rem" }}>
                  {ciudadSeleccionada ? "Mapa disponible próximamente" : "Las ciudades aparecerán aquí"}
                </p>
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
};
