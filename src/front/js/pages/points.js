import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { Reward } from "../store/flux";
import background1 from "../../img/DALL·E 2024-09-04.webp"
import "../../styles/points.css";

export const Points = () => {
    const [selectedSize, setSelectedSize] = useState("Size");
    const { store, actions } = useContext(Context);
    const [userInfo, setUserInfo] = useState([]);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [currentReward, setCurrentReward] = useState([]);
    const [userRewards, setUserRewards] = useState([{}]);

    useEffect(() => {
        actions.fetchUserInfo();
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

    
    const redeemReward = async (rewardName, rewardValue, rewardType, pointsCost) => {
        try {
            const response = await fetch(`${process.env.BACKEND_URL}/api/add_user_reward`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${store.token}`
                },
                body: JSON.stringify({
                    reward_name: rewardName,
                    reward_value: rewardValue,
                    reward_type: rewardType,
                    reward_cost: pointsCost,
                })
            });

            const result = await response.json();

            if (response.ok) {
                alert(result.message);
                fetchUserInfo();
                actions.updateUserPoints(store.userPoints - pointsCost);
            } else {
                if (result.error === 'Not enough points.') {
                    setAlertMessage('You do not have enough points to redeem this reward.');
                    setShowAlert(true);
                } else {
                    alert(result.error);
                }
            }
        } catch (error) {
            console.error("Error redeeming reward:", error);
        }
    };

    
    


    const handleSizeSelect = (size) => {
        setSelectedSize(size);
    };

    const handleSubmit = (rewardName, rewardValue, rewardType, pointsCost) => {
        redeemReward(rewardName, rewardValue, rewardType, pointsCost);
        actions.fetchUserInfo();
    };

    return (
        <div className="text-center container my-5">
            <h1 className="fw-bold">Redeem Your Points!</h1>
            <h2 className="fw-bold">Points: {store.userPoints}</h2>

            {showAlert && (
                <div style={{ color: 'red', padding: '10px', border: '1px solid red', borderRadius: '5px', marginBottom: '10px' }}>
                    {alertMessage}
                </div>
            )}

            <div className="card rewards-card-body">
                <div className="card-body">
                    <h5 className="fw-bold">$5 Off Coupon</h5>
                    <p>Take off $5 with your next purchase using this handy Brew Buddy Coupon!</p>
                    <button 
                        style={{ backgroundColor: 'green', color: 'white', padding: '10px', border: 'none', borderRadius: '5px' }}
                        onClick={() => handleSubmit(
                            'Coupon',
                            5,
                            'Coupon',
                            5,
                        )}
                    >
                        Redeem 5 Points
                    </button>
                </div>

                <div className="card-body rounded-5">
                    <h5 className="fw-bold">$10 Off Coupon</h5>
                    <p>Take off $10 with your next purchase using this handy Brew Buddy Coupon!</p>
                    <button 
                        style={{ backgroundColor: 'green', color: 'white', padding: '10px', border: 'none', borderRadius: '5px' }}
                        onClick={() => redeemReward(
                            'Coupon',
                            10,
                            'Coupon',
                            10,
                        )}
                    >
                        Redeem 10 Points
                    </button>
                </div>

                <div className="card-body">
                    <h5 className="fw-bold">Brew Buddy T-Shirt</h5>
                    <p>Show off this sweet Brew Buddy Merch!</p>

                    <div>
                        <select onChange={(e) => handleSizeSelect(e.target.value)} value={selectedSize} className="rounded-3">
                            <option value="X SMALL">X SMALL</option>
                            <option value="SMALL">SMALL</option>
                            <option value="MEDIUM">MEDIUM</option>
                            <option value="LARGE">LARGE</option>
                            <option value="X LARGE">X LARGE</option>
                        </select>
                    </div>

                    <button 
                        style={{ backgroundColor: 'green', color: 'white', padding: '10px', border: 'none', borderRadius: '5px', marginTop: '10px' }}
                        onClick={() => redeemReward(
                            'T-SHIRT',
                            25,
                            'Clothing Item',
                            25,
                        )}
                    >
                        Redeem 25 Points
                    </button>
                </div>
            </div>
        </div>
    );
};
