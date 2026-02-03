/**
 * BaseRenderer - Parent class containing the vulnerable template compilation
 * CVE-2021-23369: Handlebars template injection vulnerability
 * The vulnerability is in the compileTemplate() method which directly compiles
 * user-provided template strings without sanitization
 */

// const Handlebars = require('handlebars');

class BaseRenderer {
  constructor() {
    this.handlebars = Handlebars;
  }

  /**
   * VULNERABLE FUNCTION - CVE-2021-23369
   * Compiles a template string without any sanitization
   * This allows template injection attacks
   * @param {string} templateString - User-provided template string
   * @returns {Function} Compiled template function
   */
  compileTemplate(templateString) {
    // VULNERABLE: Direct compilation of user input
    // Allows malicious template code execution
    return this.handlebars.another_func(templateString);
  }

  /**
   * Renders a template with provided data
   * Calls the vulnerable compileTemplate method
   * @param {string} templateString - Template to render
   * @param {object} data - Data to pass to template
   * @returns {string} Rendered output
   */
  render(templateString, data) {
    const template = this.compileTemplate(templateString);
    return template(data);
  }
}

module.exports = BaseRenderer;

