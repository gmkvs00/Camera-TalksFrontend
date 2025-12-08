import React, { useState, useEffect } from "react";
import MainLayout from "../../components/layout/MainLayout";
import axiosClient from "../../api/axiosClient";
import { useNavigate } from "react-router-dom";
import slugify from "slugify";
import "./NewsCreatePage.css";

// Tiptap imports
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

const NewsCreatePage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    slug: "",
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

  // TIPTAP EDITOR INSTANCE
  const editor = useEditor({
    extensions: [StarterKit],
    content: form.content,
    onUpdate: ({ editor }) => {
      setForm((prev) => ({ ...prev, content: editor.getHTML() }));
    },
    editorProps: {
      attributes: {
        class:
          "prose p-3 min-h-[250px] border rounded-md focus:outline-none",
      },
    },
  });

  // AUTO-SLUG GENERATION
 useEffect(() => {
  if (form.title && !form.slug) {
    setForm((prev) => ({
      ...prev,
      slug: slugify(form.title, { lower: true, strict: true }),
    }));
  }
}, [form.title]);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleAddTag = (e) => {
    if (e.key === "Enter" && tagInput.trim() !== "") {
      e.preventDefault();
      if (!form.tags.includes(tagInput.trim())) {
        setForm((prev) => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
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

    try {
      await axiosClient.post("/news", form);
      setMessage("News created successfully!");
      setTimeout(() => {
        navigate("/news");
      }, 800);
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to create news");
    } finally {
      setSaving(false);
    }
  };

  return (
    <MainLayout title="Create News">
      <div className="page-header">
        <h2>Create News Article</h2>
      </div>

      <div className="news-form-container">
        <form onSubmit={handleSubmit} className="news-grid">
          {/* LEFT SIDE */}
          <div className="news-left">
            <div className="form-block">
              <label>Title</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-block">
              <label>Slug</label>
              <input
                type="text"
                name="slug"
                value={form.slug}
                onChange={handleChange}
                placeholder="auto-generated"
              />
            </div>

            <div className="form-block">
              <label>Excerpt</label>
              <textarea
                name="excerpt"
                value={form.excerpt}
                onChange={handleChange}
              />
            </div>

            <div className="form-block">
              <label>Content</label>
              <EditorContent editor={editor} className="editor-container" />
            </div>
          </div>

          {/* RIGHT SIDE PANEL */}
          <div className="news-right">

            <div className="panel">
              <label>Status</label>
              <select name="status" value={form.status} onChange={handleChange}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div className="panel">
              <label>Category</label>
              <input type="text" name="category" value={form.category} onChange={handleChange} />
            </div>

            <div className="panel">
              <label>Tags</label>
              <div className="tags-input-wrapper">
                {form.tags.map((tag) => (
                  <span className="tag-chip" key={tag}>
                    {tag}
                    <button onClick={() => removeTag(tag)} type="button">×</button>
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

            <div className="panel">
              <label>Featured Image URL</label>
              <input
                type="text"
                name="featuredImage"
                value={form.featuredImage}
                onChange={handleChange}
              />
              {form.featuredImage && (
                <img src={form.featuredImage} alt="preview" className="image-preview" />
              )}
            </div>

            <div className="panel">
              <label>Meta Title</label>
              <input type="text" name="metaTitle" value={form.metaTitle} onChange={handleChange} />
            </div>

            <div className="panel">
              <label>Meta Description</label>
              <textarea name="metaDescription" value={form.metaDescription} onChange={handleChange} />
            </div>

            <div className="panel">
              <label>Publish Date</label>
              <input
                type="datetime-local"
                name="publishedAt"
                value={form.publishedAt}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? "Saving..." : "Create Article"}
            </button>

            {message && <p className="form-message">{message}</p>}
          </div>
        </form>
      </div>
    </MainLayout>
  );
};

export default NewsCreatePage;
