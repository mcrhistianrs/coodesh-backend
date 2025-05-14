import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
class FavoriteMongoModel extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  dictionaryId: string;

  @Prop({ default: false })
  visited: boolean;

  @Prop()
  createdAt: Date;
}

const FavoriteSchema = SchemaFactory.createForClass(FavoriteMongoModel);

export { FavoriteMongoModel, FavoriteSchema };
