import React, { useState } from 'react';
import { useWalletConnection } from './hooks/useWalletConnect';

const ConnectWallet = () => {
  const {
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
  } = useWalletConnection();

  const [randomAddress, setRandomAddress] = useState('');

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Wallet Connection</h1>
      
      <div className="space-y-2 space-x-3">
        <button 
          onClick={connectWallet}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {isActive ? 'Connected' : 'Connect Wallet'}
        </button>
        
        <button 
          onClick={logChainId}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Log Chain ID
        </button>
        
        <button 
          onClick={logAvailableAccounts}
          className="bg-purple-500 text-white px-4 py-2 rounded"
        >
          Log Available Accounts
        </button>
        
        <button 
          onClick={getConnectedBalance}
          className="bg-yellow-500 text-white px-4 py-2 rounded"
        >
          Get Connected Balance
        </button>
      </div>

      <div className="mt-4 space-y-2">
        <input
          type="text"
          value={randomAddress}
          onChange={(e) => setRandomAddress(e.target.value)}
          placeholder="Enter address to check balance"
          className="w-full px-3 py-2 border rounded"
        />
        <button 
          onClick={() => getRandomBalance(randomAddress)}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Get Random Address Balance
        </button>
      </div>

      <div className="mt-4 space-y-2 space-x-3">
        <button 
          onClick={() => handleSwitchToChain('11155111')}
          className="bg-indigo-500 text-white px-4 py-2 rounded"
        >
          Switch to Sepolia
        </button>
        <button 
          onClick={() => handleSwitchToChain('84531')}
          className="bg-pink-500 text-white px-4 py-2 rounded"
        >
          Switch to Base Goerli
        </button>
      </div>

      <div className="mt-4 space-y-2">
        <p className="text-lg"><strong>Connected Account:</strong> {account || 'Not connected'}</p>
        <p className="text-lg"><strong>Chain ID:</strong> {chainId || 'Unknown'}</p>
        <p className="text-lg"><strong>Balance:</strong> {balance} ETH</p>
        <p className="text-lg"><strong>Random Account Balance:</strong> {randomAddressBalance} ETH</p>
        <p className="text-lg"><strong>Available Accounts:</strong> {accounts.join(', ') || 'None'}</p>
      </div>
    </div>
  );
};

export default ConnectWallet;