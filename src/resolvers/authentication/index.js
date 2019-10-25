import passport from 'passport'

import signUpUserGithub from './github'

const signUp = {
  github: signUpUserLocal
}

export default (app) => {
  app.get(
    '/auth/:strategy',
    (req, res) => signUp[req.params.strategy](req, res)
  )

  app.post(
    '/auth/:strategy/callback',
    (req, res) => passport.authenticate(
      req.params.strategy
    )(req, res)
  )
}