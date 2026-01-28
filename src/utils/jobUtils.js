import data from '../data/mock-data.json';

export const getEnrichedJobs = () => {
    const { jobs, companies } = data;
    const companyMap = new Map(companies.map(c => [c.id, c]));

    return jobs.map(job => ({
        ...job,
        companyName: companyMap.get(job.companyId)?.name || 'Unknown Company',
        companyLogo: companyMap.get(job.companyId)?.logo || null, // if existed
    }));
};
