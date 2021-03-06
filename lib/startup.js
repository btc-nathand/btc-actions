EP = undefined;

async function main(args) {
    let port = args['port'] ? args['port'] : 29267;
    let matlabPort = args['matlabPort'] ? args['matlabPort'] : (29300 + (port%100));
    let timeout = args['timeout'] ? args['timeout'] : 120;
    let licensingPackage = args['licensingPackage'] ? args['licensingPackage'] : "ET_COMPLETE";
    // optional args
    let installPath = args['installPath'];
    let additionalJvmArgs = args['additionalJvmArgs'];

    // the endpoint argument can be exposed by a docker container, which we then just point to
    EP = args['endpoint'] ? args['endpoint'] : `http://localhost:${port}`
    await axios
        .get(EP + '/ep/test')
        .then(res => {
            console.log("Connected to EP")
        })
        .catch(error => {
            console.log("Started up EP")
            console.log("TODO: stub. nothing has been started.")
        });

    return 0;
}

module.exports = {main};