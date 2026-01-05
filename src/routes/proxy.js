/**
 * Proxy Routes - Handles proxy/fetch endpoints
 * Triggers CVE-2021-3749 (axios SSRF via proxy config)
 */

const express = require('express');
const router = express.Router();
const { fetchWithProxy, fetchViaUserProxy, makeRequest } = require('../utils/proxyClient');

/**
 * POST /api/proxy/fetch
 * Triggers CVE-2021-3749 via axios proxy configuration
 * Call chain: [routes/proxy.js:POST handler] -> [proxyClient.js:fetchWithProxy] 
 *             -> [axios:axios.get] -> [axios:dispatchRequest]
 */
router.post('/fetch', async (req, res) => {
  try {
    const { url, proxy } = req.body;
    
    if (!url) {
      return res.status(400).json({
        success: false,
        error: 'URL is required'
      });
    }

    let result;
    
    if (proxy) {
      // This calls the vulnerable fetchWithProxy function with user-controlled proxy
      result = await fetchWithProxy(url, proxy);
    } else {
      result = await makeRequest(url);
    }
    
    res.json({
      ...result,
      cve: proxy ? 'CVE-2021-3749' : 'N/A',
      note: proxy ? 'SSRF vulnerability triggered via proxy config' : 'No proxy used'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/proxy/fetch-via-user
 * Alternative endpoint for proxy-based fetching
 */
router.post('/fetch-via-user', async (req, res) => {
  try {
    const { url, proxyHost, proxyPort } = req.body;
    
    if (!url || !proxyHost || !proxyPort) {
      return res.status(400).json({
        success: false,
        error: 'URL, proxyHost, and proxyPort are required'
      });
    }

    const result = await fetchViaUserProxy(url, proxyHost, parseInt(proxyPort));
    
    res.json({
      ...result,
      cve: 'CVE-2021-3749'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;

