echo "Start building";

handle=$1;
isClear=$2;

# Pull and clear and install
# git checkout master

# echo "Pull ==============";
# git pull

# if [ "$isClear" == "clear" ]
# then
#     echo "Delete node_modules =================";
#     rm -rf ./node_modules
# fi

# echo "Install ===============";
# yarn

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

# upload
# if [ $handle == "PC" ]
# then
#     echo "Upload PC =================";
#     scp ./static.tar vite_wallet_nginx:/home/ubuntu/vite-web-wallet/static.tar
# else
#     echo "Upload H5 =================";
#     scp ./h5Static.tar vite_wallet_nginx:/home/ubuntu/vite-web-wallet/h5Static.tar
# fi

# echo "Upload FINISH=================";

echo "Finish building";
