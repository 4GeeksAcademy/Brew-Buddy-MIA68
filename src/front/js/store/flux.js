import { BackendURL } from "../component/backendURL";

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
			breweryData: [],
			demo: [
				{
					title: "FIRST",
					background: "white",
					initial: "white"
				},
				{
					title: "SECOND",
					background: "white",
					initial: "white"
				}
			],
			city: "",
			state: "",
			searchedBreweryData: [],
			modalIsOpen: false,
			page: 1,
		},
		actions: {
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
				try {
					const resp = await fetch(`https://api.openbrewerydb.org/v1/breweries?by_country=united_states&page=${store.page}&per_page=200`, {
						method: "GET",
						headers: {
							"Content-type": "application/json"
						}
					});
					let newPageNumber = store.page + 1
					let data = await resp.json();
					console.log(data);
					const brewery = new BreweryInfo(data);
					for (const element of data) {
						if (element.brewery_type != "closed" || element.brewery_type != "planning") {
							const response = await fetch(`${BackendURL}` + "/breweries", {
								method: "POST",
								body: {
									"brewery_name": element.name,
									"brewery_type": element.brewery_type,
									"address": element.address_1,
									"city": element.city,
									"state_province": element.state_province,
									"longitude": element.longitude,
									"latitude": element.latitude,
									"phone": element.phone,
									"website_url": element.website_url
								}
							})
						}

					};
					setStore({ page: newPageNumber })
					console.log(store.page)
					return brewery;
				}
				catch (error) {
					console.error("Error fetching brewery info", error);
				}

			},
			postBreweryInfoToAPI: async () => {

			}
		}
	};
};

export default getState;
