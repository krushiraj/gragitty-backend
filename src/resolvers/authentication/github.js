import passport from 'passport'
import { Strategy as GitHubStrategy } from 'passport-github'
import session from 'express-session'
import jwt from 'jsonwebtoken'

import models from "../../models";

const {
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  AUTH_USERNAME,
  DATABASE_URL,
  PRODUCTION,
  HOME_URL,
  JWT_SECRET,
} = process.env

const TOKEN_EXPIRES_IN = "30m"

const rootUrl = (
  !!PRODUCTION
  ? HOME_URL
  : "http://127.0.0.1:8000"
);

const GIT_CONFIG = {
  clientID: GITHUB_CLIENT_ID,
  clientSecret: GITHUB_CLIENT_SECRET,
  callbackURL: `${rootUrl}/auth/callback`
}

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(
  new GitHubStrategy(GIT_CONFIG, async (accessToken, refreshToken, profile, cb) => {
    const data = profile['_json']
    if(data['type'] === 'User') {
      const [user, created] = await models.User.findOrCreate({
        where: {
          email: data.email
        },
        defaults: {
          profilePic: data.avatar_url,
          name: data.name,
          username: data.login,
          gitProfile: profile.profileUrl
        }
      });
      return cb(created || user ? null : new Error("There was an error during authentication."), user);
    } else {
      throw TypeError('The Github profile must belong to a User.')
    }
  })
);

const resolve = (app) => {

  app.use(session({
    secret: 'session-secret',
    saveUninitialized: true,
    resave: false
  }));
  app.use(passport.initialize());
  app.use(passport.session());

  app.get("/auth", passport.authenticate("github"));
  app.get(
    "/auth/callback",
    passport.authenticate("github", {
      failureRedirect: "/auth",
      successRedirect: `/${!!PRODUCTION ? '?success=true' : ''}`
    }),
  );

  app.get('/', async (req, res) => {
    let token = req.headers["x-token"] || 'NO_TOKEN';
    let check = false, newToken = false
    if (req.isAuthenticated()) {
      try {
        const user = await jwt.verify(token, process.env.JWT_SECRET);
        if (user.id !== req.user.id) {
          throw new EvalError('Token courrpted. Please get a new one.')
        }
      }
      catch(e) {
        token = await jwt.sign({
          id: req.user.id,
          email: req.user.email,
          username: req.user.username
        }, JWT_SECRET, {
          expiresIn: TOKEN_EXPIRES_IN
        })
        newToken = true;
      }
      check = true;
    }
    if (req.query.refresh) {
      res.send({
        auth,
        newToken,
        token
      })
    }
    const auth = req.isAuthenticated()
    const success = !!(auth && check && token);
    res.redirect(
      `https://gragitty.netlify.com/login?success=${success}&auth=${auth}&newToken=${newToken}&token=${token}`
    );
  })

  app.get('/database-url', (req, res) => {
    const { clientID, clientSecret, username } = req.body;
    if(
      (!!DATABASE_URL || !PRODUCTION) &&
      clientID === GITHUB_CLIENT_ID &&
      clientSecret === GITHUB_CLIENT_SECRET &&
      username === AUTH_USERNAME
    ) {
      res.send(DATABASE_URL || 'NOTHING CONFIGURED')
    } else {
      res.send('INVALID URL')
    }
  })
}

export default resolve
