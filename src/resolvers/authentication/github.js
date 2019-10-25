import passport from 'passport'
import { Strategy as GitHubStrategy } from 'passport-github'
import models from "../../models";

console.log({models})

const {
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET
} = process.env

const rootUrl = (
  !!process.env.PRODUCTION
  ? process.env.HOME_URL
  : "127.0.0.1:8000"
);

console.warn({ rootUrl })

const GIT_CONFIG = {
  clientID: GITHUB_CLIENT_ID,
  clientSecret: GITHUB_CLIENT_SECRET,
  callbackURL: `/auth/callback`
}

passport.use(
  new GitHubStrategy(GIT_CONFIG, (accessToken, refreshToken, profile, cb) => {
    console.log({profile})
    models.User.findOrCreate({ where: { githubId: profile.id } }, function(err, user) {
      return cb(err, user);
    });
  })
);

const resolve = (app) => {
  app.get("/auth", passport.authenticate("github"));
  app.get(
    "/auth/callback",
    passport.authenticate("github", { failureRedirect: "/login" }),
    function(req, res) {
      // Successful authentication, redirect home.
      res.redirect("/");
    }
  );
}

export default resolve
