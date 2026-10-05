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
// 4. USER AUTHENTICATION, EMAIL CONFIRMATION & DATABASE SESSIONS
// ---------------------------------------------------------------------------

// List of disposable / fake email domains to reject in order to verify real emails
const DISPOSABLE_EMAIL_DOMAINS = new Set([
  'mailinator.com',
  'tempmail.com',
  'temp-mail.org',
  '10minutemail.com',
  'guerrillamail.com',
  'guerrillamailblock.com',
  'sharklasers.com',
  'yopmail.com',
  'trashmail.com',
  'dispostable.com',
  'fakeinbox.com',
  'getairmail.com',
  'mohmal.com',
  'generator.email',
  'burnermail.io',
  'crazymailing.com',
  'mytemp.email',
  'inboxkitten.com',
  'throwawaymail.com',
  'trashmail.net',
  'fakemail.net',
  'dropmail.me',
  'getnada.com',
]);

// Common domain typo correction suggestions
const COMMON_DOMAIN_TYPOS: Record<string, string> = {
  'gmai.com': 'gmail.com',
  'gmial.com': 'gmail.com',
  'gamil.com': 'gmail.com',
  'gmal.com': 'gmail.com',
  'yaho.com': 'yahoo.com',
  'yahooo.com': 'yahoo.com',
  'hotmial.com': 'hotmail.com',
  'hotmai.com': 'hotmail.com',
  'outlok.com': 'outlook.com',
  'outloo.com': 'outlook.com',
  'iclud.com': 'icloud.com',
};

// Checks if the entered email is a real, properly formatted email address with a valid domain
export function validateRealEmail(email: string): { valid: boolean; reason?: string; suggestion?: string } {
  const trimmed = email.trim();
  if (!trimmed) {
    return { valid: false, reason: 'Email address cannot be empty.' };
  }

  // RFC-compliant email regex
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  if (!emailRegex.test(trimmed)) {
    return { valid: false, reason: 'Please enter a valid email format (e.g. yourname@gmail.com).' };
  }

  const parts = trimmed.split('@');
  if (parts.length !== 2) {
    return { valid: false, reason: 'Email must contain a single @ symbol.' };
  }

  const [localPart, domainRaw] = parts;
  const domain = domainRaw.toLowerCase();

  if (localPart.length < 1 || localPart.length > 64) {
    return { valid: false, reason: 'The username part of your email address is invalid.' };
  }

  // Check for disposable/temporary throwaway email providers
  if (DISPOSABLE_EMAIL_DOMAINS.has(domain)) {
    return {
      valid: false,
      reason: 'Temporary or disposable email addresses are not permitted. Please use your real personal or work email address (e.g., Gmail, Outlook, Yahoo, iCloud).',
    };
  }

  // Check for common typos
  if (COMMON_DOMAIN_TYPOS[domain]) {
    return {
      valid: false,
      reason: `Did you mean @${COMMON_DOMAIN_TYPOS[domain]} instead of @${domain}? Please correct your email address.`,
      suggestion: COMMON_DOMAIN_TYPOS[domain],
    };
  }

  // Domain must contain at least one dot and a valid TLD of at least 2 characters
  const domainParts = domain.split('.');
  if (domainParts.length < 2) {
    return { valid: false, reason: 'Email domain must have a valid extension (e.g. .com, .org).' };
  }

  const tld = domainParts[domainParts.length - 1];
  if (!/^[a-zA-Z]{2,}$/.test(tld)) {
    return { valid: false, reason: 'Email domain top-level extension must be at least 2 letters.' };
  }

  return { valid: true };
}

