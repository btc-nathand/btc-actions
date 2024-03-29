const core = require('@actions/core');
const github = require('@actions/github');
const yml = require('js-yaml');
const fs = require('fs');
const path = require('path');
axios = require('axios'); //global! all subcalls make use of this
helper = require('./helper.js');

async function mainLoop() {
  let pipePath;
  try {
    // here, we want to use the environment workspace as the root directory. but inside the steps, 
    // everything is visible to the BTC image relative to "/mnt"
    pipePath = path.join(process.env.GITHUB_WORKSPACE, core.getInput('BTCPipePath'))
    console.log(pipePath)
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
        break;
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
          // profile clean-up steps
          case "deleteAllExecutionRecords":
          // import and export steps
          case "executionRecordImport":
          case "executionRecordExport":
          case "inputRestrictionsImport":
          case "inputRestrictionsExport":
          case "toleranceImport":
          case "toleranceExport":
          case "vectorImport":
          case "vectorExport":
          case "testcaseImport":
          case "requirementsExcelImport":
          case "formalSpecifierSpecImport":
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
        console.log(e);
        skipRemainingStepsDueToFailure = true; 
        /*try {
          error_msg = "Error!\n"
          if (core.getInput("ContinueOnFail") === true) error_msg += "Skipping remaining steps.\n";
          error_msg += e['response']['config']['method'] + " " + e['response']['config']['url'] + "\n";
          if (e['response']['config']['data']) {
            error_msg += "with request body " + e['response']['config']['data'] + "\n"
          }
          error_msg += ("!!! " + e['response']['data'] + " !!!");
          console.log(error_msg)
        } catch (e) {
          // do nothing; we always want to wrapup
        }*/

        if (core.getInput("ContinueOnFail") === true)
          core.warning("In pipeline " + process.env.GITHUB_ACTION + ":\n" + error_msg);
        else core.error("In pipeline " + process.env.GITHUB_ACTION + ":\n" + error_msg);
      }
    }

    // wrapup step
    if((!pipeline.hasOwnProperty('wrapup')) || skipRemainingStepsDueToFailure === true) {
      console.log(`#### Starting Step wrapup ####`);
      const wrapupStep = require("./wrapup.js");
      await wrapupStep.main(pipeline['wrapup'] ? pipeline['wrapup'] : {});
      console.log(`#### Ending Step wrapup ####`);
    }

  } catch(e) {
    console.log(e)
  }
}

mainLoop()