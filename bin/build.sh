#!/bin/bash
set -e
echo "Start building";

handle=$1;
isClear=$2;

if [ "$isClear"X == "clear"X ]
then
    echo "Delete node_modules =================";
    rm -rf ./node_modules
fi

echo "Install ===============";
yarn

# Build and tar
echo "Build" $handle;

if [ "$handle"X == "PC"X ]
then
    echo "Delete dist =================";
    rm -rf ./dist
    echo "Build =================";
    yarn run build
    echo "Tar ==============";
    tar -cvf static.tar ./dist/*
else
    echo "Delete distH5 =================";
    rm -rf ./distH5
    echo "Build =================";
    yarn run build:H5
    echo "Tar ==============";
    tar -cvf h5Static.tar ./distH5/*
fi

echo "Finish building";
