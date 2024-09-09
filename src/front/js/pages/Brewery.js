import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";
import { BeerCard } from "../component/beerCard";

export const Brewery = () => {
	const { store, actions } = useContext(Context);
    const [breweryName, setBreweryName] = useState("")

    const currentUrl = window.location.href;
    const url = new URL(currentUrl);
    const pathSegments = url.pathname.split('/');
    const dynamicId = pathSegments[pathSegments.length - 1];

    const fetchBreweryName = async() => {
        try {
            const response = await fetch(`https://api.openbrewerydb.org/v1/breweries/${dynamicId}`)
            const data = await response.json()
            setBreweryName(data.name)
        }
        catch{
            console.log("Brewery Name Failed to Fetch")
        }
    } 

    useEffect(() => {
        actions.getBreweryBeers(dynamicId)
        fetchBreweryName()
    }, []);

    const eachBeer = store.beerData.map((beerData, index) => (
		<BeerCard key={index} beerData={beerData} />
	))
    // add beer info
	return (
        <div className="container">
            <div className="d-flex my-4"> 
                <h1 className="mx-auto">{breweryName}</h1>
            </div>   
            <div className="container row">
                {eachBeer}
            </div>
        </div>
    )
}