const User = require('../model/User')

const getAllUsers = async (req, res) => {
    const users = await User.find()
    if (!users) return res.status(204).json({ 'message': 'No users found' });
    res.json(users)
}

const getUser = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ "message": 'User ID required' })
    const user = await User.findOne({ _id: req.params.id }).exec()
    if (!user) {
        return res.status(204).json({ 'message': `User ID ${req.params.id} not found` })
    }
    res.json(user)
}
const deleteUser = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ "message": 'User ID required' })
    const user = await User.findOne({ _id: req.params.id }).exec()
    if (!user) {
        return res.status(204).json({ 'message': `User ID ${req.params.id} not found` });
    }
    const result = await user.deleteOne({ _id: req.params.id })
    res.json(result);
}

const blockUser = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ "message": 'User ID required' })
    const user = await User.findOne({ _id: req.params.id }).exec()
    if (!user) {
        return res.status(204).json({ 'message': `User ID ${req.body.id} not found` })
    }
    user.status = 'blocked'
    await user.save()
    res.status(200).json({ 'message': `User ID ${req.params.id} succesfully blocked` });
}

const unblockUser = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ "message": 'User ID required' })
    const user = await User.findOne({ _id: req.params.id }).exec()
    if (!user) {
        return res.status(204).json({ 'message': `User ID ${req.params.id} not found` })
    }
    user.status = 'active'
    await user.save()
    res.status(200).json({ 'message': `User ID ${req.params.id} succesfully unblocked` });
}

module.exports = {
    getAllUsers,
    getUser,
    deleteUser,
    blockUser,
    unblockUser,
}