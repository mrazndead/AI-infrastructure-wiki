import React from 'react';
import { Article } from '../types';
import { Clock, Tag } from 'lucide-react';

interface ArticleGridProps {
  articles: Article[];
  title: string;
  subtitle: string;
  onArticleClick?: (id: string) => void;
}

export const ArticleGrid: React.FC<ArticleGridProps> = ({ articles, title, subtitle, onArticleClick }) => {
  return (
    <section className="py-16 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">{title}</h2>
          <p className="text-slate-400 max-w-2xl">{subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <div 
              key={article.id}
              onClick={() => onArticleClick && onArticleClick(article.id)}
              className="group relative bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden hover:border-primary-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary-900/20 flex flex-col cursor-pointer"
            >
              {article.image && (
                <div className="aspect-w-16 aspect-h-9 h-48 w-full overflow-hidden shrink-0">
                  <img 
                    src={article.image} 
                    alt={article.title} 
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-60"></div>
                </div>
              )}
              
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-500/10 text-primary-400 border border-primary-500/20">
                    {article.category}
                  </span>
                  <div className="flex items-center text-slate-500 text-xs">
                    <Clock className="w-3 h-3 mr-1" />
                    {article.readTime}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-primary-400 transition-colors">
                  {article.title}
                </h3>
                <p className="text-slate-400 text-sm mb-4 line-clamp-3 flex-1">
                  {article.excerpt}
                </p>
                
                <div className="flex items-center text-slate-500 text-sm pt-4 border-t border-slate-700 mt-auto">
                  <span>{article.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};