import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

import { DEFAULT_MODEL, DEFAULT_TEMPERATURE, MAX_TOKENS } from '../common/constants';
import { OpenAiCompletionDto } from './dto';

@Injectable()
export class OpenAiService {
  private readonly openai: OpenAI;
  private readonly logger = new Logger(OpenAiService.name);

  constructor(private readonly configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.configService.get('openAI.apiKey'),
      organization: this.configService.get('openAI.organizationId')
    });
  }

  public async textCompletion(
    query: string,
    maxTokens: number = MAX_TOKENS,
    temperature: number = DEFAULT_TEMPERATURE
  ): Promise<OpenAiCompletionDto> {
    try {
      const completion = await this.openai.completions.create({
        model: DEFAULT_MODEL,
        max_tokens: maxTokens,
        temperature,
        prompt: query
      });

      // throw an error if the completion end with the reason 'length' (trigger the retry logic)
      if(completion.choices[0].finish_reason === 'length') {
        throw new Error('Generated model completion is not full "finish_reason = length"');
      }

      return completion;
    } catch(error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  public parseCompletion<T>(completion: OpenAiCompletionDto, isJson = true): T {
    try {
      const text: string = completion?.choices[0]?.text;

      if(isJson) {
        return JSON.parse(text);
      } else {
        return text as T;
      }
    } catch(error) {
      this.logger.error('Completion parse error: ', completion?.choices[0]);
      throw error;
    }
  }
}
