import React, { useContext, useState, useCallback } from "react";
import { Context } from "../store/appContext";
import brewbuddyimg from "../../img/DALL·E 2024-08-18.png"
import "../../styles/home.css";
import { BreweryCard, JourneyCard } from "../component/BootstrapCard";
import { ReviewForm } from '../component/ReviewForm';
import "../../styles/BreweryRoute.css"
import { BreweryRouteCard } from "../component/BootstrapCardRoute";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";

// window.initMap = initMap;
const containerStyle = {
    width: '400px',
    height: '400px'
};

const initialCenter = {
    lat: -3.745,
    lng: -38.523
};
export const BreweryRoutes = () => {
    const { store, actions } = useContext(Context);
    const [selectedBrewery, setSelectedBrewery] = useState(null);
    const [center, setCenter] = useState(initialCenter);
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.GOOGLE_API_KEY
    });
    const [map, setMap] = useState(null);

    const onLoad = React.useCallback(function callback(map) {
        setMap(map);
    }, []);

    const onUnmount = React.useCallback(function callback(map) {
        setMap(null);
    }, []);

    // Function to refocus map center
    const refocusMap = (newCenter) => {
        console.log(typeof newCenter.lng + " lat " + typeof newCenter.lat)
        if (map) {
            setCenter(newCenter); // Update the center state
            map.panTo(newCenter); // Move the map to the new center
        }
    };

    const handleRefocusClick = (lat, lng) => {
        const newCenter = { lat, lng };
        refocusMap(newCenter);
    };

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


    // const journeystest = store.journey.map((journey, journeyIndex) => (
    //     <div key={journeyIndex}>
    //         <h2>Current Journey</h2>
    //         {journey.routes.map((route, routeIndex) => (
    //             <BreweryRouteCard key={routeIndex} breweryData={route.breweryDestination} />
    //         ))}

    //     </div>
    // ));

    // const eachBrewery = store.breweryData.map((breweryData, index) => (
    // 	<BreweryRouteCard key={index} breweryData={breweryData} />
    // ));
    return (
        <div className="text-center mt-5">
            <h1>Hello Brew Buddy!!</h1>
            <div>
                <img src={brewbuddyimg} className="home-logo-img" alt="Brew Buddy" />
            </div>
            {/* Flex container for journeys and map */}
            <div className="journey-map-container">
                <div className="journeys-section">
                    <div>
                        <h2>Current Journey</h2>
                        {store.journey.routes.map((route, routeIndex) => (
                            <JourneyCard
                                key={routeIndex}
                                breweryData={route.breweryDestination}
                                onReview={handleReview}
                                onRefocus={handleRefocusClick}
                            />
                        ))}
                    </div>
                </div>
                <div className="map-section">
                    {isLoaded ? (
                        <GoogleMap
                            mapContainerStyle={containerStyle}
                            center={center}
                            zoom={10}
                            onLoad={onLoad}
                            onUnmount={onUnmount}
                        >
                        </GoogleMap>
                    ) : null}
                </div>
            </div>

            <button onClick={actions.fetchBreweryInfo}>Fetch Brewery Info</button>

            {selectedBrewery && (
                <ReviewForm
                    brewery={selectedBrewery}
                    onSaveReview={handleSaveReview}
                />
            )}
        </div>
    )
}
