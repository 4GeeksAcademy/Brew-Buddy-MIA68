import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { Link, useNavigate } from "react-router-dom";

export const Login = () => {
    const { store, actions } = useContext(Context);
    const [credentials, setCredentials] = useState({ email: "", password: "" });
    const navigate = useNavigate();

    function handleChange(e) {
        setCredentials({ ...credentials, [e.target.id]: e.target.value })
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        await actions.login(credentials.email, credentials.password);
        navigate("/");

    }

    return (
        <div className="container">
            <h1 className="text-center mt-5">Log-In</h1>
            <form onSubmit={handleLogin}>
                <div className="form-group mt-3">
                    <label>Email</label>
                    <input type="email" placeholder="email@example.com" className="form-control" id="email" value={credentials.email} onChange={handleChange} required />
                </div>
                <div className="form-group mt-3">
                    <label>Password</label>
                    <input type="text" placeholder="type password here" className="form-control" id="password" value={credentials.password} onChange={handleChange} required />
                </div>
                <button type="submit" className="btn btn-dark mt-3">Submit</button>
            </form>
            <div className="mt-4 text-center">
                <Link to="/sign-up">Click here to sign up</Link>
            </div>

        </div>

    )
}