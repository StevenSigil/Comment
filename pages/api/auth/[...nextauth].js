import NextAuth from "next-auth";
import Providers from "next-auth/providers";

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
    async session(session, token) {
      // Adds the UID to session for retrieving the user's profile
      session.user._id = token.sub;
      return session;
    },
  },
};

export default (req, res) => NextAuth(req, res, options);
