import { OpenAiChoiceDto } from './open-ai-choice.dto';
import { OpenAiUsageDto } from './open-ai-usage.dto';

export class OpenAiCompletionDto {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: OpenAiChoiceDto[];
  usage?: OpenAiUsageDto;
}
