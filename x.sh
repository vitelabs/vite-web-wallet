echo "Start Cleaning"

eval "rm -rf ./distH5 ./node_modules"

echo "Start installing"

eval "yarn"

echo "Start building" 

eval "yarn run build:H5 && tar -cvf h5Static.tar ./distH5/*"
