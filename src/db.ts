import mongoose, {model, Schema} from "mongoose";

mongoose.connect("mongodb+srv://harshitmalik29:harshitmalik22@secondbrain.duv87yl.mongodb.net/?retryWrites=true&w=majority&appName=SecondBrain")

const UserSchema  = new Schema({
    username: {type: String, unique: true},
    password: {type: String}, 
})

export const UserModel = model( "User", UserSchema);

const ContentSchema = new Schema({
    title: String,
    link: String,
    tags: [{type: mongoose.Types.ObjectId, ref: 'Tag'}],
    userId: {type: mongoose.Types.ObjectId, ref: 'User', required: true}
})

export const ContentModel = model("Content", ContentSchema); 