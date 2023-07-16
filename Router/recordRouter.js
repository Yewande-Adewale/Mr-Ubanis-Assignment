const express = require("express")
const  {createRecord, getRecords, getRecord, updateRecord, deleteRecord}  = require("../Controller/userRecords")
const router = express.Router()
const {userAuth} = require('../Middleware/auth')

router.post('/records', userAuth, createRecord);
router.get('/records', userAuth, getRecords);
router.get('/records/:id', userAuth, getRecord);
router.put('/records/:id', userAuth, updateRecord);
router.delete('/records/:id', userAuth, deleteRecord);


module.exports = router

