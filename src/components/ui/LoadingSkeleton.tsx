'use client';

import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

// Base Skeleton
interface SkeletonProps {
  className?: string;
  width?: string;
  height?: string;
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

export function Skeleton({ className, width, height, rounded = 'lg' }: SkeletonProps) {
  const roundedMap = {
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    full: 'rounded-full',
  };

  return (
    <div
      className={cn(
        'animate-pulse bg-gradient-to-r from-[#1a2235] via-[#243049] to-[#1a2235] bg-[length:200%_100%]',
        roundedMap[rounded],
        className
      )}
      style={{ width, height }}
    />
  );
}

// Skeleton Card
export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn('bg-[#1a2235] border border-white/[0.06] rounded-2xl p-6', className)}>
      <div className="flex items-start justify-between mb-4">
        <Skeleton className="w-10 h-10" rounded="xl" />
        <Skeleton className="w-12 h-4" />
      </div>
      <Skeleton className="w-24 h-8 mb-2" />
      <Skeleton className="w-16 h-3" />
    </div>
  );
}

// Skeleton Table
interface SkeletonTableProps {
  rows?: number;
  columns?: number;
  className?: string;
}

export function SkeletonTable({ rows = 5, columns = 5, className }: SkeletonTableProps) {
  return (
    <div className={cn('bg-[#1a2235] border border-white/[0.06] rounded-2xl overflow-hidden', className)}>
      {/* Header */}
      <div className="p-4 border-b border-white/[0.06] bg-black/20">
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {Array.from({ length: columns }).map((_, i) => (
            <Skeleton key={i} className="h-3 w-full" />
          ))}
        </div>
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, row) => (
        <div key={row} className="p-4 border-b border-white/[0.06] last:border-b-0">
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
            {Array.from({ length: columns }).map((_, col) => (
              <Skeleton key={col} className="h-4 w-full" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// Page Loader
interface PageLoaderProps {
  cards?: number;
  children?: ReactNode;
}

export function PageLoader({ cards = 4 }: PageLoaderProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <Skeleton className="w-48 h-8 mb-2" />
        <Skeleton className="w-72 h-4" />
      </div>
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: cards }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
      {/* Content */}
      <SkeletonTable rows={5} columns={5} />
    </div>
  );
}

// Match Card Skeleton
export function SkeletonMatchCard() {
  return (
    <div className="bg-[#1a2235] border border-white/[0.06] rounded-2xl p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Skeleton className="w-20 h-6" />
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Skeleton className="w-10 h-10" rounded="full" />
              <div>
                <Skeleton className="w-10 h-4 mb-1" />
                <Skeleton className="w-14 h-3" />
              </div>
            </div>
            <Skeleton className="w-6 h-4" />
            <div className="flex items-center gap-2">
              <Skeleton className="w-10 h-10" rounded="full" />
              <div>
                <Skeleton className="w-10 h-4 mb-1" />
                <Skeleton className="w-14 h-3" />
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-center">
            <Skeleton className="w-16 h-5 mb-1" />
            <Skeleton className="w-8 h-3 mx-auto" />
          </div>
          <Skeleton className="w-24 h-9" rounded="xl" />
        </div>
      </div>
    </div>
  );
}
