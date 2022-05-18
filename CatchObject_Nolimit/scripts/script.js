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
'블렌디드 수업'       ,'SW,AI교육'           ,'메타버스교육'        ,'수업평가'             ,'교원역량'            ,
'부산다행복지구'      ,'학교지원과'          ,'지역교육'             ,'다양한 교육기회'      ,'자유학년제'           ,
'특성화고교학점제'    ,'고교학점제'          ,'그린스마트'           ,'남부창의마루'         ,'서부글로벌'           ,
'동부창의센터 '       ,'수학문화관'          ,'알로이시오기지'       ,'학리기후변화'         ,'놀이마루'            ,
'인성,건강,안전    '  ,'무상급식'            ,'교복지원'             ,'수학여행비'          ,'문화예술활동비'       ,
'도서구입비'          ,'다누림 활동비'       ,'방과후 자유수강권'    ,'특수학생 교통비'      ,'MOOC기반'            ,
'AI기반'             ,'지역환경교과서'
];

const positiveSecondKeywords = 
[
'환경 구축'          ,'활성화'              ,'선도'                 ,'혁신'                ,'강화'                ,
'운영'               ,'설립'                ,'협력시스템 확대'       ,'제공'                ,'전면 시행'           ,
'전면 시행'          ,'연구학교 지정'        ,'미래학교 추진'        ,' '                   ,'외국어센터 설립'      ,
'설립'               ,'설립'                ,'1968 지원'            ,'교육센터 설립'        ,'설립'                ,
'교육 체험관 설립'    ,'완성'                ,' '                    ,'지원'                ,'지원'                ,
'지원'               ,'지원'                ,'지원'                 ,'치료비 지원'          ,'AI교육콘텐츠'        ,
'수학학습플랫폼'      ,' '
];

const positiveLength = 32;

const negativeKeywords = ['이념논쟁','특혜계약지시','민주교육철폐','체벌찬성','아빠찬스','근무중 골프','음주운전','불통행정','흑색선전','획일적 평준화'];
const negativeLength = 10;

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
