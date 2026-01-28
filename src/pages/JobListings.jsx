import React, { useState, useMemo, useEffect } from 'react';
import Select from 'react-select';
import ReactSlider from 'react-slider';
import { getEnrichedJobs } from '../utils/jobUtils';
import JobCard from '../components/JobCard';
import { LayoutGrid, List, Search, SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';

const ITEMS_PER_PAGE = 10;

// Unique distinct skills for the dropdown
const ALL_SKILLS = [
    "React", "TypeScript", "GraphQL", "Node.js", "Express", "MongoDB", "PostgreSQL",
    "Figma", "Sketch", "Prototyping", "Docker", "Kubernetes", "AWS", "HTML", "CSS",
    "JavaScript", "React Native", "Redux", "Mobile Development", "Product Management",
    "Agile", "Strategy", "Vue.js", "Nuxt", "Python", "Machine Learning", "SQL",
    "Java", "Spring Boot", "Microservices", "TensorFlow", "PyTorch", "Security",
    "Network Analysis", "Azure", "Cloud Architecture", "UI/UX", "Design Systems",
    "Team Leadership", "Go", "Selenium", "Cypress", "Documentation", "Technical Writing",
    "Markdown", "Marketing", "SEO", "Content Strategy", "Linux", "Observability",
    "Swift", "iOS", "Xcode", "Business Analysis", "Requirements Gathering",
    "Human Resources", "Recruiting", "Communication"
].map(s => ({ value: s, label: s }));

export default function JobListings() {
    // Data
    const allJobs = useMemo(() => getEnrichedJobs(), []);

    // View State
    const [viewMode, setViewMode] = useState('grid');

    // Filter State
    const [search, setSearch] = useState('');
    const [jobType, setJobType] = useState('All');
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [salaryRange, setSalaryRange] = useState([0, 200000]);

    // Sort State
    const [sortBy, setSortBy] = useState('posted-desc');

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);

    // --- Filtering Logic ---
    const filteredJobs = useMemo(() => {
        return allJobs.filter(job => {
            // Search (Title or Company)
            if (search) {
                const term = search.toLowerCase();
                const matchesTitle = job.title.toLowerCase().includes(term);
                const matchesCompany = job.companyName.toLowerCase().includes(term);
                if (!matchesTitle && !matchesCompany) return false;
            }

            // Job Type
            if (jobType !== 'All' && job.jobType !== jobType) {
                return false;
            }

            // Skills (Must match ALL selected)
            if (selectedSkills.length > 0) {
                const hasAllSkills = selectedSkills.every(s => job.skills.includes(s.value));
                if (!hasAllSkills) return false;
            }

            // Salary Range
            if (job.salary < salaryRange[0] || job.salary > salaryRange[1]) {
                return false;
            }

            return true;
        });
    }, [allJobs, search, jobType, selectedSkills, salaryRange]);

    // --- Sorting Logic ---
    const sortedJobs = useMemo(() => {
        const jobs = [...filteredJobs];
        if (sortBy === 'salary-desc') {
            return jobs.sort((a, b) => b.salary - a.salary);
        }
        return jobs.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate));
    }, [filteredJobs, sortBy]);

    // --- Pagination Logic ---
    const totalPages = Math.ceil(sortedJobs.length / ITEMS_PER_PAGE);
    const displayedJobs = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return sortedJobs.slice(start, start + ITEMS_PER_PAGE);
    }, [sortedJobs, currentPage]);

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [search, jobType, selectedSkills, salaryRange, sortBy]);

    // Handlers
    const handleClearFilters = () => {
        setSearch('');
        setJobType('All');
        setSelectedSkills([]);
        setSalaryRange([0, 200000]);
        setSortBy('posted-desc');
    };

    return (
        <div className="flex flex-col lg:flex-row gap-8">
            {/* --- Sidebar Filters --- */}
            <aside className="w-full lg:w-80 flex-shrink-0 space-y-8">
                <div className="glass-strong p-6 rounded-2xl border border-purple-400/20 shadow-xl sticky top-24">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold flex items-center gap-2 text-indigo-100 drop-shadow-lg">
                            <SlidersHorizontal className="w-5 h-5 text-purple-300" />
                            Filters
                        </h2>
                        <button
                            data-testid="clear-filters-btn"
                            onClick={handleClearFilters}
                            className="text-sm text-indigo-200 hover:text-white font-semibold hover:underline"
                        >
                            Clear All
                        </button>
                    </div>

                    {/* Job Type */}
                    <div className="mb-6">
                        <h3 className="text-sm font-semibold text-indigo-100 mb-3">Job Type</h3>
                        <div className="space-y-2">
                            {['All', 'Remote', 'Hybrid', 'Onsite'].map((type) => (
                                <label key={type} className="flex items-center gap-2 cursor-pointer group">
                                    <input
                                        type="radio"
                                        name="jobType"
                                        value={type}
                                        checked={jobType === type}
                                        onChange={(e) => setJobType(e.target.value)}
                                        data-testid={type !== 'All' ? `filter-job-type-${type.toLowerCase()}` : undefined}
                                        className="w-4 h-4 text-purple-600 border-purple-400/30 focus:ring-purple-500 bg-purple-900/10"
                                    />
                                    <span className="text-indigo-200 group-hover:text-white transition-colors">{type}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Skills */}
                    <div className="mb-6" data-testid="filter-skills">
                        <h3 className="text-sm font-semibold text-indigo-100 mb-3">Skills</h3>
                        <Select
                            isMulti
                            options={ALL_SKILLS}
                            value={selectedSkills}
                            onChange={setSelectedSkills}
                            className="react-select-container"
                            classNamePrefix="react-select"
                            placeholder="Select skills..."
                        />
                    </div>

                    {/* Salary Range */}
                    <div className="mb-6" data-testid="filter-salary-slider">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-sm font-semibold text-indigo-100">Salary Range</h3>
                            <span className="text-xs text-indigo-300 font-medium">
                                ${(salaryRange[0] / 1000).toFixed(0)}k - ${(salaryRange[1] / 1000).toFixed(0)}k
                            </span>
                        </div>

                        <ReactSlider
                            className="h-6 w-full"
                            thumbClassName="slider-thumb w-6 h-6 rounded-full -mt-2 shadow-lg"
                            trackClassName="slider-track bg-purple-900/20 h-2 rounded-full mt-0"
                            min={0}
                            max={200000}
                            step={5000}
                            value={salaryRange}
                            onChange={setSalaryRange}
                            renderTrack={(props, state) => {
                                const { key, ...restProps } = props;
                                const isMiddle = state.index === 1;
                                const className = isMiddle ? "slider-track-1 h-2 rounded-full mt-0" : "slider-track bg-purple-900/20 h-2 rounded-full mt-0";
                                return <div key={key} {...restProps} className={className} />;
                            }}
                        />
                        <div className="flex justify-between mt-2 text-xs text-indigo-400">
                            <span>$0k</span>
                            <span>$200k+</span>
                        </div>
                    </div>
                </div>
            </aside>

            {/* --- Main Content --- */}
            <div className="flex-1">
                {/* Top Bar: Search & Sort & View Toggle */}
                <div className="glass-strong p-4 rounded-2xl border border-purple-400/20 shadow-xl mb-6">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">

                        {/* Search */}
                        <div className="relative w-full md:max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-300 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search by title or company..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                data-testid="search-input"
                                className="glass-input w-full pl-10 pr-4 py-2.5 rounded-xl text-indigo-50 placeholder-indigo-400"
                            />
                        </div>

                        <div className="flex items-center gap-4 w-full md:w-auto">
                            {/* Sort Buttons */}
                            <div className="flex glass p-1 rounded-xl">
                                <button
                                    onClick={() => setSortBy('posted-desc')}
                                    className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${sortBy === 'posted-desc'
                                            ? 'glass-button-active text-white shadow-lg'
                                            : 'text-indigo-200 hover:text-white'
                                        }`}
                                >
                                    Newest
                                </button>
                                <button
                                    onClick={() => setSortBy('salary-desc')}
                                    data-testid="sort-salary-desc"
                                    className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${sortBy === 'salary-desc'
                                            ? 'glass-button-active text-white shadow-lg'
                                            : 'text-indigo-200 hover:text-white'
                                        }`}
                                >
                                    Salary ($$$)
                                </button>
                            </div>

                            {/* View Toggle */}
                            <div className="flex glass p-1 rounded-xl">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    data-testid="grid-view-btn"
                                    className={`p-2.5 rounded-lg transition-all ${viewMode === 'grid'
                                            ? 'glass-button-active text-white'
                                            : 'text-indigo-200 hover:text-white'
                                        }`}
                                >
                                    <LayoutGrid className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    data-testid="list-view-btn"
                                    className={`p-2.5 rounded-lg transition-all ${viewMode === 'list'
                                            ? 'glass-button-active text-white'
                                            : 'text-indigo-200 hover:text-white'
                                        }`}
                                >
                                    <List className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Results Info */}
                <div className="mb-4 text-indigo-100 text-sm font-semibold drop-shadow-sm">
                    Showing {displayedJobs.length} of {filteredJobs.length} jobs
                </div>

                {/* --- Job List Container --- */}
                <div
                    data-testid="job-list-container"
                    data-view-mode={viewMode}
                    className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 gap-6" : "flex flex-col gap-4"}
                >
                    {displayedJobs.map(job => (
                        <JobCard key={job.id} job={job} viewMode={viewMode} />
                    ))}

                    {displayedJobs.length === 0 && (
                        <div className="col-span-full py-12 text-center glass-card rounded-2xl">
                            <Search className="w-12 h-12 mx-auto mb-3 text-indigo-300" />
                            <p className="text-lg font-bold text-indigo-100 mb-2">No jobs found</p>
                            <p className="text-sm text-indigo-300">Try adjusting your search or filters</p>
                        </div>
                    )}
                </div>

                {/* --- Pagination --- */}
                {totalPages > 1 && (
                    <div className="flex justify-center mt-10" data-testid="pagination-controls">
                        <div className="flex items-center gap-2 glass-strong p-2 rounded-full shadow-xl">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="p-2.5 rounded-full glass-button hover:glass-button-active text-indigo-200 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>

                            <span className="px-6 text-sm font-bold text-indigo-100">
                                Page {currentPage} of {totalPages}
                            </span>

                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                data-testid="pagination-next"
                                className="p-2.5 rounded-full glass-button hover:glass-button-active text-indigo-200 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
