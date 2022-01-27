import dbConnect from "./db_connector";
import User from "../../models/user";
import bcrypt from "bcrypt";

export async function Signup(email, password) {
    await dbConnect();

    // Check if user already exists
    if (await User.findOne({ email: email })) return 0x01;

    // Create a hash of the password
    const hashedPass = await bcrypt.hash(password, 10);

    // Create the user and set email and password
    const user = new User({ email });
    user.password = hashedPass;
    await user.save();
    
    return 0x00;
}

export async function Login(email, password) {
    await dbConnect();

    const fetchUser = await User.findOne({ email: email });
    if (!fetchUser) return 0x01;

    if (!await bcrypt.compare(password, fetchUser.password))
        return 0x02;
    else {
        const hash = await bcrypt.genSalt();
        fetchUser.hash = hash;
        fetchUser.lastLogin = Date.now();

        await fetchUser.save();
        return { 
            email: fetchUser.email,
            hash: fetchUser.hash
        };
    }
}

export async function ValidateHash(email, hash) {
    await dbConnect();

    const fetchUser = await User.findOne({ email: email });
    if (!fetchUser) return false;

    const expiration = ((new Date) - fetchUser.lastLogin) < (12 * 60 * 60 * 1000);
    if (fetchUser.hash === hash && expiration) return true;
}