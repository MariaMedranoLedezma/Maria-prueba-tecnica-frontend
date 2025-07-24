import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import '../css/Detail.css';

function Detail() {
  const { id } = useParams();
  const [person, setPerson] = useState(null);
  const [shows, setShows] = useState([]); // <-- nuevas series
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener datos del personaje con créditos embebidos
        const res = await axios.get(`https://api.tvmaze.com/people/${id}?embed=castcredits`);
        setPerson(res.data);

        // Extraer los créditos
        const castCredits = res.data._embedded?.castcredits || [];

        // Obtener hasta 2 shows diferentes
        const showUrls = castCredits
          .slice(0, 5) // limitar por si hay muchos
          .map((credit) => credit._links?.show?.href)
          .filter(Boolean);

        const uniqueUrls = [...new Set(showUrls)].slice(0, 2);

        // Fetch de los shows
        const showResponses = await Promise.all(
          uniqueUrls.map((url) => axios.get(url))
        );

        const showNames = showResponses.map((res) => res.data.name);
        setShows(showNames);
      } catch {
        setPerson(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <p className="loading">Cargando...</p>;
  if (!person) return <p className="error">No se encontró el personaje.</p>;

  return (
    <div className="detail-container">
      <Link to="/" className="back-link">⬅ Volver</Link>
      <h1 className="detail-name">{person.name}</h1>
      {person.image && <img src={person.image.medium} alt={person.name} className="detail-image" />}
      <div className="detail-info">
        <p><span className="label">Género:</span> {person.gender}</p>
        <p><span className="label">Fecha de nacimiento:</span> {person.birthday || 'No disponible'}</p>
        <p><span className="label">País:</span> {person.country?.name || 'Desconocido'}</p>
        <p><span className="label">URL:</span>{' '}
          <a href={person.url} className="detail-link" target="_blank" rel="noreferrer">
            {person.url}
          </a>
        </p>

        {/* NUEVO: Mostrar series */}
        <div className="detail-shows">
          <p><span className="label">Series principales:</span></p>
          <ul>
            {shows.length > 0 ? (
              shows.map((name, index) => <li key={index}>📺 {name}</li>)
            ) : (
              <li>No disponibles</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Detail;
