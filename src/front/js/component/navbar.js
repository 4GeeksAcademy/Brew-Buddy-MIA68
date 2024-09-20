import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { Link, useNavigate } from "react-router-dom";
import BBLogo from "../../img/BB-Logo.jpg"
import "../../styles/navbar.css"
import { Cloudinary } from '@cloudinary/url-gen';
import HomeLogo2 from "../../img/HomeLogo2.png"

export const Navbar = () => {
	const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    const cld = new Cloudinary({ cloud: { cloudName: 'dprmqr54a' } });

    useEffect(() => {
        if (store.token) {
            actions.fetchUserInfo();
        }
    }, [store.token]);

    const handleLogout = () => {
        actions.logout();
        navigate("/");
    }

    return (
        <nav className="navbar navbar-light bg-light p-0">
            <div className="container-fluid px-3">
                <div className="logoDiv d-flex align-items-center">
                    <img id="BBLogo" src={BBLogo} alt="logo-img"></img>
                    <img src={HomeLogo2} className="home-logo" />
                </div>
                <div className="ml-auto navbarButtons d-flex align-items-center">
                    {store.token ? (
                        <>
                            <span className="me-3">Hello {store.userEmail}!</span>
                            {store.userProfileImageId && (
                                <img
                                    src={store.userProfileImageId}
                                    alt="Profile"
                                    className="rounded-circle me-3"
                                    style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                />
                            )}
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
					<Link style={{ textDecoration: "none" }} to="/">
						<button className="nav-link">Home</button>

					</Link>
				</li>
				<li className="nav-item">
					<Link style={{ textDecoration: "none" }} to="/favorites">
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
