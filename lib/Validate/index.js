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
exports.FastTransaction = exports.ValidationTransaction = void 0;
/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
const _ = __importStar(require("lodash"));
const Transaction_1 = require("../Transaction");
const errors_1 = require("../utils/errors");
class ValidationTransaction extends Transaction_1.Transaction {
    constructor(operation, asset, config) {
        super(operation, asset, config);
    }
    validateTransaction(resdb, currentTransactions = []) {
        const inputConditions = [];
        if (this.operation == 'CREATE') {
            const duplicates = _.filter(currentTransactions, (tx) => tx.id === this.id);
            // TODO check if id already committed
            // if resdb.is_committed(self.id) or duplicates:
            //     raise DuplicateTransaction('transaction `{}` already exists'
            //                                .format(self.id))
            if (!this.inputsValid(inputConditions)) {
                throw new errors_1.InvalidSignature("Transaction signature is inalid");
            }
        }
        else if (this.operation == "TRANSFER") {
            this.validateTransferInputs(resdb, currentTransactions);
        }
        return this;
    }
}
exports.ValidationTransaction = ValidationTransaction;
ValidationTransaction.ASSET = "asset";
ValidationTransaction.METADATA = "metadata";
ValidationTransaction.DATA = "data";
class FastTransaction {
    constructor(txObject) {
        this.transaction = txObject;
    }
    getId() {
        return this.transaction.id;
    }
    toJson() {
        return this.transaction;
    }
}
exports.FastTransaction = FastTransaction;
