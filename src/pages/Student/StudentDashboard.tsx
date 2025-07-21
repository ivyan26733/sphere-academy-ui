import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { enrolledCourses } from '../../api/courseApi';
import { BookOpen, TrendingUp, Clock, Award } from 'lucide-react';

interface EnrolledCourse {
  id: string;
  title: string;
  description: string;
  thumbnailUrl?: string;
  instructor: {
    userName: string;
  };
  progress: number;
  lastAccessed?: string;
  totalLessons: number;
  completedLessons: number;
}

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [enrolledCoursesList, setEnrolledCoursesList] = useState<EnrolledCourse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const apiCourses = await enrolledCourses();

        const mappedCourses: EnrolledCourse[] = apiCourses.map((course: any) => ({
          id: course.id.toString(),
          title: course.title,
          description: course.category || "No description provided",
          thumbnailUrl: undefined, // Update when backend supports thumbnails
          instructor: {
            userName: course.instructorEmail?.split('@')[0] || 'Instructor'
          },
          totalLessons: course.modules?.reduce(
            (sum: number, mod: any) => sum + (mod.lessons?.length || 0),
            0
          ) || 0,
          completedLessons: 0, // Can be updated with real tracking
          progress: 0,         // Can be calculated from completion tracking
          lastAccessed: 'Recently'
        }));

        setEnrolledCoursesList(mappedCourses);
      } catch (error) {
        console.error('Failed to fetch enrolled courses', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, []);

  const stats = {
    totalCourses: enrolledCoursesList.length,
    completedCourses: enrolledCoursesList.filter(course => course.progress === 100).length,
    totalHours: enrolledCoursesList.reduce(
      (total, course) => total + course.totalLessons * 0.5,
      0
    ),
    avgProgress:
      enrolledCoursesList.length > 0
        ? Math.round(
            enrolledCoursesList.reduce((sum, course) => sum + course.progress, 0) /
              enrolledCoursesList.length
          )
        : 0
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.userName}!
          </h1>
          <p className="text-gray-600 mt-2">
            Continue your learning journey and track your progress
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard icon={<BookOpen className="h-8 w-8 text-blue-600" />} label="Enrolled Courses" value={stats.totalCourses} />
          <StatCard icon={<Award className="h-8 w-8 text-green-600" />} label="Completed" value={stats.completedCourses} />
          <StatCard icon={<Clock className="h-8 w-8 text-purple-600" />} label="Learning Hours" value={`${stats.totalHours}h`} />
          <StatCard icon={<TrendingUp className="h-8 w-8 text-orange-600" />} label="Avg Progress" value={`${stats.avgProgress}%`} />
        </div>

        {/* Enrolled Courses */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">My Courses</h2>
          </div>

          {loading ? (
            <SkeletonLoader />
          ) : enrolledCoursesList.length > 0 ? (
            <div className="space-y-6">
              {enrolledCoursesList.map(course => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <NoCourses />
          )}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: number | string }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <div className="flex items-center">
      {icon}
      <div className="ml-4">
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        <div className="text-sm text-gray-600">{label}</div>
      </div>
    </div>
  </div>
);

const SkeletonLoader = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[1, 2, 3].map(i => (
      <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-pulse">
        <div className="aspect-video bg-gray-200"></div>
        <div className="p-6">
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    ))}
  </div>
);

const NoCourses = () => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
    <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
    <h3 className="text-lg font-medium text-gray-900 mb-2">No courses yet</h3>
    <p className="text-gray-600 mb-4">Start your learning journey by enrolling in a course</p>
    <button className="bg-black text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors">
      Browse Courses
    </button>
  </div>
);

// Dummy component stub for CourseCard (You can replace this with your styled version)
const CourseCard = ({ course }: { course: EnrolledCourse }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
    <div className="flex flex-col md:flex-row">
      <div className="md:w-64 aspect-video md:aspect-square bg-gray-100 relative overflow-hidden">
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
      </div>

      <div className="flex-1 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {course.title}
            </h3>
            <p className="text-gray-600 mb-2">
              by {course.instructor.userName}
            </p>
            <p className="text-sm text-gray-500">
              Last accessed: {course.lastAccessed}
            </p>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Progress: {course.completedLessons}/{course.totalLessons} lessons</span>
            <span>{course.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${course.progress}%` }}
            ></div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            {course.progress === 100 ? 'Completed' : 'In Progress'}
          </div>
          <button className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
            Continue Learning
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default StudentDashboard;
