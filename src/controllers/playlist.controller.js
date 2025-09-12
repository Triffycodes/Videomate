import { isValidObjectId } from "mongoose"
import { Playlist } from "../models/playlist.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body

    //TODO: create playlist

    if (!name?.trim() || !description?.trim()) {
        throw new ApiError(400, "All fields are required")
    }

    const userId = req.user?._id

    if (!userId) {
        throw new ApiError(401, "Unauthorized")
    }

    const createdplay = await Playlist.create({
        name:name,
        description: description,
        owner: userId
    })

    if (!createdplay) {
        throw new ApiError(500, "Failed to create")
    }

    
    return res.status(200).json(new ApiResponse(
        200,
        createdplay,
        "Playlist Created"
    ))

})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    //TODO: get user playlists
    if (!userId) {
        throw new ApiError(400, "userId is required");
        
    }

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid userId format");
    }

    if (userId.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "Access denied");

    }

    const playlists =  await Playlist.find({
        owner:userId
    }).populate("videos")
    
    if(!playlists.length){
        throw new ApiError(404,"Playlists not found")
    }

    return res.status(200).json(new ApiResponse(
        200,
        playlists,
        "Playlists fetched successfully"
    ))


})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id
    if (!playlistId) {
        throw new ApiError(400,"PlaylistId is required")
    }

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlistId format");
    }

    const playlist = await Playlist.findById(playlistId).populate("videos")

    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    return res.status(200).json(new ApiResponse(
        200,
        playlist,
        "Playlist fetched successfully"
    ))

})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    if (!playlistId || !videoId) {
        throw new ApiError(400,"PlaylistId and VideoId is missing")
    }

    if (!isValidObjectId(playlistId) ||!isValidObjectId(videoId) ) {
        throw new ApiError(400, "Invalid Id format");
    }

    const playlist = await Playlist.findById(playlistId)
    if (!playlist) {
        throw new ApiError(404,"Playlist not found")
    }
    
    if (playlist.owner.toString() !== req.user?._id.toString()) {
      throw new ApiError(403, "You are not authorized to add video");
    }
    
    const added =  await Playlist.findByIdAndUpdate(playlistId,{
        $addToSet:{ videos: videoId }
    },{new:true})

    if (!added) {
        throw new ApiError(500,"Failed to add")
    }
    
    return res.status(200).json(new ApiResponse(
        200,
        added,
        "Video added successfully"
    ))



})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist
    if (!playlistId || !videoId) {
        throw new ApiError(400,"PlaylistId and VideoId is missing")
    }

    if (!isValidObjectId(playlistId) ||!isValidObjectId(videoId) ) {
        throw new ApiError(400, "Invalid Id format");
    }

    const playlist = await Playlist.findById(playlistId)
    if (!playlist) {
        throw new ApiError(404,"Playlist not found")
    }
    
    if (playlist.owner.toString() !== req.user?._id.toString()) {
      throw new ApiError(403, "You are not authorized to remove video");
    }

    const removed =  await Playlist.findByIdAndUpdate(playlistId,{
        $pull:{ videos: videoId }
    },{new:true})

    if (!removed) {
        throw new ApiError(500,"Failed to remove")
    }
    
    return res.status(200).json(new ApiResponse(
        200,
        removed,
        "Video removed successfully"
    ))



})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist
    if (!playlistId) {
        throw new ApiError(400, "playlistId is missing")
    }
    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlistId format");
    }

    const playlist = await Playlist.findById(playlistId)
    if (!playlist) {
        throw new ApiError(404,"Playlist is not found");
        
    }

    if (playlist.owner.toString() !== req.user?._id.toString()) {
      throw new ApiError(403, "You are not authorized to delete playlist");
    }

    await Playlist.findByIdAndDelete(playlistId)

    return res.status(200).json(new ApiResponse(
        200,
        {},
        "Playlist deleted successfully"
    ))

})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist
    if(!playlistId || !name?.trim() || !description?.trim()){
        throw new ApiError(400,"All fields are required")
    }

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlistId format")
    }

    const playlist = await Playlist.findById(playlistId)
    if (!playlist) {
        throw new ApiError(404,"Playlist is not found");
        
    }
    
    if (playlist.owner.toString() !== req.user?._id.toString()) {
      throw new ApiError(403, "You are not authorized to update playlist");
    }


    const updatedplaylist = await Playlist.findByIdAndUpdate(playlistId,{
        $set:{name,description}
    },{new:true})

    if (!updatedplaylist) {
        throw new ApiError(500, "Failed to update playlist")
    }

    return res.status(200).json(new ApiResponse(
        200,
        updatedplaylist,
        "Playlist updated successfully"
    ))

})

export {
    addVideoToPlaylist, createPlaylist, deletePlaylist, getPlaylistById, getUserPlaylists, removeVideoFromPlaylist, updatePlaylist
}
