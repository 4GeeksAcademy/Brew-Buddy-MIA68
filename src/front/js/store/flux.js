import { SignUp } from "../pages/SignUp";

class BreweryInfo {
	constructor(resultFromServer) {
		this.id = resultFromServer.id;
		this.name = resultFromServer.name;
		this.brewery_type = resultFromServer.brewery_type;
		this.address_1 = resultFromServer.address_1;
		this.address_2 = resultFromServer.address_2;
		this.address_3 = resultFromServer.address_3;
		this.city = resultFromServer.city;
		this.state_province = resultFromServer.state_province;
		this.postal_code = resultFromServer.postal_code
		this.country = resultFromServer.country;
		this.longitude = resultFromServer.longitude;
		this.latitude = resultFromServer.latitude;
		this.phone = resultFromServer.phone
		this.website_url = resultFromServer.website_url
		this.state = resultFromServer.state;
		this.street = resultFromServer.street;
	}
}
class Address {
	constructor(breweryInfo) {
		this.street = breweryInfo.street || breweryInfo.address_1;
		this.city = breweryInfo.city;
		this.state = breweryInfo.state;
		this.postal_code = breweryInfo.postal_code;
		this.country = breweryInfo.country
	}
}
class BreweryDestination {
	constructor(breweryInfo) {
		this.id = breweryInfo.id;
		this.name = breweryInfo.name;
		this.brewery_type = breweryInfo.brewery_type;
		this.phone = breweryInfo.phone
		this.website_url = breweryInfo.website_url;
		this.address = new Address(breweryInfo); //create an address instance using BreweryInfo
	}
}
class Route {
	constructor(breweryDestination, travelTime, miles) {
		this.breweryDestination = breweryDestination; // this is an instance of the brewery destination class
		this.travelTime = travelTime; //shown in minutes ideally
		this.miles = miles //shown in miles ideally.. Km?
	}
}
class Journey {
	constructor() {
		this.routes = []; // list of route objects
		this.breweryReviews = [];
		this.activeRouteIndex = -1;
	}
	addRoute(route) {
		this.routes.push(route);
	}
	addBreweryReview(breweryReview) {
		this.breweryReviews.push(breweryReview);
	}
	getBreweryReview(breweryId) {
		return this.breweryReviews.find(review => review.brewery.id === breweryId);
	}
	setActiveRoute(index) {
		if (index >= 0 && index < this.routes.length) {
			this.activeRouteIndex = index;
		} else {
			throw new error("Invalid route index.");
		}
	}
	getActiveRoute() {
		if (this.activeRouteIndex !== -1) {
			return this.routes[this.activeRouteIndex];
		}
		return null;
	}
	getTotalTravelTime() {
		return this.routes.reduce((total, route) => total + route.travelTime, 0)
	}
	getTotalMiles() {
		return this.routes.reduce((total, route) => total + route.miles)
	}
}

class BeerReview {
	constructor(beerName, rating, notes = "", isFavorite = false) {
		this.beerName = beerName;
		this.rating = rating;
		this.notes = notes;
		this.isFavorite = isFavorite;
		this.dateTried = new Date();
	}
}
class BreweryReview {
	constructor(brewery, overallRating, reviewText = "", isFavoriteBrewery = false) {
		this.brewery = brewery;
		this.overallRating = overallRating;
		this.reviewText = reviewText;
		this.beerReviews = [];
		this.isFavoriteBrewery = isFavoriteBrewery;
		this.visitDate = new Date();
	}

