import ProtocolFeesCollector from './protocol-fees-collector';
import { balancerContractsService } from '../balancer-contracts.service';
import Vault from './vault';
import { Contract } from '@ethersproject/contracts';
import { mocked } from 'ts-jest/utils';

jest.mock('../balancer-contracts.service');
jest.mock('./vault');

jest.mock('ethers', () => {
  return {
    Contract: jest.fn().mockImplementation(() => {
      return {
        getSwapFeePercentage: jest.fn().mockImplementation(() => {
          return '100000000000000000'; // 10%
        })
      };
    })
  };
});

describe('ProtocolFeesCollector', () => {
  const vault = new Vault(balancerContractsService);
  const mockedContract = mocked(Contract, true);

  beforeEach(() => {
    jest.clearAllMocks();
    mockedContract.mockClear();
  });

  it('Instantiates the provider service', () => {
    const protocolFeesCollector = new ProtocolFeesCollector(vault);
    expect(protocolFeesCollector).toBeTruthy();
  });

  describe('getSwapFeePercentage', () => {
    it('returns percentage as fractional number', async () => {
      const protocolFeesCollector = new ProtocolFeesCollector(vault);
      const percentage = await protocolFeesCollector.getSwapFeePercentage();

      expect(percentage).toBe(0.1);
    });

    it('returns 0 if error thrown', async () => {
      jest.spyOn(console, 'error').mockImplementation();
      vault.instance.getProtocolFeesCollector.mockImplementation(() => {
        throw new Error('Failed to fetch addresss');
      });

      const protocolFeesCollector = new ProtocolFeesCollector(vault);
      const percentage = await protocolFeesCollector.getSwapFeePercentage();

      expect(percentage).toBe(0);
    });
  });
});
