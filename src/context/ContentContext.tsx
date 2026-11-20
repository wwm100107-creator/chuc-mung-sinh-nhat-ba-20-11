import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  BLESSINGS_LIST,
  CLOSING_POEM,
  INITIAL_LANTERNS,
  LETTER_CONTENT,
  SECRET_SEVENTH_BLESSING,
  STORY_BEATS,
  getBirthdayDateInfo,
  type BlessingItem,
  type LanternWish,
} from '../data/birthdayContent';

export interface EditableStoryBeat {
  id: string;
  kicker: string;
  title: string;
  body: string;
}

export interface SiteContent {
  envelope: {
    dateBadge: string;
    recipientTitle: string;
    envelopeSubtitle: string;
    welcomeBadge: string;
    welcomeTitleTop: string;
    welcomeTitleHighlight: string;
    welcomeDescription: string;
  };
  story: {
    paintingCaption: string;
    beats: EditableStoryBeat[];
  };
  letter: {
    salutation: string;
    paragraphs: string[];
    closing: string;
    signature: string;
  };
  blessings: {
    sectionKicker: string;
    sectionTitle: string;
    items: BlessingItem[];
    secretGift: {
      badge: string;
      title: string;
      message: string;
    };
  };
  cake: {
    sectionKicker: string;
    sectionTitle: string;
    sectionDesc: string;
    wishTitle: string;
    wishMessage: string;
  };
  finale: {
    lanternKicker: string;
    lanternTitle: string;
    lanternDesc: string;
    lanterns: LanternWish[];
    finaleKicker: string;
    finaleTitle: string;
    poemLines: string[];
    footerText: string;
  };
}

const STORAGE_KEY = 'snvv-ba-editable-content-v3';

export function getDefaultSiteContent(): SiteContent {
  const dateInfo = getBirthdayDateInfo();
  return {
    envelope: {
      dateBadge: dateInfo.badgeText,
      recipientTitle: 'Kính gửi Bà yêu quý',
      envelopeSubtitle: 'Vuốt nhẹ trang giấy để lật mở từng chương kỷ niệm',
      welcomeBadge: 'Ngày Sinh Nhật Đặc Biệt · 20 Tháng 11',
      welcomeTitleTop: 'Chúc Mừng Sinh Nhật',
      welcomeTitleHighlight: 'Bà Yêu Quý',
      welcomeDescription: `${dateInfo.subStatusText}. Mỗi trang giấy màu nước tiếp theo là một lời chúc bình an con cháu vẽ dành tặng riêng Bà.`,
    },
    story: {
      paintingCaption: 'Hương trà thu · Sắc cúc vàng ngày 20 tháng 11',
      beats: STORY_BEATS.map((b) => ({ ...b })),
    },
    letter: {
      salutation: LETTER_CONTENT.salutation,
      paragraphs: [...LETTER_CONTENT.paragraphs],
      closing: LETTER_CONTENT.closing,
      signature: LETTER_CONTENT.signature,
    },
    blessings: {
      sectionKicker: 'Vòng Hoa Cúc Mùa Thu Chúc Thọ',
      sectionTitle: 'Sáu Lời Chúc Vàng & Món Quà Thứ Bảy',
      items: BLESSINGS_LIST.map((item) => ({ ...item })),
      secretGift: { ...SECRET_SEVENTH_BLESSING },
    },
    cake: {
      sectionKicker: 'Chiếc Bánh Kem Hoa Cúc Mùa Thu 20·11',
      sectionTitle: 'Từng Lớp Bánh Ngọt Ngào Dâng Tặng Bà',
      sectionDesc:
        'Cuộn trang từ từ để xem từng tầng bánh, lớp kem tươi chảy mềm, hoa cúc vàng và 5 ngọn nến thắp lửa sáng rực.',
      wishTitle: 'Chúc Mừng Sinh Nhật Bà 20/11!',
      wishMessage:
        'Chiếc bánh sinh nhật đã thắp sáng đủ 5 ngọn nến ấm áp. Kính chúc Bà tuổi mới luôn dồi dào sức khỏe, tay chân vững vàng và nụ cười rạng rỡ mỗi sớm mai!',
    },
    finale: {
      lanternKicker: 'Hồ Hoa Đăng Mùa Thu 20·11',
      lanternTitle: 'Đèn Hoa Đăng Cầu Phúc Thọ Bình An',
      lanternDesc: 'Những ngọn hoa đăng mang lời nguyện cầu sức khỏe và bình an từ con cháu.',
      lanterns: INITIAL_LANTERNS.map((l) => ({ ...l })),
      finaleKicker: 'Lời Thơ Kết Kính Dâng Bà',
      finaleTitle: 'Mãi Khỏe Mạnh & An Nhiên, Bà Nhé',
      poemLines: [...CLOSING_POEM],
      footerText:
        'Tấm thiệp màu nước kỷ niệm ngày sinh nhật Bà 20 tháng 11 · Làm bằng trọn vẹn yêu thương từ con cháu',
    },
  };
}

