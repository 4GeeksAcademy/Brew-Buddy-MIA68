import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import brewbuddyimg from "../../img/DALL·E 2024-08-18.png"
import "../../styles/home.css";
import { BreweryCard } from "../component/BootstrapCard";
import Modal from "../component/searchModal";


export const Home = () => {
	const { store, actions } = useContext(Context);

	const eachBrewery = store.breweryData.map((breweryData, index) => (
		<BreweryCard key={index} breweryData={breweryData} />
	))

	return (
		<div className="text-center mt-5">
			<h1>Hello Brew Buddy!!</h1>
			<button onClick={actions.toggleSearch}>Search</button>
			<div>
				<img src={brewbuddyimg} />
				< Modal />
				{eachBrewery}
			</div>

			<button onClick={actions.fetchBreweryInfo}>Fetch Brewery Info</button>
		</div>
	);
};