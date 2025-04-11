import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NotionService } from '../services/notion-service';
import { NotionMockClient, mockNotionResponse } from './__mocks__/notion';

vi.mock('@notionhq/client', () => ({
  Client: vi.fn(() => NotionMockClient),
}));

describe('NotionService', () => {
  let notionService: NotionService;

  beforeEach(() => {
    notionService = new NotionService('fake-auth-token', 'fake-database-id');
  });

  it('should fetch data from Notion', async () => {
    const data = await notionService.fetchData();
    expect(NotionMockClient.databases.query).toHaveBeenCalled();
    expect(data).toEqual(mockNotionResponse.results);
  });

  it('should calculate total income correctly', async () => {
    await notionService.fetchData();
    const totalIncome = notionService.getTotalIncome();
    expect(totalIncome).toBe(3000); // 1000 + 2000
  });

  it('should calculate total expenses correctly', async () => {
    await notionService.fetchData();
    const totalExpense = notionService.getTotalExpense();
    expect(totalExpense).toBe(1300); // 500 + 800
  });

  it('should calculate total balance correctly', async () => {
    const balance = await notionService.getTotalBalance();
    expect(balance).toBe(1700); // (1000 + 2000) - (500 + 800)
  });

  it('should return 0 if no data is available', () => {
    const emptyService = new NotionService(
      'fake-auth-token',
      'fake-database-id'
    );
    expect(emptyService.getTotalIncome()).toBe(0);
    expect(emptyService.getTotalExpense()).toBe(0);
  });
});
