const { ethers, JsonRpcProvider } = require('ethers');
const fs = require("fs-extra");

async function main() {
    const provider = new JsonRpcProvider("HTTP://127.0.0.1:7545");
    const wallet = new ethers.Wallet("0x75bc779212f4eecaae3a28596ac1e07fdeb1b7187565674ba5b6c1d7b429bd84", provider);
    const abi = fs.readFileSync("./simpleStorage_sol_SimpleStorage.abi", "utf8");
    const binary = fs.readFileSync("./simpleStorage_sol_SimpleStorage.bin", "utf8");
    const contractFactory = new ethers.ContractFactory(abi, binary, wallet);
    console.log("Deploying, please wait ...");
    const contract = await contractFactory.deploy({ gasPrice: 20000000000, gasLimit: 6721975 });
    // console.log(contract);
}

main().then(() => process.exit(0)).catch((error) => {
    console.error(error);
    process.exit(1);
})