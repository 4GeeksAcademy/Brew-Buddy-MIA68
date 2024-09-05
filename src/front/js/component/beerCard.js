import React, { useContext } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";

export const BeerCard = (props) => {
    const { store, actions } = useContext(Context);

    return (
        <div className="card">
            <div className="card-body">
                <h4 className="card-title">
                    {/* J.R.: A specific image for brewery type */}
                    {props.beerData.beer_name}
                </h4>
            </div>
        </div>
    )
}