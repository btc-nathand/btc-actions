const { default: axios } = require('axios');
const path = require('path')
const { poll } = require("./helper");

async function main(args) {
    const ERs = await axios.get(EP + "/ep/execution-records")
        .then(resp => {
            return resp['data']
        })

    for (let i = 0; i < ERs.length; i++) {
        await axios.delete(EP + "/ep/execution-records/"+ ERs[i]['uid'])
    }

}

module.exports = {main};