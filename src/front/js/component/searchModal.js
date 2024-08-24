import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import getState from "../store/flux";

const Modal = () => {
    const { store, actions, setStore } = useContext(Context);;
    const [cityValue, setCityValue] = useState("")
    const [stateValue, setStateValue] = useState("")

    if (!store.modalIsOpen) return null;

    const beginCitySearch = () => {
        let city = cityValue
        let state = stateValue
        actions.handleSearch(city, state)
    }

    return (
        <div className="modal-overlay container col-7 text-center border border-secondary my-1">
            <div className="row">
                <div className="col">
                    <h3>Search by City</h3>
                    <label htmlFor="cityInput">City:</label>
                    <input type="text" id="cityInput" name="cityInput" onChange={e => setCityValue(e.target.value)} />
                    <select className="mx-2" onChange={e => setStateValue(e.target.value)}>
                        <option value="">Select State</option>
                        <option value="Alabama">Alabama</option>
                        <option value="Alaska">Alaska</option>
                        <option value="Arizona">Arizona</option>
                        <option value="Arkansas">Arkansas</option>
                        <option value="California">California</option>
                        <option value="Colorado">Colorado</option>
                        <option value="Connecticut">Connecticut</option>
                        <option value="Delaware">Delaware</option>
                        <option value="District Of Columbia">District Of Columbia</option>
                        <option value="Florida">Florida</option>
                        <option value="Georgia">Georgia</option>
                        <option value="Hawaii">Hawaii</option>
                        <option value="Idaho">Idaho</option>
                        <option value="Illinois">Illinois</option>
                        <option value="Indiana">Indiana</option>
                        <option value="Iowa">Iowa</option>
                        <option value="Kansas">Kansas</option>
                        <option value="Kentucky">Kentucky</option>
                        <option value="Louisiana">Louisiana</option>
                        <option value="Maine">Maine</option>
                        <option value="Maryland">Maryland</option>
                        <option value="Massachusetts">Massachusetts</option>
                        <option value="Michigan">Michigan</option>
                        <option value="Minnesota">Minnesota</option>
                        <option value="Mississippi">Mississippi</option>
                        <option value="Missouri">Missouri</option>
                        <option value="Montana">Montana</option>
                        <option value="Nebraska">Nebraska</option>
                        <option value="Nevada">Nevada</option>
                        <option value="New Hampshire">New Hampshire</option>
                        <option value="New Jersey">New Jersey</option>
                        <option value="New Mexico">New Mexico</option>
                        <option value="New York">New York</option>
                        <option value="North Carolina">North Carolina</option>
                        <option value="North Dakota">North Dakota</option>
                        <option value="Ohio">Ohio</option>
                        <option value="Oklahoma">Oklahoma</option>
                        <option value="Oregon">Oregon</option>
                        <option value="Pennsylvania">Pennsylvania</option>
                        <option value="Rhode Island">Rhode Island</option>
                        <option value="South Carolina">South Carolina</option>
                        <option value="South Dakota">South Dakota</option>
                        <option value="Tennessee">Tennessee</option>
                        <option value="Texas">Texas</option>
                        <option value="Utah">Utah</option>
                        <option value="Vermont">Vermont</option>
                        <option value="Virginia">Virginia</option>
                        <option value="Washington">Washington</option>
                        <option value="West Virginia">West Virginia</option>
                        <option value="Wisconsin">Wisconsin</option>
                        <option value="Wyoming">Wyoming</option>
                    </select>
                    <button className="my-2" onClick={beginCitySearch}>
                        Begin Search
                    </button>
                </div>
                <div className="col-1">
                    <h2 className="mt-5">OR</h2>
                </div>
                <div className="col">
                    <h3>Search By Current Position</h3>
                    <button onClick={actions.searchFunctionWithLocation}>Search</button>
                </div>
                <div>
                    <button className="close-button" onClick={actions.toggleSearch}>
                        Cancel
                    </button>


                </div>
            </div>
        </div>
    );
};

export default Modal;