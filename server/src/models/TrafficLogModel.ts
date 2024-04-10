import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";

class Req {
    @prop()
    body!: string;

    @prop()
    ip!: string;

    @prop()
    method!: string;

    @prop()
    params!: string;

    @prop()
    query!: string;

    @prop()
    url!: string;

    @prop()
    remoteAddress!: string;

    @prop()
    userAgent!: string;
}

@modelOptions({ schemaOptions: { timestamps: true } })
class TrafficLog {
    @prop({ type: Req })
    req!: Req;

    @prop({ type: String })
    response!: string;

    @prop({ type: Number })
    statusCode!: number;

    @prop({ type: String })
    duration!: string;
}

const TrafficLogModel = getModelForClass(TrafficLog);

export default TrafficLogModel;
