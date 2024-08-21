import React from "react";
import { Link } from "react-router-dom";
import BBLogo from "../../img/BB-Logo.jpg"
import "../../styles/navbar.css"

export const Navbar = () => {
	return (
		<nav className="navbar navbar-light bg-light p-0">
			<div className="container-fluid px-3">
				<div className="logoDiv d-flex align-items-center">
					<img id="BBLogo" src={BBLogo} alt="logo-img"></img>
					<h1 className="ms-3">BrewBuddy</h1>
				</div>
				<div className="ml-auto navbarButtons">
					<button className="btn btn-dark me-3">Profile</button>
					<Link to="/login">
						<button className="btn btn-dark">Log In</button>

					</Link>
				</div>
			</div>
			{/* <div className="container">
				<Link to="/">
					<span className="navbar-brand mb-0 h1">React Boilerplate</span>
				</Link>
				<div className="ml-auto">
					<Link to="/demo">
						<button className="btn btn-primary">Check the Context in action</button>
					</Link>
				</div>
			</div> */}
			<ul className="nav nav-tabs mt-2 ps-3">
				<li className="nav-item">
					<a className="nav-link active" aria-current="page" href="#">Home</a>
				</li>
				<li className="nav-item">
					<a className="nav-link" href="#">Favorites</a>
				</li>
				<li className="nav-item">
					<a className="nav-link" href="#">Brews Near Me</a>
				</li>
			
			</ul>
		</nav>
	);
};
