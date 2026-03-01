'use strict';

import React,
{
  useState,
  useEffect,
  useCallback
} from 'react';
import {
  useParams,
  useSearchParams,
  useNavigate
} from 'react-router-dom';
import {
  css
} from '@emotion/core';

import Loading from 'Components/Loading';
import Carousel from 'Components/Carousel';
import Splash from 'Components/Splash';
import Card from 'Components/Card';
import DeckRefresh from './DeckRefresh';

const textElementMinHeight = '6rem';

const textFontSize = '2.2rem';

const splashCharacterElementSize = (
  process.env.OUTPUT_RES /
  2
);

const DeckPage = () => {

  const {
    deckTitle
  } = useParams();

  const [
    searchParams
  ] = useSearchParams();

  const navigate = useNavigate();

  const genre = searchParams.get('genre') ||
    process.env.GENRE;

  const hero = searchParams.get('hero') ||
    process.env.HERO;

  const [
    deck,
    deckSet
  ] = useState(
    null
  );

  const [
    loading,
    loadingSet
  ] = useState(
    true
  );

  const [
    error,
    errorSet
  ] = useState(
    null
  );

  const fetchDeck = useCallback(
    () => {

      loadingSet(true);
      errorSet(null);

      return fetch(
        `/api/deck/${
          encodeURIComponent(deckTitle)
        }?genre=${
          encodeURIComponent(genre)
        }&hero=${
          encodeURIComponent(hero)
        }`
      )
        .then(
          (res) => res.json()
        )
        .then(
          (data) => {

            return (data.redirect)
              ? navigate(
                data.redirect,
                {
                  replace: true
                }
              )
              : (() => {
                deckSet(data);
                loadingSet(false);
              })();
          }
        )
        .catch(
          (err) => {

            errorSet(err.message);
            loadingSet(false);
          }
        );
    },
    [
      deckTitle,
      genre,
      hero,
      navigate
    ]
  );

  useEffect(
    () => {

      fetchDeck();
    },
    [
      fetchDeck
    ]
  );

  const onSplashSpoofInputTriggerHandle = (
    text
  ) => {

    return navigate(
      `/deck/${
        encodeURIComponent(deckTitle)
      }?genre=${
        encodeURIComponent(genre)
      }&hero=${
        encodeURIComponent(text)
      }`
    );
  };

  const refreshRender = () => {

    return (
      <div
        className = {
          `
            refreshContainer
            p-1 m-1
            rounded-circle
            bg-dark text-white
          `
        }
        css = {
          css(
            {
              position: 'absolute',
              zIndex: 2,
              right: 0,
              opacity: .25
            }
          )
        }
      >
        <DeckRefresh />
      </div>
    );
  };

  const splashRender = () => {

    return (
      <Splash
        splash = {
          deck.splash
        }
        textElementMinHeight = {
          textElementMinHeight
        }
        textFontSize = {
          textFontSize
        }
        splashCharacterElementSize = {
          splashCharacterElementSize
        }
        onSplashSpoofInputTrigger = {
          onSplashSpoofInputTriggerHandle
        }
      />
    );
  };

  const cardsRender = () => {

    return deck.cards
      ?.map(
        (
          card,
          index
        ) => {

          return (
            <Card
              key = {
                index
              }
              card = {
                card
              }
              textElementMinHeight = {
                textElementMinHeight
              }
              textFontSize = {
                textFontSize
              }
            />
          );
        }
      );
  };

  const carouselRender = () => {

    return (
      <div
        className = {
          `
            carouselContainer
            w-100 h-100
            rounded rounded-lg
          `
        }
      >
        <Carousel>
          {
            [
              splashRender(),
              ...(cardsRender() || [])
            ]
              .reduce(
                (
                  memo,
                  slide,
                  index
                ) => {

                  return [
                    ...memo,
                    <div
                      key = {
                        index
                      }
                      className = {
                        `carousel-item w-100 h-100${
                          !index
                            ? ' active'
                            : ''
                        }`
                      }
                    >
                      {
                        slide
                      }
                    </div>
                  ];
                },
                []
              )
          }
        </Carousel>
      </div>
    );
  };

  const loadingRender = () => {

    return (
      loading
    ) &&
      <Loading />;
  };

  const errorRender = () => {

    return (
      error
    ) &&
      <div
        className = 'text-danger text-center p-3'
      >
        {
          error
        }
      </div>;
  };

  const contentRender = () => {

    return (
      !loading &&
      deck &&
      deck.splash
    ) &&
      <div
        className =
          'DeckNode w-100 h-100 d-flex justify-content-center'
        css = {
          css(
            {
              position: 'relative'
            }
          )
        }
      >
        {
          refreshRender()
        }
        {
          carouselRender()
        }
      </div>;
  };

  return (
    <div
      className = 'DeckPage h-100'
    >
      {
        contentRender()
      }
      {
        loadingRender()
      }
      {
        errorRender()
      }
    </div>
  );
};

export default DeckPage;
