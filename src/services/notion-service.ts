'use strict';

import { Client } from '@notionhq/client';

interface NotionProperty {
  id: string;
  type: string;
  unique_id?: { number: number };
  number?: number;
  title?: { text: { content: string } }[];
  rich_text?: { text: { content: string } }[];
  date?: { start: string };
}

interface NotionPage {
  object: string;
  id: string;
  created_time: string;
  last_edited_time: string;
  properties: {
    Note?: NotionProperty;
    Category?: NotionProperty;
    ID?: NotionProperty;
    Date?: NotionProperty;
    Expense?: NotionProperty;
    Income?: NotionProperty;
    Title?: NotionProperty;
  };
  url: string;
}

export class NotionService {
  client: Client;
  databaseId: string;
  private data: NotionPage[] = [];

  /**
   * Initializes the NotionService with authentication and database ID.
   * @param {string} authToken - The Notion API authentication token.
   * @param {string} databaseId - The Notion database ID.
   */
  constructor(authToken: string, databaseId: string) {
    if (!authToken || !databaseId) {
      throw new Error('Authentication token and database ID are required.');
    }
    this.client = new Client({ auth: authToken });
    this.databaseId = databaseId;
  }

  /**
   * Fetches data from the Notion database.
   * @returns {Promise<NotionPage[]>} - The fetched data.
   */
  async fetchData(): Promise<NotionPage[]> {
    try {
      const response = await this.client.databases.query({
        database_id: this.databaseId,
        sorts: [{ property: 'Date', direction: 'ascending' }],
      });

      this.data = response.results as NotionPage[];
      return this.data;
    } catch (error) {
      console.error('Error fetching data from Notion:', error);
      throw new Error('Failed to fetch data from Notion.');
    }
  }

  /**
   * Calculates total income from the fetched data.
   * @returns {number} - The total income.
   */
  getTotalIncome(): number {
    if (!this.data.length) {
      console.warn('Data is empty. Fetch data before calculating income.');
      return 0;
    }

    return this.data.reduce((acc, item) => {
      const income = item.properties?.['Income']?.number || 0;
      return acc + income;
    }, 0);
  }

  /**
   * Calculates total expenses from the fetched data.
   * @returns {number} - The total expenses.
   */
  getTotalExpense(): number {
    if (!this.data.length) {
      console.warn('Data is empty. Fetch data before calculating expenses.');
      return 0;
    }

    return this.data.reduce((acc, item) => {
      const expense = item.properties.Expense?.number ?? 0;
      return acc + expense;
    }, 0);
  }

  /**
   * Calculates the total balance (income - expenses).
   * @returns {Promise<number>} - The total balance.
   */
  async getTotalBalance(): Promise<number> {
    await this.fetchData();
    return this.getTotalIncome() - this.getTotalExpense();
  }
}
