import React, { useEffect, useMemo, useState } from "react";
import {
  Plus, Search, FileText, Pencil, Trash2, ChevronDown,
  ImagePlus, Loader2, X, RefreshCw, Send, Save, Eye,
} from "lucide-react";
import { blogApi } from "../../services/blogApi";

const EMPTY_FORM = { title: "", content: "", imageUrl: null, imagePublicId: null };
const inputStyle = "w-full rounded-xl border border-[#E8E3D8] bg-white px-4 py-3 text-sm text-[#243A34] outline-none focus:border-[#075e4d]";

function Section({ title, subtitle, number, expanded, onToggle, children }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-[#E8E3D8] bg-white">
      <button type="button" onClick={onToggle} aria-expanded={expanded} className="flex w-full items-center gap-3 p-4 text-left sm:p-5">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EEF5F1] text-sm font-bold text-[#075e4d]">{number}</span>
        <span className="flex-1"><span className="block font-semibold text-[#243A34]">{title}</span><span className="text-xs text-gray-500">{subtitle}</span></span>
        <ChevronDown size={18} className={`text-gray-500 transition-transform ${expanded ? "rotate-180" : ""}`} />
      </button>
      {expanded && <div className="border-t border-[#E8E3D8] p-4 sm:p-5">{children}</div>}
    </section>
  );
}

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [expanded, setExpanded] = useState({ title: true, image: false, content: false });
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function loadBlogs() {
    setLoading(true);
    setError("");
    try {
      const result = await blogApi.getAllAdminBlogs();
      setBlogs(Array.isArray(result) ? result : []);
    } catch (err) {
      setError(err.message || "Unable to load blogs.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadBlogs(); }, []);

  const filtered = useMemo(() => blogs.filter((blog) =>
    `${blog.title || ""} ${blog.slug || ""} ${blog.status || ""}`.toLowerCase().includes(search.trim().toLowerCase())
  ), [blogs, search]);

  function startCreate() {
    setEditingId(null);
    setForm({ ...EMPTY_FORM });
    setExpanded({ title: true, image: false, content: false });
    setError(""); setNotice(""); setEditorOpen(true);
  }

  function startEdit(blog) {
    setEditingId(blog.id);
    setForm({ title: blog.title || "", content: blog.content || "", imageUrl: blog.imageUrl || null, imagePublicId: blog.imagePublicId || null });
    setExpanded({ title: true, image: true, content: true });
    setError(""); setNotice(""); setEditorOpen(true);
  }

  async function uploadImage(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    event.target.value = "";
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Only JPG, PNG or WEBP images are allowed."); return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be 5 MB or less."); return;
    }
    setError(""); setUploading(true);
    try {
      const result = await blogApi.uploadBlogImage(file);
      if (!result?.imageUrl || !result?.imagePublicId) throw new Error("Upload response is missing image details.");
      setForm((prev) => ({ ...prev, imageUrl: result.imageUrl, imagePublicId: result.imagePublicId }));
      setNotice("Image uploaded successfully.");
    } catch (err) {
      setError(err.message || "Image upload failed. Check the backend logs.");
    } finally { setUploading(false); }
  }

  async function save(publish) {
    if (!form.title.trim()) { setError("Please enter a blog title."); setExpanded((s) => ({ ...s, title: true })); return; }
    if (!form.content.trim()) { setError("Please enter blog content."); setExpanded((s) => ({ ...s, content: true })); return; }
    setBusy(true); setError(""); setNotice("");
    try {
      const payload = { ...form, title: form.title.trim(), content: form.content.trim() };
      const saved = editingId ? await blogApi.updateBlog(editingId, payload) : await blogApi.createBlog(payload);
      if (publish) await blogApi.publishBlog(saved.id);
      setEditorOpen(false);
      setNotice(publish ? "Blog published successfully." : "Blog saved successfully.");
      await loadBlogs();
    } catch (err) {
      setError(err.message || "Unable to save blog.");
    } finally { setBusy(false); }
  }

  async function changeStatus(blog) {
    setBusy(true); setError(""); setNotice("");
    try {
      if (blog.status === "PUBLISHED") await blogApi.moveBlogToDraft(blog.id);
      else await blogApi.publishBlog(blog.id);
      setNotice("Blog status updated.");
      await loadBlogs();
    } catch (err) { setError(err.message || "Unable to change status."); }
    finally { setBusy(false); }
  }

  async function deleteBlog(blog) {
    if (!window.confirm(`Delete blog "${blog.title}"? This cannot be undone.`)) return;
    setBusy(true); setError(""); setNotice("");
    try {
      await blogApi.deleteBlog(blog.id);
      setNotice("Blog deleted from the database.");
      await loadBlogs();
    } catch (err) { setError(err.message || "Unable to delete blog."); }
    finally { setBusy(false); }
  }

  return (
    <div>
      <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div><h1 className="text-2xl font-bold text-[#243A34]">Blogs</h1><p className="mt-1 text-sm text-gray-500">Manage ShreeKrishna articles and recipes.</p></div>
        <button type="button" onClick={startCreate} className="flex items-center justify-center gap-2 rounded-xl bg-[#075e4d] px-5 py-3 text-sm font-semibold text-white hover:bg-[#064c3f]"><Plus size={17} /> Add Blog</button>
      </div>

      {notice && <p role="status" className="mb-4 rounded-xl bg-[#EEF5F1] px-4 py-3 text-sm text-[#075e4d]">{notice}</p>}
      {error && <p role="alert" className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      {editorOpen && (
        <div className="mb-7 rounded-2xl border border-[#E8E3D8] bg-[#FAF9F6] p-4 sm:p-6">
          <div className="mb-5 flex items-center justify-between gap-3"><div><h2 className="text-lg font-bold text-[#243A34]">{editingId ? "Edit Blog" : "Add New Blog"}</h2><p className="text-xs text-gray-500">Complete the sections below, then save or publish.</p></div><button type="button" disabled={busy || uploading} onClick={() => { setEditorOpen(false); setError(""); }} aria-label="Close editor" className="rounded-lg p-2 hover:bg-gray-100"><X size={20}/></button></div>
          <div className="space-y-3">
            <Section number="1" title="Blog Title" subtitle="Enter the heading for your article" expanded={expanded.title} onToggle={() => setExpanded((s) => ({ ...s, title: !s.title }))}>
              <label className="mb-2 block text-sm font-medium text-[#243A34]" htmlFor="blog-title">Title *</label>
              <input id="blog-title" maxLength={255} value={form.title} onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))} placeholder="e.g. Benefits of Wood Pressed Oils" className={inputStyle}/>
            </Section>
            <Section number="2" title="Blog Image" subtitle="Upload a cover image to Cloudinary (optional)" expanded={expanded.image} onToggle={() => setExpanded((s) => ({ ...s, image: !s.image }))}>
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[#075e4d] px-4 py-2.5 text-sm font-semibold text-[#075e4d] hover:bg-[#EEF5F1]">
                {uploading ? <Loader2 size={17} className="animate-spin"/> : <ImagePlus size={17}/>}
                {uploading ? "Uploading..." : form.imageUrl ? "Replace Image" : "Choose Image"}
                <input type="file" accept="image/jpeg,image/png,image/webp" disabled={uploading || busy} onChange={uploadImage} className="hidden"/>
              </label>
              <p className="mt-2 text-xs text-gray-500">JPG, PNG or WEBP • Maximum 5 MB</p>
              {form.imageUrl && <div className="mt-4 flex flex-wrap items-start gap-4"><img src={form.imageUrl} alt="Blog cover preview" className="h-36 w-56 rounded-xl border object-cover"/><button type="button" onClick={() => setForm((s) => ({ ...s, imageUrl: null, imagePublicId: null }))} className="text-xs font-semibold text-red-600">Remove from blog</button></div>}
            </Section>
            <Section number="3" title="Blog Content" subtitle="Write the full article" expanded={expanded.content} onToggle={() => setExpanded((s) => ({ ...s, content: !s.content }))}>
              <label className="mb-2 block text-sm font-medium text-[#243A34]" htmlFor="blog-content">Content *</label>
              <textarea id="blog-content" rows={12} value={form.content} onChange={(e) => setForm((s) => ({ ...s, content: e.target.value }))} placeholder="Write your blog content here..." className={`${inputStyle} resize-y`}/>
              <p className="mt-2 text-xs text-gray-500">Plain text is supported; paragraphs will be preserved on the public page.</p>
            </Section>
          </div>
          <div className="mt-5 flex flex-wrap justify-end gap-3">
            <button type="button" disabled={busy || uploading} onClick={() => save(false)} className="inline-flex items-center gap-2 rounded-xl border border-[#075e4d] px-5 py-3 text-sm font-semibold text-[#075e4d] disabled:opacity-50"><Save size={16}/> {busy ? "Saving..." : "Save Draft / Changes"}</button>
            <button type="button" disabled={busy || uploading} onClick={() => save(true)} className="inline-flex items-center gap-2 rounded-xl bg-[#075e4d] px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"><Send size={16}/> {busy ? "Publishing..." : "Publish Blog"}</button>
          </div>
          {editingId && <p className="mt-3 text-right text-xs text-gray-500">Saving changes to an already published blog keeps it published. Use “Move to Draft” in the list to unpublish it.</p>}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-[#E8E3D8] bg-white">
        <div className="flex items-center justify-between gap-3 border-b p-4"><div className="flex max-w-sm flex-1 items-center gap-2 rounded-xl bg-[#F7F8F7] px-4"><Search size={17} className="text-gray-400"/><input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search blogs..." className="w-full bg-transparent py-3 text-sm outline-none"/></div><button type="button" onClick={loadBlogs} disabled={loading} aria-label="Refresh blogs" title="Refresh blogs" className="rounded-lg p-2 text-[#075e4d] hover:bg-[#EEF5F1]"><RefreshCw size={18} className={loading ? "animate-spin" : ""}/></button></div>
        {loading ? <div className="flex min-h-[260px] items-center justify-center gap-2 text-sm text-gray-500"><Loader2 className="animate-spin" size={18}/> Loading blogs...</div> : filtered.length === 0 ? (
          <div className="flex min-h-[350px] flex-col items-center justify-center text-gray-400"><div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EEF5F1] text-[#075e4d]"><FileText size={30}/></div><p className="mt-4 font-semibold text-gray-600">{search ? "No matching blogs" : "No blogs added yet"}</p><p className="mt-1 text-xs">{search ? "Try another search." : "New blogs will appear here."}</p></div>
        ) : filtered.map((blog) => (
          <div key={blog.id} className="flex flex-col gap-3 border-b p-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div className="flex min-w-0 items-center gap-3">{blog.imageUrl ? <img src={blog.imageUrl} alt="" className="h-14 w-16 shrink-0 rounded-lg object-cover"/> : <div className="flex h-14 w-16 shrink-0 items-center justify-center rounded-lg bg-[#EEF5F1] text-[#075e4d]"><FileText size={22}/></div>}<div className="min-w-0"><p className="truncate font-semibold text-[#243A34]">{blog.title}</p><p className="truncate text-xs text-gray-400">/{blog.slug}</p><span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold ${blog.status === "PUBLISHED" ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"}`}>{blog.status}</span></div></div>
            <div className="flex flex-wrap items-center gap-2"><button type="button" onClick={() => startEdit(blog)} title="Edit" className="rounded-lg p-2 text-[#075e4d] hover:bg-[#EEF5F1]"><Pencil size={17}/></button><button type="button" disabled={busy} onClick={() => changeStatus(blog)} className="rounded-lg border px-3 py-2 text-xs font-semibold text-[#075e4d] disabled:opacity-50">{blog.status === "PUBLISHED" ? "Move to Draft" : "Publish"}</button>{blog.status === "PUBLISHED" && <a href={`/blogs/${blog.slug}`} title="View public blog" className="rounded-lg p-2 text-[#075e4d] hover:bg-[#EEF5F1]"><Eye size={17}/></a>}<button type="button" disabled={busy} onClick={() => deleteBlog(blog)} title="Delete" className="rounded-lg p-2 text-red-600 hover:bg-red-50 disabled:opacity-50"><Trash2 size={17}/></button></div>
          </div>
        ))}
      </div>
    </div>
  );
}
