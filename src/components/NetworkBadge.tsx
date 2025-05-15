import React from 'react';
import { useWeb3 } from '../context/Web3Context';
import { getNetworkName, getNetworkColor } from '../utils/network';

const NetworkBadge: React.FC = () => {
  const { chainId, networkType } = useWeb3();
  
  const networkName = getNetworkName(chainId);
  const networkColor = getNetworkColor(chainId);
  
  if (!chainId) {
    return (
      <span className="inline-flex items-center rounded-full bg-gray-700 px-3 py-1 text-xs font-medium text-gray-200">
        <span className="mr-1.5 h-2 w-2 rounded-full bg-gray-500"></span>
        Disconnected
      </span>
    );
  }
  
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
      networkType === 'mainnet' ? 'bg-blue-900 text-blue-200' : 
      networkType === 'testnet' ? 'bg-orange-900 text-orange-200' : 
      'bg-gray-700 text-gray-200'
    }`}>
      <span className={`mr-1.5 h-2 w-2 rounded-full ${networkColor}`}></span>
      {networkName}
    </span>
  );
};

export default NetworkBadge;