import { useStoryCache } from '@/store/storyCache';
import { useEffect, useState } from 'react';

export const Ticker = () => {
  const stories = useStoryCache((s) => s.stories);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setVisible(false);
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, [stories.length]);

  return (
    <div className="overflow-hidden w-full bg-black text-white border-y border-gray-700">
      {visible && (
        <div
          className="flex gap-10 animate-ticker whitespace-nowrap"
          style={{ animationDuration: `${stories.length * 4}s` }}
        >
          {stories.map((story) => (
            <div key={story.id} className="inline-block px-4 py-2 font-mono text-sm">
              📰 {story.title} — {story.source} — ⏱ {new Date(story.timestamp).toLocaleTimeString()}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
