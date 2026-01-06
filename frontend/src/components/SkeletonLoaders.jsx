import React from 'react';

// Event Card Skeleton - matches the EventCard layout
export const EventCardSkeleton = () => (
    <div className="w-full animate-pulse">
        <div className="bg-white rounded-xl border border-[#e8eaed] overflow-hidden">
            <div className="aspect-video bg-[#f1f3f4]" />
            <div className="p-5">
                <div className="h-5 bg-[#f1f3f4] rounded mb-3 w-3/4" />
                <div className="h-4 bg-[#f1f3f4] rounded mb-4 w-1/2" />
                <div className="flex gap-4">
                    <div className="h-3 bg-[#f1f3f4] rounded w-20" />
                    <div className="h-3 bg-[#f1f3f4] rounded w-16" />
                </div>
            </div>
        </div>
    </div>
);

// Grid of Event Card Skeletons
export const EventGridSkeleton = ({ count = 6 }) => (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: count }).map((_, index) => (
            <EventCardSkeleton key={index} />
        ))}
    </div>
);

// Event Details Page Skeleton
export const EventDetailsSkeleton = () => (
    <div className="min-h-screen bg-white animate-pulse">
        <div className="border-b border-[#e8eaed]">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
                <div className="h-5 bg-[#f1f3f4] rounded w-16" />
            </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="aspect-video bg-[#f1f3f4] rounded-xl" />
                    <div className="h-8 bg-[#f1f3f4] rounded w-3/4" />
                    <div className="h-4 bg-[#f1f3f4] rounded w-1/3" />
                    <div className="p-5 bg-[#f8f9fa] rounded-xl">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="h-16 bg-[#f1f3f4] rounded" />
                            <div className="h-16 bg-[#f1f3f4] rounded" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="h-4 bg-[#f1f3f4] rounded w-full" />
                        <div className="h-4 bg-[#f1f3f4] rounded w-full" />
                        <div className="h-4 bg-[#f1f3f4] rounded w-2/3" />
                    </div>
                </div>
                <div className="space-y-4">
                    <div className="bg-white border border-[#e8eaed] rounded-xl p-6">
                        <div className="h-5 bg-[#f1f3f4] rounded w-24 mb-4" />
                        <div className="h-12 bg-[#f1f3f4] rounded" />
                    </div>
                    <div className="bg-white border border-[#e8eaed] rounded-xl p-6">
                        <div className="h-5 bg-[#f1f3f4] rounded w-28 mb-4" />
                        <div className="space-y-3">
                            <div className="h-4 bg-[#f1f3f4] rounded" />
                            <div className="h-4 bg-[#f1f3f4] rounded w-3/4" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

// Stats Card Skeleton
export const StatsCardSkeleton = () => (
    <div className="bg-white rounded-lg p-5 border border-[#e8eaed] animate-pulse">
        <div className="h-4 bg-[#f1f3f4] rounded w-16 mb-2" />
        <div className="h-6 bg-[#f1f3f4] rounded w-12" />
    </div>
);

// Profile Page Skeleton  
export const ProfileSkeleton = () => (
    <div className="min-h-screen bg-[#f8f9fa] animate-pulse">
        <div className="bg-white border-b border-[#e8eaed]">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="h-5 bg-[#f1f3f4] rounded w-16" />
                    <div className="h-5 bg-[#f1f3f4] rounded w-20" />
                    <div className="w-16" />
                </div>
            </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
            <div className="bg-white rounded-lg border border-[#e8eaed] p-6 mb-6">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-[#f1f3f4] rounded-full" />
                    <div>
                        <div className="h-6 bg-[#f1f3f4] rounded w-32 mb-2" />
                        <div className="h-4 bg-[#f1f3f4] rounded w-20" />
                    </div>
                </div>
            </div>
            <div className="bg-white rounded-lg border border-[#e8eaed] p-6">
                <div className="h-5 bg-[#f1f3f4] rounded w-28 mb-6" />
                <div className="space-y-4">
                    <div className="h-12 bg-[#f1f3f4] rounded" />
                    <div className="h-12 bg-[#f1f3f4] rounded" />
                    <div className="flex gap-2">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-8 bg-[#f1f3f4] rounded-full w-20" />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </div>
);
