import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export type DictionaryMongoDocument = DictionaryMongoModel & {
  _id: Types.ObjectId;
};

@Schema({ collection: 'dictionary', timestamps: true })
class DictionaryMongoModel {
  @Prop({ required: true, type: String })
  word: string;
}

const DictionaryMongoSchema =
  SchemaFactory.createForClass(DictionaryMongoModel);

export { DictionaryMongoModel, DictionaryMongoSchema };
