var express = require('express');
var router = express.Router();
const lightwallet = require("eth-lightwallet");
const fs = require('fs');
const { user } = require('../../models');

router.post('/user', async(req,res) => {
  // 포스트맨에서 userName, password를 넣으면
  let userName, password, privateKey, address;

  // user에서 findOrCreate로 userName을 찾고,
  user.findOrCreate({
    where: {
      userName: req.body.userName
    }
  })
    // 있으면 있다고 응답.
    // 없으면 DB에 저장
      // 니모닉코드 생성 
      // 생성된 니모닉코드와 password로 privateKey, address 생성
      // DB에 저장
    // .then 해서 보여준다. 주소를 보여준다.
  console.log(req.body);
});





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


// 니모닉 코드와 패스워드를 이용해 keystore와 address를 생성합니다.
router.post('/newWallet', async(req, res) => {
  
  let password = req.body.password;
  let mnemonic = req.body.mnemonic;

  try {
    lightwallet.keystore.createVault({
        password: password, 
        seedPhrase: mnemonic,
        hdPathString: "m/0'/0'/0'"
      },
      function (err, ks) {
        ks.keyFromPassword(password, function (err, pwDerivedKey) {
          ks.generateNewAddress(pwDerivedKey, 1);
          
          let address = (ks.getAddresses()).toString();
          let keystore = ks.serialize();

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