import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SearchBar from '../components/SearchBar';
import CharacterCard from '../components/CharacterCard';
import Pagination from '../components/Pagination';
import '../css/Home.css';

function Home() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [genderFilter, setGenderFilter] = useState('all');
  const resultsPerPage = 10;

  useEffect(() => {
    if (query.trim() === '') {
      setResults([]);
      setFilteredResults([]);
      return;
    }
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`https://api.tvmaze.com/search/people?q=${query}`);
        setResults(res.data);
        setError('');
      } catch (err) {
        setError('Error al buscar');
      } finally {
        setLoading(false);
      }
    };
    const delayDebounce = setTimeout(fetchData, 500);
    return () => clearTimeout(delayDebounce);
  }, [query]);

  // Aplica el filtro de género cuando cambian los resultados o el filtro
  useEffect(() => {
    let filtered = results;
    if (genderFilter !== 'all') {
      filtered = results.filter((r) => r.person.gender?.toLowerCase() === genderFilter);
    }
    setFilteredResults(filtered);
    setCurrentPage(1);
  }, [results, genderFilter]);

  const startIndex = (currentPage - 1) * resultsPerPage;
  const paginatedResults = filteredResults.slice(startIndex, startIndex + resultsPerPage);

  return (
    <div className="home-container">
      <div className="filters-wrapper">
  <SearchBar query={query} setQuery={setQuery} />

  {/* Filtro por género */}
  <div className="filter-container">
    <label htmlFor="gender-select">Filtrar por género:</label>
    <select
      id="gender-select"
      value={genderFilter}
      onChange={(e) => setGenderFilter(e.target.value)}
    >
      <option value="all">Todos</option>
      <option value="male">Masculino</option>
      <option value="female">Femenino</option>
    </select>
  </div>
</div>

      {loading && <p className="loading">Cargando...</p>}
      {!loading && error && <p className="error">{error}</p>}
      {!loading && !error && filteredResults.length === 0 && query && (
        <p className="no-results">No se encontraron resultados.</p>
      )}

      <div className="character-grid">
        {paginatedResults.map((r) => (
          <CharacterCard key={r.person.id} person={r.person} />
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(filteredResults.length / resultsPerPage)}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}

export default Home;
