#!/bin/sh

NAME=mrdriller
rm -rf $NAME
mkdir $NAME
cp public/index.html $NAME
npx esbuild src/index.ts \
  --minify --sourcemap \
  --bundle --outfile=$NAME/index.js
rm -f $NAME.zip
zip -r $NAME.zip $NAME
rm -rf $NAME