	// Method to add a beer review
	addBeerReview(beerReview) {
		this.beerReviews.push(beerReview);
	}
}
const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			token: sessionStorage.getItem("token") || null,
			breweryData: [],
			journey: [],
			city: "",
			state: "",
			searchedBreweryData: [],
			modalIsOpen: false,
		},
		actions: {
			signUp: async (email, password) => {
				try {
					const response = await fetch(`${process.env.BACKEND_URL}/api/signup`, {
						method: "POST",
						headers: {
							"Content-type": "application/json"
						},
						body: JSON.stringify({ email, password })
					})
					if (response.ok) {
						const data = await response.json();
						console.log("signup successful", data);
						return { ok: true };
					} else {
						const errorData = await response.json();
						console.error("signup failed", errorData)

					}
				} catch (error) {
					console.error("error during signup", error);
					return { ok: false, error: error.message };
				}
			},

			login: async (email, password) => {
				try {
					const response = await fetch(`${process.env.BACKEND_URL}/api/login`, {
						method: "POST",
						headers: {
							"Content-type": "application/json"
						},
						body: JSON.stringify({ email, password })
					})
					if (response.ok) {
						const data = await response.json();
						sessionStorage.setItem("token", data.access_token);
						setStore({ token: data.access_token })
						console.log("login successful", data);
					} else {
						const errorData = await response.json();
						console.error("login failed", errorData);
					}
				} catch (error) {
					console.error("error during login", error);
				}
			},

			logout: () => {
				try {
					sessionStorage.removeItem("token");
					setStore({ token: null })
					console.log("logout successful");
				} catch (error) {
					console.error("error during logout", error);
				}
			},

			//starter function used to get us going.. it fetches 3 breweries at the moment
			fetchBreweryInfo: async () => {
				try {
					const resp = await fetch("https://api.openbrewerydb.org/v1/breweries?per_page=3", {
						method: "GET",
						headers: {
							"Content-type": "application/json"
						}
					});
					let data = await resp.json();
					console.log(data);
					const brewery = new BreweryInfo(data);
					setStore({ breweryData: data })
					return brewery;
				} catch (error) {
					console.error("Error fetching brewery info", error);
				}
			},
			fetchBreweryInfoTEST: async () => {
				try {
					const resp = await fetch("https://api.openbrewerydb.org/v1/breweries?per_page=3", {
						method: "GET",
						headers: {
							"Content-type": "application/json"
						}
					});
					let data = await resp.json();
					console.log(data);
					const breweryInfos = data.map(brewery => new BreweryInfo(brewery));
					// Create routes based on the brewery information (for example purposes, using dummy travel times and distances)
					const routes = breweryInfos.map(info => new Route(new BreweryDestination(info), Math.floor(Math.random() * 60), Math.floor(Math.random() * 20)));
					const journey = new Journey();
					routes.forEach(route => journey.addRoute(route));
					journey.setActiveRoute(0);
					setStore({
						breweryData: breweryInfos,
						routes: routes,
						journey: journey
					});
					return journey;
				} catch (error) {
					console.error("Error fetching brewery info", error);
				}
			},
			searchFunctionWithCity: async () => {
				try {
					const store = getStore();
					const breweries = [];
					const response = await fetch(`https://api.openbrewerydb.org/v1/breweries?by_city=${store.city}`, {
						method: "GET",
						headers: {
							"Content-type": "application/json"
						}
					});
					let data = await response.json();
					console.log(data)
					const brewery = new BreweryInfo(data);
					data.forEach(element => {
						if (element.state == store.state) {
							breweries.push(element)
						}
					});
					setStore({ breweryData: breweries })
					console.log(store.breweryData)
					return brewery
				} catch (error) {
					console.error("Error fetching brewery info", error);
				}
			},
			searchFunctionWithLocation: async () => {
				const store = getStore();
				const breweries = [];
				if ("geolocation" in navigator) {
					try {
						navigator.geolocation.getCurrentPosition(async (position) => {
							const longitude = position.coords.longitude;
							const latitude = position.coords.latitude;
							const response = await fetch(`https://api.openbrewerydb.org/v1/breweries?by_dist=${latitude},${longitude}&per_page=10`)
							let data = await response.json();
							const brewery = new BreweryInfo(data);
							data.forEach(element => {
								breweries.push(element)
							})
							setStore({ breweryData: breweries })
							console.log(store.breweryData)
							return brewery
						})
					} catch (error) {
						console.error("Error fetching brewery info", error)
					}
				} else {
					console.log("Geolocation is NOT available")
				};
			},
			toggleSearch: () => {
				const store = getStore();
				if (store.modalIsOpen === false) {
					setStore({ modalIsOpen: true })
				} else {
					setStore({ modalIsOpen: false, state: "", city: "" })
				}
			},
			handleSearch: (city, state) => {
				const actions = getActions();
				setStore({ city: city, state: state })
				actions.searchFunctionWithCity()
			},
			//function used to add individual objects into the routes array in the store
			addToCurrentJourney: async (breweryObject) => {
				try {

					const store = getStore();
					// Create a BreweryDestination from the breweryObject
					const breweryDestination = new BreweryDestination(breweryObject);
					// Create a new Route with the BreweryDestination
					const newRoute = new Route(breweryDestination, 30, 10); // Replace 30 and 10 with actual travel time and miles
					// Initialize a new journey if necessary
					let currentJourney;
					if (store.journey.length === 0) {
						currentJourney = new Journey();
						setStore({ ...store, journey: [currentJourney] });
					} else {
						// Retrieve the existing journey
						currentJourney = store.journey[0];
						// If the existing journey is not an instance of Journey, reinitialize it
						if (!(currentJourney instanceof Journey)) {
							console.warn("Reinitializing current journey");
							currentJourney = new Journey();
							setStore({ ...store, journey: [currentJourney] });
						}
					}
					// Add the new route to the journey
					currentJourney.addRoute(newRoute);
					setStore({ ...store, journey: [currentJourney] });
					console.log(store.journey[0].routes[0].travelTime);
				} catch (error) {
					console.error("Error adding to current journey", error);
				}
			},
		}
	};
};

export default getState;
