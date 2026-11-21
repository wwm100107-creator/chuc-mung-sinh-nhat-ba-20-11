export interface BirthdayDateInfo {
  isBirthdayToday: boolean;
  badgeText: string;
  subStatusText: string;
}

export function getBirthdayDateInfo(now: Date = new Date()): BirthdayDateInfo {
  const month = now.getMonth(); // 0-indexed: 10 is November
  const day = now.getDate();

  if (month === 10 && day === 20) {
    return {
      isBirthdayToday: true,
      badgeText: 'Kỷ niệm ngày sinh nhật Bà · 20 Tháng 11',
      subStatusText: 'Cả nhà quây quần chúc mừng sinh nhật Bà yêu quý',
    };
  }

  const currentYear = now.getFullYear();
  const todayMidnight = new Date(currentYear, month, day);
  let target = new Date(currentYear, 10, 20);
  if (target < todayMidnight) {
    target = new Date(currentYear + 1, 10, 20);
  }
  const diffDays = Math.round((target.getTime() - todayMidnight.getTime()) / (1000 * 60 * 60 * 24));

  return {
    isBirthdayToday: false,
    badgeText: 'Kỷ niệm ngày sinh nhật Bà · 20 Tháng 11',
    subStatusText: `Còn ${diffDays} ngày nữa là tới ngày 20 tháng 11 ấm áp bên Bà`,
  };
}

export interface ChapterMeta {
  id: string;
  num: string;
  shortLabel: string;
  fullLabel: string;
}

export const CHAPTERS_META: ChapterMeta[] = [
  { id: 'chuong-1-mo-thiep', num: '01', shortLabel: 'Mở thiệp', fullLabel: '01 Mở Thiệp' },
  { id: 'chuong-3-thu-lua', num: '02', shortLabel: 'Thư lụa', fullLabel: '02 Thư Lụa' },
  { id: 'chuong-4-loi-chuc', num: '03', shortLabel: 'Lời chúc', fullLabel: '03 Lời Chúc' },
  { id: 'chuong-5-thoi-nen', num: '04', shortLabel: 'Bánh & Nến', fullLabel: '04 Bánh & Nến' },
  { id: 'chuong-6-hoa-dang', num: '05', shortLabel: 'Hoa đăng', fullLabel: '05 Hoa Đăng' },
];

export const LETTER_CONTENT = {
  salutation: 'Kính gửi Bà yêu quý của cháu,',
  paragraphs: [
    'Tháng mười một về mang theo gió se lạnh đầu đông và những chùm cúc vàng rực rỡ nơi góc sân, cũng là ngày đặc biệt mà cả nhà luôn mong chờ - ngày sinh nhật của Bà.',
    'Nhân dịp sinh nhật 20 tháng 11 năm nay, con chẳng mong gì hơn ngoài việc Bà luôn dồi dào sức khỏe, ăn ngon giấc tròn, lòng luôn thanh thản bình an và sống thật vui vẻ trường thọ bên con cháu.',
  ],
  closing: 'Gia đình con thương và kính chúc Bà thật nhiều sức khỏe,',
  signature: 'Cháu yêu của Bà · 20/11',
};

export interface BlessingItem {
  id: string;
  sealLabel: string;
  title: string;
  subtitle: string;
  message: string;
  accent: 'crimson' | 'gold' | 'tea';
}

