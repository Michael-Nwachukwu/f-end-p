import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';

declare global {
  interface Window {
    ethereum: any;
  }
}

const networkInfoMap: any = {
  11155111: {
    chainId: `0x${(11155111).toString(16)}`,
    chainName: "Sepolia test network",
    rpcUrls: ["https://eth-sepolia.g.alchemy.com/v2/AXZTpQuCryhmuSxFjmGQ5QNpExmCcLhq"],
    blockExplorerUrls: ["https://sepolia.etherscan.io"],
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
  },
  84531: {
    chainId: `0x${(84531).toString(16)}`,
    chainName: "Base Goerli",
    rpcUrls: ["https://base-sepolia.g.alchemy.com/v2/AXZTpQuCryhmuSxFjmGQ5QNpExmCcLhq"],
    blockExplorerUrls: ["https://sepolia.basescan.org/"],
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
  },
};

export const useWalletConnection = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState<string>('0');
  const [randomAddressBalance, setRandomAddressBalance] = useState<string>('0');
  const [chainId, setChainId] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [accounts, setAccounts] = useState<string[]>([]);

  const connectWallet = useCallback(async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(accounts[0]);
        setIsActive(true);
        console.log("Wallet connected successfully");
      } catch (error: any) {
        if (error.code === 4001) {
          alert("User rejected the request");
        } else {
          console.error(error.message);
        }
      }
    } else {
      alert("Please install MetaMask Extension");
    }
  }, []);

  const logAccounts = useCallback(async (accounts: string[]) => {
    if (!accounts.length) {
      setAccount(null);
      setChainId(null);
      setIsActive(false);
    } else {
      setAccount(accounts[0]);
      const chain = await window.ethereum.request({
        method: "eth_chainId",
      });
      setChainId(chain);
      console.log(`Account changed to ${accounts[0]}`);
    }
  }, []);

  const logNetwork = useCallback((chainId: string) => {
    setChainId(chainId);
    console.log(`Network changed to ${chainId}`);
  }, []);

  const logChainId = useCallback(async () => {
    if (window.ethereum) {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      console.log(`Current chain ID: ${chainId}`);
    }
  }, []);

  const logAvailableAccounts = useCallback(async () => {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      setAccounts(accounts);
      console.log(`Available accounts: ${accounts.join(', ')}`);
    }
  }, []);

  const handleSwitchToChain = useCallback(async (chain: string) => {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${parseInt(chain).toString(16)}` }],
      });
    } catch (error: any) {
      if (error.code === 4902 || error.code === -32603) {
        const chainInfo = networkInfoMap[parseInt(chain)];
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [chainInfo],
          });
        } catch (error: any) {
          alert("You rejected network addition! " + error.message);
        }
      }
    }
  }, []);

  const getConnectedBalance = useCallback(async () => {
    if (window.ethereum && account) {
      try {
        const balance = await window.ethereum.request({
          method: "eth_getBalance",
          params: [account, "latest"],
        });
        const formattedBalance = ethers.formatEther(balance);
        setBalance(formattedBalance);
        console.log(`Balance of connected user: ${formattedBalance} ETH`);
      } catch (error: any) {
        console.error(`Error fetching balance: ${error.message}`);
      }
    } else {
      console.error("Please connect wallet or install MetaMask Extension");
    }
  }, [account]);

    const getRandomBalance = useCallback(async (address: string) => {
        if (window.ethereum) {
            try {
                const balance = await window.ethereum.request({
                    method: "eth_getBalance",
                    params: [address, "latest"],
                });
                const formattedBalance = ethers.formatEther(balance);
                setRandomAddressBalance(formattedBalance);
                console.log(`Balance of address ${address}: ${formattedBalance} ETH`);
            } catch (error: any) {
                console.error(`Error fetching balance: ${error.message}`);
            }
        } else {
            console.error("Please install MetaMask Extension");
        }
    }, []);

    useEffect(() => {
        if (!window.ethereum) return;
        
        connectWallet();

        window.ethereum.on('accountsChanged', logAccounts);
        window.ethereum.on('chainChanged', logNetwork);

        return () => {
            window.ethereum.removeListener("accountsChanged", logAccounts);
            window.ethereum.removeListener("chainChanged", logNetwork);
        };
    }, [connectWallet, logAccounts, logNetwork]);

  return {
    account,
    balance,
    chainId,
    isActive,
    accounts,
    randomAddressBalance,
    connectWallet,
    logChainId,
    logAvailableAccounts,
    handleSwitchToChain,
    getConnectedBalance,
    getRandomBalance,
  };
};