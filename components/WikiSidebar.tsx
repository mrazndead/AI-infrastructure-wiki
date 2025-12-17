import React from 'react';
import { Article } from '../types';
import { ChevronRight, Book, Hash } from 'lucide-react';

interface WikiSidebarProps {
  categories: Record<string, Article[]>;
  activeArticleId?: string;
  onSelectArticle: (id: string) => void;
  isOpen: boolean;
  onCloseMobile: () => void;
}

export const WikiSidebar: React.FC<WikiSidebarProps> = ({ 
  categories, 
  activeArticleId, 
  onSelectArticle,
  isOpen,
  onCloseMobile
}) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside className={`
        fixed top-16 left-0 bottom-0 w-72 bg-slate-950 border-r border-slate-800 
        overflow-y-auto transition-transform duration-300 z-40
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-4">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-2">
            Knowledge Base
          </div>
          
          <div className="space-y-6">
            {Object.entries(categories).map(([category, articles]) => {
              if (category === 'Blog') return null; // Skip blog in wiki nav
              return (
                <div key={category}>
                  <div className="flex items-center text-slate-200 font-medium mb-2 px-2">
                    <Book className="w-4 h-4 mr-2 text-primary-500" />
                    {category}
                  </div>
                  <ul className="space-y-1 border-l border-slate-800 ml-4 pl-2">
                    {(articles as Article[]).map(article => (
                      <li key={article.id}>
                        <button
                          onClick={() => {
                            onSelectArticle(article.id);
                            onCloseMobile();
                          }}
                          className={`
                            text-sm text-left w-full py-1.5 px-2 rounded-md transition-colors flex items-start
                            ${activeArticleId === article.id 
                              ? 'text-primary-400 bg-primary-500/10 font-medium' 
                              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'}
                          `}
                        >
                          <span className="mt-1 mr-2 opacity-50"><ChevronRight className="w-3 h-3" /></span>
                          <span className="line-clamp-1">{article.title}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </aside>
    </>
  );
};