import React, { useContext } from "react";
import { Context } from "../store/appContext";
import { Link, useNavigate } from "react-router-dom";
import BBLogo from "../../img/BB-Logo.jpg"
import "../../styles/navbar.css"



export const Navbar = () => {
	const { store, actions } = useContext(Context);
	const navigate = useNavigate();

	const handleLogout = () => {
		actions.logout();
		navigate("/");
	}

	return (
		<nav className="navbar navbar-light bg-light p-0">
			<div className="container-fluid px-3">
				<div className="logoDiv d-flex align-items-center">
					<img id="BBLogo" src={BBLogo} alt="logo-img"></img>
					<h1 className="ms-3">BrewBuddy</h1>
				</div>
				<div className="ml-auto navbarButtons">
					{store.token ? (
						<>
							<span className="me-3">Hello {store.userEmail}!</span>
							<Link to="/UserProfile"><button className="btn btn-dark me-3">Profile</button></Link>
							<button onClick={handleLogout} className="btn btn-dark">Log Out</button>
						</>
					) : (
						<Link to="/login">
							<button className="btn btn-dark">Log In</button>
						</Link>
					)}
				</div>
			</div>

			<ul className="nav nav-tabs mt-2 ps-3">
				<li className="nav-item">
					<Link to="/">
						<button className="nav-link">Home</button>

					</Link>
				</li>
				<li className="nav-item">
					<Link to="/favorites">
						<button className="nav-link">Favorites</button>

					</Link>
				</li>
				<li className="nav-item">
					<a className="nav-link" href="#">Brews Near Me</a>
				</li>
				<li className="nav-item">
					<Link to="/routes" className="nav-link">
						Current Route
					</Link>
				</li>

			</ul>
		</nav >
	);
};
