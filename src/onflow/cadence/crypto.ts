import { p256 } from "@noble/curves/p256";
import SHA3 from "sha3";

export const generateKeyPair = () => {
  const privateKey = p256.utils.randomPrivateKey();
  return {
    private: Buffer.from(privateKey).toString("hex"),
    public: Buffer.from(
      p256.getPublicKey(privateKey, false).subarray(1),
    ).toString("hex"),
  };
};

export const hashMsg = (msg: string): Buffer => {
  if (!/^(?:[0-9a-f]{2})*$/i.test(msg)) {
    throw new Error("Message must contain complete hexadecimal bytes");
  }
  const sha = new SHA3(256);
  sha.update(Buffer.from(msg, "hex"));

  return sha.digest();
};

export const signWithKey = (privateKey: string, msg: string): string => {
  // Flow signs a SHA3-256 digest and expects fixed-width r || s bytes.
  const signature = p256.sign(hashMsg(msg), privateKey, { prehash: false });
  return Buffer.from(signature.toCompactRawBytes()).toString("hex");
};
