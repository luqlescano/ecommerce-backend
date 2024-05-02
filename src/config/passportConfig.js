import passport from 'passport';
import GitHubStrategy from 'passport-github2';
import userModel from '../dao/models/userModel';

const initializePassport = () => {
    const CLIENT_ID = "Iv1.85647a080478e0db";
    const SECRET_ID = "c0b2b541e78faf107263d0b52f7466113757e8dc";

    passport.use(
        'github',
        new GitHubStrategy({
            clientID: CLIENT_ID,
            clientSecret: SECRET_ID,
            callbackURL: 'http://localhost:8080/api/sessions/githubcallback'
        },
    async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await userModel.findOne({username: profile._json.login})
            
            if (!user) {
                let newUser = {
                    username: profile._json.login,
                    name: profile._json.name,
                    password: ''
                }
                let result = await userModel.create(newUser);
                done(null, result);
            } else {
                done(null, user);
            }
        } catch(error) {
            return done(error);
        }
    })
    );

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        let user = await userModel.findById(id);

        done(null, user);
    });
};

export default initializePassport;