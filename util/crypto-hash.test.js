const cryptoHash = require('./crypto-hash');

describe('cryptoHash()', () => {

    it('generates a SHA-256 hashed output', () => {
        expect(cryptoHash('wando')).toEqual('62c4954e8b40a9dbbd593b4ef345a94b1dda34f50ca6fe0c7b7ad539d5a8aaac');
    });

    it('produces the same hash with the same input arguments in any order', () => {
        expect(cryptoHash('one', 'two', 'three')).toEqual(cryptoHash('three', 'one', 'two'));
    })

    it('produces a unique hash when the properties have changed on an input', () => {
        const foo = {};
        const originalHash = cryptoHash(foo);
        foo['a'] = 'a';

        expect(cryptoHash(foo)).not.toEqual(originalHash);
    });
});