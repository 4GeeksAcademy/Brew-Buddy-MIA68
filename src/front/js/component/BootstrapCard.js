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


    useEffect(() => {
        let getData = async () => {
            await actions.getFavoriteBreweries()
            for (let fav in store.favoriteBreweries) {
                if (store.favoriteBreweries[fav].phone === props.breweryData.phone) {
                    setFavoriteBrewery(store.favoriteBreweries[fav])
                    setCurrentFavorite(true);
                    break; // exit loop once a match is found
                }
            }
        }
        getData()
    }, [])

    const handleFavBrewery = (e) => {
        e.preventDefault();
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
    };
    const handleAddBreweryToRoute = () => {
        console.log(props.breweryData)
        actions.addToCurrentJourney(props.breweryData)
    }

    return (
        <div className="card">
            <div className="card-body">
                <h4 className="card-title">
                    <a href={props.breweryData.brewery_type}>
                        <img
                            src={breweryTypeIcons[breweryType]}
                            title="brewery type icon"
                            alt={`${breweryType} icon`}
                            style={{ width: '30px', height: '30px', marginRight: '8px' }}
                        />
                    </a>
                    {props.breweryData.name}
                    <a href={props.breweryData.brewery_type}>
                        <img
                            src={breweryTypeIcons[breweryType]}
                            title="brewery type icon"
                            alt={`${breweryType} icon`}
                            style={{ width: '30px', height: '30px', marginLeft: '8px' }}
                        />
                    </a>
                </h4>
                <h5>{props.breweryData.city}, {props.breweryData.state}</h5>
                <p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
                <button className="btn btn-primary" onClick={handleAddBreweryToRoute}>Add to my current route</button>
                {/* J.R.: A favorites button for brewery */}
                <a className="btn btn-info"><i className={currentFavorite == true ? "fa-solid fa-star" : "fa-regular fa-star"} onClick={(e) => handleFavBrewery(e)}></i></a>                {/* J.R.: A button for contact information of brewery */}
                <a href={props.breweryData.phone}>{props.breweryData.phone}</a>
                {/* A button for website of brewery */}
                <p>
                    <a href={props.breweryData.website_url} target="blank">
                        <button className="btn btn-secondary">Visit Our Website!</button>
                    </a>
                    <Link to={"/brewery/" + props.breweryData.id} className="btn btn-secondary">
                        See Brews
                    </Link>
                </p>
            </div>
        </div>
    )
}

export const JourneyCard = ({ breweryData, onReview, onRefocus }) => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate()
    // const handleAddReview = () => {
    //     onReview(breweryData)
    // }
    return (
        <div className="card">
            <h5 className="card-header">{breweryData.name}</h5>
            <div className="card-body">
                <h5 className="card-title">Special title treatment</h5>
                <p className="card-text">Travel Time: {store.journey.routes.travelTime} Minutes</p>
                <p className="card-text">Distance: {store.journey.routes.miles} Miles</p>
                <button className="btn btn-primary" onClick={() => onReview(breweryData)}>
                    Add Review
                </button>
                <button className="btn btn-primary" onClick={() => onRefocus(breweryData.latitude, breweryData.longitude)}>
                    Navigate
                </button>
            </div>
        </div>
    )
}