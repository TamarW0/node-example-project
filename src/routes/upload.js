/**
 * Upload Routes - Handles file upload endpoints
 * Triggers CVE-2020-7699 (express-fileupload prototype pollution)
 */

const express = require('express');
const router = express.Router();
const { handleFileUpload, validateUpload, checkUploadPollution } = require('../utils/fileHandler');

/**
 * POST /api/upload
 * Triggers CVE-2020-7699 via express-fileupload parseNested()
 * Call chain: [routes/upload.js:POST handler] -> [fileHandler.js:handleFileUpload] 
 *             -> [express-fileupload:parseNested] -> [express-fileupload:utilities.buildFields]
 * 
 * The vulnerability is triggered by the express-fileupload middleware when processing
 * form field names like "__proto__[polluted]"
 */
router.post('/', (req, res) => {
  try {
    // The express-fileupload middleware has already parsed the request
    // and the vulnerability is triggered during that parsing
    const result = handleFileUpload(req);
    
    // Check if prototype pollution occurred
    const pollutionStatus = checkUploadPollution();
    
    res.json({
      ...result,
      pollutionCheck: pollutionStatus,
      cve: 'CVE-2020-7699',
      note: 'Vulnerability triggered by express-fileupload middleware'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/upload/status
 * Check pollution status
 */
router.get('/status', (req, res) => {
  const pollutionStatus = checkUploadPollution();
  
  res.json({
    pollutionCheck: pollutionStatus,
    message: 'Upload system status'
  });
});

module.exports = router;

