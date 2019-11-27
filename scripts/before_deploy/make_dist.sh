# The directory to move necessary files into
target="$1"

if [ -z "$target" ]; then
  >&2 echo "Error: no target directory provided"
  exit 1
fi

mkdir -p "$target"

cp -r out "$target"
cp -r assets "$target"
cp -r stylesheets "$target"
cp *.html "$target"
