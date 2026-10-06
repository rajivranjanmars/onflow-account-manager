const test = require("node:test");
const assert = require("node:assert/strict");
const { createPublicKey, verify } = require("node:crypto");
const {
  generateKeyPair,
  signWithKey,
} = require("../lib/onflow/cadence/crypto");

test("Flow P-256 signatures verify independently with Node crypto and SHA3-256", () => {
  const keys = generateKeyPair();
  assert.equal(keys.private.length, 64);
  assert.equal(keys.public.length, 128);
  const bytes = Buffer.from(keys.public, "hex");
  const publicKey = createPublicKey({
    key: {
      kty: "EC",
      crv: "P-256",
      x: bytes.subarray(0, 32).toString("base64url"),
      y: bytes.subarray(32).toString("base64url"),
    },
    format: "jwk",
  });
  const message = "00010203ff";
  const signature = Buffer.from(signWithKey(keys.private, message), "hex");
  assert.equal(signature.length, 64);
  const key = { key: publicKey, dsaEncoding: "ieee-p1363" };
  assert.equal(
    verify("sha3-256", Buffer.from(message, "hex"), key, signature),
    true,
  );
  assert.equal(
    verify("sha3-256", Buffer.from("00", "hex"), key, signature),
    false,
  );
});

test("invalid message encodings and invalid private scalars are rejected", () => {
  const keys = generateKeyPair();
  assert.throws(() => signWithKey(keys.private, "f"), /hexadecimal/);
  assert.throws(() => signWithKey(keys.private, "zz"), /hexadecimal/);
  assert.throws(() => signWithKey("00".repeat(32), "00"));
});
