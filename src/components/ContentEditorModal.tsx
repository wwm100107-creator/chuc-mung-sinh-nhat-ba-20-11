import { useState } from 'react';
import { useSiteContent } from '../context/ContentContext';

type EditorTab = 'envelope' | 'story' | 'letter' | 'blessings' | 'cake' | 'finale';

const TABS: Array<{ id: EditorTab; label: string }> = [
  { id: 'envelope', label: '01. Mở Thiệp' },
  { id: 'story', label: '02. Hương Trà' },
  { id: 'letter', label: '03. Bức Thư' },
  { id: 'blessings', label: '04. 6 Lời Chúc' },
  { id: 'cake', label: '05. Bánh & Nến' },
  { id: 'finale', label: '06. Hoa Đăng & Thơ' },
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
  const [activeTab, setActiveTab] = useState<EditorTab>('envelope');
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

  return (
    <>
      {/* Subtle floating trigger button */}
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
                  Tùy Chỉnh Nội Dung Câu Chữ Toàn Trang
                </h2>
                <p className="editor-subtitle">
                  Mọi thay đổi được lưu tự động và cập nhật ngay lập tức trên trang web.
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

            <nav className="editor-tabs" aria-label="Chọn chương cần sửa">
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
              {activeTab === 'envelope' && (
                <div className="editor-fields">
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
                  <div className="field-group">
                    <label>Dòng hướng dẫn dưới tiêu đề</label>
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
                    <label>Chữ trên nút mở thiệp</label>
                    <input
                      type="text"
                      className="field-input"
                      value={content.envelope.openButtonText}
                      onChange={(e) =>
                        updateContent((prev) => ({
                          ...prev,
                          envelope: { ...prev.envelope, openButtonText: e.target.value },
                        }))
                      }
                    />
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
                      <label>Tiêu đề chính (dòng 1)</label>
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
                      <label>Tiêu đề nhấn mạnh (dòng 2)</label>
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
                    <label>Lời dẫn chào mừng</label>
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
                </div>
              )}

              {activeTab === 'story' && (
                <div className="editor-fields">
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

                  {content.story.beats.map((beat, idx) => (
                    <div key={beat.id} className="editor-subcard">
                      <h4>Nhịp câu chuyện 0{idx + 1}</h4>
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
                          <label>Tiêu đề nhịp 0{idx + 1}</label>
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
                        <label>Nội dung nhịp 0{idx + 1}</label>
                        <textarea
                          rows={2}
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
                </div>
              )}

              {activeTab === 'letter' && (
                <div className="editor-fields">
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
                    <div key={idx} className="field-group">
                      <label>Đoạn thư số {idx + 1}</label>
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
                  ))}

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
                </div>
              )}

              {activeTab === 'blessings' && (
                <div className="editor-fields">
                  <div className="editor-row-2">
                    <div className="field-group">
                      <label>Nhãn phụ chương 4</label>
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
                      <label>Tiêu đề chương 4</label>
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

                  {content.blessings.items.map((item, idx) => (
                    <div key={item.id} className="editor-subcard">
                      <h4>Tấm lụa lời chúc 0{idx + 1}</h4>
                      <div className="editor-row-2">
                        <div className="field-group">
                          <label>Tên ấn chữ (ví dụ: Chữ An)</label>
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
                          <label>Tiêu đề lời chúc</label>
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

                  <div className="editor-subcard">
                    <h4>Món Quà Thứ Bảy Đặc Biệt</h4>
                    <div className="editor-row-2">
                      <div className="field-group">
                        <label>Nhãn món quà thứ 7</label>
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
                </div>
              )}

              {activeTab === 'cake' && (
                <div className="editor-fields">
                  <div className="editor-row-2">
                    <div className="field-group">
                      <label>Nhãn phụ chương bánh sinh nhật</label>
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
                      <label>Tiêu đề chương bánh sinh nhật</label>
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
                    <label>Hướng dẫn thổi nến</label>
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
                    <label>Tiêu đề hiện ra sau khi thổi tắt hết 5 ngọn nến</label>
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
                    <label>Lời chúc hiện ra sau khi thổi tắt nến</label>
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
              )}

              {activeTab === 'finale' && (
                <div className="editor-fields">
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
                    <label>Mô tả hồ hoa đăng</label>
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
                  <div className="editor-row-2">
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
                  </div>
                  <div className="field-group">
                    <label>4 câu thơ kết (mỗi câu 1 dòng)</label>
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
                    <label>Dòng chữ chân trang (Footer)</label>
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
              )}
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
