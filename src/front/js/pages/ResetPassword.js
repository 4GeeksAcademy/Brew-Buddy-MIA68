import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom"


export const ResetPassword = () => {
    const [error, setErrMsg] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const { token } = useParams()
    const navigate = useNavigate()


    async function handleSubmit(event) {
        event.preventDefault();

        if (password === confirmPassword) {
            fetch(process.env.BACKEND_URL + "/api/reset_password", {
                method: "PUT",
                headers: { 'Content-Type': "application/json" },
                body: JSON.stringify({
                    // email: email,
                    password: password,
                    secret: token
                })
            }).then(response => {
                if (response.status === 200) {
                    console.log("response", response.message)
                    alert("You have successfully reset your password. Please log in.")
                    navigate('/login')
                } else if (response.status === 400) {
                    return response.json().then(data => {
                        throw new Error(data.message || "Password is not provided");
                    });
                } else {
                    throw new Error("Something went wrong with the server.");
                }
            }).catch(error => {
                setErrMsg(error.message);
            });
        }
    }

    return (
        <div className="container">
            <form onSubmit={handleSubmit}>
                <div>
                    <h1 className="text-center mt-5">Reset Password</h1>
                    <div className="mb-3">
                        <label className="form-label" htmlFor="password">New Password</label>
                        <input onChange={(e) => {
                            setPassword(e.target.value)
                        }} className="form-control" id="password" type="password" placeholder="new password" />
                    </div>
                    <div className="mb-3">
                        <label className="form-label" htmlFor="confirm_password">Confirm New Password</label>
                        <input onChange={(e) => {
                            setConfirmPassword(e.target.value)
                        }} className="form-control" id="confirm_password" type="password" placeholder="please confirm your new password" />
                    </div>
                </div>
                <div className="col-auto">
                    {error && error.length && <div className="alert alert-danger" role="alert">{error}</div>}
                    <button type="submit" className="btn btn-dark my-4">Submit</button>
                </div>
            </form>
        </div>
    );
};