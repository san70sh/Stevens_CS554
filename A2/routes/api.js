const redis = require('redis')
const express = require('express');
const router = express.Router();
const apiData = require('../data/api');

const client = redis.createClient();
router.get('/people/history', async (req, res) => {
    try {
        await client.connect();
        let recView = await client.lRange('recently_viewed', 0, 19)
        let retList = [];
        recView.forEach(e => {
            e = JSON.parse(e);
            retList.push(e);
        })
        await client.quit();
        return res.status(200).json(retList);
    } catch (e) {
        await client.quit();
        console.log(e);
    }

})

router.get('/people/:id', async (req, res) => {
    try {
        await client.connect();
        let id = req.params.id;
        let result;
        if(id == undefined || id == '') return res.status(400).send("Invalid ID input");
        if(isNaN(parseInt(id))) return res.status(400).send('ID is of the wrong data type');
    
        result = await client.get(id)
        console.log(result);
        if(!result) {
            result = await apiData.getById(id);
            await client.set(result.id, JSON.stringify(result));
            result = JSON.stringify(result);
        }
        await client.lPush('recently_viewed', result);
        await client.quit();
        return res.status(200).json(JSON.parse(result));
    } catch (err) {
        console.log(err);
        await client.quit();
        return res.status(err.status).send(err.message);
    }
})

module.exports = router;