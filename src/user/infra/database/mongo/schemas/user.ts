import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export type UserMongoDocument = UserMongoModel & {
  _id: Types.ObjectId;
};

@Schema({ collection: 'user', timestamps: true })
class UserMongoModel {
  @Prop({ required: true, type: String, unique: true })
  email: string;

  @Prop({ required: true, type: String })
  password: string;

  @Prop({ required: true, type: String })
  name: string;
}

const UserMongoSchema = SchemaFactory.createForClass(UserMongoModel);

export { UserMongoModel, UserMongoSchema };
