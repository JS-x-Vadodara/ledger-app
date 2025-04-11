import { vi } from 'vitest';

export const mockNotionResponse = {
  results: [
    {
      properties: {
        Income: { number: 1000 },
        Expense: { number: 500 },
      },
    },
    {
      properties: {
        Income: { number: 2000 },
        Expense: { number: 800 },
      },
    },
  ],
};

export const NotionMockClient = {
  databases: {
    query: vi.fn().mockResolvedValue(mockNotionResponse),
  },
};
