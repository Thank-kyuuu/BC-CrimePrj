export PATH=${HOME}/fabric-samples/bin:$PATH
export FABRIC_CFG_PATH=${PWD}/network/config

CC_NAME="sYacht"
CHANNEL_NAME="mychannel"
ORDERER_CA=${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem
PEER_CONN_PARMS="--peerAddresses localhost:7051 --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt --peerAddresses localhost:9051 --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt --peerAddresses localhost:11051 --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/org3.example.com/peers/peer0.org3.example.com/tls/ca.crt"


# TEST1 : Invoking the chaincode
infoln "TEST1 : Invoking the chaincode"
set -x
peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile $ORDERER_CA -C $CHANNEL_NAME -n ${CC_NAME} $PEER_CONN_PARMS -c '{"function":"RegistCrime","Args":["adad","7881","jin","12345678","dx91jv9dls","1231141151","1","fatal crime"]}' >&log.txt
{ set +x; } 2>/dev/null
cat log.txt
sleep 3

# TEST2 : Query the chaincode
infoln "TEST2 : Query the chaincode"
set -x
peer chaincode query -C $CHANNEL_NAME -n ${CC_NAME} -c '{"function":"ReadCrime","Args":["7881"]}' >&log.txt
{ set +x; } 2>/dev/null
cat log.txt