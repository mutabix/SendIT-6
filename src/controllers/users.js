import db from '../db';
import Helper from '../middleware/helper';

const UserControllers = {
  async signUp(req, res) {
    const { error } = Helper.validateUser(req.body);
    if (error) {
      res.status(400).send({ message: error.details[0].message });

      return;
    }
    const hashPassword = Helper.hashPassword(req.body.password);
    const data = `INSERT INTO
      users(email, username, fullname, usertype, password)
      VALUES($1, $2, $3, $4, $5)
      returning *`;
    const values = [
      req.body.email,
      req.body.username,
      req.body.fullName,
      "user",
      hashPassword
    ];

    try {
      const { rows } = await db.query(data, values);
      const token = Helper.generateToken(rows[0].id);
      return res.status(201).send({ token, message: 'user created' });
    } catch (error) {
      if (error.routine === '_bt_check_unique') {
        return res.status(400).send({ message: 'User with that EMAIL already exist' })
      }
      return res.status(400).send({ message: error });
    }
  },
  async signIn(req, res) {
    const { error } = Helper.validateLogin(req.body);
    if (error) {
      res.status(400).send({ message: error.details[0].message });

      return;
    }
    const text = 'SELECT * FROM users WHERE email = $1';
    try {
      const { rows } = await db.query(text, [req.body.email]);
      if (!rows[0]) {
        return res.status(400).send({ message: 'The credentials you provided is incorrect' });
      }
      if (!Helper.comparePassword(rows[0].password, req.body.password)) {
        return res.status(400).send({ message: 'The credentials you provided is incorrect' });
      }
      const token = Helper.generateToken(rows[0].id);
      return res.status(200).send({ token, message: 'successfully logged in', users: rows[0] });
    } catch (error) {
      return res.status(400).send({ message: error })
    }
  },
  async deleteUser(req, res) {
    const deleteUser = 'DELETE FROM users WHERE id=$1 returning *';
    try {
      const { rows } = await db.query(deleteUser, [req.user.id]);
      if (!rows[0]) {
        return res.status(404).send({ message: 'user not found', status: 404 });
      }
      return res.status(204).send({ message: 'deleted', status: 204 });
    } catch (error) {
      return res.status(400).send({ message: error, status: 400 });
    }
  },
};


export default UserControllers;