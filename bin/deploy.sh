echo "Start deploy";

handle=$1;

if [ $handle == "PC" ]
then
    # ssh vite_wallet_nginx "cd ~/vite-web-wallet && rm -rf ./static ./dist && tar -xvf static.tar && mv ./dist ./static"
    echo "Deploy PC"
else
    # ssh vite_wallet_nginx "cd ~/vite-web-wallet && rm -rf ./distH5 ./mobiledex && tar -xvf h5Static.tar && mv ./distH5 ./mobiledex"
    echo "Deploy H5"
fi

echo "Finish deploy";
