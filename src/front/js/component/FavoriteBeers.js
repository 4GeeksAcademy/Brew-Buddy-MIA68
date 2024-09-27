import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";

export const FavoriteBeers = () => {
  const { store, actions } = useContext(Context)
  const [items, setItems] = useState([]);
  const [beersList, setBeersList] = useState([]);

  const [sortOption, setSortOption] = useState("");
  const [selectedBeer, setSelectedBeer] = useState('');
  const [isAddingBeer, setIsAddingBeer] = useState(false);
  const [newBeer, setNewBeer] = useState('');

  const handleBeerChange = (event) => {
    const value = event.target.value;
    if (value === 'add_new') {
      setIsAddingBeer(true);
    } else {
      setSelectedBeer(value);
      setIsAddingBeer(false);
    }
  };

  const handleNewBeerChange = (event) => {
    setNewBeer(event.target.value);
  };
  const handleSortChange = (e) => {
    const option = e.target.value;
    setSortOption(option);

    let sortedItems = [...items];
    if (option === "name-asc") {
      sortedItems.sort((a, b) => a.beer_name.localeCompare(b.beer_name));
    } else if (option === "name-desc") {
      sortedItems.sort((a, b) => b.beer_name.localeCompare(a.beer_name));
    } else if (option === "flavor-asc") {
      sortedItems.sort((a, b) => a.flavor.localeCompare(b.flavor));
    } else if (option === "flavor-desc") {
      sortedItems.sort((a, b) => b.flavor.localeCompare(a.flavor));
    } else if (option === "type-asc") {
      sortedItems.sort((a, b) => a.type.localeCompare(b.type));
    } else if (option === "type-desc") {
      sortedItems.sort((a, b) => b.type.localeCompare(a.type));
    } else if (option === "abv-asc") {
      sortedItems.sort((a, b) => a.ABV.split("%")[0] - b.ABV.split("%")[0]);
    } else if (option === "abv-desc") {
      sortedItems.sort((a, b) => b.ABV.split("%")[0] - a.ABV.split("%")[0]);
    }

    setItems(sortedItems);
  };

  const handleRemoveFavorite = (item) => {
    actions.deleteFavoriteBeer(item)
  }

  useEffect(() => {
    setItems(store.favoriteBeers)
    setBeersList(store.allBeers)
  }, [store.favoriteBeers, store.allBeers])
  return (
    <div>
      <div className="text-center">
      <h1>Beers</h1>
         <select className="mx-auto" value={sortOption} onChange={handleSortChange} >
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
      </div>
       
     

      
        <div className="container mt-4">
    {items.map((item, index) => {
      return (
          <div className="card  shadow mb-4 mx-auto" style={{ width: "18rem" }}>
            <button type="button" className="btn-close position-absolute top-0 end-0 m-2" aria-label="Close" onClick={() => handleRemoveFavorite(item)}></button>
            <div className="card-body">
              <div className="d-flex">  
                <h5 className="card-title mt-3 me-5"><strong>{item.beer_name}</strong></h5>
                <img className="mb-3" src="https://cdn0.iconfinder.com/data/icons/st-patrick-s-day-22/24/Beer_Mug_drink-512.png" alt="beer mug" height="50px" width="50px" />
              </div>
             
              <p className="card-text">Flavor: {item.flavor}</p>
              <p className="card-text">Type: {item.type}</p>
              <p className="card-text">ABV: {item.ABV}% </p>
            </div>
          </div>
      );
    })}
</div>

     
    </div>
  );
};

// test (delete later).