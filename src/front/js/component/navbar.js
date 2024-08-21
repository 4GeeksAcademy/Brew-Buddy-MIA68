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
				<h1 className="ms-3">Brew Buddy</h1>
				</div>
				<div className="ml-auto navbarButtons">
					<button className="btn btn-dark me-3">Profile</button>
					<button className="btn btn-dark">Log In</button>
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
		</nav>
	);
};
