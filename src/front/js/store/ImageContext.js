import React, { createContext, useReducer, useEffect } from "react";
import PropTypes from "prop-types";
import imageReducer from "./imageReducer";

export const ImageContext = createContext(null);

const ImageContextProvider = props => {
    const APIurl = process.env.REACT_APP_API_URL + "/images";
    const [store, dispatch] = useReducer(imageReducer, {
        userImages: []
    });

    const actions = {
        fetchUserImages: async () => {
            try {
                const response = await fetch(APIurl, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (response.ok) {
                    const images = await response.json();
                    dispatch({
                        type: "SET_USER_IMAGES",
                        payload: images
                    });
                } else {
                    console.error("Failed to fetch images:", response.statusText);
                }
            } catch (error) {
                console.error("Error fetching images:", error);
            }
        },

        uploadUserImage: async (formData) => {
            try {
                const response = await fetch(APIurl, {
                    method: "POST",
                    body: formData,
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (response.ok) {
                    const newImage = await response.json();
                    dispatch({
                        type: "ADD_USER_IMAGE",
                        payload: newImage.image
                    });
                    return true;
                } else {
                    console.error("Failed to upload image:", response.statusText);
                    return false;
                }
            } catch (error) {
                console.error("Error uploading image:", error);
                return false;
            }
        },

        deleteUserImage: async (id) => {
            try {
                const response = await fetch(`${APIurl}/${id}`, {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (response.ok) {
                    dispatch({
                        type: "DELETE_USER_IMAGE",
                        payload: id
                    });
                    return true;
                } else {
                    console.error("Failed to delete image:", response.statusText);
                    return false;
                }
            } catch (error) {
                console.error("Error deleting image:", error);
                return false;
            }
        }
    };

    useEffect(() => {
        actions.fetchUserImages();
    }, []);

    return (
        <ImageContext.Provider value={{ store, actions }}>
            {props.children}
        </ImageContext.Provider>
    );
};

export default ImageContextProvider;

ImageContextProvider.propTypes = {
    children: PropTypes.node.isRequired
}