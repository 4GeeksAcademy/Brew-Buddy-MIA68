import React, {useState, useEffect, useContext} from "react";
import { Context } from "../store/appContext"; 
import { Link, useNavigate} from "react-router-dom";

export const SignUp = () => {
    const {store, action} = useContext(Context);
    const [credentials, setCredentials] = useState({ email: "", password: ""});
    const navigate = useNavigate();

    function handleChange(e) {
        setCredentials({ ...credentials, [e.target.id]: e.target.value})
    }

    return (
        <div className="container">
            <h1 className="text-center mt-5">Sign Up</h1>
        <form>
            <div className="form-group mt-3">
                <label>Email</label>
                <input type="email" placeholder="email@example.com" className="form-control" id="email" value={credentials.email} onChange={handleChange} required />
            </div>
            <div className="form-group mt-3">
                <label>Password</label>
                <input type="email" placeholder="email@example.com" className="form-control" id="email" value={credentials.email} onChange={handleChange} required />
            </div>
        </form>
        </div>

    )
}