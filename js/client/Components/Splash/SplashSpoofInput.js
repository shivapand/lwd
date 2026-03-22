'use strict';

import React,
{
  useState,
  useEffect,
  useRef
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

  const [
    isFocused,
    isFocusedSet
  ] = useState(
    false
  );

  const inputRef = useRef(null);
  const spanRef = useRef(null);
  const [inputWidth, inputWidthSet] = useState(0);

  useEffect(
    () => {
      const initialText = searchParams.get('hero') || process.env.HERO || '';
      textSet(initialText);
    },
    [searchParams]
  );

  // Auto-scale logic: measure the hidden span to set input width
  useEffect(() => {
    if (spanRef.current) {
      inputWidthSet(spanRef.current.offsetWidth + 10); 
    }
  }, [text]);

  const onChangeHandle = (event) => {
    textSet(event.target.value);
  };

  const onSubmitHandle = (event) => {
    event?.preventDefault();
    event?.stopPropagation();
    
    isFocusedSet(false);
    
    if (inputRef.current) {
      inputRef.current.blur();
    }

    return props.onSplashSpoofInputTrigger(text);
  };

  const onKeyDownHandle = (event) => {
    if (event.key === 'Enter') {
      onSubmitHandle(event);
    }
  };

  const onFocusHandle = () => {
    isFocusedSet(true);
  };

  const onIconClickHandle = (event) => {
    if (isFocused) {
      return onSubmitHandle(event);
    }
    
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div
      className = 'SplashSpoofInput d-flex flex-column align-items-center'
      css = {
        css({
          width: '100%',
          position: 'relative'
        })
      }
    >
      {/* Top Line */}
      <div 
        css={css({
          width: '40px',
          height: '1px',
          backgroundColor: 'rgba(255, 255, 255, 0.3)',
          marginBottom: '0.8rem'
        })}
      />

      <div 
        className='text-uppercase mb-1'
        css={css({
          fontSize: '0.7rem',
          letterSpacing: '0.4em',
          opacity: 0.6,
          fontWeight: 300,
          marginRight: '-0.4em' 
        })}
      >
        Starring
      </div>

      <div className='d-flex align-items-center justify-content-center w-100'>
        {/* Hidden span used to measure text width for auto-scaling */}
        <span
          ref={spanRef}
          css={css({
            position: 'absolute',
            visibility: 'hidden',
            height: 0,
            whiteSpace: 'pre',
            fontSize: '1.8rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.1em'
          })}
        >
          {text || searchParams.get('hero') || process.env.HERO}
        </span>

        <div style={{ position: 'relative' }}>
          <input
            ref={inputRef}
            className='form-control-plaintext text-center'
            css={css({
              width: inputWidth || 'auto',
              minWidth: '100px',
              maxWidth: '100%',
              fontSize: '1.8rem',
              fontWeight: 800,
              color: '#fff',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              padding: '0',
              transition: 'width 0.1s ease',
              backgroundColor: 'transparent',
              outline: 'none',
              border: 'none',
              marginLeft: '0.05em', 
              '&:focus': {
                color: '#fff'
              }
            })}
            placeholder={searchParams.get('hero') || process.env.HERO}
            value={text}
            onChange={onChangeHandle}
            onKeyDown={onKeyDownHandle}
            onFocus={onFocusHandle}
          />
          
          <i 
            className={`fa ${isFocused ? 'fa-check text-success' : 'fa-pen'}`}
            css={css({ 
              position: 'absolute',
              right: '-24px',
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: '0.8rem', 
              opacity: isFocused ? 1 : 0.3,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              '&:hover': {
                opacity: 0.8,
                transform: 'translateY(-50%) scale(1.2)'
              }
            })}
            onClick={onIconClickHandle}
          />
        </div>
      </div>

      {/* Bottom Line */}
      <div 
        css={css({
          width: '60px',
          height: '1px',
          backgroundColor: 'rgba(255, 255, 255, 0.3)',
          marginTop: '0.8rem'
        })}
      />
    </div>
  );
};

export default SplashSpoofInput;
