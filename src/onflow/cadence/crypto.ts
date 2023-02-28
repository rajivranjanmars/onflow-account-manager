import { ec as EC } from "elliptic";
import SHA3 from "sha3";

export const ec = new EC("p256");

export const hashMsg = (msg: string): Buffer => {
  const sha = new SHA3(256);
  sha.update(Buffer.from(msg, "hex"));

  return sha.digest();
};

export const signWithKey = (privateKey: string, msg: string): string => {
  const key = ec.keyFromPrivate(Buffer.from(privateKey, "hex"));
  const sig = key.sign(hashMsg(msg));
  const n = 32;
  const r = sig.r.toArrayLike(Buffer, "be", n);
  const s = sig.s.toArrayLike(Buffer, "be", n);

  return Buffer.concat([r, s]).toString("hex");
};
