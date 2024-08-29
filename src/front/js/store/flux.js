import { BackendURL } from "../component/backendURL";

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
			token: sessionStorage.getItem("token") || null,
			breweryData: [],
			city: "",
			state: "",
			searchedBreweryData: [],
			modalIsOpen: false,
			page: 16,
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
			fetchBreweryInfoForAPI: async () => {
				const store = getStore()
				const actions = getActions()
				try {
					const resp = await fetch(`https://api.openbrewerydb.org/v1/breweries?by_country=united_states&page=${store.page}&per_page=200`, {
						method: "GET",
						headers: {
							"Content-type": "application/json"
						}
					});
					let newPageNumber = store.page + 1
					let data = await resp.json();
					//console.log(data);
					const brewery = new BreweryInfo(data);
					const micro = "micro"
					const nano = "nano"
					const brewpub = "brewpub"
					const regional = "regional"
					const bar = "bar"
					const notClosedBreweries = []
					for(const element of data){
						if(element.brewery_type === micro || element.brewery_type === nano || element.brewery_type === brewpub || element.brewery_type === regional){
							if (element.address_1 === null || element.latitude === null){
							continue
						}
						notClosedBreweries.push(element)} 
					}
					actions.postBreweryInfoToAPI(notClosedBreweries)
					setStore({ page: newPageNumber })
					console.log(store.page)
					return brewery;
				}
				catch (error) {
					console.error("Error fetching brewery info", error);
				}

			},
			postBreweryInfoToAPI: async (notClosedBreweries) => {
				try{
					for(const breweryToBeAdded of notClosedBreweries) {
						let newBrewery = {
							"brewery_name": breweryToBeAdded.name,
							"brewery_type": breweryToBeAdded.brewery_type,
							"address": breweryToBeAdded.address_1,
							"city": breweryToBeAdded.city,
							"state_province": breweryToBeAdded.state_province,
							"postal_code": breweryToBeAdded.postal_code,
							"longitude": breweryToBeAdded.longitude,
							"latitude": breweryToBeAdded.latitude,
							"phone": breweryToBeAdded.phone,
							"website_url": breweryToBeAdded.website_url
						} 
						await fetch("https://silver-space-robot-g4xj5p6796rq39g7g-3001.app.github.dev/api/breweries", {
							method: "POST",
							body: JSON.stringify(newBrewery),
							headers: {
								"Content-Type": "application/json"
							}
						})
				}}
				catch (error) {
					console.error("Error fetching brewery info", error);
				}
			}
		}
	};
};

export default getState;
