import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate, useParams } from "react-router-dom";

export const ForgotPassword = () => {
    const { store } = useContext(Context);
    const [hasToken, setHasToken] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setErrMsg] = useState('');
    const { token: resetToken } = useParams();
    const navigate = useNavigate();
    const jwtToken = store.token;

    useEffect(() => {
        if (resetToken) {
            setHasToken(true);
        } else if (jwtToken) {
            setHasToken(true);
        }
    }, [resetToken, jwtToken]);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function validateEmail(email) {
        return emailRegex.test(email);
    }

    const handleEmailChange = (event) => {
        const enteredEmail = event.target.value;
        setEmail(enteredEmail);
        if (validateEmail(enteredEmail)) {
            setErrMsg("");
        }
    };

    async function handleSubmit(event) {
        event.preventDefault();

        if (!hasToken) {
            if (!validateEmail(email)) {
                setErrMsg("Please enter a valid email.");
                return;
            }
            try {
                const response = await fetch(process.env.BACKEND_URL + "/api/forgot_password", {
                    method: "POST",
                    headers: { 'Content-Type': "application/json" },
                    body: JSON.stringify({ email: email.toLowerCase() })
                });
                if (response.ok) {
                    alert("An email has been sent to reset your password.");
                    setTimeout(() => navigate('/login'), 3000);
                } else {
                    const data = await response.json();
                    setErrMsg(data.message || "Something went wrong.");
                }
            } catch (error) {
                setErrMsg(error.message);
            }
        } else {
            if (password !== confirmPassword) {
                setErrMsg("Passwords do not match.");
                return;
            }

            try {
                const requestBody = {
                    password: password,
                };

                let url = process.env.BACKEND_URL + "/api/profile/change_password";
                const headers = { 'Content-Type': "application/json" };

                if (resetToken) {
                    requestBody.secret = resetToken;
                    url = process.env.BACKEND_URL + "/api/reset_password";
                } else if (jwtToken) {
                    headers['Authorization'] = "Bearer " + sessionStorage.getItem("token");
                }

                const response = await fetch(url, {
                    method: "PUT",
                    headers: headers,
                    body: JSON.stringify(requestBody)
                });

                if (response.ok) {
                    alert("Password successfully changed.");
                    navigate('/');
                } else {
                    const data = await response.json();
                    setErrMsg(data.message || "Something went wrong.");
                }
            } catch (error) {
                setErrMsg(error.message);
            }
        }
    }

    return (
        <div className="container">
            <form onSubmit={handleSubmit}>
                {!hasToken ? (
                    <div className="container">
                        <h1 className="text-center mt-5">Forgot Password</h1>
                        <div className="form-group mt-3">
                            <label className="form-label" htmlFor="email">Email</label>
                            <input type="email" placeholder="email@example.com" className="form-control" id="email" onChange={handleEmailChange} required />
                        </div>
                    </div>
                ) : (
                    <div className="container">
                        <h1 className="text-center mt-5">Reset Password</h1>
                        <div className="mb-3">
                            <label className="form-label" htmlFor="password">New Password</label>
                            <input onChange={(e) => setPassword(e.target.value)} className="form-control" id="password" type="password" placeholder="New Password" required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label" htmlFor="confirm_password">Confirm New Password</label>
                            <input onChange={(e) => setConfirmPassword(e.target.value)} className="form-control" id="confirm_password" type="password" placeholder="Confirm Password" required />
                        </div>
                    </div>
                )}
                <div className="container col-auto">
                    {error && <div className="alert alert-danger mt-3" role="alert">{error}</div>}
                    <button type="submit" className="btn btn-dark mt-4">Submit</button>
                </div>
            </form>
        </div>
    );
};
