import Settings from '../../src/modules/settings.js';
import { DEFAULT_SETTINGS } from '../../src/constants.js';

describe('Settings', () => {
  let settings;

  beforeEach(() => {
    settings = new Settings(DEFAULT_SETTINGS);
  });

  describe('shouldDetectMale', () => {
    it('should return false when status is false', () => {
      settings._settings.status = false;
      settings._settings.blurMale = true;
      expect(settings.shouldDetectMale()).toBe(false);
    });

    it('should return true when status and blurMale are true', () => {
      settings._settings.status = true;
      settings._settings.blurMale = true;
      expect(settings.shouldDetectMale()).toBe(true);
    });

    it('should return false when status is true but blurMale is false', () => {
      settings._settings.status = true;
      settings._settings.blurMale = false;
      expect(settings.shouldDetectMale()).toBe(false);
    });
  });

  describe('shouldDetectFemale', () => {
    it('should return false when status is false', () => {
      settings._settings.status = false;
      settings._settings.blurFemale = true;
      expect(settings.shouldDetectFemale()).toBe(false);
    });

    it('should return true when status and blurFemale are true', () => {
      settings._settings.status = true;
      settings._settings.blurFemale = true;
      expect(settings.shouldDetectFemale()).toBe(true);
    });
  });

  describe('getBlurAmount', () => {
    it('should return 0 when detection is disabled', () => {
      settings._settings.status = false;
      settings._settings.blurAmount = 20;
      expect(settings.getBlurAmount()).toBe(0);
    });

    it('should return blur amount when detection is enabled', () => {
      settings._settings.status = true;
      settings._settings.blurImages = true;
      settings._settings.blurAmount = 25;
      expect(settings.getBlurAmount()).toBe(25);
    });
  });

  describe('getStrictness', () => {
    it('should return 0 when detection is disabled', () => {
      settings._settings.status = false;
      settings._settings.strictness = 0.7;
      expect(settings.getStrictness()).toBe(0);
    });

    it('should return strictness value when detection is enabled', () => {
      settings._settings.status = true;
      settings._settings.blurImages = true;
      settings._settings.strictness = 0.8;
      expect(settings.getStrictness()).toBe(0.8);
    });
  });

  describe('getBlurryStartTimeout', () => {
    it('should return default timeout when not set', () => {
      delete settings._settings.blurryStartTimeout;
      expect(settings.getBlurryStartTimeout()).toBe(7000);
    });

    it('should return configured timeout', () => {
      settings._settings.blurryStartTimeout = 5000;
      expect(settings.getBlurryStartTimeout()).toBe(5000);
    });
  });
});