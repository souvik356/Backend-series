const express = require('express')
const { userAuth } = require('../middleware/Auth')
const { ConnectionRequest } = require('../models/ConnectRequest')
const { User } = require('../models/User')
const userRouter = express.Router()

userRouter.get('/user/requests', userAuth, async (req, res) => {
    const loggedInUser = req.info
    try {
        const connectionRequest = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: 'interested'
        })
            .populate("fromUserId", ["firstName", "lastName", "photoURL"])
        res.json({
            message: "All your request are below",
            data: connectionRequest
        })

    } catch (err) {
        res.status(400).json({ message: `Something went wrong ${err.message}` })
    }
})

userRouter.get('/user/connections', userAuth, async (req, res) => {
    const loggedInUser = req.info
    console.log(loggedInUser);

    try {
        const connectionRequest = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id, status: 'accepted' },
                { toUserId: loggedInUser._id, status: 'accepted' }
            ]
        })
            .populate("fromUserId", ["firstName", "lastName"])
            .populate("toUserId", ["firstName", "lastName"])
        console.log(connectionRequest);

        const data = connectionRequest.map((row) => {
            if (row.fromUserId._id.equals(loggedInUser._id)) {
                return row.toUserId
            }
            return row.fromUserId
        })

        res.json({ data })

    } catch (err) {
        res.status(400).send(`ERROR : ${err.message}`)
    }

})

userRouter.get('/user/feed', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.info

        // user should see all cards EXCEPT :-
        // - his own card
        // - his connections
        // - ignored people
        // - already sent the connection request

        // (souvik) -> ["kish","rahul","akshay","donald","elon","sreeza"]

        // souvik -> kish => ["rahul","akshay","donald","elon","sreeza"]
        // (rahul) -> Souvik =>["akshay","donald","elon","sreeza"]

        const connectionRequest = await ConnectionRequest.find({
            $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }]
        }).select("fromUserId toUserId")

        const hiddenUsersFromFeed = new Set()

        connectionRequest.forEach((data)=>{
            hiddenUsersFromFeed.add(data.fromUserId.toString())
            hiddenUsersFromFeed.add(data.toUserId.toString())
        })
        // console.log(hiddenUsersFromFeed);

        const users = await User.find({
            $and:[
                { _id: {$nin: Array.from(hiddenUsersFromFeed)}},
                { _id: {$ne: loggedInUser._id}}
            ]
        })
        res.json({
            message:'All the users are here',
            users
        })
    } catch (err) {
        res.status(400).send(`ERROR : ${err.message}`)
    }
})

module.exports = { userRouter }