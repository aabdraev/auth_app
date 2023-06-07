const express = require('express')
const router = express.Router()
const usersController = require('../../controllers/usersController')

router.route('/')
    .get(usersController.getAllUsers)

router.route('/:id')
    .get(usersController.getUser)

router.route('/:id/delete')
    .delete(usersController.deleteUser)

router.route('/:id/block')
    .post(usersController.blockUser)

router.route('/:id/unblock')
    .post(usersController.unblockUser)

module.exports = router;