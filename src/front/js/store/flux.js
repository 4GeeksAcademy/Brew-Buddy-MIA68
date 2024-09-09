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
		this.longitude = parseFloat(resultFromServer.longitude);
		this.latitude = parseFloat(resultFromServer.latitude);
		this.phone = resultFromServer.phone
		this.website_url = resultFromServer.website_url
		this.state = resultFromServer.state;
		this.street = resultFromServer.street
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
		this.longitude = breweryInfo.longitude;
		this.latitude = breweryInfo.latitude;
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
			token: sessionStorage.getItem("token") || "",
			userEmail: sessionStorage.getItem("userEmail") || null,
			breweryData: [],
			beerData: [],
			journey: new Journey(),
			city: "",
			state: "",
			searchedBreweryData: [],
			modalIsOpen: false,
			favoriteBreweries: [],
			favoriteBeers: [],
			allBeers: [],
			favoritePeople: []
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
						sessionStorage.setItem("userEmail", data.email);
						setStore({
							token: data.access_token,
							userPoints: data.total_points,
							userEmail: email
						});
						console.log("login successful");
						return {
							success: true,
							points_earned: data.points_earned,
							total_points: data.total_points
						};
					} else {
						const errorData = await response.json();
						console.error("login failed", errorData);
						return { success: false };
					}
				} catch (error) {
					console.error("error during login", error);
					return { success: false };
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
					const journey = getStore().journey;
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
			addFavoriteBrewery: async (brewery) => {
				console.log(brewery)
				try {
					const resp = await fetch(process.env.BACKEND_URL + "/api/favorite_breweries/" + brewery.id, {
						method: "POST",
						headers: {
							"Content-Type": "application/json", 
							Authorization: "Bearer " + sessionStorage.getItem("token")
						}
					});
					if (resp.ok) {
						const data = await response.json();
						console.log("brewery added favorites: ", data);

						const store=getStore();
						setStore({
							favoriteBreweries: [ ...store.favoriteBreweries, brewery ]
						});
					} else {
						const errorData = await response.json();
						console.error("failed to add", errorData);
					}
				} catch (error) {
					console.error("error adding brewery", error);
				}


			},
			searchFunctionWithCity: async () => {
				try {
					const store = getStore();
					const actions = getActions();
					const breweries = []
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
					actions.createBreweryList(breweries)
				} catch (error) {
					console.error("Error fetching brewery info", error);
				}
			},
			searchFunctionWithLocation: async () => {
				const store = getStore();
				const actions = getActions();
				if ("geolocation" in navigator) {
					try {
						navigator.geolocation.getCurrentPosition(async (position) => {
							const longitude = position.coords.longitude;
							const latitude = position.coords.latitude;
							const response = await fetch(`https://api.openbrewerydb.org/v1/breweries?by_dist=${latitude},${longitude}&per_page=20`)
							let data = await response.json();
							actions.createBreweryList(data)
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

			createBreweryList: (data) => {
				const store = getStore();
				const brewery = new BreweryInfo(data);
				const breweries = [];
				const micro = "micro";
				const nano = "nano";
				const brewpub = "brewpub";
				const regional = "regional";
				for (const element of data) {
					if (element.brewery_type === micro || element.brewery_type === nano || element.brewery_type === brewpub || element.brewery_type === regional) {
						if (element.address_1 === null || element.latitude === null) {
							continue
						}
						breweries.push(element)
					}

				}
				setStore({ breweryData: breweries })
				console.log(store.breweryData)
				return brewery
			},
			fetchUserPoints: async () => {
				try {
					const resp = await fetch("/api/user/points", {
						headers: { 'Authorization': `Bearer ${token}` },
					});
					const data = await resp.json();
					setStore({ userPoints: data.points });
				} catch (error) {
					console.error("Error fetching user points", error);
				}
			},
			setUserPoints: (points) => {
				setStore({ userPoints: points });
			},
			updateUserPoints: (newPoints) => {
				setStore({ userPoints: newPoints });
			},
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
						setStore({ ...store, journey: currentJourney });
					} else {
						// Retrieve the existing journey
						currentJourney = store.journey;
						// If the existing journey is not an instance of Journey, reinitialize it
						if (!(currentJourney instanceof Journey)) {
							console.warn("Reinitializing current journey");
							currentJourney = new Journey();
							setStore({ ...store, journey: currentJourney });
						}
					}
					// Add the new route to the journey
					currentJourney.addRoute(newRoute);
					setStore({ ...store, journey: currentJourney });
				} catch (error) {
					console.error("Error adding to current journey", error);
				}
			},
			getFavoriteBeers: async () => {
				try {
					const response = await fetch(`${process.env.BACKEND_URL}/api/favorite_beers`, {
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${sessionStorage.getItem("token")}`,
						},
					});

					if (response.ok) {
						const data = await response.json();
						setStore({ favoriteBeers: data });
					} else {
						console.error("Failed to fetch favorite beers", response.status);
					}
				} catch (error) {
					console.error("Error fetching favorite beers", error);
				}
			},
			getBreweryBeers: async (uid) => {
				const store = getStore();
				try {
					const response = await fetch(`${process.env.BACKEND_URL}/api/brewery/beers/` + uid, {
						method: "GET",
						headers: {
							"Content-type": "application/json"
						}
					})
					const data = await response.json();
					setStore({ beerData: data });
				}
				catch (error) {
					console.error("Error fetching beer info", error);
				}
			},
			getAllBeers: async () => {
				try {
					const response = await fetch(`${process.env.BACKEND_URL}/api/beers`, {
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${sessionStorage.getItem("token")}`,
						},
					});

					if (response.ok) {
						const data = await response.json();
						setStore({ allBeers: data });
					} else {
						console.error("Failed to fetch favorite beers", response.status);
					}
				} catch (error) {
					console.error("Error fetching favorite beers", error);
				}
			},

			addFavoriteBeer: async (beerId) => {
				try {
					const response = await fetch(`${process.env.BACKEND_URL}/api/favorite_beers/${beerId}`, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${sessionStorage.getItem("token")}`,
						},
					});

					if (response.ok) {
						await getActions().getFavoriteBeers();
						console.log("Favorite beer added successfully");
						return true;
					} else {
						console.error("Error adding favorite beer");
						return false;
					}
				} catch (error) {
					console.error("Error adding favorite beer", error);
					return false;
				}
			},
			getFavoritePeople: async () => {
				let response = await fetch(process.env.BACKEND_URL + "/api/favorite_users", {
					headers: {
						"Content-Type": "application/json",
						Authorization: "Bearer " + sessionStorage.getItem("token")
					}
				})
				if (response.status != 200) {
					console.log("error occurred while getting favorite users", response.status)
					return false
				}
				let data = await response.json()
				setStore({ favoritePeople: data })
			},
			addBreweryReview: async (brewery, overallRating, reviewText, isFavoriteBrewery, beerReviews) => {
				const store = getStore();
				const journeys = store.journey;
				const currentJourney = journeys[0]

				const breweryReview = new BreweryReview(brewery, overallRating, reviewText, isFavoriteBrewery)

				beerReviews.forEach(beerReview => {
					breweryReview.addBeerReview(new BeerReview(beerReview.beerName, beerReview.rating, beerReview.notes, beerReview.isFavorite));
				});
				currentJourney.addBreweryReview(breweryReview);
				setStore({ journey: journeys });
			},
			// you need have a createFavoriteBeer (POST REQUEST) function then can attach it to card button
			// probably the same thing for people
		}
	};
};

export default getState;
