'use strict';

import React,
{
  useRef,
  useEffect
} from 'react';
import {
  createFragmentContainer,
  graphql
} from 'react-relay';
import {
  css
} from '@emotion/core';
import {
  useSwipeable
} from 'react-swipeable';

const Carousel = (
  props
) => {

  const interval = 7000;

  const swipeableHandlers = useSwipeable(
    {
      onSwipedLeft() {

        return $(
          carouselRef.current
        )
          .carousel(
            'next'
          )
          .carousel(
            {
              ride: false
            }
          );
      },
      onSwipedRight() {

        return $(
          carouselRef.current
        )
          .carousel(
            'prev'
          )
          .carousel(
            {
              ride: false
            }
          );
      }
    }
  );

  const carouselRef = useRef(
    null
  );

  useEffect(
    () => {

      $(
        carouselRef.current
      )
        .carousel(
          {
            ride: false,
            interval
          }
        )
        .carousel(
          'pause'
        );
    }
  );

  const onClickHandle = (event) => {

    event.preventDefault();
    event.stopPropagation();

    return Promise.resolve(
      $(
        carouselRef.current
      )
        .carousel(
          $(
            event.currentTarget
          )
            .data(
              'slide'
            )
        )
        .carousel(
          {
            ride: true
          }
        )
    );
  };

  const renderFn = () => {
    return (
      <div
        ref = {
          carouselRef
        }
        className = 'w-100 h-100 slide'
        css = {
          css(
            {
              position: 'relative'
            }
          )
        }
      >
        <a
          css = {
            css(
              {
                position: 'absolute',
                zIndex: 1,
                top: '50%',
                transform: 'translateY(-50%)',
                left: 10
              }
            )
          }
          href = '#'
          data-slide = 'prev'
          onClick = {
            onClickHandle
          }
        >
          <div
            className = 'rounded-circle'
            css = {
              css(
                {
                  padding: '5px 7px 0px 5px',
                  backgroundColor: 'rgba(0, 0, 0, 0.25)'
                }
              )
            }
          >
            <span
              className = 'carousel-control-prev-icon'
            ></span>
          </div>
        </a>

        <div
          className = 'carousel-inner w-100 h-100'
        >
          {
            props.children
          }
        </div>

        <a 
          css = {
            css(
              {
                position: 'absolute',
                zIndex: 1,
                top: '50%',
                transform: 'translateY(-50%)',
                right: 10
              }
            )
          }
          href = '#'
          data-slide = 'next'
          onClick = {
            onClickHandle
          }
        >
          <div
            className = 'rounded-circle'
            css = {
              css(
                {
                  padding: '5px 5px 0px 7px',
                  backgroundColor: 'rgba(0, 0, 0, 0.25)'
                }
              )
            }
          >
            <span
              className = 'carousel-control-next-icon'
            ></span>
          </div>
        </a>
      </div>
    );
  };

  return (
    <div
      className = 'Carousel w-100 h-100'
      {
        ...swipeableHandlers
      }
    >
      {
        renderFn()
      }
    </div>
  );
};

export default createFragmentContainer(
  Carousel,
  {
    viewer: graphql`
      fragment Carousel_viewer on Viewer {
        id
      }
    `
  }
);
