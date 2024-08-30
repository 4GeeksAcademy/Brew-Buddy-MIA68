import React, { useState, useEffect, useContext} from "react";
import { Context } from "../store/appContext";

export const FavoriteBeers = () => {
  const {store,actions}=useContext(Context)
  const [items, setItems] = useState([]);

  const [sortOption, setSortOption] = useState("");

  const handleSortChange = (e) => {
    const option = e.target.value;
    setSortOption(option);

    let sortedItems = [...items];
    if (option === "name-asc") {
      sortedItems.sort((a, b) => a.name.localeCompare(b.name));
    } else if (option === "name-desc") {
      sortedItems.sort((a, b) => b.name.localeCompare(a.name));
    } else if (option === "flavor-asc") {
        sortedItems.sort((a, b) => a.flavor.localeCompare(b.flavor));
      } else if (option === "flavor-desc") {
        sortedItems.sort((a, b) => b.flavor.localeCompare(a.flavor));
      } else if (option === "type-asc") {
        sortedItems.sort((a, b) => a.type.localeCompare(b.type));
      } else if (option === "type-desc") {
        sortedItems.sort((a, b) => b.type.localeCompare(a.type));
      } else if (option === "abv-asc") {
      sortedItems.sort((a, b) => a.ABV - b.ABV);
    } else if (option === "abv-desc") {
      sortedItems.sort((a, b) => b.ABV - a.ABV);
    }

    setItems(sortedItems);
  };
 
 useEffect(()=>{
    setItems(store.favoriteBeers)
 },[store.favoriteBeers])
  return (
    <div>
      <select value={sortOption} onChange={handleSortChange}>
        <option value="">Sort by...</option>
        <option value="name-asc">Name (A-Z)</option>
        <option value="name-desc">Name (Z-A)</option>
        <option value="flavor-asc">Flavor (A-Z)</option>
        <option value="flavor-desc">Flavor (Z-A)</option>
        <option value="type-asc">Type (A-Z)</option>
        <option value="type-desc">Type (Z-A)</option>
        <option value="abv-asc">ABV (Low to High)</option>
        <option value="abv-desc">ABV (High to Low)</option>
      </select>

      <ul>
      <button onClick={()=>{console.log(store.favoriteBeers)}}>click here</button>
      {items.map((item, index) => {
            return (
              <div class="card text-center mb-3 mx-auto" style={{ width: "18rem" }}>
                <div class="card-body">
                  <h5 class="card-title">{item.beer_name}</h5>
                  <p class="card-text">{item.flavor}</p>
                  <p class="card-text">{item.type}</p>
                  <p class="card-text">{item.ABV}</p>
                  <a href="#" class="btn btn-primary">Go somewhere</a>
                  {/* <a onClick={() => actions.handleFavoriteBeer(item.id)} href="#" class="btn btn-primary">Add To Favorites</a> */}
                </div>
              </div>
            )
          })} 
      </ul>
    </div>
  );
};

