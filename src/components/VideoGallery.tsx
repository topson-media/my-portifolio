import React, { useState, useMemo, useRef } from 'react';
import {
  Play,
  Clock,
  X,
  UploadCloud,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Link as LinkIcon,
  Film,
  Maximize2,
  Trash2,
  Edit3,
  Save,
  Check
} from 'lucide-react';
import { VideoItem, User } from '../types';
import { getYouTubeThumbnail } from '../utils/youtubeHelper';

interface VideoGalleryProps {
  videos: VideoItem[];
  searchQuery: string;
  currentUser?: User | null;
  onOpenAdminAuth?: () => void;
  onUploadVideo?: (video: VideoItem) => void;
  onDeleteVideo?: (videoId: string) => void;
  onUpdateVideo?: (video: VideoItem) => void;
  isStandalonePage?: boolean;
}

export const VideoGallery: React.FC<VideoGalleryProps> = ({
  videos,
  searchQuery,
  currentUser = null,
  onUploadVideo,
  onDeleteVideo,
  onUpdateVideo,
  isStandalonePage = false,
}) => {
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const scrollRowRef = useRef<HTMLDivElement>(null);

  const handleScrollLeft = () => {
    scrollRowRef.current?.scrollBy({ left: -280, behavior: 'smooth' });
  };

  const handleScrollRight = () => {
    scrollRowRef.current?.scrollBy({ left: 280, behavior: 'smooth' });
  };

  // Edit Video Modal state
  const [editingVideo, setEditingVideo] = useState<VideoItem | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState<string>('Phone Mastery');
  const [editDuration, setEditDuration] = useState('');
  const [editViews, setEditViews] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editThumbnail, setEditThumbnail] = useState('');
  const [editVideoUrl, setEditVideoUrl] = useState('');
  const [editTags, setEditTags] = useState('');
  const [editSaveSuccess, setEditSaveSuccess] = useState(false);
  
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
  const [newCategory, setNewCategory] = useState<string>('Phone Mastery');
  const [newDuration, setNewDuration] = useState('09:40');
  const [newDescription, setNewDescription] = useState('');
  const [localVideoList, setLocalVideoList] = useState<VideoItem[]>(videos);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Auto YouTube thumbnail detection in gallery modal
  const detectedYouTubeThumb = useMemo(() => {
    if (uploadType === 'link' && videoLink) {
      return getYouTubeThumbnail(videoLink);
    }
    return null;
  }, [uploadType, videoLink]);
  
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

    // Automatic YouTube thumbnail extraction when pasting a link in modal
    const autoYtThumb = uploadType === 'link' ? getYouTubeThumbnail(videoLink.trim()) : null;
    const finalThumbnail = autoYtThumb || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80';

    const added: VideoItem = {
      id: 'vid-' + Date.now(),
      title: newTitle.trim(),
      category: newCategory,
      duration: newDuration.trim() || '10:00',
      views: '1.2K views',
      date: 'Just now',
      thumbnail: finalThumbnail,
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

  const handleOpenEditVideo = (video: VideoItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingVideo(video);
    setEditTitle(video.title);
    setEditCategory(video.category);
    setEditDuration(video.duration);
    setEditViews(video.views);
    setEditDate(video.date || 'Just now');
    setEditDescription(video.description);
    setEditThumbnail(video.thumbnail);
    setEditVideoUrl(video.videoUrl || '');
    setEditTags(video.tags.join(', '));
    setEditSaveSuccess(false);
  };

  const handleSaveEditVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVideo) return;

    const autoYt = getYouTubeThumbnail(editVideoUrl);
    const finalThumb = editThumbnail || autoYt || editingVideo.thumbnail;

    const updated: VideoItem = {
      ...editingVideo,
      title: editTitle.trim() || editingVideo.title,
      category: editCategory,
      duration: editDuration.trim() || editingVideo.duration,
      views: editViews.trim() || editingVideo.views,
      date: editDate.trim() || editingVideo.date,
      description: editDescription.trim() || editingVideo.description,
      thumbnail: finalThumb,
      videoUrl: editVideoUrl.trim() || editingVideo.videoUrl,
      sourceType: editVideoUrl ? 'link' : editingVideo.sourceType,
      tags: editTags
        ? editTags.split(',').map((t) => t.trim()).filter(Boolean)
        : editingVideo.tags,
    };

    if (onUpdateVideo) {
      onUpdateVideo(updated);
    } else {
      setLocalVideoList((prev) => prev.map((v) => (v.id === updated.id ? updated : v)));
    }

    setEditSaveSuccess(true);
    setTimeout(() => {
      setEditSaveSuccess(false);
      setEditingVideo(null);
    }, 900);
  };

  const handleDeleteVideoConfirm = (video: VideoItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (window.confirm(`Delete tutorial "${video.title}"?`)) {
      if (onDeleteVideo) {
        onDeleteVideo(video.id);
      } else {
        setLocalVideoList((prev) => prev.filter((v) => v.id !== video.id));
      }
    }
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
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-neutral-900 tracking-tight leading-[1.05]">
              Watch the latest tutorials
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 mt-1 font-medium">
              Practical guides and walkthroughs. Click any card to watch.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Horizontal Scroll Navigation Arrows */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleScrollLeft}
                className="w-9 h-9 rounded-xl border border-neutral-200 hover:border-neutral-900 bg-white hover:bg-neutral-50 flex items-center justify-center text-neutral-700 hover:text-neutral-950 transition-colors shadow-2xs cursor-pointer"
                aria-label="Scroll left"
                title="Previous tutorials"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleScrollRight}
                className="w-9 h-9 rounded-xl border border-neutral-200 hover:border-neutral-900 bg-white hover:bg-neutral-50 flex items-center justify-center text-neutral-700 hover:text-neutral-950 transition-colors shadow-2xs cursor-pointer"
                aria-label="Scroll right"
                title="Next tutorials"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* ONLY ADMIN CAN SEE WHERE TO UPLOAD */}
            {currentUser?.role === 'admin' && (
              <button
                type="button"
                onClick={() => setUploadModalOpen(true)}
                className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-white bg-neutral-900 hover:bg-neutral-800 rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer shrink-0"
              >
                <UploadCloud className="w-3.5 h-3.5 text-orange-500" />
                <span>Upload Video (Admin)</span>
              </button>
            )}
          </div>
        </div>

        {/* ONE LINE OF TUTORIALS WITH SMALL CARDS */}
        {filteredVideos.length === 0 ? (
          <div className="py-14 text-center bg-neutral-50 rounded-3xl border border-neutral-200 p-8 max-w-lg mx-auto space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-neutral-200/80 text-neutral-500 mx-auto flex items-center justify-center">
              <Film className="w-6 h-6 text-neutral-500" />
            </div>
            <h3 className="text-base font-bold text-neutral-900">
              {searchQuery ? `No tutorials match "${searchQuery}"` : 'No tutorial videos added yet'}
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              {searchQuery
                ? 'Try a different search keyword or clear the search bar.'
                : currentUser?.role === 'admin'
                ? 'Your video gallery is in a clean slate. Click "Upload Video" above to publish your first video.'
                : 'Topson Media is preparing new phone & PC walkthroughs. Check back soon!'}
            </p>
            {currentUser?.role === 'admin' && !searchQuery && (
              <button
                type="button"
                onClick={() => setUploadModalOpen(true)}
                className="mt-1 inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-neutral-900 hover:bg-neutral-800 rounded-xl transition-all shadow-xs cursor-pointer"
              >
                <UploadCloud className="w-3.5 h-3.5 text-orange-400" />
                <span>Upload First Video</span>
              </button>
            )}
          </div>
        ) : (
          <div
            ref={scrollRowRef}
            className="flex flex-nowrap items-stretch gap-3 sm:gap-4 overflow-x-auto pb-4 pt-1 px-1 custom-scrollbar snap-x snap-mandatory scroll-smooth"
          >
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
                  className="snap-start shrink-0 w-[220px] sm:w-[240px] md:w-[250px] group rounded-2xl overflow-hidden bg-white border border-neutral-200 shadow-2xs hover:shadow-lg hover:border-orange-500/50 hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    {/* Media Area: Compact 16:9 ratio */}
                    <div className="relative aspect-[16/9] w-full overflow-hidden bg-neutral-950">
                      {isPlaying ? (
                        <div className="relative w-full h-full bg-black">
                          <video
                            src={videoPlaybackSrc}
                            controls
                            autoPlay
                            playsInline
                            className="w-full h-full object-contain bg-black"
                            onClick={(e) => e.stopPropagation()}
                          />
                          <div className="absolute top-2 right-2 flex items-center gap-1 z-20">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveVideo(video);
                              }}
                              className="p-1 rounded-full bg-black/70 hover:bg-neutral-800 text-white transition-colors cursor-pointer"
                              title="Full Player"
                              aria-label="Full player"
                            >
                              <Maximize2 className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActivePlayingId(null);
                              }}
                              className="p-1 rounded-full bg-black/70 hover:bg-neutral-800 text-white transition-colors cursor-pointer"
                              title="Stop playback"
                              aria-label="Stop playback"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div
                          onClick={(e) => handleCardClick(video, e)}
                          className="relative w-full h-full cursor-pointer group/thumb select-none"
                        >
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-300 opacity-95"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

                          {/* Duration badge */}
                          <div className="absolute bottom-2 right-2 flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-semibold text-white">
                            <Clock className="w-2.5 h-2.5" />
                            <span>{video.duration}</span>
                          </div>

                          {/* Link badge vs Video badge */}
                          {isLink ? (
                            <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded bg-red-600 text-[9px] font-bold text-white shadow-sm">
                              <svg className="w-2.5 h-2.5 fill-white" viewBox="0 0 24 24">
                                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                              </svg>
                              <span>YouTube</span>
                            </div>
                          ) : (
                            <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded bg-black/75 text-[9px] font-semibold text-white">
                              <Film className="w-2.5 h-2.5 text-orange-400" />
                              <span>Video</span>
                            </div>
                          )}

                          {/* Hover action banner */}
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity bg-black/40">
                            {isLink ? (
                              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 text-white font-bold text-[11px] shadow-md">
                                <LinkIcon className="w-3 h-3" />
                                <span>Open Video</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-neutral-950 font-bold text-[11px] shadow-md">
                                <Play className="w-3 h-3 fill-neutral-950 ml-0.5" />
                                <span>Play</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Metadata & Title */}
                    <div className="p-3 sm:p-3.5">
                      <div className="flex items-center gap-2 text-[10px] text-neutral-500 font-semibold mb-1">
                        <span>{video.date}</span>
                        <span>·</span>
                        <span>{video.views}</span>
                      </div>

                      <h3
                        onClick={(e) => handleCardClick(video, e)}
                        className="text-xs sm:text-sm font-bold text-neutral-900 leading-snug hover:text-orange-600 transition-colors cursor-pointer line-clamp-2"
                        title={video.title}
                      >
                        {video.title}
                      </h3>

                      {isExpanded && (
                        <div className="mt-2.5 pt-2.5 border-t border-neutral-100 animate-in fade-in space-y-2">
                          <p className="text-[11px] text-neutral-600 leading-relaxed">
                            {video.description}
                          </p>

                          {cleanTags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {cleanTags.map((tag) => (
                                <span
                                  key={tag}
                                  className="text-[10px] font-semibold text-neutral-700 bg-neutral-100 px-2 py-0.5 rounded-md"
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

                  {/* See more / See less Toggle Button & Admin Quick Actions */}
                  <div className="px-3 pb-3 pt-1 flex items-center justify-between card-expansion-toggle border-t border-neutral-100/60">
                    <button
                      type="button"
                      onClick={(e) => toggleCardExpansion(video.id, e)}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-neutral-700 hover:text-orange-600 transition-colors cursor-pointer"
                    >
                      <span>{isExpanded ? 'Less' : 'More'}</span>
                      {isExpanded ? (
                        <ChevronUp className="w-3 h-3" />
                      ) : (
                        <ChevronDown className="w-3 h-3" />
                      )}
                    </button>

                    {/* Admin Edit & Delete Actions */}
                    {currentUser?.role === 'admin' && (
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={(e) => handleOpenEditVideo(video, e)}
                          className="px-2 py-0.5 rounded-md bg-neutral-100 hover:bg-neutral-200 text-neutral-800 hover:text-orange-600 text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                          title="Edit all details"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleDeleteVideoConfirm(video, e)}
                          className="p-1 rounded-md bg-red-50 hover:bg-red-100 text-red-600 transition-colors cursor-pointer text-[11px] font-bold"
                          title="Delete tutorial"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
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
            href="https://www.youtube.com/@topson-media1"
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
                        value={videoLink ?? ''}
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
                      value={newTitle ?? ''}
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
                        value={newCategory ?? 'Phone Mastery'}
                        onChange={(e) => setNewCategory(e.target.value as any)}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-neutral-300 text-neutral-900 focus:outline-none focus:border-neutral-900"
                      >
                        <option value="Phone Mastery">Phone (Phone Mastery)</option>
                        <option value="PC Performance">PC (PC Performance)</option>
                        <option value="Digital & Web">Digital (Digital Skills & Web)</option>
                        <option value="Dev Workflows">Dev Workflows</option>
                        <option value="Desk & Gear">Desk & Gear</option>
                        <option value="Full Stack">Full Stack</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-800 mb-1">
                        Duration
                      </label>
                      <input
                        type="text"
                        value={newDuration ?? ''}
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
                      value={newDescription ?? ''}
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

        {/* Edit Video Modal (Admin can change all details & delete) */}
        {editingVideo && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in"
            onClick={() => setEditingVideo(null)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-xl rounded-3xl bg-white border border-neutral-200 p-6 sm:p-8 text-neutral-900 shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                <h3 className="text-lg font-black text-neutral-900 flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-orange-500" />
                  <span>Edit Tutorial Details</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setEditingVideo(null)}
                  className="p-1 rounded-lg text-neutral-400 hover:text-neutral-900 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {editSaveSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>All details saved successfully!</span>
                </div>
              )}

              <form onSubmit={handleSaveEditVideo} className="space-y-3.5 text-xs sm:text-sm">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Tutorial Title
                  </label>
                  <input
                    type="text"
                    required
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-neutral-900 text-xs sm:text-sm focus:outline-none focus:border-neutral-900"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      Category
                    </label>
                    <select
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-neutral-900 text-xs sm:text-sm focus:outline-none focus:border-neutral-900"
                    >
                      <option value="Dev Workflows">Phone Mastery</option>
                      <option value="Desk & Gear">PC Performance</option>
                      <option value="Full Stack">Digital Skills</option>
                      <option value="AI Tools">AI Tools</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      Duration
                    </label>
                    <input
                      type="text"
                      value={editDuration}
                      onChange={(e) => setEditDuration(e.target.value)}
                      placeholder="11:45"
                      className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-neutral-900 text-xs sm:text-sm focus:outline-none focus:border-neutral-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      Views Count
                    </label>
                    <input
                      type="text"
                      value={editViews}
                      onChange={(e) => setEditViews(e.target.value)}
                      placeholder="1.8K views"
                      className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-neutral-900 text-xs sm:text-sm focus:outline-none focus:border-neutral-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      Date
                    </label>
                    <input
                      type="text"
                      value={editDate}
                      onChange={(e) => setEditDate(e.target.value)}
                      placeholder="Just now"
                      className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-neutral-900 text-xs sm:text-sm focus:outline-none focus:border-neutral-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Video / YouTube Link URL
                  </label>
                  <input
                    type="url"
                    value={editVideoUrl}
                    onChange={(e) => {
                      setEditVideoUrl(e.target.value);
                      const auto = getYouTubeThumbnail(e.target.value);
                      if (auto) setEditThumbnail(auto);
                    }}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-neutral-900 text-xs sm:text-sm focus:outline-none focus:border-neutral-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Thumbnail Image URL
                  </label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={editThumbnail}
                      onChange={(e) => setEditThumbnail(e.target.value)}
                      className="flex-1 px-3.5 py-2.5 rounded-xl border border-neutral-300 text-neutral-900 text-xs sm:text-sm focus:outline-none focus:border-neutral-900"
                    />
                    {editThumbnail && (
                      <div className="w-14 h-9 rounded-lg overflow-hidden bg-black border border-neutral-300 shrink-0">
                        <img src={editThumbnail} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-neutral-900 text-xs sm:text-sm focus:outline-none focus:border-neutral-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    value={editTags}
                    onChange={(e) => setEditTags(e.target.value)}
                    placeholder="Phone Mastery, Speed, Android"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-neutral-900 text-xs sm:text-sm focus:outline-none focus:border-neutral-900"
                  />
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
                  <button
                    type="button"
                    onClick={() => {
                      handleDeleteVideoConfirm(editingVideo);
                      setEditingVideo(null);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Video</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingVideo(null)}
                      className="px-4 py-2.5 rounded-xl border border-neutral-300 text-neutral-700 font-bold text-xs hover:bg-neutral-100 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                    >
                      <Save className="w-3.5 h-3.5 text-orange-500" />
                      <span>Save All Changes</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
