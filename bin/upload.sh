echo "Start Upload";

handle=$1;
relay="ubuntu@119.28.193.94";
relayUploadDir="/home/ubuntu/viteWalletUpload";
deployUploadDir="ubuntu@129.204.122.32:/home/ubuntu/vite-web-wallet"

# ssh vite_wallet_build "cd ~/vite-web-wallet && scp -o proxycommand='ssh ubuntu@119.28.193.94 nc %h %p' ./static.tar $deployUploadDir'/h5Static.tar'"
# ssh vite_wallet_build "cd ~/vite-web-wallet && scp -o 'ProxyCommand=nc -X connect -x ubuntu@119.28.193.94 %h %p' ./static.tar $deployUploadDir'/static.tar'"

# Upload to relay
echo "Upload To Relay "$handle;

if [ "$handle"X == "PC"X ]
then
    ssh vite_wallet_build "cd ~/vite-web-wallet && scp ./static.tar $relay:$relayUploadDir'/static.tar'"
else
    ssh vite_wallet_build "cd ~/vite-web-wallet && scp ./h5Static.tar $relay:$relayUploadDir'/h5Static.tar'"
fi

echo "Upload To Relay Ending";

# Relay to vite_wallet_deploy
echo "Upload To vite_wallet_deploy"$handle;

if [ "$handle"X == "PC"X ]
then
    ssh $relay "cd ~/viteWalletUpload && scp ./static.tar $deployUploadDir'/static.tar'"
else
    ssh $relay "cd ~/viteWalletUpload && scp ./h5Static.tar $deployUploadDir'/h5Static.tar'"
fi

echo "Upload To Vite_wallet_deploy Ending";
