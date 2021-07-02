const cryptoHash = require('./crypto-hash');

describe('cryptoHash()', () => {

    it('generates a SHA-256 hashed output', () => {
        expect(cryptoHash('wando')).toEqual('771ecda5fc230e4b3b6ca4bdc2ac953534616f6e6db4077f6fdb0cece3522abf');
    });

    it('produces the same hash with the same input arguments in any order', () => {
        expect(cryptoHash('one', 'two', 'three')).toEqual(cryptoHash('three', 'one', 'two'));
    })
})