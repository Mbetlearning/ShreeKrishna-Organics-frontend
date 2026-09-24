import React, { useState } from "react";
import {
  Image,
  Upload,
  Video,
  Trash2,
} from "lucide-react";

export default function AdminMedia() {

  const [selectedFile, setSelectedFile] = useState(null);

  const handleFile = (e) => {
    const file = e.target.files?.[0];

    if (file) {
      setSelectedFile(file);
    }
  };

  return (
    <div>

      <div className="mb-7">

        <h1 className="text-2xl font-bold text-[#243A34]">
          Media Management
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          Manage product images, posters and videos.
        </p>

      </div>

      <div className="grid lg:grid-cols-2 gap-6">

        {/* UPLOAD */}

        <div className="bg-white rounded-2xl border border-[#E8E3D8] p-6">

          <h2 className="font-bold text-[#243A34]">
            Upload Media
          </h2>

          <label className="mt-5 min-h-[230px] border-2 border-dashed border-[#D9E4DE] rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-[#F8FBF9] transition">

            <div className="w-14 h-14 rounded-full bg-[#EEF5F1] text-[#075e4d] flex items-center justify-center">

              <Upload size={24} />

            </div>

            <p className="mt-4 text-sm font-semibold text-[#243A34]">
              Choose Image or Video
            </p>

            <p className="text-xs text-gray-400 mt-1">
              JPG, PNG, WEBP or MP4
            </p>

            <input
              type="file"
              accept="image/*,video/*"
              onChange={handleFile}
              className="hidden"
            />

          </label>

          {selectedFile && (

            <div className="mt-4 bg-[#F7F8F7] p-4 rounded-xl flex items-center justify-between">

              <div className="flex items-center gap-3">

                <Image
                  size={19}
                  className="text-[#075e4d]"
                />

                <span className="text-sm">
                  {selectedFile.name}
                </span>

              </div>

              <button
                type="button"
                onClick={() => setSelectedFile(null)}
                className="text-red-500"
              >
                <Trash2 size={17} />
              </button>

            </div>

          )}

          <button
            type="button"
            className="mt-5 w-full bg-[#075e4d] text-white py-3 rounded-xl font-semibold"
          >
            Upload Media
          </button>

        </div>

        {/* MEDIA INFO */}

        <div className="bg-white rounded-2xl border border-[#E8E3D8] p-6">

          <h2 className="font-bold text-[#243A34]">
            Media Library
          </h2>

          <div className="grid grid-cols-2 gap-4 mt-5">

            <div className="bg-[#F7F8F7] rounded-xl p-5">

              <Image
                size={24}
                className="text-[#075e4d]"
              />

              <p className="text-2xl font-bold mt-4">
                0
              </p>

              <p className="text-xs text-gray-500">
                Images
              </p>

            </div>

            <div className="bg-[#F7F8F7] rounded-xl p-5">

              <Video
                size={24}
                className="text-[#075e4d]"
              />

              <p className="text-2xl font-bold mt-4">
                0
              </p>

              <p className="text-xs text-gray-500">
                Videos
              </p>

            </div>

          </div>

          <div className="mt-5 min-h-[140px] flex items-center justify-center text-sm text-gray-400">
            Uploaded media will appear here.
          </div>

        </div>

      </div>

    </div>
  );
}