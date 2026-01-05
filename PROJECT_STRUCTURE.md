# Project Structure

```
node-example-project/
│
├── package.json                    # Dependencies with 5 vulnerable packages
├── server.js                       # Main Express server (uses yargs → minimist)
├── .gitignore                      # Git ignore file
│
├── src/
│   ├── templates/                  # Handlebars CVE (Inheritance pattern)
│   │   ├── BaseRenderer.js        # Parent class - contains vulnerable compileTemplate()
│   │   └── UserRenderer.js        # Child class - inherits and triggers vulnerability
│   │
│   ├── utils/                      # Utility functions with vulnerabilities
│   │   ├── configMerger.js        # CVE-2021-23337 - lodash _.defaultsDeep()
│   │   ├── fileHandler.js         # CVE-2020-7699 - express-fileupload parseNested()
│   │   └── proxyClient.js         # CVE-2021-3749 - axios proxy SSRF
│   │
│   └── routes/                     # API endpoints that trigger CVEs
│       ├── config.js              # POST /api/config/merge (lodash)
│       ├── render.js              # POST /api/render/user (handlebars)
│       ├── upload.js              # POST /api/upload (express-fileupload)
│       └── proxy.js               # POST /api/proxy/fetch (axios)
│
├── README.md                       # User guide with installation & testing
├── VULNERABILITY_MAP.md            # Detailed CVE mapping with call chains
└── test-setup.js                   # Quick verification script
```

## CVE Distribution

### Direct Dependencies (3)
- lodash@4.17.19 → CVE-2021-23337
- express-fileupload@1.1.7 → CVE-2020-7699
- handlebars@4.7.6 → CVE-2021-23369 (with inheritance)
- axios@0.21.0 → CVE-2021-3749

### Transitive Dependencies (1)
- minimist@1.2.5 → CVE-2021-44906
  - Via: yargs@15.4.1 → yargs-parser → minimist

## API Endpoints

| Endpoint | Method | CVE | Description |
|----------|--------|-----|-------------|
| `/` | GET | - | Project info |
| `/health` | GET | - | Health check & pollution status |
| `/api/config/merge` | POST | CVE-2021-23337 | Lodash prototype pollution |
| `/api/render/user` | POST | CVE-2021-23369 | Handlebars injection (inheritance) |
| `/api/upload` | POST | CVE-2020-7699 | File upload prototype pollution |
| `/api/proxy/fetch` | POST | CVE-2021-3749 | Axios SSRF |
| Command-line args | CLI | CVE-2021-44906 | Minimist prototype pollution |

## Call Chain Summary

All call chains are documented in VULNERABILITY_MAP.md with the format:
`[(file:function), (file:function), ..., (package:vulnerable_function)]`

Example (Inheritance):
```
CVE-2021-23369:
[(routes/render.js:POST handler),
 (UserRenderer.js:renderUserProfile),      ← Child class
 (BaseRenderer.js:compileTemplate),        ← Parent class (vulnerable)
 (handlebars:Handlebars.compile)]          ← Dependency
```

