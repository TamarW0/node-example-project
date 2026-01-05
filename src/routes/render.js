/**
 * Render Routes - Handles template rendering endpoints
 * Triggers CVE-2021-23369 (handlebars template injection via inheritance)
 */

const express = require('express');
const router = express.Router();
const UserRenderer = require('../templates/UserRenderer');

/**
 * POST /api/render/user
 * Triggers CVE-2021-23369 via handlebars compile() through inheritance
 * Call chain: [routes/render.js:POST handler] -> [UserRenderer.js:renderUserProfile] 
 *             -> [BaseRenderer.js:compileTemplate] -> [handlebars:Handlebars.compile]
 */
router.post('/user', (req, res) => {
  try {
    const { template, userData } = req.body;
    
    if (!template) {
      return res.status(400).json({
        success: false,
        error: 'Template is required'
      });
    }

    // Create an instance of UserRenderer (child class)
    const renderer = new UserRenderer();
    
    // This calls UserRenderer.renderUserProfile() which inherits and calls
    // BaseRenderer.compileTemplate() - the vulnerable function
    const rendered = renderer.renderUserProfile(template, userData || {});
    
    res.json({
      success: true,
      rendered: rendered,
      cve: 'CVE-2021-23369',
      note: 'Vulnerability triggered through class inheritance'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/render/card
 * Another endpoint triggering the same vulnerability through different child method
 */
router.post('/card', (req, res) => {
  try {
    const { template, userData } = req.body;
    
    const renderer = new UserRenderer();
    const rendered = renderer.renderUserCard(template, userData || {});
    
    res.json({
      success: true,
      rendered: rendered,
      cve: 'CVE-2021-23369'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;

