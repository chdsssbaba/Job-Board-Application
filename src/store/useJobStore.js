import { create } from 'zustand';

// Helper to get bookmarks from local storage
const getBookmarksFromStorage = () => {
    try {
        const stored = localStorage.getItem('bookmarkedJobs');
        return stored ? JSON.parse(stored) : [];
    } catch (e) {
        console.error("Failed to parse bookmarks", e);
        return [];
    }
};

const useJobStore = create((set, get) => ({
    bookmarkedJobs: getBookmarksFromStorage(),

    toggleBookmark: (jobId) => {
        const { bookmarkedJobs } = get();
        let newBookmarks;
        if (bookmarkedJobs.includes(jobId)) {
            newBookmarks = bookmarkedJobs.filter((id) => id !== jobId);
        } else {
            newBookmarks = [...bookmarkedJobs, jobId];
        }

        set({ bookmarkedJobs: newBookmarks });
        localStorage.setItem('bookmarkedJobs', JSON.stringify(newBookmarks));
    },

    // Sync state if localStorage changes from elsewhere (optional, but good)
    syncBookmarks: () => {
        set({ bookmarkedJobs: getBookmarksFromStorage() });
    }
}));

export default useJobStore;
