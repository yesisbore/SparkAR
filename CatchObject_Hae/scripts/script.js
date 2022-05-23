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
'반송지역'           ,'스마트헬스케어'       ,'해운대구청'           ,'센텀초, 송수초'       ,'재송지역 재개발'      ,
'민방위교육장'       ,'반여지역'             ,'반여3동 공영주차장'   ,'명장근린공원'         ,'해운대터널'           ,
'송정 제2터널'       ,'중동지역 재개발'      ,'그린시티'             ,'그린시티'             ,'옛)해운대역 공영'     ,
'달맞이 어울마당'     ,'53사단 유휴부지'     ,'동해선 배차간격'       ,'장산역~오시리아역'    ,'송정해수욕장'         ,
'도심형 숲명상'       ,'반여동 우회도로'      ,'반여지역 재개발'      ,'우동지역 재개발'      ,'센텀지구 상습'       ,
'우2동 어르신'        ,'우3동 중학교 신설'   ,'동백섬 주변 정비'     ,'현)해운대구청사'       
];

const positiveSecondKeywords = 
[
'민간재개발 추진'     ,'전문병원 유치'        ,'신청사 조기 준공'     ,'센텀중 증축'          ,'재건축 적극 지원'    ,
'조성'               ,'민간재개발 추진'      ,'216면 건설'           ,'조기조성'             ,'조기 착공'           ,
'조기 착공'          ,'재건축 적극 지원'     ,'지구단위계획변경'      ,'리모델링 적극 지원'   ,'주차장 500면 조성'   ,
'문화공간 조성'       ,'첨단 R&D 복합단지'   ,'10분대 단축'           ,'조기 착공'           ,'백사장 확장'         ,
'힐링파크 조성'       ,'잔여구간 조기 개설'   ,'재건축 적극 지원'     ,'재건축 적극 지원'     ,'침수지 방재사업'     ,
'복지관 조기 건립'    ,'해상 케이블카 반대'   ,'악취 영구 해결'       ,'복합문화시설 조성'     
];

const positiveLength = 29;

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
}

function SetKeyword(){
  
  if(!isInitialize) {
    isInitialize = true;
    return;
  }

  let probability = Math.random() ;
  Print("확률 : " + probability);
  if(probability <= 0.75){
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
  Print('Add Score Score : '+score+" point :"+ point);

  score += point;
  if(score < 0){
    score = 0;
  }
  let result =  "목표 점수 : " + maxScore  + "\n" + "현재 점수 : " + score ;

  TurnOnEffect(point);

  Patches.inputs.setString('score', result);

  if(score >= maxScore){
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
