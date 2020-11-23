#1/bin/sh
PATH=$PATH:/volume1/Server/DHOFOLIO/node_modules/forever/bin

start() {
        forever start --workingDir /volume1/Server/DHOFOLIO --sourceDir /volume1/Server/DHOFOLIO -l /volume1/server/DHOFOLIO/logs/log.txt -o /volume1/server/DHOFOLIO/logs/output.txt .
}

stop() {
        killall -9 node
}

case "$1" in
  start)
    start
    ;;
  stop)
    stop
    ;;
  *)
    echo "Usage: $0 {start|stop}"
esac