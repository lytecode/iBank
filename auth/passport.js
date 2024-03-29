const bcrypt = require('bcrypt-nodejs'),
    db = require('../conf/mysqlDB'),
    passport = require('passport'),
    LocalStrategy = require("passport-local").Strategy


      passport.use(new LocalStrategy(authenticate))
      passport.use("local-register", new LocalStrategy({passReqToCallback: true}, register))

      function authenticate(username, password, done){
          db("users")
            .where("username", username)
            .first()
            .then((user) => {
              if(!user || !bcrypt.compareSync(password, user.password)){
                  return done(null, false, {message: "Invalid credentials"})
              }
              
              done(null, user)
          }, done)
      }

      function register(req, username, password, done){
        db("users")
        .where("username", username)
        .first()
        .then((user) => {
            if(user){
                return done(null, false, {message: "User credentials already exist"})
            }
            if(password !== req.body.password2){
                return done(null, false, {message: "Passwords do not match"})
            }

            const newUser = {
                username: req.body.username,
                password: bcrypt.hashSync(req.body.password)
            }
            //send the new user to the database
            db("users")
                .insert(newUser)
                .then((ids) => {
                    newUser.id = ids[0]
                    done(null, newUser)
                })
       })
    }


      passport.serializeUser(function(user, done){
          done(null, user.id)
      })

      passport.deserializeUser(function(id, done){
          db("users")
            .where("id", id)
            .first()
            .then((user) => done(null, user))
      })
