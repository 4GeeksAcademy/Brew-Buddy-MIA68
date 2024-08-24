import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";

import { Context } from "../store/appContext";

export const Favorites = () => {
  const { store, actions } = useContext(Context);
  return (
    <div className="">
      <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
        <li class="nav-item  container d-flex justify-content-center align-items-center" style={{ width: "300px", height: "auto" }} role="presentation">
          <button class="btn" style={{ width: "300px", height: "auto" }} id="pills-home-tab" data-bs-toggle="pill" data-bs-target="#pills-home" type="button" role="tab" aria-controls="pills-home" aria-selected="true"><img className="w-100 h-auto border rounded" src="https://assets.simpleviewinc.com/simpleview/image/upload/c_limit,h_1200,q_75,w_1200/v1/clients/bucks/Vault_Brewing_bar_d3b00188-9623-4dec-85ee-e76270f1c62e.jpg" /></button>
          <h1 className="text-white position-absolute " style={{ zIndex: "1", }}>Breweries</h1>
        </li>
        <li class="nav-item  container d-flex justify-content-center align-items-center" style={{ width: "300px", height: "auto" }} role="presentation">
          <button class="btn" style={{ width: "300px", height: "auto" }} id="pills-home-tab" data-bs-toggle="pill" data-bs-target="#pills-home" type="button" role="tab" aria-controls="pills-home" aria-selected="true"><img className="w-100 h-auto border rounded" src="https://images.squarespace-cdn.com/content/v1/5b85c5e52487fd1f4b32f19f/1669828878570-JLXMCNLETBUMQQXQ05U7/CraftmasterStainlessInc-180871-Craft-Beer-Industry-blogbanner1.jpg" /></button>
          <h1 className="text-white position-absolute " style={{ zIndex: "1", }}>Beers</h1>
        </li>
        <li class="nav-item  container d-flex justify-content-center align-items-center" style={{ width: "300px", height: "auto" }} role="presentation">
          <button class="btn" style={{ width: "300px", height: "auto" }} id="pills-home-tab" data-bs-toggle="pill" data-bs-target="#pills-home" type="button" role="tab" aria-controls="pills-home" aria-selected="true"><img className="w-100 h-auto border rounded" src="https://img.freepik.com/premium-photo/friends-are-drinking-oktoberfest-beer_911712-7587.jpg" /></button>
          <h1 className="text-white position-absolute " style={{ zIndex: "1", }}>People</h1>
        </li>
        {/* <li class="nav-item" role="presentation">
          <button class="nav-link" id="pills-profile-tab" data-bs-toggle="pill" data-bs-target="#pills-profile" type="button" role="tab" aria-controls="pills-profile" aria-selected="false">Profile</button>
        </li>
        <li class="nav-item" role="presentation">
          <button class="nav-link" id="pills-contact-tab" data-bs-toggle="pill" data-bs-target="#pills-contact" type="button" role="tab" aria-controls="pills-contact" aria-selected="false">Contact</button>
        </li>
        <li class="nav-item" role="presentation">
          <button class="nav-link" id="pills-disabled-tab" data-bs-toggle="pill" data-bs-target="#pills-disabled" type="button" role="tab" aria-controls="pills-disabled" aria-selected="false" disabled>Disabled</button>
        </li> */}
      </ul>
      <div class="tab-content" id="pills-tabContent">
        <div class="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab" tabindex="0">...</div>
        <div class="tab-pane fade" id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab" tabindex="0">...</div>
        <div class="tab-pane fade" id="pills-contact" role="tabpanel" aria-labelledby="pills-contact-tab" tabindex="0">...</div>
        <div class="tab-pane fade" id="pills-disabled" role="tabpanel" aria-labelledby="pills-disabled-tab" tabindex="0">...</div>
      </div>
    </div>

  )
}

