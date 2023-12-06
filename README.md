# ResilientDB TypeScript SDK

Use our ResilientDB TypeScript SDK to transact on ResilientDB, which leverages BigChainDB and mirrors the fucntionality of the python SDK.

NOTE: 
* Has not undergone extensive software testing
* Currently missing some functionality


## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Getting Started

Make sure Node v21.1.0 is installed on your machine via homebrew (MACOS), NVM (ANY), or any native package manager

```bash
# Using NVM
cd your-project
nvm install 21.1.0
# switch to Node v21.1.0
nvm use 21.1.0
# check version
node -v
```


### Prerequisites

* Node v21.1.0
* NOTE: If you do not use the correct version, you may need to download additional polyfills

### Installation

Add the SDK's remote URI to pull the repository upon calling `npm i`
```json
{
    "...": "<OTHERS>",
    "dependencies": {
        "...": "<OTHERS>",
        "resilient-sdk": "<GITHUB REPOSITORY LINK>",
        "...": "<OTHERS>",
    },
    "...": "<OTHERS>"
}
```

```bash
# Example installation steps
cd your-project
// installs all dependencies in node modules
npm install
```
## Usage

```javascript
const resilient-sdk = require("resilient-sdk") 
// OR DESTRUCTURED IMPORTS
import { ... } from 'resilient-sdk'
// you will have have access to all classes and interfaces for your application
```

## Contributing

The ExpoLab at the University of California, Davis
Primary contributor: Steve Chen

## License

This project is licensed under the Apache License, Version 2.0 - see the [LICENSE](LICENSE) file for details.
