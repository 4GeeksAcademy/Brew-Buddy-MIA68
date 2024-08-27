import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";

export const UserProfile = () => {
    const { store, actions } = useContext(Context);
    const [userInfo, setUserInfo] = useState(null);
    const [pointHistory, setPointHistory] = useState([]);

    useEffect(() => {
        fetchUserInfo();
        fetchPointHistory();
    }, []);

    const fetchUserInfo = async () => {
        try {
            const response = await fetch(`${process.env.BACKEND_URL}/api/user`, {
                headers: { Authorization: `Bearer ${store.token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setUserInfo(data);
            }
        } catch (error) {
            console.error("Error fetching user info:", error);
        }
    };

    const fetchPointHistory = async () => {
        try {
            const response = await fetch(`${process.env.BACKEND_URL}/api/point_history`, {
                headers: { Authorization: `Bearer ${store.token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setPointHistory(data);
            }
        } catch (error) {
            console.error("Error fetching point history:", error);
        }
    };

    // EJQ - ADDING SKELETON CODE TO MAYBE ALLOW USERS TO UPLOAD THEIR OWN PROFILE IMAGES
    // const handleImageUpload = async (event) => {
    //     const file = event.target.files[0];
    //     const formData = new FormData();
    //     formData.append('image', file);
    
    //     try {
    //         const response = await fetch(`${process.env.BACKEND_URL}/api/upload_profile_image`, {
    //             method: 'POST',
    //             headers: { Authorization: `Bearer ${store.token}` },
    //             body: formData
    //         });
    //         if (response.ok) {
    //             const data = await response.json();
    //             // Update user info with new image URL
    //             setUserInfo({ ...userInfo, profileImage: data.imageUrl });
    //         }
    //     } catch (error) {
    //         console.error("Error uploading image:", error);
    //     }
    // };

    return (
        <div className="container mt-4">
            {userInfo && (
                <>
                    <h1>Hello and welcome {userInfo.email}!</h1>
                    <p>You have {userInfo.points} points. Congratulations!</p>
                </>
            )}
            <div className="mt-5">
                <h2>Point History</h2>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Action</th>
                            <th>Points</th>
                            <th>Timestamp</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pointHistory.map((entry, index) => (
                            <tr key={index}>
                                <td>{entry.action}</td>
                                <td>{entry.points}</td>
                                <td>{new Date(entry.timestamp).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* EJQ - insert link to reset password when the ForgotPassword page is built */}
            {/* <Link to="/ForgotPassword"><button className="btn btn-primary mt-2">Reset Password</button></Link> */}
            <div className="mt-5"><Link to="/forgot-password">Change My Password</Link></div>
            
            {/* EJQ - maybe allow users to upload their own profile pics */}
            {/* <input type="file" accept="image/*" onChange={handleImageUpload} /> */}
        </div>
    );
};