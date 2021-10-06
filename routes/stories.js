const express = require('express')
const router = express.Router()
const { ensureAuth } = require('../middleware/auth')

const Story = require('../models/Stories')

router.get('/', ensureAuth, (req, res) => {
    res.render('stories/add',{
        layout:'add'
    })
})

module.exports=router