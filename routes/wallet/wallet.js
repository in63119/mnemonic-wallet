const express = require("express");
const wallet = express.Router();

const lightwallet = require("eth-lightwallet");

exports.newMnemonic = async(req,res) => {
    let mnemonic;

    try {
        mnemonic = lightwallet.keystore.generateRandomSeed();
        res.json({mnemonic});
    } catch(err) {
        console.log(err);
    }
};

exports.newWallet = async(req,res) => {

};

module.exports = wallet;