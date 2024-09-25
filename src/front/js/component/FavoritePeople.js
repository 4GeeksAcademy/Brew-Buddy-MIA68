import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
const FavoritePeople = () => {
    const [items, setItems] = useState([
        {email: "JohnDoe@email.com", username: "JohnDoe"}
    ])
return <ul>
        
        {items.map((item, index) => {
          return (
            <div class="card text-center mb-3 mx-auto" style={{ width: "18rem" }}>
              <div class="card-body">
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