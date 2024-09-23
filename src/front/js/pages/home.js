import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import brewbuddyimg from "../../img/DALL·E 2024-08-18.png"
import "../../styles/home.css";
import { BreweryCard } from "../component/BootstrapCard";
import { BreweryRouteCard } from "../component/BootstrapCardRoute";
import Modal from "../component/searchModal";
import { Link } from "react-router-dom";
import HomeLogo1 from "../../img/HomeLogo1.png"
import HomeLogo2 from "../../img/HomeLogo2.png"
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
			<div className="content">
				<div className="text-center mt-5">
					<h1 className="text-light">Find your brewery today! Cheers!</h1>
					{/* EJQ - Commented out the logo to put a new homepage logo */}
					{/* <img src={brewbuddyimg} className="home-logo-img" /> */}
					<img src={HomeLogo1} />
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
			<div
				style={{
				backgroundColor: "white",
				padding: "20px",
				borderRadius: "10px",
				width: "50%",
				maxWidth: "400px",
				textAlign: "center",
				}}
			>
            <h2>Age Verification</h2>
            <p>Are you 21 or older?</p>
            <div>
              <button
                onClick={() => handleAgeVerification(true)}
                style={{ margin: "10px", padding: "10px 20px" }}
              >
                Yes
              </button>
              <button
                onClick={() => handleAgeVerification(false)}
                style={{ margin: "10px", padding: "10px 20px" }}
              >
                No
				</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};