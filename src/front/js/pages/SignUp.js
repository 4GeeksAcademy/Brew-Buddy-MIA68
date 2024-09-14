import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { Link, useNavigate } from "react-router-dom";

export const SignUp = () => {
    const { store, actions } = useContext(Context);
    const [credentials, setCredentials] = useState({ email: "", password: "" });
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    function handleChange(e) {
        setCredentials({ ...credentials, [e.target.id]: e.target.value })
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const response = await actions.signUp(credentials.email, credentials.password);
            if (response.ok) {
                alert("Sign up successful. Please log in.")
                navigate("/login");
            } else {
                setErrorMessage("Sign up failed. Please try again.")
            }
        } catch (error) {
            setErrorMessage("Error occurred. Please try again at another time")
        }
    }

    return (
        <div className="container">
            <h1 className="text-center mt-5">Sign Up</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group mt-3">
                    <label>Email</label>
                    <input type="email" placeholder="email@example.com" className="form-control" id="email" value={credentials.email} onChange={handleChange} required />
                </div>
                <div className="form-group mt-3">
                    <label>Password</label>
                    <input type="text" placeholder="type password here" className="form-control" id="password" value={credentials.password} onChange={handleChange} required />
                </div>
                {/* TODO: IF EXTRA TIME CONFIRM PASSWORD AND CHANGE TYPE TO PASSWORD (SHOW OR HIDE PW, FOR LOGIN AS WELL)  */}
                {errorMessage && <div className="alert alert-danger mt-4">{errorMessage}</div>}
                <button type="submit" className="btn btn-dark mt-3">Submit</button>
            </form>
            <div className="mt-4 text-center">
                <p>Already have an account? <Link to="/login">Log in</Link></p>
            </div>
        </div >

    )
}