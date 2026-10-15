import React, { useCallback, useEffect, useRef, useState } from "react";
import { Star, Pencil, ImagePlus, Plus, X, Video, Trash2, ExternalLink } from "lucide-react";
import { apiRequest } from "../../services/api";

const ENDPOINT = "/admin/testimonials";
const VIDEO_ENDPOINT = "/admin/videos";
const EMPTY = { customerName: "", comment: "", rating: 5, active: true };
const EMPTY_VIDEO = { title: "", youtubeUrl: "", description: "", active: true, displayOrder: 0 };

export default function AdminTestimonials() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [videos, setVideos] = useState([]);
  const [videoForm, setVideoForm] = useState(EMPTY_VIDEO);
  const [editingVideoId, setEditingVideoId] = useState(null);
  const [videoLoading, setVideoLoading] = useState(true);
  const [videoSaving, setVideoSaving] = useState(false);
  const [deletingVideoId, setDeletingVideoId] = useState(null);
  const [videoError, setVideoError] = useState("");
  const [videoNotice, setVideoNotice] = useState("");
  const videoFormRef = useRef(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await apiRequest(ENDPOINT);
      setItems(Array.isArray(result) ? result : Array.isArray(result?.content) ? result.content : []);
    } catch (err) {
      setError(`Could not load testimonials: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadVideos = useCallback(async () => {
    setVideoLoading(true);
    setVideoError("");
    try {
      const result = await apiRequest(VIDEO_ENDPOINT);
      setVideos(Array.isArray(result) ? result : Array.isArray(result?.content) ? result.content : []);
    } catch (err) {
      setVideoError(`Could not load videos: ${err.message}`);
    } finally {
      setVideoLoading(false);
    }
  }, []);

  useEffect(() => { load(); loadVideos(); }, [load, loadVideos]);

  const reset = () => {
    setForm(EMPTY);
    setEditingId(null);
    setPhoto(null);
  };

  const edit = (item) => {
    setEditingId(item.id);
    setForm({
      customerName: item.customerName ?? "",
      comment: item.comment ?? item.review ?? item.reviewText ?? "",
      rating: Number(item.rating ?? 5),
      active: item.active !== false,
    });
    setPhoto(null);
    setNotice("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const url = editingId ? `${ENDPOINT}/${editingId}` : ENDPOINT;
      const saved = await apiRequest(url, {
        method: editingId ? "PUT" : "POST",
        body: JSON.stringify({
          customerName: form.customerName.trim(),
          comment: form.comment.trim(),
          rating: Number(form.rating),
          active: Boolean(form.active),
        }),
      });
      const id = editingId ?? saved?.id;
      if (photo) {
        if (!id) throw new Error("Saved testimonial ID missing; photo was not uploaded.");
        const data = new FormData();
        data.append("file", photo);
        await apiRequest(`${ENDPOINT}/${id}/photo`, { method: "POST", body: data });
      }
      reset();
      setNotice("Testimonial saved successfully.");
      await load();
    } catch (err) {
      setError(`Save failed: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const resetVideo = () => {
    setVideoForm(EMPTY_VIDEO);
    setEditingVideoId(null);
  };

  const editVideo = (video) => {
    setEditingVideoId(video.id);
    setVideoForm({
      title: video.title ?? "",
      youtubeUrl: video.youtubeUrl ?? "",
      description: video.description ?? "",
      active: video.active !== false,
      displayOrder: Number(video.displayOrder ?? 0),
    });
    setVideoError("");
    setVideoNotice("");
    videoFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const saveVideo = async (event) => {
    event.preventDefault();
    setVideoSaving(true);
    setVideoError("");
    setVideoNotice("");
    try {
      const url = editingVideoId ? `${VIDEO_ENDPOINT}/${editingVideoId}` : VIDEO_ENDPOINT;
      await apiRequest(url, {
        method: editingVideoId ? "PUT" : "POST",
        body: JSON.stringify({
          title: videoForm.title.trim(),
          youtubeUrl: videoForm.youtubeUrl.trim(),
          description: videoForm.description.trim(),
          active: Boolean(videoForm.active),
          displayOrder: Number(videoForm.displayOrder) || 0,
        }),
      });
      resetVideo();
      setVideoNotice("YouTube video saved successfully.");
      await loadVideos();
    } catch (err) {
      setVideoError(`Video save failed: ${err.message}`);
    } finally {
      setVideoSaving(false);
    }
  };

  const deleteVideo = async (video) => {
    if (!window.confirm(`Delete video "${video.title}"? This cannot be undone.`)) return;
    setDeletingVideoId(video.id);
    setVideoError("");
    setVideoNotice("");
    try {
      await apiRequest(`${VIDEO_ENDPOINT}/${video.id}`, { method: "DELETE" });
      if (editingVideoId === video.id) resetVideo();
      setVideoNotice("YouTube video deleted successfully.");
      await loadVideos();
    } catch (err) {
      setVideoError(`Video delete failed: ${err.message}`);
    } finally {
      setDeletingVideoId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-[#243A34]">Website Testimonials</h1>
        <p className="mt-1 text-sm text-gray-500">Manage testimonials displayed on the website home page. Delete is unavailable until the backend supports it.</p>
      </div>
      {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700 break-words">{error}</p>}
      {notice && <p role="status" className="rounded-xl bg-green-50 p-3 text-sm text-green-700">{notice}</p>}
      <form onSubmit={save} className="rounded-2xl border border-[#E8E3D8] bg-white p-5 space-y-4 shadow-sm">
        <h2 className="font-semibold text-[#243A34] flex items-center gap-2">
          {editingId ? <Pencil size={18} /> : <Plus size={18} />}
          {editingId ? "Edit Testimonial" : "Add Testimonial"}
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm font-medium">Customer Name
            <input required maxLength={120} value={form.customerName} onChange={e => setForm({ ...form, customerName: e.target.value })}
              className="mt-1 block w-full rounded-lg border p-3" placeholder="Customer name" />
          </label>
          <label className="text-sm font-medium">Rating
            <select value={form.rating} onChange={e => setForm({ ...form, rating: Number(e.target.value) })}
              className="mt-1 block w-full rounded-lg border p-3">
              {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} Star{n > 1 ? "s" : ""}</option>)}
            </select>
          </label>
        </div>
        <label className="block text-sm font-medium">Review
          <textarea required rows={4} maxLength={2000} value={form.comment} onChange={e => setForm({ ...form, comment: e.target.value })}
            className="mt-1 block w-full rounded-lg border p-3" placeholder="Customer review" />
        </label>
        <label className="block text-sm font-medium">Customer Photo (JPG / PNG / WebP, max 5 MB)
          <input type="file" accept="image/jpeg,image/png,image/webp" onChange={e => {
            const selected = e.target.files?.[0] ?? null;
            if (selected && selected.size > 5 * 1024 * 1024) {
              setError("Photo must be 5 MB or smaller."); e.target.value = ""; setPhoto(null); return;
            }
            setError(""); setPhoto(selected);
          }} className="mt-1 block w-full rounded-lg border p-3" />
        </label>
        <label className="flex items-center gap-2 text-sm font-medium">
          <input type="checkbox" checked={form.active} onChange={e => setForm({ ...form, active: e.target.checked })} />
          Active (show on website)
        </label>
        <div className="flex flex-wrap gap-3">
          <button disabled={saving} className="rounded-lg bg-[#075e4d] px-5 py-3 text-white disabled:opacity-50">
            {saving ? "Saving..." : editingId ? "Save Changes" : "Add Testimonial"}
          </button>
          {editingId && <button type="button" onClick={reset} className="flex items-center gap-1 rounded-lg border px-5 py-3"><X size={16}/> Cancel</button>}
        </div>
      </form>
      <section className="rounded-2xl border border-[#E8E3D8] bg-white p-5 shadow-sm">
        <h2 className="mb-4 font-semibold text-[#243A34]">Saved Testimonials ({items.length})</h2>
        {loading ? <p className="text-gray-500">Loading...</p> : items.length === 0 ?
          <p className="text-gray-500">No testimonials found.</p> :
          <div className="grid gap-4 md:grid-cols-2">
            {items.map(item => {
              const name = item.customerName ?? "Customer";
              const comment = item.comment ?? "";
              const image = item.imageUrl;
              return <article key={item.id} className="rounded-xl border p-4">
                <div className="flex gap-3 items-center">
                  {image ? <img src={image} alt={name} className="h-14 w-14 rounded-full object-cover" /> :
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#EEF5F1]"><ImagePlus size={22}/></span>}
                  <div><h3 className="font-bold">{name}</h3>
                    <div className="flex gap-1 text-amber-500">{Array.from({ length: 5 }, (_, i) =>
                      <Star key={i} size={15} fill={i < Number(item.rating ?? 5) ? "currentColor" : "none"} />)}</div>
                  </div>
                </div>
                <p className="my-4 text-sm text-gray-600">{comment}</p>
                <p className="mb-3 text-xs text-gray-500">{item.active ? "Active" : "Inactive"}</p>
                <div className="flex gap-2">
                  <button onClick={() => edit(item)} className="flex items-center gap-1 rounded-lg border px-3 py-2 text-sm"><Pencil size={15}/> Edit</button>
                </div>
              </article>;
            })}
          </div>}
      </section>

      {/* YouTube videos are managed separately from customer testimonials. */}
      <section ref={videoFormRef} className="rounded-2xl border border-[#E8E3D8] bg-white p-5 shadow-sm space-y-4 scroll-mt-6">
        <div className="flex items-center gap-2">
          <Video className="text-red-600" size={24} />
          <h2 className="text-xl font-bold text-[#243A34]">YouTube Video Management</h2>
        </div>
        <p className="text-sm text-gray-500">Add videos for the Raw Material — Posters & Videos section on the home page.</p>
        {videoError && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700 break-words">{videoError}</p>}
        {videoNotice && <p role="status" className="rounded-xl bg-green-50 p-3 text-sm text-green-700">{videoNotice}</p>}
        <form onSubmit={saveVideo} className="space-y-4">
          <h3 className="flex items-center gap-2 font-semibold text-[#243A34]">
            {editingVideoId ? <Pencil size={18} /> : <Plus size={18} />}
            {editingVideoId ? "Edit YouTube Video" : "Add YouTube Video"}
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block text-sm font-medium">Video Title
              <input required maxLength={200} value={videoForm.title}
                onChange={e => setVideoForm(prev => ({ ...prev, title: e.target.value }))}
                className="mt-1 block w-full rounded-lg border p-3" placeholder="Traditional Wood-Pressed Oil" />
            </label>
            <label className="block text-sm font-medium">YouTube Video Link
              <input required type="url" maxLength={1000} value={videoForm.youtubeUrl}
                onChange={e => setVideoForm(prev => ({ ...prev, youtubeUrl: e.target.value }))}
                className="mt-1 block w-full rounded-lg border p-3" placeholder="https://www.youtube.com/watch?v=..." />
            </label>
          </div>
          <label className="block text-sm font-medium">Video Description
            <textarea rows={3} maxLength={10000} value={videoForm.description}
              onChange={e => setVideoForm(prev => ({ ...prev, description: e.target.value }))}
              className="mt-1 block w-full rounded-lg border p-3" placeholder="About this video" />
          </label>
          <div className="flex flex-wrap items-center gap-6">
            <label className="block text-sm font-medium">Display Order
              <input type="number" min="0" step="1" value={videoForm.displayOrder}
                onChange={e => setVideoForm(prev => ({ ...prev, displayOrder: e.target.value }))}
                className="mt-1 block w-36 rounded-lg border p-3" />
            </label>
            <label className="flex items-center gap-2 text-sm font-medium">
              <input type="checkbox" checked={videoForm.active}
                onChange={e => setVideoForm(prev => ({ ...prev, active: e.target.checked }))} />
              Active (show on website)
            </label>
          </div>
          <div className="flex flex-wrap gap-3">
            <button type="submit" disabled={videoSaving}
              className="flex items-center gap-2 rounded-lg bg-[#075e4d] px-5 py-3 text-white disabled:opacity-50">
              <Video size={18} />
              {videoSaving ? "Saving..." : editingVideoId ? "Save Video Changes" : "Add YouTube Video"}
            </button>
            {editingVideoId && <button type="button" onClick={resetVideo}
              className="flex items-center gap-1 rounded-lg border px-5 py-3"><X size={16} /> Cancel</button>}
          </div>
        </form>
      </section>

      <section className="rounded-2xl border border-[#E8E3D8] bg-white p-5 shadow-sm">
        <h2 className="mb-4 font-semibold text-[#243A34]">Saved YouTube Videos ({videos.length})</h2>
        {videoLoading ? <p className="text-gray-500">Loading videos...</p> : videos.length === 0 ?
          <p className="text-gray-500">No YouTube videos added yet.</p> :
          <div className="grid gap-4 md:grid-cols-2">
            {videos.map(video => (
              <article key={video.id} className="overflow-hidden rounded-xl border">
                {video.thumbnailUrl && <img src={video.thumbnailUrl} alt={video.title}
                  className="h-44 w-full bg-gray-100 object-cover" loading="lazy" />}
                <div className="space-y-2 p-4">
                  <h3 className="font-bold text-[#243A34]">{video.title}</h3>
                  {video.description && <p className="text-sm text-gray-600">{video.description}</p>}
                  <p className="text-xs text-gray-500">{video.active ? "Active" : "Inactive"} · Order: {video.displayOrder ?? 0}</p>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={() => editVideo(video)}
                      className="flex items-center gap-1 rounded-lg border px-3 py-2 text-sm"><Pencil size={15} /> Edit</button>
                    <button type="button" disabled={deletingVideoId === video.id}
                      onClick={() => deleteVideo(video)}
                      className="flex items-center gap-1 rounded-lg border border-red-200 px-3 py-2 text-sm text-red-700 disabled:opacity-50">
                      <Trash2 size={15} /> {deletingVideoId === video.id ? "Deleting..." : "Delete"}
                    </button>
                    <a href={video.youtubeUrl} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1 rounded-lg border px-3 py-2 text-sm"><ExternalLink size={15} /> Watch</a>
                  </div>
                </div>
              </article>
            ))}
          </div>}
      </section>
    </div>
  );
}
