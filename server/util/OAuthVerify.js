import { OAuth2Client } from "google-auth-library";

const verifyGoogleLogin = async (idToken) => {
    
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
});

const payload = ticket.getPayload();

return payload;

}

export default verifyGoogleLogin;