import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";
import { BeerCard } from "../component/beerCard";

export const Brewery = () => {
    const { store, actions } = useContext(Context);
    const [breweryName, setBreweryName] = useState("");
    const [beerNameValue, setBeerNameValue] = useState("");
    const [flavorValue, setFlavorValue] = useState("")
    const [typeValue, setTypeValue] = useState("")
    const [ABVValue, setABVValue] = useState("")

    const currentUrl = window.location.href;
    const url = new URL(currentUrl);
    const pathSegments = url.pathname.split('/');
    const dynamicId = pathSegments[pathSegments.length - 1];

    const handleAddingNewBeer = () => {
        const name = beerNameValue
        const flavor = flavorValue
        const type = typeValue
        const ABV = ABVValue
        
    }

    const fetchBreweryName = async () => {
        try {
            const response = await fetch(`https://api.openbrewerydb.org/v1/breweries/${dynamicId}`)
            const data = await response.json()
            setBreweryName(data.name)
        }
        catch {
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
            <div className="container">
                <div className="d-flex">
                    <div className="container row col-8">
                        {eachBeer}
                    </div>
                    <div className="col-4">
                        <div className="d-flex">
                            <h2 className="mx-auto">Add a New Brew</h2>
                        </div>
                        <div>
                            <label htmlFor="beerName">Name:</label>
                            <input type="text" id="beerName" name="beerName" onChange={e => setBeerNameValue(e.target.value)} />
                        </div>
                        <div>
                            <label htmlFor="typeInput">Type:</label>
                            <input type="text" id="typeInput" name="typeInput" onChange={e => setTypeValue(e.target.value)} />
                        </div>
                        <div>
                            <label htmlFor="ABVInput">ABV:</label>
                            <input type="text" id="ABVInput" name="ABVInput" onChange={e => setABVValue(e.target.value)} />
                        </div>
                        <div>
                            <label htmlFor="flavorInput">Flavor:</label>
                            <input type="text" id="flavorInput" name="flavorInput" onChange={e => setFlavorValue(e.target.value)} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}