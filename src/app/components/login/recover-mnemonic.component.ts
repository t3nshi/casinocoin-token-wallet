import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { WalletService } from '../../providers/wallet.service';
import { ElectronService } from '../../providers/electron.service';
import { LocalStorageService } from 'ngx-store';
import { CSCUtil } from '../../domains/csc-util';
import { CSCCrypto } from '../../domains/csc-crypto';
import { AppConstants } from '../../domains/app-constants';
import { LogService } from '../../providers/log.service';
import { BehaviorSubject } from 'rxjs';
import { CasinocoinService } from '../../providers/casinocoin.service';
import { LokiKey, LokiAccount, LokiTransaction, LokiTxStatus } from '../../domains/lokijs';
import { WalletDefinition } from '../../domains/csc-types';
import { UUID } from 'angular2-uuid';

@Component({
    selector: 'app-recover-mnemonic',
    templateUrl: './recover-mnemonic.component.html',
    styleUrls: [],
    providers: [ ]
})

export class RecoverMnemonicComponent implements OnInit {

    selectedWallet: string;
    walletLocation: string;
    walletTestNetwork: boolean;
    networkChoice = 'LIVE';

    returnUrl: string;
    footer_visible = false;
    error_message: string;

    active_icon = 'pi pi-check';

    dialog_visible = true;

    recoveryWords = {
        word1: '',
        word2: '',
        word3: '',
        word4: '',
        word5: '',
        word6: '',
        word7: '',
        word8: '',
        word9: '',
        word10: '',
        word11: '',
        word12: ''
    };
    recoveryEmail: string;
    walletPassword: string;
    confirmWalletPassword: string;
    walletRecoveryEnabled = false;

    paswordConfirmationEnabled = false;
    passwordsEqual = false;
    passwordPattern = '(?=.*[0-9])(?=.*[a-z]).{8,}';

    constructor(
        private logger: LogService,
        private route: ActivatedRoute,
        private router: Router,
        private walletService: WalletService,
        private electron: ElectronService,
        private casinocoinService: CasinocoinService,
        private localStorageService: LocalStorageService
    ) { }

    ngOnInit() {
        this.logger.debug('### RecoverMnemonic onInit');
        // get return url from route parameters or default to '/'
        this.selectedWallet = this.route.snapshot.queryParams['walletUUID'];
        this.walletLocation = this.route.snapshot.queryParams['walletLocation'];
        this.walletTestNetwork = false;
        this.logger.debug('### RecoverMnemonic for: ' + this.selectedWallet + ' and path: ' + this.walletLocation);
        this.error_message = '';
        this.footer_visible = false;
    }

    onNetworkChanged(newValue) {
        this.logger.debug('### RecoverMnemonic - Test Network?: ' + newValue);
        this.walletService.walletSetup.testNetwork = newValue;
    }

    checkPasswordUpdate(newValue: string) {
        this.walletPassword = newValue;
        if (newValue !== undefined) {
            const testResult = newValue.match(this.passwordPattern);
            if (testResult !== null) {
                this.paswordConfirmationEnabled = true;
                // check if equal
                if (newValue === this.confirmWalletPassword) {
                    this.passwordsEqual = true;
                    this.error_message = '';
                    this.footer_visible = false;
                } else {
                    this.passwordsEqual = false;
                    this.error_message = 'Passwords are not the same';
                    this.footer_visible = true;
                }
            } else {
                this.paswordConfirmationEnabled = false;
                this.error_message = 'Password does not meet requirements.';
                this.footer_visible = true;
            }
        }
    }

    checkPasswordConfirmedUpdate(newConfirmValue: string) {
        this.confirmWalletPassword = newConfirmValue;
        if (newConfirmValue === this.walletPassword) {
            this.logger.debug('### RecoverMnemonic - passwords are the same ');
            this.passwordsEqual = true;
            this.error_message = '';
            this.footer_visible = false;
        } else {
            this.passwordsEqual = false;
            this.error_message = 'Passwords are not the same';
            this.footer_visible = true;
        }
    }

