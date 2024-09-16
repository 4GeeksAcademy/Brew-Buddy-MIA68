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
        alert(`${item.brewery_name} has been removed from your favorites`); 
    }
    return (
        <div>
            
            <select value={sortOption} onChange={handleSortChange}>
                <option value="">Sort by...</option>
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
            </select>

            <ul>
                {store.favoriteBreweries.length === 0 ? (
                    <p>No favorite breweries found.</p>
                ) : (
                   items.map((item, index) => (
                        <div id="favBreweryCard" className="card text-center mb-3 mx-auto" style={{ width: "18rem" }} key={index}>
                            <div className="card-body">
                                <button type="button" className="close-button" onClick={() => handleRemoveFavorite(item)}>
                                    <i className="fa-solid fa-x"></i>
                                </button>
                                <h5 className="card-title mt-3">{item.brewery_name || "Unknown Brewery"}</h5> {/* Display brewery name */}
                                <p className="card-text">
                                    {item.address || item.address_1 || "No address available"}
                                </p> {/* Display address */}
                                <p className="card-text">
                                    {item.city || "No city available"}
                                </p> {/* Display city */}
                                <p className="card-text">
                                    {item.state_province || "No state available"}
                                </p> {/* Display state */}
                                <p className="card-text">
                                    {item.phone || "No phone available"}
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
            </ul>
        </div>
    );
};
