/**
 * This file contains functions to interact with financial data, such as fetching stock information.
 */
import axios, { AxiosError } from "axios";
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
export async function getStockInfo(
  query: string,
  market: string = "NASDAQ",
): Promise<Stock | null> {
  const url = `https://www.google.com/finance/quote/${query}:${market}`;
  

  try {
    // Fetch the HTML content of the stock quote page.
    const response = await axios.get(url, {
      headers: {
        // Mimic a browser's user agent to avoid being blocked by the server.
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/122.0.0.0 Safari/537.36",
      },
    });

    // Check if the request was successful.
    if (response.status !== 200) {
      throw new Error(`Request failed with status: ${response.status}`);
    }

    // Load the HTML content into Cheerio for parsing.
    const html = response.data;
    const $ = load(html);

    // Extract stock information from the page.
    const name = $("div.zzDege").first().text().trim();
    const price = $("div.YMlKec.fxKbKc").first().text().trim();
    const changeText = $("div.JwB6zf").first().text().trim();

    // Check if essential data is present.
      if (!name || !price || !changeText) {
        console.error(`Incomplete stock information found for: ${query} in ${market}`);
        return null;
      }
    
      // Split the changeText to get change and changePercent
      const [change, changePercent] = changeText.split(" ");

      return {
        symbol: query,
        name,
        price,
        change,
        changePercent,
      };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        `Error fetching stock info for ${query} in ${market} (Axios):`,
        error.message,
        error.code,
        error.response?.status,
        error.response?.data
      );
    } else if (error instanceof Error) {
      console.error(`Error fetching stock info for ${query} in ${market}:`, error.message);
    } else {
      console.error(`An unknown error occurred while fetching stock info for ${query} in ${market}`);
    }
    return null;
  }
}
