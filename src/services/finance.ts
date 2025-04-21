/ src/services/finance.ts
import axios from 'axios';
import * as cheerio from 'cheerio';

/**
 * Represents stock information.
 */
export interface Stock {
  /**
   * The stock symbol.
   */
  symbol: string;
  /**
   * The name of the company.
   */
  name: string;
  /**
   * The current price of the stock.
   */
  price: string;
  /**
   * The change in price.
   */
  change: string;
  /**
   * The percentage change in price since the previous close.
   */
  changePercent: string;
}

/**
 * Asynchronously retrieves stock information for a given symbol and market from Google Finance.
 *
 * @param symbol The stock symbol to retrieve information for.
 * @param market The market or exchange where the stock is traded.
 * @returns A promise that resolves to a Stock object containing stock information, or null if the retrieval fails.
 */
export async function getStockInfo(symbol: string, market: string = 'NASDAQ'): Promise<Stock | null> {
  try {
    const url = `https://www.google.com/finance/quote/${symbol}:${market}`;
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
      }
    });

    const html = response.data;
    const $ = cheerio.load(html);

    // Extract data based on Google Finance's current HTML structure
    const name = $('div.zzDege').text().trim();
    const price = $('div.YMlKec.fxKbKc').text().trim();
    const changeText = $('div.JwB6zf').text().trim();
    const [change, changePercent] = changeText.split(' ');

    return {
      symbol: symbol,
      name: name,
      price: price,
      change: change,
      changePercent: changePercent,
      market: market
    };
  } catch (error) {
    console.error('Error fetching stock info:', error);
    return null;
  }
}

