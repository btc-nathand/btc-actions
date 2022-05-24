const { default: axios } = require("axios");

async function main(args) {
    /*axios
        .delete(EP + "/ep/application", {})
        .then(res => {
            console.log("Shut down EP")
        })
        .catch(error => {
            console.log("Failed to shut down EP on " + EP)
        });*/

    console.log("TODO: create delete stub");
    await axios.delete(EP + "/ep/profiles")

    return 0;
}

module.exports = {main};