export const BLESSINGS_LIST: BlessingItem[] = [
  {
    id: 'binh-an',
    sealLabel: 'Chữ An',
    title: 'Bình An Mỗi Ngày',
    subtitle: 'Cuộn nhẹ để mở',
    message:
      'Chúc bà mỗi ngày đều bình an, trong lòng lúc nào cũng nhẹ nhõm. Có chuyện gì không vui, mong là cũng sẽ mau qua để bà không phải bận lòng ạ.',
    accent: 'crimson',
  },
  {
    id: 'suc-khoe',
    sealLabel: 'Chữ Khang',
    title: 'Sức Khỏe Dồi Dào',
    subtitle: 'Cuộn nhẹ để mở',
    message:
      'Chúc bà luôn mạnh khỏe, ăn uống ngon miệng, đêm nào cũng ngủ được giấc thật sâu. Mong bà đi lại nhẹ nhàng, không còn đau nhức gì nữa ạ.',
    accent: 'tea',
  },
  {
    id: 'truong-tho',
    sealLabel: 'Chữ Thọ',
    title: 'Phúc Thọ Trường Tồn',
    subtitle: 'Cuộn nhẹ để mở',
    message:
      'Chúc bà sống thật lâu, thật khỏe bên cả nhà. Mong bà còn được nhìn các cháu, các chắt lớn lên từng ngày ạ.',
    accent: 'gold',
  },
  {
    id: 'niem-vui',
    sealLabel: 'Chữ Hỷ',
    title: 'Tiếng Cười Rạng Rỡ',
    subtitle: 'Cuộn nhẹ để mở',
    message:
      'Mong ngày nào bà cũng có chuyện vui, lúc nào cũng tươi cười. Chỉ cần thấy bà vui là cả nhà mình cũng vui theo rồi ạ.',
    accent: 'crimson',
  },
  {
    id: 'sum-vay',
    sealLabel: 'Chữ Hòa',
    title: 'Gia Đình Sum Vầy',
    subtitle: 'Cuộn nhẹ để mở',
    message:
      'Chúc nhà mình luôn êm ấm, anh chị em lúc nào cũng thương yêu nhau. Mong nhà bà lúc nào cũng đông đủ con cháu về thăm ạ.',
    accent: 'tea',
  },
  {
    id: 'am-ap',
    sealLabel: 'Chữ Phúc',
    title: 'Trọn Vẹn Yêu Thương',
    subtitle: 'Cuộn nhẹ để mở',
    message:
      'Bà là người cả nhà thương nhất. Dù con cháu có đi xa đến đâu, trong lòng mọi người lúc nào cũng có bà ạ.',
    accent: 'gold',
  },
];

export const SECRET_SEVENTH_BLESSING = {
  wreathCenterLabel: 'Tình yêu thương to lớn',
  badge: 'Món Quà Dành Riêng Cho Bà',
  title: 'Ngàn Lời Cảm Ơn Không Kể Xiết',
  message:
    'Cả đời bà lo cho con cho cháu mà chưa bao giờ kể công. Có nhiều điều bà làm mà không nói ra, đến giờ lớn rồi con cháu mới hiểu hết. Hôm nay con cháu chỉ muốn nói với bà: cảm ơn bà nhiều lắm, cả nhà thương bà lắm ạ.',
};

export interface LanternWish {
  id: string;
  sender: string;
  message: string;
  tone: 'amber' | 'coral' | 'ivory';
  createdAt: number;
}

export const INITIAL_LANTERNS: LanternWish[] = [
  {
    id: 'l-1',
    sender: 'Cháu Uy siêu đẹp trai',
    message: 'Chúc Bà sinh nhật 20/11 thật nhiều sức khỏe và luôn cười thật tươi ạ!',
    tone: 'amber',
    createdAt: 1,
  },
  {
    id: 'l-2',
    sender: 'Cháu Vy siêu xinh gái',
    message: 'Mong Bà mãi bình an, sống lâu trăm tuổi làm điểm tựa ấm áp cho con cháu.',
    tone: 'coral',
    createdAt: 2,
  },
  {
    id: 'l-3',
    sender: 'Cả gia đình',
    message:
      'Gia đình con chúc bà luôn mạnh khỏe, bình an bên con cháu. Với cả nhà, bà giống như ngọn đèn trong nhà, có bà là nhà mình lúc nào cũng ấm. Con cháu mong được ở bên bà thật lâu, để mỗi năm lại được cùng nhau mừng sinh nhật bà như hôm nay.',
    tone: 'ivory',
    createdAt: 3,
  },
];

export const CLOSING_POEM: string[] = [
  'Tháng mười một gió thu sang,',
  'Nắng vương sắc thắm cúc vàng trước hiên.',
  'Chúc Bà tuổi mới bình yên,',
  'Sống lâu mạnh khỏe, sum vầy cháu con.',
];
