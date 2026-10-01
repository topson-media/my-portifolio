import React, { useState, useMemo, useRef } from 'react';
import { Play, Clock, X, UploadCloud, CheckCircle, ChevronDown, ChevronUp, Link as LinkIcon, Film, Maximize2 } from 'lucide-react';
import { VideoItem, User } from '../types';

interface VideoGalleryProps {
  videos: VideoItem[];
  searchQuery: string;
  currentUser?: User | null;
  onOpenAdminAuth?: () => void;
  onUploadVideo?: (video: VideoItem) => void;
  isStandalonePage?: boolean;
}

export const VideoGallery: React.FC<VideoGalleryProps> = ({
  videos,
  searchQuery,
  currentUser = null,
  onUploadVideo,
  isStandalonePage = false,
}) => {
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  
  // Track which card is playing video inline
  const [activePlayingId, setActivePlayingId] = useState<string | null>(null);

  // Track expanded descriptions per video card (hide description and hashtags by default)
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});

  const toggleCardExpansion = (videoId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedCards((prev) => ({
      ...prev,
      [videoId]: !prev[videoId],
    }));
  };

  // Upload options: link vs device
  const [uploadType, setUploadType] = useState<'link' | 'device'>('link');
  const [videoLink, setVideoLink] = useState('');
  const [selectedFileName, setSelectedFileName] = useState('');
  const [deviceFilePreviewUrl, setDeviceFilePreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'Dev Workflows' | 'Desk & Gear' | 'Full Stack'>('Dev Workflows');
  const [newDuration, setNewDuration] = useState('09:40');
  const [newDescription, setNewDescription] = useState('');
  const [localVideoList, setLocalVideoList] = useState<VideoItem[]>(videos);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  
  // Keep local list in sync with parent props
  React.useEffect(() => {
    setLocalVideoList(videos);
  }, [videos]);

  const filteredVideos = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return localVideoList;

    return localVideoList.filter((video) => {
      return (
        video.title.toLowerCase().includes(q) ||
        video.description.toLowerCase().includes(q) ||
        video.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [localVideoList, searchQuery]);

  // Display ONLY 6 cards in this section as requested; others will be displayed on YouTube
  const displayedVideos = useMemo(() => {
    return filteredVideos.slice(0, 6);
  }, [filteredVideos]);

  const handleDeviceFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFileName(file.name);
      if (!newTitle.trim()) {
        const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        setNewTitle(cleanName);
      }
      const previewUrl = URL.createObjectURL(file);
      setDeviceFilePreviewUrl(previewUrl);
    }
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const added: VideoItem = {
      id: 'vid-' + Date.now(),
      title: newTitle.trim(),
      category: newCategory,
      duration: newDuration.trim() || '10:00',
      views: '1.2K views',
      date: 'Just now',
      thumbnail: '/src/assets/images/thumb_ai_workflow_1790770861253.jpg',
      videoUrl: uploadType === 'link' ? videoLink.trim() : deviceFilePreviewUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      sourceType: uploadType,
      description: newDescription.trim() || 'Tech walkthrough on ' + newTitle.trim(),
      tags: ['Tutorial'],
    };

    if (onUploadVideo) {
      onUploadVideo(added);
    } else {
      setLocalVideoList([added, ...localVideoList]);
    }

    setNewTitle('');
    setVideoLink('');
    setSelectedFileName('');
    setDeviceFilePreviewUrl(null);
    setNewDescription('');
    setUploadSuccess(true);
    setTimeout(() => {
      setUploadSuccess(false);
      setUploadModalOpen(false);
    }, 1200);
  };

  // Helper to test if a video item is an external link
  const isVideoLink = (video: VideoItem) => {
    if (video.sourceType === 'link') return true;
    if (video.videoUrl) {
      const url = video.videoUrl.toLowerCase();
      if (url.includes('youtube.com') || url.includes('youtu.be') || url.includes('vimeo.com')) {
        return true;
      }
      if (url.startsWith('http://') || url.startsWith('https://')) {
        if (!url.endsWith('.mp4') && !url.endsWith('.webm') && !url.includes('googleapis')) {
          return true;
        }
      }
    }
    return false;
  };

  // Card click handler: If link, direct to video of that link; if video, play video
  const handleCardClick = (video: VideoItem, e?: React.MouseEvent) => {
    if (e && (e.target as HTMLElement).closest('.card-expansion-toggle')) {
      return;
    }

    if (isVideoLink(video) && video.videoUrl) {
      // "but if is a link it will display thumbnail and when click on that thumbnail direct to video of that link"
      window.open(video.videoUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    // "when press on that one card will play video"
    if (activePlayingId === video.id) {
      setActiveVideo(video);
    } else {
      setActivePlayingId(video.id);
    }
  };

  return (
    <section
      id="videos"
      className={`py-16 sm:py-20 scroll-mt-20 ${
        !isStandalonePage ? 'border-t border-neutral-200' : ''
      } bg-white`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Kicker: Clean without underlines or numbers */}
        <div className="text-xs font-bold tracking-widest uppercase text-neutral-800 mb-6">
          VIDEO GALLERY {isStandalonePage ? '· COMPLETE ARCHIVE' : ''}
        </div>

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-neutral-900 tracking-tight leading-[1.05]">
              Watch the latest tutorials
            </h2>
          </div>

          <div className="flex flex-col md:items-end gap-3">
            <p className="text-xs sm:text-sm text-neutral-700 md:text-right max-w-sm font-medium">
              Practical guides and walkthroughs. Click any card to watch.
            </p>

            {/* ONLY ADMIN CAN SEE WHERE TO UPLOAD */}
            {currentUser?.role === 'admin' && (
              <button
                type="button"
                onClick={() => setUploadModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold text-white bg-neutral-900 hover:bg-neutral-800 rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer"
              >
                <UploadCloud className="w-4 h-4 text-orange-500" />
                <span>Upload Video (Admin)</span>
              </button>
            )}
          </div>
        </div>

        {/* Videos Grid: items-start guarantees only the clicked card grows */}
        {filteredVideos.length === 0 ? (
          <div className="py-16 text-center bg-neutral-50 rounded-3xl border border-neutral-200">
            <p className="text-sm text-neutral-700 font-semibold">
              No tutorials match your search &ldquo;{searchQuery}&rdquo;.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
            {displayedVideos.map((video) => {
              const isExpanded = !!expandedCards[video.id];
              const isLink = isVideoLink(video);
              const isPlaying = activePlayingId === video.id;

              // Clean tags: Filter out words like "digital skills" as requested
              const cleanTags = video.tags.filter(
                (t) => !t.toLowerCase().includes('digital skills') && !t.toLowerCase().includes('skills')
              );

              const videoPlaybackSrc =
                video.videoUrl ||
                'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';

              return (
                <div
                  key={video.id}
                  className="group rounded-3xl overflow-hidden bg-white border border-neutral-200 shadow-sm hover:shadow-xl hover:border-orange-500/50 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Media Area: Attractive 16:9 ratio box */}
                    <div className="relative aspect-[16/9] w-full overflow-hidden bg-neutral-950">
                      {isPlaying ? (
                        /* When press on that one card will play video in 16:9 */
                        <div className="relative w-full h-full bg-black">
                          <video
                            src={videoPlaybackSrc}
                            controls
                            autoPlay
                            playsInline
                            className="w-full h-full object-contain bg-black"
                            onClick={(e) => e.stopPropagation()}
                          />
                          {/* Close/Stop video button */}
                          <div className="absolute top-2 right-2 flex items-center gap-1.5 z-20">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveVideo(video);
                              }}
                              className="p-1.5 rounded-full bg-black/70 hover:bg-neutral-800 text-white/90 hover:text-white transition-colors cursor-pointer"
                              title="Full Player"
                              aria-label="Full player"
                            >
                              <Maximize2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActivePlayingId(null);
                              }}
                              className="p-1.5 rounded-full bg-black/70 hover:bg-neutral-800 text-white/90 hover:text-white transition-colors cursor-pointer"
                              title="Stop playback"
                              aria-label="Stop playback"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* Displays 16:9 thumbnail: when clicked, if link directs to video, if video plays video */
                        <div
                          onClick={(e) => handleCardClick(video, e)}
                          className="relative w-full h-full cursor-pointer group/thumb select-none"
                        >
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-500 opacity-95"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                          {/* Duration badge */}
                          <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md text-[11px] font-semibold text-white">
                            <Clock className="w-3 h-3" />
                            <span>{video.duration}</span>
                          </div>

                          {/* Link badge vs Video badge */}
                          {isLink ? (
                            <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-600 backdrop-blur-md text-[10px] font-bold text-white shadow-md shadow-red-600/30">
                              <svg className="w-3 h-3 fill-white" viewBox="0 0 24 24">
                                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                              </svg>
                              <span>YouTube Link</span>
                            </div>
                          ) : (
                            <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md text-[10px] font-semibold text-white/95">
                              <Film className="w-3 h-3 text-orange-400" />
                              <span>Playable Video</span>
                            </div>
                          )}

                          {/* Hover action banner with smooth transition */}
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity bg-black/40 backdrop-blur-xs">
                            {isLink ? (
                              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 text-white font-bold text-xs shadow-xl transform group-hover/thumb:scale-105 transition-transform">
                                <LinkIcon className="w-4 h-4" />
                                <span>Click thumbnail to open video</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-neutral-950 font-bold text-xs shadow-xl transform group-hover/thumb:scale-105 transition-transform">
                                <Play className="w-4 h-4 fill-neutral-950 ml-0.5" />
                                <span>Press to play video</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Metadata & Title (ONLY Title displayed by default) */}
                    <div className="p-5 sm:p-6">
                      <div className="flex items-center gap-2 text-xs text-neutral-600 font-semibold mb-2.5">
                        <span>{video.date}</span>
                        <span>·</span>
                        <span>{video.views}</span>
                      </div>

                      {/* Video Title */}
                      <h3
                        onClick={(e) => handleCardClick(video, e)}
                        className="text-base sm:text-lg font-bold text-neutral-900 leading-snug hover:text-orange-600 transition-colors cursor-pointer line-clamp-2"
                      >
                        {video.title}
                      </h3>

                      {/* Description & Hashtags: Hidden by default, toggled via See more / See less */}
                      {isExpanded && (
                        <div className="mt-3.5 pt-3.5 border-t border-neutral-100 animate-in fade-in space-y-3">
                          <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed font-normal">
                            {video.description}
                          </p>

                          {cleanTags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                              {cleanTags.map((tag) => (
                                <span
                                  key={tag}
                                  className="text-[11px] font-semibold text-neutral-800 bg-neutral-100 px-2.5 py-1 rounded-lg border border-neutral-200/60"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* See more / See less Toggle Button */}
                  <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-1 card-expansion-toggle">
                    <button
                      type="button"
                      onClick={(e) => toggleCardExpansion(video.id, e)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-800 hover:text-orange-600 transition-colors cursor-pointer"
                    >
                      <span>{isExpanded ? 'See less' : 'See more'}</span>
                      {isExpanded ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* PROMINENT "VIEW MORE ON YOUTUBE" SECTION UNDER THE 6 TUTORIALS */}
        <div className="mt-14 p-8 sm:p-10 rounded-3xl bg-neutral-50 border border-neutral-200 text-center flex flex-col items-center justify-center gap-4 max-w-3xl mx-auto shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-red-600/10 text-red-600 flex items-center justify-center mb-1">
            <svg className="w-6 h-6 fill-red-600" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-neutral-900">
            Other tutorials are available on YouTube
          </h3>
          <p className="text-xs sm:text-sm text-neutral-700 max-w-md leading-relaxed font-normal">
            Showing our top 6 featured tutorials. Watch the complete library of 50+ phone guides, PC tweaks, and tech workflows on our official channel.
          </p>
          <a
            href="https://youtube.com/@topsonmedia"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-3.5 rounded-2xl font-bold text-sm sm:text-base text-white bg-[#FF0000] hover:bg-[#CC0000] active:scale-95 shadow-md shadow-red-500/25 transition-all cursor-pointer mt-1"
          >
            <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
            <span>View more on YouTube</span>
          </a>
        </div>

        {/* Video Player Modal */}
        {activeVideo && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in"
            onClick={() => setActiveVideo(null)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-3xl rounded-3xl overflow-hidden bg-neutral-950 border border-neutral-800 text-white shadow-2xl"
            >
              <button
                type="button"
                onClick={() => setActiveVideo(null)}
                className="absolute top-4 right-4 z-30 p-2 rounded-full bg-black/70 hover:bg-neutral-800 text-neutral-300 hover:text-white cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative aspect-video w-full bg-neutral-900 overflow-hidden">
                {isVideoLink(activeVideo) ? (
                  <div className="relative w-full h-full">
                    <img
                      src={activeVideo.thumbnail}
                      alt={activeVideo.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover opacity-75"
                    />
                    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center p-6 text-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-red-600 flex items-center justify-center shadow-lg">
                        <svg className="w-7 h-7 fill-white" viewBox="0 0 24 24">
                          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                        </svg>
                      </div>
                      <h4 className="text-lg font-bold text-white max-w-md">{activeVideo.title}</h4>
                      <a
                        href={activeVideo.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#FF0000] hover:bg-[#CC0000] text-white font-bold text-sm shadow-md transition-colors"
                      >
                        <LinkIcon className="w-4 h-4" />
                        <span>Open Video of this Link</span>
                      </a>
                    </div>
                  </div>
                ) : (
                  <video
                    src={
                      activeVideo.videoUrl ||
                      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
                    }
                    controls
                    autoPlay
                    playsInline
                    className="w-full h-full object-contain bg-black"
                  />
                )}
              </div>

              <div className="p-6 bg-white text-neutral-900">
                <div className="flex items-center gap-3 text-xs text-neutral-600 mb-2 font-semibold">
                  <span>{activeVideo.duration}</span>
                  <span>·</span>
                  <span>{activeVideo.views}</span>
                  <span>·</span>
                  <span>{activeVideo.date}</span>
                </div>
                <p className="text-sm text-neutral-700 leading-relaxed mb-4">
                  {activeVideo.description}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Upload Video Modal (Admin only, Paste Link OR Upload from Device) */}
        {uploadModalOpen && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in"
            onClick={() => setUploadModalOpen(false)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg rounded-3xl bg-white border border-neutral-200 p-6 sm:p-8 text-neutral-900 shadow-2xl"
            >
              <button
                type="button"
                onClick={() => setUploadModalOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-xl text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-6">
                <div className="w-10 h-10 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center mb-3">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-black text-neutral-900">Upload New Tutorial</h3>
                <p className="text-xs text-neutral-600 mt-1 font-medium">
                  Choose between pasting an external link or uploading from your local device.
                </p>
              </div>

              {uploadSuccess ? (
                <div className="py-8 text-center space-y-2 animate-in fade-in">
                  <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-neutral-900">Tutorial Uploaded!</h4>
                  <p className="text-xs text-neutral-600">
                    Your video is now live in the tutorial gallery.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleUploadSubmit} className="space-y-4">
                  {/* Upload Method Tabs */}
                  <div>
                    <label className="block text-xs font-semibold text-neutral-800 mb-1.5">
                      Upload Source <span className="text-orange-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-neutral-100">
                      <button
                        type="button"
                        onClick={() => setUploadType('link')}
                        className={`py-2 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          uploadType === 'link'
                            ? 'bg-white text-neutral-900 shadow-xs'
                            : 'text-neutral-600 hover:text-neutral-900'
                        }`}
                      >
                        <LinkIcon className="w-3.5 h-3.5" />
                        <span>Paste Video Link</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setUploadType('device')}
                        className={`py-2 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          uploadType === 'device'
                            ? 'bg-white text-neutral-900 shadow-xs'
                            : 'text-neutral-600 hover:text-neutral-900'
                        }`}
                      >
                        <Film className="w-3.5 h-3.5" />
                        <span>Upload from Device</span>
                      </button>
                    </div>
                  </div>

                  {/* Input depending on upload type */}
                  {uploadType === 'link' ? (
                    <div>
                      <label className="block text-xs font-semibold text-neutral-800 mb-1">
                        Video URL (YouTube or Web)
                      </label>
                      <input
                        type="url"
                        required
                        value={videoLink}
                        onChange={(e) => setVideoLink(e.target.value)}
                        placeholder="https://youtube.com/watch?v=..."
                        className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-white border border-neutral-300 text-neutral-900 focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="block text-xs font-semibold text-neutral-800 mb-1">
                        Select Video File
                      </label>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="video/*"
                        onChange={handleDeviceFileChange}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full py-3 px-4 rounded-xl border border-dashed border-neutral-300 hover:border-neutral-500 text-xs font-medium text-neutral-700 flex items-center justify-center gap-2 cursor-pointer bg-neutral-50"
                      >
                        <Film className="w-4 h-4 text-orange-500" />
                        <span>{selectedFileName ? selectedFileName : 'Choose MP4 or WebM video file'}</span>
                      </button>
                    </div>
                  )}

                  {/* Title */}
                  <div>
                    <label className="block text-xs font-semibold text-neutral-800 mb-1">
                      Tutorial Title <span className="text-orange-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="Title of tutorial"
                      className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-white border border-neutral-300 text-neutral-900 focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
                    />
                  </div>

                  {/* Category and Duration */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-800 mb-1">
                        Category
                      </label>
                      <select
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value as any)}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-neutral-300 text-neutral-900 focus:outline-none focus:border-neutral-900"
                      >
                        <option value="Dev Workflows">Phone Mastery</option>
                        <option value="Desk & Gear">PC Performance</option>
                        <option value="Full Stack">Creator Tools</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-800 mb-1">
                        Duration
                      </label>
                      <input
                        type="text"
                        value={newDuration}
                        onChange={(e) => setNewDuration(e.target.value)}
                        placeholder="10:00"
                        className="w-full px-3.5 py-2 text-xs rounded-xl bg-white border border-neutral-300 text-neutral-900 focus:outline-none focus:border-neutral-900"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-xs font-semibold text-neutral-800 mb-1">
                      Description
                    </label>
                    <textarea
                      rows={2}
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                      placeholder="Brief walkthrough summary"
                      className="w-full px-3.5 py-2 text-xs rounded-xl bg-white border border-neutral-300 text-neutral-900 focus:outline-none focus:border-neutral-900 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 font-bold text-xs sm:text-sm text-white bg-neutral-900 hover:bg-neutral-800 rounded-xl transition-all cursor-pointer shadow-xs active:scale-98"
                  >
                    Publish Tutorial Video
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
