export type NetworkType = 'mainnet' | 'testnet' | 'unknown';

export interface Token {
  id: string;
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: string;
  address: string;
  deploymentDate: number;
  chainId: number;
  networkName: string;
  deploymentTxHash: string;
  ownerAddress: string;
}

export interface TokenFormData {
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: string;
}

export interface DeploymentStatus {
  status: 'idle' | 'deploying' | 'success' | 'error';
  message: string;
  txHash?: string;
  contractAddress?: string;
}