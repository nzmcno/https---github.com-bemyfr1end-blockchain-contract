const express = require("express");
const { Web3 } = require("web3");
const bodyParser = require("body-parser");
const contractABI = require("./NFT1155ABI.json"); // Replace with the path to your contract's ABI JSON file
const contractAddress = "0xF45448cAD021F2251297115a796e5a7ec4915271"; // Replace with your actual contract address
const privateKey = "IT WONT WORK"; // Replace with your actual private key
const web3 = new Web3("https://evm.shibuya.astar.network"); // Replace with the Astar Network RPC endpoint

const app = express();
const port = 3000; // Replace with your desired port number
app.use(bodyParser.json());

// Create an instance of the contract
const contract = new web3.eth.Contract(contractABI, contractAddress, {
  chainId: 81, // Set the correct Chain ID for Astar Network
});

// Example: Mint a single token
async function mintSingleToken(toAddress, tokenId, amount) {
  try {
    const gasPrice = web3.utils.toWei("3.7", "gwei"); // Convert 4.5 Gwei to Wei
    const gas = web3.utils.toWei("4.0", "gwei"); // Convert 4.5 Gwei to Wei

    const fromAddress =
      web3.eth.accounts.privateKeyToAccount(privateKey).address;

    const txObject = {
      from: fromAddress,
      to: contractAddress,
      data: contract.methods.mint(toAddress, tokenId, amount).encodeABI(),
      gas: gas, // Adjust the gas limit as per your requirement
      gasPrice: gasPrice, // Set the desired gas price
    };

    const signedTransaction = await web3.eth.accounts.signTransaction(
      txObject,
      privateKey
    );

    const receipt = await web3.eth.sendSignedTransaction(
      signedTransaction.rawTransaction
    );
    console.log(
      "Token minted successfully! Transaction hash:",
      receipt.transactionHash
    );
  } catch (error) {
    console.error("Error minting token:", error);
    throw error;
  }
}

// API endpoint to mint a token
app.post("/mint", async (req, res) => {
  const { toAddress, tokenId, amount } = req.body;
  if (!toAddress || !tokenId || !amount) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }
  try {
    console.log(`Token minted successfully!`);
  } catch (error) {
    console.error("Error minting token:", error);
    res.status(500).json({ error: "Error minting token" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
