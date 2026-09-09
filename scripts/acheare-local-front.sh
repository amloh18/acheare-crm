#!/bin/bash
# ACHEARE CRM - local frontend starter (used by launchd agent com.acheare.front)
# Wrapper exists so launchd never has to touch the space-containing project path directly.
export LC_ALL="en_US.UTF-8"
export LANG="en_US.UTF-8"
export NODE_ENV="development"
cd "/Users/amlohsl/Documents/VScode_projects/PROJECTS/ACHEARE CRM/twenty-upstream/packages/twenty-front" || exit 1
exec "/Users/amlohsl/Documents/VScode_projects/PROJECTS/ACHEARE CRM/node-v24.16.0-darwin-arm64/bin/node" "/Users/amlohsl/Documents/VScode_projects/PROJECTS/ACHEARE CRM/twenty-upstream/node_modules/vite/bin/vite.js" --port 3001 --strictPort
