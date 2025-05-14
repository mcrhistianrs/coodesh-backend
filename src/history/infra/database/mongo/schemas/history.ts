import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export type HistoryMongoDocument = HistoryMongoModel & {
  _id: Types.ObjectId;
};

@Schema({ collection: 'history', timestamps: true })
class HistoryMongoModel {
  @Prop({ required: true, type: String })
  userId: string;

  @Prop({ required: true, type: String })
  dictionaryId: string;

  @Prop({ required: false, type: Boolean, default: false })
  visited: boolean;

  @Prop({ required: false, type: Date, default: Date.now })
  createdAt: Date;
}

const HistoryMongoSchema = SchemaFactory.createForClass(HistoryMongoModel);

export { HistoryMongoModel, HistoryMongoSchema };
