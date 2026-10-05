export interface User {
  id: string;
  username: string;
  email: string;
  avatarUrl?: string;
  role?: 'admin' | 'creator' | 'member';
  joinedDate: string;
}

export interface ChatMessage {
  id: string;
  sender: 'topson' | 'user';
  senderName: string;
  userId?: string;
  userEmail?: string;
  targetUserId?: string;
  text: string;
  timestamp: string;
  avatarUrl?: string;
  isRead?: boolean;
  deletedForEveryone?: boolean;
  deletedForUser?: boolean;
}

export interface FeedbackReply {
  id: string;
  authorName: string;
  authorRole?: string;
  avatarUrl?: string;
  content: string;
  date: string;
}

export interface FeedbackItem {
  id: string;
  authorName: string;
  authorHandle?: string;
  authorRole: string;
  avatarUrl: string;
  rating: number;
  date: string;
  content: string;
  verified: boolean;
  likes?: number;
  userLiked?: boolean;
  hidden?: boolean;
  replies?: FeedbackReply[];
}

export interface VideoItem {
  id: string;
  title: string;
  category: 'Phone Mastery' | 'PC Performance' | 'Digital & Web' | 'Dev Workflows' | 'Desk & Gear' | 'Full Stack' | 'AI Tools' | string;
  duration: string;
  views: string;
  date: string;
  thumbnail: string;
  youtubeId?: string;
  videoUrl?: string;
  sourceType?: 'link' | 'device';
  description: string;
  tags: string[];
}

export interface EmailMessage {
  id: string;
  senderName: string;
  senderEmail: string;
  subject: string;
  message: string;
  timestamp: string;
  replies?: {
    id: string;
    text: string;
    timestamp: string;
  }[];
}

export interface VisitorActivity {
  id: string;
  type: 'visit' | 'watch' | 'comment' | 'chat' | 'email';
  description: string;
  timestamp: string;
  userIpOrName?: string;
}
