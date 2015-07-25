#!/usr/bin/env node
var spawn = require('child_process').spawn

// options.detached
// https://nodejs.org/api/child_process.html#child_process_options_detached
var prc = spawn(process.argv[2] + '.cmd', process.argv.slice(3), {
  detached: true,
  stdio: 'ignore'
})
prc.unref()
