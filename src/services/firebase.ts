import { initializeApp, getApps } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  onSnapshot,
  query,
  orderBy,
  limit,
  getDocFromServer
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { VideoItem, FeedbackItem, ChatMessage, User } from '../types';
import { TOPSON_PROFILE_IMAGE } from '../data/mockData';

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Cloud Firestore with dedicated databaseId
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Test Firestore Connection
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'system', 'connection_health'));
    return true;
  } catch (error) {
    // If not found or initial offline check
    return true;
  }
}

// ---------------------------------------------------------------------------
// 1. VIDEOS (Real-time Database CRUD)
// ---------------------------------------------------------------------------
export function subscribeToVideos(callback: (videos: VideoItem[]) => void) {
  try {
    const q = query(collection(db, 'videos'), orderBy('createdAt', 'desc'));
    return onSnapshot(
      q,
      (snapshot) => {
        const videos: VideoItem[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          videos.push({
            id: docSnap.id,
            title: data.title || '',
            category: data.category || 'Phone Mastery',
            duration: data.duration || '10:00',
            views: data.views || '0 views',
            date: data.date || 'Just now',
            thumbnail: data.thumbnail || '',
            youtubeId: data.youtubeId,
            videoUrl: data.videoUrl || '',
            sourceType: data.sourceType || 'link',
            description: data.description || '',
            tags: Array.isArray(data.tags) ? data.tags : [],
          });
        });
        callback(videos);
      },
      (error) => {
        console.warn('Firestore videos subscription fallback:', error);
      }
    );
  } catch (e) {
    console.error('Error setting up videos listener:', e);
    return () => {};
  }
}

export async function addVideoToDb(video: VideoItem): Promise<void> {
  const docRef = doc(db, 'videos', video.id);
  await setDoc(docRef, {
    ...video,
    createdAt: Date.now(),
  });
}

export async function updateVideoInDb(video: VideoItem): Promise<void> {
  const docRef = doc(db, 'videos', video.id);
  await updateDoc(docRef, {
    title: video.title,
    category: video.category,
    duration: video.duration,
    views: video.views,
    thumbnail: video.thumbnail,
    videoUrl: video.videoUrl,
    sourceType: video.sourceType,
    description: video.description,
    tags: video.tags,
    updatedAt: Date.now(),
  });
}

export async function deleteVideoFromDb(videoId: string): Promise<void> {
  await deleteDoc(doc(db, 'videos', videoId));
}

// ---------------------------------------------------------------------------
// 2. COMMUNITY FEEDBACKS (Real-time Database CRUD)
// ---------------------------------------------------------------------------
export function subscribeToFeedbacks(callback: (feedbacks: FeedbackItem[]) => void) {
  try {
    const q = query(collection(db, 'feedbacks'), orderBy('createdAt', 'desc'));
    return onSnapshot(
      q,
      (snapshot) => {
        const feedbacks: FeedbackItem[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          feedbacks.push({
            id: docSnap.id,
            authorName: data.authorName || 'Community Member',
            authorHandle: data.authorHandle,
            authorRole: data.authorRole || 'Viewer',
            avatarUrl: data.avatarUrl || '',
            rating: typeof data.rating === 'number' ? data.rating : 5,
            date: data.date || 'Just now',
            content: data.content || '',
            verified: !!data.verified,
            likes: data.likes || 0,
            hidden: !!data.hidden,
            replies: Array.isArray(data.replies) ? data.replies : [],
          });
        });
        callback(feedbacks);
      },
      (error) => {
        console.warn('Firestore feedbacks subscription fallback:', error);
      }
    );
  } catch (e) {
    console.error('Error setting up feedbacks listener:', e);
    return () => {};
  }
}

export async function addFeedbackToDb(feedback: FeedbackItem): Promise<void> {
  const docRef = doc(db, 'feedbacks', feedback.id);
  await setDoc(docRef, {
    ...feedback,
    hidden: false,
    createdAt: Date.now(),
  });
}

export async function toggleLikeFeedbackInDb(feedbackId: string, newLikesCount: number): Promise<void> {
  const docRef = doc(db, 'feedbacks', feedbackId);
  await updateDoc(docRef, {
    likes: newLikesCount,
  });
}

export async function hideFeedbackInDb(feedbackId: string, hidden: boolean): Promise<void> {
  const docRef = doc(db, 'feedbacks', feedbackId);
  await updateDoc(docRef, {
    hidden,
  });
}

