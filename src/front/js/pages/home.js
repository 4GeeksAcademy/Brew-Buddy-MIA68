import React, { useContext } from "react";
import { Context } from "../store/appContext";
import rigoImageUrl from "../../img/rigo-baby.jpg";
import brewbuddyimg from "../../img/DALL·E 2024-08-18.png"
import "../../styles/home.css";

export const Home = () => {
	const { store, actions } = useContext(Context);

	return (
		<div className="text-center mt-5">
			<h1>Hello Brew Buddy!! Ryan was here</h1>
			<p>
				<img src={brewbuddyimg} />
			</p>
			<button onClick={actions.fetchBreweryInfo}>Fetch Brewery Info</button>
			
			<p>
			</p>
		</div>
	);
};