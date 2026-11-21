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
  type BlessingItem,
  type LanternWish,
} from '../data/birthdayContent';

export interface SiteContent {
  envelope: {
    pageTitle: string;
    dateBadge: string;
    recipientTitle: string;
    envelopeSubtitle: string;
    scrollHint1: string;
    welcomeBadge: string;
    welcomeTitleTop: string;
    welcomeTitleHighlight: string;
    welcomeDescription: string;
    scrollHint2: string;
  };
  letter: {
    sealTop: string;
    sealBottom: string;
    salutation: string;
    paragraphs: string[];
    closing: string;
    signature: string;
  };
  blessings: {
    sectionKicker: string;
    sectionTitle: string;
    sectionDesc: string;
    cardBadgePrefix: string;
    cardFooterHint: string;
    items: BlessingItem[];
    secretGift: {
      wreathCenterLabel: string;
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
    finaleSealText: string;
    finaleKicker: string;
    finaleTitle: string;
    poemLines: string[];
    footerText: string;
  };
}

const STORAGE_KEY = 'snvv-ba-editable-content-v5';

export function getDefaultSiteContent(): SiteContent {
  return {
    envelope: {
      pageTitle: 'Chúc Mừng Sinh Nhật Bà Yêu',
      dateBadge: 'Kỷ niệm ngày sinh nhật Bà · 20 Tháng 11',
      recipientTitle: 'Kính gửi Bà yêu',
      envelopeSubtitle: 'Bà vuốt nhẹ xuống dưới nha ạ!',
      scrollHint1: '',
      welcomeBadge: 'Ngày Sinh Nhật Đặc Biệt · 20 Tháng 11',
      welcomeTitleTop: 'Chúc Mừng Sinh Nhật',
      welcomeTitleHighlight: 'Bà Yêu',
      welcomeDescription:
        'Mỗi trang giấy tiếp theo là một lời chúc bình an gia đình con dành tặng riêng Bà.',
      scrollHint2: 'Bà vuốt xuống dưới tiếp đi ạ !',
    },
    letter: {
      sealTop: '20',
      sealBottom: 'Th11',
      salutation: LETTER_CONTENT.salutation,
      paragraphs: [...LETTER_CONTENT.paragraphs],
      closing: LETTER_CONTENT.closing,
      signature: LETTER_CONTENT.signature,
    },
    blessings: {
      sectionKicker: 'Vòng Hoa Cúc Mùa Thu Chúc Thọ',
      sectionTitle: 'Sáu Lời Chúc Vàng & Món Quà Thứ Bảy',
      sectionDesc: 'Cuộn nhẹ trang giấy để xoay vòng hoa cúc và lật mở từng tấm thiệp chúc thọ.',
      cardBadgePrefix: 'Lời chúc',
      cardFooterHint: 'Bà cuộn nhẹ xuống tiếp nha ạ!',
      items: BLESSINGS_LIST.map((item) => ({ ...item })),
      secretGift: { ...SECRET_SEVENTH_BLESSING },
    },
    cake: {
      sectionKicker: 'Chiếc Bánh Kem Sinh Nhật Tặng Cho Bà 20·11',
      sectionTitle: 'Từng Lớp Bánh Ngọt Ngào Dâng Tặng Bà',
      sectionDesc: 'Bà cuộn trang từ từ để xem tiếp ạ!',
      wishTitle: 'Chúc Mừng Sinh Nhật Bà 20/11!',
      wishMessage:
        'Nến đã thổi rồi, điều bà ước chắc chắn sẽ thành sự thật ạ. Con cháu chúc bà tuổi mới thật khỏe, thật vui, và năm nào cũng được cùng bà thổi nến như hôm nay ạ.',
    },
    finale: {
      lanternKicker: 'Hồ Hoa Đăng Mùa Thu 20·11',
      lanternTitle: 'Đèn Hoa Đăng Cầu Phúc Thọ Bình An',
      lanternDesc: 'Những ngọn hoa đăng mang lời nguyện cầu sức khỏe và bình an từ con cháu.',
      lanterns: INITIAL_LANTERNS.map((l) => ({ ...l })),
      finaleSealText: '20·11',
      finaleKicker: 'Lời Thơ Kết Kính Dâng Bà',
      finaleTitle: 'Mãi Khỏe Mạnh & An Nhiên, Bà Nhé',
      poemLines: [...CLOSING_POEM],
      footerText:
        'Tấm thiệp màu nước kỷ niệm ngày sinh nhật Bà 20 tháng 11 · Làm bằng trọn vẹn yêu thương từ con cháu',
    },
  };
}

function mergeWithDefaults(parsed: Partial<SiteContent>): SiteContent {
  const def = getDefaultSiteContent();
  return {
    envelope: { ...def.envelope, ...(parsed.envelope ?? {}) },
    letter: {
      ...def.letter,
      ...(parsed.letter ?? {}),
      paragraphs: parsed.letter?.paragraphs?.length ? parsed.letter.paragraphs : def.letter.paragraphs,
    },
    blessings: {
      ...def.blessings,
      ...(parsed.blessings ?? {}),
      items: parsed.blessings?.items?.length ? parsed.blessings.items : def.blessings.items,
      secretGift: {
        ...def.blessings.secretGift,
        ...(parsed.blessings?.secretGift ?? {}),
      },
    },
    cake: { ...def.cake, ...(parsed.cake ?? {}) },
    finale: {
      ...def.finale,
      ...(parsed.finale ?? {}),
      lanterns: parsed.finale?.lanterns?.length ? parsed.finale.lanterns : def.finale.lanterns,
      poemLines: parsed.finale?.poemLines?.length ? parsed.finale.poemLines : def.finale.poemLines,
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
    return mergeWithDefaults(parsed);
  } catch {
    return null;
  }
}

interface ContentContextValue {
  content: SiteContent;
  updateContent: (updater: (prev: SiteContent) => SiteContent) => void;
  importContentJson: (rawJson: string) => boolean;
  exportContentJson: () => string;
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
        return mergeWithDefaults(parsed);
      }
    } catch {
      // Fallback to baked-in custom defaults
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
    if (typeof document !== 'undefined' && content.envelope.pageTitle) {
      document.title = content.envelope.pageTitle;
    }
  }, [content.envelope.pageTitle]);

  const persistToStorage = useCallback((next: SiteContent) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Ignore quota errors
    }
  }, []);

  const updateContent = useCallback(
    (updater: (prev: SiteContent) => SiteContent) => {
      setContent((prev) => {
        const next = updater(prev);
        persistToStorage(next);
        return next;
      });
    },
    [persistToStorage],
  );

  const exportContentJson = useCallback(() => JSON.stringify(content, null, 2), [content]);

  const importContentJson = useCallback(
    (rawJson: string) => {
      try {
        const parsed = JSON.parse(rawJson) as Partial<SiteContent>;
        const merged = mergeWithDefaults(parsed);
        setContent(merged);
        persistToStorage(merged);
        return true;
      } catch {
        return false;
      }
    },
    [persistToStorage],
  );

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
      importContentJson,
      exportContentJson,
      resetContent,
      createShareableGiftUrl,
      isGiftViewMode,
    }),
    [
      content,
      updateContent,
      importContentJson,
      exportContentJson,
      resetContent,
      createShareableGiftUrl,
      isGiftViewMode,
    ],
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
