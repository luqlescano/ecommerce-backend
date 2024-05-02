import { Router } from 'express';
import passport from 'passport';

const routerSession = Router();

routerSession.get('/github', passport.authenticate('github', {scope: ['user:email']}), (req, res) => {
    res.send({
        status: 'success',
        message: 'Success'
    });
});

routerSession.get('/githubcallback', passport.authenticate('github', {failureRedirect: '/login'}), (req, res) => {
    req.session.user = req.user;
    res.redirect('/');
});

export default routerSession;