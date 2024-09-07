import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";
import { BeerCard } from "../component/beerCard";

export const Brewery = () => {
	const { store, actions } = useContext(Context);

    const currentUrl = window.location.href;
    const url = new URL(currentUrl);
    const pathSegments = url.pathname.split('/');
    const dynamicId = pathSegments[pathSegments.length - 1];

    useEffect(() => {
        actions.getBreweryBeers(dynamicId)
    }, []);

    const eachBeer = store.beerData.map((beerData, index) => (
		<BeerCard key={index} beerData={beerData} />
	))
    // add beer info
	return (
        <h1>
            {eachBeer}
        </h1>
    )
}