const user = require('../Model/UserLogin.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator');

let mailtransporter = nodemailer.createTransport({
    host: "smtp-mail.outlook.com", // hostname
    secureConnection: true,
    service : "Hotmail",
    port:"587",
    auth :{
        user: "testvalidatorautomation@outlook.com",
        pass: "Sanjay@321"
    },
    tls: {
        ciphers:'SSLv3'
    },
    logger: true,
    debug: true
})

const register = async (req, res) => {
    const { password, email } = req.body;
    const pass = await bcrypt.hash(password, 10);
    try {
        const User = new user({
            email:email,
            password:pass
        })
        const usr = await User.save()
        const OTP = otpGenerator.generate(4,{upperCaseAlphabets:false,lowerCaseAlphabets:false,specialChars:false});
        const updateOtp = await user.findByIdAndUpdate(usr._id,{otp:OTP,validTill:Date.now()+300000});
        let details = {
            from: "testvalidatorautomation@outlook.com",
            to: `${email}`,
            subject: "Your Otp",
            html: `
            <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
                <div style="margin:50px auto;width:70%;padding:20px 0">
                    <div style="border-bottom:1px solid #eee">
                        <p style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Book Kart</p>
                    </div>
                    <p style="font-size:1.1em">Hi,${email}</p>
                    <p> Use the following OTP to complete your Sign Up procedures. OTP is valid for 1 Hour</p>
                    <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${OTP}</h2>
                    <p style="font-size:0.9em;">Regards,<br />Fam<span style="font-size:0.9em;color:#FECE01">Jam</span></p>
                    <hr style="border:none;border-top:1px solid #eee" />
                    <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
                        <p>Book Kart</p>
                        <p>Tamil Nadu</p>
                        <p>India</p>
                    </div>
                </div>
            </div>
            `
        }
    mailtransporter.sendMail(details,function(err,data){
        if(err){
            console.log(err);
        }else{
            console.log("Email sent");
            res.status(200).json({message:"User Created",user:usr._id});
        }
    });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ error: e.message });
    }
};

const login = async(req,res) =>{
    const { password, email } = req.body;
    try {
        const User = await user.findOne({email:email});
        if(!User){
            return res.status(400).json({error:"User not found"});
        }
        const isMatch = await bcrypt.compare(password, User.password);
        if(!isMatch){
            return res.status(400).json({error:"Incorrect Password"});
        }
        const token = jwt.sign(User.email,"secretkey");
        return res.status(200).json({message:"User logged in successfully",id:User._id,token:token});
    } catch (e) {
        console.log(e);
        return res.status(500).json({ error: e.message });
    }
}


module.exports = {
    register,
    login
};