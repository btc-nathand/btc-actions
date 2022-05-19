const core = require('@actions/core');
const github = require('@actions/github');

try {
  // `who-to-greet` input defined in action metadata file
  const profilePath = core.getInput('profilePath');
  console.log(`Hello ${profilePath}!`);
  
} catch (error) {
  core.setFailed(error.message);
}