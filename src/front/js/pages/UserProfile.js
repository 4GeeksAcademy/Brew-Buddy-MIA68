import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";
import { Cloudinary } from '@cloudinary/url-gen';
import { AdvancedImage } from '@cloudinary/react';
import { fill } from '@cloudinary/url-gen/actions/resize';

export const UserProfile = () => {
    const { store, actions } = useContext(Context);
    const [userInfo, setUserInfo] = useState(null);
    const [pointHistory, setPointHistory] = useState([]);
    const [imageFile, setImageFile] = useState(null);

    const cld = new Cloudinary({ cloud: { cloudName: 'dprmqr54a' } });

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

    const handleImageChange = (event) => {
        setImageFile(event.target.files[0]);
    };

    const handleImageUpload = async () => {
        if (!imageFile) return;

        const formData = new FormData();
        formData.append('file', imageFile);

        try {
            const response = await fetch(`${process.env.BACKEND_URL}/api/upload_profile_image`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${store.token}` },
                body: formData
            });
            if (response.ok) {
                const data = await response.json();
                setUserInfo({ ...userInfo, profileImage: data.image_url });
                setImageFile(null);
            }
        } catch (error) {
            console.error("Error uploading image:", error);
        }
    };

    return (
        <div className="container mt-4">
            {userInfo && (
                <>
                    <h1>Hello and welcome {userInfo.email}!</h1>
                    <p>You have {userInfo.points} points. Congratulations!</p>
                    {userInfo.profileImage && (
                        <AdvancedImage
                        cldImg={cld.image(userInfo.profile_image_id || 'default_profile_image').resize(fill().width(200).height(200))}
                        alt="Profile"
                        />
                    )}
                    <div className="mt-3">
                    <input type="file" accept="image/*" onChange={handleImageChange} />
                    <button onClick={handleImageUpload} className="btn btn-primary mt-2">Upload Profile Picture</button>
                </div>
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
            <div className="mt-5"><Link to="/forgot-password">Change My Password</Link></div>
        </div>
    );
};