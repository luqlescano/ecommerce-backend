import { Router } from 'express';
import userModel from '../dao/models/userModel.js';
import { createHash, isValidPassword } from '../utils/functions.js';
import passport from 'passport';

const usersRouter = Router();

usersRouter.post('/register', async (req, res) => {
    try {
        req.session.failRegister = false;

        if (!req.body.email || !req.body.password) throw new Error("Hubo un error, intentalo de nuevo...");

        const newUser = {
            first_name: req.body.first_name ?? "",
            last_name: req.body.last_name ?? "",
            email: req.body.email,
            age: req.body.age ?? "",
            password: createHash(req.body.password) 
        }
        
        await userModel.create(newUser);
        res.redirect('/login');
    } catch (e) {
        console.log(e.message);
        req.session.failRegister = true;
        res.redirect('/register');
    }
});

usersRouter.post('/login', async (req, res) => {
    try {
        req.session.failLogin = false;
        const result = await userModel.findOne({email: req.body.email});
        if (!result) {
            req.session.failLogin = true;
            return res.redirect('/login');
        }

        if (!isValidPassword(result, req.body.password)) {
            req.session.failLogin = true;
            return res.redirect('/login');
        }

        delete result.password;
        req.session.user = result;

        return res.redirect('/products');
    } catch (e) {
        req.session.failLogin = true;
        return res.redirect('/login');
    }
});

usersRouter.get('/github', passport.authenticate('github', {scope: ['user:email']}), (req, res) => {
    res.send({
        status: 'success',
        message: 'Success'
    });
});

usersRouter.get('/githubcallback', passport.authenticate('github', {failureRedirect: '/login'}), (req, res) => {
    req.session.user = req.user;
    res.redirect('/products');
});

export default usersRouter;