import * as fcl from "@onflow/fcl";

import { signWithKey } from "../cadence/crypto";
import { Address, TxId } from "../types";

import { KeyPair, TxStatus } from "./types";

export class Account {
  private static DEFAULT_SEQ_NUM: number = 0;

  private constructor(
    public readonly address: Address,
    private readonly keyPair: KeyPair,
    private _seqNum: number,
    private readonly _keyId: number,
    private _txId?: TxId,
  ) {}

  public static async new(args: {
    address: Address;
    keyPair: KeyPair;
    keyId?: number;
    seqNum?: number;
  }): Promise<Account> {
    let seqNum = args.seqNum;
    const keyId = args.keyId ?? Account.DEFAULT_SEQ_NUM;
    if (!seqNum) {
      const account = await fcl.account(args.address);
      const key = account.keys[args.keyId ?? 0];

      seqNum = key?.sequenceNumber ?? Account.DEFAULT_SEQ_NUM;
    }

    return new Account(args.address, args.keyPair, seqNum, keyId);
  }

  public get keyId(): number {
    return this._keyId;
  }

  /**
   * auto increment sequnce number
   */
  public get seqNum(): number {
    const seqNum = this._seqNum;
    this._seqNum += 1;

    return seqNum;
  }

  public get txId(): string | undefined {
    return this._txId;
  }

  public set newTxId(newTxId: TxId) {
    this._txId = newTxId;
  }

  public stringify(): string {
    return `${this.address}[${this._seqNum}]`;
  }

  public async isAvailable(): Promise<boolean> {
    if (this.txId === undefined) {
      return true;
    }

    return (
      fcl.tx(this.txId).snapshot() as unknown as Promise<{ status: number }>
    ).then((tx) => {
      const isAvailable = tx.status >= TxStatus.Sealed;

      if (isAvailable) {
        this._txId = undefined;
      }

      return isAvailable;
    });
  }

  /**
   * When creating a transaction, **`only the proposer`** must specify a sequence number.
   * Payers and authorizers are not required to.
   */
  public getCadenceAuth(args?: {
    isProposer: boolean;
  }): fcl.AuthorizationFunction {
    const { address, keyId, keyPair } = this;
    const seqNum = args?.isProposer ? this.seqNum : null;

    return (acct) => ({
      ...acct,
      addr: address,
      keyId,
      signingFunction: async (signable) => ({
        addr: address,
        keyId,
        signature: signWithKey(keyPair.private, signable.message),
      }),
      sequenceNum: seqNum,
    });
  }
}
