import React, { useContext } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";

export const BreweryCard = (props) => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate()
    return (
        <div className="card">
            <div className="card-body">
                <h4 className="card-title">
                    <a href={props.breweryData.brewery_type}>
                        <img src="img=`/img/${store.brewery_type}.jpg`" alt="brewery-type-icon" style={{ width: '20px', height: '20px', marginRight: '8px' }} />
                    </a>
                    {props.breweryData.name}
                </h4>
                <h5>{props.breweryData.city}, {props.breweryData.state}</h5>
                <p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
                <button className="btn btn-primary" onClick={() => actions.addToCurrentRoute(props.breweryData)}>Add to my current route</button>
                {/* J.R.: A favorites button for brewery */}
                <a href="#" className="btn btn-info"><i className="fa-regular fa-star"></i></a>
                {/* J.R.: A button for contact information of brewery */}
                <a href="#" className="btn btn-success">{props.breweryData.phone}</a>
                <p>
                    <a href={props.breweryData.website_url} target="blank">
                        <button className="btn btn-secondary">Visit Our Website!</button>
                    </a>
                </p>
            </div>
        </div>
    )
}