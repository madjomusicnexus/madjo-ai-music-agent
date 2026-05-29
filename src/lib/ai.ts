export type AIProvider = 'claude' | 'groq' | 'openai';

const PROVIDERS = {
  claude: {
    url: 'https://api.anthropic.com/v1/messages',
    key: import.meta.env.VITE_ANTHROPIC_API_KEY as string,
  },
  groq: {
    url: 'https://api.groq.com/openai/v1/chat/completions',
    key: import.meta.env.VITE_GROQ_API_KEY as string,
  },
  openai: {
    url: 'https://api.openai.com/v1/chat/completions',
    key: import.meta.env.VITE_OPENAI_API_KEY as string,
  },
};

async function callAI(
  provider: AIProvider,
  systemPrompt: string,
  userPrompt: string,
  maxTokens = 1000
): Promise<string> {
  const p = PROVIDERS[provider];

  if (!p.key) throw new Error(`${provider} API key not set`);

  let body: object;
  let headers: Record<string, string>;

  if (provider === 'claude') {
    headers = {
      'Content-Type': 'application/json',
      'x-api-key': p.key,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    };
    body = {
      model: 'claude-haiku-4-5-20251001',
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    };
  } else {
    headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${p.key}`,
    };
    const model = provider === 'groq' ? 'llama-3.1-8b-instant' : 'gpt-4o-mini';
    body = {
      model,
      max_tokens: maxTokens,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
    };
  }

  const res = await fetch(p.url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error(`${provider} error: ${res.status}`);

  const data = await res.json();

  if (provider === 'claude') return data.content[0].text;
  return data.choices[0].message.content;
}

export async function callAIWithFallback(
  providers: AIProvider[],
  systemPrompt: string,
  userPrompt: string,
  maxTokens = 1000
): Promise<string> {
  for (const provider of providers) {
    try {
      return await callAI(provider, systemPrompt, userPrompt, maxTokens);
    } catch (e) {
      console.warn(`${provider} failed, trying next...`, e);
    }
  }
  throw new Error('All AI providers failed');
}