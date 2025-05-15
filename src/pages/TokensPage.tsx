import React, { useState, useEffect } from "react";
import { Info } from "lucide-react";
import { Token } from "../types";
import { useWeb3 } from "../context/Web3Context";
import TokenCard from "../components/TokenCard";

const TokensPage: React.FC = () => {
  const { getDeployedTokens } = useWeb3();
  const [tokens, setTokens] = useState<Token[]>([]);
  const [filter, setFilter] = useState<"all" | "mainnet" | "testnet">("all");

  useEffect(() => {
    // Load tokens from local storage
    const storedTokens = getDeployedTokens();
    console.log("🚀 ~ useEffect ~ storedTokens:", storedTokens);
    setTokens(storedTokens);
  }, [getDeployedTokens]);

  const filteredTokens = tokens.filter((token) => {
    if (filter === "all") return true;
    if (filter === "mainnet")
      return [1, 56, 137, 43114].includes(token.chainId);
    if (filter === "testnet")
      return [5, 11155111, 3, 4, 42, 97, 80001, 43113].includes(token.chainId);
    return true;
  });

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">My Deployed Tokens</h1>
        <p className="mt-2 text-gray-700">
          View and manage your previously deployed ERC-20 tokens
        </p>
      </div>

      {tokens.length > 0 ? (
        <>
          <div className="mb-4 flex space-x-2">
            <button
              className={`btn ${
                filter === "all" ? "btn-primary" : "btn-outline"
              }`}
              onClick={() => setFilter("all")}
            >
              All
            </button>
            <button
              className={`btn ${
                filter === "mainnet" ? "btn-primary" : "btn-outline"
              }`}
              onClick={() => setFilter("mainnet")}
            >
              Mainnet
            </button>
            <button
              className={`btn ${
                filter === "testnet" ? "btn-primary" : "btn-outline"
              }`}
              onClick={() => setFilter("testnet")}
            >
              Testnet
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
            {filteredTokens.map((token) => (
              <TokenCard key={token.id} token={token} />
            ))}
          </div>

          {filteredTokens.length === 0 && (
            <div className="rounded-lg border border-gray-700 bg-gray-800 p-8 text-center">
              <p className="text-gray-400">
                No tokens found matching the selected filter.
              </p>
            </div>
          )}
        </>
      ) : (
        <div className="rounded-lg border border-gray-700 bg-gray-800 p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-900">
            <Info className="h-6 w-6 text-primary-400" />
          </div>
          <h3 className="mt-2 text-xl font-medium text-white">
            No tokens found
          </h3>
          <p className="mt-1 text-gray-400">
            You haven't deployed any ERC-20 tokens yet. Go to the Deploy page to
            create your first token.
          </p>
        </div>
      )}
    </div>
  );
};

export default TokensPage;
