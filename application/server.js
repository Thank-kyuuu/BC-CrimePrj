// ExpressJS Setup
const express = require("express");
const app = express();
var bodyParser = require("body-parser");

// Hyperledger Bridge
const { Wallets, Gateway } = require("fabric-network");
const fs = require("fs");
const path = require("path");
const ccpPath = path.resolve(__dirname, "ccp", "connection-org1.json");
let ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));

// Constants
const PORT = 8080;
const HOST = "0.0.0.0";

// use static file
app.use(express.static(path.join(__dirname, "views")));

// configure app to use body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// main page routing
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.post("/registCrime", async (req, res) => {

    const crimeNumber = req.body.crimeNumber
    const name = req.body.name
    const number = req.body.number
    const Cwallet = req.body.wallet
    const account = req.body.account
    const crimeField = req.body.crimeField
    const crimeContent = req.body.crimeContent

    // 체인코드 호출 파트

    // load the network configuration
    const ccpPath = path.resolve(__dirname, "ccp", "connection-org1.json");
    let ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));

    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), "wallet");
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    // Check to see if we've already enrolled the user.
    const identity = await wallet.get("appUser1");
    if (!identity) {
        console.log(
            'An identity for the user "appUser" does not exist in the wallet'
        );
        console.log("Run the registerUser.js application before retrying");
        return;
    }

    // Create a new gateway for connecting to our peer node.
    const gateway = new Gateway();
    await gateway.connect(ccp, {
        wallet,
        identity: "appUser1",
        discovery: { enabled: true, asLocalhost: true },
    });

    // Get the network (channel) our contract is deployed to.
    const network = await gateway.getNetwork("mychannel");

    // Get the contract from the network.
    // 컨트랙트 deployCC에서 컨트랙트 CC_NAME 입력
    const contract = network.getContract("sCrime");

    // Submit the specified transaction.

    // Func :
    // Input : crimeNumber , name , number , wallet , account , crimeField , crimeContent
    await contract.submitTransaction("RegistCrime", crimeNumber , name , number , Cwallet , account , crimeField , crimeContent);
    console.log("Transaction has been submitted");

    //const resultPath  =path.join(process.cwd(), "/views/result.html")
    //var resultHTML = fs.readFileSync(resultPath, "utf-8")

    //resultHTML = resultHTML.replace("<dir></dir>", "요트등록에 성공하였습니다.")

    //res.status(200).send(resultHTML)

    await gateway.disconnect();

    console.log("requset :" + crimeNumber + ":" + name + ":" + number + ":" + Cwallet + ":" + account + ":" + crimeField + ":" + crimeContent)
    //res.sendFile(__dirname + "/index.html");
});

app.get("/readCrime", (req, res) => {
    const crimeNumber = req.query.crimeNumber

    console.log("response :"+crimeNumber)
    res.sendFile(__dirname + "/index.html");
});

// server start
app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
