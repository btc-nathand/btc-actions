const { default: axios } = require("axios");

function main(args) {
    /*axios
        .delete(EP + "/ep/application", {})
        .then(res => {
            console.log("Shut down EP")
        })
        .catch(error => {
            console.log("Failed to shut down EP on " + EP)
        });*/
    console.log("TODO: delete stub. Uncomment once startup functions.")
    // this delete below is also temporary
    axios
        .delete(EP + "/ep/profiles")
}

module.exports = {main};