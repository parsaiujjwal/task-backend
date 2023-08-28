import User from '../model/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const signUp = async (req, res, next) => {
    try {
        const { firstName, lastName, email, password, confirmPassword, referralCode } = req.body;
        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }
        req.body.password = await bcrypt.hash(password, await bcrypt.genSalt(10));
        let ByUser = null;
        if (referralCode) {
            ByUser = await User.findOne({ referralCode });
            if (!ByUser) {
                return res.status(400).json({ message: 'Invalid referral code' });
            }
        }
        const referralCodeGenerated = generateReferralCode();

        let user = await User.create({
            firstName, lastName, email, password: req.body.password,
            referredBy: ByUser ? ByUser._id : null,
            referralCode: referralCodeGenerated
        });
        //------------------------------calculation of Bonus    -------------------------
        if (ByUser) {
            const BonusAmt = (10 / 100) * 100;
            ByUser.tokenBalance += BonusAmt;

            if (ByUser.referralCount === 1) {
                ByUser.tokenBalance += BonusAmt * (50 / 100);
            }
            else if (ByUser.referralCount === 2) {
                ByUser.tokenBalance += BonusAmt * (30 / 100);
            }
            else if (ByUser.referralCount === 3) {
                ByUser.tokenBalance += BonusAmt * (20 / 100);
            }
            ByUser.referralCount++;
            await ByUser.save();
        }
        return res.status(200).json({ user: user, message: 'Sign up success', status: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal Server Error', status: false });
    }
};

//------------------------------------------signin ------------------------------------------------
export const signIn = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials', status: false });
        }
        const status = await bcrypt.compare(password, user.password);
        if (!status) {
            return res.status(401).json({ message: 'Invalid credentials', status: false });
        }
        const token = jwt.sign({ subject: user.email }, 'ujjwalparsai');

        return res.status(200).json({ message: 'Sign In Success', user: user, token: token, status: true });
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', status: false });
    }
};
//----------------------------------------for generateReferralCode--------------------------------
function generateReferralCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWhybaskcinqaeijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        code += characters.charAt(randomIndex);
    }
    return code;
}
//---------------------------------------Token-verification code------------------------------------ 
export const tokenVerify = (req, res, next) => {
    try {
        let token = req.Headers.authorization;
        if (!token) throw Error();
        jwt.verify(token, 'ujjwalparsai')
        next();
    } catch (err) {
        res.status(500).json({ massage: "internal server error", status: false });
    }
}
//-----------------------------------------------get all user by id --------------------------------

export const getTotalUsersCount = async (req, res, next) => {
    try {
        const totalCount = await User.countDocuments();
        res.json({ totalCount });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const userCount = async  (req, res, next) => {
    try {
        const user = await User.find({ referredBy: req.body.id });
        console.log(user)
        if (user) {
            return res.status(200).json({ user: user, status: true })
        }
        else {
            return res.status(401).json({ error: "not found", status: false })
        }
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal server error", status: false })
    }
}
