import React, { useState } from 'react';
import { Video } from '../types';
import { Play, Clock, Eye, X, ExternalLink } from 'lucide-react';

interface YouTubeGridProps {
  videos: Video[];
}

export const YouTubeGrid: React.FC<YouTubeGridProps> = ({ videos }) => {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  const getThumbnailUrl = (id: string) => {
    return `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
  };

  return (
    <section className="py-20 bg-slate-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 mb-4">
            <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
            <span className="text-xs font-medium text-red-400 tracking-wide uppercase">Curated Library</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Engineering Talks & Deep Dives</h2>
          <p className="text-slate-400 max-w-2xl">
            A curated collection of the most influential technical talks, keynotes, and architectural breakdowns in AI infrastructure. 
            Selected for depth and engineering value.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.map((video) => (
            <div 
              key={video.id}
              onClick={() => setSelectedVideo(video)}
              className="group relative bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-red-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-red-900/10 cursor-pointer flex flex-col"
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-video w-full overflow-hidden">
                <img 
                  src={getThumbnailUrl(video.youtubeId)} 
                  alt={video.title} 
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors"></div>
                
                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                    <Play className="w-6 h-6 text-white fill-current ml-1" />
                  </div>
                </div>

                <div className="absolute bottom-3 right-3 bg-black/80 text-white text-xs px-2 py-1 rounded font-medium">
                  {video.duration}
                </div>
              </div>
              
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-start justify-between mb-3">
                   <h3 className="text-lg font-bold text-white line-clamp-2 leading-snug group-hover:text-red-400 transition-colors">
                    {video.title}
                  </h3>
                </div>
                
                <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                  {video.description}
                </p>

                <div className="mt-auto pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center text-slate-300 font-medium">
                      {video.channel}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                     <span className="flex items-center">
                      <Eye className="w-3 h-3 mr-1" />
                      {video.views}
                    </span>
                  </div>
                </div>
                
                <div className="mt-3 flex flex-wrap gap-2">
                  {video.tags.slice(0, 2).map(tag => (
                    <span key={tag} className="text-[10px] uppercase tracking-wider text-slate-500 bg-slate-800/50 px-2 py-0.5 rounded border border-slate-700">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-5xl bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900">
              <h3 className="text-lg font-medium text-white truncate pr-4">{selectedVideo.title}</h3>
              <div className="flex items-center space-x-2">
                <a 
                  href={`https://www.youtube.com/watch?v=${selectedVideo.youtubeId}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                  title="Open in YouTube"
                >
                  <ExternalLink className="w-5 h-5" />
                </a>
                <button 
                  onClick={() => setSelectedVideo(null)}
                  className="p-2 text-slate-400 hover:text-red-400 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Player Wrapper */}
            <div className="relative pt-[56.25%] bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}?autoplay=1&rel=0`}
                title={selectedVideo.title}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>

            {/* Description */}
            <div className="p-6 bg-slate-900">
               <div className="flex items-center justify-between mb-4">
                 <div className="flex items-center space-x-3">
                   <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 font-bold border border-slate-700">
                     {selectedVideo.channel.charAt(0)}
                   </div>
                   <div>
                     <div className="text-white font-medium">{selectedVideo.channel}</div>
                     <div className="text-xs text-slate-500">{selectedVideo.views} • {selectedVideo.duration}</div>
                   </div>
                 </div>
               </div>
               <p className="text-slate-300 text-sm leading-relaxed">
                 {selectedVideo.description}
               </p>
               <div className="mt-4 flex gap-2">
                  {selectedVideo.tags.map(tag => (
                    <span key={tag} className="text-xs text-primary-400 bg-primary-500/10 px-2.5 py-1 rounded-full border border-primary-500/20">
                      #{tag}
                    </span>
                  ))}
               </div>
            </div>
          </div>
          
          {/* Close on background click */}
          <div className="absolute inset-0 -z-10" onClick={() => setSelectedVideo(null)}></div>
        </div>
      )}
    </section>
  );
};