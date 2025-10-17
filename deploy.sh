#!/bin/sh

NAME=mrdriller
scp $NAME.zip samskivert.com:~/
ssh samskivert.com unzip -o -d /export/samskivert/pages $NAME.zip
ssh samskivert.com rm $NAME.zip
rm $NAME.zip
