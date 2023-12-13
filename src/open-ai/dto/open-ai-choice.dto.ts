import { Language, PredictionCategory } from '../../common/constants';

export class SignInfoDto {
  language: Language;
  name: string;
  description: {
    category: PredictionCategory;
    text: string;
  }[];
}

export class OpenAiChoiceDto {
  text?: string;
  index?: number;
  finish_reason?: 'stop' | string;
}
