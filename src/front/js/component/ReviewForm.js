import React, { useState, useContext, useEffect } from 'react';
import { Context } from '../store/appContext';
import { Link } from "react-router-dom";
import { Cloudinary } from '@cloudinary/url-gen';
import { AdvancedImage } from '@cloudinary/react';
import { fill } from '@cloudinary/url-gen/actions/resize';
import { image } from '@cloudinary/url-gen/qualifiers/source';

export const ReviewForm = ({ brewery, onSaveReview }) => {
    const [overallRating, setOverallRating] = useState(0);
    const [reviewText, setReviewText] = useState("");
    const [isFavoriteBrewery, setIsFavoriteBrewery] = useState(false);
    const [beerReviews, setBeerReviews] = useState([]);
    const { store, actions } = useContext(Context);
    const [imageFile, setImageFile] = useState(null);
    const [uploadedImageUrl, setUploadedImageUrl] = useState(null);

    const cld = new Cloudinary({ cloud: { cloudName: 'dprmqr54a' } });

    // useEffect(() => {
    //     console.log("Brewery Coming in From Brewery Route", brewery)
    // })

    const addBeerReview = () => {
        setBeerReviews([...beerReviews, { beer_name: "", rating: 0, notes: "", isFavorite: false }]);
    };

    const updateBeerReview = (index, field, value) => {
        const updatedReviews = [...beerReviews];
        updatedReviews[index][field] = value;
        setBeerReviews(updatedReviews);
    };

    const handleImageChange = (event) => {
        setImageFile(event.target.files[0]);
    };

    const handleImageUpload = async (review_id) => {
        if (!imageFile) return;

        const formData = new FormData();
        formData.append('file', imageFile);
        formData.append('review_id', review_id)

        try {
            const response = await fetch(`${process.env.BACKEND_URL}/api/images`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${store.token}`
                },
                body: formData
            });
            if (response.ok) {
                const data = await response.json();
                setUploadedImageUrl(data.image.image_url);
                setImageFile(null);
                return data;
            } else {
                console.error("Failed to upload image:", response.status, response.statusText);
            }
        } catch (error) {
            console.error("Error uploading image:", error);
        }
    };

    // EJQ - updated the handleSubmit to include images
    const handleSubmit = async (e) => {
        e.preventDefault();
    for (let i = 0; i < beerReviews.length; i++) {
        if (beerReviews[i].rating <= 0 || isNaN(beerReviews[i].rating)) {
            alert(`Please enter a rating higher than 0 for beer ${i + 1}.`);
            return;
        }
    }
        if (isFavoriteBrewery) {
            const checkedFavBreweryData = {
                name: brewery.name,
                id: brewery.id,
                latitude: brewery.latitude,
                longitude: brewery.longitude,
                phone: brewery.phone,
                brewery_type: brewery.brewery_type,
                website_url: brewery.website_url,
                address_1: brewery.address.street,
                city: brewery.address.city,
                state_province: brewery.address.state,
                postal_code: brewery.address.postal_code,
                country: brewery.address.country,
            }
            await actions.addFavoriteBrewery(checkedFavBreweryData);
        }

        let data = await actions.addBreweryReviewToBackend(brewery, overallRating, reviewText, isFavoriteBrewery, beerReviews, data?.id);
        let _image;
        if (imageFile) {
            _image = await handleImageUpload(data.id);
        }

        onSaveReview(brewery, overallRating, reviewText, isFavoriteBrewery, beerReviews, _image 
            ? _image.image_url
            : null
        );
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
                    <input
                        type="checkbox"
                        checked={isFavoriteBrewery}
                        onChange={(e) => setIsFavoriteBrewery(e.target.checked)}
                    />
                    Mark as Favorite Brewery
                </label>
            </div>
            <div>
                <label>Upload Image:</label>
                <input type="file" accept="image/*" onChange={handleImageChange} />
                {uploadedImageUrl && <img src={uploadedImageUrl} alt="Uploaded brewery" style={{ maxWidth: '200px' }} />}
            </div>
            <h3>Beers Tried</h3>
            {beerReviews.map((beerReview, index) => (
                <div key={index}>
                    <label>Beer Name:</label>
                    <input type="text" value={beerReview.beer_name} onChange={(e) => updateBeerReview(index, 'beer_name', e.target.value)} />
                    <label>Rating:</label>
                    <input type="number" value={beerReview.rating} onChange={(e) => updateBeerReview(index, 'rating', e.target.value)} />
                    <label>Notes:</label>
                    <textarea value={beerReview.notes} onChange={(e) => updateBeerReview(index, 'notes', e.target.value)} />
                    {/* <label>
                        <input type="checkbox" checked={beerReview.isFavorite} onChange={(e) => updateBeerReview(index, 'isFavorite', e.target.checked)} />
                        Mark as Favorite Beer
                    </label> */}
                </div>
            ))}
            <button type="button" onClick={addBeerReview}>Add Another Beer</button>
            <button type="submit" className="btn btn-primary">Save Review</button>
        </form>
    );
};