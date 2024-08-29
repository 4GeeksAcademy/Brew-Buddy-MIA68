import React, { useContext } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import '../../styles/routecard.css'

export const BreweryRouteCard = (props) => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate()

    return (
        <div className="card">
            <div className="card-body">
                <h2>Brew Locator</h2>
                <div className="row">
                    <div className="col-4 border border-solid">
                        <input type="text" placeholder="Find Your Brew . . ."></input>
                        <div>
                            <ul className="vertical-menu">
                                <li>list 1</li>
                                <li>list 1</li>
                                <li>list 1</li>
                                <li>list 1</li>
                                <li>list 1</li>
                                <li>list 1</li>
                                <li>list 1</li>
                                <li>list 1</li>
                                <li>list 1</li>
                                <li>list 1</li>
                                <li>list 1</li>
                                <li>list 1</li>
                                <li>list 1</li>
                                <li>list 1</li>
                                <li>list 1</li>
                                <li>list 1</li>
                                <li>list 1</li>
                                <li>list 1</li>
                                <li>list 1</li>
                                <li>list 1</li>
                                <li>list 1</li>
                                <li>list 1</li>
                                <li>list 1</li>
                                <li>list 1</li>
                                <li>list 1</li>
                                <li>list 1</li>
                            </ul>
                        </div>
                    </div>
                        {/* map side of brewery locator */}
                    <div className="col-8 border border-solid">
                        <p>Map Side</p>
                    </div>
                </div>
            </div>
        </div>
    )
}