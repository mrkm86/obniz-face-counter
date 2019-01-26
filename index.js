"use strict";

//npm module ------------------------------------------------------------------------
const debug = require("debug")("*");
const Obniz = require("obniz");
require('date-utils');
require("dotenv").config();

//service ---------------------------------------------------------------------------
const azurestorage = require("./service/azurestorage");

//variable --------------------------------------------------------------------------
const obniz = new Obniz(process.env.OBNIZ_ID);
const group_key1 = process.env.GROUP_KEY1;
const group_key2 = process.env.GROUP_KEY2;

app.set('port', (process.env.PORT || 3000));

//-----------------------------------------------------------------------------------
//[event] obniz.onconnect
//-----------------------------------------------------------------------------------
obniz.onconnect = async function () {

  debug(`obniz is connected : ${Date()}`);

  debug(`initialaizing for camera started.`);
  obniz.io11.output(true);
  var cam = obniz.wired("ArduCAMMini", { cs:0, mosi:1, miso:2, sclk:3, gnd:4, vcc:5, sda:6, scl:7 });
  await cam.startupWait();
  debug(`initialaizing for camera completed.`);

  while(true)
	{
    let operation_enabled = process.env.OPERATION_ENABLED;
    if( operation_enabled == 'false')
    {
      debug(`because operation_enabled is false, its going to retry.`);

      //interval
      await sleep(process.env.INTERVAL_CAPTURE);

      continue;
    }

    debug(`capture operation started.`);

    debug(`capture started.`);
    const data = await cam.takeWait('1024x768');
    debug(`capture completed.`);
    debug(`image size is ${data.length} bytes.`);

    debug('converting to base64...');
    const base64 = cam.arrayToBase64(data);

    debug('uploading to BLOB...');
    var dt = new Date();
    let strDateTime = dt.toFormat("YYYYMMDDHH24MISS");
    let fileName = `${group_key1}_${group_key2}_${strDateTime}.jpg`;
    debug(`fileName:${fileName}`);
    await azurestorage.uploadBLOB(fileName, base64);

    debug(`capture operation completed.`);

    //interval
    await sleep(process.env.INTERVAL_CAPTURE);
  }
}

//-----------------------------------------------------------------------------------
//[event] obniz.onclose
//-----------------------------------------------------------------------------------
obniz.onclose = async function() {
  debug(`obniz is disconnected.`);
}

//-----------------------------------------------------------------------------------
//[function] sleep
//-----------------------------------------------------------------------------------
function sleep(time) {
  return new Promise((resolve, reject) => {
      setTimeout(() => {
          resolve();
      }, time);
  });
}