// Import the required modules using ESM syntax
const path = require("path");

// Export the configuration object
module.exports = {
  apps: [
    {
      name: "front",
      script: "npm",
      args: "run prod",
    },
  ],
};
