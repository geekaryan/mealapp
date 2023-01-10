import { useEffect, useState } from "react";

import Card from "../UI/Card";
import MealItem from "./MealItem/MealItem";
import classes from "./AvailableMeals.module.css";

const AvailableMeals = () => {
  const [meals, setMeals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [httpError, setError] = useState();
  useEffect(() => {
    const fetchMeals = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          "https://realtime-database-c6d84-default-rtdb.firebaseio.com/meals.json"
        );

        if (!response.ok) {
          throw new Error("Something went wrong");
        }
        const data = await response.json();

        const loadedMeals = [];
        for (const key in data) {
          loadedMeals.push({
            id: key,
            name: data[key].name,
            description: data[key].description,
            price: data[key].price,
          });
        }
        setMeals(loadedMeals);
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        setError(err);
        console.log(err.message);
      }
    };
    fetchMeals();
  }, []);

  if (isLoading) {
    return <section className={classes.MealsLoading}>Loading...</section>;
  }

  if (httpError) {
    return (
      <section className={classes.MealsError}>
        <p>{httpError}</p>
      </section>
    );
  }

  console.log(meals);
  const mealsList = meals.map((meal) => (
    <MealItem
      key={meal.id}
      id={meal.id}
      name={meal.name}
      description={meal.description}
      price={meal.price}
    />
  ));

  return (
    <section className={classes.meals}>
      <Card>
        <ul>{mealsList}</ul>
      </Card>
    </section>
  );
};

export default AvailableMeals;
