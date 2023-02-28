export type KeyPair = { public: string; private: string };

export const enum TxStatus {
  Unknown = 0,
  /**
   * Transaction Pending - Awaiting Finalization
   */
  Pending = 1,
  /**
   * Transaction Finalized - Awaiting Execution
   */
  Finalized = 2,
  /**
   * Transaction Executed - Awaiting Sealing
   */
  Executed = 3,
  /**
   * Transaction Sealed - Transaction Complete. At this point the transaction
   * result has been committed to the blockchain.
   */
  Sealed = 4,
  /**
   * Transaction Expired
   */
  Expired = 5,
}
