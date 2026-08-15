import { Link } from "react-router-dom";

export const Navbar = () => (
	<nav
		className="navbar navbar-expand-lg py-3 sticky-top"
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
			<button
				className="navbar-toggler"
				type="button"
				data-bs-toggle="collapse"
				data-bs-target="#mainNavigation"
				aria-controls="mainNavigation"
				aria-label="Abrir navegación"
			>
				<span className="navbar-toggler-icon" />
			</button>
			<div
				className="collapse navbar-collapse"
				id="mainNavigation"
			>
				<ul className="navbar-nav ms-auto align-items-lg-center gap-lg-4">
					<li className="nav-item">
						<a
							className="nav-link"
							href="#destinos"
							style={{ color: "#D4F0F5" }}
						>
							Explorar
						</a>
					</li>
					<li className="nav-item">
						<a
							className="nav-link"
							href="#accesos"
							style={{ color: "#D4F0F5" }}
						>
							Mis viajes
						</a>
					</li>
					<li className="nav-item">
						<a
							className="nav-link"
							href="#footer"
							style={{ color: "#D4F0F5" }}
						>
							Favoritos
						</a>
					</li>
					<li className="nav-item">
						<Link
							to="/dev"
							className="nav-link fw-semibold"
							style={{ color: "#28C3D4" }}
						>
							DEV
						</Link>
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
						<ul className="dropdown-menu dropdown-menu-end border-0 shadow-sm mt-2">
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
						</ul>
					</li>
				</ul>
			</div>
		</div>
	</nav>
);
