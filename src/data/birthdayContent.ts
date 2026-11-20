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
      badgeText: 'Hôm nay là ngày thật đặc biệt · 20 Tháng 11',
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

export const LETTER_CONTENT = {
  salutation: 'Kính gửi Bà yêu quý của cháu,',
  paragraphs: [
    'Tháng mười một về mang theo gió se lạnh đầu đông và những chùm cúc vàng rực rỡ nơi góc sân, cũng là ngày đặc biệt mà cả nhà luôn mong chờ — ngày sinh nhật của Bà.',
    'Trong ký ức của cháu, lúc nào Bà cũng hiện lên thật hiền hậu: từ bàn tay tảo tần chắt chiu từng bữa cơm nóng hổi, giọng nói ấm áp dặn dò mỗi khi trời trở gió, cho đến nụ cười rạng rỡ mỗi lần con cháu quây quần đông đủ dưới mái nhà.',
    'Nhân dịp sinh nhật 20 tháng 11 năm nay, cháu chẳng mong gì hơn ngoài việc Bà luôn dồi dào sức khỏe, ăn ngon giấc tròn, lòng luôn thanh thản bình an và sống thật vui vẻ trường thọ bên con cháu.',
    'Cảm ơn Bà vì đã luôn là điểm tựa êm đềm nhất, là ngọn đèn ấm áp sưởi ấm cả gia đình qua bao năm tháng.',
  ],
  closing: 'Cháu thương và kính chúc Bà thật nhiều sức khỏe,',
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
    subtitle: 'Chạm để mở lời chúc',
    message:
      'Chúc Bà sớm hôm thư thái, tâm hồn nhẹ nhàng như tách trà ấm buổi sáng, mọi muộn phiền đều tan biến theo gió thu.',
    accent: 'crimson',
  },
  {
    id: 'suc-khoe',
    sealLabel: 'Chữ Khang',
    title: 'Sức Khỏe Dồi Dào',
    subtitle: 'Chạm để mở lời chúc',
    message:
      'Mong Bà luôn mạnh khỏe, bước chân vững vàng, ăn cơm thật ngon miệng và ngủ một giấc thật sâu mỗi tối.',
    accent: 'tea',
  },
  {
    id: 'truong-tho',
    sealLabel: 'Chữ Thọ',
    title: 'Phúc Thọ Trường Tồn',
    subtitle: 'Chạm để mở lời chúc',
    message:
      'Chúc Bà phúc như Đông Hải, thọ tỷ Nam Sơn — mái tóc bạc vẫn rạng ngời bên con cháu qua thật nhiều mùa hoa cúc nở.',
    accent: 'gold',
  },
  {
    id: 'niem-vui',
    sealLabel: 'Chữ Hỷ',
    title: 'Tiếng Cười Rạng Rỡ',
    subtitle: 'Chạm để mở lời chúc',
    message:
      'Mong nụ cười hiền từ của Bà luôn nở trên môi mỗi ngày, để niềm vui nho nhỏ luôn gõ cửa hiên nhà.',
    accent: 'crimson',
  },
  {
    id: 'sum-vay',
    sealLabel: 'Chữ Hòa',
    title: 'Gia Đình Sum Vầy',
    subtitle: 'Chạm để mở lời chúc',
    message:
      'Chúc ngôi nhà của Bà luôn rộn rã tiếng trò chuyện, mỗi dịp lễ Tết hay cuối tuần con cháu lại quây quần đông đủ.',
    accent: 'tea',
  },
  {
    id: 'am-ap',
    sealLabel: 'Chữ Phúc',
    title: 'Trọn Vẹn Yêu Thương',
    subtitle: 'Chạm để mở lời chúc',
    message:
      'Bà là kho báu lớn nhất của cả gia đình. Chúc Bà luôn cảm nhận được tình thương yêu ấm áp từ tất cả con cháu.',
    accent: 'gold',
  },
];

export const SECRET_SEVENTH_BLESSING = {
  badge: 'Món Quà Thứ Bảy Dành Riêng Cho Bà',
  title: 'Ngàn Lời Cảm Ơn Không Kể Xiết',
  message:
    'Dù thời gian có trôi qua bao mùa thu 20 tháng 11, với cháu và cả gia đình, nụ cười khỏe mạnh của Bà vẫn mãi là món quà quý giá nhất trên đời. Chúc mừng sinh nhật Bà thật hạnh phúc!',
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
    sender: 'Cháu yêu',
    message: 'Chúc Bà sinh nhật 20/11 thật nhiều sức khỏe và luôn cười thật tươi ạ!',
    tone: 'amber',
    createdAt: 1,
  },
  {
    id: 'l-2',
    sender: 'Cả gia đình',
    message: 'Mong Bà mãi bình an, sống lâu trăm tuổi làm điểm tựa ấm áp cho con cháu.',
    tone: 'coral',
    createdAt: 2,
  },
  {
    id: 'l-3',
    sender: 'Con cháu phương xa',
    message: 'Dù ở đâu con cháu vẫn luôn nhớ những bữa cơm ấm nóng tay Bà nấu.',
    tone: 'ivory',
    createdAt: 3,
  },
  {
    id: 'l-4',
    sender: 'Mùa thu 20/11',
    message: 'Chúc Bà ngủ ngon giấc tròn, sáng dậy đón nắng vàng nhẹ nhàng và thư thái.',
    tone: 'amber',
    createdAt: 4,
  },
  {
    id: 'l-5',
    sender: 'Bình an',
    message: 'Gửi ngàn đóa hoa cúc vàng chúc Bà thêm tuổi mới an nhiên tự tại.',
    tone: 'coral',
    createdAt: 5,
  },
];

export const QUICK_WISH_SUGGESTIONS: string[] = [
  'Chúc Bà luôn mạnh khỏe, an vui mỗi ngày!',
  'Chúc Bà sống lâu trăm tuổi bên con cháu!',
  'Mỗi ngày đều là một ngày thật bình an với Bà!',
  'Con cháu thương Bà thật nhiều, chúc mừng sinh nhật Bà!',
];

export const CLOSING_POEM: string[] = [
  'Tháng mười một gió thu sang,',
  'Nắng vương sắc thắm cúc vàng trước hiên.',
  'Chúc Bà tuổi mới bình yên,',
  'Sống lâu mạnh khỏe, sum vầy cháu con.',
];
