/**
 * File Handler Utility
 * CVE-2020-7699: express-fileupload prototype pollution vulnerability
 * The parseNested function in express-fileupload is vulnerable to prototype pollution
 * through crafted form field names
 */

/**
 * VULNERABLE FUNCTION - CVE-2020-7699
 * Handles file uploads and processes form data
 * The express-fileupload middleware's parseNested() function is vulnerable
 * when processing field names like "__proto__[polluted]"
 * @param {object} req - Express request object with files
 * @returns {object} Processing result
 */
function handleFileUpload(req) {
  if (!req.files || Object.keys(req.files).length === 0) {
    return {
      success: false,
      message: 'No files were uploaded.'
    };
  }

  // The vulnerability is triggered by express-fileupload middleware
  // when it parses nested field names during file upload
  // Fields like "__proto__[polluted]" trigger prototype pollution
  
  const uploadedFiles = [];
  const formData = req.body; // This contains the polluted data from parseNested()

  // Process uploaded files
  for (const fieldName in req.files) {
    const file = req.files[fieldName];
    uploadedFiles.push({
      name: file.name,
      size: file.size,
      mimetype: file.mimetype,
      fieldName: fieldName
    });
  }

  return {
    success: true,
    message: 'Files uploaded successfully',
    files: uploadedFiles,
    formData: formData
  };
}

/**
 * Validates file upload results
 * @param {object} result - Upload result
 * @returns {boolean} True if valid
 */
function validateUpload(result) {
  return result && result.success === true;
}

/**
 * Checks if prototype pollution occurred via file upload
 * @returns {object} Pollution check result
 */
function checkUploadPollution() {
  const testObj = {};
  return {
    polluted: testObj.polluted !== undefined,
    value: testObj.polluted
  };
}

module.exports = {
  handleFileUpload,
  validateUpload,
  checkUploadPollution
};

