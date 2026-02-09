"use client";

import React from "react";
import { X, ChevronDown, Check } from "lucide-react";

interface MarketplaceSidebarProps {
  availableTags: string[];
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
  onClearTags: () => void;
  availableUseCases: string[];
  selectedUseCases: string[];
  onUseCaseToggle: (useCase: string) => void;
  onClearUseCases: () => void;
  productCount: number;
}

const INITIAL_VISIBLE_COUNT = 3;

export const MarketplaceSidebar: React.FC<MarketplaceSidebarProps> = ({
  availableTags,
  selectedTags,
  onTagToggle,
  onClearTags,
  availableUseCases,
  selectedUseCases,
  onUseCaseToggle,
  onClearUseCases,
  productCount,
}) => {
  const [expandedTags, setExpandedTags] = React.useState(true);
  const [expandedUseCases, setExpandedUseCases] = React.useState(true);
  const [showAllTags, setShowAllTags] = React.useState(false);
  const [showAllUseCases, setShowAllUseCases] = React.useState(false);

  const visibleTags = showAllTags ? availableTags : availableTags.slice(0, INITIAL_VISIBLE_COUNT);
  const visibleUseCases = showAllUseCases ? availableUseCases : availableUseCases.slice(0, INITIAL_VISIBLE_COUNT);
  const hasMoreTags = availableTags.length > INITIAL_VISIBLE_COUNT;
  const hasMoreUseCases = availableUseCases.length > INITIAL_VISIBLE_COUNT;

  const hasActiveFilters = selectedTags.length > 0 || selectedUseCases.length > 0;

  const handleClearAll = () => {
    onClearTags();
    onClearUseCases();
  };

  return (
    <div className="w-full md:w-80 flex-shrink-0">
      {/* Sidebar Container */}
      <div className="sticky top-24 space-y-8">
        {/* Header */}
        <div className="space-y-4 px-6 py-6 border border-neutral-800 rounded-2xl bg-neutral-950/50 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Filters</h2>
            {hasActiveFilters && (
              <button
                onClick={handleClearAll}
                className="text-xs font-medium text-neutral-400 hover:text-[#D4FF4F] transition-colors uppercase tracking-widest"
              >
                Clear All
              </button>
            )}
          </div>
          <div className="h-px bg-gradient-to-r from-[#D4FF4F]/20 to-transparent" />
          <p className="text-xs text-neutral-500">
            {productCount} {productCount === 1 ? "video" : "videos"} available
          </p>
        </div>

        {/* Tags Section */}
        {availableTags.length > 0 && (
          <div className="px-6 py-6 border border-neutral-800 rounded-2xl bg-neutral-950/50 backdrop-blur-sm">
            <button
              onClick={() => setExpandedTags(!expandedTags)}
              className="w-full flex items-center justify-between mb-6 group"
            >
              <h3 className="text-sm font-semibold text-white uppercase tracking-widest">
                Category
              </h3>
              <ChevronDown
                size={18}
                className={`text-neutral-500 group-hover:text-[#D4FF4F] transition-all ${
                  expandedTags ? "rotate-180" : ""
                }`}
              />
            </button>

            {expandedTags && (
              <div className="space-y-3">
                {visibleTags.map(tag => (
                  <label
                    key={tag}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <div className="relative flex items-center w-5 h-5">
                      <input
                        type="checkbox"
                        checked={selectedTags.includes(tag)}
                        onChange={() => onTagToggle(tag)}
                        className="opacity-0 absolute w-5 h-5 cursor-pointer"
                      />
                      <div className="absolute w-5 h-5 rounded border-2 border-neutral-700 bg-neutral-900 group-hover:border-neutral-600 transition-all flex items-center justify-center">
                        {selectedTags.includes(tag) && (
                          <div className="bg-[#D4FF4F] w-full h-full rounded flex items-center justify-center">
                            <Check size={14} className="text-black font-bold" />
                          </div>
                        )}
                      </div>
                    </div>
                    <span className="text-sm text-neutral-300 group-hover:text-white transition-colors capitalize">
                      {tag}
                    </span>
                  </label>
                ))}

                {hasMoreTags && (
                  <button
                    onClick={() => setShowAllTags(!showAllTags)}
                    className="mt-2 text-xs text-neutral-500 hover:text-[#D4FF4F] transition-colors"
                  >
                    {showAllTags ? "Show less" : `Show more (${availableTags.length - INITIAL_VISIBLE_COUNT})`}
                  </button>
                )}

                {selectedTags.length > 0 && (
                  <button
                    onClick={onClearTags}
                    className="mt-4 text-xs text-neutral-500 hover:text-neutral-300 transition-colors"
                  >
                    Clear category
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Use Cases Section */}
        {availableUseCases.length > 0 && (
          <div className="px-6 py-6 border border-neutral-800 rounded-2xl bg-neutral-950/50 backdrop-blur-sm">
            <button
              onClick={() => setExpandedUseCases(!expandedUseCases)}
              className="w-full flex items-center justify-between mb-6 group"
            >
              <h3 className="text-sm font-semibold text-white uppercase tracking-widest">
                Use Case
              </h3>
              <ChevronDown
                size={18}
                className={`text-neutral-500 group-hover:text-[#D4FF4F] transition-all ${
                  expandedUseCases ? "rotate-180" : ""
                }`}
              />
            </button>

            {expandedUseCases && (
              <div className="space-y-3">
                {visibleUseCases.map(useCase => (
                  <label
                    key={useCase}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <div className="relative flex items-center w-5 h-5">
                      <input
                        type="checkbox"
                        checked={selectedUseCases.includes(useCase)}
                        onChange={() => onUseCaseToggle(useCase)}
                        className="opacity-0 absolute w-5 h-5 cursor-pointer"
                      />
                      <div className="absolute w-5 h-5 rounded border-2 border-neutral-700 bg-neutral-900 group-hover:border-neutral-600 transition-all flex items-center justify-center">
                        {selectedUseCases.includes(useCase) && (
                          <div className="bg-[#D4FF4F] w-full h-full rounded flex items-center justify-center">
                            <Check size={14} className="text-black font-bold" />
                          </div>
                        )}
                      </div>
                    </div>
                    <span className="text-sm text-neutral-300 group-hover:text-white transition-colors capitalize">
                      {useCase}
                    </span>
                  </label>
                ))}

                {hasMoreUseCases && (
                  <button
                    onClick={() => setShowAllUseCases(!showAllUseCases)}
                    className="mt-2 text-xs text-neutral-500 hover:text-[#D4FF4F] transition-colors"
                  >
                    {showAllUseCases ? "Show less" : `Show more (${availableUseCases.length - INITIAL_VISIBLE_COUNT})`}
                  </button>
                )}

                {selectedUseCases.length > 0 && (
                  <button
                    onClick={onClearUseCases}
                    className="mt-4 text-xs text-neutral-500 hover:text-neutral-300 transition-colors"
                  >
                    Clear use case
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="px-6 py-6 border border-neutral-800 rounded-2xl bg-neutral-950/50 backdrop-blur-sm">
            <p className="text-xs uppercase tracking-widest text-neutral-500 mb-4">
              Active Filters
            </p>
            <div className="space-y-2 flex flex-wrap gap-2">
              {selectedTags.map(tag => (
                <button
                  key={`tag-${tag}`}
                  onClick={() => onTagToggle(tag)}
                  className="inline-flex items-center gap-2 px-3 py-2 bg-neutral-800/50 hover:bg-neutral-700/50 border border-neutral-700 rounded-lg text-xs text-neutral-200 transition-all group"
                >
                  {tag}
                  <X size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
              {selectedUseCases.map(useCase => (
                <button
                  key={`usecase-${useCase}`}
                  onClick={() => onUseCaseToggle(useCase)}
                  className="inline-flex items-center gap-2 px-3 py-2 bg-neutral-800/50 hover:bg-neutral-700/50 border border-neutral-700 rounded-lg text-xs text-neutral-200 transition-all group"
                >
                  {useCase}
                  <X size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
