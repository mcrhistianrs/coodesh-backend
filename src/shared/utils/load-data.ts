import { NestFactory } from '@nestjs/core';
import 'dotenv/config';
import * as fs from 'fs';
import * as https from 'https';
import * as path from 'path';
import { Dictionary } from '../../dictionary/domain/entities/dictionary';
import { DictionaryDao } from '../../dictionary/infra/database/mongo/dao/dictionary-dao';
import { LoadDataModule } from './load-data.module';

export async function downloadEnglishWordList(): Promise<void> {
  const url =
    'https://raw.githubusercontent.com/meetDeveloper/freeDictionaryAPI/master/meta/wordList/english.txt';
  const outputPath = path.join(process.cwd(), 'tmp', 'english.txt');

  // Ensure tmp directory exists
  if (!fs.existsSync(path.join(process.cwd(), 'tmp'))) {
    fs.mkdirSync(path.join(process.cwd(), 'tmp'));
  }

  return new Promise((resolve, reject) => {
    https
      .get(url, (response) => {
        if (response.statusCode !== 200) {
          console.log(response.statusCode);
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
  const filePath = path.join(process.cwd(), 'tmp', 'english.txt');
  const words = fs.readFileSync(filePath, 'utf-8').split('\n').filter(Boolean);
  console.log(`[*] Found ${words.length} words to insert`);

  for (const word of words) {
    const dictionary = Dictionary.create({ word });
    await dictionaryDao.create(dictionary);
    console.log(`[*] Inserted ${word}`);
  }
}

(async () => {
  try {
    console.log('[*] Starting dictionary data load...');
    await downloadEnglishWordList();
    console.log('[*] Download completed');

    const app = await NestFactory.createApplicationContext(LoadDataModule);
    const dictionaryDao = app.get(DictionaryDao);

    await insertWordsIntoMongo(dictionaryDao);
    await app.close();

    console.log('[*] Database population completed');
    process.exit(0);
  } catch (error) {
    console.error('[*] Error:', error);
    process.exit(1);
  }
})();
