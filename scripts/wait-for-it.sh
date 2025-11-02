#!/bin/sh
# ==============================================================================
# Wait-for-it Script
# Waits for a service to be available before continuing
# ==============================================================================
#
# Usage: ./wait-for-it.sh host:port [-t timeout] [-- command args]
#
# Example:
#   ./wait-for-it.sh postgres:5432 -t 30 -- echo "PostgreSQL is ready"
#

set -e

TIMEOUT=15
QUIET=0
HOST=""
PORT=""

usage() {
    cat << EOF
Usage: $0 host:port [-t timeout] [-q] [-- command args]
  -h HOST | --host=HOST       Host to wait for
  -p PORT | --port=PORT       Port to wait for
  -t TIMEOUT | --timeout=TIMEOUT
                              Timeout in seconds, 0 for no timeout (default: 15)
  -q | --quiet                Don't output any status messages
  -- COMMAND ARGS             Execute command with args after the test finishes
EOF
    exit 1
}

wait_for() {
    if [ "$TIMEOUT" -gt 0 ]; then
        echo "Waiting $TIMEOUT seconds for $HOST:$PORT..."
    else
        echo "Waiting for $HOST:$PORT without a timeout..."
    fi

    start_ts=$(date +%s)
    while :
    do
        if nc -z "$HOST" "$PORT" > /dev/null 2>&1; then
            end_ts=$(date +%s)
            elapsed=$((end_ts - start_ts))
            echo "$HOST:$PORT is available after $elapsed seconds"
            return 0
        fi

        if [ "$TIMEOUT" -gt 0 ]; then
            elapsed=$(($(date +%s) - start_ts))
            if [ "$elapsed" -ge "$TIMEOUT" ]; then
                echo "Timeout occurred after waiting $TIMEOUT seconds for $HOST:$PORT"
                return 1
            fi
        fi

        sleep 1
    done
}

# Parse arguments
while [ $# -gt 0 ]
do
    case "$1" in
        *:* )
            HOST=$(echo "$1" | cut -d: -f1)
            PORT=$(echo "$1" | cut -d: -f2)
            shift 1
            ;;
        -h)
            HOST="$2"
            shift 2
            ;;
        --host=*)
            HOST="${1#*=}"
            shift 1
            ;;
        -p)
            PORT="$2"
            shift 2
            ;;
        --port=*)
            PORT="${1#*=}"
            shift 1
            ;;
        -t)
            TIMEOUT="$2"
            shift 2
            ;;
        --timeout=*)
            TIMEOUT="${1#*=}"
            shift 1
            ;;
        -q | --quiet)
            QUIET=1
            shift 1
            ;;
        --)
            shift
            break
            ;;
        *)
            echo "Unknown argument: $1"
            usage
            ;;
    esac
done

if [ -z "$HOST" ] || [ -z "$PORT" ]; then
    echo "Error: you need to provide a host and port to test."
    usage
fi

wait_for

if [ $# -gt 0 ]; then
    exec "$@"
fi
