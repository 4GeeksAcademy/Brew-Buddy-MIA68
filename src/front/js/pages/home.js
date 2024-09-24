import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import brewbuddyimg from "../../img/DALL·E 2024-08-18.png"
import "../../styles/home.css";
import { BreweryCard } from "../component/BootstrapCard";
import { BreweryRouteCard } from "../component/BootstrapCardRoute";
import Modal from "../component/searchModal";
import { Link } from "react-router-dom";
import HomeLogo1 from "../../img/HomeLogo1.png"
import AgeVerificationPic2 from "../../img/AgeVerificationPic2.webp"
import background1 from "../../img/DALL·E 2024-09-04.webp"

export const Home = () => {
	const { store, actions } = useContext(Context);
	const [showAgeVerification, setShowAgeVerification] = useState(true);

	useEffect(() => {
		actions.getBreweryReviewsFromBackend()
	}, []); // Empty array ensures it runs only once

	const eachBrewery = store.breweryData.map((breweryData, index) => (
		<div className="col-12 col-md-6 col-lg-4 mb-4" key={index}>
			<BreweryCard breweryData={breweryData} />
		</div>
	));

	const handleAgeVerification = (isOver21) => {
		if (isOver21) {
			setShowAgeVerification(false);
		} else {
			// Redirect to Google if user is not 21 or older
			window.location.href = "https://www.google.com/";
		}
	};

	// useEffect(() => {
	// 	actions.fetchBreweryInfoTEST().then(journey => {
	// 		console.log("Active Route:", journey.getActiveRoute());
	// 		console.log("Total Travel Time:", journey.getTotalTravelTime(), "minutes");
	// 		console.log("Total Miles:", journey.getTotalMiles(), "miles");
	// 	});
	// }, []);

	return (
		<div className="home-container">
			<img src={background1} alt="Background" className="background-image" />
			<Link to="/search" className="full-page-link">
				<div className="content">
					<div className="homepage-section">
						<div className="left-section">
							<img src={HomeLogo1} className="home-logo-img" alt="BrewBuddy Logo" />
						</div>
						<div className="right-section">
							<div className="text-box">
								<h2>Welcome to BrewBuddy!</h2>
								<p>Discover your next favorite brewery and explore exciting beer routes curated just for you!</p>
							</div>
						</div>
					</div>
				</div>
			</Link>

			{showAgeVerification && (
				<div
					style={{
						position: "fixed",
						top: 0,
						left: 0,
						width: "100%",
						height: "100%",
						backgroundColor: "rgba(0, 0, 0, 0.5)",
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						zIndex: 1000,
					}}
				>
					<div className="age-verification-popup">
						<div className="image-section">
							<img src={AgeVerificationPic2} alt="Age Verification Logo" />
						</div>
						<div className="text-section">
							<h2>Age Verification</h2>
							<p>Are you 21 or older?</p>
							<div>
								<button
									onClick={() => handleAgeVerification(true)}
									className="age-verification-button"
								>
									Yes
								</button>
								<button
									onClick={() => handleAgeVerification(false)}
									className="age-verification-button"
								>
									No
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};