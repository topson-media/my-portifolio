import { FeedbackItem, VideoItem, ChatMessage } from '../types';

// The official welcome and profile image requested by user
export const TOPSON_OFFICIAL_REMOTE_URL = 'https://scontent.fnbo19-1.fna.fbcdn.net/v/t39.30808-6/784226805_122310120086033435_5703529307571868063_n.jpg?stp=dst-jpg_tt6&cstp=mx627x627&ctp=s627x627&_nc_cat=108&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=VUFBMzvzIdUQ7kNvwF8K-Gp&_nc_oc=AdoMQkq1yVqm3WE--ODjELcPaP0wIC2dPNSkOd3dgE2ezaPTaF7gcwnl9tKR0EQq2zJbh5f3XsEcXfSGkP7O2whW&_nc_zt=23&_nc_ht=scontent.fnbo19-1.fna&_nc_gid=McIYxGr7XMcaS_RixZg-kg&_nc_ss=7b2a8&oh=00_AQOWUjypiZh5asHVpWGs0RFSvzvbASk_Am_nR1-GG15p8Q&oe=6AC421CF';
export const TOPSON_PROFILE_IMAGE = '/src/assets/images/topson_official_avatar.jpg';
export const TOPSON_HERO_BADGE = '/src/assets/images/topson_official_avatar.jpg';

// Absolute Clean Slate: No mock videos, no fake reviews, no pre-filled chats
export const INITIAL_VIDEOS: VideoItem[] = [];
export const INITIAL_FEEDBACKS: FeedbackItem[] = [];
export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [];
