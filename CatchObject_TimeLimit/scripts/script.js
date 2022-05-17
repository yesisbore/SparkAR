/**
 * (c) Meta Platforms, Inc. and affiliates. Confidential and proprietary.
 */

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
export let firstKeywords = "out";
export let keyword = "out";

let score = 0 ;
let maxScore = 10 ;
let point = 0 ;
let index = 0 ;
let isInitialize = false;

//Diagnostics.log('Hello World!');

function Print(a){
  Diagnostics.log(a);
}
function PrintArray(array){
  array.forEach(element => {
    return Print(element) ;
  });
}
//Print("My Name is Hong");
//Print("안녕하세요");

const Patches = require('Patches');

const positiveFirstKeywords =  ['공약평가'    ,'교육청평가'  ,'무상교육','교육공간','진로진학','미래교육','1인1스마트기기','블렌디드수업','AI기반 학습 확대','부산교육'         ,'메타버스 기반 수업','청소년글로벌센터','청소년창업학교','영화학교 설립','부산예술학교 설립','우리동네 자람터','부산발 교육혁명'];
const positiveSecondKeywords = ['3년연속 최대','3년연속 우수','전면실현','완전혁신','지원강화','전환선도',' '             ,' '          ,' '              ,'빅데이터센터 도입' ,' '                ,' '               ,' '            ,' '           ,' '                ,' '             ,' '];
const positiveLength = 17;

const negativeKeywords = ['부정선거','음주운전','불통행정','흑색선전','부정입학','획일적 평준화','학력깜깜이'];
const negativeLength = 7;

const addValue = 1;
const subValue = -1;

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

  if(probability <= 0.7){
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
  let result = score + " / " + maxScore;

  Patches.inputs.setScalar('point', point);
  Patches.inputs.setString('score', result);

  if(maxScore - score == 0){
    Print('Game Win');
    Patches.inputs.setBoolean("GameResult",true)
  }
}
