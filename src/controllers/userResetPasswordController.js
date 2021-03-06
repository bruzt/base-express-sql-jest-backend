const express = require('express');
const crypto = require('crypto');

const UserModel = require('../models/UserModel');
const mailer = require('../services/mailer');

module.exports = {

    /** @param {express.Request} req * @param {express.Response} res */
    store: async (req, res) => {

        const { email } = req.body;

        try {

            const user = await UserModel.findOne({ where: { email }});

            if(!user) return res.status(400).json({ error: 'user not found' });

            const rawToken = crypto.randomBytes(20).toString('hex');

            const expires = new Date();
            expires.setHours(expires.getHours() + 1);

            user.reset_password_token = rawToken;
            user.reset_password_expires = expires;

            await user.save();

            await mailer.sendMail({
                from: 'donotreply@companydomain.com',
                to: email,
                subject: 'Reset Password',
                template: 'resetPassword',
                context: { token: user.id + '#' + rawToken }
            });

            return res.sendStatus(200);
            
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'internal error' });
        }
    },

    /** @param {express.Request} req * @param {express.Response} res */
    update: async (req, res) => {

        const { token, password } = req.body;

        const [id, rawToken] = token.split('#');

        if(isNaN(id)) return res.status(400).json({ error: 'invalid token' });
       
        try {

            const user = await UserModel.findByPk(id);

            if(!user) return res.status(400).json({ error: 'user not found' });
            if(rawToken !== user.reset_password_token) return res.status(400).json({ error: 'invalid token' });
            if(Date.now() > user.reset_password_expires) return res.status(400).json({ error: 'token expired' });

            user.password = password;
            user.reset_password_token = null;
            user.reset_password_expires = null;

            await user.save();

            return res.sendStatus(200);
            
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'internal error' });
        }
    }
}