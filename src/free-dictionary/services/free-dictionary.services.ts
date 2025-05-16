import { Injectable } from '@nestjs/common';

@Injectable()
export class FreeDictionaryServices {
  constructor() {}

  async getInformation(word: string) {
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`,
    );
    const data = await response.json();
    return data;
  }
}
