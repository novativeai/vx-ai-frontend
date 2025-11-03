"use client";

import React from "react";
import { X } from "lucide-react";

interface TagsFilterProps {
  availableTags: string[];
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
  onClearAll: () => void;
}

export const TagsFilter: React.FC<TagsFilterProps> = ({
  availableTags,
  selectedTags,
  onTagToggle,
  onClearAll,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm uppercase tracking-widest text-neutral-400">Filter by tags</h3>
        {selectedTags.length > 0 && (
          <button
            onClick={onClearAll}
            className="text-xs text-neutral-500 hover:text-neutral-300 transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {availableTags.map(tag => (
          <button
            key={tag}
            onClick={() => onTagToggle(tag)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedTags.includes(tag)
                ? "bg-[#D4FF4F] text-black"
                : "bg-neutral-900 text-neutral-300 hover:bg-neutral-800 border border-neutral-800"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2 border-t border-neutral-800">
          <span className="text-xs text-neutral-500">Active filters:</span>
          {selectedTags.map(tag => (
            <button
              key={tag}
              onClick={() => onTagToggle(tag)}
              className="inline-flex items-center gap-1 px-3 py-1 bg-neutral-800 rounded-full text-xs hover:bg-neutral-700 transition-colors"
            >
              {tag}
              <X size={14} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
