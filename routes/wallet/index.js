var express = require('express');
var router = express.Router();
const lightwallet = require("eth-lightwallet");
const fs = require('fs');
const { User } = require('../../models');

router.post('/user', async(req,res) => {
  // 포스트맨에서 userName, password를 넣으면
  let reqUserName, reqPassword;
  reqUserName = req.body.userName;
  reqPassword = req.body.password;

  // user에서 find로 userName을 찾고,
  User.findOrCreate({
    where: {
      userName: reqUserName
    },
    default: {
      password: reqPassword
    }
  })
  .then(([user, created]) => {
    if (!created) {
      // 있으면 있다고 응답.
      res.status(409).send("User exists");
    // 없으면 DB에 저장
    } else {
      // 니모닉코드 생성  
      let mnemonic;
      mnemonic = lightwallet.keystore.generateRandomSeed();
      // console.log(mnemonic);
      // 생성된 니모닉코드와 password로 privateKey, address 생성
      lightwallet.keystore.createVault({
        password: reqPassword, 
        seedPhrase: mnemonic,
        hdPathString: "m/0'/0'/0'"
      },
      function (err, ks) {
        ks.keyFromPassword(reqPassword, function (err, pwDerivedKey) {
          ks.generateNewAddress(pwDerivedKey, 1);
          
          let address = (ks.getAddresses()).toString();
          let keyStore = ks.serialize();

          // 키스토어 저장
          // fs.writeFile('wallet.json',keyStore,function(err,data){
          //   if(err) {
          //     res.json({code:999,message:"실패"});
          //   } 
          // })     

          User.update({
            password: reqPassword,
            address: address,
            privateKey: mnemonic
          }, {
            where: {
              userName: reqUserName
            }
          })
          .then(result => {
            // 주소를 보여준다.
            res.json(address);
          })
          .catch(err => {
            console.error(err);
          })
        });
      });
      // const resp = user.get({ plain: true });
      // res.status(201).json(resp);
    }
  })
});


// 개인키 생성은 키스토어.json을 추출함으로서 사용해야 함. (다른 요청)
// wallet = fs.readFile('wallet.json');
// newKeystore = lightwallet.keystore.deserialize(wallet);
// let privateKey = newKeystore.exportPrivateKey(address.toString(), pwDerivedKey);


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