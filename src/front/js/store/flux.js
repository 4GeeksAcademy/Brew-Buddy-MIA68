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
		this.street = resultFromServer.street
	}
}
class Result {
}
const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			token: sessionStorage.getItem("token") || "",
			breweryData: [],
			beerData: [],
			journey: [],
			city: "",
			state: "",
			searchedBreweryData: [],
			modalIsOpen: false,
			favoriteBeers: [],
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
						setStore({ token: data.access_token })
						console.log("login successful");
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
			addFavoriteBrewery: async (brewery) => {
			try {
				const resp = await fetch(process.env.BACKEND_URL+"/api/favorite_breweries/" +brewery.id, {
					method: "POST",
					headers: {
						Authorization: "Bearer " + sessionStorage.getItem("token")
					}
				})
				if (response.ok) {
					const data = await response.json();
					console.log("brewery added favorites");
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
					const response = await fetch(`${process.env.BACKEND_URL}/brewery/beers/` + uid, {
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
			// you need have a createFavoriteBeer (POST REQUEST) function then can attach it to card button
			// probably the same thing for people
		}
	};
};

export default getState;
