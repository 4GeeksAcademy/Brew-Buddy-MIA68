import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";

export const FavoriteBreweries = () => {
    const { store, actions } = useContext(Context);
    const [sortOption, setSortOption] = useState("");
    const [items, setItems] = useState([])
    useEffect(() => {
       
      setItems(store.favoriteBreweries)
        
    }, [store.favoriteBreweries]);

    const handleSortChange = (e) => {
        const option = e.target.value;
        setSortOption(option);
    
        let sortedItems = [...items];
        if (option === "name-asc") {
          sortedItems.sort((a, b) => a.brewery_name.localeCompare(b.brewery_name));
        } else if (option === "name-desc") {
          sortedItems.sort((a, b) => b.brewery_name.localeCompare(a.brewery_name));
        }
        setItems(sortedItems);
    }
    const handleRemoveFavorite = (item) => {
        actions.deleteFavoriteBrewery(item);
        // alert(`${item.brewery_name} has been removed from your favorites`); 
    }
    return (
        <div>
            <div className="text-center">
            <h1>Breweries</h1>
             <select value={sortOption} onChange={handleSortChange}>
                <option value="">Sort by...</option>
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
            </select>
            </div>
           

            <div className="container mt-4">
                {store.favoriteBreweries.length === 0 ? (
                    <p>No favorite breweries found.</p>
                ) : (
                   items.map((item, index) => (
                        <div id="favBreweryCard" className="card shadow mb-4 mx-auto" style={{ width: "18rem" }} key={index}>
                             <button type="button" className="btn-close position-absolute top-0 end-0 m-2" onClick={() => handleRemoveFavorite(item)}>
                                    
                                </button>
                                <div className="card-body">
                                    <img src="https://cdn1.iconfinder.com/data/icons/brewery-astute-vol-1/512/Brewpub-512.png" height="50px" width="50px" alt="brewery"></img>
                               <div className="d-flex- justify-content-center"><h5 className="card-title mt-3 me-5"><strong>{item.brewery_name || "Unknown Brewery"}</strong></h5></div>
                                 {/* Display brewery name */}
                                <p className="card-text">
                                    Address: {item.address || item.address_1 || "No address available"}
                                </p> {/* Display address */}
                                <p className="card-text">
                                   City: {item.city || "No city available"}
                                </p> {/* Display city */}
                                <p className="card-text">
                                    State: {item.state_province || "No state available"}
                                </p> {/* Display state */}
                                <p className="card-text">
                                    Phone: {item.phone || "No phone available"}
                                </p> {/* Display phone */}
                                
                                <a
                                    href={item.website_url ? item.website_url : "#"}
                                    className="btn btn-primary"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Visit Website
                                </a> {/* Website */}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
