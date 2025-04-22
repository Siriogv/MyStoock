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
      console.warn("NEWS_API_KEY is not set, skipping news loading.");
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

      const portfolioStocks = ['AAPL', 'MSFT'];
      const portfolioNewsPromises = portfolioStocks.map(stock => fetchNews(stock));
      const resolvedPortfolioNews = await Promise.all(portfolioNewsPromises);

      const allPortfolioNews = resolvedPortfolioNews.flat();
      setPortfolioNews(allPortfolioNews);

    }

    loadNews();
  }, []);

  return (
    
      
        
          
        
        
          
            
              {generalNews.map((article, index) => (
                
                  
                    {article.title}
                  
                  
                    {t("Source")}: {article.source}
                  
                
              ))}
            
          
        
      
      
        
          
        
        
          
            
              {portfolioNews.length > 0 ? (
                portfolioNews.map((article, index) => (
                  
                    
                      {article.title}
                    
                    
                      {t("Source")}: {article.source}
                    
                  
                ))
              ) : (
                
                  {t("No news found for your portfolio stocks.")}
                
              )}
            
          
        
      
    
  );
};
