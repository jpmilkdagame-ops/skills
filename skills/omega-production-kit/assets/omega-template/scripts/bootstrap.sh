#!/usr/bin/env bash
set -euo pipefail

npm install
npm run typecheck
npm run core:once
npm run system:once
npm run kernel:once
npm run v4:once
