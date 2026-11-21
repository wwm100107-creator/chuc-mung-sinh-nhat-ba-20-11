import { useState } from 'react';
import { useSiteContent } from '../context/ContentContext';

type EditorTab = 'all' | 'envelope' | 'story' | 'letter' | 'blessings' | 'cake' | 'finale';

const TABS: Array<{ id: EditorTab; label: string }> = [
  { id: 'all', label: 'Tất Cả Toàn Trang' },
  { id: 'envelope', label: '01. Mở Thiệp' },
  { id: 'story', label: '02. Hương Trà' },
  { id: 'letter', label: '03. Bức Thư' },
  { id: 'blessings', label: '04. 6 Lời Chúc & Quà 7' },
  { id: 'cake', label: '05. Bánh & Nến' },
  { id: 'finale', label: '06. Hoa Đăng & Thơ Kết' },
];

export function ContentEditorModal() {
  const {
    content,
    updateContent,
    resetContent,
    createShareableGiftUrl,
    isGiftViewMode,
  } = useSiteContent();

  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<EditorTab>('all');
  const [copyStatus, setCopyStatus] = useState<string | null>(null);

  if (isGiftViewMode) {
    return null;
  }

  const handleCopyGiftLink = async () => {
    const url = createShareableGiftUrl();
    try {
      await navigator.clipboard.writeText(url);
      setCopyStatus('Đã sao chép link gửi tặng Bà (đã lưu chữ mới & ẩn nút sửa)!');
    } catch {
      window.prompt('Sao chép đường link này để gửi tặng Bà:', url);
      setCopyStatus('Đã tạo link gửi tặng Bà!');
    }
    window.setTimeout(() => setCopyStatus(null), 4000);
  };

  const showEnvelope = activeTab === 'all' || activeTab === 'envelope';
  const showStory = activeTab === 'all' || activeTab === 'story';
  const showLetter = activeTab === 'all' || activeTab === 'letter';
  const showBlessings = activeTab === 'all' || activeTab === 'blessings';
  const showCake = activeTab === 'all' || activeTab === 'cake';
  const showFinale = activeTab === 'all' || activeTab === 'finale';

  return (
    <>
      <button
        type="button"
        className="content-editor-fab"
        onClick={() => setOpen(true)}
        aria-label="Mở bảng chỉnh sửa nội dung câu chữ toàn trang"
      >
        <span>Sửa câu chữ</span>
      </button>

      {open && (
        <div
          className="editor-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="editor-dialog-title"
        >
          <div className="storybook-sheet editor-modal">
            <header className="editor-header">
              <div>
                <h2 id="editor-dialog-title" className="editor-title">
                  Chỉnh Sửa Toàn Bộ Câu Chữ Trên Trang (100% Các Mục)
                </h2>
                <p className="editor-subtitle">
                  Cuộn xuống để sửa mọi tiêu đề, nhãn, con dấu, đoạn thư, lời chúc, đèn hoa đăng và thơ kết. Thay đổi tự động lưu ngay lập tức.
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
                      <label>Tiêu đề thanh tab trình duyệt (Page Title)</label>
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

                    <div className="editor-row-2">
                      <div className="field-group">
                        <label>Nhãn ngày tháng trên bì thư</label>
                        <input
                          type="text"
                          className="field-input"
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
                        <label>Tiêu đề người nhận (trên phong thư)</label>
                        <input
                          type="text"
                          className="field-input"
                          value={content.envelope.recipientTitle}
                          onChange={(e) =>
                            updateContent((prev) => ({
                              ...prev,
                              envelope: { ...prev.envelope, recipientTitle: e.target.value },
                            }))
                          }
                        />
                      </div>
                    </div>

                    <div className="editor-row-2">
                      <div className="field-group">
                        <label>Dòng hướng dẫn dưới tiêu đề phong thư</label>
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
                      <div className="field-group">
                        <label>Dòng nhắc cuộn dưới bức tranh phong thư</label>
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

                    <div className="field-group">
                      <label>Nhãn trang chào mừng (sau khi mở phong thư)</label>
                      <input
                        type="text"
                        className="field-input"
                        value={content.envelope.welcomeBadge}
                        onChange={(e) =>
                          updateContent((prev) => ({
                            ...prev,
                            envelope: { ...prev.envelope, welcomeBadge: e.target.value },
                          }))
                        }
                      />
                    </div>

                    <div className="editor-row-2">
                      <div className="field-group">
                        <label>Tiêu đề chính chào mừng (dòng 1)</label>
                        <input
                          type="text"
                          className="field-input"
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
                        <label>Tiêu đề nhấn mạnh chào mừng (dòng 2)</label>
                        <input
                          type="text"
                          className="field-input"
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
                    </div>

                    <div className="field-group">
                      <label>Đoạn lời dẫn trang chào mừng</label>
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
                      <label>Dòng nhắc cuộn ở cuối trang chào mừng</label>
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
                  </section>
                )}

                {/* =================================================
                    CHƯƠNG 2: HƯƠNG TRÀ & CÁC NHỊP CÂU CHUYỆN
                    ================================================= */}
                {showStory && (
                  <section className="editor-chapter-block">
                    <h3 className="editor-chapter-heading">
                      Chương 2 · Hương Trà Thu &amp; Các Thẻ Câu Chuyện
                    </h3>

                    <div className="editor-row-2">
                      <div className="field-group">
                        <label>Nhãn ngày tháng phía trên khung câu chuyện</label>
                        <input
                          type="text"
                          className="field-input"
                          value={content.story.topBadge}
                          onChange={(e) =>
                            updateContent((prev) => ({
                              ...prev,
                              story: { ...prev.story, topBadge: e.target.value },
                            }))
                          }
                        />
                      </div>
                      <div className="field-group">
                        <label>Chú thích dưới bức tranh ấm trà &amp; hoa cúc</label>
                        <input
                          type="text"
                          className="field-input"
                          value={content.story.paintingCaption}
                          onChange={(e) =>
                            updateContent((prev) => ({
                              ...prev,
                              story: { ...prev.story, paintingCaption: e.target.value },
                            }))
                          }
                        />
                      </div>
                    </div>

                    {content.story.beats.map((beat, idx) => (
                      <div key={beat.id} className="editor-subcard">
                        <div className="editor-subcard-header">
                          <h4>Thẻ câu chuyện 0{idx + 1}</h4>
                          {content.story.beats.length > 1 && (
                            <button
                              type="button"
                              className="editor-remove-btn"
                              onClick={() =>
                                updateContent((prev) => ({
                                  ...prev,
                                  story: {
                                    ...prev.story,
                                    beats: prev.story.beats.filter((_, i) => i !== idx),
                                  },
                                }))
                              }
                            >
                              Xóa thẻ này
                            </button>
                          )}
                        </div>
                        <div className="editor-row-2">
                          <div className="field-group">
                            <label>Nhãn phụ (Kicker)</label>
                            <input
                              type="text"
                              className="field-input"
                              value={beat.kicker}
                              onChange={(e) => {
                                const val = e.target.value;
                                updateContent((prev) => ({
                                  ...prev,
                                  story: {
                                    ...prev.story,
                                    beats: prev.story.beats.map((b, i) =>
                                      i === idx ? { ...b, kicker: val } : b,
                                    ),
                                  },
                                }));
                              }}
                            />
                          </div>
                          <div className="field-group">
                            <label>Tiêu đề thẻ 0{idx + 1}</label>
                            <input
                              type="text"
                              className="field-input"
                              value={beat.title}
                              onChange={(e) => {
                                const val = e.target.value;
                                updateContent((prev) => ({
                                  ...prev,
                                  story: {
                                    ...prev.story,
                                    beats: prev.story.beats.map((b, i) =>
                                      i === idx ? { ...b, title: val } : b,
                                    ),
                                  },
                                }));
                              }}
                            />
                          </div>
                        </div>
                        <div className="field-group">
                          <label>Nội dung thẻ 0{idx + 1}</label>
                          <textarea
                            rows={3}
                            className="field-input"
                            value={beat.body}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateContent((prev) => ({
                                ...prev,
                                story: {
                                  ...prev.story,
                                  beats: prev.story.beats.map((b, i) =>
                                    i === idx ? { ...b, body: val } : b,
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
                          story: {
                            ...prev.story,
                            beats: [
                              ...prev.story.beats,
                              {
                                id: `beat-${Date.now()}`,
                                kicker: `Khúc Mùa Thu · 0${prev.story.beats.length + 1}`,
                                title: 'Lời Chúc Yêu Thương Mới',
                                body: 'Kính chúc Bà luôn mạnh khỏe, bình an và ngập tràn niềm vui bên con cháu.',
                              },
                            ],
                          },
                        }))
                      }
                    >
                      + Thêm Thẻ Câu Chuyện Mới
                    </button>
                  </section>
                )}

                {/* =================================================
                    CHƯƠNG 3: CUỘN THƯ LỤA & CON DẤU ĐỎ
                    ================================================= */}
                {showLetter && (
                  <section className="editor-chapter-block">
                    <h3 className="editor-chapter-heading">
                      Chương 3 · Cuộn Thư Lụa &amp; Con Dấu Triện Đỏ
                    </h3>

                    <div className="editor-row-2">
                      <div className="field-group">
                        <label>Chữ trên con dấu đỏ góc phải (dòng 1, ví dụ: 20)</label>
                        <input
                          type="text"
                          className="field-input"
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
                        <label>Chữ trên con dấu đỏ góc phải (dòng 2, ví dụ: Th11)</label>
                        <input
                          type="text"
                          className="field-input"
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

                    <div className="field-group">
                      <label>Lời thưa đầu thư</label>
                      <input
                        type="text"
                        className="field-input"
                        value={content.letter.salutation}
                        onChange={(e) =>
                          updateContent((prev) => ({
                            ...prev,
                            letter: { ...prev.letter, salutation: e.target.value },
                          }))
                        }
                      />
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

                    <div className="editor-row-2">
                      <div className="field-group">
                        <label>Lời chúc kết thư</label>
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
                        <label>Chữ ký cuối thư</label>
                        <input
                          type="text"
                          className="field-input"
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
                    CHƯƠNG 4: VÒNG HOA 6 LỜI CHÚC VÀNG & QUÀ THỨ 7
                    ================================================= */}
                {showBlessings && (
                  <section className="editor-chapter-block">
                    <h3 className="editor-chapter-heading">
                      Chương 4 · Vòng Hoa Cúc Sáu Lời Chúc Vàng &amp; Món Quà Thứ Bảy
                    </h3>

                    <div className="editor-row-2">
                      <div className="field-group">
                        <label>Nhãn phụ đầu Chương 4</label>
                        <input
                          type="text"
                          className="field-input"
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
                        <label>Tiêu đề chính Chương 4</label>
                        <input
                          type="text"
                          className="field-input"
                          value={content.blessings.sectionTitle}
                          onChange={(e) =>
                            updateContent((prev) => ({
                              ...prev,
                              blessings: { ...prev.blessings, sectionTitle: e.target.value },
                            }))
                          }
                        />
                      </div>
                    </div>

                    <div className="field-group">
                      <label>Mô tả dưới tiêu đề Chương 4</label>
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

                    <div className="editor-row-2">
                      <div className="field-group">
                        <label>Chữ đi kèm tên ấn chữ trên đầu thẻ (ví dụ: Lời chúc)</label>
                        <input
                          type="text"
                          className="field-input"
                          value={content.blessings.cardBadgePrefix}
                          onChange={(e) =>
                            updateContent((prev) => ({
                              ...prev,
                              blessings: { ...prev.blessings, cardBadgePrefix: e.target.value },
                            }))
                          }
                        />
                      </div>
                      <div className="field-group">
                        <label>Dòng hướng dẫn ở chân mỗi thẻ lời chúc</label>
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
                        <div className="editor-row-2">
                          <div className="field-group">
                            <label>Tên ấn chữ (hiện ở giữa vòng hoa &amp; góc thẻ)</label>
                            <input
                              type="text"
                              className="field-input"
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
                            <label>Tiêu đề lời chúc 0{idx + 1}</label>
                            <input
                              type="text"
                              className="field-input"
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
                        </div>
                        <div className="field-group">
                          <label>Nội dung lời chúc 0{idx + 1}</label>
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

                    <div className="editor-subcard">
                      <h4>Thẻ Cuối Chương 4 · Món Quà Thứ Bảy Đặc Biệt</h4>
                      <div className="editor-row-2">
                        <div className="field-group">
                          <label>Chữ hiện ở tâm vòng hoa cúc (ví dụ: Món Quà 7)</label>
                          <input
                            type="text"
                            className="field-input"
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
                          <label>Nhãn trên đầu thẻ món quà thứ 7</label>
                          <input
                            type="text"
                            className="field-input"
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
                      </div>
                      <div className="field-group">
                        <label>Tiêu đề món quà thứ 7</label>
                        <input
                          type="text"
                          className="field-input"
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
                        <label>Nội dung món quà thứ 7</label>
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
                    CHƯƠNG 5: CHIẾC BÁNH KEM MÀU NƯỚC & THẮP NẾN
                    ================================================= */}
                {showCake && (
                  <section className="editor-chapter-block">
                    <h3 className="editor-chapter-heading">
                      Chương 5 · Chiếc Bánh Kem Màu Nước &amp; Lời Chúc Thắp Nến
                    </h3>

                    <div className="editor-row-2">
                      <div className="field-group">
                        <label>Nhãn phụ đầu Chương 5</label>
                        <input
                          type="text"
                          className="field-input"
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
                        <label>Tiêu đề chính Chương 5</label>
                        <input
                          type="text"
                          className="field-input"
                          value={content.cake.sectionTitle}
                          onChange={(e) =>
                            updateContent((prev) => ({
                              ...prev,
                              cake: { ...prev.cake, sectionTitle: e.target.value },
                            }))
                          }
                        />
                      </div>
                    </div>

                    <div className="field-group">
                      <label>Mô tả dưới tiêu đề Chương 5</label>
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

                    <div className="field-group">
                      <label>Tiêu đề tấm thiệp chúc mừng bên dưới chiếc bánh</label>
                      <input
                        type="text"
                        className="field-input"
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
                      <label>Nội dung lời chúc bên dưới chiếc bánh</label>
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
                  </section>
                )}

                {/* =================================================
                    CHƯƠNG 6: HỒ HOA ĐĂNG, THƠ KẾT & CHÂN TRANG
                    ================================================= */}
                {showFinale && (
                  <section className="editor-chapter-block">
                    <h3 className="editor-chapter-heading">
                      Chương 6 · Hồ Hoa Đăng, Lời Thơ Kết &amp; Chân Trang
                    </h3>

                    <div className="editor-row-2">
                      <div className="field-group">
                        <label>Nhãn phụ hồ hoa đăng</label>
                        <input
                          type="text"
                          className="field-input"
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
                        <label>Tiêu đề hồ hoa đăng</label>
                        <input
                          type="text"
                          className="field-input"
                          value={content.finale.lanternTitle}
                          onChange={(e) =>
                            updateContent((prev) => ({
                              ...prev,
                              finale: { ...prev.finale, lanternTitle: e.target.value },
                            }))
                          }
                        />
                      </div>
                    </div>

                    <div className="field-group">
                      <label>Mô tả dưới tiêu đề hồ hoa đăng</label>
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

                    {content.finale.lanterns.map((lantern, idx) => (
                      <div key={lantern.id} className="editor-subcard">
                        <div className="editor-subcard-header">
                          <h4>Đèn hoa đăng số 0{idx + 1}</h4>
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
                          <label>Tên người gửi lời chúc</label>
                          <input
                            type="text"
                            className="field-input"
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
                          <label>Lời chúc trên đèn hoa đăng 0{idx + 1}</label>
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
                      <h4>Khung Thơ Kết Trang &amp; Chân Trang</h4>
                      <div className="editor-row-2">
                        <div className="field-group">
                          <label>Chữ giữa vòng hoa cúc phần kết (ví dụ: 20·11)</label>
                          <input
                            type="text"
                            className="field-input"
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
                          <label>Nhãn phụ phần thơ kết</label>
                          <input
                            type="text"
                            className="field-input"
                            value={content.finale.finaleKicker}
                            onChange={(e) =>
                              updateContent((prev) => ({
                                ...prev,
                                finale: { ...prev.finale, finaleKicker: e.target.value },
                              }))
                            }
                          />
                        </div>
                      </div>

                      <div className="field-group">
                        <label>Tiêu đề phần thơ kết</label>
                        <input
                          type="text"
                          className="field-input"
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
                        <label>Các câu thơ kết (mỗi câu 1 dòng)</label>
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
                        <label>Dòng chữ chân trang cuối cùng (Footer)</label>
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
                  Sao Chép Link Gửi Bà (Ẩn Nút Sửa)
                </button>
                <button type="button" className="btn-primary" onClick={() => setOpen(false)}>
                  Xong &amp; Xem Trang
                </button>
              </div>
            </footer>
          </div>
        </div>
      )}
    </>
  );
}
