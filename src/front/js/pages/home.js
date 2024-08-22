import React, { useContext } from "react";
import { Context } from "../store/appContext";
import rigoImageUrl from "../../img/rigo-baby.jpg";
import brewbuddyimg from "../../img/DALL·E 2024-08-18.png"
import "../../styles/home.css";
import { BreweryCard } from "../component/BootstrapCard";

export const Home = () => {
	const { store, actions } = useContext(Context);
	const eachBrewery = store.breweryData.map((breweryData, index) => (
		<BreweryCard key={index} breweryData={breweryData} />
	))
	return (
		<div className="text-center mt-5">
			<h1>Hello Brew Buddy!!</h1>
			<p>
				<img src={brewbuddyimg} />
				{eachBrewery}
			</p>
			<button onClick={actions.fetchBreweryInfo}>Fetch Brewery Info</button>
			
			<p>
			</p>
		</div>
	);
};