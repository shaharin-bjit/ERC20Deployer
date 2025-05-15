import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import TokenForm from "../components/TokenForm";
import { Token, TokenFormData } from "../types";
import { useWeb3 } from "../context/Web3Context";
import { getNetworkName } from "../utils/network";

const DeployPage: React.FC = () => {
  const navigate = useNavigate();
  const { addDeployedToken, account, chainId } = useWeb3();
  const [formData, setFormData] = useState<TokenFormData>({
    name: "",
    symbol: "",
    decimals: 18,
    totalSupply: "",
  });

  const handleSuccessfulDeploy = (
    contractAddress: string,
    txHash: string,
    formData: TokenFormData
  ) => {
    if (!account || !chainId) return;

    const token: Token = {
      id: uuidv4(),
      name: formData.name,
      symbol: formData.symbol,
      decimals: formData.decimals,
      totalSupply: formData.totalSupply,
      address: contractAddress,
      deploymentDate: Date.now(),
      chainId,
      networkName: getNetworkName(chainId),
      deploymentTxHash: txHash,
      ownerAddress: account,
    };

    addDeployedToken(token);

    setTimeout(() => {
      navigate("/tokens");
    }, 3000);
  };

  return (
    <div className="flex items-center justify-center py-8 bg-gray-900">
      <TokenForm onDeploy={handleSuccessfulDeploy} />
    </div>
  );
};

export default DeployPage;
