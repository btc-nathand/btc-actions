const core = require('@actions/core');
const github = require('@actions/github');
const yml = require('js-yaml');
const fs = require('fs');
axios = require('axios'); //global! all subcalls make use of this
helper = require('./helper.js');

async function mainLoop() {
  let pipePath;
  try {
    console.log("$$$ ")
    var fs = require('fs');
    var files = fs.readdirSync(args['dir']);
    console.log(files)
    console.log(process.cwd())
    console.log(__dirname)
    pipePath = core.getInput('BTCPipePath'); //"../pipeline.yml";//
  } catch (e) {
    core.setFailed(e.message);
  }

  try {
    // read and process yml
    let fileContents = fs.readFileSync(pipePath, 'utf8');
    let pipeline = yml.load(fileContents);

    if(!(pipeline.hasOwnProperty('startup'))) {
      console.log(`#### Starting Step startup ####`);
      const startupStep = require("./startup.js");
      v = await startupStep.main({});
      console.log(`#### Ending Step startup ####`);
    }

    

    let skipRemainingStepsDueToFailure = false;
    let statuses_for_steps = {}
    for (const step in pipeline) {
      args = pipeline[step] ? pipeline[step] : {};
      if (skipRemainingStepsDueToFailure === true) {
        return;
      }
      try { //run step
        let lib;
        switch (step) {
          // endpoint steps
          case "startup":
          case "wrapup":
          // init steps
          case "profileLoad":
          case "profileCreateTL":
          case "profileCreateEC":
          case "profileCreateSL":
          case "profileCreateC":
          case "simulinkToplevel":
          // analysis steps
          case "rbtExecution":
          case "backToBackTest":
          case "vectorGeneration":
          case "codeAnalysisReport":
          case "domainCheckGoals":
          case "regressionTest":
          case "formalTest":
          // import and export steps
          case "executionRecordImport":
          case "executionRecordExport":
          case "inputRestrictionsImport":
          case "inputRestrictionsExport":
          case "toleranceImport":
          case "toleranceExport":
          case "vectorImport":
          case "vectorExport":
            lib = require("./" + step + ".js");
            break;
          default:
            console.log("Test step '" + step + "' is not a supported step. Please refer to the docs and verify the spelling.");
            return;
        }
        console.log(`#### Starting Pipeline Step ${step} ####`);
        let status = await lib.main(args); // entrypoint to step function
        statuses_for_steps[step] = status;
        console.log(`#### Ending Pipeline Step ${step} ####`);
      } catch (e) {
        //skipRemainingStepsDueToFailure = true; TODO: uncomment in finished prod
        //console.log("Error! Skipping remaining steps;");
        console.log(e);
      }
    }

    // wrapup step
    if(!(pipeline.hasOwnProperty('wrapup')) || skipRemainingStepsDueToFailure === true) {
      console.log(`#### Starting Step wrapup ####`);
      const wrapupStep = require("./wrapup.js");
      await wrapupStep.main(pipeline.hasOwnProperty('wrapup') ? pipeline['wrapup'] : {});
      console.log(`#### Ending Step wrapup ####`);
    }

  } catch(e) {
    console.log(e)
  }
}

mainLoop()