const core = require('@actions/core');
const github = require('@actions/github');
const yml = require('js-yaml');
const fs = require('fs')

try {
  const pipePath = core.getInput('BTCPipePath');
} catch (e) {
  core.setFailed(e.message);
}

try {
  // startup step
  // TODO: call manually
  const startupStep = require("./startup.js");
  startupStep.main();

  let fileContents = fs.readFileSync(pipePath, 'utf8');
  let pipeline = yml.safeLoad(fileContents);
  let skipRemainingStepsDueToFailure = false;
  pipeline.forEach((step, args) => {
    if (skipRemainingStepsDueToFailure === true) {
      return;
    }
    try { //run step
      let lib;
      switch(step) {
        // init steps
        case "loadProfile":
          lib = require("./"+step+".js");
          break;
        case "cCode":
          lib = require("./"+step+".js");
          break;
        case "targetLink":
          lib = require("./"+step+".js");
          break;
        case "embeddedCoder":
          lib = require("./"+step+".js");
          break;
        case "simulink":
          lib = require("./"+step+".js");
          break;
        case "simulinkToplevel":
          lib = require("./"+step+".js");
          break;
        // analysis steps
        case "requirementsBasedTest":
          lib = require("./"+step+".js");
          break;
        case "backToBackTest":
          lib = require("./"+step+".js");
          break;
        case "vectorGeneration":
          lib = require("./"+step+".js");
          break;
        case "codeAnalysisReport":
          lib = require("./"+step+".js");
          break;
        case "domainCheckGoals":
          lib = require("./"+step+".js");
          break;
        // import and export steps
        case "executionRecordImport":
          lib = require("./"+step+".js");
          break;
        case "executionRecordExport":
          lib = require("./"+step+".js");
          break;
        case "inputRestrictionsImport":
          lib = require("./"+step+".js");
          break;
        case "inputRestrictionsExport":
          lib = require("./"+step+".js");
          break;
        case "toleranceImport":
          lib = require("./"+step+".js");
          break;
        case "toleranceExport":
          lib = require("./"+step+".js");
          break;
        case "vectorImport":
          lib = require("./"+step+".js");
          break;
        case "vectorExport":
          lib = require("./"+step+".js");
          break;
        default:
          console.log("Test step '" + step + "' is not a supported step. Please refer to the docs and verify the spelling.");
          return;
      }
      lib.main(args); // entrypoint to step function
    } catch (e) {
      skipRemainingStepsDueToFailure = True;
      console.log("Error! Skipping remaining steps.")
    }
  })

  // wrapup step
  const wrapupStep = require("./wrapup.js");
  wrapupStep.main();

} catch(e) {
  console.log(e)
}