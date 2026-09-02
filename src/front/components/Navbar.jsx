import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useEntradaDesdeArriba } from "../animaciones/useEntradaDesdeArriba";
import { cerrarSesion } from "../utils/autenticacion.mjs";

export const Navbar = () => {
	const navigate = useNavigate();
	const navbarRef = useRef(null);
	const botonMenuRef = useRef(null);
	const [sesionActiva, setSesionActiva] = useState(() => Boolean(localStorage.getItem("token")));
	const [menuAbierto, setMenuAbierto] = useState(false);

	useEntradaDesdeArriba(navbarRef, {
		delay: 0,
		opacity: 0,
		position: -96,
		tiempo: 0.65,
	});

	useEffect(() => {
		const actualizarSesion = () => {
			setSesionActiva(Boolean(localStorage.getItem("token")));
		};

		window.addEventListener("sesion-cambiada", actualizarSesion);

		return () => {
			window.removeEventListener("sesion-cambiada", actualizarSesion);
		};
	}, []);

	const cerrarMenu = useCallback(() => {
		setMenuAbierto(false);
		botonMenuRef.current?.focus();
	}, []);

	useEffect(() => {
		if (!menuAbierto) return undefined;

		const manejarTecla = (evento) => {
			if (evento.key === "Escape") cerrarMenu();
		};

		document.addEventListener("keydown", manejarTecla);
		return () => document.removeEventListener("keydown", manejarTecla);
	}, [menuAbierto, cerrarMenu]);

	const manejarCierreSesion = () => {
		cerrarSesion(localStorage);
		setSesionActiva(false);
		cerrarMenu();
		navigate("/");
	};

	return (
		<nav
			ref={navbarRef}
			className={`navbar navbar-expand-lg py-3 sticky-top${menuAbierto ? " navbar-menu-abierto" : ""}`}
			style={{
				backgroundColor: "#12343B",
				zIndex: 1020,
				boxShadow: "0 2px 12px rgba(18, 52, 59, 0.18)",
			}}
		>
			<div className="container">
				<Link
					to="/"
					className="navbar-brand"
					style={{
						color: "#EAF7FA",
						fontFamily: "Fraunces, Georgia, serif",
						fontSize: "1.8rem",
						fontWeight: 600,
					}}
				>
					Viajero
				</Link>
				{!menuAbierto && (
					<button
						ref={botonMenuRef}
						className="navbar-toggler"
						type="button"
						aria-controls="mainNavigation"
						aria-expanded={menuAbierto}
						aria-label="Abrir navegación"
						onClick={() => setMenuAbierto(true)}
					>
						<i className="fa-solid fa-bars" aria-hidden="true" />
					</button>
				)}
				{menuAbierto && (
					<button
						className="navegacion-movil-fondo"
						type="button"
						aria-label="Cerrar menú"
						onClick={cerrarMenu}
					/>
				)}
				<div
					className={`offcanvas offcanvas-end navegacion-movil-panel${menuAbierto ? " show" : ""}`}
					id="mainNavigation"
					aria-labelledby="mainNavigationTitle"
					aria-hidden={!menuAbierto}
				>
					<h2 id="mainNavigationTitle" className="visually-hidden">
						Navegación principal
					</h2>
					<button
						className="navegacion-movil-cerrar"
						type="button"
						aria-label="Cerrar navegación"
						onClick={cerrarMenu}
					>
						<i className="fa-solid fa-xmark" aria-hidden="true" />
					</button>
					<ul className="navbar-nav ms-auto align-items-lg-center gap-lg-4">
						<li className="nav-item">
							<Link
								to="/explorar"
								className="nav-link"
								onClick={cerrarMenu}
								style={{ color: "#D4F0F5" }}
							>
								Explorar
							</Link>
						</li>
						<li className="nav-item">
							<Link
								to="/trips"
								className="nav-link"
								onClick={cerrarMenu}
								style={{ color: "#D4F0F5" }}
							>
								Mis viajes
							</Link>
						</li>
						<li className="nav-item">
							<a
								className="nav-link"
								onClick={cerrarMenu}
								href="#footer"
								style={{ color: "#D4F0F5" }}
							>
								Favoritos
							</a>
						</li>
						<li className="nav-item dropdown">
							<button
								className="btn border-0 p-2 dropdown-toggle"
								type="button"
								data-bs-toggle="dropdown"
								aria-expanded="false"
								aria-label="Abrir opciones de usuario"
								style={{ color: "#EAF7FA" }}
							>
								<i
									className="fa-regular fa-user fs-5"
									aria-hidden="true"
								/>
							</button>
							<ul
								className="dropdown-menu dropdown-menu-end border-0 shadow-sm mt-2 p-2"
								style={{
									backgroundColor: "#EAF7FA",
									"--bs-dropdown-link-hover-bg": "#D4F0F5",
									"--bs-dropdown-link-hover-color": "#12343B",
									"--bs-dropdown-link-active-bg": "#12343B",
									"--bs-dropdown-link-active-color": "#FFFFFF",
									borderTop: "3px solid #28C3D4",
									borderRadius: 0,
									minWidth: "12rem",
								}}
							>
								{sesionActiva ? (
									<li>
										<button
											type="button"
											className="dropdown-item"
											onClick={manejarCierreSesion}
										>
											Cerrar sesión
										</button>
									</li>
								) : (
									<>
										<li>
											<Link
												to="/login"
												className="dropdown-item"
											>
												Iniciar sesión
											</Link>
										</li>
										<li>
											<Link
												to="/register"
												className="dropdown-item"
											>
												Registrarse
											</Link>
										</li>
									</>
								)}
							</ul>
						</li>
					</ul>
				</div>
			</div>
		</nav>
	);
};
