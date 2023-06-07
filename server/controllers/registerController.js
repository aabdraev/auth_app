const User = require('../model/User');
const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) return res.status(400).json({ 'message': 'Username and password are required.' });

    const duplicate = await User.findOne({ email: email }).exec();
    if (duplicate) return res.sendStatus(409);

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await User.create({
            "user": username,
            "email": email,
            "password": hashedPassword,
            "lastLogin": Date.now()
        });

        res.status(201).json({ 'success': `New username ${username} created!` });
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
}

module.exports = { handleNewUser };