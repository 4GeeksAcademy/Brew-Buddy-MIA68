import React, { useContext } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";

export const BreweryCard = (props) => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate()

    return (
        <div className="card">
            <div className="card-body">
                <h4 className="card-title">
                    {/* J.R.: A specific image for brewery type */}
                    <a href={props.breweryData.brewery_type}>
                        <img src="" title="beer icons" alt="brewery-type-icon" style={{ width: '20px', height: '20px', marginRight: '8px' }} />
                    </a>
                    {props.breweryData.name}
                </h4>
                <h5>{props.breweryData.city}, {props.breweryData.state}</h5>
                <p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
                <button className="btn btn-primary" onClick={() => actions.addToCurrentJourney(props.breweryData)}>Add to my current route</button>
                {/* J.R.: A favorites button for brewery */}
                <a href="#" className="btn btn-info"><i className="fa-regular fa-star"></i></a>
                {/* J.R.: A button for contact information of brewery */}
                <a href={props.breweryData.phone}>{props.breweryData.phone}</a>
                {/* J.R.: A button for website of brewery */}
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
export const JourneyCard = ({ key, breweryData, onReview, onRefocus }) => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate()
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