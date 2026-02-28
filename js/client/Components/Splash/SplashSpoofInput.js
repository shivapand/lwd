'use strict';

import React,
{
  useState
} from 'react';
import {
  createFragmentContainer,
  graphql
} from 'react-relay';
import {
  css
} from '@emotion/core';

const SplashSpoofInput = (
  props
) => {

  const [
    text,
    textSet
  ] = useState(
    null
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

    if (
      event.key ===
      'Enter'
    ) {

      return onSubmitHandle(
        event
      );
    }

    return (
      event
    );
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
                    backgroundImage: 'none !important'
                  }
                )
              }
              placeholder = {
                props.match.location.query.hero
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
        'SplashSpoofInput d-flex justify-content-center'
    >
      {
        renderFn()
      }
    </div>
  );
};

export default createFragmentContainer(
  SplashSpoofInput,
  {
    viewer: graphql`
      fragment SplashSpoofInput_viewer on Viewer {
        id
      }
    `
  }
);
