import React, { useState } from "react";
import MainLayout from "../../components/layout/MainLayout";
import axiosClient from "../../api/axiosClient";
import { useNavigate } from "react-router-dom";
import "./NewsCreatePage.css";

// Tiptap imports
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

const NewsCreatePage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "",
    tags: [],
    status: "draft",
    featuredImage: "",
    metaTitle: "",
    metaDescription: "",
    publishedAt: "",
  });

  const [tagInput, setTagInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(null); // "success" | "error" | null

  // TIPTAP EDITOR INSTANCE
  const editor = useEditor({
    extensions: [StarterKit],
    content: form.content,
    onUpdate: ({ editor }) => {
      setForm((prev) => ({ ...prev, content: editor.getHTML() }));
    },
    editorProps: {
      attributes: {
        class: "tiptap-editor",
      },
    },
  });

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleAddTag = (e) => {
    if (e.key === "Enter" && tagInput.trim() !== "") {
      e.preventDefault();
      const value = tagInput.trim();
      if (!form.tags.includes(value)) {
        setForm((prev) => ({ ...prev, tags: [...prev.tags, value] }));
      }
      setTagInput("");
    }
  };

  const removeTag = (tag) => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setMessageType(null);

    try {
      await axiosClient.post("/news", form);
      setMessage("News article created successfully.");
      setMessageType("success");
      setTimeout(() => {
        navigate("/news");
      }, 800);
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to create news.");
      setMessageType("error");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate("/news");
  };

  return (
    <MainLayout title="Create News">
      <div className="news-create-page">
        <div className="card news-card">
          {/* Page header */}
          <div className="page-header">
            <div>
              <h1 className="page-title">Create News Article</h1>
              <p className="page-subtitle">
                Draft and publish a new story for your news portal.
              </p>
            </div>
            <span className="page-badge">News</span>
          </div>

          <form onSubmit={handleSubmit} className="news-form">
            <div className="news-form-container">
              <div className="news-grid">
                {/* LEFT SIDE */}
                <div className="news-left">
                  <h3 className="section-title">Content</h3>

                  <div className="form-block">
                    <label className="field-label" htmlFor="title">
                      Title <span className="required">*</span>
                    </label>
                    <input
                      id="title"
                      type="text"
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      required
                      placeholder="Enter headline for this article"
                    />
                  </div>

                  <div className="form-block">
                    <label className="field-label" htmlFor="excerpt">
                      Excerpt
                    </label>
                    <textarea
                      id="excerpt"
                      name="excerpt"
                      value={form.excerpt}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Short summary shown in lists and previews"
                    />
                  </div>

                  <div className="form-block">
                    <label className="field-label">Content</label>
                    <div className="editor-container">
                      <EditorContent editor={editor} />
                    </div>
                    <p className="field-help">
                      Use the editor to write the full article body.
                    </p>
                  </div>
                </div>

                {/* RIGHT SIDE PANEL */}
                <div className="news-right">
                  <h3 className="section-title">Details</h3>

                  <div className="panel">
                    <label className="field-label" htmlFor="status">
                      Status
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={form.status}
                      onChange={handleChange}
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>

                  <div className="panel">
                    <label className="field-label" htmlFor="category">
                      Category
                    </label>
                    <input
                      id="category"
                      type="text"
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      placeholder="e.g. Politics, Sports, Technology"
                    />
                  </div>

                  <div className="panel">
                    <label className="field-label">Tags</label>
                    <div className="tags-input-wrapper">
                      {form.tags.map((tag) => (
                        <span className="tag-chip" key={tag}>
                          <span>{tag}</span>
                          <button
                            onClick={() => removeTag(tag)}
                            type="button"
                            aria-label={`Remove ${tag}`}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleAddTag}
                        placeholder="Press Enter to add tag"
                      />
                    </div>
                  </div>

                  <h3 className="section-title">SEO & Media</h3>

                  <div className="panel">
                    <label className="field-label" htmlFor="featuredImage">
                      Featured Image URL
                    </label>
                    <input
                      id="featuredImage"
                      type="text"
                      name="featuredImage"
                      value={form.featuredImage}
                      onChange={handleChange}
                      placeholder="https://example.com/image.jpg"
                    />
                    {form.featuredImage && (
                      <img
                        src={form.featuredImage}
                        alt="preview"
                        className="image-preview"
                      />
                    )}
                  </div>

                  <div className="panel">
                    <label className="field-label" htmlFor="metaTitle">
                      Meta Title
                    </label>
                    <input
                      id="metaTitle"
                      type="text"
                      name="metaTitle"
                      value={form.metaTitle}
                      onChange={handleChange}
                      placeholder="Custom title for search engines"
                    />
                  </div>

                  <div className="panel">
                    <label
                      className="field-label"
                      htmlFor="metaDescription"
                    >
                      Meta Description
                    </label>
                    <textarea
                      id="metaDescription"
                      name="metaDescription"
                      value={form.metaDescription}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Brief description for SEO and sharing"
                    />
                  </div>

                  <div className="panel">
                    <label className="field-label" htmlFor="publishedAt">
                      Publish Date
                    </label>
                    <input
                      id="publishedAt"
                      type="datetime-local"
                      name="publishedAt"
                      value={form.publishedAt}
                      onChange={handleChange}
                    />
                    <p className="field-help">
                      Leave empty to keep as draft and publish later.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* FOOTER BAR */}
            <div className="form-footer">
              {message && (
                <p
                  className={`form-message ${
                    messageType === "success"
                      ? "form-message-success"
                      : "form-message-error"
                  }`}
                >
                  {message}
                </p>
              )}
              <div className="form-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={handleCancel}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Create Article"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
};

export default NewsCreatePage;
