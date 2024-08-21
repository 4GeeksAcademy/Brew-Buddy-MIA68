import React, { useContext } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router";
import { Context } from "../store/appContext";

export const BreweryCard = (props) => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate()
    return (
        <div class="card">
            <div class="card-header">
                {props.brewery_data.name}
            </div>
            <div class="card-body">
                <h5 class="card-title">Special title treatment</h5>
                <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
                <a href="#" class="btn btn-primary">Go somewhere</a>
            </div>
        </div>
    )
}