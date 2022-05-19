/**
 * (c) Facebook, Inc. and its affiliates. Confidential and proprietary.
 */

//==============================================================================
// Welcome to scripting in Spark AR Studio! Helpful links:
//
// Scripting Basics - https://fb.me/spark-scripting-basics
// Reactive Programming - https://fb.me/spark-reactive-programming
// Scripting Object Reference - https://fb.me/spark-scripting-reference
// Changelogs - https://fb.me/spark-changelog
//
// For projects created with v87 onwards, JavaScript is always executed in strict mode.
//==============================================================================

// How to load in modules
const Scene = require('Scene');
const Patches = require('Patches');
const Reactive = require('Reactive');
const Time = require('Time');
export const Diagnostics = require('Diagnostics');

// Enables async/await in JS [part 1]
(async function () {
    //
    //
    // GET VALUES
    // get these values from the Patch Editor
    //
    //

    // Boolean: getBoolean
    // fireOnInitialValue makes this function run at start
    Patches.outputs.getBoolean('toScript_Boolean').then(event => {
        
        event.monitor({ fireOnInitialValue: true }).subscribe(function (values) {
            Diagnostics.log("To Script Boolean newValue: ".concat(values.newValue.toString()));
            if(values.newValue == true){
                Diagnostics.log(true);
            }
            //Diagnostics.watch("To Script Boolean oldValue: ", values.oldValue);
            // ! use values.newValue to keep type - .concat and .toString are for displaying values with descriptors !
        });
    });

    // Number: getScalar
    Patches.outputs.getScalar('toScript_Number').then(event => {
        event.monitor({ fireOnInitialValue: true }).subscribe(function (values) {
            Diagnostics.log("To Script Number: ".concat(values.newValue.toString()));
            // ! use values.newValue to keep type - .concat and .toString are for displaying values with descriptors !
        });
    });

    // Pulse: getPulse
    // Declare variable to keep track of this pulse
    var pulsed;

    Patches.outputs.getPulse('toScript_Pulse').then(event => {
        pulsed = event.subscribe(function () {
            // code to execute when pulse happens
            // "pulsed" variable will be available throughout the script
            

            // Refresh Time Display using the pulse to update Date();
            // setString HourMinSec to 
            var now = new Date();
            var h = now.getHours();
            var m = now.getMinutes();
            var s = now.getSeconds();
            var ms = now.getMilliseconds();
            var exactTime = h.toString().concat(":", m.toString(), ":", s.toString())

            Patches.inputs.setString('HourMinSec', exactTime);
            Diagnostics.log("Pulsed: Update Time: ".concat(exactTime));
        });
    });

    // Text: getString
    Patches.outputs.getString('toScript_Text').then(event => {
        Diagnostics.log("To Script Text: ".concat(event.pinLastValue()));
    });

    // Vector 2: getPoint2D
    // Declare variable with x and y properties
    var vector2 = { x: 0, y: 0 };

    Patches.outputs.getPoint2D('toScript_Vector2').then(pixelPointSignal => {

        // Pin
        vector2.x = pixelPointSignal.x.pinLastValue();
        vector2.y = pixelPointSignal.y.pinLastValue();
        Diagnostics.log("To Script Vector2 X: ".concat(vector2.x.toString()));
        Diagnostics.log("To Script Vector2 Y: ".concat(vector2.y.toString()));

        // Monitor
        pixelPointSignal.x.monitor({ fireOnInitialValue: true }).subscribe(function (xSignal) {
            vector2.x = xSignal.newValue;
        });
        pixelPointSignal.y.monitor({ fireOnInitialValue: true }).subscribe(function (ySignal) {
            vector2.y = ySignal.newValue;
        });

    });

    // Vector 3: getPoint
    // Declare variable with x, y, z properties
    var vector3 = { x: 0, y: 0, z: 0 };

    Patches.outputs.getPoint('toScript_Vector3').then(pointSignal => {

        // Pin
        vector3.x = pointSignal.x.pinLastValue();
        vector3.y = pointSignal.y.pinLastValue();
        vector3.z = pointSignal.z.pinLastValue();
        Diagnostics.log("To Script Vector3 X: ".concat(vector3.x.toString()));
        Diagnostics.log("To Script Vector3 Y: ".concat(vector3.y.toString()));
        Diagnostics.log("To Script Vector3 Z: ".concat(vector3.z.toString()));

        // Monitor
        pointSignal.x.monitor({ fireOnInitialValue: true }).subscribe(function (xSignal) {
            vector3.x = xSignal.newValue;
        });
        pointSignal.y.monitor({ fireOnInitialValue: true }).subscribe(function (ySignal) {
            vector3.y = ySignal.newValue;
        });
        pointSignal.z.monitor({ fireOnInitialValue: true }).subscribe(function (zSignal) {
            vector3.z = zSignal.newValue;
        });
    });

    // Vector 4: getColor
    // Declare variable with x, y, z, w properties
    var vector4 = { x: 0, y: 0, z: 0, w: 0 };

    // Cannot monitor this signal without crashing program.
    Patches.outputs.getColor('toScript_Vector4').then(colorSignal => {
        vector4.x = colorSignal.red.pinLastValue();
        vector4.y = colorSignal.green.pinLastValue();
        vector4.z = colorSignal.blue.pinLastValue();
        vector4.w = colorSignal.alpha.pinLastValue();
        Diagnostics.log("To Script Vector4 X: ".concat(vector4.x.toString()));
        Diagnostics.log("To Script Vector4 Y: ".concat(vector4.y.toString()));
        Diagnostics.log("To Script Vector4 Z: ".concat(vector4.z.toString()));
        Diagnostics.log("To Script Vector4 W: ".concat(vector4.w.toString()));
    });

    //
    //
    // SET VALUES
    // these values will be set and available from the purple Producer Patch in the Patch Editor
    //
    //

    // Boolean: setBoolean
    Patches.inputs.setBoolean('fromScript_Boolean', true);

    // Number: setScalar
    // Example number to send to Patch Editor from script
    var scriptNumber = 3;

    Patches.inputs.setScalar('fromScript_Number', scriptNumber);

    // Text: setString
    // Example string (text) to send to Patch Editor from script
    var scriptString = "Example Text";

    Patches.inputs.setString('fromScript_Text', scriptString);


    // Pulse: setPulse
    // Call this function to pulse 'FromScriptPulse'
    // Reactive.once() will send an event pulse
    // If it's not in a function, it will fire once on load
    function sendPulse() {
        Patches.inputs.setPulse('fromScript_Pulse', Reactive.once());
    }

    // Vector 2: setPoint2D
    // Declare variable to send 2 values
    var pixelSignal = Reactive.point2d(10, 20);

    // Set the vector 2
    Patches.inputs.setPoint2D('fromScript_Vector2', pixelSignal);

    // Vector 3: setPoint
    // Declare variable to send 3 values
    var pointSignal = Reactive.point(10, 20, 30);

    // Set the vector 3
    Patches.inputs.setPoint('fromScript_Vector3', pointSignal)

    // Vector 4: setPoint
    // RGBA uses values between 0.0 and 1.0
    var point4DSignal = Reactive.RGBA(0.1, 0.2, 0.3, 1);

    // Set the vector 4
    Patches.inputs.setColor('fromScript_Vector4', point4DSignal)


})();
