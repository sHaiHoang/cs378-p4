import React, { useState, useEffect } from "react";
import "./App.css";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";

const API_URL = "https://pokeapi.co/api/v2/pokemon/";

const defaultPokemons = ["pikachu", "charizard", "bulbasaur"];

function App() {
  const [pokemonData, setPokemonData] = useState(null);
  const [selectedPokemon, setSelectedPokemon] = useState("pikachu");
  const [searchPokemon, setSearchPokemon] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [chartData, setChartData] = useState(null);

  // Fetch Pokémon data
  const fetchPokemonData = async (pokemonName) => {
    try {
      const response = await fetch(`${API_URL}${pokemonName.toLowerCase()}`);
      if (!response.ok) throw new Error("Pokémon not found");
      const data = await response.json();
      setPokemonData(data);
      setErrorMessage("");
      setChartData({
        labels: data.stats.map((stat) => stat.stat.name),
        datasets: [
          {
            label: "Base Stats",
            data: data.stats.map((stat) => stat.base_stat),
            backgroundColor: "rgba(255, 99, 132, 0.5)",
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 1,
          },
        ],
      });
    } catch (error) {
      setErrorMessage(`Could not find Pokémon: ${pokemonName}`);
      setPokemonData(null);
      setChartData(null);
    }
  };

  // Handle Pokémon search
  const handleSearchPokemon = () => {
    if (!searchPokemon) return;
    fetchPokemonData(searchPokemon);
  };

  useEffect(() => {
    fetchPokemonData(selectedPokemon);
  }, [selectedPokemon]);

  return (
    <div className="container">
      <div className="pokemon-app">
        <h1>Pokémon Tracker</h1>

        {/* Buttons for default Pokémon */}
        <div className="button-group">
          {defaultPokemons.map((pokemon) => (
            <button
              key={pokemon}
              className={selectedPokemon === pokemon ? "active" : ""}
              onClick={() => setSelectedPokemon(pokemon)}
            >
              {pokemon.charAt(0).toUpperCase() + pokemon.slice(1)}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="input-group">
          <input
            type="text"
            value={searchPokemon}
            onChange={(e) => setSearchPokemon(e.target.value)}
            placeholder="Enter Pokémon name"
          />
          <button className="add-btn" onClick={handleSearchPokemon}>+</button>
        </div>

        {/* Display Pokémon Info */}
        {pokemonData && (
          <div className="pokemon-info">
            <h2>{pokemonData.name.toUpperCase()}</h2>
            <img src={pokemonData.sprites.front_default} alt={pokemonData.name} />
            <p>Type: {pokemonData.types.map((t) => t.type.name).join(", ")}</p>
          </div>
        )}

        {/* Display Pokémon Stats Chart */}
        {chartData && (
          <div className="chart-container">
            <Bar data={chartData} />
          </div>
        )}

        {/* Error Message */}
        {errorMessage && <p className="error">{errorMessage}</p>}
      </div>
    </div>
  );
}

export default App;
