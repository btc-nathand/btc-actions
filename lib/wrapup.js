const { default: axios } = require("axios");
const path = require('path');

async function main(args) {
    if (args['save'] === false) return 0; // save by default


    if (!args['path']) {
        args['path'] = "profile.epp"
    }
    let profPath = path.join("/mnt", args['path'])
    
    await axios.put(EP + "/ep/profiles", {'path': profPath})
    .then( async resp => {
        console.log("profile saved at " + profPath);
    }) .catch(error => {console.log("failed to save profile")});

    return 0;
}

module.exports = {main};