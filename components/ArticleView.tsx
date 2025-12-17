import React from 'react';
import { Article } from '../types';
import { Calendar, Clock, Tag, Share2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { InfraChart } from './charts/InfraCharts';

interface ArticleViewProps {
  article: Article;
  onArticleClick?: (id: string) => void;
}

export const ArticleView: React.FC<ArticleViewProps> = ({ article, onArticleClick }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
      {/* Header */}
      <div className="mb-8 border-b border-slate-800 pb-8">
        <div className="flex items-center space-x-2 text-primary-400 text-sm font-medium mb-4">
          <span>{article.category}</span>
          {article.subcategory && (
            <>
              <span>/</span>
              <span>{article.subcategory}</span>
            </>
          )}
        </div>
        
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
          {article.title}
        </h1>
        
        <div className="flex flex-wrap items-center gap-6 text-slate-500 text-sm">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            {article.date}
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            {article.readTime}
          </div>
          <button className="flex items-center hover:text-white transition-colors">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="prose prose-invert prose-lg max-w-none prose-headings:text-white prose-p:text-slate-300 prose-a:text-primary-400 prose-strong:text-white prose-code:text-primary-300 prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-800">
        <ReactMarkdown
          components={{
             h1: ({node, ...props}) => <h2 className="text-3xl font-bold mt-12 mb-6 text-white" {...props} />, // Map h1 to h2 style in body
             h2: ({node, ...props}) => <h2 className="text-2xl font-semibold mt-10 mb-4 text-white border-l-4 border-primary-500 pl-4" {...props} />,
             blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-accent-500 bg-slate-900/50 p-4 rounded-r italic text-slate-300 my-6" {...props} />,
             a: ({node, href, children, ...props}) => {
                if (href?.startsWith('#article:')) {
                  const id = href.replace('#article:', '');
                  return (
                    <button 
                      onClick={() => {
                        if (onArticleClick) {
                          onArticleClick(id);
                          window.scrollTo(0, 0);
                        }
                      }} 
                      className="text-primary-400 hover:text-primary-300 hover:underline font-medium inline-block text-left"
                    >
                      {children}
                    </button>
                  );
                }
                return <a href={href} className="text-primary-400 hover:text-primary-300 hover:underline" target="_blank" rel="noopener noreferrer" {...props}>{children}</a>
             }
          }}
        >
          {article.content}
        </ReactMarkdown>
      </div>

      {/* Embedded Chart */}
      {article.chartData && (
        <div className="my-12">
           <InfraChart config={article.chartData} />
        </div>
      )}

      {/* Footer / Tags */}
      <div className="mt-12 pt-8 border-t border-slate-800">
        <div className="flex flex-wrap gap-2">
          {article.tags.map(tag => (
            <span key={tag} className="inline-flex items-center px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-sm border border-slate-700">
              <Tag className="w-3 h-3 mr-2 text-primary-500" />
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};