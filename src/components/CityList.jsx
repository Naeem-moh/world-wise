import styles from "./CityList.module.css";
import Spinner from "./Spinner";
import CityItem from "./CityItem";
import Message from "./Message";
import { useCities } from "../contexts/CitiesProvider";

export default function CityList() {
  const { isLoading, cities } = useCities();
  //--waiting for the data fetching--//
  if (isLoading) return <Spinner />;
  //--to make the emtpy case look cool!--//
  if (!cities.length)
    return (
      <Message
        message={"Add your first city by clicking on a city on the map!"}
      />
    );
  //--default scenario--//
  return (
    <ul className={styles.cityList}>
      {cities.map((city) => (
        <CityItem city={city} key={city.id} />
      ))}
    </ul>
  );
}
