import styles from "./CountryList.module.css";
import Spinner from "./Spinner";
import CountryItem from "./CountryItem";
import Message from "./Message";
import { useCities } from "../contexts/CitiesProvider";

export default function CountryList() {
  const { isLoading, cities } = useCities();

  //--waiting for the data fetching--//
  if (isLoading) return <Spinner />;
  //--to make the emtpy case look cool!--//
  if (!cities.length)
    return (
      <Message
        message={"Add your first country by clicking on a cities on the map!"}
      />
    );
  //--default scenario--// n n*n -
  const countries = cities.reduce((acc, curr) => {
    if (!acc.some((el) => el.country === curr.country)) return [...acc, curr];
    return acc;
  }, []);
  return (
    <ul className={styles.countryList}>
      {countries.map((country) => (
        <CountryItem country={country} key={country.id} />
      ))}
    </ul>
  );
}
