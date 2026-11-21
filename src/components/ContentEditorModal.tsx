import { useEffect, useState } from 'react';
import { useSiteContent } from '../context/ContentContext';

type EditorTab = 'all' | 'envelope' | 'letter' | 'blessings' | 'cake' | 'finale';

const TABS: Array<{ id: EditorTab; label: string }> = [
  { id: 'all', label: 'Tất Cả Từ Trên Xuống Dưới' },
  { id: 'envelope', label: '01. Mở Thiệp' },
  { id: 'letter', label: '02. Bức Thư' },
  { id: 'blessings', label: '03. 6 Lời Chúc & Quà 7' },
  { id: 'cake', label: '04. Bánh & Nến' },
  { id: 'finale', label: '05. Hoa Đăng & Thơ Kết' },
];

export function ContentEditorModal() {
  const {
    content,
    updateContent,
    resetContent,
    createShareableGiftUrl,
  } = useSiteContent();

  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<EditorTab>('all');
  const [copyStatus, setCopyStatus] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S' || e.code === 'KeyS')) {
        e.preventDefault();
        e.stopPropagation();
        setOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        setOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => {
      window.removeEventListener('keydown', handleKeyDown, { capture: true });
    };
  }, []);

  if (!open) {
    return null;
  }

  const handleCopyGiftLink = async () => {
    const url = createShareableGiftUrl();
    try {
      await navigator.clipboard.writeText(url);
      setCopyStatus('Đã sao chép link gửi tặng Bà!');
    } catch {
      window.prompt('Sao chép đường link này để gửi tặng Bà:', url);
      setCopyStatus('Đã tạo link gửi tặng Bà!');
    }
    window.setTimeout(() => setCopyStatus(null), 4000);
  };

  const showEnvelope = activeTab === 'all' || activeTab === 'envelope';
  const showLetter = activeTab === 'all' || activeTab === 'letter';
  const showBlessings = activeTab === 'all' || activeTab === 'blessings';
  const showCake = activeTab === 'all' || activeTab === 'cake';
  const showFinale = activeTab === 'all' || activeTab === 'finale';

  return (
    <div
      className="editor-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="editor-dialog-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setOpen(false);
        }
      }}
    >
      <div className="storybook-sheet editor-modal">
        <header className="editor-header">
          <div>
            <h2 id="editor-dialog-title" className="editor-title">
              Chỉnh Sửa Câu Chữ Theo Thứ Tự Từ Trên Xuống Dưới (Ctrl + S)
            </h2>
            <p className="editor-subtitle">
              Các ô chữ bên dưới được xếp đúng y chang thứ tự hiển thị ngoài trang để dễ đối chiếu. Ấn Ctrl + S, Esc hoặc Đóng để ẩn.
            </p>
          </div>
          <button
            type="button"
            className="editor-close-btn"
            onClick={() => setOpen(false)}
            aria-label="Đóng bảng chỉnh sửa"
          >
            Đóng ✕
          </button>
        </header>

        <nav className="editor-tabs" aria-label="Lọc theo chương cần sửa">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              className={`editor-tab-btn ${activeTab === t.id ? 'is-active' : ''}`}
              onClick={() => setActiveTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </nav>

        <div className="editor-body">
          <div className="editor-fields">
            {/* =================================================
                CHƯƠNG 1: PHONG THƯ MỞ ĐẦU & TRANG CHÀO MỪNG
                ================================================= */}
            {showEnvelope && (
              <section className="editor-chapter-block">
                <h3 className="editor-chapter-heading">
                  Chương 1 · Phong Thư Mở Đầu &amp; Trang Chào Mừng
                </h3>

                <div className="field-group">
                  <label>Tiêu đề thanh tab trình duyệt (trên cùng cửa sổ web)</label>
                  <input
                    type="text"
                    className="field-input"
                    value={content.envelope.pageTitle}
                    onChange={(e) =>
                      updateContent((prev) => ({
                        ...prev,
                        envelope: { ...prev.envelope, pageTitle: e.target.value },
                      }))
                    }
                  />
                </div>

                {/* Mặt 1A: Phong thư ban đầu */}
                <div className="editor-subcard">
                  <h4>Màn hình 1A · Mặt Phong Thư Ban Đầu</h4>

                  <div className="field-group">
                    <label>1. Nhãn ngày tháng trên cùng</label>
                    <input
                      type="text"
                      className="field-input editor-input-badge"
                      value={content.envelope.dateBadge}
                      onChange={(e) =>
                        updateContent((prev) => ({
                          ...prev,
                          envelope: { ...prev.envelope, dateBadge: e.target.value },
                        }))
                      }
                    />
                  </div>

                  <div className="field-group">
                    <label>2. Dòng chữ thư pháp lớn</label>
                    <input
                      type="text"
                      className="field-input editor-input-title"
                      value={content.envelope.recipientTitle}
                      onChange={(e) =>
                        updateContent((prev) => ({
                          ...prev,
                          envelope: { ...prev.envelope, recipientTitle: e.target.value },
                        }))
                      }
                    />
                  </div>

                  <div className="field-group">
                    <label>3. Dòng phụ dưới tiêu đề</label>
                    <input
                      type="text"
                      className="field-input"
                      value={content.envelope.envelopeSubtitle}
                      onChange={(e) =>
                        updateContent((prev) => ({
                          ...prev,
                          envelope: { ...prev.envelope, envelopeSubtitle: e.target.value },
                        }))
                      }
                    />
                  </div>

                  <div className="editor-visual-marker">
                    <span>[ Tranh màu nước: Phong thư thắt nơ hoa cúc ]</span>
                  </div>

                  <div className="field-group">
                    <label>4. Dòng nhắc cuộn bên dưới phong thư</label>
                    <input
                      type="text"
                      className="field-input"
                      value={content.envelope.scrollHint1}
                      onChange={(e) =>
                        updateContent((prev) => ({
                          ...prev,
                          envelope: { ...prev.envelope, scrollHint1: e.target.value },
                        }))
                      }
                    />
                  </div>
                </div>

                {/* Mặt 1B: Thẻ chào mừng sau khi mở phong thư */}
                <div className="editor-subcard">
                  <h4>Màn hình 1B · Thẻ Chào Mừng (Hiện Ra Khi Mở Phong Thư)</h4>

                  <div className="field-group">
                    <label>1. Nhãn trên cùng thẻ chào mừng</label>
                    <input
                      type="text"
                      className="field-input editor-input-badge"
                      value={content.envelope.welcomeBadge}
                      onChange={(e) =>
                        updateContent((prev) => ({
                          ...prev,
                          envelope: { ...prev.envelope, welcomeBadge: e.target.value },
                        }))
                      }
                    />
                  </div>

                  <div className="editor-visual-marker">
                    <span>[ Tranh màu nước: Hoa cúc vàng &amp; ấm trà xanh ]</span>
                  </div>

                  <div className="field-group">
                    <label>2. Tiêu đề chính dòng 1</label>
                    <input
                      type="text"
                      className="field-input editor-input-title"
                      value={content.envelope.welcomeTitleTop}
                      onChange={(e) =>
                        updateContent((prev) => ({
                          ...prev,
                          envelope: { ...prev.envelope, welcomeTitleTop: e.target.value },
                        }))
                      }
                    />
                  </div>

                  <div className="field-group">
                    <label>3. Tiêu đề nhấn mạnh dòng 2 (màu đỏ son)</label>
                    <input
                      type="text"
                      className="field-input editor-input-title"
                      value={content.envelope.welcomeTitleHighlight}
                      onChange={(e) =>
                        updateContent((prev) => ({
                          ...prev,
                          envelope: {
                            ...prev.envelope,
                            welcomeTitleHighlight: e.target.value,
                          },
                        }))
                      }
                    />
                  </div>

                  <div className="field-group">
                    <label>4. Đoạn lời dẫn bên dưới tiêu đề</label>
                    <textarea
                      rows={3}
                      className="field-input"
                      value={content.envelope.welcomeDescription}
                      onChange={(e) =>
                        updateContent((prev) => ({
                          ...prev,
                          envelope: { ...prev.envelope, welcomeDescription: e.target.value },
                        }))
                      }
                    />
                  </div>

                  <div className="field-group">
                    <label>5. Dòng nhắc cuộn ở dưới cùng thẻ chào mừng</label>
                    <input
                      type="text"
                      className="field-input"
                      value={content.envelope.scrollHint2}
                      onChange={(e) =>
                        updateContent((prev) => ({
                          ...prev,
                          envelope: { ...prev.envelope, scrollHint2: e.target.value },
                        }))
                      }
                    />
                  </div>
                </div>
              </section>
            )}

            {/* =================================================
                CHƯƠNG 2: CUỘN THƯ LỤA & CON DẤU TRIỆN ĐỎ
                ================================================= */}
            {showLetter && (
              <section className="editor-chapter-block">
                <h3 className="editor-chapter-heading">
                  Chương 2 · Cuộn Thư Lụa &amp; Con Dấu Triện Đỏ
                </h3>

                <div className="editor-visual-marker">
                  <span>[ Tranh màu nước: Cuộn thư tre &amp; bút lông ]</span>
                </div>

                <div className="editor-subcard">
                  <h4>Đầu Thư &amp; Con Dấu Đỏ Góc Phải</h4>

                  <div className="field-group">
                    <label>1. Lời thưa đầu thư (chữ thư pháp bên trái)</label>
                    <input
                      type="text"
                      className="field-input editor-input-title"
                      value={content.letter.salutation}
                      onChange={(e) =>
                        updateContent((prev) => ({
                          ...prev,
                          letter: { ...prev.letter, salutation: e.target.value },
                        }))
                      }
                    />
                  </div>

                  <div className="field-group">
                    <label>2. Con dấu triện đỏ góc phải — dòng trên (ví dụ: 20)</label>
                    <input
                      type="text"
                      className="field-input editor-input-badge"
                      value={content.letter.sealTop}
                      onChange={(e) =>
                        updateContent((prev) => ({
                          ...prev,
                          letter: { ...prev.letter, sealTop: e.target.value },
                        }))
                      }
                    />
                  </div>

                  <div className="field-group">
                    <label>3. Con dấu triện đỏ góc phải — dòng dưới (ví dụ: Th11)</label>
                    <input
                      type="text"
                      className="field-input editor-input-badge"
                      value={content.letter.sealBottom}
                      onChange={(e) =>
                        updateContent((prev) => ({
                          ...prev,
                          letter: { ...prev.letter, sealBottom: e.target.value },
                        }))
                      }
                    />
                  </div>
                </div>

                {content.letter.paragraphs.map((para, idx) => (
                  <div key={idx} className="editor-subcard">
                    <div className="editor-subcard-header">
                      <h4>Đoạn thư số {idx + 1}</h4>
                      {content.letter.paragraphs.length > 1 && (
                        <button
                          type="button"
                          className="editor-remove-btn"
                          onClick={() =>
                            updateContent((prev) => ({
                              ...prev,
                              letter: {
                                ...prev.letter,
                                paragraphs: prev.letter.paragraphs.filter((_, i) => i !== idx),
                              },
                            }))
                          }
                        >
                          Xóa đoạn này
                        </button>
                      )}
                    </div>
                    <div className="field-group">
                      <textarea
                        rows={3}
                        className="field-input"
                        value={para}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateContent((prev) => ({
                            ...prev,
                            letter: {
                              ...prev.letter,
                              paragraphs: prev.letter.paragraphs.map((p, i) =>
                                i === idx ? val : p,
                              ),
                            },
                          }));
                        }}
                      />
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  className="editor-add-btn"
                  onClick={() =>
                    updateContent((prev) => ({
                      ...prev,
                      letter: {
                        ...prev.letter,
                        paragraphs: [
                          ...prev.letter.paragraphs,
                          'Con cháu kính chúc Bà luôn thật nhiều sức khỏe, bình an và vui vầy bên gia đình.',
                        ],
                      },
                    }))
                  }
                >
                  + Thêm Đoạn Thư Mới
                </button>

                <div className="editor-subcard">
                  <h4>Cuối Thư &amp; Chữ Ký</h4>

                  <div className="field-group">
                    <label>Lời chúc kết thư (dòng phía trên chữ ký)</label>
                    <input
                      type="text"
                      className="field-input"
                      value={content.letter.closing}
                      onChange={(e) =>
                        updateContent((prev) => ({
                          ...prev,
                          letter: { ...prev.letter, closing: e.target.value },
                        }))
                      }
                    />
                  </div>

                  <div className="field-group">
                    <label>Chữ ký cuối thư (chữ thư pháp dưới cùng)</label>
                    <input
                      type="text"
                      className="field-input editor-input-title"
                      value={content.letter.signature}
                      onChange={(e) =>
                        updateContent((prev) => ({
                          ...prev,
                          letter: { ...prev.letter, signature: e.target.value },
                        }))
                      }
                    />
                  </div>
                </div>
              </section>
            )}

            {/* =================================================
                CHƯƠNG 3: VÒNG HOA 6 LỜI CHÚC VÀNG & QUÀ THỨ 7
                ================================================= */}
            {showBlessings && (
              <section className="editor-chapter-block">
                <h3 className="editor-chapter-heading">
                  Chương 3 · Vòng Hoa Cúc Sáu Lời Chúc Vàng &amp; Món Quà Thứ Bảy
                </h3>

                <div className="field-group">
                  <label>1. Dòng nhãn phụ trên cùng Chương 3</label>
                  <input
                    type="text"
                    className="field-input editor-input-badge"
                    value={content.blessings.sectionKicker}
                    onChange={(e) =>
                      updateContent((prev) => ({
                        ...prev,
                        blessings: { ...prev.blessings, sectionKicker: e.target.value },
                      }))
                    }
                  />
                </div>

                <div className="field-group">
                  <label>2. Tiêu đề chính Chương 3</label>
                  <input
                    type="text"
                    className="field-input editor-input-title"
                    value={content.blessings.sectionTitle}
                    onChange={(e) =>
                      updateContent((prev) => ({
                        ...prev,
                        blessings: { ...prev.blessings, sectionTitle: e.target.value },
                      }))
                    }
                  />
                </div>

                <div className="field-group">
                  <label>3. Dòng mô tả ngay dưới tiêu đề Chương 3</label>
                  <input
                    type="text"
                    className="field-input"
                    value={content.blessings.sectionDesc}
                    onChange={(e) =>
                      updateContent((prev) => ({
                        ...prev,
                        blessings: { ...prev.blessings, sectionDesc: e.target.value },
                      }))
                    }
                  />
                </div>

                <div className="editor-visual-marker">
                  <span>[ Tranh màu nước: Vòng hoa cúc xoay &amp; 6 tấm thiệp 3D ]</span>
                </div>

                <div className="field-group">
                  <label>Chữ chung đứng trước số thứ tự trên đầu mỗi thẻ (ví dụ: Lời chúc)</label>
                  <input
                    type="text"
                    className="field-input editor-input-badge"
                    value={content.blessings.cardBadgePrefix}
                    onChange={(e) =>
                      updateContent((prev) => ({
                        ...prev,
                        blessings: { ...prev.blessings, cardBadgePrefix: e.target.value },
                      }))
                    }
                  />
                </div>

                {content.blessings.items.map((item, idx) => (
                  <div key={item.id} className="editor-subcard">
                    <div className="editor-subcard-header">
                      <h4>Tấm thẻ lời chúc 0{idx + 1}</h4>
                      {content.blessings.items.length > 1 && (
                        <button
                          type="button"
                          className="editor-remove-btn"
                          onClick={() =>
                            updateContent((prev) => ({
                              ...prev,
                              blessings: {
                                ...prev.blessings,
                                items: prev.blessings.items.filter((_, i) => i !== idx),
                              },
                            }))
                          }
                        >
                          Xóa thẻ này
                        </button>
                      )}
                    </div>

                    <div className="field-group">
                      <label>Tên ấn chữ (hiện ở giữa vòng hoa &amp; góc trên thẻ)</label>
                      <input
                        type="text"
                        className="field-input editor-input-badge"
                        value={item.sealLabel}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateContent((prev) => ({
                            ...prev,
                            blessings: {
                              ...prev.blessings,
                              items: prev.blessings.items.map((it, i) =>
                                i === idx ? { ...it, sealLabel: val } : it,
                              ),
                            },
                          }));
                        }}
                      />
                    </div>

                    <div className="field-group">
                      <label>Tiêu đề lớn của thẻ lời chúc 0{idx + 1}</label>
                      <input
                        type="text"
                        className="field-input editor-input-title"
                        value={item.title}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateContent((prev) => ({
                            ...prev,
                            blessings: {
                              ...prev.blessings,
                              items: prev.blessings.items.map((it, i) =>
                                i === idx ? { ...it, title: val } : it,
                              ),
                            },
                          }));
                        }}
                      />
                    </div>

                    <div className="field-group">
                      <label>Đoạn lời chúc bên dưới tiêu đề</label>
                      <textarea
                        rows={2}
                        className="field-input"
                        value={item.message}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateContent((prev) => ({
                            ...prev,
                            blessings: {
                              ...prev.blessings,
                              items: prev.blessings.items.map((it, i) =>
                                i === idx ? { ...it, message: val } : it,
                              ),
                            },
                          }));
                        }}
                      />
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  className="editor-add-btn"
                  onClick={() =>
                    updateContent((prev) => ({
                      ...prev,
                      blessings: {
                        ...prev.blessings,
                        items: [
                          ...prev.blessings.items,
                          {
                            id: `blessing-${Date.now()}`,
                            sealLabel: 'Chữ Tâm',
                            title: 'Tâm An Vạn Sự Lành',
                            subtitle: 'Bình an mỗi ngày',
                            message:
                              'Kính chúc Bà mỗi ngày đều an vui, mạnh khỏe và tràn ngập tiếng cười bên con cháu.',
                            accent: 'gold',
                          },
                        ],
                      },
                    }))
                  }
                >
                  + Thêm Tấm Thẻ Lời Chúc Mới
                </button>

                <div className="field-group">
                  <label>Dòng hướng dẫn chung nằm ở chân mỗi tấm thẻ lời chúc</label>
                  <input
                    type="text"
                    className="field-input"
                    value={content.blessings.cardFooterHint}
                    onChange={(e) =>
                      updateContent((prev) => ({
                        ...prev,
                        blessings: { ...prev.blessings, cardFooterHint: e.target.value },
                      }))
                    }
                  />
                </div>

                <div className="editor-subcard">
                  <h4>Thẻ Cuối Chương 3 · Món Quà Thứ Bảy Đặc Biệt</h4>

                  <div className="field-group">
                    <label>1. Chữ hiện ở tâm vòng hoa cúc (ví dụ: Món Quà 7)</label>
                    <input
                      type="text"
                      className="field-input editor-input-badge"
                      value={content.blessings.secretGift.wreathCenterLabel}
                      onChange={(e) =>
                        updateContent((prev) => ({
                          ...prev,
                          blessings: {
                            ...prev.blessings,
                            secretGift: {
                              ...prev.blessings.secretGift,
                              wreathCenterLabel: e.target.value,
                            },
                          },
                        }))
                      }
                    />
                  </div>

                  <div className="field-group">
                    <label>2. Nhãn nhỏ trên đầu thẻ món quà thứ 7</label>
                    <input
                      type="text"
                      className="field-input editor-input-badge"
                      value={content.blessings.secretGift.badge}
                      onChange={(e) =>
                        updateContent((prev) => ({
                          ...prev,
                          blessings: {
                            ...prev.blessings,
                            secretGift: {
                              ...prev.blessings.secretGift,
                              badge: e.target.value,
                            },
                          },
                        }))
                      }
                    />
                  </div>

                  <div className="field-group">
                    <label>3. Tiêu đề lớn món quà thứ 7</label>
                    <input
                      type="text"
                      className="field-input editor-input-title"
                      value={content.blessings.secretGift.title}
                      onChange={(e) =>
                        updateContent((prev) => ({
                          ...prev,
                          blessings: {
                            ...prev.blessings,
                            secretGift: {
                              ...prev.blessings.secretGift,
                              title: e.target.value,
                            },
                          },
                        }))
                      }
                    />
                  </div>

                  <div className="field-group">
                    <label>4. Đoạn nội dung món quà thứ 7</label>
                    <textarea
                      rows={3}
                      className="field-input"
                      value={content.blessings.secretGift.message}
                      onChange={(e) =>
                        updateContent((prev) => ({
                          ...prev,
                          blessings: {
                            ...prev.blessings,
                            secretGift: {
                              ...prev.blessings.secretGift,
                              message: e.target.value,
                            },
                          },
                        }))
                      }
                    />
                  </div>
                </div>
              </section>
            )}

            {/* =================================================
                CHƯƠNG 4: CHIẾC BÁNH KEM MÀU NƯỚC & THẮP NẾN
                ================================================= */}
            {showCake && (
              <section className="editor-chapter-block">
                <h3 className="editor-chapter-heading">
                  Chương 4 · Chiếc Bánh Kem Màu Nước &amp; Thắp Nến
                </h3>

                <div className="field-group">
                  <label>1. Dòng nhãn phụ trên cùng Chương 4</label>
                  <input
                    type="text"
                    className="field-input editor-input-badge"
                    value={content.cake.sectionKicker}
                    onChange={(e) =>
                      updateContent((prev) => ({
                        ...prev,
                        cake: { ...prev.cake, sectionKicker: e.target.value },
                      }))
                    }
                  />
                </div>

                <div className="field-group">
                  <label>2. Tiêu đề chính Chương 4</label>
                  <input
                    type="text"
                    className="field-input editor-input-title"
                    value={content.cake.sectionTitle}
                    onChange={(e) =>
                      updateContent((prev) => ({
                        ...prev,
                        cake: { ...prev.cake, sectionTitle: e.target.value },
                      }))
                    }
                  />
                </div>

                <div className="field-group">
                  <label>3. Dòng mô tả ngay dưới tiêu đề Chương 4</label>
                  <textarea
                    rows={2}
                    className="field-input"
                    value={content.cake.sectionDesc}
                    onChange={(e) =>
                      updateContent((prev) => ({
                        ...prev,
                        cake: { ...prev.cake, sectionDesc: e.target.value },
                      }))
                    }
                  />
                </div>

                <div className="editor-visual-marker">
                  <span>[ Hoạt ảnh màu nước: Tạo từng tầng bánh, chảy kem &amp; thắp 5 ngọn nến ]</span>
                </div>

                <div className="editor-subcard">
                  <h4>Thẻ Lời Chúc Hiện Ra Ngay Bên Dưới Chiếc Bánh</h4>

                  <div className="field-group">
                    <label>4. Tiêu đề lời chúc dưới chiếc bánh</label>
                    <input
                      type="text"
                      className="field-input editor-input-title"
                      value={content.cake.wishTitle}
                      onChange={(e) =>
                        updateContent((prev) => ({
                          ...prev,
                          cake: { ...prev.cake, wishTitle: e.target.value },
                        }))
                      }
                    />
                  </div>

                  <div className="field-group">
                    <label>5. Đoạn văn lời chúc dưới chiếc bánh</label>
                    <textarea
                      rows={3}
                      className="field-input"
                      value={content.cake.wishMessage}
                      onChange={(e) =>
                        updateContent((prev) => ({
                          ...prev,
                          cake: { ...prev.cake, wishMessage: e.target.value },
                        }))
                      }
                    />
                  </div>
                </div>
              </section>
            )}

            {/* =================================================
                CHƯƠNG 5: HỒ HOA ĐĂNG, LỜI THƠ KẾT & CHÂN TRANG
                ================================================= */}
            {showFinale && (
              <section className="editor-chapter-block">
                <h3 className="editor-chapter-heading">
                  Chương 5 · Hồ Hoa Đăng, Lời Thơ Kết &amp; Chân Trang
                </h3>

                <div className="field-group">
                  <label>1. Dòng nhãn phụ trên cùng Hồ Hoa Đăng</label>
                  <input
                    type="text"
                    className="field-input editor-input-badge"
                    value={content.finale.lanternKicker}
                    onChange={(e) =>
                      updateContent((prev) => ({
                        ...prev,
                        finale: { ...prev.finale, lanternKicker: e.target.value },
                      }))
                    }
                  />
                </div>

                <div className="field-group">
                  <label>2. Tiêu đề chính Hồ Hoa Đăng</label>
                  <input
                    type="text"
                    className="field-input editor-input-title"
                    value={content.finale.lanternTitle}
                    onChange={(e) =>
                      updateContent((prev) => ({
                        ...prev,
                        finale: { ...prev.finale, lanternTitle: e.target.value },
                      }))
                    }
                  />
                </div>

                <div className="field-group">
                  <label>3. Dòng mô tả ngay dưới tiêu đề Hồ Hoa Đăng</label>
                  <textarea
                    rows={2}
                    className="field-input"
                    value={content.finale.lanternDesc}
                    onChange={(e) =>
                      updateContent((prev) => ({
                        ...prev,
                        finale: { ...prev.finale, lanternDesc: e.target.value },
                      }))
                    }
                  />
                </div>

                <div className="editor-visual-marker">
                  <span>[ Tranh màu nước: Đèn hoa đăng hoa sen nổi trên mặt hồ ]</span>
                </div>

                {content.finale.lanterns.map((lantern, idx) => (
                  <div key={lantern.id} className="editor-subcard">
                    <div className="editor-subcard-header">
                      <h4>Thẻ đèn hoa đăng số 0{idx + 1}</h4>
                      {content.finale.lanterns.length > 1 && (
                        <button
                          type="button"
                          className="editor-remove-btn"
                          onClick={() =>
                            updateContent((prev) => ({
                              ...prev,
                              finale: {
                                ...prev.finale,
                                lanterns: prev.finale.lanterns.filter((_, i) => i !== idx),
                              },
                            }))
                          }
                        >
                          Xóa đèn này
                        </button>
                      )}
                    </div>

                    <div className="field-group">
                      <label>Tên người gửi (dòng trên cùng của thẻ đèn)</label>
                      <input
                        type="text"
                        className="field-input editor-input-badge"
                        value={lantern.sender}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateContent((prev) => ({
                            ...prev,
                            finale: {
                              ...prev.finale,
                              lanterns: prev.finale.lanterns.map((l, i) =>
                                i === idx ? { ...l, sender: val } : l,
                              ),
                            },
                          }));
                        }}
                      />
                    </div>

                    <div className="field-group">
                      <label>Lời chúc (dòng nội dung bên dưới tên người gửi)</label>
                      <textarea
                        rows={2}
                        className="field-input"
                        value={lantern.message}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateContent((prev) => ({
                            ...prev,
                            finale: {
                              ...prev.finale,
                              lanterns: prev.finale.lanterns.map((l, i) =>
                                i === idx ? { ...l, message: val } : l,
                              ),
                            },
                          }));
                        }}
                      />
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  className="editor-add-btn"
                  onClick={() =>
                    updateContent((prev) => ({
                      ...prev,
                      finale: {
                        ...prev.finale,
                        lanterns: [
                          ...prev.finale.lanterns,
                          {
                            id: `lantern-${Date.now()}`,
                            sender: 'Con cháu trong nhà',
                            message:
                              'Kính chúc Bà sinh nhật 20/11 thật nhiều sức khỏe, niềm vui và bình an mỗi ngày.',
                            createdAt: Date.now(),
                            tone: 'amber',
                          },
                        ],
                      },
                    }))
                  }
                >
                  + Thêm Đèn Hoa Đăng Mới
                </button>

                <div className="editor-subcard">
                  <h4>Khung Thơ Kết Trang &amp; Dòng Chân Trang Cuối Cùng</h4>

                  <div className="editor-visual-marker">
                    <span>[ Vòng hoa cúc màu nước nhỏ ]</span>
                  </div>

                  <div className="field-group">
                    <label>1. Chữ nằm giữa vòng hoa cúc phần kết (ví dụ: 20·11)</label>
                    <input
                      type="text"
                      className="field-input editor-input-badge"
                      value={content.finale.finaleSealText}
                      onChange={(e) =>
                        updateContent((prev) => ({
                          ...prev,
                          finale: { ...prev.finale, finaleSealText: e.target.value },
                        }))
                      }
                    />
                  </div>

                  <div className="field-group">
                    <label>2. Dòng nhãn phụ dưới vòng hoa cúc</label>
                    <input
                      type="text"
                      className="field-input editor-input-badge"
                      value={content.finale.finaleKicker}
                      onChange={(e) =>
                        updateContent((prev) => ({
                          ...prev,
                          finale: { ...prev.finale, finaleKicker: e.target.value },
                        }))
                      }
                    />
                  </div>

                  <div className="field-group">
                    <label>3. Tiêu đề lớn phần thơ kết</label>
                    <input
                      type="text"
                      className="field-input editor-input-title"
                      value={content.finale.finaleTitle}
                      onChange={(e) =>
                        updateContent((prev) => ({
                          ...prev,
                          finale: { ...prev.finale, finaleTitle: e.target.value },
                        }))
                      }
                    />
                  </div>

                  <div className="field-group">
                    <label>4. Các câu thơ kết (mỗi câu 1 dòng)</label>
                    <textarea
                      rows={4}
                      className="field-input"
                      value={content.finale.poemLines.join('\n')}
                      onChange={(e) =>
                        updateContent((prev) => ({
                          ...prev,
                          finale: {
                            ...prev.finale,
                            poemLines: e.target.value.split('\n'),
                          },
                        }))
                      }
                    />
                  </div>

                  <div className="field-group">
                    <label>5. Dòng chữ chân trang cuối cùng bên dưới khung thơ</label>
                    <input
                      type="text"
                      className="field-input"
                      value={content.finale.footerText}
                      onChange={(e) =>
                        updateContent((prev) => ({
                          ...prev,
                          finale: { ...prev.finale, footerText: e.target.value },
                        }))
                      }
                    />
                  </div>
                </div>
              </section>
            )}
          </div>
        </div>

        <footer className="editor-footer">
          <div className="editor-footer-left">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                resetContent();
                setCopyStatus('Đã khôi phục nội dung gốc mặc định.');
                window.setTimeout(() => setCopyStatus(null), 3000);
              }}
            >
              Khôi Phục Mặc Định
            </button>
            {copyStatus && <span className="editor-status-msg">{copyStatus}</span>}
          </div>

          <div className="editor-footer-right">
            <button type="button" className="btn-secondary" onClick={handleCopyGiftLink}>
              Sao Chép Link Gửi Bà
            </button>
            <button type="button" className="btn-primary" onClick={() => setOpen(false)}>
              Xong &amp; Ẩn Bảng Sửa
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
