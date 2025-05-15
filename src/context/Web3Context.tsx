import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { ethers } from "ethers";
import { NetworkType, Token } from "../types";

interface Web3ContextType {
  account: string | null;
  chainId: number | null;
  networkType: NetworkType;
  provider: ethers.providers.Web3Provider | null;
  signer: ethers.Signer | null;
  isConnected: boolean;
  isConnecting: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  getDeployedTokens: () => Token[];
  addDeployedToken: (token: Token) => void;
}

const Web3Context = createContext<Web3ContextType>({} as Web3ContextType);

export const useWeb3 = () => useContext(Web3Context);

interface Web3ProviderProps {
  children: ReactNode;
}

export const Web3Provider: React.FC<Web3ProviderProps> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  console.log("🚀 ~ chainId:", chainId);
  const [provider, setProvider] =
    useState<ethers.providers.Web3Provider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const isConnected = !!account && !!provider;
  console.log("🚀 ~ account:", account);

  const networkType: NetworkType =
    chainId === 1
      ? "mainnet"
      : [5, 80001, 97, 4, 11155111].includes(chainId!)
      ? "testnet"
      : "unknown";

  // Get deployed tokens from local storage
  const getDeployedTokens = (): Token[] => {
    const tokens = localStorage.getItem("deployedTokens");
    return tokens ? JSON.parse(tokens) : [];
  };

  // Add a deployed token to local storage
  const addDeployedToken = (token: Token) => {
    const tokens = getDeployedTokens();
    const updatedTokens = [token, ...tokens];
    localStorage.setItem("deployedTokens", JSON.stringify(updatedTokens));
  };

  // Connect to MetaMask
  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask to use this application");
      return;
    }

    setIsConnecting(true);

    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const ethProvider = new ethers.providers.Web3Provider(window.ethereum);
      const ethSigner = ethProvider.getSigner();
      const network = await ethProvider.getNetwork();

      console.log("🚀 ~ setting account");
      setAccount(accounts[0]);
      setChainId(network.chainId);
      setProvider(ethProvider);
      setSigner(ethSigner);
    } catch (error) {
      console.error("Error connecting to MetaMask:", error);
      alert("Failed to connect to MetaMask");
    } finally {
      setIsConnecting(false);
    }
  };

  // Disconnect from MetaMask
  const disconnectWallet = () => {
    setAccount(null);
    setChainId(null);
    setProvider(null);
    setSigner(null);
  };

  // Listen for account and chain changes
  useEffect(() => {
    console.log("🚀 ~ useEffect ~ account:", account);
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else if (accounts[0] !== account) {
        setAccount(accounts[0]);
      }
    };

    const handleChainChanged = (chainIdHex: string) => {
      const newChainId = parseInt(chainIdHex, 16);
      setChainId(newChainId);
      // Reload the page on chain change as recommended by MetaMask
      window.location.reload();
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);

    // Check if already connected
    if (window.ethereum.isConnected && window.ethereum.selectedAddress) {
      connectWallet();
    }

    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum.removeListener("chainChanged", handleChainChanged);
    };
  }, [account]);

  const contextValue: Web3ContextType = {
    account,
    chainId,
    networkType,
    provider,
    signer,
    isConnected,
    isConnecting,
    connectWallet,
    disconnectWallet,
    getDeployedTokens,
    addDeployedToken,
  };

  return (
    <Web3Context.Provider value={contextValue}>{children}</Web3Context.Provider>
  );
};
