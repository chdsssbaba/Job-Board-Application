import React from 'react';
import useJobStore from '../store/useJobStore';
import { Bookmark, MapPin, Building2, DollarSign, Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const JobCard = ({ job, viewMode = 'grid' }) => {
    const { bookmarkedJobs, toggleBookmark } = useJobStore();
    const isBookmarked = bookmarkedJobs.includes(job.id);

    const handleBookmarkClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleBookmark(job.id);
    };

    // Safe formatting for currency
    const formattedSalary = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
    }).format(job.salary);

    // Safe formatting for date
    let timeAgo = 'Recently';
    try {
        timeAgo = formatDistanceToNow(new Date(job.postedDate), { addSuffix: true });
    } catch (e) { }

    const containerClasses = viewMode === 'grid'
        ? "glass-card rounded-2xl p-6 transition-all duration-300 relative flex flex-col h-full group"
        : "glass-card rounded-2xl p-6 transition-all duration-300 relative flex flex-col md:flex-row items-start md:items-center gap-6 group";

    return (
        <div
            className={containerClasses}
            data-testid={`job-card-${job.id}`}
        >
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h3 className="text-lg font-bold text-indigo-50 line-clamp-1 drop-shadow-sm" title={job.title}>{job.title}</h3>
                        <p className="text-sm font-semibold bg-gradient-to-r from-purple-300 to-violet-300 bg-clip-text text-transparent flex items-center gap-1 mt-1">
                            <Building2 className="w-3 h-3 text-purple-300" />
                            {job.companyName || "Company"}
                        </p>
                    </div>
                    {viewMode === 'grid' && (
                        <button
                            onClick={handleBookmarkClick}
                            data-testid={`bookmark-btn-${job.id}`}
                            data-bookmarked={isBookmarked.toString()}
                            className={`p-2.5 rounded-full transition-all duration-300 ${isBookmarked
                                    ? 'bg-gradient-to-r from-purple-500 to-violet-600 text-white shadow-lg animate-pulse-glow'
                                    : 'glass-button text-indigo-200 hover:text-white'
                                }`}
                        >
                            <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
                        </button>
                    )}
                </div>

                <div className="flex flex-wrap gap-y-2 gap-x-4 text-sm text-indigo-200 mb-4 items-center">
                    <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <BriefcaseIcon className="w-4 h-4" />
                        <span>{job.jobType}</span>
                    </div>
                    <div className="flex items-center gap-1 text-purple-200 font-bold drop-shadow-sm" data-testid="job-salary">
                        <DollarSign className="w-4 h-4" />
                        <span>{formattedSalary}</span>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-auto">
                    {job.skills.map(skill => (
                        <span key={skill} className="px-3 py-1.5 glass-button text-indigo-100 text-xs rounded-full font-semibold">
                            {skill}
                        </span>
                    ))}
                </div>

                <div className="mt-4 text-xs text-indigo-300 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Posted {timeAgo}
                </div>
            </div>

            {viewMode === 'list' && (
                <div className="ml-auto flex-shrink-0">
                    <button
                        onClick={handleBookmarkClick}
                        data-testid={`bookmark-btn-${job.id}`}
                        data-bookmarked={isBookmarked.toString()}
                        className={`p-2.5 rounded-full transition-all duration-300 ${isBookmarked
                                ? 'bg-gradient-to-r from-purple-500 to-violet-600 text-white shadow-lg animate-pulse-glow'
                                : 'glass-button text-indigo-200 hover:text-white'
                            }`}
                    >
                        <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
                    </button>
                </div>
            )}
        </div>
    );
};

// Helper component for Briefcase icon
function BriefcaseIcon(props) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
    )
}

export default JobCard;
