handle=$1;

echo "Start deploy";

if [ "$handle"X == "PC"X ]
then
    echo "Deploy PC"
    ssh vite_wallet_deploy "cd ~/vite-web-wallet && rm -rf ./static ./dist && tar -xvf static.tar && mv ./dist ./static"
else
    echo "Deploy H5"
    ssh vite_wallet_deploy "cd ~/vite-web-wallet && rm -rf ./distH5 ./mobiledex && tar -xvf h5Static.tar && mv ./distH5 ./mobiledex"
fi

echo "Finish deploy";
