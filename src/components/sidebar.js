import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Cookies from "universal-cookie/cjs/Cookies";
import icon1 from "../assets/images/user-icon-1.png"
import icon2 from "../assets/images/user-icon-2.png"
import icon3 from "../assets/images/user-icon-gt.png"
import iconDef from "../assets/images/user-default.png"
import {
	Collapse,
	Navbar,
	NavbarToggler,
	NavbarBrand,
	Nav,
	NavItem,
  } from 'reactstrap';

const cookies = new Cookies()

const Sidebar = () => {
	const [isReadyForInstall, setIsReadyForInstall] = React.useState(false);
	const [collapsed, setCollapsed] = useState(true);
	const toggleNavbar = () => setCollapsed(!collapsed);

	useEffect(() => {
		window.addEventListener("beforeinstallprompt", (event) => {
			// Prevent the mini-infobar from appearing on mobile.
			event.preventDefault();
			console.log("👍", "beforeinstallprompt", event);
			// Stash the event so it can be triggered later.
			window.deferredPrompt = event;
			// Remove the 'hidden' class from the install button container.
			setIsReadyForInstall(true);
		});
	}, []);

	async function downloadApp() {
		console.log("👍", "butInstall-clicked");
		const promptEvent = window.deferredPrompt;
		if (!promptEvent) {
			// The deferred prompt isn't available.
			console.log("oops, no prompt event guardado en window");
			return;
		}
		// Show the install prompt.
		promptEvent.prompt();
		// Log the result
		const result = await promptEvent.userChoice;
		console.log("👍", "userChoice", result);
		// Reset the deferred prompt variable, since
		// prompt() can only be called once.
		window.deferredPrompt = null;
		// Hide the install button.
		setIsReadyForInstall(false);
	}

	const menuItems = [
		{
			text: "Inicio",
			icon: "bx bx-home",
			path: "/dashboard",
			minUserLevel: 1,
		},
		{
			text: "Compras",
			icon: "bx bx-shopping-bag",
			path: "/Compras",
			minUserLevel: 2
		},
		{
			text: "Ventas",
			icon: "bx bx-store",
			path: "/ventas",
			minUserLevel: 1
		},
		{
			text: "Clientes",
			icon: "bx bx-book-alt",
			path: "/clientes",
			minUserLevel: 1
		},
		{
			text: "Proveedores",
			icon: "bx bx-line-chart",
			path: "/proveedores",
			minUserLevel: 2
		},
		{
			text: "Inventario",
			icon: "bx bx-book-content",
			path: "/inventario",
			minUserLevel: 2
		},
		{
			text: "Usuarios",
			icon: "bx bxs-user-detail",
			path: "/usuarios",
			minUserLevel: 3
		},
		{
			text: "Mantenimiento",
			icon: "bx bx-key",
			path: "/mantenimiento",
			minUserLevel: 1
		},
		{
			text: "Ayuda",
			icon: "bx bx-help-circle",
			path: "/ayuda",
			minUserLevel: 1
		},
	];

	const isAuth = (cookies.get('id')) ? true : false

	const userData = {
		username: isAuth ? cookies.get("username") : "noCurrentUser",
		nombre: isAuth ? cookies.get("nombre") : "Nombre del Usuario",
		idCargo: isAuth ? cookies.get("cargo").id : 0,
		cargo: isAuth ? cookies.get("cargo").nombre : "Cargo",
		icon: isAuth
			? cookies.get("cargo").id === 1
				? icon1
				: cookies.get("cargo").id === 2
					? icon2
					: cookies.get("cargo").id === 3
						? icon3
						: iconDef
			: iconDef
	};


	const cerrarSesion = () => {
		cookies.remove('id', { path: "/" })
		cookies.remove('nombre', { path: "/" })
		cookies.remove('username', { path: "/" })
		cookies.remove('cedula', { path: "/" })
		cookies.remove('fechaNacimiento', { path: "/" })
		cookies.remove('correo', { path: "/" })
		cookies.remove('estadoActivo', { path: "/" })
		cookies.remove('cargo', { path: "/" })
		window.location.href = "/login"
	}
	

	return (
		<div>
			<Navbar color="faded" light>
				<NavbarBrand href="/" className="me-auto">
					Sysprop
				</NavbarBrand>
				<NavbarToggler onClick={toggleNavbar} className="me-2" />
					<Collapse isOpen={!collapsed} navbar>
						<Nav navbar>
							<NavItem>
								{menuItems.map(({ text, icon, path, minUserLevel }) => (
								(userData.idCargo >= minUserLevel) &&
									<div className="menu-item-container">
										<Link
											className="menu-item fw-semibold"
											to={path}
										>
												<i className={icon} />
											<p> {text}</p>
										</Link>
									</div>
								))}
							</NavItem>
							<NavItem>
							<div >
								<Link to="/login" className="menu-item" onClick={cerrarSesion}>
									<i className="logout-icon bx bx-log-out" />
									<p>Cerrar Sesión </p>
								</Link>
								{isReadyForInstall && 
									<div className="menu-item btn-download" onClick={downloadApp}>
										 <i className='logout-icon bx bx-download'></i>
										 <p>Descargar App</p>
									</div>
								}
							</div>
							</NavItem>
						</Nav>
					</Collapse>
			</Navbar>
		</div>
	);
};

export default Sidebar;