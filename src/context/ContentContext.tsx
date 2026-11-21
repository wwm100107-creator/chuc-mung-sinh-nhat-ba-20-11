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
  getBirthdayDateInfo,
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

const STORAGE_KEY = 'snvv-ba-editable-content-v4';
const LEGACY_KEYS = [
  'snvv-ba-editable-content-v4',
  'snvv-ba-editable-content-v3',
  'snvv-ba-editable-content-v2',
  'snvv-ba-editable-content-v1',
];

export function getDefaultSiteContent(): SiteContent {
  const dateInfo = getBirthdayDateInfo();
  return {
    envelope: {
      pageTitle: 'Chúc Mừng Sinh Nhật Bà Yêu Quý - 20/11',
      dateBadge: dateInfo.badgeText,
      recipientTitle: 'Kính gửi Bà yêu quý',
      envelopeSubtitle: 'Vuốt nhẹ trang giấy để lật mở từng chương kỷ niệm',
      scrollHint1: 'Vuốt nhẹ lên để lật mở từng trang',
      welcomeBadge: 'Ngày Sinh Nhật Đặc Biệt · 20 Tháng 11',
      welcomeTitleTop: 'Chúc Mừng Sinh Nhật',
      welcomeTitleHighlight: 'Bà Yêu Quý',
      welcomeDescription: `${dateInfo.subStatusText}. Mỗi trang giấy màu nước tiếp theo là một lời chúc bình an con cháu vẽ dành tặng riêng Bà.`,
      scrollHint2: 'Vuốt tiếp xuống để mở cuộn thư chúc mừng Bà',
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
      cardFooterHint: 'Cuộn nhẹ xuống để lật mở lời chúc tiếp theo',
      items: BLESSINGS_LIST.map((item) => ({ ...item })),
      secretGift: {
        wreathCenterLabel: 'Món Quà 7',
        ...SECRET_SEVENTH_BLESSING,
      },
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

function hasCustomUserEdits(candidate: SiteContent, def: SiteContent): boolean {
  if (candidate.envelope.recipientTitle !== def.envelope.recipientTitle) return true;
  if (candidate.envelope.welcomeTitleHighlight !== def.envelope.welcomeTitleHighlight) return true;
  if (candidate.letter.salutation !== def.letter.salutation) return true;
  if (candidate.letter.signature !== def.letter.signature) return true;
  if (JSON.stringify(candidate.letter.paragraphs) !== JSON.stringify(def.letter.paragraphs)) return true;
  if (JSON.stringify(candidate.blessings.items) !== JSON.stringify(def.blessings.items)) return true;
  if (candidate.blessings.secretGift.message !== def.blessings.secretGift.message) return true;
  if (candidate.cake.wishTitle !== def.cake.wishTitle) return true;
  if (candidate.cake.wishMessage !== def.cake.wishMessage) return true;
  if (JSON.stringify(candidate.finale.lanterns) !== JSON.stringify(def.finale.lanterns)) return true;
  if (JSON.stringify(candidate.finale.poemLines) !== JSON.stringify(def.finale.poemLines)) return true;
  if (candidate.finale.footerText !== def.finale.footerText) return true;
  return false;
}

function loadBestSavedContent(def: SiteContent): SiteContent {
  // Check v4 -> v3 -> v2 -> v1 and prioritize the newest key that actually contains custom user edits
  let fallbackParsed: SiteContent | null = null;
  for (const key of LEGACY_KEYS) {
    try {
      const raw = window.localStorage.getItem(key);
      if (!raw) continue;
      const parsed = JSON.parse(raw) as Partial<SiteContent>;
      const merged = mergeWithDefaults(parsed);
      if (hasCustomUserEdits(merged, def)) {
        return merged;
      }
      if (!fallbackParsed) {
        fallbackParsed = merged;
      }
    } catch {
      // Ignore corrupt key
    }
  }
  return fallbackParsed ?? def;
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

    return loadBestSavedContent(def);
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
      for (const key of LEGACY_KEYS) {
        window.localStorage.removeItem(key);
      }
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
