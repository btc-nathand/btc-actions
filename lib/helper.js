function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function poll(ID) {
    while(true) {
        let data = await axios.get(EP + "/ep/progress/" + ID)
            .then(async resp => {
                if (resp.status != 202)
                    return resp.data;
                return null
            })
            .catch(error => {
                console.log(error)
                throw new Error(error.message)
            })
            if (data) {
                return data;
            }
            await sleep(200);
        }
  }

  module.exports = {poll};