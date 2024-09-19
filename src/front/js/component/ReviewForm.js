import React, { useState, useContext } from 'react';
import { Context } from '../store/appContext';

export const ReviewForm = ({ brewery, onSaveReview }) => {
    const [overallRating, setOverallRating] = useState(0);
    const [reviewText, setReviewText] = useState("");
    const [isFavoriteBrewery, setIsFavoriteBrewery] = useState(false);
    const [beerReviews, setBeerReviews] = useState([]);
    const { store, actions } = useContext(Context);

    const addBeerReview = () => {
        setBeerReviews([...beerReviews, { beer_name: "", rating: 0, notes: "", isFavorite: false }]);
    };

    const updateBeerReview = (index, field, value) => {
        const updatedReviews = [...beerReviews];
        updatedReviews[index][field] = value;
        setBeerReviews(updatedReviews);
    };

    const handleFavBrewery = () => {
        actions.addFavoriteBrewery(brewery);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        onSaveReview(brewery, overallRating, reviewText, isFavoriteBrewery, beerReviews);
        actions.addBreweryReviewToBackend(brewery, overallRating, reviewText, isFavoriteBrewery, beerReviews)
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Review {brewery.name}</h2>
            <div>
                <label>Overall Rating:</label>
                <input type="number" value={overallRating} onChange={(e) => setOverallRating(e.target.value)} />
            </div>
            <div>
                <label>Review:</label>
                <textarea value={reviewText} onChange={(e) => setReviewText(e.target.value)} />
            </div>
            <div>
                <label>
                    <input type="checkbox" checked={isFavoriteBrewery} onChange={(e) => setIsFavoriteBrewery(e.target.checked)} />
                    Mark as Favorite Brewery
                </label>
            </div>
            <h3>Beers Tried</h3>
            {beerReviews.map((beerReview, index) => (
                <div key={index}>
                    <label>Beer Name:</label>
                    <input type="text" value={beerReview.beerName} onChange={(e) => updateBeerReview(index, 'beerName', e.target.value)} />
                    <label>Rating:</label>
                    <input type="number" value={beerReview.rating} onChange={(e) => updateBeerReview(index, 'rating', e.target.value)} />
                    <label>Notes:</label>
                    <textarea value={beerReview.notes} onChange={(e) => updateBeerReview(index, 'notes', e.target.value)} />
                    <label>
                        <input type="checkbox" checked={beerReview.isFavorite} onChange={(e) => updateBeerReview(index, 'isFavorite', e.target.checked)} />
                        Mark as Favorite Beer
                    </label>
                </div>
            ))}
            <button type="button" onClick={addBeerReview}>Add Another Beer</button>
            <button type="submit" className="btn btn-primary">Save Review</button>
        </form>
    );
};