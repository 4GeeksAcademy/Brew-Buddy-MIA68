import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import brewbuddyimg from "../../img/DALL·E 2024-08-18.png"
import "../../styles/home.css";
import { BreweryCard } from "../component/BootstrapCard";

export const BreweryRoutes = () => {
    const { store, actions } = useContext(Context);

    const breweryRoute = store.routes.map((brewery, index) => (
        <BreweryCard key={index} breweryData={brewery} />
    ))

    return (
        <div className="text-center mt-5">
            <h1>Hello Brew Buddy!!</h1>
            <div>
                <img src={brewbuddyimg} />
                {breweryRoute}
            </div>

            <button onClick={actions.fetchBreweryInfo}>Fetch Brewery Info</button>
        </div>
    )

}
