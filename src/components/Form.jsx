// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useState } from "react";
import styles from "./Form.module.css";
import Message from "./Message";
import Spinner from "./Spinner";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import BackButton from "./BackButton";
import { useUrlPosition } from "../hooks/useUrlPosition";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useCities } from "../contexts/CitiesProvider";

/////////////////////////////////////////////////////////////
const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client?";

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}
////////////////////////////////////////////////////////////
function Form() {
  const navigate = useNavigate();
  const { addCity, isLoading } = useCities();
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [lat, lng] = useUrlPosition();
  const [isLoadingGeocoding, setIsloadingGeocoding] = useState(false);
  const [emoji, setEmoji] = useState("");
  const [error, setError] = useState("");
  useEffect(
    function () {
      //what we are aiming for is displaying the form but empty, so we will make the initial state empty string and prevent the fetching behaveiour some how to over come the problem of the useEffect fetching when initailized.
      if (!lat && lat !== 0 && !lng && lng !== 0) return;
      async function dataFetch() {
        try {
          setError(false);
          setIsloadingGeocoding(true);
          const res = await fetch(
            `${BASE_URL}latitude=${lat}&longitude=${lng}`
          );
          const data = await res.json();
          if (!data.countryCode) {
            throw new Error("please select only counties from the map 🤗");
          }
          setCityName(data.city || data.locality || "");
          setCountry(data.countryName);
          setEmoji(data.countryCode);
        } catch (err) {
          setError(err.message);
        } finally {
          setIsloadingGeocoding(false);
        }
      }
      dataFetch();
    },
    [lat, lng]
  );
  async function handleSubmit(e) {
    e.preventDefault();
    if (!cityName || !country) return;
    const city = {
      cityName,
      country,
      emoji,
      date,
      notes,
      position: { lat, lng },
    };
    //---hella crucial !!! hella crucial !!!, addCity is async, take care what will happen after it!!!---
    await addCity(city);
    //navigate("/app/cities");
  }
  ////////////////////////////////////////////////////////
  if (error) return <Message message={error} />;
  if (isLoadingGeocoding) return <Spinner />;
  if ((lat === 0 || !lat) && (lng === 0 || !lng))
    return <Message message={"start by clicking on the map!"} />;
  return (
    <form
      onSubmit={handleSubmit}
      className={`${styles.form} ${isLoading ? styles.loading : ""}`}
    >
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        <DatePicker
          id="date"
          selected={date}
          onChange={(date) => setDate(date)}
          dateFormat={"dd/MM/yyyy"}
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary">ADD</Button>
        <BackButton />
      </div>
    </form>
  );
}

export default Form;
