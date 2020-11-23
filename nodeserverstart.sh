#!/bin/sh
PATH=$PATH:/volume1/@appstore/Node.js_v8/usr/local/lib/node_modules/forever/bin

forever start --workingDir /volume1/server/DHOFOLIO --sourceDir /volume1/server/DHOFOLIO -l /volume1/server/DHOFOLIO/logs/log.txt -o /volume1/server/DHOFOLIO/logs/output.txt .