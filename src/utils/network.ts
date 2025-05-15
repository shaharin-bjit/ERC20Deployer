// Network utility functions
export const getNetworkName = (chainId: number | null): string => {
  if (!chainId) return 'Disconnected';

  const networks: Record<number, string> = {
    1: 'Ethereum Mainnet',
    5: 'Goerli Testnet',
    11155111: 'Sepolia Testnet',
    3: 'Ropsten Testnet',
    4: 'Rinkeby Testnet',
    42: 'Kovan Testnet',
    56: 'BSC Mainnet',
    97: 'BSC Testnet',
    137: 'Polygon Mainnet',
    80001: 'Mumbai Testnet',
    43114: 'Avalanche Mainnet',
    43113: 'Avalanche Testnet',
  };

  return networks[chainId] || `Unknown Network (${chainId})`;
};

export const getNetworkColor = (chainId: number | null): string => {
  if (!chainId) return 'bg-gray-500';

  // Mainnet networks
  if ([1, 56, 137, 43114].includes(chainId)) {
    return 'bg-primary-500';
  }
  
  // Testnet networks
  if ([5, 11155111, 3, 4, 42, 97, 80001, 43113].includes(chainId)) {
    return 'bg-accent-500';
  }
  
  return 'bg-warning-500';
};

export const shortenAddress = (address: string | null): string => {
  if (!address) return '';
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

export const copyToClipboard = (text: string): void => {
  navigator.clipboard.writeText(text);
};