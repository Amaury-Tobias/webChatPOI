'use strict'
function genKeyRSA(passPhrase) {
    var bits = 512
    var MyRSAKey = cryptico.generateRSAKey(passPhrase, bits)
    var MyPublicKey = cryptico.publicKeyString(MyRSAKey)

    return {
        MyKey: MyRSAKey,
        MyPKey: MyPublicKey
    }
}