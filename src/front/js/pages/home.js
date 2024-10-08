import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import brewbuddyimg from "../../img/DALL·E 2024-08-18.png"
import "../../styles/home.css";
import { BreweryCard } from "../component/BootstrapCard";
import { BreweryRouteCard } from "../component/BootstrapCardRoute";
import Modal from "../component/searchModal";
import { Link } from "react-router-dom";
import HomeLogo1 from "../../img/HomeLogo1.png"

export const Home = () => {
	const { store, actions } = useContext(Context);

	const eachBrewery = store.breweryData.map((breweryData, index) => (
		<BreweryCard key={index} breweryData={breweryData} />
	))
	// useEffect(() => {
	// 	actions.fetchBreweryInfoTEST().then(journey => {
	// 		console.log("Active Route:", journey.getActiveRoute());
	// 		console.log("Total Travel Time:", journey.getTotalTravelTime(), "minutes");
	// 		console.log("Total Miles:", journey.getTotalMiles(), "miles");
	// 	});
	// }, []);

	return (
		<div className="text-center mt-5">
			<h1>Hello Brew Buddy!!</h1>
			{/* EJQ - Commented out the logo to put a new homepage logo*/}
			{/* <img src={brewbuddyimg} className="home-logo-img" /> */}
			<img src={HomeLogo1} />
			<div className="my-2">
				<button onClick={actions.toggleSearch}>Search</button>

				< Modal />

				{eachBrewery}
			</div>
			<button onClick={actions.fetchBreweryInfoTEST}>Fetch Brewery Info</button>
			{/* <div className="mt-5"><Link to="/forgot-password">Change My Password</Link></div> */}
		</div>
	);
};