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
'낙동강 별빛'         ,'화명생태공원'        ,'만덕대로 상부'         ,'리스타트 센터'        ,'에코어드벤쳐'          ,
'철도 지하화'         ,'덕천 도시재생'       ,'북구 문화체육센터'     ,'북구 신청사'          ,'포스트 코로나'         ,
'자엉업'              ,'생계형 체납자'       ,'청년도전 1인당'        ,'북구 청년센터'        ,'부산 최초'            ,
'생활문화센터'        ,'문화이음사업'        ,'시민문화살롱'          ,'1인가구 지원'         ,'1인가구'              ,
'1인가구'             ,'1인가구'             ,'1인가구'              ,'0~6세 영유아'         ,'다함께 돌봄센터'       ,

'반려동물'              
];

const positiveSecondKeywords = 
[
'테마공원 조성'       ,'수상극장 조성'        ,'공원화'              ,'건립'                ,'테마파크 조성'         ,
'상부 공원화 개발'    ,'뉴딜사업'             ,'수영장 건립'         ,'건립'                ,'일상회복 지원'         ,
'재도약 지원'         ,'재기 지원'            ,'100만원 지원'        ,'조성'                ,'청년부서 신설'          ,
'조성'               ,' '                    ,' '                   ,'조례 제정'           ,'정책전담반 구성'       ,
'지원센터 운영'       ,'정보포털 운영'        ,'반값 중개보수'        ,'병원비 전액 지원'     ,'조성'     ,

'친화도시 조성'       
];

const positiveLength = 26;

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
