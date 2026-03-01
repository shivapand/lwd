'use strict';

import React,
{
  useEffect
} from 'react';
import {
  useNavigate
} from 'react-router-dom';

const Home = () => {

  const navigate = useNavigate();

  useEffect(
    () => {

      navigate(
        `/deck/random?genre=${
          process.env.GENRE
        }&hero=${
          encodeURIComponent(process.env.HERO)
        }`,
        {
          replace: true
        }
      );
    },
    [
      navigate
    ]
  );

  return (
    <div
      className = 'Home'
    >
    </div>
  );
};

export default Home;
