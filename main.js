const DiamSdk = require("diamnet-sdk");
const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

// filePath : path of the file
// fileName : name of the file
// fileFormat
// png  : image/png
// jpeg : image/jpeg
// text : text/plain
// pdf  : application/pdf

async function accountGenrator(){
    const accountCred = DiamSdk.Keypair.random();
    try {
        await fetch(
            `https://friendbot.diamcircle.io?addr=${encodeURIComponent(
                accountCred.publicKey()
            )}`
        );
        return accountCred
    } catch (e) {
        throw e
    }
}

async function fileUploadToIPFS(filePath, fileName, fileFormat){
    try {
        const fileContent = fs.readFileSync(filePath);
        const formData = new FormData();
        formData.append(fileName, fileContent, {
            contentType: fileFormat
        });

        const response = await axios.post('https://uploadipfs.diamcircle.io/api/v0/add', formData, {
            headers: {
                ...formData.getHeaders()
            },
            maxContentLength: Infinity,
            maxBodyLength: Infinity
        });

        if (response.status === 200 && response.data && response.data.Hash) {
            return response.data;
        } else {
            throw new Error('Failed to upload file to IPFS');
        }
    } catch (error) {
        console.error("Error uploading file to IPFS:", error);
        throw error;
    }
}

async function createTrustline(caseSecret, casePublicKey, assetCode, userPublic) {
  try {
    const server = new DiamSdk.Aurora.Server('https://diamtestnet.diamcircle.io/');
    const userAccount = await server.loadAccount(casePublicKey);

    const asset = new DiamSdk.Asset(assetCode, userPublic);

    const transaction = new DiamSdk.TransactionBuilder(userAccount, {
      fee: await server.fetchBaseFee(),
      networkPassphrase: DiamSdk.Networks.TESTNET,
    })
      .addOperation(DiamSdk.Operation.changeTrust({
        asset: asset,
      }))
    .addMemo(DiamSdk.Memo.text(`Trustline Establishment`.substring(0, 28)))
      .setTimeout(30)
      .build();

    const userKeypair = DiamSdk.Keypair.fromSecret(caseSecret);
    transaction.sign(userKeypair);

    result = await server.submitTransaction(transaction);

    return 200;
  } catch (error) {
    console.error("Error in createTrustline function:", error);
    throw error;
  }
}

async function issueAsset(issuerKeypair, receiverKeypair, hash, fileName) {

    // Connect the server
    const server = new DiamSdk.Aurora.Server('https://diamtestnet.diamcircle.io/');

    // Issuer/User Account
    const issuerAccount = await server.loadAccount(issuerKeypair.publicKey());
    const reciverAccount = await server.loadAccount(receiverKeypair.publicKey());

    console.log(fileName)
    console.log(hash)

    // Asset Intialisation
    const fileAsset = new DiamSdk.Asset(fileName, userAcc.publicKey());

    // Asset Transation
    const assetTransaction = new DiamSdk.TransactionBuilder(issuerAccount, {
        fee: await server.fetchBaseFee(),
        networkPassphrase: DiamSdk.Networks.TESTNET
    })
    .addOperation(DiamSdk.Operation.payment({
        destination: receiverKeypair.publicKey(),
        asset: fileAsset,
        amount: '1'
    }))
    .addMemo(DiamSdk.Memo.text(`${fileName}|${hash}`.substring(0,28)))
    .setTimeout(30)
    .build();

    // Data Transaction
    const dataTransaction = new DiamSdk.TransactionBuilder(reciverAccount, {
        fee: await server.fetchBaseFee(),
        networkPassphrase: DiamSdk.Networks.TESTNET
    })
    .addOperation(DiamSdk.Operation.manageData({
        name: fileName,
        value: `${fileName}_${hash}`,
    }))
    .addMemo(DiamSdk.Memo.text(`${fileName}|${hash}`.substring(0, 28)))
    .setTimeout(30)
    .build();

    // Step 8: Sign transaction
    assetTransaction.sign(issuerKeypair);
    dataTransaction.sign(receiverKeypair);

    // Step 9: Submit transaction
    await server.submitTransaction(assetTransaction);
    await server.submitTransaction(dataTransaction);
}

