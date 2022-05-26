const { default: axios } = require("axios");
const { poll } = require("./helper");

async function main(args) {
    let eng_conf = await axios.get(EP + "/ep/coverage-generation")
        .then(resp => {return resp['data']})
    if (args['pll']) {
        eng_conf['pllString'] = args['pll']
    }
    if (args['engine'] == "ATG") {
        eng_conf['engineCv']['use'] = false
    }
    if (args['engine'] == "CV") {
        eng_conf['engineAtg']['use'] = false
    }
    if (args['globalTimeout']) {
        eng_conf['engineSettings']['timeoutSeconds'] = args['globalTimeout']
    }
    if (args['scopeTimeout']) {
        eng_conf['engineAtg']['timeoutSecondsPerSubsystem'] = args['scopeTimeout']
        eng_conf['engineCv']['timeoutSecondsPerSubsystem'] = args['scopeTimeout']
    }
    if (args['perPropertyTimeout']) {
        eng_conf['engineCv']['timeoutSecondsPerProperty'] = args['perPropertyTimeout']
    }
    if (args['considerSubscopes']) {
        eng_conf['isSubscopesGoalsConsidered'] = args['considerSubscopes']
    }
    if (args['analyzeSubscopesHierachichally']) {
        eng_conf['engineSettings']['analyseSubScopesHierarchically'] = args['analyzeSubscopesHierachichally']
    }
    if (args['allowDenormalizedFloats']) {
        eng_conf['engineCv']['allowDenormalizedFloats'] = args['allowDenormalizedFloats']
    }
    if (args['recheckUnreachable']) {
        eng_conf['checkUnreachableProperties'] = args['recheckUnreachable']
    }
    if (args['depthCv']) {
        eng_conf['engineCv']['searchDepthSteps'] = args['depthCv']
    }
    if (args['depthAtg']) {
        eng_conf['depthAtg']['searchDepthSteps'] = args['depthAtg']
    }
    if (args['loopUnroll']) {
        eng_conf['engineCv']['loopUnroll'] = args['loopUnroll']
    }

    if (args['robustnessTestFailure']) {
        console.log("WARNING: setting 'robustnessTestFailure' is unsupported in GithubActions.")
    }
    if (args['createReport']) {
        console.log("TODO: implement createReport")
    }

    await axios.post(EP + "/ep/coverage-generation", eng_conf)
        .then(async resp => {
            let data = await poll(resp['data']['jobID'])
            console.log("successfully ran vector generation!")
        })
        .catch(e => {
            console.log("failed to generate vectors!")
            throw e;
        })
    
    

}

module.exports = {main};