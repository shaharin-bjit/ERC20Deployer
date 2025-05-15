import React, { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Coins, List, CircleOff, ExternalLink } from "lucide-react";
import { useWeb3 } from "../context/Web3Context";
import {
  getNetworkName,
  getNetworkColor,
  shortenAddress,
} from "../utils/network";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const {
    account,
    chainId,
    connectWallet,
    disconnectWallet,
    isConnected,
    isConnecting,
  } = useWeb3();

  const networkName = getNetworkName(chainId);
  const networkColor = getNetworkColor(chainId);

  const navigation = [
    { name: "Deploy Token", path: "/", icon: Coins },
    { name: "My Tokens", path: "/tokens", icon: List },
  ];

  return (
    <div className="flex min-h-screen flex-col dark:bg-gray-900">
      <header className="sticky top-0 z-10 border-b border-gray-800 bg-gray-900 bg-opacity-80 backdrop-blur-md">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center space-x-2">
            <Coins className="h-6 w-6 text-primary-500" />
            <span className="text-xl font-bold text-white">
              BJIT ERC-20 Deployer
            </span>
          </div>

          <div className="flex items-center space-x-4">
            {isConnected && chainId ? (
              <div className="flex items-center">
                <span
                  className={`mr-2 inline-block h-3 w-3 rounded-full ${networkColor}`}
                ></span>
                <span className="hidden md:inline-block text-sm font-medium text-gray-300">
                  {networkName}
                </span>
                <span className="mx-2 text-gray-500">|</span>
                <div className="flex items-center space-x-1">
                  <span className="text-sm font-medium text-gray-300">
                    {shortenAddress(account)}
                  </span>
                  {/* <button
                    onClick={disconnectWallet}
                    className="ml-2 inline-flex items-center rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white"
                  >
                    <CircleOff className="h-4 w-4" />
                  </button> */}
                </div>
              </div>
            ) : (
              <button
                onClick={connectWallet}
                disabled={isConnecting}
                className="btn btn-primary"
              >
                {isConnecting ? "Connecting..." : "Connect Wallet"}
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto flex flex-1 flex-col md:flex-row">
        <aside className="w-full border-r border-gray-800 md:w-64">
          <nav className="flex overflow-x-auto md:block md:overflow-visible py-4">
            {navigation.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`
                    group mx-2 flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors
                    ${
                      isActive
                        ? "bg-gray-800 text-white"
                        : "text-gray-700 hover:bg-gray-800 hover:text-white"
                    }
                  `}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 flex-shrink-0 ${
                      isActive
                        ? "text-primary-500"
                        : "text-gray-700 group-hover:text-primary-400"
                    }`}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1 p-4">{children}</main>
      </div>

      <footer className="border-t border-gray-800 bg-gray-900 py-4">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          <p>
            &copy; {new Date().getFullYear()} BJIT ERC-20 Token Deployer. All
            rights reserved.
          </p>
          <div className="mt-2 flex items-center justify-center space-x-4">
            <a
              href="https://ethereum.org/en/developers/docs/standards/tokens/erc-20/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center hover:text-primary-400"
            >
              ERC-20 Standard <ExternalLink className="ml-1 h-3 w-3" />
            </a>
            <a
              href="https://docs.ethers.org/v5/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center hover:text-primary-400"
            >
              Ethers.js <ExternalLink className="ml-1 h-3 w-3" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
