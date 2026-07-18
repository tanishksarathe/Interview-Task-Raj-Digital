import { OAuth2Client } from "google-auth-library";

const verifyGoogleLogin = async (idToken) => {
    
    console.log("Verify Google Login ke andar");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID_A);

const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID_A,
});

const payload = ticket.getPayload();

console.log("Payload : ", payload);

return payload;

}

export default verifyGoogleLogin;