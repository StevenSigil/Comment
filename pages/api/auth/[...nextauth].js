import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import UserProfiles from "../../../models/profileModel";
import { connectToDatabase } from "../../../util/mongodb";

const options = {
  site: process.env.NEXTAUTH_URL,
  secret: process.env.SECRET_KEY,
  providers: [
    Providers.Email({
      server: {
        port: 465,
        host: "smtp.gmail.com",
        secure: true,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
        tls: {
          rejectUnauthorized: false,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
    // TODO: add OAuth providers
  ],
  database: process.env.DATABASE,
  session: {
    jwt: true,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    jwt: async (token, user, account, profile, isNewUser) => {
      user && (token.user = user);
      token.pid = await getProfileId(token.sub);
      return token;
    },
    session: async (session, token) => {
      // Adds the basic user data to session object
      session.user = token.user;
      session.user.pid = token.pid;
      return session;
    },
  },
};

async function getProfileId(uid) {
  // Used to add the profile._id to session for frontend api
  await connectToDatabase();
  const profile = await UserProfiles.findOne({ base_user_id: uid }).exec();

  return profile ? profile._id : null;
}

export default (req, res) => NextAuth(req, res, options);