async function getCaseItems(casePublicKey) {
    try{
        const response = await axios.get(`https://diamtestnet.diamcircle.io/accounts/${casePublicKey}`);
        if (response.status == 200) {
            return response.data.data
        }
    }catch{
        throw "FUCKKKKKKKK"
    }
}

async function getFile(hash){
    try {
        const response = await axios.get(`https://ipfs.io/ipfs/${hash}`);
        if (response.status == 200) {
            var file = new Blob([response.data]);
            return file
        }
    } catch {
        throw "FUCKKKKKKKK"
    }
}

async function authenticateFile(filePath, fileFormat, hash) {
    try {
        const fileContent = fs.readFileSync(filePath);
        const formData = new FormData();
        formData.append("hattt", fileContent, {
            contentType: fileFormat
        });

        const response = await axios.post('https://uploadipfs.diamcircle.io/api/v0/add', formData, {
            headers: {
                ...formData.getHeaders()
            },
            maxContentLength: Infinity,
            maxBodyLength: Infinity
        });

        if (response.status === 200 && response.data && response.data.Hash) {
            const IPFShash = response.data.Hash
            if(IPFShash == hash){
                return "authentic";
            }else{
                return "nakliii";
            }
        } else {
            throw new Error('Failed to upload file to IPFS');
        }
    } catch (error) {
        console.error("Error uploading file to IPFS:", error);
        throw error;
    }
}

async function getLog(casePublicKey) {
    const response = await axios.get(`https://diamtestnet.diamcircle.io/accounts/${casePublicKey}/transactions`);
    if (response.status == 200) {
        var outputData = []
        response.data._embedded.records.forEach(x => {
            outputData.push({
                "id": x.id,
                "created_at": x.created_at,
                "memo": x.memo_type == "none" ? "None" : x.memo
            })
        });

        return outputData
    }
}

async function getLogInfo(logID) {
    const response = await axios.get(`https://diamtestnet.diamcircle.io/transactions/${logID}/operations`);
    if (response.status == 200) {
        var outputData = []
        response.data._embedded.records.forEach(x => {
            outputData.push({
                "id": x.id,
                "paging_token": x.paging_token,
                "transaction_successful": x.transaction_successful,
                "source_account": x.source_account,
                "type": x.type,
                "created_at": x.created_at,
                "transaction_hash": x.transaction_hash,
                "asset_type": x.asset_type,
                "asset_code": x.asset_code,
                "asset_issuer": x.asset_issuer,
                "from": x.from,
                "to": x.to,
            })
        });

        return outputData
    }
}

async function main(){
    // Create User Accounts

    // userAcc = await accountGenrator()
    // caseAcc = await accountGenrator()

    // console.log("userAcc : " + userAcc.publicKey())
    // console.log("caseAcc : " + caseAcc.publicKey())

    // Upload Data to IPFS
    // const contentHash = await fileUploadToIPFS("D:\\Programming\\Projects\\Diamante Hackathon\\test.png", "evidance12", "image/png")

    // console.log("content hash : " + contentHash["Hash"])

    // Create Trustline between case and user
    // await createTrustline(caseAcc.secret(), caseAcc.publicKey(), "evidance12", userAcc.publicKey())

    // Issue file
    // await issueAsset(userAcc, caseAcc, contentHash["Hash"], "evidance12")

    // Get all the case files
    // console.log(await getCaseItems("GBMEOODDW5VTDSMMQMDCDSYZF7UVUHGRMFHDTZDBHYFV46KO4OZNDCCC"))

    // Get individual file
    // console.log(await getFile("QmbBrQ8iM6QM4akiWVsPyptivpWhGYvfELXbyeWXz7mqki"))

    // Authenticate file
    // console.log(await authenticateFile("D:\\Programming\\Projects\\Diamante Hackathon\\test.png", "image/png", "QmbBrQ8iM6QM4akiWVsPyptivpWhGYvfELXbyeWXz7mqki"))

    // Get log
    // console.log(await getLog("GBMEOODDW5VTDSMMQMDCDSYZF7UVUHGRMFHDTZDBHYFV46KO4OZNDCCC"))

    // Get individual log info
    // console.log(await getLogInfo("5189b9c5671ac0a92796fa04fa8b52af1a9b408de1607564337d0b8ccce60a9d"))
}

main()
