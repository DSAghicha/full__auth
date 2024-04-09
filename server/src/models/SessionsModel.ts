import { PropType, getModelForClass, modelOptions, prop } from "@typegoose/typegoose";
import { ObjectId } from "mongoose";

class Session {
    @prop({ required: true })
    loginAt!: Date;

    @prop({})
    logoutAt?: Date;
}

@modelOptions({
    schemaOptions: { timestamps: true },
})
class Sessions {
    @prop({ required: true })
    userId!: ObjectId;

    @prop({ type: () => [Session], required: true }, PropType.ARRAY)
    sessions!: Session[];
}

const SessionsModel = getModelForClass(Sessions);

export default SessionsModel;
