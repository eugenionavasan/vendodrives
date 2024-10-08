import React, { useState, useEffect } from "react";
import CarForm from "../components/CarForm";
import Card from "../components/Card";
import Header from "../components/Header";
import { fetchCars, createCar } from "../services/carService";
import { CarDetails, CarFormDetails } from "../utils/types";

const Main: React.FC = () => {
  const [cards, setCards] = useState<CarDetails[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortCriteria, setSortCriteria] = useState<
    "title" | "price" | "zipCode"
  >("title");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    const loadCars = async () => {
      try {
        const cars = await fetchCars();
        setCards(cars);
      } catch (error) {
        console.error("Error loading cars:", error);
      }
    };

    loadCars();
  }, []);

  const handleFormSubmit = async (carDetails: CarFormDetails) => {
    try {
      const newCar = await createCar(carDetails);
      setCards([...cards, newCar]);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query.toLowerCase());
  };

  const sortCards = (cards: CarDetails[]) => {
    return cards.sort((a, b) => {
      const aValue = a[sortCriteria];
      const bValue = b[sortCriteria];

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
    });
  };

  const filteredCards = cards.filter((card) =>
    card.title.toLowerCase().includes(searchQuery),
  );

  const sortedCards = sortCards(filteredCards);

  return (
    <div className="main-container">
      <Header onSearch={handleSearch} />
      <main className="p-4 bg-white">
        <div className="flex flex-col sm:flex-row">
          <div className="w-full sm:w-1/3 p-4 bg-white">
            {/* CarForm on top for all views */}
            <CarForm onSubmit={handleFormSubmit} />
          </div>
          <div className="w-full sm:w-2/3">
            {/* Sorting Controls */}
            <div className="flex flex-col sm:flex-row sm:justify-end gap-4 mb-4 p-4 bg-white">
              <select
                value={sortCriteria}
                onChange={(e) =>
                  setSortCriteria(
                    e.target.value as "title" | "price" | "zipCode",
                  )
                }
                className="p-2 border border-gray-300 rounded"
              >
                <option value="title">Name</option>
                <option value="price">Price</option>
                <option value="zipCode">Zip Code</option>
              </select>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
                className="p-2 border border-gray-300 rounded"
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
            {/* Cards */}
            <div className="card-container flex flex-col sm:flex-row flex-wrap justify-end ml-auto w-full">
              {sortedCards.map((card) => (
                <Card key={card._id} carDetails={card} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Main;
