rm -r "./_built/" # delete previous build
echo "Compiling..."
tsc -p _source # typescript compiler
timestamp=$(date +"%r")
echo "Finished build at $timestamp"

# optional flag to start local testing server
while getopts 'r' flag; do
  case "${flag}" in
    r) ./runlocal.sh ;;
  esac
done