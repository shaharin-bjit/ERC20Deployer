import axios from "axios";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const fetchGasEstimate = async () => {
  try {
    const apiKey = process.env.ETHERSCAN_API_KEY;

    if (!apiKey) {
      throw new Error(
        "API key is missing. Please set ETHERSCAN_API_KEY in your .env file."
      );
    }

    const url = `https://api.etherscan.io/v2/api`;
    const params = {
      chainid: 1,
      module: "gastracker",
      action: "gasestimate",
      gasprice: 2000000000,
      apikey: apiKey,
    };

    const response = await axios.get(url, { params });
    console.log("Gas Estimate Response:", response.data);
  } catch (error) {
    console.error("Error fetching gas estimate:", error.message);
  }
};

const fetchGasOracle = async () => {
  try {
    const apiKey = process.env.ETHERSCAN_API_KEY;

    if (!apiKey) {
      throw new Error(
        "API key is missing. Please set ETHERSCAN_API_KEY in your .env file."
      );
    }

    const url = `https://api.etherscan.io/v2/api`;
    const params = {
      chainid: 1,
      module: "gastracker",
      action: "gasoracle",
      apikey: apiKey,
    };

    const response = await axios.get(url, { params });
    // Get the current time and timezone
    const now = new Date();
    const time = now.toLocaleTimeString();
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    console.log(
      `Gas Oracle Response (Prices are in gwei) [Time: ${time}, Timezone: ${timezone}]:`,
      response.data
    );
  } catch (error) {
    console.error("Error fetching gas oracle:", error.message);
  }
};

// Call the function
fetchGasOracle();
