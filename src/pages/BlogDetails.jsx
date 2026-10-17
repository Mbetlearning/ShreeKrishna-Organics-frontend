import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CalendarDays, BookOpen } from "lucide-react";
import { blogApi } from "../services/blogApi";

export default function BlogDetails() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    setBlog(null);

    blogApi.getBlogBySlug(slug)
      .then((result) => {
        if (active) setBlog(result);
      })
      .catch((err) => {
        if (active) setError(err.message || "Blog not found.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [slug]);

  return (
    <main className="min-h-screen bg-[#FAF7F0] px-4 py-12 text-[#26362F] sm:px-6">
      <div className="mx-auto max-w-4xl">
        <Link
          to="/blogs"
          className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-[#075e4d]"
        >
          <ArrowLeft size={17} /> Back to Blogs
        </Link>

        {loading && (
          <p className="py-12 text-center text-gray-500">Loading article...</p>
        )}

        {!loading && error && (
          <p role="alert" className="rounded-xl bg-red-50 p-5 text-red-700">
            {error}
          </p>
        )}

        {!loading && !error && !blog && (
          <p className="rounded-xl bg-white p-5 text-center text-gray-500">
            Blog not found.
          </p>
        )}

        {!loading && !error && blog && (
          <article className="overflow-hidden rounded-3xl border border-[#E7DED0] bg-white shadow-sm">
            {blog.imageUrl ? (
              <img
                src={blog.imageUrl}
                alt={blog.title}
                className="max-h-[440px] w-full object-cover"
              />
            ) : (
              <div className="flex h-48 items-center justify-center bg-[#EEF5F1] text-[#075e4d]">
                <BookOpen size={48} />
              </div>
            )}
            <div className="p-6 sm:p-10">
              <p className="mb-3 flex items-center gap-2 text-xs text-gray-500">
                <CalendarDays size={15} />
                {blog.publishedAt
                  ? new Date(blog.publishedAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  : "ShreeKrishna Journal"}
              </p>
              <h1 className="font-serif text-3xl font-bold leading-tight text-[#213B32] sm:text-4xl">
                {blog.title}
              </h1>
              <div className="mt-8 whitespace-pre-wrap break-words text-base leading-8 text-[#46554E]">
                {blog.content}
              </div>
            </div>
          </article>
        )}
      </div>
    </main>
  );
}
