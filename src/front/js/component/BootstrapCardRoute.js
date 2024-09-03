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
                        <input type="text" placeholder="Find Your Brew . . . . ." className="wide-input"></input>
                        <button><i className="fa-solid fa-magnifying-glass bg-secondary-subtle"></i></button>
                        <div>
                            <ul className="vertical-menu w-100">
                                <li className="border border-solid">
                                    <div>
                                        {props.breweryData.name}
                                    </div>
                                    <div>
                                        Address
                                    </div>
                                    <div>
                                        Number
                                    </div>
                                </li>
                                <li className="border border-solid">
                                    <div>
                                        Name
                                    </div>
                                    <div>
                                        Address
                                    </div>
                                    <div>
                                        Number
                                    </div>
                                </li>
                                <li className="border border-solid">
                                    <div>
                                        Name
                                    </div>
                                    <div>
                                        Address
                                    </div>
                                    <div>
                                        Number
                                    </div>
                                </li>
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