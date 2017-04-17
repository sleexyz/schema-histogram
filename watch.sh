#!/usr/bin/env zsh

ls src/**/* | entr -cdr sh -c 'flow && mocha --compilers js:babel-core/register src/**/*_spec.js'

