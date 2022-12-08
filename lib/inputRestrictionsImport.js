function main(args) {
    if (!args['path']) throw new Error("Mandatory argument 'path' not provided for step 'inputRestrictionsImport'")
    resolve = require('path').resolve
    args['path'] = resolve(args['path']);

    reqBody = {}
    reqBody['filePath'] = args['path']

    await axios.post(EP + "/ep/input-restrictions-import")
        .then(resp => {
            console.log("succesfully imported input restrictions")
        })
        .catch(error => {
            console.log("failed to import input restrictions")
            throw error;
        })
}

module.exports = {main};