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
          (res) => (!res.ok)
            ? Promise.reject(
              new Error(`Server error: ${res.status}`)
            )
            : res.json()
        )
        .then(
          (data) => {

            deckSet(data);
            loadingSet(false);

            const actualTitle = data?.splash?.title;

            return (actualTitle && actualTitle !== deckTitle)
              ? window.history.replaceState(
                null,
                '',
                `/deck/${
                  encodeURIComponent(actualTitle)
                }?genre=${
                  encodeURIComponent(genre)
                }&hero=${
                  encodeURIComponent(hero)
                }`
              )
              : null;
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

    const title = deck?.splash?.title || deckTitle;

    return navigate(
      `/deck/${
        encodeURIComponent(title)
      }?genre=${
        encodeURIComponent(genre)
      }&hero=${
        encodeURIComponent(text)
      }`
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
    ) && (
      <div
        className='LoadingOverlay'
        css={css({
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          transition: 'all 0.3s ease'
        })}
      >
        <Loading />
      </div>
    );
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
      deck &&
      deck.splash
    ) &&
      <div
        className =
          'DeckNode w-100 h-100 d-flex justify-content-center'
        css = {
          css(
            {
              position: 'relative',
              filter: loading ? 'grayscale(50%)' : 'none',
              transition: 'filter 0.3s ease'
            }
          )
        }
      >
        {
          carouselRender()
        }
      </div>;
  };

  return (
    <div
      className = 'DeckPage h-100'
      css={css({ position: 'relative' })}
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
