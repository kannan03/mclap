import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import EmailProvider from "next-auth/providers/email"
import GitHubProvider from "next-auth/providers/github"

// import { Client } from "postmark"

// import { env } from "@/env.mjs"
import { siteConfig } from "@/config/site"

// const postmarkClient = new Client(env.POSTMARK_API_TOKEN)

const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL
const sessionAge  = Number(process.env.NEXTAUTH_JWT_AGE)

export const config = {
  api: {
    bodyParser: false,
  },
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge : sessionAge,
  },
  pages: {
    signIn: "/login",
  },
  jwt: {
    secret: "SUPER_SECRET_JWT_SECRET",
  },
  providers: [
    CredentialsProvider({
      id: "user-login-kuykendall",
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "Enter your email",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Enter your password",
        },
      },
      async authorize(credentials) {
        if (credentials) {
          const payload = {
            email: credentials.email,
            password: credentials.password,
          }
          const res = await fetch(baseURL + "/v1/auth/login", {
            method: "POST",
            body: JSON.stringify(payload),
            headers: {
              "Content-Type": "application/json",
              "Accept-Language": "en-US",
            },
          })
          const user = await res.json()
          if (!res.ok) {
            throw new Error("Invalid Username or Password")
          }
          if (res.ok && user) {
            return user
          }
          return null
        }
        return null
      },
    }),
    // GitHubProvider({
    //   clientId: env.GITHUB_CLIENT_ID,
    //   clientSecret: env.GITHUB_CLIENT_SECRET,
    // }),
    // EmailProvider({
    //   from: env.SMTP_FROM,
    //   sendVerificationRequest: async ({ identifier, url, provider }) => {
    //     const user = await db.user.findUnique({
    //       where: {
    //         email: identifier,
    //       },
    //       select: {
    //         emailVerified: true,
    //       },
    //     })

    //     const templateId = user?.emailVerified
    //       ? env.POSTMARK_SIGN_IN_TEMPLATE
    //       : env.POSTMARK_ACTIVATION_TEMPLATE
    //     if (!templateId) {
    //       throw new Error("Missing template id")
    //     }

    //     const result = await postmarkClient.sendEmailWithTemplate({
    //       TemplateId: parseInt(templateId),
    //       To: identifier,
    //       From: provider.from as string,
    //       TemplateModel: {
    //         action_url: url,
    //         product_name: siteConfig.name,
    //       },
    //       Headers: [
    //         {
    //           // Set this to prevent Gmail from threading emails.
    //           // See https://stackoverflow.com/questions/23434110/force-emails-not-to-be-grouped-into-conversations/25435722.
    //           Name: "X-Entity-Ref-ID",
    //           Value: new Date().getTime() + "",
    //         },
    //       ],
    //     })

    //     if (result.ErrorCode) {
    //       throw new Error(result.Message)
    //     }
    //   },
    // }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {
        return {
          ...user?.user,
          accessToken: user?.tokens?.access.token,
          refreshToken: user?.tokens?.refresh.token,
        }
      }
      return token
    },

    async session({ token,session, user }) {
      if (token?.accessToken) {
        session.accessToken = token.accessToken
        session.refreshToken = token.refreshToken,
        session.user.email =token.email,
        session.user.firstName = token.firstName,
        session.user.lastName = token.lastName
        session.user.id =token.id
        session.user.roles = token.roles
        session.user.orgId = token.orgId


        // const res = await fetch(baseURL + "/users/me", {
        //   method: "GET",
        //   headers: {
        //     "Content-Type": "application/json",
        //     "Accept-Language": "en-US",
        //     Authorization: `Bearer ${token.accessToken}`,
        //   },
        // })
        // const user = await res.json()

        // if (!res.ok) {
        //   throw new Error("Error while fetching user details")
        // }
        // session.user.email = user.email
        // session.user.first_name = user.name



      }

      return session
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
    // async signOut({ token, session }) {
    //   // Delete auth cookie on signout so it doesn't persist past log out
    //   res.setHeader("Set-Cookie", "");

    //   // Set token/session to {}, that would update the cilentside token/session as well
    //   token = {};
    //   session = {};
    // },
  },
}
