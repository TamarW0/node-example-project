/**
 * Vulnerable Node.js Test Server
 * Contains 5 known CVEs for testing CVE reachability analysis
 * 
 * CVEs included:
 * 1. CVE-2021-23337 - lodash prototype pollution
 * 2. CVE-2021-44906 - minimist prototype pollution (transitive via yargs)
 * 3. CVE-2020-7699 - express-fileupload prototype pollution
 * 4. CVE-2021-23369 - handlebars template injection (via inheritance)
 * 5. CVE-2021-3749 - axios SSRF via proxy config
 */

const express = require('express');
const fileUpload = require('express-fileupload');
const yargs = require('yargs');

// CVE-2021-44906: Parse command-line arguments using yargs (which uses vulnerable minimist)
// Call chain: [server.js:startup] -> [yargs:parse] -> [yargs-parser:parse] -> [minimist:minimist]
// Trigger with: node server.js --__proto__.polluted=true
const argv = yargs
  .option('port', {
    alias: 'p',
    description: 'Port to run the server on',
    type: 'number',
    default: 3000
  })
  .option('host', {
    alias: 'h',
    description: 'Host to bind the server to',
    type: 'string',
    default: 'localhost'
  })
  .help()
  .alias('help', 'h')
  .argv;

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CVE-2020-7699: express-fileupload middleware with vulnerable version
// The parseNested option enables the vulnerable code path
app.use(fileUpload({
  parseNested: true, // This enables the vulnerable parseNested() function
  useTempFiles: false
}));

// Import routes
const configRoutes = require('./src/routes/config');
const renderRoutes = require('./src/routes/render');
const uploadRoutes = require('./src/routes/upload');
const proxyRoutes = require('./src/routes/proxy');

// Mount routes
app.use('/api/config', configRoutes);
app.use('/api/render', renderRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/proxy', proxyRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Vulnerable Node.js Test Project',
    version: '1.0.0',
    cves: [
      'CVE-2021-23337 - lodash prototype pollution',
      'CVE-2021-44906 - minimist prototype pollution (transitive)',
      'CVE-2020-7699 - express-fileupload prototype pollution',
      'CVE-2021-23369 - handlebars template injection (inheritance)',
      'CVE-2021-3749 - axios SSRF'
    ],
    endpoints: {
      config: '/api/config/merge (POST) - CVE-2021-23337',
      render: '/api/render/user (POST) - CVE-2021-23369',
      upload: '/api/upload (POST) - CVE-2020-7699',
      proxy: '/api/proxy/fetch (POST) - CVE-2021-3749',
      minimist: 'Command-line args - CVE-2021-44906'
    }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  // Check if any prototype pollution occurred
  const testObj = {};
  const polluted = testObj.polluted !== undefined;
  
  res.json({
    status: 'running',
    prototypePollution: polluted ? 'DETECTED' : 'None detected',
    pollutedValue: testObj.polluted
  });
});

// Start server
const PORT = argv.port;
const HOST = argv.host;

app.listen(PORT, HOST, () => {
  console.log(`\n🚨 Vulnerable Test Server Running 🚨`);
  console.log(`   URL: http://${HOST}:${PORT}`);
  console.log(`   Node Version: ${process.version}`);
  console.log(`\n📋 Available CVEs:`);
  console.log(`   1. CVE-2021-23337 (lodash) - POST /api/config/merge`);
  console.log(`   2. CVE-2021-44906 (minimist) - Command-line args`);
  console.log(`   3. CVE-2020-7699 (express-fileupload) - POST /api/upload`);
  console.log(`   4. CVE-2021-23369 (handlebars) - POST /api/render/user`);
  console.log(`   5. CVE-2021-3749 (axios) - POST /api/proxy/fetch`);
  
  // Check if minimist CVE was triggered via command-line
  const testObj = {};
  if (testObj.polluted !== undefined) {
    console.log(`\n⚠️  CVE-2021-44906 TRIGGERED: Prototype pollution detected from command-line args!`);
    console.log(`   Polluted value: ${testObj.polluted}`);
  }
  
  console.log(`\n⚠️  WARNING: This server contains intentional vulnerabilities for testing purposes only!`);
  console.log(`   DO NOT expose to the internet or use in production!\n`);
});

module.exports = app;

