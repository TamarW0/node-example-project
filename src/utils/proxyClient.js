/**
 * Proxy Client Utility
 * CVE-2021-3749: Axios SSRF vulnerability via proxy configuration
 * Axios versions < 0.21.1 are vulnerable to SSRF when proxy config is user-controlled
 */

const axios = require('axios');

/**
 * VULNERABLE FUNCTION - CVE-2021-3749
 * Fetches data through a user-controlled proxy configuration
 * This is vulnerable to SSRF attacks where attacker can redirect requests
 * @param {string} url - URL to fetch
 * @param {object} proxyConfig - User-provided proxy configuration (untrusted)
 * @returns {Promise<object>} Response data
 */
async function fetchWithProxy(url, proxyConfig) {
  try {
    // VULNERABLE: User-controlled proxy configuration in axios < 0.21.1
    // An attacker can specify malicious proxy settings to access internal resources
    // or redirect requests to attacker-controlled servers
    const response = await axios.get(url, {
      proxy: proxyConfig, // User-controlled proxy - VULNERABLE!
      timeout: 5000
    });

    return {
      success: true,
      data: response.data,
      status: response.status,
      headers: response.headers
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      code: error.code
    };
  }
}

/**
 * Fetches data with user-provided proxy settings
 * Entry point that calls the vulnerable function
 * @param {string} targetUrl - URL to fetch
 * @param {string} proxyHost - Proxy host
 * @param {number} proxyPort - Proxy port
 * @returns {Promise<object>} Fetch result
 */
async function fetchViaUserProxy(targetUrl, proxyHost, proxyPort) {
  const proxyConfig = {
    host: proxyHost,
    port: proxyPort
  };

  // Calls the vulnerable fetchWithProxy function
  return await fetchWithProxy(targetUrl, proxyConfig);
}

/**
 * Makes a direct axios request (also uses vulnerable axios version)
 * @param {string} url - URL to fetch
 * @returns {Promise<object>} Response
 */
async function makeRequest(url) {
  try {
    const response = await axios.get(url, { timeout: 5000 });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

module.exports = {
  fetchWithProxy,
  fetchViaUserProxy,
  makeRequest
};

