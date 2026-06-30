import User from '../models/User.js';
import jwt from 'jsonwebtoken';
const generateToken = (user_id) => {
  return jwt.sign({ user_id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (user && (user.password === password || (user.password.startsWith('$') && await user.matchPassword(password)))) {
      res.json({
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        user_type: user.user_type,
        token: generateToken(user.user_id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.user_id, {
      attributes: { exclude: ['password'] }
    });

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { loginUser, getUserProfile };