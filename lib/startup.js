const core = require('@actions/core');
const github = require('@actions/github');

try {
  // `who-to-greet` input defined in action metadata file
  const port = core.getInput('port');
  console.log(`Hello ${port}!`);
  
} catch (error) {
  core.setFailed(error.message);
}