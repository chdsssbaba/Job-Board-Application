import React, { useMemo } from 'react';
import useJobStore from '../store/useJobStore';
import JobCard from '../components/JobCard';
import { getEnrichedJobs } from '../utils/jobUtils';
import { Bookmark } from 'lucide-react';

export default function Tracker() {
    const { bookmarkedJobs } = useJobStore();

    const allJobs = useMemo(() => getEnrichedJobs(), []);

    const bookmarkedJobList = useMemo(() => {
        return allJobs.filter(job => bookmarkedJobs.includes(job.id));
    }, [allJobs, bookmarkedJobs]);

    if (bookmarkedJobList.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="glass-strong p-8 rounded-full mb-6 shadow-xl animate-pulse-glow">
                    <Bookmark className="w-16 h-16 text-purple-300" />
                </div>
                <h2 className="text-2xl font-bold text-indigo-100 mb-3 drop-shadow-lg glow">No bookmarks yet</h2>
                <p className="text-indigo-200 max-w-md text-lg">
                    Jobs you bookmark will appear here. Go back to the job listings to find your next opportunity.
                </p>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-indigo-100 mb-2 drop-shadow-lg glow">Application Tracker</h1>
                <p className="text-indigo-200 text-lg">
                    You have {bookmarkedJobList.length} bookmarked {bookmarkedJobList.length === 1 ? 'job' : 'jobs'}
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bookmarkedJobList.map(job => (
                    <JobCard key={job.id} job={job} viewMode="grid" />
                ))}
            </div>
        </div>
    );
}
