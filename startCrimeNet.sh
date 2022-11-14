pushd network

./startnetwork.sh
sleep 20

./createchannel.sh
sleep 10

./setAnchorPeerUpdate.sh
sleep 5

popd