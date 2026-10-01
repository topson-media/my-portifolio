import React, { useState, useRef } from 'react';
import { ShieldCheck, UploadCloud, ArrowLeft, Plus, CheckCircle, Link as LinkIcon, HardDrive, Film } from 'lucide-react';
import { User, VideoItem, FeedbackItem } from '../types';
import { TOPSON_PROFILE_IMAGE } from '../data/mockData';

interface AdminDashboardProps {
  currentUser: User | null;
  videos: VideoItem[];
  feedbacks: FeedbackItem[];
  onUploadVideo: (video: VideoItem) => void;
  onAdminLogin: () => void;
  onNavigateHome: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  videos,
  feedbacks,
  onUploadVideo,
  onAdminLogin,
  onNavigateHome,
}) => {
  const [uploadType, setUploadType] = useState<'link' | 'device'>('link');
  const [videoLink, setVideoLink] = useState('');
  const [selectedFileName, setSelectedFileName] = useState('');
  const [deviceFilePreviewUrl, setDeviceFilePreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [videoTitle, setVideoTitle] = useState('');
  const [videoCategory, setVideoCategory] = useState<'Dev Workflows' | 'Desk & Gear' | 'Full Stack'>('Dev Workflows');
  const [videoDescription, setVideoDescription] = useState('');
  const [videoDuration, setVideoDuration] = useState('11:45');
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const isAdmin = currentUser?.role === 'admin';

  const handleDeviceFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFileName(file.name);
      if (!videoTitle.trim()) {
        const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        setVideoTitle(cleanName);
      }
      const previewUrl = URL.createObjectURL(file);
      setDeviceFilePreviewUrl(previewUrl);
    }
  };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoTitle.trim()) return;

    const categoryTag =
      videoCategory === 'Dev Workflows'
        ? 'Phone Mastery'
        : videoCategory === 'Desk & Gear'
        ? 'PC Performance'
        : 'Digital Skills';

    const newVid: VideoItem = {
      id: 'vid-' + Date.now(),
      title: videoTitle.trim(),
      category: videoCategory,
      duration: videoDuration.trim() || '10:00',
      views: '1.5K views',
      date: 'Just now',
      thumbnail: '/src/assets/images/thumb_ai_workflow_1790770861253.jpg',
      videoUrl: uploadType === 'link' ? videoLink.trim() : deviceFilePreviewUrl || '',
      sourceType: uploadType,
      description: videoDescription.trim() || `Practical guide on ${videoTitle.trim()}`,
      tags: [categoryTag, uploadType === 'device' ? 'From Device' : 'Web Link'],
    };

    onUploadVideo(newVid);
    setVideoTitle('');
    setVideoLink('');
    setSelectedFileName('');
    setDeviceFilePreviewUrl(null);
    setVideoDescription('');
    setUploadSuccess(true);
    setTimeout(() => setUploadSuccess(false), 3000);
  };

  return (
    <div className="py-10 sm:py-14 bg-white min-h-[calc(100vh-5rem)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <button
            type="button"
            onClick={onNavigateHome}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-neutral-700 hover:text-neutral-950 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-100 text-neutral-900 border border-neutral-200 text-xs font-bold">
            <ShieldCheck className="w-4 h-4 text-orange-500" />
            <span>Admin Creator Studio</span>
          </div>
        </div>

        {isAdmin ? (
          /* ADMIN LOGGED IN: Full Dashboard & Video Upload */
          <div className="space-y-8 animate-in fade-in">
            
            {/* Top Admin Identity Banner */}
            <div className="rounded-3xl p-6 sm:p-8 bg-white border border-neutral-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full overflow-hidden border border-neutral-300 bg-white shrink-0">
                  <img
                    src={TOPSON_PROFILE_IMAGE}
                    alt="Topson Media"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-black text-neutral-900">
                      Topson Media
                    </h2>
                    <span className="px-2 py-0.5 rounded-md bg-neutral-900 text-white text-[10px] font-bold uppercase tracking-wider">
                      Admin
                    </span>
                  </div>
                  <p className="text-xs text-neutral-600 mt-1 font-medium">
                    Logged in as Primary Channel Creator · Upload tutorials via link or device
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-right">
                <div className="border-r border-neutral-200 pr-4">
                  <div className="text-xl font-black text-neutral-900">
                    {videos.length}
                  </div>
                  <div className="text-[11px] font-bold text-neutral-500 uppercase">
                    Videos
                  </div>
                </div>
                <div>
                  <div className="text-xl font-black text-neutral-900">
                    {feedbacks.length}
                  </div>
                  <div className="text-[11px] font-bold text-neutral-500 uppercase">
                    Reviews
                  </div>
                </div>
              </div>
            </div>

            {/* Main Action: UPLOAD VIDEO (Admin Only Feature) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left (7 cols): Upload Form */}
              <div className="lg:col-span-7 rounded-3xl p-6 sm:p-8 bg-white border border-neutral-200 shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                  <UploadCloud className="w-5 h-5 text-orange-500" />
                  <span className="text-xs font-bold text-neutral-600 uppercase tracking-wider">
                    Upload Tutorial
                  </span>
                </div>
                <h3 className="text-xl font-black text-neutral-900 mb-1">
                  Publish Video
                </h3>
                <p className="text-xs text-neutral-600 mb-6 font-medium">
                  Paste a link or select a video file directly from your device.
                </p>

                {uploadSuccess && (
                  <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-bold flex items-center gap-2 animate-in fade-in">
                    <CheckCircle className="w-4 h-4 shrink-0" />
                    <span>Tutorial published successfully to the global gallery!</span>
                  </div>
                )}

                <form onSubmit={handleUpload} className="space-y-4">
                  
                  {/* Selector: Paste Video Link vs Upload from Device */}
                  <div className="grid grid-cols-2 gap-2 p-1 bg-neutral-100 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setUploadType('link')}
                      className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        uploadType === 'link'
                          ? 'bg-white text-neutral-900 shadow-2xs'
                          : 'text-neutral-600 hover:text-neutral-950'
                      }`}
                    >
                      <LinkIcon className="w-3.5 h-3.5" />
                      <span>Paste Video Link</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setUploadType('device')}
                      className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        uploadType === 'device'
                          ? 'bg-white text-neutral-900 shadow-2xs'
                          : 'text-neutral-600 hover:text-neutral-950'
                      }`}
                    >
                      <HardDrive className="w-3.5 h-3.5" />
                      <span>Upload from Device</span>
                    </button>
                  </div>

                  {/* Dual Video Input based on chosen method */}
                  {uploadType === 'link' ? (
                    <div>
                      <label className="block text-xs font-bold text-neutral-800 mb-1">
                        Video URL / Link
                      </label>
                      <input
                        type="url"
                        required
                        value={videoLink}
                        onChange={(e) => setVideoLink(e.target.value)}
                        placeholder="https://youtube.com/watch?v=..."
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-neutral-300 text-neutral-900 placeholder:text-neutral-500 text-xs sm:text-sm focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="block text-xs font-bold text-neutral-800 mb-1">
                        Video File from Device
                      </label>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="video/*,.mp4,.mov,.webm"
                        onChange={handleDeviceFileChange}
                        className="hidden"
                      />
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full p-4 rounded-xl border-2 border-dashed border-neutral-300 hover:border-neutral-500 bg-neutral-50 text-center cursor-pointer transition-colors"
                      >
                        <Film className="w-6 h-6 mx-auto mb-2 text-neutral-500" />
                        {selectedFileName ? (
                          <div className="text-xs font-bold text-neutral-900">
                            Selected file: {selectedFileName}
                          </div>
                        ) : (
                          <div>
                            <span className="text-xs font-bold text-neutral-900">
                              Click to choose video from phone or PC
                            </span>
                            <p className="text-[11px] text-neutral-500 mt-0.5">MP4, WebM, MOV supported</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-neutral-800 mb-1">
                      Tutorial Title
                    </label>
                    <input
                      type="text"
                      required
                      value={videoTitle}
                      onChange={(e) => setVideoTitle(e.target.value)}
                      placeholder="Title of tutorial"
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-neutral-300 text-neutral-900 placeholder:text-neutral-500 text-xs sm:text-sm focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-800 mb-1">
                        Category
                      </label>
                      <select
                        value={videoCategory}
                        onChange={(e) => setVideoCategory(e.target.value as any)}
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-neutral-300 text-neutral-900 text-xs sm:text-sm focus:outline-none focus:border-neutral-900"
                      >
                        <option value="Dev Workflows">Phone Mastery (Android/iOS)</option>
                        <option value="Desk & Gear">PC Performance (Win/Mac)</option>
                        <option value="Full Stack">Digital Skills & Tools</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-800 mb-1">
                        Duration
                      </label>
                      <input
                        type="text"
                        value={videoDuration}
                        onChange={(e) => setVideoDuration(e.target.value)}
                        placeholder="10:30"
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-neutral-300 text-neutral-900 text-xs sm:text-sm focus:outline-none focus:border-neutral-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-800 mb-1">
                      Description & Takeaways
                    </label>
                    <textarea
                      rows={2}
                      value={videoDescription}
                      onChange={(e) => setVideoDescription(e.target.value)}
                      placeholder="Brief walkthrough summary"
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-neutral-300 text-neutral-900 placeholder:text-neutral-500 text-xs sm:text-sm focus:outline-none focus:border-neutral-900"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-4 rounded-xl text-white font-bold text-xs sm:text-sm bg-neutral-900 hover:bg-neutral-800 transition-all shadow-sm active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Publish Video to Community</span>
                  </button>
                </form>
              </div>

              {/* Right (5 cols): Published Tutorials List */}
              <div className="lg:col-span-5 rounded-3xl p-6 sm:p-8 bg-white border border-neutral-200 shadow-sm flex flex-col justify-between">
                <div>
                  <h4 className="text-base font-bold text-neutral-900 mb-1">
                    Published Catalog ({videos.length})
                  </h4>
                  <p className="text-xs text-neutral-600 mb-4 font-medium">
                    Active tutorials visible to all users
                  </p>

                  <div className="space-y-3 max-h-[360px] overflow-y-auto custom-scrollbar pr-1">
                    {videos.slice(0, 6).map((v) => (
                      <div
                        key={v.id}
                        className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 flex items-center gap-3"
                      >
                        <div className="w-12 h-8 rounded-lg overflow-hidden bg-neutral-950 shrink-0 relative">
                          <img
                            src={v.thumbnail}
                            alt={v.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-neutral-900 truncate">
                            {v.title}
                          </div>
                          <div className="text-[10px] text-neutral-600 flex items-center gap-1.5 mt-0.5">
                            <span className="font-bold text-neutral-800">{v.duration}</span>
                            <span>·</span>
                            <span>{v.views}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-200 mt-4 text-[11px] text-neutral-600 font-medium">
                  Synced with the public gallery in real time.
                </div>
              </div>

            </div>

          </div>
        ) : (
          /* NOT LOGGED IN AS ADMIN */
          <div className="rounded-3xl p-12 bg-white border border-neutral-200 shadow-sm text-center max-w-md mx-auto">
            <ShieldCheck className="w-10 h-10 text-orange-500 mx-auto mb-4" />
            <h3 className="text-xl font-black text-neutral-900 mb-2">
              Admin Access Only
            </h3>
            <p className="text-xs text-neutral-600 mb-6 font-medium">
              Only the channel administrator can publish tutorials. Please sign in with your Admin credentials.
            </p>
            <button
              type="button"
              onClick={onAdminLogin}
              className="px-6 py-3 rounded-xl bg-neutral-900 text-white font-bold text-xs sm:text-sm hover:opacity-90 transition-opacity cursor-pointer"
            >
              Admin Sign In
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
