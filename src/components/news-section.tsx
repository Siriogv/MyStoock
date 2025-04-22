"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useI18n } from "@/hooks/use-i18n";

interface NewsArticle {
  title: string;
  link: string;
  source: string;
}

async function fetchNews(query: string = "finance") {
  try {
    const apiKey = process.env.NEWS_API_KEY;
    if (!apiKey) {
      console.error("NEWS_API_KEY is not set in environment variables.");
      return [];
    }
    const url = `https://newsapi.org/v2/everything?q=${query}&apiKey=${apiKey}`;
    const response = await fetch(url);

    if (!response.ok) {
      console.error(`Failed to fetch news for ${query}: ${response.status} ${response.statusText}`);
      return [];
    }

    const data = await response.json();
    if (data.status === "ok" && data.articles) {
      return data.articles.map((article: any) => ({
        title: article.title,
        link: article.url,
        source: article.source.name,
      }));
    } else {
      console.error(`No articles found for ${query}`);
      return [];
    }
  } catch (error) {
    console.error(`Error fetching news for ${query}:`, error);
    return [];
  }
}

export const NewsSection = () => {
  const [generalNews, setGeneralNews] = useState<NewsArticle[]>([]);
  const [portfolioNews, setPortfolioNews] = useState<NewsArticle[]>([]);
    const {t} = useI18n();

  useEffect(() => {
    async function loadNews() {
      const apiKey = process.env.NEWS_API_KEY;
      if (!apiKey) {
        console.warn("NEWS_API_KEY is not set, skipping news loading.");
        return;
      }

      const initialGeneralNews = await fetchNews();
      setGeneralNews(initialGeneralNews);

      // TODO: Replace with actual portfolio stocks from user data
      const portfolioStocks = ['AAPL', 'MSFT'];
      const portfolioNewsPromises = portfolioStocks.map(stock => fetchNews(stock));
      const resolvedPortfolioNews = await Promise.all(portfolioNewsPromises);

      // Flatten the array of arrays into a single array
      const allPortfolioNews = resolvedPortfolioNews.flat();
      setPortfolioNews(allPortfolioNews);

    }

    loadNews();
  }, []);

  return (
    <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>{t("General Finance News")}</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[300px] w-full">
            <div className="p-4">
              {generalNews.map((article, index) => (
                <div key={index} className="mb-4">
                  <a href={article.link} target="_blank" rel="noopener noreferrer" className="text-sm hover:underline">
                    {article.title}
                  </a>
                  <p className="text-xs text-muted-foreground">{t("Source")}: {article.source}</p>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("Portfolio Stocks News")}</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[300px] w-full">
            <div className="p-4">
              {portfolioNews.length > 0 ? (
                portfolioNews.map((article, index) => (
                  <div key={index} className="mb-4">
                    <a href={article.link} target="_blank" rel="noopener noreferrer" className="text-sm hover:underline">
                      {article.title}
                    </a>
                    <p className="text-xs text-muted-foreground">{t("Source")}: {article.source}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">{t("No news found for your portfolio stocks.")}</p>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

