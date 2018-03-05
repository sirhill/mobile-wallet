import { Account } from '../model/account';

export class Profile {
  name: string;
  selected: boolean;
  settings: {  };

  tokens: {  };

  accounts: Array<Account>;
  encryptedMnemonic: any;
  mnemonicIsBackup: boolean;
  encryptedPassphrase: any;
  derivationUsed: number;
  encryptedWallet: any;
}