
export const CONTENT_KEYS = {
  ABOUT_IMAGE: 'bardahl_content_about_img',
  MANUFACTURER_CERTIFICATE: 'bardahl_content_cert_img',
  PHOTO_GALLERY: 'bardahl_gallery_images',
};

export const contentService = {
  getAboutImage: (): string | null => {
    return localStorage.getItem(CONTENT_KEYS.ABOUT_IMAGE);
  },

  saveAboutImage: (base64Data: string): boolean => {
    try {
        localStorage.setItem(CONTENT_KEYS.ABOUT_IMAGE, base64Data);
        return true;
    } catch (e) {
        console.error("Storage Limit Exceeded:", e);
        return false;
    }
  },

  clearAboutImage: (): void => {
    localStorage.removeItem(CONTENT_KEYS.ABOUT_IMAGE);
  },

  // Certificate methods
  getCertificate: (): string | null => {
    return localStorage.getItem(CONTENT_KEYS.MANUFACTURER_CERTIFICATE);
  },

  saveCertificate: (base64Data: string): boolean => {
    try {
      localStorage.setItem(CONTENT_KEYS.MANUFACTURER_CERTIFICATE, base64Data);
      return true;
    } catch (e) {
      return false;
    }
  },

  clearCertificate: (): void => {
    localStorage.removeItem(CONTENT_KEYS.MANUFACTURER_CERTIFICATE);
  },

  // Gallery methods
  getGallery: (): string[] => {
    const stored = localStorage.getItem(CONTENT_KEYS.PHOTO_GALLERY);
    return stored ? JSON.parse(stored) : [];
  },

  saveToGallery: (base64Data: string): boolean => {
    try {
      const gallery = contentService.getGallery();
      gallery.unshift(base64Data); // Newest first
      localStorage.setItem(CONTENT_KEYS.PHOTO_GALLERY, JSON.stringify(gallery.slice(0, 12))); // Limit to 12 for performance
      return true;
    } catch (e) {
      return false;
    }
  },

  removeFromGallery: (index: number): void => {
    const gallery = contentService.getGallery();
    gallery.splice(index, 1);
    localStorage.setItem(CONTENT_KEYS.PHOTO_GALLERY, JSON.stringify(gallery));
  }
};
