// src/services/finance.ts
import axios from 'axios';
import { load } from 'cheerio';

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
 * Asynchronously retrieves stock information for a given symbol from Google Finance.
 *
 * @param query The stock symbol or name to retrieve information for.
 * @param market The market to search in. Defaults to 'NASDAQ'.
 * @returns A promise that resolves to a Stock object containing stock information, or null if the retrieval fails.
 */
export async function getStockInfo(query: string, market: string = 'NASDAQ'): Promise<Stock | null> {
  const url = `https://www.google.com/finance/quote/${query}:${market}`;

  try {
    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/122.0.0.0 Safari/537.36",
      },
    });

    const html = response.data;
    const $ = load(html);

    // Nome completo titolo
    const name = $("div.zzDege").first().text().trim();

    // Prezzo attuale
    const price = $("div.YMlKec.fxKbKc").first().text().trim();

    // Variazione giornaliera e percentuale
    const changeText = $("div.JwB6zf").first().text().trim();
    const [change, changePercent] = changeText.split(" ");

    return {
      symbol: query, // or extract from the page if available
      name,
      price,
      change,
      changePercent,
    };
  } catch (error) {
    console.error("Errore scraping:", error.message);
    return null;
  }
}
