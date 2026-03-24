import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import bcrypt from "bcryptjs";
import {
  getUserByEmail,
  getUserById,
  getUserPasswordHash,
  getUserByOpenId,
  upsertUserPasswordHash,
  upsertUser,
} from "../db";
import { ENV } from "./env";

function getSafeEmail(email?: string | null) {
  return email?.trim().toLowerCase() || null;
}

export async function setLocalPassword(userId: number, rawPassword: string) {
  const hash = await bcrypt.hash(rawPassword, 10);
  await upsertUserPasswordHash(userId, hash);
}

async function verifyLocalPassword(userId: number, rawPassword: string) {
  const hash = await getUserPasswordHash(userId);
  if (!hash) return false;
  return bcrypt.compare(rawPassword, hash);
}

passport.serializeUser((user: Express.User, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await getUserById(id);
    done(null, user || false);
  } catch (error) {
    done(error as Error);
  }
});

passport.use(
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    async (email, password, done) => {
      try {
        const normalizedEmail = getSafeEmail(email);
        if (!normalizedEmail) {
          return done(null, false, { message: "Invalid email" });
        }

        const user = await getUserByEmail(normalizedEmail);
        if (!user) {
          return done(null, false, { message: "User not found" });
        }

        const valid = await verifyLocalPassword(user.id, password);
        if (!valid) {
          return done(null, false, { message: "Invalid password" });
        }

        return done(null, user);
      } catch (error) {
        return done(error as Error);
      }
    }
  )
);

if (ENV.googleClientId && ENV.googleClientSecret) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: ENV.googleClientId,
        clientSecret: ENV.googleClientSecret,
        callbackURL: "/api/auth/google/callback",
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const openId = `google:${profile.id}`;
          const email = getSafeEmail(profile.emails?.[0]?.value);
          const name = profile.displayName || "Google User";

          await upsertUser({
            openId,
            email,
            name,
            loginMethod: "google",
            lastSignedIn: new Date(),
          });

          const user = await getUserByOpenId(openId);
          if (!user) return done(null, false);
          return done(null, user);
        } catch (error) {
          return done(error as Error);
        }
      }
    )
  );
}

if (ENV.facebookAppId && ENV.facebookAppSecret) {
  passport.use(
    new FacebookStrategy(
      {
        clientID: ENV.facebookAppId,
        clientSecret: ENV.facebookAppSecret,
        callbackURL: "/api/auth/facebook/callback",
        profileFields: ["id", "displayName", "emails"],
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const openId = `facebook:${profile.id}`;
          const email = getSafeEmail((profile.emails?.[0] as { value?: string } | undefined)?.value);
          const name = profile.displayName || "Facebook User";

          await upsertUser({
            openId,
            email,
            name,
            loginMethod: "facebook",
            lastSignedIn: new Date(),
          });

          const user = await getUserByOpenId(openId);
          if (!user) return done(null, false);
          return done(null, user);
        } catch (error) {
          return done(error as Error);
        }
      }
    )
  );
}

export default passport;
