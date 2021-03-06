import jwt from 'jsonwebtoken';
import db from '../db';

const Auth = {
  async verifyToken(req, res, next) {
    const token = req.headers['x-access-token'];
    if (!token) {
      return res.status(401).send({ 'message': 'Token is not provided' });
    }
    try {
      const decoded = await jwt.verify(token, process.env.SECRET);
      const text = 'SELECT * FROM users WHERE id = $1';
      const { rows } = await db.query(text, [decoded.userId]);
      if (!rows[0]) {
        return res.status(401).send({ 'message': 'The token you provided is invalid' });
      }
      req.user = { id: decoded.userId };
      next();
    } catch (error) {
      return res.status(500).send({
        success: false,
        message: 'something went wong please try again'
      });
    }
  },
  async checkUser(req, res, next) {
    try {
      const check = 'SELECT * FROM users WHERE id = $1';
      const { rows } = await db.query(check, [req.user.id]);

      if (rows[0].usertype !== 'admin') {
        return res.status(403).send({ message: 'Forbidden', status: 403 });
      }
      next();
    } catch (error) {
      return res.status(400).send(error);
    }
  }
}

export default Auth;