import { isImageTooSmall, isVideoTooSmall, calcResize } from '../../src/modules/helpers.js';

describe('Helpers', () => {
  describe('isImageTooSmall', () => {
    it('should return true for images smaller than minimum size', () => {
      const smallImg = { width: 20, height: 20 };
      expect(isImageTooSmall(smallImg)).toBe(true);
    });

    it('should return false for images larger than minimum size', () => {
      const largeImg = { width: 100, height: 100 };
      expect(isImageTooSmall(largeImg)).toBe(false);
    });

    it('should return true if width is too small', () => {
      const img = { width: 20, height: 100 };
      expect(isImageTooSmall(img)).toBe(true);
    });

    it('should return true if height is too small', () => {
      const img = { width: 100, height: 20 };
      expect(isImageTooSmall(img)).toBe(true);
    });
  });

  describe('isVideoTooSmall', () => {
    it('should return true for videos smaller than minimum size', () => {
      const smallVideo = { 
        videoWidth: 20, 
        videoHeight: 20,
        clientWidth: 20,
        clientHeight: 20
      };
      expect(isVideoTooSmall(smallVideo)).toBe(true);
    });

    it('should return false for videos larger than minimum size', () => {
      const largeVideo = { 
        videoWidth: 100, 
        videoHeight: 100,
        clientWidth: 100,
        clientHeight: 100
      };
      expect(isVideoTooSmall(largeVideo)).toBe(false);
    });

    it('should handle missing video dimensions', () => {
      const video = { clientWidth: 100, clientHeight: 100 };
      expect(isVideoTooSmall(video)).toBe(false);
    });
  });

  describe('calcResize', () => {
    it('should not resize if image is smaller than max size', () => {
      const result = calcResize(200, 150, 'image');
      expect(result.newWidth).toBe(200);
      expect(result.newHeight).toBe(150);
    });

    it('should resize proportionally if image is larger', () => {
      const result = calcResize(800, 600, 'image');
      expect(result.newWidth).toBeLessThan(800);
      expect(result.newHeight).toBeLessThan(600);
      // Check aspect ratio is maintained
      expect(result.newWidth / result.newHeight).toBeCloseTo(800 / 600, 2);
    });

    it('should handle portrait orientation', () => {
      const result = calcResize(300, 500, 'image');
      expect(result.newWidth).toBeLessThan(300);
      expect(result.newHeight).toBeLessThan(500);
    });

    it('should handle video type differently', () => {
      const imageResult = calcResize(800, 600, 'image');
      const videoResult = calcResize(800, 600, 'video');
      // Video should have different max dimensions
      expect(videoResult.newWidth).not.toBe(imageResult.newWidth);
    });

    it('should return original dimensions for invalid input', () => {
      const result = calcResize(0, 0, 'image');
      expect(result.newWidth).toBe(0);
      expect(result.newHeight).toBe(0);
    });
  });
});