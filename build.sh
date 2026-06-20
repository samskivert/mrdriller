#!/bin/sh
set -e

NAME=mrdriller

npm run build
rm -rf $NAME $NAME.zip
cp -r dist $NAME
zip -r $NAME.zip $NAME
rm -rf $NAME
