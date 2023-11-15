// check if this is right
type UnspentOutput = {
    transaction_id: string;
    output_index: string;
    amount: string;
    asset_id: string;
    condition_uri: string;
};

interface InputConstructorConfig {
    fulfills: unknown;
}

// class Input extends Object {
//     public fulfillment
//     public constructor(fulfillment, owners_before: string[], config: InputConstructorConfig) {

//     }
// }
