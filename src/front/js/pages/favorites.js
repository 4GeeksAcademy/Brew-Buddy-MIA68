import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";

import { Context } from "../store/appContext";
import "../../styles/favorites.css";
import {FavoriteBeers} from "../component/FavoriteBeers"
import craft from "../../img/craft.jpg"
import {FavoriteBreweries} from "../component/FavoriteBreweries"

export const Favorites = () => {
  const { store, actions } = useContext(Context);
  useEffect(() => {
    let getData = async () => {
      let beersSuccess = await actions.getFavoriteBeers()
      if (beersSuccess == false) {
        console.log("no beers were retrieved")
      }
      let allBeersSuccess = await actions.getAllBeers()
      if (allBeersSuccess == false) {
        console.log("no beers were retrieved")
      }
      let breweriesSuccess = await actions.getFavoriteBreweries()
      if (breweriesSuccess == false) {
        console.log("no breweries were retrieved")
      }
      let peopleSuccess = await actions.getFavoritePeople()
      if (peopleSuccess == false) {
        console.log("no people were retrieved")
      }
    }
    getData()
  }, [])

  // const handleFavoriteBeer = (item) => {
  //   if (store.favoriteBeers.includes(item)) {
  //     actions.removeFavoritesBeers(item)
  //   }
  //   else {
  //     actions.addFavoritesBeer(item)
  //   }
  // }
  return (
    <div className="">
      <ul
        className="nav nav-pills mb-3 justify-content-center"
        id="pills-tab"
        role="tablist"
      >
        <li className="nav-item mx-1" role="presentation">
          <button
            className="btn"
            id="pills-home-tab"
            data-bs-toggle="pill"
            data-bs-target="#pills-home"
            type="button"
            role="tab"
            aria-controls="pills-home"
            aria-selected="true"
            style={{
              width: "300px",
              height: "200px",
              backgroundImage:
                "url(https://assets.simpleviewinc.com/simpleview/image/upload/c_limit,h_1200,q_75,w_1200/v1/clients/bucks/Vault_Brewing_bar_d3b00188-9623-4dec-85ee-e76270f1c62e.jpg)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <h1 className="text-white favorites-text-shadowing">Breweries</h1>
          </button>
        </li>
        <li className="nav-item mx-1" role="presentation">
          <button
            className="nav-link"
            id="pills-profile-tab"
            data-bs-toggle="pill"
            data-bs-target="#pills-profile"
            type="button"
            role="tab"
            aria-controls="pills-profile"
            aria-selected="false"
            style={{
              width: "300px",
              height: "200px",
              backgroundImage:
                "url(https://www.theepicureanbeers.co.uk/cdn/shop/articles/AdobeStock_599782467-min.jpg?v=1690787382)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <h1 classNameName="text-white favorites-text-shadowing">People</h1>
          </button>
        </li>
        <li className="nav-item mx-1" role="presentation">
          <button
            className="nav-link"
            id="pills-contact-tab"
            data-bs-toggle="pill"
            data-bs-target="#pills-contact"
            type="button"
            role="tab"
            aria-controls="pills-contact"
            aria-selected="false"
            style={{
              width: "300px",
              height: "200px",
              backgroundImage:
                `url(${craft})`,
              backgroundSize: "cover",
              backgroundPosition: "right 9px center",
            }}
          >
            <h1 classNameName="text-white favorites-text-shadowing">Beers</h1>
          </button>
        </li>
        {/* <li className="nav-item mx-1" role="presentation">
        <button
          className="nav-link"
          id="pills-disabled-tab"
          data-bs-toggle="pill"
          data-bs-target="#pills-disabled"
          type="button"
          role="tab"
          aria-controls="pills-disabled"
          aria-selected="false"
        >
          Disabled
        </button>
      </li> */}
      </ul>
      <div className="tab-content" id="pills-tabContent">
        <div
          className="tab-pane text-center  fade show active"
          id="pills-disabled"
          role="tabpanel"
          aria-labelledby="pills-disabled-tab"
          tabindex="0"
        >
          <h2>Welcome to Your Favorites!</h2>
          <p>
            Explore and manage your favorite Breweries, People, and Beers by
            selecting a category above.
          </p>
        </div>
        <div
          className="tab-pane text-center justify-content-center fade "
          id="pills-home"
          role="tabpanel"
          aria-labelledby="pills-home-tab"
          tabindex="0"
        >
          <h1>Breweries</h1>
          <FavoriteBreweries/>
        </div>
        <div
          className="tab-pane text-center justify-content-center fade"
          id="pills-profile"
          role="tabpanel"
          aria-labelledby="pills-profile-tab"
          tabindex="0"
        >
          People
        </div>
        <div
          className="tab-pane text-center justify-content-center fade"
          id="pills-contact"
          role="tabpanel"
          aria-labelledby="pills-contact-tab"
          tabindex="0"
        >
          <h1>Beers</h1>
          <FavoriteBeers/>
          <div>
          {/* {store.favoriteBeers?.map((item, index) => {
            return (
              <div className="card text-center mb-3 mx-auto" style={{ width: "18rem" }}>
                <div className="card-body">
                  <h5 className="card-title">{item.beer_name}</h5>
                  <p className="card-text">{item.flavor}</p>
                  <p className="card-text">{item.type}</p>
                  <p className="card-text">{item.ABV}</p>
                  <a href="#" className="btn btn-primary">Go somewhere</a>
                  <a onClick={() => actions.handleFavoriteBeer(item.id)} href="#" className="btn btn-primary">Add To Favorites</a>
                </div>
              </div>
            )
          })}  */}
          </div>
        </div>
      </div>
    </div>
  );
};