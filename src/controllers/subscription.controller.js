import mongoose, { isValidObjectId } from "mongoose"
import { Subscription } from "../models/subscription.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    // TODO: toggle subscription
    
    if(!channelId?.trim()){
        throw new ApiError(400,"ChannelId is required")
    }
    
    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channelId format");
    }

    const userId = req.user?._id
    if (!userId) {
        throw new ApiError(400, "userId is required")
    }

    if(channelId.toString() === userId.toString()){
        throw new ApiError(400,"You cannot subscribe to your own channel")
    }

    const existingSubscription = await Subscription.findOne({
        subscriber:userId,
        channel:channelId,
    })

    if(existingSubscription){
       await Subscription.findByIdAndDelete(existingSubscription._id)
       return res.status(200).json(new ApiResponse(
        200,
        {},
        "Unsubscribed successfully"
       ))
    }

    await Subscription.create({
         subscriber:userId,
         channel:channelId,
    })

    return res.status(201).json(new ApiResponse(
        201,
        {},
        "Subscribed successfully"
    ))





})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    if(!channelId?.trim()){
        throw new ApiError(400,"ChannelId is required")
    }
    
    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channelId format");
    }

    const userId = req.user?._id
    if (!userId) {
        throw new ApiError(400, "userId is required")
    }

    if (userId.toString() !== channelId.toString()) {
        throw new ApiError(403, "Access denied: Not your channel");

    }   
    
    
    const subscribers= await Subscription.aggregate([{
        $match: {
                channel: new mongoose.Types.ObjectId(channelId),
            },
     },
     {
         $lookup:{
            from : "users",
            localField:"subscriber",
            foreignField:"_id",
            as:"subscriberDetails"
         }
     },
     {
            $unwind: "$subscriberDetails",
     },

      {
            $project: {
                _id: 0,
                subscriberId: "$subscriberDetails._id",
                username: "$subscriberDetails.username",
                email: "$subscriberDetails.email",
                avatar: "$subscriberDetails.avatar",
            },
        },
    ])

    if (!subscribers?.length) {
           throw new ApiError(404, "No subscribers found");
            }   

    return res.status(200).json(new ApiResponse(
        200,
        subscribers,
        "Channel subscribers fetched successfully"
    ))



})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params
     if(!subscriberId?.trim()){
        throw new ApiError(400,"ChannelId is required")
    }
    
    if (!isValidObjectId(subscriberId)) {
        throw new ApiError(400, "Invalid channelId format");
    }

    const userId = req.user?._id
    if (!userId) {
        throw new ApiError(400, "userId is required")
    }

    if (userId.toString() !== subscriberId.toString()) {
        throw new ApiError(403, "Access denied: Not your channel");

    }

    const subscribed = await Subscription.aggregate([{
        $match: {
                subscriber: new mongoose.Types.ObjectId(subscriberId),
            },
    },
    {
        $lookup:{
            from : "users",
            localField:"channel",
            foreignField:"_id",
            as:"subscribedDetails"
         }
    },
    {
        $unwind: "$subscribedDetails",
    },
    {
        $project: {
                _id: 0,
                subscribedId: "$subscribedDetails._id",
                username: "$subscribedDetails.username",
                email: "$subscribedDetails.email",
                avatar: "$subscribedDetails.avatar",
            }, 
    }

])
   
   if (!subscribed?.length) {
        throw new ApiError(404,"Subscribed does not exist")
    }
    

   return res.status(200).json(new ApiResponse(
    200,
    subscribed,
    "Channel Subscribed details fetched successfully"
   ))

})

export {
    getSubscribedChannels, getUserChannelSubscribers, toggleSubscription
}
