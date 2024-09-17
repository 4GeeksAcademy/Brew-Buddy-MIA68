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

  useEffect(() => {
    setItems(store.favoriteBeers)
    setBeersList(store.allBeers)
  }, [store.favoriteBeers, store.allBeers])

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
        {/* <form>
          <div className="mb-3">
            <label htmlFor="beerDropdown" className="form-label">Select a beer</label>
            <select
              id="beerDropdown"
              className="form-select"
              value={selectedBeer}
              onChange={handleBeerChange}
            >
              <option value="" disabled>Select a beer</option>
              {beersList.map((beer) => (
                <option key={beer.id} value={beer.name}>
                  {beer.name}
                </option>
              ))}
              <option value="add_new">Add new beer</option>
            </select>
          </div>

          {isAddingBeer && (
            <div className="mb-3">
              <label htmlFor="formGroupExampleInput" className="form-label">New Beer Name</label>
              <input
                type="text"
                className="form-control"
                id="formGroupExampleInput"
                placeholder="Enter beer name"
                value={newBeer}
                onChange={handleNewBeerChange}
              />
            </div>
          )}
          <div class="mb-3">
            <label for="flavor" className="form-label">Flavor</label>
            <input type="text" class="form-control" id="flavor" placeholder="Another input placeholder" />
          </div>
          <div class="mb-3">
            <label for="type" className="form-label">Type</label>
            <input type="text" class="form-control" id="label" placeholder="Another input placeholder" />
          </div>
          <div class="mb-3">
            <label for="ABV" className="form-label">ABV</label>
            <input type="text" class="form-control" id="ABV" placeholder="Another input placeholder" />
          </div>
          <button className="btn btn-primary" type="submit">Submit</button>
        </form> */}
        {items.map((item, index) => {
          const handleRemoveFavorite = (item) => {
            actions.deleteFavoriteBeers(item);
            alert(`${item.beer_name} has been removed from your favorites`); 
        }
          return (
            <div id="favBeerCard" className="card text-center mb-3 mx-auto" style={{ width: "18rem" }} key={index}>
              <div class="card-body">
              <button type="button" className="close-button-beers" onClick={() => handleRemoveFavorite(item)}>
                                    <i className="fa-solid fa-x"></i>
                                </button>
                <h5 class="card-title mt-3">{item.beer_name}</h5>
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

// test (delete later).