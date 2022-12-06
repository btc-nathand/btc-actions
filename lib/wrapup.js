const { default: axios } = require("axios");
const path = require('path');

async function main(args) {
    /*axios
        .delete(EP + "/ep/application", {})
        .then(res => {
            console.log("Shut down EP")
        })
        .catch(error => {
            console.log("Failed to shut down EP on " + EP)
        });*/
    let profPath = path.join("/mnt", "sampleEP.epp")
    
    await axios.put(EP + "/ep/profiles", {'path': profPath})
    .then( async resp => {
        console.log("profile saved at " + profPath);
    }) .catch(error => {console.log("failed to save profile")});

    console.log("TODO: create delete stub");
    await axios.delete(EP + "/ep/profiles")

    return 0;
}

module.exports = {main};