
import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Users, Star, DollarSign } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnailUrl?: string;
  instructor: {
    firstName: string;
    lastName: string;
  };
  price?: number;
  duration?: string;
  studentsCount?: number;
  rating?: number;
  category?: string;
}

interface CourseCardProps {
  course: Course;
  showEnrollButton?: boolean;
  isEnrolled?: boolean;
  onEnroll?: (courseId: string) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ 
  course, 
  showEnrollButton = true, 
  isEnrolled = false,
  onEnroll 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
      <div className="aspect-video bg-gray-100 relative overflow-hidden">
        {course.thumbnailUrl ? (
          <img
            src={course.thumbnailUrl}
            alt={course.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <span className="text-gray-400 text-4xl font-bold">
              {course.title.charAt(0)}
            </span>
          </div>
        )}
        {course.price && (
          <div className="absolute top-3 right-3 bg-black text-white px-2 py-1 rounded text-sm font-medium">
            ${course.price}
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="mb-2">
          {course.category && (
            <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full mb-2">
              {course.category}
            </span>
          )}
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {course.title}
          </h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {course.description}
          </p>
        </div>

        <div className="flex items-center text-sm text-gray-500 mb-4">
          <span className="font-medium">
            {course.instructor.firstName} {course.instructor.lastName}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-4">
            {course.duration && (
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{course.duration}</span>
              </div>
            )}
            {course.studentsCount !== undefined && (
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>{course.studentsCount}</span>
              </div>
            )}
            {course.rating && (
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 fill-current text-yellow-400" />
                <span>{course.rating}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Link
            to={`/course/${course.id}`}
            className="text-black hover:underline font-medium text-sm"
          >
            View Details
          </Link>

          {showEnrollButton && !isEnrolled && (
            <button
              onClick={() => onEnroll?.(course.id)}
              className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              {course.price ? `Enroll - $${course.price}` : 'Enroll Free'}
            </button>
          )}

          {isEnrolled && (
            <Link
              to={`/course/${course.id}/learn`}
              className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
            >
              Continue Learning
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
