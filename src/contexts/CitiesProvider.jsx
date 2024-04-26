//this would be called as any normal component, context's value would be determined
//context compoenents and subscribtions are rerendered even when unmounted
import { createContext, useContext, useReducer } from "react";
import { useEffect } from "react";
const CitiesContext = createContext();
const BASE_URL = "http://localhost:8000";

const initialState = {
  ciites: [],
  isLoading: false,
  currentCity: {},
  error: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };
    case "cities/loaded":
      return { ...state, isLoading: false, cities: action.payload };
    case "rejected":
      return { ...state, error: action.payload, isLoading: false };
    case "city/loaded":
      return { ...state, isLoading: false, currentCity: action.payload };
    case "city/added":
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
      };
    case "city/deleted":
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => action.payload !== city.id),
      };
    default:
      throw new Error("undefined action type");
  }
}
function CitiesProvider({ children }) {
  const [{ cities, isLoading, currentCity, error }, dispatch] = useReducer(
    reducer,
    initialState
  );

  //only the first render time like any other.
  useEffect(() => {
    async function fetchData() {
      try {
        dispatch({ type: "loading" });
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();
        dispatch({ type: "cities/loaded", payload: data });
      } catch (error) {
        dispatch({
          type: "rejected",
          payload: `Data fetching error :${error.name}`,
        });
      }
    }
    fetchData();
  }, []);

  async function getCity(id) {
    if (currentCity.id === id) return;
    try {
      dispatch({ type: "loading" });
      const res = await fetch(`${BASE_URL}/cities/${id}`);
      const data = await res.json();
      dispatch({ type: "city/loaded", payload: data });
    } catch (error) {
      dispatch({
        type: "rejected",
        payload: `city Data fetching error :${error.name}`,
      });
    }
  }

  async function deleteCity(id) {
    try {
      dispatch({ type: "loading" });
      await fetch(`${BASE_URL}/cities/${id}`, {
        method: "DELETE",
      });
      dispatch({ type: "city/deleted", payload: id });
    } catch (error) {
      dispatch({
        type: "rejected",
        payload: `city Data deletion error :${error.name}`,
      });
    }
  }

  async function addCity(city) {
    try {
      dispatch({ type: "loading" });
      const res = await fetch(`${BASE_URL}/cities`, {
        method: "POST",
        body: JSON.stringify(city),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      dispatch({ type: "city/added", payload: data });
    } catch (error) {
      dispatch({
        type: "rejected",
        payload: `city Data addition error :${error.name}`,
      });
    }
    //---The following code won't work because useNavigate is a custom hook specific to react-router.
    //navigate("/app/cities");
    //this code is related to another component
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        error,
        getCity,
        addCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const x = useContext(CitiesContext);
  // empty object is a truthy value.
  return x === undefined ? new Error("context is used out of it's context") : x;
}

export { CitiesProvider, useCities };
