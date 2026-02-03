/**
 * Config Routes - Handles configuration merging endpoints
 */

const express = require('express');
const router = express.Router();
const { mergeUserConfig, applyConfig, checkPollution } = require('../utils/configMerger');

/**
 * POST /api/config/merge
 * Call chain: [routes/config.js:POST handler] -> [configMerger.js:mergeUserConfig] -> [lodash:_.defaultsDeep]
 */
router.post('/merge', (req, res) => {
  try {
    const userConfig = req.body;
    
    // This calls the vulnerable mergeUserConfig function
    const merged = mergeUserConfig(userConfig);
    
    // Check if pollution occurred
    const pollutionStatus = checkPollution();
    
    res.json({
      success: true,
      message: 'Configuration merged successfully',
      config: merged,
      pollutionDetected: pollutionStatus,
      cve: 'CVE-2021-23337'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/config/apply
 * Another endpoint triggering the same vulnerability
 */
router.post('/apply', (req, res) => {
  try {
    const config = req.body;
    const result = applyConfig(config);
    
    res.json({
      success: true,
      appliedConfig: result,
      pollutionCheck: checkPollution()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;

