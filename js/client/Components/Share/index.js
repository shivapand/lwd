'use strict';

import React,
{
  useRef,
  useState
} from 'react';
import {
  createFragmentContainer,
  graphql
} from 'react-relay';
import {
  css
} from '@emotion/core';

import ShareDownload from './ShareDownload';
import ShareLink from './ShareLink';

const Share = (
  props
) => {

  const dropdownRef = useRef(
    null
  );

  const [
    dropdownMenuDisplay,
    dropdownMenuDisplaySet
  ] = useState(
    'none'
  );

  const onDropLeftTriggerHandle = (
    event
  ) => {

    event.preventDefault();
    event.stopPropagation();

    const _dropdownMenuDisplay = (
      dropdownMenuDisplay ===
      'none'
    ) ?
      'block' :
      'none';

    return Promise.resolve(
      dropdownMenuDisplaySet(
        _dropdownMenuDisplay
      )
    );
  };

  const onShareCompletedHandle = () => {

    return Promise.resolve(
      dropdownMenuDisplaySet(
        'none'
      )
    );
  };

  const shareDownloadRender = () => {

    return (
      <ShareDownload
        viewer = {
          props.viewer
        }
        match = {
          props.match
        }
        onShareCompleted = {
          onShareCompletedHandle
        }
      />
    );
  };

  const shareLinkRender = () => {

    return (
      <ShareLink
        viewer = {
          props.viewer
        }
        match = {
          props.match
        }
        onShareCompleted = {
          onShareCompletedHandle
        }
      />
    );
  };

  const renderFn = () => {

    return (
      <div
        ref = {
          dropdownRef
        }
        className = 'd-flex'
      >
        <div
          css = {
            css(
              {
                display: dropdownMenuDisplay
              }
            )
          }
        >
          {
            shareDownloadRender()
          }
          {
            shareLinkRender()
          }
        </div>

        <button
          className = 'btn btn-secondary rounded-0'
          css = {
            css(
              {
                boxShadow: 'none !important',
                outline: 'none !important'
              }
            )
          }
          onClick = {
            onDropLeftTriggerHandle
          }
        >
          <i 
            className = 'fa fa-share-alt fa-fw'
          ></i>
        </button>

      </div>
    );
  };

  return (
    <div
      className = 'Share'
    >
      {
        renderFn()
      }
    </div>
  );
};

export default createFragmentContainer(
  Share,
  {
    viewer: graphql`
      fragment Share_viewer on Viewer {
        ...ShareDownload_viewer,
        ...ShareLink_viewer
      }
    `
  }
);
