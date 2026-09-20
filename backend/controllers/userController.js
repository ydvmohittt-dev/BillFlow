import User from "../models/User.js";
import Client from "../models/Client.js";
export default async function userdetails(req,res){
 res.json(await User.find({ user: req.user._id }));
}
