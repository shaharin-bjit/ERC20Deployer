import React, { useState } from 'react';
import { Check, Copy, ExternalLink } from 'lucide-react';
import { Token } from '../types';
import { getNetworkColor, copyToClipboard } from '../utils/network';

interface TokenCardProps {
  token: Token;
}

const TokenCard: React.FC<TokenCardProps> = ({ token }) => {
  const [copied, setCopied] = useState<Record<string, boolean>>({});
  
  const handleCopy = (text: string, field: string) => {
    copyToClipboard(text);
    setCopied({ [field]: true });
    setTimeout(() => setCopied({ [field]: false }), 2000);
  };
  
  const networkColor = getNetworkColor(token.chainId);
  const txExplorerUrl = token.chainId === 1 
    ? `https://etherscan.io/tx/${token.deploymentTxHash}`
    : token.chainId === 5
    ? `https://goerli.etherscan.io/tx/${token.deploymentTxHash}`
    : token.chainId === 11155111
    ? `https://sepolia.etherscan.io/tx/${token.deploymentTxHash}`
    : token.chainId === 137
    ? `https://polygonscan.com/tx/${token.deploymentTxHash}`
    : token.chainId === 80001
    ? `https://mumbai.polygonscan.com/tx/${token.deploymentTxHash}`
    : token.chainId === 56
    ? `https://bscscan.com/tx/${token.deploymentTxHash}`
    : token.chainId === 97
    ? `https://testnet.bscscan.com/tx/${token.deploymentTxHash}`
    : '#';
  
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  return (
    <div className="card group hover:border-primary-600">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h3 className="text-lg font-semibold text-white">{token.name}</h3>
          <span className="rounded-md bg-gray-700 px-2 py-0.5 text-xs font-mono text-gray-300">
            {token.symbol}
          </span>
        </div>
        <div className="flex items-center">
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
            token.chainId === 1 ? 'bg-blue-900 text-blue-200' : 'bg-orange-900 text-orange-200'
          }`}>
            <span className={`mr-1 h-2 w-2 rounded-full ${networkColor}`}></span>
            {token.networkName}
          </span>
        </div>
      </div>
      
      <div className="mt-4 space-y-2 text-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <span className="text-gray-400">Contract Address:</span>
          <div className="flex items-center font-mono text-gray-300">
            <span className="truncate max-w-[200px]">{token.address}</span>
            <button
              onClick={() => handleCopy(token.address, 'address')}
              className="ml-2 text-gray-500 hover:text-white"
            >
              {copied.address ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <span className="text-gray-400">Total Supply:</span>
          <span className="font-mono text-gray-300">
            {parseFloat(token.totalSupply).toLocaleString()} {token.symbol}
          </span>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <span className="text-gray-400">Decimals:</span>
          <span className="font-mono text-gray-300">{token.decimals}</span>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <span className="text-gray-400">Deployed On:</span>
          <span className="text-gray-300">{formatDate(token.deploymentDate)}</span>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <span className="text-gray-400">Owner:</span>
          <div className="flex items-center font-mono text-gray-300">
            <span className="truncate max-w-[200px]">{token.ownerAddress}</span>
            <button
              onClick={() => handleCopy(token.ownerAddress, 'owner')}
              className="ml-2 text-gray-500 hover:text-white"
            >
              {copied.owner ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-4 flex justify-end">
        <a
          href={txExplorerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center text-xs text-primary-400 hover:text-primary-300"
        >
          View on Explorer <ExternalLink className="ml-1 h-3 w-3" />
        </a>
      </div>
    </div>
  );
};

export default TokenCard;