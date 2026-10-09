/**
 * Helper function using URL.createObjectURL and onloadedmetadata event
 * on a video File object to automatically extract and format the video duration.
 */
export const extractVideoDurationFromFile = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    try {
      const objectUrl = URL.createObjectURL(file);
      const videoElement = document.createElement('video');
      videoElement.preload = 'metadata';
      videoElement.style.display = 'none';
      videoElement.muted = true;

      videoElement.onloadedmetadata = () => {
        // Clean up memory
        URL.revokeObjectURL(objectUrl);
        const durationSec = Math.round(videoElement.duration);

        if (isNaN(durationSec) || durationSec <= 0) {
          resolve('10:00');
          return;
        }

        const hours = Math.floor(durationSec / 3600);
        const minutes = Math.floor((durationSec % 3600) / 60);
        const seconds = durationSec % 60;

        if (hours > 0) {
          resolve(
            `${hours}:${minutes.toString().padStart(2, '0')}:${seconds
              .toString()
              .padStart(2, '0')}`
          );
        } else {
          resolve(
            `${minutes.toString().padStart(2, '0')}:${seconds
              .toString()
              .padStart(2, '0')}`
          );
        }
      };

      videoElement.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        resolve('10:00');
      };

      videoElement.src = objectUrl;
    } catch (err) {
      console.warn('Failed to extract video duration from file:', err);
      resolve('10:00');
    }
  });
};
