import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Footer } from './components/Footer';
import { ArticleGrid } from './components/ArticleGrid';
import { WikiSidebar } from './components/WikiSidebar';
import { ArticleView } from './components/ArticleView';
import { YouTubeGrid } from './components/YouTubeGrid';
import { NvidiaPage } from './components/NvidiaPage';
import { ViewState } from './types';
import { wikiContent, getArticlesByCategory } from './data/content';
import { videoContent } from './data/videos';
import { Menu, SearchX } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.HOME);
  const [activeArticleId, setActiveArticleId] = useState<string | undefined>(undefined);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

  // Scroll to top on view change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentView, activeArticleId]);

  const categories = getArticlesByCategory();

  const handleNavigate = (view: ViewState) => {
    setCurrentView(view);
    setSearchFilter(''); // Clear search on navigation
    if (view === ViewState.WIKI && !activeArticleId) {
       // Default to first article if just switching to Wiki tab without ID
       const firstCategory = Object.keys(categories)[0];
       if (firstCategory && categories[firstCategory].length > 0) {
         setActiveArticleId(categories[firstCategory][0].id);
       }
    }
    setIsSidebarOpen(false);
  };

  const handleCategorySelect = (category: string) => {
    const articles = categories[category];
    if (articles && articles.length > 0) {
      setActiveArticleId(articles[0].id);
      setCurrentView(ViewState.WIKI);
      setSearchFilter('');
      setIsSidebarOpen(false);
    }
  };

  const handleArticleSelect = (id: string) => {
    setActiveArticleId(id);
    setCurrentView(ViewState.WIKI);
    setSearchFilter(''); // Clear search when selecting an article
    setIsSidebarOpen(false);
  };

  // Search Logic
  const searchResults = useMemo(() => {
    if (!searchFilter.trim()) return [];
    const lower = searchFilter.toLowerCase();
    return wikiContent.filter(a => 
      a.title.toLowerCase().includes(lower) || 
      a.excerpt.toLowerCase().includes(lower) ||
      a.tags.some(t => t.toLowerCase().includes(lower)) ||
      a.content.toLowerCase().includes(lower)
    );
  }, [searchFilter]);

  const renderWiki = () => {
    const activeArticle = wikiContent.find(a => a.id === activeArticleId);
    
    return (
      <div className="pt-16 min-h-screen flex">
        <WikiSidebar 
          categories={categories}
          activeArticleId={activeArticleId}
          onSelectArticle={handleArticleSelect}
          isOpen={isSidebarOpen}
          onCloseMobile={() => setIsSidebarOpen(false)}
        />
        
        <div className="flex-1 md:pl-72 bg-slate-950 min-h-screen">
          {/* Mobile Sidebar Toggle */}
          <div className="md:hidden sticky top-16 z-30 bg-slate-900/80 backdrop-blur border-b border-slate-800 p-2 px-4 flex items-center justify-between">
            <span className="text-sm font-medium text-slate-400">
              {activeArticle?.category || 'Menu'}
            </span>
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 text-slate-300 hover:bg-slate-800 rounded-md"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          {activeArticle ? (
            <ArticleView 
              article={activeArticle} 
              onArticleClick={handleArticleSelect}
            />
          ) : (
             <div className="p-12 text-center text-slate-500">
               Select an article to view content.
             </div>
          )}
        </div>
      </div>
    );
  };

  const renderContent = () => {
    // Search View
    if (searchFilter) {
       return (
          <div className="pt-24 min-h-screen bg-slate-950">
             <ArticleGrid 
              title={`Search Results for "${searchFilter}"`}
              subtitle={`${searchResults.length} articles found matching your query.`}
              articles={searchResults}
              onArticleClick={handleArticleSelect}
            />
            {searchResults.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                    <SearchX className="w-16 h-16 mb-4 opacity-50" />
                    <p className="text-lg">No results found.</p>
                    <button 
                        onClick={() => setSearchFilter('')}
                        className="mt-4 text-primary-400 hover:text-primary-300 hover:underline"
                    >
                        Clear search
                    </button>
                </div>
            )}
          </div>
       );
    }

    switch (currentView) {
      case ViewState.WIKI:
        return renderWiki();
      case ViewState.YOUTUBE:
        return (
          <div className="pt-16">
            <YouTubeGrid videos={videoContent} />
          </div>
        );
      case ViewState.NVIDIA:
        return <NvidiaPage />;
      case ViewState.BLOG:
        // Re-use ArticleGrid for Blog view but filter for 'Blog' category
        const blogPosts = wikiContent.filter(a => a.category === 'Blog');
        return (
          <div className="pt-20 min-h-screen bg-slate-950">
             <ArticleGrid 
              title="Engineering Blog" 
              subtitle="Updates from the InfraMind team and community research."
              articles={blogPosts} 
              onArticleClick={handleArticleSelect}
            />
          </div>
        );
      case ViewState.HOME:
      default:
        // Get featured articles (non-blog)
        const featured = wikiContent.filter(a => a.category !== 'Blog').slice(0, 6);
        return (
          <>
            <Hero onNavigate={(v) => handleNavigate(ViewState.WIKI)} />
            <div className="bg-slate-950">
              <ArticleGrid 
                title="Knowledge Base Highlights" 
                subtitle="Essential reading for AI Infrastructure Engineers."
                articles={featured} 
                onArticleClick={handleArticleSelect}
              />
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-primary-500 selection:text-white flex flex-col">
      <Header 
        currentView={currentView} 
        onNavigate={handleNavigate} 
        onSearch={(q) => {
            setSearchFilter(q);
            window.scrollTo(0, 0);
        }} 
        onCategorySelect={handleCategorySelect}
      />
      <main className="flex-1">
        {renderContent()}
      </main>
      <Footer onArticleClick={handleArticleSelect} />
    </div>
  );
};

export default App;