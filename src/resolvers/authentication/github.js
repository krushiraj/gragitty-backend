import passport from 'passport'
import { Strategy as GitHubStrategy } from 'passport-github'
import { graphql } from 'graphql';
import session from 'express-session'

import models from "../../models";

const {
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET
} = process.env

const rootUrl = (
  !!process.env.PRODUCTION
  ? process.env.HOME_URL
  : "127.0.0.1:8000"
);

const GIT_CONFIG = {
  clientID: GITHUB_CLIENT_ID,
  clientSecret: GITHUB_CLIENT_SECRET,
  callbackURL: `/auth/callback`
}

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
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
      })
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
      failureRedirect: "/login",
      successRedirect: "/"
    }),
  );

  app.get('/', (req, res) => {
    res.send({auth: req.isAuthenticated(), user: req.user})
  })
}

export default resolve