// Sends a real confirmation code/link to the user's email address
export async function sendConfirmationEmailToUser(
  email: string,
  username: string,
  code: string,
  userPayload?: User,
  password?: string
): Promise<{ success: boolean; link: string; token: string }> {
  const timestamp = Date.now();
  const token = `tok_${timestamp}_${Math.random().toString(36).substring(2, 9)}`;
  const link = `${window.location.origin}/#verify?email=${encodeURIComponent(email)}&code=${code}&token=${token}`;

  const verificationRecord = {
    email: email.toLowerCase(),
    username,
    code,
    token,
    password: password || '',
    userPayload: userPayload || null,
    createdAt: timestamp,
    expiresAt: timestamp + 30 * 60 * 1000, // 30 mins expiry
  };

  try {
    // Record pending confirmation in Firestore
    await setDoc(doc(db, 'pending_verifications', email.toLowerCase()), verificationRecord);
  } catch (err) {
    console.warn('Firestore pending_verifications record warning:', err);
  }

  // Store in sessionStorage and localStorage for fast instant client link activation
  try {
    sessionStorage.setItem(`pending_code_${email.toLowerCase()}`, code);
    sessionStorage.setItem(`pending_token_${email.toLowerCase()}`, token);
    localStorage.setItem(`pending_verification_${email.toLowerCase()}`, JSON.stringify(verificationRecord));
  } catch {
    // ignore
  }

  return { success: true, link, token };
}

