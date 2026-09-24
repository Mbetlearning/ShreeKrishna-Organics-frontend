import React from "react";
import {
  Star,
  MessageSquare,
  Check,
  Trash2,
} from "lucide-react";

export default function AdminReviews() {

  const reviews = [];

  return (
    <div>

      <div className="mb-7">

        <h1 className="text-2xl font-bold text-[#243A34]">
          Customer Reviews
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          Manage customer ratings and reviews.
        </p>

      </div>

      <div className="grid sm:grid-cols-3 gap-5 mb-6">

        <Stat
          title="Total Reviews"
          value="0"
          icon={MessageSquare}
        />

        <Stat
          title="Average Rating"
          value="0.0"
          icon={Star}
        />

        <Stat
          title="Pending"
          value="0"
          icon={Check}
        />

      </div>

      <div className="bg-white rounded-2xl border border-[#E8E3D8]">

        {reviews.length === 0 ? (

          <div className="min-h-[320px] flex flex-col items-center justify-center text-gray-400">

            <Star
              size={42}
              strokeWidth={1.3}
            />

            <p className="mt-3 text-sm">
              No customer reviews yet.
            </p>

            <p className="text-xs mt-1">
              Reviews will appear here.
            </p>

          </div>

        ) : (

          reviews.map((review) => (

            <div
              key={review.id}
              className="p-5 border-b flex justify-between"
            >

              <span>
                {review.name}
              </span>

              <button className="text-red-500">
                <Trash2 size={17} />
              </button>

            </div>

          ))

        )}

      </div>

    </div>
  );
}

function Stat({
  title,
  value,
  icon: Icon,
}) {

  return (
    <div className="bg-white border border-[#E8E3D8] rounded-2xl p-5">

      <div className="w-10 h-10 bg-[#EEF5F1] text-[#075e4d] rounded-xl flex items-center justify-center">

        <Icon size={19} />

      </div>

      <p className="text-2xl font-bold text-[#243A34] mt-4">
        {value}
      </p>

      <p className="text-xs text-gray-500 mt-1">
        {title}
      </p>

    </div>
  );
}