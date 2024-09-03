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
			userEmail: sessionStorage.getItem("userEmail") || null,
			breweryData: [],
			city: "",
			state: "",
			searchedBreweryData: [],
			modalIsOpen: false,
			userPoints: 0,
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
					});
					if (response.ok) {
						const data = await response.json();
						sessionStorage.setItem("token", data.access_token);
						sessionStorage.setItem("userEmail", data.email);
						setStore({ 
							token: data.access_token,
							userPoints: data.total_points,
							userEmail: email
						});
						
						console.log("Login successful", data);
						return { 
							success: true, 
							points_earned: data.points_earned, 
							total_points: data.total_points 
						};
					} else {
						const errorData = await response.json();
						console.error("Login failed", errorData);
						return { success: false };
					}
				} catch (error) {
					console.error("Error during login", error);
					return { success: false };
				}
			},

			logout: () => {
				try {
					sessionStorage.removeItem("token");
					setStore({ token: null, userEmail: null })
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
			  }

		}
	};
};

export default getState;
