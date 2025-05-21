import { Wallet } from "ethers";

const createRandomWallet = () => {
  try {
    // Generate a random wallet
    const wallet = Wallet.createRandom();

    // Extract wallet details
    const address = wallet.address;
    const privateKey = wallet.privateKey;

    console.log("Random Wallet Created:");
    console.log("Address:", address);
    console.log("Private Key:", privateKey);
  } catch (error) {
    console.error("Error creating random wallet:", error.message);
  }
};

// Call the function
createRandomWallet();
