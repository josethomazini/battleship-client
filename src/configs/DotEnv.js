const readServerUrl = () => {
  if (process.env.SERVER_URL === undefined) {
    throw Error('No server url was found');
  }
  return process.env.SERVER_URL;
};

module.exports = {
  SERVER_URL: readServerUrl(),
};
