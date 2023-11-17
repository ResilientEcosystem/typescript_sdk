import * as cryptoconditions from 'crypto-conditions';
import { ResdbEndpoints } from '../ResDB/endpoints';

// check if this is right
type UnspentOutput = {
    transaction_id: string;
    output_index: string;
    amount: string;
    asset_id: string;
    condition_uri: string;
};

interface InputConstructorConfig {
    fulfills?: ResdbEndpoints.TransactionsEndpoint; // Transaction Link
}

class Input implements Object {
    public fulfillment: cryptoconditions.Fulfillment;
    public constructor(
        fulfillment: cryptoconditions.Fulfillment,
        ownersBefore: string[],
        config: InputConstructorConfig
    ) {}
}
