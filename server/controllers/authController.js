const User = require('../model/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const handleLogin = async (req, res) => {
    const cookies = req.cookies

    const { username, password } = req.body
    if (!username || !password) return res.status(400).json({ 'message': 'Username and password are required.' })

    const foundUser = await User.findOne({ user: username }).exec()
    if (foundUser.status === 'blocked') return res.status(403).json({ 'message': 'User is blocked' })
    if (!foundUser) return res.sendStatus(401)

    const match = await bcrypt.compare(password, foundUser.password)
    if (match) {
        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "username": foundUser.username,
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '1h' }
        );
        const newRefreshToken = jwt.sign(
            { "username": foundUser.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '2h' }
        );

        let newRefreshTokenArray =
            !cookies?.jwt
                ? foundUser.refreshToken
                : foundUser.refreshToken.filter(rt => rt !== cookies.jwt)

        if (cookies?.jwt) {

            const refreshToken = cookies.jwt;
            const foundToken = await User.findOne({ refreshToken }).exec()

            if (!foundToken) {
                newRefreshTokenArray = []
            }

            res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
        }

        foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken]
        foundUser.lastLogin = Date.now()
        const result = await foundUser.save()

        res.cookie('jwt', newRefreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 })

        res.json({ accessToken })
    } else {
        res.sendStatus(401)
    }
}

module.exports = { handleLogin };