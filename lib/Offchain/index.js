"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Offchain = void 0;
const _ = __importStar(require("lodash"));
const commonUtils_1 = require("../utils/commonUtils");
const Transaction_1 = require("../Transaction");
const errors_1 = require("../utils/errors");
const crypto_conditions_1 = require("crypto-conditions");
const transactionHelper_1 = require("../Transaction/transactionHelper");
class Offchain {
    static prepareTransaction(operation, config) {
        const operationType = commonUtils_1.TransactionUtils.normalizeOperation(operation);
        return Offchain._prepareTransaction(operation, config);
    }
    static _prepareTransaction(operation, config) {
        if (operation instanceof commonUtils_1.TransactionUtils.CreateOperation) {
            return Offchain._prepareCreateTransactionDispatcher(config);
        }
        return Offchain._prepareTransferTransactionDispatcher(config);
    }
    static _prepareCreateTransactionDispatcher(config) {
        delete config.inputs;
        return Offchain.prepareCreateTransaction(config);
    }
    static _prepareTransferTransactionDispatcher(config) {
        delete config.inputs;
        return Offchain.prepareTransferTransaction(config);
    }
    static prepareCreateTransaction(config) {
        let signers;
        if (!Array.isArray(config.signers)) {
            signers = [config.signers];
        }
        else {
            signers = config.signers;
        }
        let recipients = [];
        if (!config.recipients) {
            recipients = [[signers, 1]];
        }
        else if (!Array.isArray(config.recipients)) {
            recipients = [[[config.recipients], 1]];
        }
        else {
            recipients = [[config.recipients, 1]];
        }
        const [transaction, err] = Transaction_1.Transaction.create(signers, recipients, {
            metadata: config.metadata,
            asset: (config === null || config === void 0 ? void 0 : config.asset).data,
        });
        return transaction === null || transaction === void 0 ? void 0 : transaction.toDict();
    }
    static prepareTransferTransaction(config) {
        if (!config.recipients || !config.inputs || !config.asset) {
            throw new errors_1.ValueError('Receipients cannot be empty for transfer');
        }
        let recipients = [];
        if (!Array.isArray(config.recipients)) {
            recipients = [[[config.recipients], 1]];
        }
        else {
            recipients = [[config.recipients, 1]];
        }
        const fulfillments = _.map(config.inputs, (input) => {
            var _a, _b, _c, _d;
            if (typeof input.fulfillment === 'string') {
                return new Transaction_1.Input(crypto_conditions_1.Fulfillment.fromUri(input.fulfillment), input.owners_before, {
                    fulfills: new Transaction_1.TransactionLink({
                        txid: (_a = input.fulfills) === null || _a === void 0 ? void 0 : _a.txid,
                        output: (_b = input.fulfills) === null || _b === void 0 ? void 0 : _b.output,
                    }),
                });
            }
            return new Transaction_1.Input(transactionHelper_1.FulfillmentFromDetailsHelper.fulfillmentFromDetailsHandler(input.fulfillment)[0], input.owners_before, {
                fulfills: new Transaction_1.TransactionLink({
                    txid: (_c = input.fulfills) === null || _c === void 0 ? void 0 : _c.txid,
                    output: (_d = input.fulfills) === null || _d === void 0 ? void 0 : _d.output,
                }),
            });
        });
        const [transaction, err] = Transaction_1.Transaction.transfer(fulfillments, recipients, config.asset['id'], {
            metadata: config.metadata,
        });
        return transaction === null || transaction === void 0 ? void 0 : transaction.toDict();
    }
    static fulfillTransaction(transaction, privateKeys) {
        if (typeof privateKeys === "string") {
            privateKeys = [privateKeys];
        }
        const transactionObj = Transaction_1.Transaction.fromDict(transaction);
        try {
            const signedTransaction = transactionObj.sign(privateKeys);
            return signedTransaction.toDict();
        }
        catch (err) {
            throw new errors_1.MissingPrivateKeyError("missing private key");
        }
    }
}
exports.Offchain = Offchain;
