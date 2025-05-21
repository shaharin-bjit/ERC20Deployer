import React, { useState } from "react";
import { ethers } from "ethers";
import { Info } from "lucide-react";
import { TokenFormData, DeploymentStatus } from "../types";
import { validateTokenForm } from "../utils/validation";
import { useWeb3 } from "../context/Web3Context";
import NetworkBadge from "./NetworkBadge";
// filepath: /home/shaharin/Desktop/Project_files/BJIT_CRYPTO/ERC20Deployer/src/components/TokenForm.tsx
import erc20Artifact from "../artifacts/BJITCoin.json";

const erc20Abi = erc20Artifact.abi;
const erc20Bytecode = erc20Artifact.bytecode;

interface TokenFormProps {
  onDeploy: (
    contractAddress: string,
    txHash: string,
    formData: TokenFormData
  ) => void;
}

const TokenForm: React.FC<TokenFormProps> = ({ onDeploy }) => {
  const { isConnected, signer, chainId, account, networkType } = useWeb3();

  const [formData, setFormData] = useState<TokenFormData>({
    name: "",
    symbol: "",
    decimals: 18,
    totalSupply: "",
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [deploymentStatus, setDeploymentStatus] = useState<DeploymentStatus>({
    status: "idle",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "decimals" ? parseInt(value) : value,
    }));

    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form data submitted:", formData);
    const errors = validateTokenForm(formData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    if (!isConnected || !signer || !chainId) {
      alert("Please connect your wallet first");
      return;
    }

    if (networkType === "unknown") {
      alert("Please connect to a supported Ethereum network");
      return;
    }

    try {
      setDeploymentStatus({
        status: "deploying",
        message:
          "Deploying your token to the blockchain. Please confirm the transaction in MetaMask...",
      });

      // Prepare contract factory
      const factory = new ethers.ContractFactory(
        erc20Abi,
        erc20Bytecode,
        signer
      );

      // Convert total supply to account for decimals
      // const totalSupplyWithDecimals = ethers.utils.parseUnits(
      //   formData.totalSupply,
      //   formData.decimals
      // );

      // Deploy the contract
      const contract = await factory.deploy(
        // formData.name,
        // formData.symbol,
        // formData.totalSupply,
        // formData.decimals,
        // totalSupplyWithDecimals
        signer.getAddress()
      );

      console.log(
        "Contract deployment transaction:",
        contract.deployTransaction
      );

      // Wait for the contract to be mined
      await contract.deployed();

      console.log("Contract deployed at address:", contract.address);

      setDeploymentStatus({
        status: "success",
        message: "Token successfully deployed!",
        txHash: contract.deployTransaction.hash,
        contractAddress: contract.address,
      });

      onDeploy(contract.address, contract.deployTransaction.hash, formData);
    } catch (error: any) {
      console.error("Deployment error:", error);
      setDeploymentStatus({
        status: "error",
        message: `Deployment failed: ${error.message || "Unknown error"}`,
      });
    }
  };

  return (
    <div className="w-full max-w-xl bg-gray-900 p-8 rounded-lg shadow-lg">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-primary-400">
          Deploy New ERC-20 Token
        </h2>
        <NetworkBadge />
      </div>

      {deploymentStatus.status === "deploying" && (
        <div className="mb-4 rounded-md bg-blue-900/30 p-4 text-blue-200">
          <div className="flex">
            <div className="animate-spin mr-3 h-5 w-5 text-blue-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
            <p>{deploymentStatus.message}</p>
          </div>
        </div>
      )}

      {deploymentStatus.status === "success" && (
        <div className="mb-4 rounded-md bg-green-900/30 p-4 text-green-200">
          <p className="font-medium">{deploymentStatus.message}</p>
          <div className="mt-2 overflow-x-auto text-sm">
            <p>
              Contract Address:{" "}
              <span className="font-mono">
                {deploymentStatus.contractAddress}
              </span>
            </p>
            <p>
              Transaction Hash:{" "}
              <span className="font-mono">{deploymentStatus.txHash}</span>
            </p>
          </div>
        </div>
      )}

      {deploymentStatus.status === "error" && (
        <div className="mb-4 rounded-md bg-red-900/30 p-4 text-red-200 break-words max-h-32 overflow-y-auto">
          <p>{deploymentStatus.message}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="label text-gray-300">
            Token Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={"BJITCoin"}
            readOnly
            onChange={handleChange}
            placeholder="My Token"
            className={`input w-full ${
              formErrors.name ? "border-error-500" : ""
            }`}
            disabled={deploymentStatus.status === "deploying"}
          />
          {formErrors.name && (
            <p className="mt-1 text-sm text-error-500">{formErrors.name}</p>
          )}
        </div>

        <div>
          <label htmlFor="symbol" className="label text-gray-300">
            Token Symbol
          </label>
          <input
            type="text"
            id="symbol"
            name="symbol"
            value={"BJIT"}
            readOnly
            onChange={handleChange}
            placeholder="MTK"
            className={`input w-full uppercase ${
              formErrors.symbol ? "border-error-500" : ""
            }`}
            disabled={deploymentStatus.status === "deploying"}
          />
          {formErrors.symbol && (
            <p className="mt-1 text-sm text-error-500">{formErrors.symbol}</p>
          )}
        </div>

        {/* <div>
          <label htmlFor="decimals" className="label text-gray-300">
            Decimals
          </label>
          <input
            type="number"
            id="decimals"
            name="decimals"
            value={formData.decimals}
            onChange={handleChange}
            min="0"
            max="18"
            className={`input w-full ${
              formErrors.decimals ? "border-error-500" : ""
            }`}
            disabled={deploymentStatus.status === "deploying"}
          />
          {formErrors.decimals && (
            <p className="mt-1 text-sm text-error-500">{formErrors.decimals}</p>
          )}
          <p className="mt-1 text-xs text-gray-400">
            The number of decimal places the token uses (0-18, typically 18)
          </p>
        </div> */}

        <div>
          <label htmlFor="totalSupply" className="label text-gray-300">
            Total Supply
          </label>
          <input
            type="text"
            id="totalSupply"
            name="totalSupply"
            value={"50000000000"}
            readOnly
            onChange={handleChange}
            placeholder="1000000"
            className={`input w-full ${
              formErrors.totalSupply ? "border-error-500" : ""
            }`}
            disabled={deploymentStatus.status === "deploying"}
          />
          {formErrors.totalSupply && (
            <p className="mt-1 text-sm text-error-500">
              {formErrors.totalSupply}
            </p>
          )}
          <p className="mt-1 text-xs text-gray-400">
            The total number of tokens to be created (will be multiplied by
            10^decimals)
          </p>
        </div>

        <div className="rounded-md bg-gray-800 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <Info className="h-5 w-5 text-primary-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-primary-300">
                Deployment Information
              </h3>
              <div className="mt-2 text-sm text-gray-300">
                <p>
                  Your token will be deployed to the{" "}
                  <span className="font-semibold text-primary-400">
                    {networkType}
                  </span>{" "}
                  network you're currently connected to.
                </p>
                <p className="mt-1">
                  Gas fees will be charged to your wallet to deploy the
                  contract.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={!isConnected || deploymentStatus.status === "deploying"}
          >
            {deploymentStatus.status === "deploying"
              ? "Deploying..."
              : "Deploy Token"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TokenForm;
