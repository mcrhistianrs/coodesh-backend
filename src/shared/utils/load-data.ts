import { NestFactory } from '@nestjs/core';
import * as fs from 'fs';
import * as https from 'https';
import * as path from 'path';
import { AppModule } from '../../app.module';
import { Dictionary } from '../../dictionary/domain/entities/dictionary';
import { DictionaryDao } from '../../dictionary/infra/database/mongo/dao/dictionary-dao';

export async function downloadEnglishWordList(): Promise<void> {
  const url =
    'https://raw.githubusercontent.com/meetDeveloper/freeDictionaryAPI/master/meta/wordList/english.txt';
  const outputPath = path.join('/tmp', 'english.txt');
  return new Promise((resolve, reject) => {
    https
      .get(url, (response) => {
        if (response.statusCode !== 200) {
          reject(new Error(`Failed to download file: ${response.statusCode}`));
          return;
        }
        const fileStream = fs.createWriteStream(outputPath);
        response.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close();
          resolve();
        });
        fileStream.on('error', (err) => {
          fs.unlink(outputPath, () => {});
          reject(err);
        });
      })
      .on('error', (err) => {
        reject(err);
      });
  });
}

async function insertWordsIntoMongo(
  dictionaryDao: DictionaryDao,
): Promise<void> {
  const filePath = path.join('/tmp', 'english.txt');
  const words = fs.readFileSync(filePath, 'utf-8').split('\n').filter(Boolean);
  for (const word of words) {
    const dictionary = Dictionary.create({ word });
    await dictionaryDao.create(dictionary);
    console.log(`[*] Inserted ${word}`);
  }
}

(async () => {
  try {
    await downloadEnglishWordList();
    console.log('[*] Download');
    const app = await NestFactory.createApplicationContext(AppModule);
    const dictionaryDao = app.get(DictionaryDao);
    await insertWordsIntoMongo(dictionaryDao);
    await app.close();
    console.log('[*] Database');
    process.exit(0);
  } catch (error) {
    console.error('[*] NOK:', error);
    process.exit(1);
  }
})();
