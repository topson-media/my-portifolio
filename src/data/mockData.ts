import { FeedbackItem, VideoItem, ChatMessage } from '../types';

// The official welcome and profile image requested by user
export const TOPSON_OFFICIAL_REMOTE_URL = 'https://scontent.fnbo19-1.fna.fbcdn.net/v/t39.30808-6/784226805_122310120086033435_5703529307571868063_n.jpg?stp=dst-jpg_tt6&cstp=mx627x627&ctp=s627x627&_nc_cat=108&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=VUFBMzvzIdUQ7kNvwF8K-Gp&_nc_oc=AdoMQkq1yVqm3WE--ODjELcPaP0wIC2dPNSkOd3dgE2ezaPTaF7gcwnl9tKR0EQq2zJbh5f3XsEcXfSGkP7O2whW&_nc_zt=23&_nc_ht=scontent.fnbo19-1.fna&_nc_gid=McIYxGr7XMcaS_RixZg-kg&_nc_ss=7b2a8&oh=00_AQOWUjypiZh5asHVpWGs0RFSvzvbASk_Am_nR1-GG15p8Q&oe=6AC421CF';
export const TOPSON_PROFILE_IMAGE = '/src/assets/images/topson_official_avatar.jpg';
export const TOPSON_HERO_BADGE = '/src/assets/images/topson_official_avatar.jpg';

// Top 6 Curated Tutorials (others will be displayed on YouTube)
export const INITIAL_VIDEOS: VideoItem[] = [
  {
    id: 'vid-1',
    title: '10 Android Settings You NEED to Change',
    category: 'Dev Workflows', // Phone Mastery
    duration: '08:42',
    views: '342K views',
    date: '3 days ago',
    thumbnail: '/src/assets/images/thumb_ai_workflow_1790770861253.jpg',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    sourceType: 'device',
    description: 'Unlock hidden developer options, disable background battery hogs, and tweak animation speeds to make any Android device feel twice as fast.',
    tags: ['Phone Mastery', 'Android', 'Battery', 'Speed'],
  },
  {
    id: 'vid-2',
    title: 'Make Your Old Laptop Feel Brand New',
    category: 'Desk & Gear', // PC Performance
    duration: '12:18',
    views: '512K views',
    date: '1 week ago',
    thumbnail: '/src/assets/images/thumb_desk_minimalism_1790770872709.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    sourceType: 'link',
    description: 'The step-by-step deep cleanup, bloatware removal, thermal repasting, and SSD optimization checklist that revives aging Windows and Mac machines.',
    tags: ['PC Performance', 'Windows', 'Hardware', 'Optimization'],
  },
  {
    id: 'vid-3',
    title: 'The Free Creator Toolkit for 2024 & Beyond',
    category: 'Full Stack',
    duration: '15:04',
    views: '280K views',
    date: '2 weeks ago',
    thumbnail: '/src/assets/images/thumb_fullstack_speed_1790770882895.jpg',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    sourceType: 'device',
    description: 'Essential open-source and free audio, video, graphics, and productivity utilities that rival expensive subscription suites.',
    tags: ['Creator Tools', 'Open Source', 'Software'],
  },
  {
    id: 'vid-4',
    title: 'Hidden Windows 11 Features You Missed',
    category: 'Desk & Gear',
    duration: '11:25',
    views: '198K views',
    date: '3 weeks ago',
    thumbnail: '/src/assets/images/thumb_ai_workflow_1790770861253.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=jNQXAC9IVRw',
    sourceType: 'link',
    description: 'PowerToys tricks, terminal customizations, snap layout secrets, and native sandbox setups every power user needs to configure.',
    tags: ['PC Performance', 'Windows 11', 'PowerToys', 'Productivity'],
  },
  {
    id: 'vid-5',
    title: 'iPhone Shortcuts That Save Hours Weekly',
    category: 'Dev Workflows',
    duration: '09:30',
    views: '410K views',
    date: '1 month ago',
    thumbnail: '/src/assets/images/thumb_desk_minimalism_1790770872709.jpg',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    sourceType: 'device',
    description: 'Automating morning routines, clipboard history syncing, photo watermarking, and smart Wi-Fi toggling with native iOS Shortcuts.',
    tags: ['Phone Mastery', 'iOS', 'Shortcuts', 'Automation'],
  },
  {
    id: 'vid-6',
    title: 'How to Back Up Everything Safely (3-2-1 Rule)',
    category: 'Full Stack',
    duration: '14:10',
    views: '225K views',
    date: '1 month ago',
    thumbnail: '/src/assets/images/thumb_fullstack_speed_1790770882895.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=21X5lGlDOfg',
    sourceType: 'link',
    description: 'Bulletproof local NAS and encrypted cloud backups so you never lose photos, code repositories, or personal documents again.',
    tags: ['Security', 'Cloud', 'Data'],
  },
];

