import React from "react";
import { Plus, Search, FileText, Pencil, Trash2 } from "lucide-react";

export default function AdminBlogs() {

  const blogs = [];

  return (
    <div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7">

        <div>
          <h1 className="text-2xl font-bold text-[#243A34]">
            Blogs
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Manage ShreeKrishna articles and recipes.
          </p>
        </div>

        <button
          type="button"
          className="flex items-center justify-center gap-2 bg-[#075e4d] text-white px-5 py-3 rounded-xl text-sm font-semibold"
        >
          <Plus size={17} />
          Add Blog
        </button>

      </div>

      <div className="bg-white rounded-2xl border border-[#E8E3D8] overflow-hidden">

        <div className="p-4 border-b">

          <div className="max-w-sm flex items-center gap-2 bg-[#F7F8F7] rounded-xl px-4">

            <Search
              size={17}
              className="text-gray-400"
            />

            <input
              type="text"
              placeholder="Search blogs..."
              className="w-full py-3 bg-transparent outline-none text-sm"
            />

          </div>

        </div>

        {blogs.length === 0 ? (

          <div className="min-h-[350px] flex flex-col items-center justify-center text-gray-400">

            <div className="w-16 h-16 rounded-2xl bg-[#EEF5F1] text-[#075e4d] flex items-center justify-center">

              <FileText size={30} />

            </div>

            <p className="mt-4 font-semibold text-gray-600">
              No blogs added yet
            </p>

            <p className="text-xs mt-1">
              New blogs will appear here.
            </p>

          </div>

        ) : (

          blogs.map((blog) => (
            <div
              key={blog.id}
              className="flex items-center justify-between p-5 border-b"
            >

              <span>{blog.title}</span>

              <div className="flex gap-2">

                <button>
                  <Pencil size={16} />
                </button>

                <button>
                  <Trash2 size={16} />
                </button>

              </div>

            </div>
          ))

        )}

      </div>

    </div>
  );
}