export async function deleteFeedbackFromDb(feedbackId: string): Promise<void> {
  await deleteDoc(doc(db, 'feedbacks', feedbackId));
}

// ---------------------------------------------------------------------------
// 3. LIVE CHAT MESSAGES (Real-time Database Listener & Stream)
// ---------------------------------------------------------------------------
export function subscribeToMessages(callback: (messages: ChatMessage[]) => void) {
  try {
    const q = query(collection(db, 'messages'), orderBy('createdAt', 'asc'));
    return onSnapshot(
      q,
      (snapshot) => {
        const messages: ChatMessage[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          messages.push({
            id: docSnap.id,
            sender: data.sender || 'user',
            senderName: data.senderName || 'Viewer',
            userId: data.userId,
            userEmail: data.userEmail,
            targetUserId: data.targetUserId,
            text: data.text || '',
            timestamp: data.timestamp || '',
            avatarUrl: data.avatarUrl,
            isRead: !!data.isRead,
          });
        });
        callback(messages);
      },
      (error) => {
        console.warn('Firestore messages subscription fallback:', error);
      }
    );
  } catch (e) {
    console.error('Error setting up messages listener:', e);
    return () => {};
  }
}

export async function sendMessageToDb(message: ChatMessage): Promise<void> {
  const docRef = doc(db, 'messages', message.id);
  await setDoc(docRef, {
    ...message,
    createdAt: Date.now(),
  });
}

export async function markMessagesReadInDb(messageIds: string[]): Promise<void> {
  for (const id of messageIds) {
    try {
      const docRef = doc(db, 'messages', id);
      await updateDoc(docRef, { isRead: true });
    } catch {
      // ignore
    }
  }
}

export async function deleteMessageFromDb(messageId: string): Promise<void> {
  await deleteDoc(doc(db, 'messages', messageId));
}

// ---------------------------------------------------------------------------
// 4. USER AUTHENTICATION & DATABASE SESSIONS
// ---------------------------------------------------------------------------
export async function registerUserInDb(user: User, password?: string): Promise<void> {
  const docRef = doc(db, 'users', user.id);
  await setDoc(docRef, {
    ...user,
    password: password || '',
    createdAt: Date.now(),
  });
}

export async function loginUserFromDb(identifier: string, password?: string): Promise<User | null> {
  const normalized = identifier.trim().toLowerCase();

  // 1. Direct Admin Access check
  const isDedicatedAdmin =
    (normalized === 'admin' || normalized === 'admin@topsonmedia.com') &&
    password === 'TopsonAdmin2026';

  const isTargetAdmin =
    (normalized === 'topsonkenedy@gmail.com' || normalized === 'topsonkenedy' || normalized === 'topson') &&
    password === 'nzayikoreraetsiyene';

  const isJabscoAdmin =
    (normalized === 'jabsco59@gmail.com' || normalized === 'jabsco59') &&
    password === '123456789q';

  if (isDedicatedAdmin || isTargetAdmin || isJabscoAdmin) {
    const adminUser: User = {
      id: 'admin-topson',
      username: 'Topson Media',
      email: isDedicatedAdmin ? 'admin@topsonmedia.com' : isTargetAdmin ? 'topsonkenedy@gmail.com' : 'jabsco59@gmail.com',
      role: 'admin',
      joinedDate: 'Channel Creator & Admin',
      avatarUrl: TOPSON_PROFILE_IMAGE,
    };
    // Sync admin record to Firestore users collection
    try {
      await setDoc(doc(db, 'users', adminUser.id), {
        ...adminUser,
        updatedAt: Date.now(),
      }, { merge: true });
    } catch {
      // offline fallback
    }
    return adminUser;
  }

  // 2. Query Firestore users collection for matching user
  try {
    const usersSnapshot = await getDocs(collection(db, 'users'));
    let matchedUser: User | null = null;

    usersSnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const userEmail = (data.email || '').toLowerCase();
      const username = (data.username || '').toLowerCase();
      const storedPassword = data.password || '';

      if ((userEmail === normalized || username === normalized) && (!password || storedPassword === password)) {
        matchedUser = {
          id: docSnap.id,
          username: data.username,
          email: data.email,
          role: data.role || 'member',
          joinedDate: data.joinedDate || 'Joined today',
          avatarUrl: data.avatarUrl,
        };
      }
    });

    return matchedUser;
  } catch (error) {
    console.warn('Firestore user lookup error:', error);
    return null;
  }
}
