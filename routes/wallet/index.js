var express = require('express');
var router = express.Router();
const lightwallet = require("eth-lightwallet");
const fs = require('fs');

// lightwallet 모듈을 사용하여 랜덤한 니모닉 코드를 얻습니다.
router.post('/newMnemonic', async(req,res) => {
  let mnemonic;

  try {
      mnemonic = lightwallet.keystore.generateRandomSeed();
      res.json({mnemonic});
  } catch(err) {
      console.log(err);
  }
});


// 니모닉 코드와 패스워드를 이용해 keystore를 생성합니다.
router.post('/newWallet', async(req, res) => {
  
  var password = req.body.password;
  var mnemonic = req.body.mnemonic;

  try {
    lightwallet.keystore.createVault({
        password: password, 
        seedPhrase: mnemonic,
        hdPathString: "m/0'/0'/0'"
      },
      function (err, ks) {
        ks.keyFromPassword(password, function (err, pwDerivedKey) {
          ks.generateNewAddress(pwDerivedKey, 1);
          
          var address = (ks.getAddresses()).toString();
          var keystore = ks.serialize();

          fs.writeFile('wallet.json',keystore,function(err,data){
            if(err) {
              res.json({code:999,message:"실패"});
            } else {
              res.json({"keystore": keystore, "address": address})
            }
          })
        });
      }
    );
  } catch (exception) { 
    console.log("NewWallet ==>>>> " + exception);
  }
});

module.exports = router;