// rollbar.js
// const Rollbar = require('rollbar');
import Rollbar from'rollbar'

// Initialize Rollbar
const rollbar = new Rollbar({
  accessToken:process.env.ROLLBAR_API_KEY,
  captureUncaught: true,
  captureUnhandledRejections: true,
});
export default rollbar
// Export the Rollbar instance
