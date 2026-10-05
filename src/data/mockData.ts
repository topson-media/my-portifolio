import { FeedbackItem, VideoItem, ChatMessage } from '../types';

// The official welcome and profile image requested by user
export const TOPSON_POSTIMG_PAGE_URL = 'https://postimg.cc/MvKQDfYp';
export const TOPSON_POSTIMG_DIRECT_URL = 'https://i.postimg.cc/Hsb9TQcX/profile.png';
export const TOPSON_PROFILE_IMAGE = 'https://i.postimg.cc/Hsb9TQcX/profile.png';
export const TOPSON_HERO_BADGE = 'https://i.postimg.cc/Hsb9TQcX/profile.png';

// Absolute Clean Slate: No mock videos, no fake reviews, no pre-filled chats
export const INITIAL_VIDEOS: VideoItem[] = [];
export const INITIAL_FEEDBACKS: FeedbackItem[] = [];
export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [];