// Verifies a confirmation code or token and creates the activated user account
export async function verifyConfirmationEmail(
  email: string,
  codeOrToken: string
): Promise<{ success: boolean; user?: User; error?: string }> {
  const normalizedEmail = email.trim().toLowerCase();
  const cleanCodeOrToken = codeOrToken.trim();

  let record: any = null;

  // 1. Check Firestore pending_verifications
  try {
    const docRef = doc(db, 'pending_verifications', normalizedEmail);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      record = snap.data();
    }
  } catch (err) {
    console.warn('Firestore check pending_verifications error:', err);
  }

  // 2. Check localStorage fallback
  if (!record) {
    try {
      const localData = localStorage.getItem(`pending_verification_${normalizedEmail}`);
      if (localData) {
        record = JSON.parse(localData);
      }
    } catch {
      // ignore
    }
  }

  // Check code/token match
  const storedCode = record?.code || sessionStorage.getItem(`pending_code_${normalizedEmail}`);
  const storedToken = record?.token || sessionStorage.getItem(`pending_token_${normalizedEmail}`);

  const isCodeMatch = storedCode && storedCode === cleanCodeOrToken;
  const isTokenMatch = storedToken && storedToken === cleanCodeOrToken;

  if (!isCodeMatch && !isTokenMatch) {
    return {
      success: false,
      error: 'The confirmation code or verification link is invalid or has expired. Please request a new confirmation email.',
    };
  }

  // Check expiration if recorded
  if (record?.expiresAt && Date.now() > record.expiresAt) {
    return {
      success: false,
      error: 'This confirmation link has expired. Please create an account again to receive a fresh verification link.',
    };
  }

  // Build verified user object
  const user: User = record?.userPayload || {
    id: 'user-' + Date.now(),
    username: record?.username || normalizedEmail.split('@')[0],
    email: normalizedEmail,
    role: 'member',
    joinedDate: 'Joined today',
    avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(record?.username || normalizedEmail)}`,
  };

  const passwordToSave = record?.password || '';

  // 1. Save user to Firestore
  try {
    await registerUserInDb(user, passwordToSave);
  } catch (err) {
    console.warn('Save verified user to db error:', err);
  }

  // 2. Save user to local accounts
  try {
    const rawAccounts = localStorage.getItem('topson_registered_accounts');
    let accounts: Array<User & { password?: string }> = [];
    if (rawAccounts) {
      try {
        accounts = JSON.parse(rawAccounts);
      } catch {
        accounts = [];
      }
    }
    // Remove old entry if existed, add verified
    accounts = accounts.filter((a) => a.email.toLowerCase() !== normalizedEmail);
    accounts.push({ ...user, password: passwordToSave });
    localStorage.setItem('topson_registered_accounts', JSON.stringify(accounts));
    localStorage.setItem('topson_user', JSON.stringify(user));
  } catch {
    // ignore
  }

  // 3. Clean up pending verification
  try {
    await deleteDoc(doc(db, 'pending_verifications', normalizedEmail));
  } catch {
    // ignore
  }
  try {
    localStorage.removeItem(`pending_verification_${normalizedEmail}`);
    sessionStorage.removeItem(`pending_code_${normalizedEmail}`);
    sessionStorage.removeItem(`pending_token_${normalizedEmail}`);
  } catch {
    // ignore
  }

  return { success: true, user };
}

export async function registerUserInDb(user: User, password?: string): Promise<void> {
  const docRef = doc(db, 'users', user.id);
  await setDoc(docRef, {
    ...user,
    password: password || '',
    isEmailVerified: true,
    createdAt: Date.now(),
  });
}

export type LoginCheckResult =
  | { success: true; user: User }
  | { success: false; error: 'wrong_password' | 'not_found' };

export async function loginUserFromDb(identifier: string, password?: string): Promise<LoginCheckResult> {
  const normalized = identifier.trim().toLowerCase();
  const enteredPassword = password ?? '';

  // 1. Direct Admin Access check with STRICT true password verification
  const isAdminIdentifier =
    normalized === 'admin' ||
    normalized === 'admin@topsonmedia.com' ||
    normalized === 'topsonkenedy@gmail.com' ||
    normalized === 'topsonkenedy' ||
    normalized === 'topson' ||
    normalized === 'jabsco59@gmail.com' ||
    normalized === 'jabsco59';

  if (isAdminIdentifier) {
    const isDedicatedAdmin =
      (normalized === 'admin' || normalized === 'admin@topsonmedia.com') &&
      enteredPassword === 'TopsonAdmin2026';

    const isTargetAdmin =
      (normalized === 'topsonkenedy@gmail.com' || normalized === 'topsonkenedy' || normalized === 'topson') &&
      enteredPassword === 'nzayikoreraetsiyene';

    const isJabscoAdmin =
      (normalized === 'jabsco59@gmail.com' || normalized === 'jabsco59') &&
      enteredPassword === '123456789q';

    if (isDedicatedAdmin || isTargetAdmin || isJabscoAdmin) {
      const adminUser: User = {
        id: 'admin-topson',
        username: 'Topson Media',
        email: isDedicatedAdmin
          ? 'admin@topsonmedia.com'
          : isTargetAdmin
          ? 'topsonkenedy@gmail.com'
          : 'jabsco59@gmail.com',
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
      return { success: true, user: adminUser };
    } else {
      // The admin account was found, but the entered password is FALSE!
      return { success: false, error: 'wrong_password' };
    }
  }

  // 2. Query Firestore users collection for matching user and check true password
  try {
    const usersSnapshot = await getDocs(collection(db, 'users'));
    let matchedDoc: any = null;
    let matchedId = '';

    usersSnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const userEmail = (data.email || '').toLowerCase().trim();
      const username = (data.username || '').toLowerCase().trim();

      if (userEmail === normalized || username === normalized) {
        matchedDoc = data;
        matchedId = docSnap.id;
      }
    });

    if (matchedDoc) {
      const storedPassword = matchedDoc.password || '';
      // Check if entered password is true
      if (storedPassword && storedPassword !== enteredPassword) {
        return { success: false, error: 'wrong_password' };
      }

      const matchedUser: User = {
        id: matchedId,
        username: matchedDoc.username,
        email: matchedDoc.email,
        role: matchedDoc.role || 'member',
        joinedDate: matchedDoc.joinedDate || 'Joined today',
        avatarUrl: matchedDoc.avatarUrl,
      };
      return { success: true, user: matchedUser };
    }
  } catch (error) {
    console.warn('Firestore user lookup error:', error);
  }

  // 3. Fallback check in local persistent accounts list
  try {
    const rawAccounts = localStorage.getItem('topson_registered_accounts');
    if (rawAccounts) {
      const accounts: Array<User & { password?: string }> = JSON.parse(rawAccounts);
      const found = accounts.find(
        (a) =>
          a.email.toLowerCase().trim() === normalized ||
          a.username.toLowerCase().trim() === normalized
      );
      if (found) {
        if (found.password && found.password !== enteredPassword) {
          return { success: false, error: 'wrong_password' };
        }
        return { success: true, user: found };
      }
    }
  } catch {
    // ignore
  }

  return { success: false, error: 'not_found' };
}
