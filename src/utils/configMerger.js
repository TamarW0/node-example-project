/**
 * Config Merger Utility
 * CVE-2021-23337: Lodash prototype pollution vulnerability
 */

const _ = require('lodash');

/**
 * VULNERABLE FUNCTION - CVE-2021-23337
 * This is vulnerable to prototype pollution attacks
 * @param {object} userConfig - User-provided configuration (untrusted input)
 * @param {object} defaultConfig - Default configuration
 * @returns {object} Merged configuration
 */
function mergeUserConfig(userConfig, defaultConfig = {}) {
  // An attacker can pass {"__proto__": {"polluted": "value"}} to pollute Object.prototype
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

