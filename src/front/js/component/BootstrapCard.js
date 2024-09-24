import React, { useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";
import microIcon from '../../img/micro1.png';
import nanoIcon from '../../img/nano1.png';
import regionalIcon from '../../img/regional1.png';
import largeIcon from '../../img/large1.png';
import brewpubIcon from '../../img/brewpub1.png';
import '../../styles/JourneyCard.css'


const breweryTypeIcons = {
    micro: microIcon,
    nano: nanoIcon,
    regional: regionalIcon,
    large: largeIcon,
    brewpub: brewpubIcon
};


export const BreweryCard = (props) => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate()
    const breweryType = props.breweryData.brewery_type;
    const [currentFavorite, setCurrentFavorite] = useState(false)
    const [favoriteBrewery, setFavoriteBrewery] = useState("")

    const isLoggedIn = sessionStorage.getItem("token");

    useEffect(() => {
        if (isLoggedIn) {
            let getData = async () => {
                await actions.getFavoriteBreweries()
                for (let fav in store.favoriteBreweries) {
                    if (store.favoriteBreweries[fav].phone === props.breweryData.phone) {
                        setFavoriteBrewery(store.favoriteBreweries[fav])
                        setCurrentFavorite(true);
                        break; // exit loop once a match is found
                    }
                }
            };
            getData();
        }

    }, [])

    const handleFavBrewery = (e) => {
        e.preventDefault();
        if (isLoggedIn) {
         console.log(currentFavorite)
        if (currentFavorite == true) {
            // remove
            actions.deleteFavoriteBrewery(favoriteBrewery);
            setCurrentFavorite(false)
        } else {
            // add
            actions.addFavoriteBrewery(props.breweryData);
            alert("This Brewery has been added to your Favorites");
            setCurrentFavorite(true)
        }   
        } else {
            alert("Please login to add or remove favorites")
        }
        
    };
    const handleAddBreweryToRoute = () => {
        console.log(props.breweryData)
        actions.addToCurrentJourney(props.breweryData)
    }

    return (
        <div className="card" style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1), 0 6px 20px rgba(0, 0, 0, 0.1)" }}>
            <div className="card-body">
                <h1 className="card-title brewery-title">
                    <a href={props.breweryData.brewery_type}>
                        <img
                            src={breweryTypeIcons[breweryType]}
                            alt={`${breweryType} icon`}
                            className="brewery-icon"
                        />
                    </a>
                    {props.breweryData.name}
                </h1>
                <h5 className="card-subtitle mb-2 text-muted">
                    {props.breweryData.city}, {props.breweryData.state}
                </h5>
                <div className="brewery-buttons">
                    <button className="btn btn-primary btn-block fun-button" onClick={handleAddBreweryToRoute}>
                        Add to Route <i className="fas fa-route"></i>
                    </button>
                    <button className={`btn ${currentFavorite ? "btn-warning" : "btn-light"} btn-block fun-button`} onClick={(e) => handleFavBrewery(e)}>
                        {currentFavorite ? "Favorite" : "Add to Favorites"} <i className={currentFavorite ? "fas fa-star" : "far fa-star"}></i>
                    </button>
                </div>
                <div className="brewery-contact">
                    <a href={`tel:${props.breweryData.phone}`} className="btn btn-info btn-block fun-button">
                        Call <i className="fas fa-phone"></i>
                    </a>
                    <a href={props.breweryData.website_url} target="_blank" rel="noopener noreferrer" className="btn btn-success btn-block fun-button">
                        Visit Website <i className="fas fa-external-link-alt"></i>
                    </a>
                </div>
                <div className="brewery-extras mt-3">
                    <Link to={`/brewery/${props.breweryData.id}`} className="btn btn-secondary fun-button">
                        See Brews <i className="fas fa-beer"></i>
                    </Link>
                    <Link to={`/brewery_reviews/${props.breweryData.id}`} className="btn btn-secondary fun-button" onClick={() => actions.getReviewsOnFrontEnd(props.breweryData.id)}>
                        Check Reviews <i className="fas fa-comments"></i>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export const JourneyCard = ({ breweryData, onReview, onRefocus }) => {
    const { store } = useContext(Context);

    return (
        <div className="journey-card fun-card">
            <div className="journey-card-header">
                <h5 className="brewery-name">{breweryData.name}</h5>
            </div>
            <div className="journey-card-body">
                <p className="info-text">🚗 Travel Time: {store.journey.routes[0].travelTime} Minutes</p>
                <p className="info-text">📍 Distance: {store.journey.routes[0].miles} Miles</p>
                <div className="card-actions">
                    <button className="review-button" onClick={() => onReview(breweryData)}>
                        ⭐ Add Review
                    </button>
                    <button className="navigate-button" onClick={() => onRefocus(breweryData.latitude, breweryData.longitude)}>
                        🎯 Navigate
                    </button>
                </div>
            </div>
        </div>
    );
};

export const ReviewCard = (props) => {
    const { review, reviewNumber } = props;
    return (
        <div className="card mb-3">
            <h5 className="card-header">{review.brewery_name} - Review #{reviewNumber}</h5>
            <div className="card-body">
                <h5 className="card-title">Overall Rating: {review.overall_rating}</h5>
                <p className="card-text">{review.review_text}</p>

                {/* Favorite Brewery Indicator */}
                {review.is_favorite_brewery && (
                    <p className="text-success">🌟 This is a favorite brewery!</p>
                )}

                <h6>Beers Reviewed:</h6>
                <ul className="list-group">
                    {review.beer_reviews.map((beerReview, index) => (
                        <li className="list-group-item" key={index}>
                            <strong>Beer Name:</strong> {beerReview.beer_name} <br />
                            <strong>Rating:</strong> {beerReview.rating}<br />
                            <strong>Notes:</strong> {beerReview.notes} <br />
                            {/* Favorite Beer Indicator */}
                            {beerReview.is_favorite && (
                                <span className="text-warning">⭐ Favorite Beer</span>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};