    checkWords() {
        let wordError = false;
        let allwordsFilled = true;
        if (this.recoveryWords.word1.length > 1) {
            if (!CSCCrypto.isExistingWord(this.recoveryWords.word1)) {
                this.error_message = 'Word 1 does not exist in the allowed word list';
                this.footer_visible = true;
                wordError = true;
            }
        } else {
            allwordsFilled = false;
        }
        if (this.recoveryWords.word2.length > 1 && !wordError) {
            if (!CSCCrypto.isExistingWord(this.recoveryWords.word2)) {
                this.error_message = 'Word 2 does not exist in the allowed word list';
                this.footer_visible = true;
                wordError = true;
            }
        } else {
            allwordsFilled = false;
        }
        if (this.recoveryWords.word3.length > 1 && !wordError) {
            if (!CSCCrypto.isExistingWord(this.recoveryWords.word3)) {
                this.error_message = 'Word 3 does not exist in the allowed word list';
                this.footer_visible = true;
                wordError = true;
            }
        } else {
            allwordsFilled = false;
        }
        if (this.recoveryWords.word4.length > 1 && !wordError) {
            if (!CSCCrypto.isExistingWord(this.recoveryWords.word4)) {
                this.error_message = 'Word 4 does not exist in the allowed word list';
                this.footer_visible = true;
                wordError = true;
            }
        } else {
            allwordsFilled = false;
        }
        if (this.recoveryWords.word5.length > 1 && !wordError) {
            if (!CSCCrypto.isExistingWord(this.recoveryWords.word5)) {
                this.error_message = 'Word 5 does not exist in the allowed word list';
                this.footer_visible = true;
                wordError = true;
            }
        } else {
            allwordsFilled = false;
        }
        if (this.recoveryWords.word6.length > 1 && !wordError) {
            if (!CSCCrypto.isExistingWord(this.recoveryWords.word6)) {
                this.error_message = 'Word 6 does not exist in the allowed word list';
                this.footer_visible = true;
                wordError = true;
            }
        } else {
            allwordsFilled = false;
        }
        if (this.recoveryWords.word7.length > 1 && !wordError) {
            if (!CSCCrypto.isExistingWord(this.recoveryWords.word7)) {
                this.error_message = 'Word 7 does not exist in the allowed word list';
                this.footer_visible = true;
                wordError = true;
            }
        } else {
            allwordsFilled = false;
        }
        if (this.recoveryWords.word8.length > 1 && !wordError) {
            if (!CSCCrypto.isExistingWord(this.recoveryWords.word8)) {
                this.error_message = 'Word 8 does not exist in the allowed word list';
                this.footer_visible = true;
                wordError = true;
            }
        } else {
            allwordsFilled = false;
        }
        if (this.recoveryWords.word9.length > 1 && !wordError) {
            if (!CSCCrypto.isExistingWord(this.recoveryWords.word9)) {
                this.error_message = 'Word 9 does not exist in the allowed word list';
                this.footer_visible = true;
                wordError = true;
            }
        } else {
            allwordsFilled = false;
        }
        if (this.recoveryWords.word10.length > 1 && !wordError) {
            if (!CSCCrypto.isExistingWord(this.recoveryWords.word10)) {
                this.error_message = 'Word 10 does not exist in the allowed word list';
                this.footer_visible = true;
                wordError = true;
            }
        } else {
            allwordsFilled = false;
        }
        if (this.recoveryWords.word11.length > 1 && !wordError) {
            if (!CSCCrypto.isExistingWord(this.recoveryWords.word11)) {
                this.error_message = 'Word 11 does not exist in the allowed word list';
                this.footer_visible = true;
                wordError = true;
            }
        } else {
            allwordsFilled = false;
        }
        if (this.recoveryWords.word12.length > 1 && !wordError) {
            if (!CSCCrypto.isExistingWord(this.recoveryWords.word12)) {
                this.error_message = 'Word 12 does not exist in the allowed word list';
                this.footer_visible = true;
                wordError = true;
            }
        } else {
            allwordsFilled = false;
        }
        if (!wordError) {
            this.error_message = '';
            this.footer_visible = false;
            if (allwordsFilled) {
                this.walletRecoveryEnabled = true;
            } else {
                this.walletRecoveryEnabled = false;
            }
        } else {
            this.walletRecoveryEnabled = false;
        }
    }

    removeUndefined(obj: Object): Object {
        // return _.omit(obj, _.isUndefined)
        Object.keys(obj).forEach(key => obj[key] === undefined && delete obj[key]);
        return obj;
    }

