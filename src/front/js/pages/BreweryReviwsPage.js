import React, { useContext, useState, useCallback } from "react";
import { Context } from "../store/appContext";
import brewbuddyimg from "../../img/DALL·E 2024-08-18.png"
import "../../styles/home.css";
import { BreweryCard, JourneyCard, ReviewCard } from "../component/BootstrapCard";
import { ReviewForm } from '../component/ReviewForm';
import "../../styles/BreweryRoute.css"
import { useParams } from "react-router-dom";

export const BreweryReviews = () => {
    const { store, actions } = useContext(Context);
    const { id } = useParams()
    const breweryReviews = id in store.reviewsObject ? store.reviewsObject[id] : [];
    // store.reviewsObject.forEach(review => {

    // });
    // const eachReview = store.reviewsObject.map((breweryReviews, index) => (
    //     <BreweryCard key={index} breweryReviews={breweryReviews} />
    // ))
    return (
        <div>
            {breweryReviews.map((review, index) => (
                <ReviewCard
                    key={index}
                    review={review}
                    reviewNumber={index + 1}
                />
            ))}
            {breweryReviews.length < 1 && <p>No Reviews Found!</p>}
        </div>
    )
}