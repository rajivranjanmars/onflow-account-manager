export const createAccountCadence = `
transaction(publicKey: String) {
	let payer: AuthAccount

	prepare(payer: AuthAccount) {
	  self.payer = payer
	}

	execute {
	  let account = AuthAccount(payer: self.payer)

	  account.addPublicKey(publicKey.decodeHex())
	}
  }
`;
