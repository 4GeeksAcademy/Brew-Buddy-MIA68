import React, {useState, useEffect, useContext} from "react";
import { Context } from "../store/appContext";
import { useNavigate, Link } from "react-router-dom";

export const ForgotPassword= () => {
    const{store} = useContext(Context);

    const [ hasToken, setHasToken] = useState(false);
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setErrMsg]= useState("")
    const [confirmPassword, setConfirmPassword]= useState("")
    
    const navigate=useNavigate("");
    const token=store.token;

    useEffect(()=>{
        if (token) {
            setHasToken(true)
            console.log("token is present", token);
        } else {
            console.log("token is not available")
        }
    }, [token])

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function validateEmail(email) {
        return emailRegex.test()


        const handleEmailChange=(event)=>{
            const enteredEmail=event.target.value;
            setEmail(enteredEmail);
            if (validateEmail(enteredEmail)) {
                setErrMsg("");

            }
        };

        async function handleSubmit(event) {
            event.preventDefault();
            if (!hasToken) {
                if (!validateEmail(email)) {
                    setErrMsg("please try a valid email");
                    return;
                }
                fetch(process.env.BACKEND_URL + "/api/forgot_passord", {
                    method: "POST", 
                    headers: {"Content-Type": "application/json"}, 
                    body: JSON.stringify({
                        email: email.toLowerCase(),

                    })
                }).then(response=>{
                    if (response.status===200 {
                        console.log("email sent to reset password")
                        console.log("response", response.message)
                        alert("an email has been sent to reset your password")
                        setTimeout(()=> navigate("/login"), 30 * 1000);

                    } else if (response.status===400) {
                        return response.json().then(data => {
                            throw new Error(data.message || "incorrect email or password");
                        });
                    } else {
                        throw new Error("something went wrong with the server");
                    }
                }).catch(error => {
                    setErrMsg(error.message);
                });
            } else {
                if (password===confirmPassword) {
                    fetch(process.env.BACKEND_URL + "/api/change_password", {
                        method: "PUT", 
                        headers: {"Content-Type": "application/json"} ,
                        body: JSON.stringify({
                            password: password, 
                            secret: token
                        })
                    }).then(response => {
                        if (response.status===200) {
                            console.log("response", response.message)
                            navigate("/login")
                        } else if (response.status===400) {
                            return response.json().then(data => {
                                throw new Error(data.message || "password is not provided");
                            });
                        } else {
                        throw new Error("something went wrong with server")
                        }

                    }).catch(error=>{
                        setErrMsg(error.message);
                    });
                }
            }
        }

    }
        return (
            <div className="container">
                <form onSubmit={handleSubmit}>
                    {!hasToken &&
                        <div className="container">
                            <h1 className="text-center mt-5">Reset Password</h1>
                            <div className="form-group mt-3">
                                <label htmlFor="email" className="form-label">Email</label>
                                <input type="email" placeholder="email@example.com" className="form-control" id="email" onChange={handleEmailChange} required />
                            </div>
                        </div>
                    }
                    {hasToken&&
                    <div className="container">
                        <h1 className="text-center mt-5">Reset Password</h1>
                        <div className="mb-3">
                            <label className="form-label" htmlFor="password">New Password</label>
                            <input onChange={(e)=>{
                                setPassword(e.target.value)
                            }} className="form-control" id="password" type="password" placeholder="new password" />
                        </div>
                        <div className="mb-3">
                            <label className="form-label" htmlFor="confirm_password">Confirm New Password</label>
                            <input onChange={(e)=> {
                                setConfirmPassword(e.target.value)
                            }} className="form-control" id="confirm_password" type="password" placeholder="Please Confirm Your New Password" />
                        </div>
                    </div>
                    }
                    <div className="container col-auto">
                        {error && error.length && <div className="alert alert-danger mt-3" role="alert"> {error}</div>}
                        <button type="submit" className="btn btn-dark mt-4">Submit</button>
                    </div>
                </form>
            </div>
        )
    
}