import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import brewbuddyimg from "../../img/DALL·E 2024-08-18.png"
import "../../styles/home.css";
import { BreweryCard } from "../component/BootstrapCard";
import { BreweryRouteCard } from "../component/BootstrapCardRoute";
import Modal from "../component/searchModal";
import { Link } from "react-router-dom";
import HomeLogo1 from "../../img/HomeLogo1.png"
import AgeVerificationPic1 from "../../img/AgeVerificationPic1.webp"
import background1 from "../../img/DALL·E 2024-09-04.webp"

export const Home = () => {
	const { store, actions } = useContext(Context);
	const [showAgeVerification, setShowAgeVerification] = useState(false);

	useEffect(() => {
		// Check sessionStorage to see if the user has already verified their age
		const ageVerified = sessionStorage.getItem("over20");
		if (!ageVerified) {
			setShowAgeVerification(true);
		}
		actions.getBreweryReviewsFromBackend();
	}, []); // Empty array ensures it runs only once

	const eachBrewery = store.breweryData.map((breweryData, index) => (
		<div className="col-12 col-md-6 col-lg-4 mb-4" key={index}>
			<BreweryCard breweryData={breweryData} />
		</div>
	));

	const handleAgeVerification = (isOver21) => {
		if (isOver21) {
			setShowAgeVerification(false);
			actions.verifyAge()
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
			<div className="content">
				<div className="text-center mt-5">
					<h1 className="text-light">Find your brewery today! Cheers!</h1>
					{/* EJQ - Commented out the logo to put a new homepage logo */}
					{/* <img src={brewbuddyimg} className="home-logo-img" /> */}
					<img src={HomeLogo1} />
					<div className="my-2">
						<button onClick={actions.toggleSearch}>Search</button>
						<Modal />
					</div>

					{/* Bootstrap grid for the cards */}
					<div className="container">
						<div className="row">
							{eachBrewery}
						</div>
					</div>

					<button onClick={actions.fetchBreweryInfoTEST}>Fetch Brewery Info</button>
				</div>
			</div>
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
						<img src={AgeVerificationPic1} alt="Age Verification Logo" />
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