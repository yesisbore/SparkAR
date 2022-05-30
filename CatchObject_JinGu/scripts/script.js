/**
 * (c) Meta Platforms, Inc. and affiliates. Confidential and proprietary.
 */

import SceneModule from 'Scene';

//==============================================================================
// Welcome to scripting in Spark AR Studio! Helpful links:
//
// Scripting Basics - https://fb.me/spark-scripting-basics
// Reactive Programming - https://fb.me/spark-reactive-programming
// Scripting Object Reference - https://fb.me/spark-scripting-reference
// Changelogs - https://fb.me/spark-changelog
//
// Spark AR Studio extension for VS Code - https://fb.me/spark-vscode-plugin
//
// For projects created with v87 onwards, JavaScript is always executed in strict mode.
//==============================================================================


// How to load in modules
const Scene = require('Scene');

// Use export keyword to make a symbol available in scripting debug console
export const Diagnostics = require('Diagnostics');
const Reactive = require('Reactive');

export let firstKeywords = "out";
export let keyword = "out";

let score = 0 ;
let maxScore = 20 ;
let point = 0 ;
let index = 0 ;
let isInitialize = false;
let valueChange = false;
let preValue = 0;

function Print(a){
  Diagnostics.log(a);
}

const Patches = require('Patches');


const positiveFirstKeywords =  
[
'동백전'              ,'오토바이'           ,'청년부부'              ,'헬스, 필라테스'       ,'청년'                  ,
'담배꽁초'            ,'서면대표축제'       ,'시민공원'              ,'1인가구'              ,'영·유아 놀이'         ,            
];

const positiveSecondKeywords = 
[ 
'캐시백 추가'         ,'소음해결'             ,'월세지원'            ,'이용쿠폰'            ,'저축 지원'              ,
'없는 서면'           ,' '                    ,'공영주차장확보'      ,'지원'                ,'전용공간 건립'         ,
];

const positiveLength = 10;

const negativeKeywords = ['경찰공무원','정치신인','범죄도시','재난컨트롤 타워'];
const negativeLength = 4;

const addValue = 1;
const subValue = -1;
const keywordLength = positiveLength + negativeLength;

main();


function main(){

  Patches.outputs.getBoolean('SpawnObj').then(event => {
    event.monitor({ fireOnInitialValue: true }).subscribe(function (values) {
        SetKeyword();
        //Diagnostics.log("To Script Boolean newValue: ".concat(values.newValue.toString()));
        //Diagnostics.watch("To Script Boolean oldValue: ", values.oldValue);
        // ! use values.newValue to keep type - .concat and .toString are for displaying values with descriptors !
    });
  });
  Patches.outputs.getBoolean('EnterObj').then(event => {
    event.monitor({ fireOnInitialValue: true }).subscribe(function (values) {
      AddScore();
    });
  });
  Patches.outputs.getScalar('TotalScore').then(event => {
    event.monitor({ fireOnInitialValue: true }).subscribe(function (values) {
      let result =  "점수 : " + values.newValue.toString() + " / " + positiveLength;
      if(values.newValue < 0){
        result =  "점수 : 0 / " + positiveLength;
      }
      Patches.inputs.setString('score', result);
    });
  });
}

function SetKeyword(){
  
  if(!isInitialize) {
    isInitialize = true;
    return;
  }

  let probability = Math.random() ;
  Print("확률 : " + probability);
  if(probability <= 1){
    let i = index % positiveLength;
    keyword  = positiveFirstKeywords [i] ;

    if(positiveSecondKeywords[i] != ' '){
      keyword  += '\n' + positiveSecondKeywords[i];
    }
    point = addValue;
    Print("SetKeyword : Positive / Index : " + index);
  }
  else{
    let i = index % negativeLength;
    keyword = negativeKeywords[i];
    point = subValue;
    Print("SetKeyword : Negative / Index : " + index);
  }

  index ++;
  Patches.inputs.setString('keyword', keyword);


}

function AddScore(){
  
  TurnOnEffect(point);

  if(index >= positiveLength){
    Print('게임종료');
    GameEnd();
  }
}

function GameEnd(){
  Patches.inputs.setPulse('GameEnd', Reactive.once());
}

function TurnOnEffect(num){
  // 점수를 획득하면 Add Effect발동
  if(num == addValue){
    Patches.inputs.setPulse('TurnOnAddEffect', Reactive.once());
    //Patches.inputs.setBoolean("TurnOnAddEffect",true)
  }
  else if (num == subValue){
    Patches.inputs.setPulse('TurnOnSubEffect', Reactive.once());
    //Patches.inputs.setBoolean("TurnOnSubEffect",true)
  }
}
