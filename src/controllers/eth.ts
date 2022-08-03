import { ChainId } from '../utils/constants';
import crypto from 'crypto';
import { providers, Contract, Wallet } from 'ethers';
import { conf } from '../utils/config';
import { JsonFragment } from '@ethersproject/abi';
import { getExplorerURLForTx, getGasPrice } from '../utils/blockchain';

type MintResponse = {
  success: boolean;
  txHash: string;
  scanUrl: string;
};

export class EthController {
  /**
   * mintToken allows the demo users to request a token to grant them access to a page
   * @param clientID
   * @param roleName
   * @param address
   * @returns
   */
  mintToken = async (
    clientID: string,
    roleName: string,
    address: string
  ): Promise<MintResponse> => {
    if (!conf.mintContracts) {
      throw new Error('No mint contracts configured');
    }
    const contractInfo = conf.mintContracts[roleName];
    if (!contractInfo) {
      throw new Error(`Invalid role name: ${roleName}`);
    }

    const hexID = `0x${crypto
      .createHash('sha256')
      .update(clientID)
      .digest()
      .toString('hex')}`;

    const mintABI: JsonFragment[] = [
      {
        inputs: [
          {
            internalType: 'address',
            name: 'account',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'id',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'amount',
            type: 'uint256',
          },
          {
            internalType: 'bytes',
            name: 'data',
            type: 'bytes',
          },
        ],
        name: 'mint',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
    ];

    const provider = new providers.JsonRpcProvider(
      getEndpointUrl(contractInfo.chainId)
    );
    const signer = new Wallet(conf.wallet?.pk || '', provider);
    const contract = new Contract(contractInfo.contract, mintABI, signer);

    const gasPrice = await getGasPrice(contractInfo.chainId);
    const estimateGas = await contract.estimateGas.mint(address, hexID, 1, []);

    //const tx = await contract.functions.mint(address, hexID, 1, []);
    //const tx = await contract.populateTransaction.mint(address, hexID, 1, []);
    const tx = await contract.mint(address, hexID, 1, [], {
      gasLimit: estimateGas,
      maxFeePerGas: Math.floor(gasPrice.fast.maxFee * 1e9),
      maxPriorityFeePerGas: Math.floor(gasPrice.fast.maxPriorityFee * 1e9),
    });

    return {
      txHash: tx.hash,
      success: true,
      scanUrl: getExplorerURLForTx(contractInfo.chainId, tx.hash),
    };
  };
}

const getEndpointUrl = (chainID: ChainId): string => {
  switch (chainID) {
    case ChainId.Rinkeby:
      return `${conf.quickNode?.rinkeby.endpoint}/${conf.quickNode?.rinkeby.api_token}`;
    case ChainId.Polygon:
      return `${conf.quickNode?.polygon.endpoint}/${conf.quickNode?.polygon.api_token}`;
    case ChainId.Mumbai:
      return `${conf.quickNode?.mumbai.endpoint}/${conf.quickNode?.mumbai.api_token}`;
    case ChainId.Ethereum:
    default:
      return `${conf.quickNode?.ethereum.endpoint}/${conf.quickNode?.ethereum.api_token}`;
  }
};
