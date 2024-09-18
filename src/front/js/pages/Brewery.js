import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";
import { BeerCard } from "../component/beerCard";

export const Brewery = () => {
    const { store, actions } = useContext(Context);
    const [breweryName, setBreweryName] = useState("");
    const [beerNameValue, setBeerNameValue] = useState("");
    const [flavorValue, setFlavorValue] = useState("");
    const [typeValue, setTypeValue] = useState("");
    const [ABVValue, setABVValue] = useState("");
    const [addingFailed, setAddingFailed] = useState(false)

    const currentUrl = window.location.href;
    const url = new URL(currentUrl);
    const pathSegments = url.pathname.split('/');
    const dynamicId = pathSegments[pathSegments.length - 1];

    const handleAddingNewBeer = () => {
        const name = beerNameValue
        const flavor = flavorValue
        const type = typeValue
        const ABV = ABVValue
        const brewery = dynamicId
        if (name != "" && flavor != "" && type != "" && ABV != "") {
            actions.addNewBeer(name, flavor, type, ABV, brewery)
            location.reload();
        } else { console.log("missing information")
            setAddingFailed(true)
        }
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
                    <div className="col-4 mx-2">
                        <div className="d-flex">
                            <h2 className="mx-auto">Can't Find Your Brew?</h2>
                        </div>
                        <div className="d-flex">
                            <h4 className="mx-auto">Add a New Brew</h4>
                        </div>
                        <div className="d-flex">
                            <div>
                                <label htmlFor="beerName">Name:</label>
                                <input type="text" id="beerName" name="beerName" onChange={e => setBeerNameValue(e.target.value)} required />
                            </div>
                            <div>
                                <label htmlFor="typeInput">Type:</label>
                                <select className="mx-2" onChange={e => setTypeValue(e.target.value)}>
                                    <option value="">Select Type</option>
                                    <option value="Altbier">Altbier</option>
                                    <option value="Amber ale">Amber ale</option>
                                    <option value="Barley wine">Barley wine</option>
                                    <option value="Berliner Weisse">Berliner Weisse</option>
                                    <option value="Bière de Garde">Bière de Garde</option>
                                    <option value="Bitter">Bitter</option>
                                    <option value="Blonde Ale">Blonde Ale</option>
                                    <option value="Bock">Bock</option>
                                    <option value="Brown ale">Brown ale</option>
                                    <option value="California Common">California Common</option>
                                    <option value="Cream Ale">Cream Ale</option>
                                    <option value="Dortmunder">Dortmunder</option>
                                    <option value="Doppelbock">Doppelbock</option>
                                    <option value="Dunkel">Dunkel</option>
                                    <option value="Dunkelweizen">Dunkelweizen</option>
                                    <option value="Eisbock">Eisbock</option>
                                    <option value="Flanders red ale">Flanders red ale</option>
                                    <option value="Summer ale">Summer ale</option>
                                    <option value="Gose">Gose</option>
                                    <option value="Gueuze">Gueuze</option>
                                    <option value="Hefeweizen">Hefeweizen</option>
                                    <option value="Helles">Helles</option>
                                    <option value="IPA">IPA</option>
                                    <option value="Kölsch">Kölsch</option>
                                    <option value="Lager">Lager</option>
                                    <option value="Lambic">Lambic</option>
                                    <option value="Light ale">Light ale</option>
                                    <option value="Maibock">Maibock</option>
                                    <option value="Malt liquor">Malt liquor</option>
                                    <option value="Mild ale">Mild ale</option>
                                    <option value="Oktoberfestbier">Oktoberfestbier</option>
                                    <option value="Old ale">Old ale</option>
                                    <option value="Oud bruin">Oud bruin</option>
                                    <option value="Pale ale">Pale ale</option>
                                    <option value="Pilsner">Pilsner</option>
                                    <option value="Porter">Porter</option>
                                    <option value="Red ale">Red ale</option>
                                    <option value="Roggenbier">Roggenbier</option>
                                    <option value="Saison">Saison</option>
                                    <option value="Scotch ale">Scotch ale</option>
                                    <option value="Stout">Stout</option>
                                    <option value="Schwarzbier">Schwarzbier</option>
                                    <option value="Vienna lager">Vienna lager</option>
                                    <option value="Witbier">Witbier</option>
                                    <option value="Weissbier">Weissbier</option>
                                    <option value="Weizenbock">Weizenbock</option>

                                </select>
                            </div>
                        </div>
                        <div className="d-flex">
                            <div>
                                <label htmlFor="ABVInput">ABV:</label>
                                <input type="number" id="ABVInput" name="ABVInput" onChange={e => setABVValue(e.target.value)} required step=".1" />
                            </div>
                            <div>
                                <label htmlFor="flavorInput">Flavor:</label>
                                <input type="text" id="flavorInput" name="flavorInput" onChange={e => setFlavorValue(e.target.value)} required />
                            </div>
                        </div>
                        <div>
                            {addingFailed 
                            ? <p className="color-danger">Please fill all fields</p>
                            : null
                            }
                        </div>
                        <div className="d-flex my-4">
                            <button onClick={handleAddingNewBeer} className="mx-auto">Add New Beer</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}