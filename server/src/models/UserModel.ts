import { PropType, getModelForClass, modelOptions, prop } from "@typegoose/typegoose";

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
