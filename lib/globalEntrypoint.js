const core = require('@actions/core');
const github = require('@actions/github');
const yml = require('js-yaml');
const fs = require('fs');
axios = require('axios'); //global! all subcalls make use of this

let pipePath;
try {
  pipePath = "../pipeline.yml";//core.getInput('BTCPipePath');
} catch (e) {
  core.setFailed(e.message);
}

try {
  // read and process yml
  let fileContents = fs.readFileSync(pipePath, 'utf8');
  let pipeline = yml.load(fileContents);

  if(!(pipeline.hasOwnProperty('startup'))) {
    const startupStep = require("./startup.js");
    startupStep.main({});
  }

  

  let skipRemainingStepsDueToFailure = false;
  Object.keys(pipeline).forEach(function(step) {
    args = pipeline[step];
    if (skipRemainingStepsDueToFailure === true) {
      return;
    }
    try { //run step
      let lib;
      switch(step) {
        // endpoint steps
        case "startup":
        case "wrapup":
        // init steps
        case "profileLoad":
        case "cCode":
        case "targetLink":
        case "embeddedCoder":
        case "simulink":
        case "simulinkToplevel":
        // analysis steps
        case "requirementsBasedTest":
        case "backToBackTest":
        case "vectorGeneration":
        case "codeAnalysisReport":
        case "domainCheckGoals":
        // import and export steps
        case "executionRecordImport":
        case "executionRecordExport":
        case "inputRestrictionsImport":
        case "inputRestrictionsExport":
        case "toleranceImport":
        case "toleranceExport":
        case "vectorImport":
        case "vectorExport":
          lib = require("./"+step+".js");
          break;
        default:
          console.log("Test step '" + step + "' is not a supported step. Please refer to the docs and verify the spelling.");
          return;
      }
      lib.main(args); // entrypoint to step function
    } catch (e) {
      //skipRemainingStepsDueToFailure = true; TODO: uncomment in finished prod
      //console.log("Error! Skipping remaining steps;");
      //console.log(e);
    }
  })

  // wrapup step
  if(!(pipeline.hasOwnProperty('wrapup')) || skipRemainingStepsDueToFailure == true) {
    const wrapupStep = require("./wrapup.js");
    wrapupStep.main(pipeline.hasOwnProperty('wrapup') ? pipeline['wrapup'] : {});
  }

} catch(e) {
  console.log(e)
}