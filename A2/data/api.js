const axios = require('axios');

function timeDelay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

function CustomError (status, message) {
    this.status = status;
    this.message = message;
}

async function getById(id) {
    //ID Validation
    if(id == undefined || id == '') throw new CustomError(400, "Invalid ID input");
    if(isNaN(parseInt(id))) throw new CustomError(400, 'ID is of the wrong data type');
    await timeDelay(5000);
    const {data} = await axios.get('https://gist.githubusercontent.com/graffixnyc/ed50954f42c3e620f7c294cf9fe772e8/raw/925e36aa8e3d60fef4b3a9d8a16bae503fe7dd82/lab2');
    let retObj = data.find(e => e.id == id);
    if(retObj) return retObj;
    else throw new CustomError(400, "This ID does not exist.");
}

module.exports = {
    getById
}