function encodeContentToBase64(content: SiteContent): string {
  const json = JSON.stringify(content);
  const bytes = new TextEncoder().encode(json);
  let binary = '';
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

function decodeContentFromBase64(b64: string): SiteContent | null {
  try {
    const binary = window.atob(b64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) {
      bytes[i] = binary.charCodeAt(i);
    }
    const json = new TextDecoder().decode(bytes);
    const parsed = JSON.parse(json) as Partial<SiteContent>;
    const def = getDefaultSiteContent();
    return {
      envelope: { ...def.envelope, ...(parsed.envelope ?? {}) },
      story: { ...def.story, ...(parsed.story ?? {}) },
      letter: { ...def.letter, ...(parsed.letter ?? {}) },
      blessings: { ...def.blessings, ...(parsed.blessings ?? {}) },
      cake: { ...def.cake, ...(parsed.cake ?? {}) },
      finale: { ...def.finale, ...(parsed.finale ?? {}) },
    };
  } catch {
    return null;
  }
}

interface ContentContextValue {
  content: SiteContent;
  updateContent: (updater: (prev: SiteContent) => SiteContent) => void;
  resetContent: () => void;
  createShareableGiftUrl: () => string;
  isGiftViewMode: boolean;
}

const ContentContext = createContext<ContentContextValue | null>(null);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [isGiftViewMode, setIsGiftViewMode] = useState(false);

  const [content, setContent] = useState<SiteContent>(() => {
    const def = getDefaultSiteContent();
    if (typeof window === 'undefined') return def;

    const hash = window.location.hash;
    if (hash.startsWith('#gift=')) {
      const encoded = decodeURIComponent(hash.slice('#gift='.length));
      const fromUrl = decodeContentFromBase64(encoded);
      if (fromUrl) {
        return fromUrl;
      }
    }

    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<SiteContent>;
        return {
          envelope: { ...def.envelope, ...(parsed.envelope ?? {}) },
          story: { ...def.story, ...(parsed.story ?? {}) },
          letter: { ...def.letter, ...(parsed.letter ?? {}) },
          blessings: { ...def.blessings, ...(parsed.blessings ?? {}) },
          cake: { ...def.cake, ...(parsed.cake ?? {}) },
          finale: { ...def.finale, ...(parsed.finale ?? {}) },
        };
      }
    } catch {
      // Fallback to default
    }
    return def;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    if (params.get('view') === 'gift') {
      setIsGiftViewMode(true);
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
    } catch {
      // Ignore quota errors
    }
  }, [content]);

  const updateContent = useCallback((updater: (prev: SiteContent) => SiteContent) => {
    setContent((prev) => updater(prev));
  }, []);

  const resetContent = useCallback(() => {
    const def = getDefaultSiteContent();
    setContent(def);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
      if (window.location.hash.startsWith('#gift=')) {
        window.history.replaceState(null, '', window.location.pathname);
      }
    } catch {
      // Ignore
    }
  }, []);

  const createShareableGiftUrl = useCallback(() => {
    const encoded = encodeContentToBase64(content);
    const url = `${window.location.origin}${window.location.pathname}?view=gift#gift=${encodeURIComponent(encoded)}`;
    return url;
  }, [content]);

  const value = useMemo(
    () => ({
      content,
      updateContent,
      resetContent,
      createShareableGiftUrl,
      isGiftViewMode,
    }),
    [content, updateContent, resetContent, createShareableGiftUrl, isGiftViewMode],
  );

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useSiteContent(): ContentContextValue {
  const ctx = useContext(ContentContext);
  if (!ctx) {
    throw new Error('useSiteContent must be used inside ContentProvider');
  }
  return ctx;
}
