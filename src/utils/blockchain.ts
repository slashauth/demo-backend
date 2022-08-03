import fetch from 'node-fetch';
import { ChainId } from './constants';

type Fee = {
  maxPriorityFee: number;
  maxFee: number;
};

type PolygonGasPrice = {
  safeLow: Fee;
  standard: Fee;
  fast: Fee;
  estimatedBaseFee: number;
  blockTime: number;
  blockNumber: number;
};

export const getGasPrice = async (
  chainId: ChainId
): Promise<PolygonGasPrice> => {
  let endpoint = '';
  if (chainId === ChainId.Mumbai) {
    endpoint = 'https://gasstation-mumbai.matic.today/v2';
  } else if (chainId === ChainId.Polygon) {
    endpoint = 'https://gasstation-mainnet.matic.network/v2';
  } else {
    throw new Error('Unsupported chain for gas prices by HTTP');
  }
  const resp = await fetch(endpoint);
  if (!resp.ok) {
    throw new Error(`Failed to fetch gas prices: ${resp.status}`);
  }
  return await resp.json();
};

export const getExplorerURLForTx = (chainID: ChainId, tx: string) => {
  switch (chainID) {
    case ChainId.Ethereum:
      return `https://etherscan.io/tx/${tx}`;
    case ChainId.Rinkeby:
      return `https://rinkeby.etherscan.io/tx/${tx}`;
    case ChainId.Polygon:
      return `https://polygonscan.com/tx/${tx}`;
    case ChainId.Mumbai:
      return `https://mumbai.polygonscan.com/tx/${tx}`;
  }
};
