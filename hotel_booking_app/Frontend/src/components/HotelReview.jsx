import { Star } from 'lucide-react';

// Dummy Data (updated according to backend response structure)
const dummyReview = {
  userName: "Terrance Wolff",
  reviewTitle: "Quia asperiores et ducimus.",
  reviewDescription: "Accusamus cumque architecto itaque porro sint nihil ipsam totam ducimus.",
  overallRating: 4,
  reviewImages: [], // This will be used if you want to display images
  ratings: {
    service: 4,
    room: 3,
    cleanliness: 4,
    food: 3,
  }
};

export default function ReviewCard({ review = dummyReview }) {
  const renderStars = (value) => {
    console.log(review);
    return Array(5).fill(0).map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < value ? "fill-slate-500 text-slate-500 " : "fill-muted stroke-muted-foreground"}`}
      />
    ));
  };

  const {
    userName,
    reviewTitle,
    reviewDescription,
    overallRating,
    reviewImages,
    serviceRating,
    roomsRating,
    cleanlinessRating,
    foodRating
  } = review;

  const ratings = {
    "Service": serviceRating,
    "Rooms": roomsRating,
    "Cleanliness": cleanlinessRating,
    "Food": foodRating,
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const initials = getInitials(userName);

  return (
    <div className="max-w-2xl text-gray-900 bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden">

            <div className={`flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 font-semibold text-sm`}>
              {initials}
            </div>

              <div className="absolute inset-0 rounded-full border border-gray-200 dark:border-gray-700"></div>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-gray-900">{userName}</span>
              {/* Show Overall Rating Instead of Time */}
              <div className="flex items-center gap-1">
                {renderStars(overallRating)}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 space-y-4">
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-900 dark:text-gray-900">{reviewTitle}</h3>
            <p className="text-gray-900">{reviewDescription}</p>
          </div>

          {/* Individual Ratings for Facilities */}
          <div className="grid grid-cols-2 gap-3 gap-x-32">
            {Object.entries(ratings).map(([label, rating]) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900 capitalize">{label}</span>
                <div className="flex items-center gap-2">
                  {renderStars(rating)} {/* Render stars for each rating category */}
                </div>
              </div>
            ))}
            </div>
        </div>
      </div>
    </div>
  );
}
