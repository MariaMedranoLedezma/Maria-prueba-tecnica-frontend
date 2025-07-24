import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../css/CharacterCard.css';

function CharacterCard({ person }) {
  const [mainShow, setMainShow] = useState(null);

  useEffect(() => {
    const fetchShow = async () => {
      try {
        const res = await axios.get(
          `https://api.tvmaze.com/people/${person.id}?embed=castcredits`
        );
        const credits = res.data._embedded?.castcredits;
        if (credits && credits.length > 0) {
          const showLinks = credits[0]._links?.show?.href;
          if (showLinks) {
            const showRes = await axios.get(showLinks);
            setMainShow(showRes.data.name);
          }
        }
      } catch (err) {
        setMainShow(null);
      }
    };

    fetchShow();
  }, [person.id]);

  return (
    <Link to={`/personaje/${person.id}`} className="card">
      {person.image ? (
        <img src={person.image.medium} alt={person.name} className="card-image" />
      ) : (
        <div className="card-no-image">Sin imagen</div>
      )}
      <div className="card-content">
        <h3 className="card-name">{person.name}</h3>
        <p className="card-id">Serie principal: {mainShow || 'Desconocida'}</p>
      </div>
    </Link>
  );
}

export default CharacterCard;
