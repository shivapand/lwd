'use strict';

const titleGet = () => {

  return (
    process.env.TITLE ||
    process.env.npm_package_name
  );
};

const portGet = () => {

  return (
    process.env.PORT ||
    process.env.npm_package_config_PORT ||
    3456
  );
};

const nodeEnvGet = () => {

  return (
    process.env.NODE_ENV ||
    'development'
  );
};

const outputResGet = () => {

  return (
    process.env.OUTPUT_RES ||
    process.env.npm_package_config_OUTPUT_RES ||
    320
  );
};

const hostUrlGet = (
  req
) => {

  return `
    ${
      req.protocol
    }://${
      req.get(
        'host'
      )
    }
  `
    .trim();
};

const mongoLocalUriGet = () => {

  return (
    process.env.MONGO_LOCAL_URI ||
    process.env.npm_package_config_MONGO_LOCAL_URI
  );
};

const mongoRemoteUriGet = () => {

  return (
    process.env.MONGO_URI ||
    process.env.MONGO_REMOTE_URI ||
    process.env.npm_package_config_MONGO_REMOTE_URI
  );
};

const mongoUriGet = () => {

  return (
    mongoRemoteUriGet() ||
    mongoLocalUriGet()
  );
};

const genreGet = () => {

  return (
    process.env.GENRE ||
    process.env.npm_package_config_GENRE
  );
};

const heroGet = () => {

  return (
    process.env.HERO ||
    process.env.npm_package_config_HERO
  );
};

const fbAppIdGet = () => {

  return (
    process.env.FB_APP_ID ||
    process.env.npm_package_config_FB_APP_ID
  );
};

export {
  titleGet,
  portGet,
  nodeEnvGet,
  outputResGet,
  hostUrlGet,
  mongoLocalUriGet,
  mongoRemoteUriGet,
  mongoUriGet,
  genreGet,
  heroGet,
  fbAppIdGet
};
