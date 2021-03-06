const express = require('express');

const UserModel = require('../models/UserModel');
const TechModel = require('../models/TechModel');

module.exports = {

    /** @param {express.Request} req * @param {express.Response} res */
    async index(req, res){

        const user_id = req.tokenPayload.id;

        try {

            const user = await UserModel.findByPk(user_id, {
                include: { association: 'techs', through: { attributes: [] } }
            });

            if(! user) return res.status(400).json({ error: 'user not found' });
        
            return res.json(user.techs);

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "internal error" });
        }
    },

    /** @param {express.Request} req * @param {express.Response} res */
    async store(req, res){

        const id = req.params.id;
        const user_id = req.tokenPayload.id;

        try {

            const user = await UserModel.findByPk(user_id);

            if(!user) return res.status(400).json({ error: 'user not found'});

            const tech = await TechModel.findByPk(id);

            if(!tech) return res.status(400).json({ error: 'tech not found'});

            await user.addTech(tech);

            return res.sendStatus(200);
            
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "internal error" });
        }
    },

    /** @param {express.Request} req * @param {express.Response} res */
    async destroy(req, res){

        const id = req.params.id;
        const user_id = req.tokenPayload.id;

        try {

            const user = await UserModel.findByPk(user_id);

            if(!user) return res.status(400).json({ error: 'user not found'});

            const tech = await TechModel.findByPk(id);

            if(!tech) return res.status(400).json({ error: 'tech not found'});

            await user.removeTech(tech);

            return res.sendStatus(200);
            
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "internal error" });
        }
    }
}