    doRecoverWallet() {
        this.error_message = '';
        this.footer_visible = false;
        this.active_icon = 'pi fa-spin pi-spinner';
        if (this.recoveryWords.word1.length === 0 ||
            this.recoveryWords.word2.length === 0 ||
            this.recoveryWords.word3.length === 0 ||
            this.recoveryWords.word4.length === 0 ||
            this.recoveryWords.word5.length === 0 ||
            this.recoveryWords.word6.length === 0 ||
            this.recoveryWords.word7.length === 0 ||
            this.recoveryWords.word8.length === 0 ||
            this.recoveryWords.word9.length === 0 ||
            this.recoveryWords.word10.length === 0 ||
            this.recoveryWords.word11.length === 0 ||
            this.recoveryWords.word12.length === 0) {
                this.footer_visible = true;
                this.error_message = 'Please enter all 12 words!';
        } else {
            this.logger.debug('### Recover with words: ' + JSON.stringify(this.recoveryWords));
            this.logger.debug('### Network: ' + this.networkChoice);
            if (this.networkChoice === 'TEST') {
                this.walletTestNetwork = true;
            } else {
                this.walletTestNetwork = false;
            }
            const recoveryArray = [];
            recoveryArray.push([this.recoveryWords.word1,
                                this.recoveryWords.word2,
                                this.recoveryWords.word3,
                                this.recoveryWords.word4,
                                this.recoveryWords.word5,
                                this.recoveryWords.word6,
                                this.recoveryWords.word7,
                                this.recoveryWords.word8,
                                this.recoveryWords.word9,
                                this.recoveryWords.word10,
                                this.recoveryWords.word11,
                                this.recoveryWords.word12
                              ]);
            // recover the wallet
            const cscCrypto = new CSCCrypto(recoveryArray, this.recoveryEmail);
            const walletUUID = UUID.UUID();
            this.walletService.walletSetup = {
                userEmail: this.recoveryEmail,
                userPassword: this.walletPassword,
                recoveryMnemonicWords: recoveryArray,
                testNetwork: this.walletTestNetwork,
                walletUUID: walletUUID,
                backupLocation: this.electron.remote.getGlobal('vars').backupLocation,
                walletPasswordHash: this.walletService.generateWalletPasswordHash(walletUUID, this.walletPassword),
                walletLocation: ''
            };
            const mnemonicHash = cscCrypto.getPasswordKey();
            this.logger.debug('### Recover - mnemonicHash: ' + mnemonicHash);
            const encMnemonicCscCrypto = new CSCCrypto(this.walletService.walletSetup.userPassword, this.walletService.walletSetup.userEmail);
            const encryptedMnemonicHash = encMnemonicCscCrypto.encrypt(mnemonicHash);
            this.localStorageService.set(AppConstants.KEY_WALLET_PASSWORD_HASH, this.walletService.walletSetup.walletPasswordHash);
            this.localStorageService.set(AppConstants.KEY_PRODUCTION_NETWORK, !this.walletService.walletSetup.testNetwork);

            // regenerate accounts
            const accountFindFinishedSubject = new BehaviorSubject<Boolean>(false);
            let sequence = 0;
            let accountsFound = false;
            // connect to a daemon
            const cscSubscription = this.casinocoinService.connect().subscribe( result => {
                if (result === AppConstants.KEY_CONNECTED) {
                    this.logger.debug('### Recover - Create new Wallet ###');
                    this.walletService.createWallet().subscribe( createResult => {
                        if (createResult === AppConstants.KEY_FINISHED) {
                            accountFindFinishedSubject.subscribe( finished => {
                                if (!finished) {
                                    const keyPair: LokiKey = cscCrypto.generateKeyPair(sequence);
                                    let accountInfo: any;
                                    this.logger.debug('### Recover Keypair(' + sequence + '): ' + JSON.stringify(keyPair));
                                    this.casinocoinService.cscAPI.getAccountInfo(keyPair.accountID).then( accountInfoResult => {
                                        this.logger.debug('### Recover - accountInfo: ' + JSON.stringify(accountInfoResult));
                                        accountInfo = accountInfoResult;
                                        return this.casinocoinService.cscAPI.getBalances(keyPair.accountID);
                                    }).then( balances => {
                                        if (!accountsFound) {
                                            accountsFound = true;
                                        }
                                        // save key to wallet
                                        this.walletService.addKey(keyPair);
                                        // create new account
                                        const walletAccount: LokiAccount = {
                                            pk: ('CSC' + keyPair.accountID),
                                            accountID: keyPair.accountID,
                                            balance: CSCUtil.cscToDrops(accountInfo.cscBalance),
                                            accountSequence: sequence,
                                            currency: 'CSC',
                                            tokenBalance: '0',
                                            lastSequence: accountInfo.sequence,
                                            label: 'CSC Account',
                                            activated: true,
                                            ownerCount: accountInfo.ownerCount,
                                            lastTxID: accountInfo.previousAffectingTransactionID,
                                            lastTxLedger: accountInfo.previousAffectingTransactionLedgerVersion
                                        };
                                        // save account to wallet
                                        this.walletService.addAccount(walletAccount);
                                        this.logger.debug('### Recover - CSC account saved');
                                        // loop all other balances
                                        balances.forEach(balance => {
                                            this.logger.debug('### Balance: ' + JSON.stringify(balance));
                                            if (balance.currency !== 'CSC') {
                                                // add token account
                                                const tokenAccount: LokiAccount = {
                                                    pk: (balance.currency + keyPair.accountID),
                                                    accountID: keyPair.accountID,
                                                    balance: CSCUtil.cscToDrops(accountInfo.cscBalance),
                                                    accountSequence: sequence,
                                                    currency: balance.currency,
                                                    tokenBalance: CSCUtil.cscToDrops(balance.value),
                                                    lastSequence: accountInfo.sequence,
                                                    label: (balance.currency + ' Account'),
                                                    activated: true,
                                                    ownerCount: accountInfo.ownerCount,
                                                    lastTxID: accountInfo.previousAffectingTransactionID,
                                                    lastTxLedger: accountInfo.previousAffectingTransactionLedgerVersion
                                                };
                                                this.logger.debug('### Recover - Add Token Account: ' + JSON.stringify(tokenAccount));
                                                this.walletService.addAccount(tokenAccount);
                                            }
                                        });
                                        // get account transactions
                                        return this.casinocoinService.cscAPI.getTransactions(keyPair.accountID, {earliestFirst: true});
                                    }).then( txResult => {
                                        txResult.forEach( tx => {
                                            if (tx.type === 'payment' && tx.outcome.result === 'tesSUCCESS') {
                                                this.logger.debug('### Recover - transaction: ' + JSON.stringify(tx));
                                                let txDirection: string;
                                                let txAccountID: string;
                                                if (this.walletService.isAccountMine(tx.specification['destination'].address)) {
                                                    txDirection = AppConstants.KEY_WALLET_TX_IN;
                                                    txAccountID = tx.specification['destination'].address;
                                                    if (this.walletService.isAccountMine(tx.specification['source'].address)) {
                                                        txDirection = AppConstants.KEY_WALLET_TX_BOTH;
                                                        txAccountID = tx.specification['source'].address;
                                                    }
                                                } else if (this.walletService.isAccountMine(tx.specification['source'].address)) {
                                                    txDirection = AppConstants.KEY_WALLET_TX_OUT;
                                                    txAccountID = tx.specification['source'].address;
                                                }
                                                // create new transaction object
                                                const dbTX: LokiTransaction = {
                                                    accountID: tx.address,
                                                    amount: CSCUtil.cscToDrops(tx.outcome['deliveredAmount'].value),
                                                    currency: tx.outcome['deliveredAmount'].currency,
                                                    destination: tx.specification['destination'].address,
                                                    fee: CSCUtil.cscToDrops(tx.outcome.fee),
                                                    flags: 0,
                                                    lastLedgerSequence: tx.outcome.ledgerVersion,
                                                    sequence: tx.sequence,
                                                    signingPubKey: '',
                                                    timestamp: CSCUtil.iso8601ToCasinocoinTime(tx.outcome.timestamp),
                                                    transactionType: tx.type,
                                                    txID: tx.id,
                                                    txnSignature: '',
                                                    direction: txDirection,
                                                    validated: (tx.outcome.indexInLedger >= 0),
                                                    status: LokiTxStatus.validated,
                                                    inLedger: tx.outcome.ledgerVersion
                                                };
                                                // add Memos if defined
                                                if (tx.specification['memos']) {
                                                    dbTX.memos = [];
                                                    tx.specification['memos'].forEach( memo => {
                                                        const newMemo = { memo:
                                                            this.removeUndefined({
                                                                memoType: memo.type,
                                                                memoFormat: memo.format,
                                                                memoData: memo.data
                                                            })
                                                        };
                                                        dbTX.memos.push(newMemo);
                                                    });
                                                }
                                                // add Destination Tag if defined
                                                if (tx.specification['destination'].tag) {
                                                    dbTX.destinationTag = tx.specification['destination'].tag;
                                                }
                                                // add Invoice ID if defined
                                                if (tx.specification['invoiceID'] && tx.specification['invoiceID'].length > 0) {
                                                    dbTX.invoiceID = tx.specification['invoiceID'];
                                                }
                                                // insert into the wallet
                                                this.walletService.addTransaction(dbTX);
                                            }
                                        });
                                        sequence ++;
                                        accountFindFinishedSubject.next(false);
                                    }).catch(error => {
                                        this.logger.debug('### Recover Catched: ' + JSON.stringify(error));
                                        this.logger.debug('### Recover - We found our last account sequence that exists on the ledger ###');
                                        accountFindFinishedSubject.next(true);
                                    });
                                } else {
                                    // we are finished, disconnect
                                    this.logger.debug('### Recover - Account Find Finished');
                                    this.active_icon = 'pi pi-check';
                                    let resultMessage = 'Total accounts recovered: ' + sequence;
                                    if (!accountsFound && sequence === 0) {
                                        // No accounts found !
                                        resultMessage = 'No accounts could be restored during recover.';
                                    } else {
                                        // encrypt all found keys
                                        this.walletService.encryptAllKeys(this.walletService.walletSetup.userPassword, this.walletService.walletSetup.userEmail).subscribe( encryptResult => {
                                            if (encryptResult === AppConstants.KEY_FINISHED) {
                                            this.logger.debug('### Recover - Key Encryption Complete');
                                            }
                                        });
                                        // save the wallet
                                        this.walletService.saveWallet();
                                        const currentTimestamp: number = CSCUtil.iso8601ToCasinocoinTime(new Date().toISOString());
                                        this.logger.debug('### Recover - Current Timestamp CSC: ' + CSCUtil.casinocoinTimeToISO8601(currentTimestamp));
                                        const walletDefinition: WalletDefinition = {
                                            walletUUID: this.walletService.walletSetup.walletUUID,
                                            creationDate: currentTimestamp,
                                            location: this.walletService.walletSetup.walletLocation,
                                            network: (this.walletService.walletSetup.testNetwork ? 'TEST' : 'LIVE'),
                                            userEmail: this.walletService.walletSetup.userEmail,
                                            passwordHash: this.walletService.walletSetup.walletPasswordHash,
                                            mnemonicHash: encryptedMnemonicHash
                                        };
                                        let walletArray: Array<WalletDefinition> = this.localStorageService.get(AppConstants.KEY_AVAILABLE_WALLETS);
                                        if (walletArray == null) {
                                            // first wallet so init array
                                            walletArray = [];
                                        }
                                        walletArray.push(walletDefinition);
                                        this.localStorageService.set(AppConstants.KEY_AVAILABLE_WALLETS, walletArray);
                                        this.localStorageService.set(AppConstants.KEY_WALLET_LOCATION, this.walletService.walletSetup.walletLocation);
                                        this.localStorageService.set(AppConstants.KEY_WALLET_PASSWORD_HASH, this.walletService.walletSetup.walletPasswordHash);
                                        this.localStorageService.set(AppConstants.KEY_SETUP_COMPLETED, true);
                                    }
                                    this.electron.remote.dialog.showMessageBox({ message: resultMessage, buttons: ['OK']}, (showResult) => {
                                        cscSubscription.unsubscribe();
                                        this.casinocoinService.disconnect();
                                        this.router.navigate(['login']);
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    }

    onHideRecoverWallet() {
        this.logger.debug('### Return to Login');
        this.router.navigate(['login']);
    }
}
