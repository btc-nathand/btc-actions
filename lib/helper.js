async function poll(ID) {
    while(true)
      await axios.get(EP + "/ep/progress/" + ID)
        .then(resp => {
          if (resp.status != 202)
            return resp.data;
        })
        .catch(error => {
            throw new Error(error.message)
        })
  }

  module.exports = {poll};