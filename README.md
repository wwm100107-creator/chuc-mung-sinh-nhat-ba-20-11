# Thiệp Chúc Mừng Sinh Nhật Bà — 20 Tháng 11

Trang web tương tác kiểu **Scrollytelling (cuộn trang liền mạch)** kỷ niệm ngày sinh nhật Bà (**20 tháng 11**) theo phong cách **Thư Họa & Lụa Vàng**, ưu tiên tối ưu trải nghiệm vuốt/cuộn trên điện thoại và màn hình máy tính.

## 6 Chương Tương Tác Theo Nhịp Cuộn

1. **Chương 01 — Bì thư lụa niêm sáp đỏ `20·11`**: Cuộn xuống hoặc chạm dấu sáp để nắp bì thư mở dần trong không gian 3D, thiệp chúc mừng trỗi dậy kèm cánh hoa bay và nhạc hộp âm *Happy Birthday*.
2. **Chương 02 — Hương trà mùa thu**: Cửa sổ tròn nghệ thuật với vòng hoa văn xoay theo nhịp cuộn cùng 3 nhịp câu chuyện.
3. **Chương 03 — Cuộn thư lụa gửi Bà**: Cuộn thư mở ra từng đoạn văn tỏa sáng theo tiến độ cuộn (có khung đọc từng đoạn riêng thật to rõ trên điện thoại).
4. **Chương 04 — Đóa cúc 6 cánh chúc thọ**: Đóa cúc vàng xoay và bừng sáng 6 cánh tương ứng bộ thẻ lụa 3D xếp lớp (*Bình An, Sức Khỏe, Trường Thọ, Niềm Vui, Sum Vầy, Yêu Thương*) và mở khóa món quà thứ 7.
5. **Chương 05 — Đêm nến ấm & Điều ước 20/11**: Chuyển sang không gian ánh nến ấm; Bà có thể chạm từng ngọn nến, bấm thổi tắt tất cả, dùng micro, hoặc cuộn tiếp để làn gió thu thổi nến và bắn pháo hoa.
6. **Chương 06 — Đêm hoa đăng & Thơ kết**: Lướt ngang các đèn hoa đăng trên điện thoại, tự viết thêm lời chúc thả đèn mới (lưu tự động trên trình duyệt) và thanh điều hướng chương cố định dưới đáy màn hình điện thoại.

## Công nghệ sử dụng

- React 19 + TypeScript + Vite
- Custom Scroll-Driven Engine (`useScrollStory.ts` — `requestAnimationFrame` + `lerp` + CSS variables `--p`)
- Web Audio API (nhạc hộp âm & hiệu ứng âm thanh)
- HTML5 Canvas (cánh hoa cúc phản ứng theo tốc độ cuộn & đom đóm đêm hoa đăng)
- Lucide Icons & Google Fonts (`Cormorant Garamond`, `Lora`, `Be Vietnam Pro`, `Dancing Script`)

## Chạy ở máy cá nhân

```bash
npm install
npm run dev
```
