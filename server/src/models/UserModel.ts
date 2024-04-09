import { PropType, getModelForClass, modelOptions, pre, prop } from "@typegoose/typegoose";
import { hash } from "bcrypt";

@pre<User>("save", async function (next) {
    const user = this;
    if (!user.isModified("password")) {
        return next();
    }
    user.password = await hash(user.password, 10);
})
@modelOptions({
    schemaOptions: { timestamps: true },
})
class User {
    @prop({ required: true })
    name!: string;

    @prop({ type: String, required: true, unique: true })
    email!: string;

    @prop({ type: String, default: "admin" })
    roles!: "superAdmin" | "admin" | "user";

    @prop({
        type: String,
        required: true,
    })
    password!: string;

    @prop({ type: () => [String], default: [] }, PropType.ARRAY)
    previousPasswords?: string[];

    @prop({ type: String })
    refreshToken?: string;
}

const UserModel = getModelForClass(User);

export default UserModel;
