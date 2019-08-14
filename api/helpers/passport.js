const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportJWT = require('passport-jwt');
const userService = require('../services/userService');
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const sharedSecret = "qsnfkdh89423d8jwoj3280ei3d0eic9-4hgf398ydhuy2g682ed823d8ge"; //process.env.PASSPORT_SECRET;

passport.use(new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password'
}, async function (username, password, cb) {
  //this one is typically a DB call. Assume that the returned user object is pre-formatted and ready for storing in JWT
  try {
    let user = await userService.getUserWithPassword(username, password);
    console.log("passport.js: ",user);

    if (!user || user.walletKey !== password) {
      throw { statusCode: 403, message: 'Incorrect username or password.' };
    }
    
    // // purge password field
    // delete user.currentPassword;

    return cb(null, user, { message: 'Logged In Successfully' });
  } catch (err) {
    cb(err);
  }
}));

passport.use(new JWTStrategy({
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: sharedSecret
},
  async function (jwtPayload, cb) {
    // Return user object from the JWTPayload
      return cb(null, jwtPayload); //jwtPayload
  }
));
