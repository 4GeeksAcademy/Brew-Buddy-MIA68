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

export const Search = () => {
	const { store, actions } = useContext(Context);

	const eachBrewery = store.breweryData.map((breweryData, index) => (
		<BreweryCard key={index} breweryData={breweryData} />
	))

	return (
		<div className="home-container">
            <img src={background1} alt="Background" className="background-image" />
            <div className="content">
				<div className="text-center mt-5">
					<img src={HomeLogo1} />
					<div className="my-2">
						< Modal />
					<div className="container">
						<div className="row">
							{eachBrewery}
						</div>
					</div>
					</div>
				</div>
			</div>
		</div>
	);
};