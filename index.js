/********************************************************************************/
"use strict";//おまじない

/********************************************************************************/
//モジュール読み込み
const Obniz = require("obniz");
//let oracle = require("./service/oracle");
require('date-utils');

/********************************************************************************/
//configファイル
var config = require('./config.json');


/********************************************************************************/
//変数宣言
//var OBNIZ_ID = config["OBNIZ_ID"];
var OBNIZ_ID = process.env.OBNIZ_ID


/********************************************************************************/
//関数宣言
const obniz = new Obniz(OBNIZ_ID);


/********************************************************************************/
//OBNIZ接続時イベント
/********************************************************************************/
obniz.onconnect = async function () {

  while(true)
  {
    var dt = new Date();
    var date = dt.toFormat("YYYY/MM/DD");
    var time = dt.toFormat("HH24:MI:SS");

    obniz.display.clear();
    obniz.display.print(date);
    obniz.display.print("\n");
    obniz.display.print(time);
    obniz.display.print("\n");
    obniz.display.print("Hello Obniz!");
    await sleep(1000);
  }
}

/********************************************************************************/
//スリープ(ms)
/********************************************************************************/
function sleep(time) {
  return new Promise((resolve, reject) => {
      setTimeout(() => {
          resolve();
      }, time);
  });
}