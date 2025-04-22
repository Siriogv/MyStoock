import { NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol');
    const market = searchParams.get('market') || 'NASDAQ'; // Default to NASDAQ if no market is specified

    if (!symbol) {
        return new NextResponse(JSON.stringify({ error: "Symbol is required" }), {
            status: 400,
            headers: { "Content-Type": "application/json" }
        });
    }

    const url = `https://www.google.com/finance/quote/${symbol}:${market}`;

    try {
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        const html = response.data;
        const $ = cheerio.load(html);

        // Extract data based on the structure of Google Finance page
        const name = $('div.zzDege').first().text().trim();
        const price = $('div.YMlKec.fxKbKc').first().text().trim();
        const changeText = $('div.JwB6zf').first().text().trim();
        const [change, changePercent] = changeText.split(' ');

        const stockInfo = {
            symbol,
            market,
            name,
            price,
            change,
            changePercent
        };

        return new NextResponse(JSON.stringify(stockInfo), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });

    } catch (error: any) {
        console.error("Error during scraping:", error);
        return new NextResponse(JSON.stringify({ error: error.message || "Failed to retrieve stock data" }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}
