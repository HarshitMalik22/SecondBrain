import mongoose, { model, Schema } from "mongoose";
mongoose.connect("mongodb+srv://harshitmalik29:harshitmalik22@secondbrain.duv87yl.mongodb.net/");
const UserSchema = new Schema({
    username: { type: String, unique: true },
    password: { type: String },
});
export const UserModel = model("User", UserSchema);
//# sourceMappingURL=db.js.map