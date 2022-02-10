import Service from '../balancer-contracts.service';
import { Multicaller } from '@/lib/utils/balancer/contract';

import { BigNumber } from '@ethersproject/bignumber';
import { formatUnits } from '@ethersproject/units';

import { vebBalAddress } from '@/composables/useVeBAL';

import veBalAbi from '@/lib/abi/veBalAbi.json';

export type VeBalLockInfo = {
  lockedUntil: string;
  lockedAmount: string;
  // totalSupply: string;
  epoch: string;
};

type VeBalLockInfoResult = {
  locked: BigNumber[];
  epoch: BigNumber;
};

export default class VeBAL {
  service: Service;

  constructor(service: Service) {
    this.service = service;
  }

  public async getLockInfo(account: string): Promise<VeBalLockInfo> {
    const veBalMulticaller = new Multicaller(
      this.service.config.key,
      this.service.provider,
      veBalAbi
    );

    veBalMulticaller.call('locked', vebBalAddress.value, 'locked', [account]);
    veBalMulticaller.call('epoch', vebBalAddress.value, 'epoch');
    // veBalMulticaller.call('totalSupply', vebBalAddress.value, 'totalSupply');

    const result = await veBalMulticaller.execute<VeBalLockInfoResult>();

    return this.formatLockInfo(result);
  }

  public formatLockInfo(lockInfo: VeBalLockInfoResult) {
    const [lockedAmount, lockedUntil] = lockInfo.locked.map(amount =>
      formatUnits(amount, 18)
    );

    return {
      lockedUntil,
      lockedAmount,
      epoch: formatUnits(lockInfo.epoch, 18)
    };
  }
}