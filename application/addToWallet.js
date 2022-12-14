const fs = require("fs");
const { Wallets } = require("fabric-network");
const path = require("path");

async function main() {
    // Main try/catch block
    try {
        // A wallet stores a collection of identities
        const wallet = await Wallets.newFileSystemWallet("wallet");

        const checkidentity = await wallet.get("appUser1");
        if (checkidentity) {
            console.log(
                'An identity for the user "appUser" already exists in the wallet'
            );
            return;
        }

        // Identity to credentials to be stored in the wallet
        // gyu.jin
        // getCert.sh에 있는거 복사
        // network/organizations/peerOrganizations/org1.example.com/users/User1@org1.example.com/msp/signcerts/
        const credPath = path.join(__dirname, "..","network","organizations","peerOrganizations");
        const certificate = fs
            .readFileSync(
                path.join(
                    credPath,
                    "/org1.example.com/users/User1@org1.example.com/msp/signcerts/User1@org1.example.com-cert.pem"
                )
            )
            .toString();
        const privateKey = fs
            .readFileSync(
                path.join(credPath, "/org1.example.com/users/User1@org1.example.com/msp/keystore/priv_sk")
            )
            .toString();

        // Load credentials into wallet
        const identityLabel = "appUser1";

        const identity = {
            credentials: {
                certificate,
                privateKey,
            },
            mspId: "Org1MSP",
            type: "X.509",
        };

        await wallet.put(identityLabel, identity);
        console.log('Successfully import an user("appUser") into the wallet');
    } catch (error) {
        console.log(`Error adding to wallet. ${error}`);
        console.log(error.stack);
    }
}

main();
