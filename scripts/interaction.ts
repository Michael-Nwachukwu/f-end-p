import { ethers } from "ethers";

async function main() {

    const prov = "https://eth-sepolia.g.alchemy.com/v2/EcCMC95vHnWY3NDCuPcXQmyOhmJwGASA";

    const address = "0xd79Fcf066430D4c29847b69735b15d54551f4de9";


    const provider = new ethers.JsonRpcProvider(prov);

    // Get write access as an account by getting the signer
    const signer = await provider.getSigner();

    // Look up the current block number (i.e. height)
    await provider.getBlockNumber()

    // Get the current balance of an account (by address or ENS name)
    const balance = await provider.getBalance(address);

    // Since the balance is in wei, you may wish to display it
    // in ether instead.
    console.log(ethers.formatEther(balance));

    // Get the next nonce required to send a transaction
    await provider.getTransactionCount(address);

}

main();