/**
 * Config Merger Utility
 * CVE-2021-23337: Lodash prototype pollution vulnerability
 * Uses lodash's _.defaultsDeep() function which is vulnerable to prototype pollution
 */

const _ = require('lodash');

/**
 * VULNERABLE FUNCTION - CVE-2021-23337
 * Merges user-provided configuration with defaults using lodash defaultsDeep
 * This is vulnerable to prototype pollution attacks
 * @param {object} userConfig - User-provided configuration (untrusted input)
 * @param {object} defaultConfig - Default configuration
 * @returns {object} Merged configuration
 */
function mergeUserConfig(userConfig, defaultConfig = {}) {
  // VULNERABLE: _.defaultsDeep is susceptible to prototype pollution
  // An attacker can pass {"__proto__": {"polluted": "value"}} to pollute Object.prototype
  // const merged = _.defaultsDeep({}, userConfig, defaultConfig);
  return merged;
}

/**
 * Applies configuration settings
 * @param {object} config - Configuration object
 * @returns {object} Applied configuration
 */
function applyConfig(config) {
  const defaults = {
    theme: 'light',
    timeout: 3000,
    retries: 3
  };
  
  // Calls the vulnerable merge function
  return mergeUserConfig(config, defaults);
}

/**
 * Checks if prototype pollution occurred
 * @returns {boolean} True if Object.prototype was polluted
 */
function checkPollution() {
  const testObj = {};
  return testObj.polluted !== undefined;
}

module.exports = {
  mergeUserConfig,
  applyConfig,
  checkPollution
};

