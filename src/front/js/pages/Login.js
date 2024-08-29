import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { Link, useNavigate } from "react-router-dom";

export const Login = () => {
    const { store, actions } = useContext(Context);
    const [credentials, setCredentials] = useState({ email: "", password: "" });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.id]: e.target.value });
    };

    // const handleLogin = async (e) => {
    //     e.preventDefault();
    //     await actions.login(credentials.email, credentials.password);
    //     navigate("/");

    // }

    // EJQ-updated handleLogin code below integrates the addition of points at login, also includes console messages to confirm whether login was successful
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const result = await actions.login(credentials.email, credentials.password);
            if (result.success) {
                // Check if points were earned
                if (result.points_earned > 0) {
                    console.log(`User earned ${result.points_earned} points for logging in.`);
                }
                // Update the global state with the new total points
                actions.updateUserPoints(result.total_points);
                navigate("/");
            } else {
                console.error("Login failed");
            }
        } catch (error) {
            console.error("Error logging in", error);
        }
    };

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