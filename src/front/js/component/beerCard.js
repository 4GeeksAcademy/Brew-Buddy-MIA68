import React, { useContext } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";

export const BeerCard = (props) => {
    console.log(props)
    const { store, actions } = useContext(Context);

    return (
        <div className="card col-sm-6 col-md-4 my-2">
            <div className="card-body">
                <div className="d-flex">
                    <h2 className="card-title mx-auto">
                        <button onClick={(e) => actions.addFavoriteBeer(props.beerData.id)}>TEST</button>
                        {/* J.R.: A specific image for brewery types */}
                        {props.beerData.beer_name}
                    </h2>
                </div>
                <div>
                    <div className="row justify-content-between bg-danger">
                        <h5 className="col">Type:</h5>
                        <h5 className="col">{props.beerData.type}</h5>



                    </div>
                    <div className="row justify-content-between bg-light">
                        <h5 className="col">Flavor:</h5>
                        <h5 className="col">{props.beerData.flavor}</h5>

                    </div>
                    <div className="row justify-content-between bg-secondary">
                        <h5 className="col">ABV:</h5>
                        <h5 className="col">{props.beerData.ABV}</h5>
                    </div>
                </div>
            </div>
        </div>
    )
}