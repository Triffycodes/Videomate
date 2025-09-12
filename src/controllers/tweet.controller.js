import { isValidObjectId } from "mongoose"
import { Tweet } from "../models/tweet.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const {content} = req.body
    if (!content?.trim()) {
        throw new ApiError(400, "Content is required")
    }

    if (content.length > 280) {
        throw new ApiError(400, "Tweet must be under 280 characters");
    }

    const ownerId = req.user?._id
    if (!ownerId) {
        throw new ApiError(401, "Please login !")
    }

    const tweet =  await Tweet.create({
        owner:ownerId,
        content:content,
    })

    if (!tweet) {
        throw new ApiError(400,"Something went wrong while creating tweet")
    }

    return res.status(201).json(new ApiResponse(
        201,
        tweet,
        "Tweet created successfully"
    ))


})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    const { userId } = req.params;
    if (!userId) {
        throw new ApiError(400,"userId is required")
    }

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid userId format");
    }

    if (userId.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "Access denied");

    }
    
    const tweets = await Tweet.find({
        owner:userId
    }).sort({ createdAt: -1 })

    if (!tweets.length) {
        throw new ApiError(404,"No tweets found")
    }

    return res.status(200).json(new ApiResponse(
        200,
        tweets,
        "Tweets are fetched successfully"
    ))




})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const {tweetId} = req.params

    if (!tweetId) {
        throw new ApiError(400,"tweetId is required")
    }

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweetID format");
    }
    
    const tweet = await Tweet.findById(tweetId)
     
    if (!tweet) {
       throw new ApiError(404,"Tweet does not exist")
   }

   if(tweet.owner.toString()!==req.user._id.toString()){
      throw new ApiError(403,"You are not authorized to update this tweet")
   }

   const {content} = req.body

   if (!content?.trim()) {
     throw new ApiError(400,"Content is required")
   }
   
   const updatedTweet = await Tweet.findByIdAndUpdate(tweetId,{
    $set:{content}
   },{new:true})

  if (!updatedTweet) {
    throw new ApiError(500, "Something went wrong while updating the tweet");
  }

  return res.status(200).json(new ApiResponse(
    200,
    updatedTweet,
    "Tweet updated successfully"
  ))


})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet

    const {tweetId} = req.params

    if (!tweetId) {
        throw new ApiError(400,"tweetId is required")
    }

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweetID format");
    }

    const tweet = await Tweet.findById(tweetId)
     
    if (!tweet) {
       throw new ApiError(404,"Tweet does not exist")
   }

   if(tweet.owner.toString()!==req.user._id.toString()){
      throw new ApiError(403,"You are not authorized to delete this tweet")
   }

   await Tweet.findByIdAndDelete(tweetId)

   return res.status(200).json(new ApiResponse(
    200,
    {},
    "Tweet is deleted successfully"
   ))


})

export {
    createTweet, deleteTweet, getUserTweets,
    updateTweet
}
