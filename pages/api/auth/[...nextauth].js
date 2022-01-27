import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { Login } from "../../../lib/data/auth";

export default NextAuth({
    session: {
        jwt: true
    },

    providers: [
        CredentialsProvider({
            async authorize(credentials) {
                const result = await Login(credentials.email, credentials.password);

                if (result === 0x01)
                    throw new Error("No user found with the email");
                else if (result === 0x02)
                    throw new Error("Incorrect Password");
                else {
                    console.log(result)
                    return result;
                }
            }
        })
    ]
})