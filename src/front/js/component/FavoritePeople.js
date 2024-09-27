import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
const FavoritePeople = () => {
  const [items, setItems] = useState([
    { email: "JohnDoe@email.com", username: "JohnDoe" }
  ])
  const { store, actions } = useContext(Context);
  return <ul>

    {items.map((item, index) => {
      return (
        <div class="card text-center mb-3 mx-auto" style={{ width: "25rem" }}>
          <div class="card-body">
            {store.userProfileImageId && (
              <>
                <h3>COMING SOON!</h3>
                <img
                  src={store.userProfileImageId}
                  alt="Profile"
                  className="rounded-circle me-3 profile-image mb-2" style={{ width: "5rem", height: "5rem" }}
                />
              </>
            )}
            <h5 class="card-title">Email: {item.email}</h5>
            <h5 class="card-title">Username: {item.username}</h5>
            {/* <a onClick={() => actions.handleFavoriteBeer(item.id)} href="#" class="btn btn-primary">Add To Favorites</a> */}
          </div>
        </div>
      )
    })}
  </ul>
}

export default FavoritePeople