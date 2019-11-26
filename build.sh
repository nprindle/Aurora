rm -r "./out/" # delete previous build
echo "Compiling..."
tsc # typescript compiler
timestamp=$(date +"%r")
echo "Finished build at $timestamp"

# optional flag to start local testing server
while getopts 'r' flag; do
  case "${flag}" in
    r) ./runlocal.sh ;;
  esac
done