'use strict';

import React,
{
  useState
} from 'react';
import {
  useSearchParams
} from 'react-router-dom';
import {
  css
} from '@emotion/core';

const SplashSpoofInput = (
  props
) => {

  const [
    searchParams
  ] = useSearchParams();

  const [
    text,
    textSet
  ] = useState(
    ''
  );

  const onChangeHandle = (
    event
  ) => {

    return textSet(
      event.target.value
    );
  };

  const onSubmitHandle = (
    event
  ) => {

    event.preventDefault();
    event.stopPropagation();

    return props.onSplashSpoofInputTrigger(
      text
    );
  };

  const onKeyDownHandle = (
    event
  ) => {

    return (event.key === 'Enter')
      ? onSubmitHandle(event)
      : event;
  };

  const renderFn = () => {

    return (
      <form
        className = 'w-50'
        css = {
          css(
            {
              maxWidth: '200px'
            }
          )
        }
        onSubmit = {
          onSubmitHandle
        }
      >
        <div
          className = 'formGroupHolder'
        >
          <div
            className = 'formGroup input-group d-flex mb-0'
          >
            <input
              className = {
                `
                  formControl
                  form-control form-control-lg
                  rounded-left
                `
              }
              css = {
                css(
                  {
                    backgroundImage: 'none !important',
                    backgroundColor: '#1e1e22',
                    color: '#eee',
                    borderColor: '#333',
                    '&::placeholder': {
                      color: '#888'
                    },
                    '&:focus': {
                      backgroundColor: '#1e1e22',
                      color: '#eee',
                      borderColor: '#555',
                      boxShadow: 'none'
                    }
                  }
                )
              }
              placeholder = {
                searchParams.get('hero') ||
                process.env.HERO
              }
              value = {
                text || ''
              }
              onChange = {
                onChangeHandle
              }
              onKeyDown = {
                onKeyDownHandle
              }
            />

            <div
              className = 'btnGroup input-group-append'
            >
              <button
                className = 'btn btn-success'
                type = 'submit'
              >
                <i
                  className = 'fa fa-check'
                ></i>
              </button>
            </div>
          </div>
        </div>
      </form>
    );
  };

  return (
    <div
      className =
        'SplashSpoofInput d-flex justify-content-center pt-2'
    >
      {
        renderFn()
      }
    </div>
  );
};

export default SplashSpoofInput;
