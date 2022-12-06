const { default: axios } = require('axios');
const path = require('path')
const { poll } = require("./helper");

async function main(args) {
    const ERs = await axios.get(EP + "/ep/execution-records")
        .then(resp => {
            resp['data']
        })
    ERs.map(async er => {
        await axios.delete(EP + "/ep/execution-records/"+ er['uid'])
    })

}

module.exports = {main};