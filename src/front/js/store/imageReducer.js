const imageReducer = (store, action) => {
    switch (action.type) {
        case "SET_USER_IMAGES":
            return {
                ...store,
                userImages: action.payload
            };
        case "ADD_USER_IMAGE":
            return {
                ...store,
                userImages: [...store.userImages, action.payload]
            };
        case "DELETE_USER_IMAGE":
            return {
                ...store,
                userImages: store.userImages.filter(image => image.id !== action.payload)
            };
        default:
            return store;
    }
};

export default imageReducer;