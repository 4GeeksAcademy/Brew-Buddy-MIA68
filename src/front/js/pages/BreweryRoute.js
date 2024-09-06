import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import brewbuddyimg from "../../img/DALL·E 2024-08-18.png"
import "../../styles/home.css";
import { BreweryCard, JourneyCard } from "../component/BootstrapCard";
import { ReviewForm } from '../component/ReviewForm';
import "../../styles/BreweryRoute.css"

// let map;
// function myMap() {
//     const map = new google.maps.Map(document.getElementById("map"), {
//         center: { lat: 18.4726, lng: 73.8860 },
//         zoom: 18,
//         map_id: "9d5da663bf6a2624"
//     });
// }
// async function initMap() {
//     console.log("Maps JavaScript API loaded.");
// }

// window.initMap = initMap;
export const BreweryRoutes = () => {
    const { store, actions } = useContext(Context);
    const [selectedBrewery, setSelectedBrewery] = useState(null);

    const handleReview = (brewery) => {
        setSelectedBrewery(brewery);
    }
    const handleSaveReview = (brewery, overallRating, reviewText, isFavoriteBrewery, beerReviews) => {
        actions.addBreweryReview(brewery, overallRating, reviewText, isFavoriteBrewery, beerReviews);
        setSelectedBrewery(null); //hide the form after saving the review
    }
    // const breweryRoute = store.routes.map((brewery, index) => (
    //     <BreweryCard key={index} breweryData={brewery} />
    // ))
    // const breweryRoute = store.routes.map((route, index) => (
    //     <BreweryCard key={index} breweryData={route.breweryDestination} />
    // ));
    const journeys = store.journey.map((journey, journeyIndex) => (
        <div key={journeyIndex}>
            <h2>Current Journey</h2>
            {journey.routes.map((route, routeIndex) => (
                <JourneyCard key={routeIndex} breweryData={route.breweryDestination} onReview={handleReview} />
            ))}
        </div>
    ));
    return (
        <div className="text-center mt-5">
            <h1>Hello Brew Buddy!!</h1>
            <div>
                <img src={brewbuddyimg} />
                {/* {breweryRoute} */}
            </div>
            <div>
                {journeys}
            </div>

            <button onClick={actions.fetchBreweryInfo}>Fetch Brewery Info</button>
            {selectedBrewery && (
                <ReviewForm
                    brewery={selectedBrewery}
                    onSaveReview={handleSaveReview}
                />
            )}
            {/* <div id="map">
                {myMap}
                
            </div> */}
        </div>
    )

}
