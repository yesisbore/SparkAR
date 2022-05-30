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
'소방서 앞 주차'           ,'허위 학력'           ,'입시 비리'           ,'아빠 찬스'            ,'학력 깜깜이'          ,
'기초 학력 저하'        ,'하향 양극화'         ,'획일적 평준화'        ,'허위 주장'            ,'음주 운전'           ,
'일감 몰아주기'       ,'허위사실유포'        ,'악의적 비방'          ,'가짜 뉴스'            ,'공약 베끼기'         ,
'악성댓글'           ,'이념 논쟁'          ,'특혜 계약지시'          ,'민주 교육 철폐'         ,'근무 중 골프'          ,
'불통 행정'            ,'흑색선전'            ,'일제고사 부활'        
//,'수학여행비'          ,'문화예술활동비'       ,
//'도서구입비'          ,'다누림 활동비'       ,'방과후 자유수강권'    ,'특수학생 교통비'      ,'MOOC기반'            ,
//'AI기반'             ,'지역환경교과서'
];

const positiveSecondKeywords = 
[
  ' '                  ,' '                  ,' '                  ,' '                  ,' '                  ,
  ' '                  ,' '                  ,' '                  ,' '                  ,' '                  ,
  ' '                  ,' '                  ,' '                  ,' '                  ,' '                  ,
  ' '                  ,' '                  ,' '                  ,' '                  ,' '                  ,
  ' '                  ,' '                  ,' '                  
];

const positiveLength = 23;

const negativeKeywords = ['이념논쟁','특혜계약지시','민주교육철폐','체벌찬성','아빠찬스','근무중 골프','음주운전','불통행정','흑색선전','획일적 평준화','일제고사 부활'];
const negativeLength = 11;

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
  Print('Add Score Score : '+score+" point :"+ point);

  score += point;
  if(score < 0){
    score = 0;
  }
  let result =  "당선율 : " +(100 - (score *5)) + "%"  ;

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
