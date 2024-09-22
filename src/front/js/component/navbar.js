import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/navbar.css";
import finalLogo2 from "../../img/finalLogo2.png";
import HomeLogo2 from "../../img/HomeLogo2.png";

export const Navbar = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

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
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark py-3">
            <div className="container-fluid d-flex justify-content-between align-items-center">
                {/* Logo section */}
                <Link to="/" className="navbar-brand d-flex align-items-center">
                    <img id="BBLogo" src={HomeLogo2} alt="logo-img" className="navbar-logo" />
                    <span className="navbar-title ms-3">Brew Buddy</span>
                </Link>

                {/* Responsive toggle for mobile */}
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* Navbar links and user info */}
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <Link to="/" className="nav-link">Home</Link>
                        </li>
                        {store.token && (
                            <>
                                <li className="nav-item">
                                    <Link to="/favorites" className="nav-link">Favorites</Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/routes" className="nav-link">BYO Brewery Routes</Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/points" className="nav-link">
                                        Redeem Points
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>

                    {/* User Profile Section */}
                    <div className="d-flex align-items-center">
                        {store.token ? (
                            <>
                                <span className="text-white me-3">Hello, {store.userEmail}</span>
                                {store.userProfileImageId && (
                                    <img
                                        src={store.userProfileImageId}
                                        alt="Profile"
                                        className="rounded-circle me-3 profile-image"
                                    />
                                )}
                                <Link to="/UserProfile" className="btn btn-outline-light me-2">Profile</Link>
                                <button onClick={handleLogout} className="btn btn-danger">Log Out</button>
                            </>
                        ) : (
                            <Link to="/login">
                                <button className="btn btn-outline-light">Log In</button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>


        </nav >
    );
};