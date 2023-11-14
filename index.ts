import { Resdb, Crypto, CryptoInterface } from './lib';


function doSomething(crypt: CryptoInterface = Crypto): void {
    const stuff = "GJLFJGLFJ";
    console.log(crypt.hashData(stuff));
}

doSomething()