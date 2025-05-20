/* eslint-disable no-undef */
import OpenAI from 'openai';
import config from '../config';

const openai = new OpenAI({
  apiKey: config.gpt.key,
});

export { openai };