export const INITIAL_FEEDBACKS: FeedbackItem[] = [
  {
    id: 'fb-1',
    authorName: 'TOP',
    authorHandle: '@top_creator',
    authorRole: 'GGG',
    avatarUrl: '',
    rating: 5,
    date: 'Sep 30, 2026',
    content: 'HELLO! Your Android settings guide saved my battery life on the Galaxy S24. The 0.5x animation trick makes the whole phone feel brand new.',
    verified: true,
    likes: 14,
    userLiked: false,
    replies: [
      {
        id: 'rep-1',
        authorName: 'Topson Media',
        authorRole: 'Host / Creator',
        avatarUrl: TOPSON_PROFILE_IMAGE,
        content: 'Glad it helped! Also turn off nearby device scanning for extra battery gains.',
        date: 'Sep 30, 2026',
      },
    ],
  },
  {
    id: 'fb-2',
    authorName: 'tttt',
    authorHandle: '@tttt_user',
    authorRole: 'Viewer',
    avatarUrl: '',
    rating: 5,
    date: 'Sep 30, 2026',
    content: 'hell yeah! The PC optimization tutorial revived my 6-year-old Dell laptop. Keep the amazing content coming!',
    verified: true,
    likes: 9,
    userLiked: false,
    replies: [
      {
        id: 'rep-2',
        authorName: 'Marcus Vance',
        authorRole: 'Tech Lead',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        content: 'Same here! Swapping to an SSD on older hardware is magic.',
        date: 'Sep 30, 2026',
      },
    ],
  },
  {
    id: 'fb-3',
    authorName: 'Marcus Vance',
    authorHandle: '@mvance_tech',
    authorRole: 'Tech Lead',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    date: 'Sep 28, 2026',
    content: 'The production quality here is unmatched in the tech space. The pacing, clear screen captures, and practical advice make tutorials genuinely useful.',
    verified: true,
    likes: 27,
    userLiked: true,
    replies: [],
  },
  {
    id: 'fb-4',
    authorName: 'Elena Rostova',
    authorHandle: '@elena_dev',
    authorRole: 'Digital Creator',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    date: 'Sep 25, 2026',
    content: 'Followed Topson Media on TikTok and now checking every full guide on YouTube. Best phone and PC tricks on the internet.',
    verified: true,
    likes: 19,
    userLiked: false,
    replies: [],
  },
];

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'topson',
    senderName: 'Topson Media',
    text: 'Hey everyone! Welcome to the Topson Media live studio chat. Drop your phone, PC, or creator setup questions below and let’s talk tech!',
    timestamp: '10:00 AM',
    avatarUrl: TOPSON_PROFILE_IMAGE,
  },
];

export const TOPSON_REPLIES: { keywords: string[]; reply: string }[] = [
  {
    keywords: ['android', 'phone', 'battery', 'samsung', 'iphone', 'ios', 'shortcut'],
    reply: 'For phone battery and speed: turn off background app refresh, enable dark mode across AMOLED displays, and set animation scale to 0.5x in developer settings!',
  },
  {
    keywords: ['pc', 'laptop', 'windows', 'mac', 'slow', 'ssd', 'cleanup', 'storage'],
    reply: 'If your laptop is sluggish: check Task Manager startup apps, clear %temp% files, and make sure your SSD has at least 15% free space for virtual memory paging.',
  },
  {
    keywords: ['gear', 'camera', 'mic', 'setup', 'tools', 'edit', 'record', 'davinci'],
    reply: 'My primary setup is a Sony camera with a 24-70mm lens, Shure microphone with Cloudlifter, and DaVinci Resolve for all video cuts.',
  },
  {
    keywords: ['hello', 'hi', 'hey', 'sup', 'yo'],
    reply: 'Hey there! Welcome to the studio. What tutorial or tech trick are you working on today?',
  },
];
