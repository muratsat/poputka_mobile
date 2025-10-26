#!/usr/bin/env bash

set -a
source .env

SOURCE=${API_URL:-http://localhost:8000}/openapi.json
DESTINATION=api/paths.d.ts

npx openapi-typescript ${SOURCE} -o ${DESTINATION}

perl -i -pe 'BEGIN{undef $/;} s/headers:\s*{\s*\[name:\s*string\]:\s*unknown;\s*}/headers: Record<string, unknown>/g' ${DESTINATION} 

pnpm prettier --write ${DESTINATION} 
