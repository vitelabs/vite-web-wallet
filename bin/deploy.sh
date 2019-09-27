echo "Start deploy";

handle=$1;

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

if [ $handle == "PC" ]
then
    # ssh vite_wallet_nginx "cd ~/vite-web-wallet && rm -rf ./static ./dist && tar -xvf static.tar && mv ./dist ./static"
    echo "Deploy PC"
else
    # ssh vite_wallet_nginx "cd ~/vite-web-wallet && rm -rf ./distH5 ./mobiledex && tar -xvf h5Static.tar && mv ./distH5 ./mobiledex"
    echo "Deploy H5"
fi

echo "Finish deploy";
