import React, { useState, useEffect, useCallback } from 'react';
import './JobListings.css';
import { useAuthUser } from "./AuthContext";

const JobListings = () => {
    const RAPIDAPI_KEY = '9fce43bfb1mshe32bdec8de47861p18c340jsnbebcf1630f65'; 
    
    const [jobs, setJobs] = useState([]);
    const {user,insertApplication} = useAuthUser();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedJob, setSelectedJob] = useState(null);
    const [filters, setFilters] = useState({
        title: '',
        location: '',
        platform: 'LinkedIn'
    });
    const [searchExecuted, setSearchExecuted] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [jobCache, setJobCache] = useState({});
    const [appliedJobs, setAppliedJobs] = useState(new Set()); 

    const platforms = [
        { value: 'LinkedIn', label: 'LinkedIn' },
        { value: 'Indeed', label: 'Indeed' },
        { value: 'Glassdoor', label: 'Glassdoor' },
    ];

    const fetchJobs = useCallback(async (pageNumber = 1, title = '', location = '') => {
        const cacheKey = `${pageNumber}-${title}-${location}`;

        if (jobCache[cacheKey]) {
            setJobs(jobCache[cacheKey]);
            setCurrentPage(pageNumber);
            setSelectedJob(null);
            setError(null);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);
        setSelectedJob(null);

        try {
            let query = '';
            if (title && location) {
                query = `${title} jobs in ${location}`;
            } else if (title) {
                query = `${title} jobs`;
            } else if (location) {
                query = `jobs in ${location}`;
            } else {
                query = 'jobs';
            }

            const url = `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(query)}&page=${pageNumber}`;

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'X-RapidAPI-Key': RAPIDAPI_KEY,
                    'X-RapidAPI-Host': 'jsearch.p.rapidapi.com',
                },
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(`Failed to fetch jobs (Status: ${response.status})`);
            }

            const data = await response.json();

            if (data && data.status === "OK" && Array.isArray(data.data)) {
                setJobs(data.data);
                setCurrentPage(pageNumber);
                setJobCache(prevCache => ({ ...prevCache, [cacheKey]: data.data }));
            } else {
                setJobs([]);
                setJobCache(prevCache => ({ ...prevCache, [cacheKey]: [] }));
            }

        } catch (err) {
            setError(err.message);
            setJobs([]);
        } finally {
            setLoading(false);
        }
    }, [RAPIDAPI_KEY, jobCache]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setSearchExecuted(true);
        setSelectedJob(null);
        setJobCache({});
        fetchJobs(1, filters.title, filters.location);
    };

    const handleReset = () => {
        setFilters({ title: '', location: '', platform: 'LinkedIn' });
        setSearchExecuted(false);
        setSelectedJob(null);
        setJobCache({});
        fetchJobs(1);
    };

    useEffect(() => {
        fetchJobs(1, filters.title, filters.location);
    }, []);

    const handleNextPage = () => {
        if (!loading) fetchJobs(currentPage + 1, filters.title, filters.location);
    };

    const handlePrevPage = () => {
        if (currentPage > 1 && !loading) fetchJobs(currentPage - 1, filters.title, filters.location);
    };

    const filteredJobs = jobs.filter(job => {
        return job.apply_options?.some(
            option => option.publisher?.toLowerCase().includes(filters.platform.toLowerCase())
        ) || false;
    });

    const getPlatformLinks = (job) => {
        if (!job || !job.apply_options) return [];

        const allowedPlatforms = ['LinkedIn', 'Indeed', 'Glassdoor'];

        return job.apply_options.filter(option => {
            const publisher = option.publisher?.toLowerCase();
            const isAllowed = allowedPlatforms.some(p => publisher?.includes(p.toLowerCase()));
            return publisher?.includes(filters.platform.toLowerCase()) && option.apply_link;
        });
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return 'N/A';
        const date = new Date(timestamp * 1000);
        return date.toLocaleDateString();
    };
   
    const handleMarkAsApplied = (jobId,jobTitle,publisher,employer_name,apply_link) => {
        alert(jobId);
        const currentDateTime = new Date().toLocaleString();
        insertApplication(user.email,jobId,'Applied',currentDateTime,currentDateTime,'Nothing',jobTitle,employer_name,apply_link,publisher)
        setAppliedJobs(prev => new Set(prev).add(jobId));

    };

    const isJobApplied = (jobId) => {
        return appliedJobs.has(jobId);
    };

    return (
        <div className="jl-job-listings-container">
            <div className="jl-filters">
                <h2>Find Your Dream Job</h2>
                <form onSubmit={handleSearch}>
                    <div className="jl-filter-group">
                        <input type="text" name="title" placeholder="Job title (optional)" value={filters.title} onChange={handleFilterChange} disabled={loading} />
                        <input type="text" name="location" placeholder="Location (optional)" value={filters.location} onChange={handleFilterChange} disabled={loading} />
                        <select name="platform" value={filters.platform} onChange={handleFilterChange} disabled={loading}>
                            {platforms.map(platform => (
                                <option key={platform.value} value={platform.value}>{platform.label}</option>
                            ))}
                        </select>
                        <button type="submit" className="jl-search-button" disabled={loading}>{loading && currentPage === 1 && searchExecuted ? 'Searching...' : 'Search Jobs'}</button>
                        <button type="button" className="jl-reset-button" onClick={handleReset} disabled={loading}>Reset</button>
                    </div>
                </form>
            </div>

            {loading && <div className="jl-loading">Loading Page {currentPage}...</div>}
            {error && <div className="jl-error">Error: {error}</div>}

            {!loading && !error && (
                <>
                    {selectedJob ? (
                        <div className="jl-job-detail">
                            <button className="jl-back-button" onClick={() => setSelectedJob(null)}>&larr; Back to listings (Page {currentPage})</button>
                            <div className="jl-job-detail-card">
                                <div className="jl-job-header">
                                    <h2>{selectedJob.job_title}</h2>
                                    <h3>{selectedJob.employer_name}</h3>
                                    <p className="jl-location">{selectedJob.job_city}{selectedJob.job_state ? `, ${selectedJob.job_state}` : ''} {selectedJob.job_country}</p>
                                    {selectedJob.job_is_remote && <p className="jl-remote-tag">Remote</p>}
                                    <p className="jl-posted-date">Posted: {formatDate(selectedJob.job_posted_at_timestamp)}{selectedJob.job_offer_expiration_timestamp && ` | Expires: ${formatDate(selectedJob.job_offer_expiration_timestamp)}`}</p>
                                    {selectedJob.job_employment_type && <p className="jl-employment-type">{selectedJob.job_employment_type}</p>}
                                </div>
                                <div className="jl-job-content">
                                    <div className="jl-job-description">
                                        <h4>Job Description</h4>
                                        <p style={{ whiteSpace: 'pre-wrap' }}>{selectedJob.job_description || 'No description available.'}</p>
                                    </div>
                                    {selectedJob.job_highlights && Object.keys(selectedJob.job_highlights).length > 0 && (
                                        <div className="jl-job-highlights">
                                            {Object.entries(selectedJob.job_highlights).filter(([_, items]) => Array.isArray(items) && items.length > 0).map(([key, items]) => (
                                                <div key={key}>
                                                    <h4>{key.replace(/_/g, ' ')}</h4>
                                                    <ul>{items.map((item, i) => <li key={i}>{item}</li>)}</ul>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    <div className="jl-apply-options">
                                        <h4>Apply On:</h4>
                                        <div className="jl-platform-links">
                                            {/* Render platform links only */}
                                            {getPlatformLinks(selectedJob).length > 0 ? (
                                                getPlatformLinks(selectedJob).map((option, index) => (
                                                    <div key={index} className="jl-apply-link-container">
                                                        <a
                                                            href={option.apply_link}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="jl-platform-link"
                                                        >
                                                            {option.publisher || 'Direct Link'}
                                                        </a>
                                                        {/* Keep the Mark as Applied button for platform links */}
                                                        <button
                                                            className={`jl-mark-applied-button ${isJobApplied(selectedJob.job_id) ? 'applied' : ''}`}
                                                            onClick={() => handleMarkAsApplied(selectedJob.job_id,selectedJob.job_title,option.publisher,selectedJob.employer_name,option.apply_link)}
                                                            disabled={isJobApplied(selectedJob.job_id)}
                                                        >
                                                            {isJobApplied(selectedJob.job_id) ? 'Applied' : 'Mark as Applied'}
                                                        </button>
                                                    </div>
                                                ))
                                            ) : (
                                                // This message is shown if getPlatformLinks returns empty
                                                <p>No direct application links found for the selected platform.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="jl-job-cards">
                                {filteredJobs.length > 0 ? filteredJobs.map(job => (
                                    <div key={job.job_id} className="jl-job-card" onClick={() => setSelectedJob(job)}>
                                        <div className="jl-job-card-header">
                                            <h3>{job.job_title}</h3>
                                            <h4>{job.employer_name}</h4>
                                            <p className="jl-location">{job.job_city}{job.job_state ? `, ${job.job_state}` : ''} {job.job_country}{job.job_is_remote && <span className="jl-remote-tag-list"> (Remote Available)</span>}</p>
                                        </div>
                                        <div className="jl-job-card-body">
                                            <p className="jl-posted-date">Posted: {formatDate(job.job_posted_at_timestamp)}{job.job_offer_expiration_timestamp && ` | Expires: ${formatDate(job.job_offer_expiration_timestamp)}`}</p>
                                            {job.job_employment_type && <p className="jl-employment-type">{job.job_employment_type}</p>}
                                            <div className="jl-platform-tags">
                                                {getPlatformLinks(job).slice(0, 3).map((option, index) => (
                                                    <span key={index} className="jl-platform-tag">{option.publisher}</span>
                                                ))}
                                                {getPlatformLinks(job).length > 3 && (
                                                    <span className="jl-platform-tag">+{getPlatformLinks(job).length - 3} more</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="jl-no-results">
                                        {searchExecuted || filters.title || filters.location ? 'No jobs found matching your criteria for this page.' : jobs.length === 0 && !loading ? 'No jobs found for the initial query.' : 'Please browse the next page'}
                                    </div>
                                )}
                            </div>
                            {(jobs.length > 0 || loading || currentPage > 1) && !selectedJob && (
                                <div className="jl-pagination-controls">
                                    <button onClick={handlePrevPage} disabled={currentPage === 1 || loading}>&larr; Previous</button>
                                    <span>Page {currentPage}</span>
                                    <button onClick={handleNextPage} disabled={loading || jobs.length === 0}>Next &rarr;</button>
                                </div>
                            )}
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default JobListings;