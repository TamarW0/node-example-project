/**
 * UserRenderer - Child class that inherits from BaseRenderer
 * CVE-2021-23369: This class triggers the vulnerability through inheritance
 * The vulnerable function is declared in the parent class (BaseRenderer.compileTemplate)
 * but is triggered through this child class's methods
 */

const BaseRenderer = require('./BaseRenderer');

class UserRenderer extends BaseRenderer {
  constructor() {
    super();
  }

  /**
   * Renders a user profile using a template
   * This method calls the parent's vulnerable render() method,
   * which in turn calls compileTemplate()
   * @param {string} userTemplate - User-provided template string
   * @param {object} userData - User data to render
   * @returns {string} Rendered user profile
   */
  renderUserProfile(userTemplate, userData) {
    // Calls parent's render() which calls parent's compileTemplate()
    // This demonstrates vulnerability through inheritance
    return this.render(userTemplate, userData);
  }

  /**
   * Renders a user card using a template
   * Another entry point to the vulnerable code path
   * @param {string} cardTemplate - Template for user card
   * @param {object} userData - User data
   * @returns {string} Rendered card HTML
   */
  renderUserCard(cardTemplate, userData) {
    // Also triggers the vulnerability through inheritance
    return this.render(cardTemplate, userData);
  }
}

module.exports = UserRenderer;

