## run all test

mpm test

## Cheat Sheet

#Parameters

### Use --project command line option to run a single project.

--project=firefox

### Show actual test in browser

--headed

### debug you test. Opens playwright inspector

\$env:PWDEBUG=1

### remove parameter

\$env:PWDEBUG=""

### Only logs

\$env:DEBUG="pw:api"

### debug in the console. find selectors in console jQuery style sort of.

\$env:PWDEBUG="console"

## Trace

show-trace trace.zip

## generate test code, available to transorm to other languages

codegen
