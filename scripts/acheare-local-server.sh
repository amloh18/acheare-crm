#!/bin/bash
# ACHEARE CRM - local server starter (used by launchd agent com.acheare.server)
# Wrapper exists so launchd never has to touch the space-containing project path directly.
export LC_ALL="en_US.UTF-8"
export LANG="en_US.UTF-8"
export NODE_ENV="development"
cd "/Users/amlohsl/Documents/VScode_projects/PROJECTS/ACHEARE CRM/twenty-upstream/packages/twenty-server" || exit 1
exec "/Users/amlohsl/Documents/VScode_projects/PROJECTS/ACHEARE CRM/node-v24.16.0-darwin-arm64/bin/node" dist/main
