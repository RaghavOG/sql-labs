import { categories, getLessonsByCategory } from '@/lib/lessons';
import Logo from './Logo';

interface LessonSidebarProps {
  currentLessonId: string;
  completedLessons: Set<string>;
  onSelectLesson: (id: string) => void;
  isOpen: boolean;
}

export default function LessonSidebar({
  currentLessonId,
  completedLessons,
  onSelectLesson,
  isOpen,
}: LessonSidebarProps) {
  return (
    <aside
      className={`
        relative h-full bg-black/40 backdrop-blur-xl border-r border-white/10 flex-shrink-0
        transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]
        ${isOpen ? 'w-64 opacity-100' : 'w-0 opacity-0 overflow-hidden'}
      `}
    >
      <div className="h-full flex flex-col min-w-64">
        {/* Header */}
        <div className="p-5 border-b border-white/5 flex items-center gap-3">
          <div className="scale-90 origin-left">
            <Logo />
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          {categories.map((category) => {
            const categoryLessons = getLessonsByCategory(category.id);
            const completedCount = categoryLessons.filter((l) =>
              completedLessons.has(l.id)
            ).length;

            return (
              <div key={category.id} className="animate-fade-in">
                <div className="flex items-center justify-between mb-2 px-2">
                  <h3 className="text-[10px] uppercase tracking-widest text-white/50 font-bold">
                    {category.title}
                  </h3>
                  <span className="text-[10px] font-mono text-white/30">
                    {completedCount}/{categoryLessons.length}
                  </span>
                </div>
                <div className="space-y-1">
                  {categoryLessons.map((lesson) => {
                    const isActive = currentLessonId === lesson.id;
                    const isCompleted = completedLessons.has(lesson.id);

                    return (
                      <button
                        key={lesson.id}
                        onClick={() => onSelectLesson(lesson.id)}
                        className={`
                          group w-full text-left px-3 py-2 rounded-md text-xs transition-all duration-200
                          flex items-center justify-between
                          ${
                            isActive
                              ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]'
                              : 'text-gray-400 hover:bg-white/5 hover:text-gray-200 border border-transparent'
                          }
                        `}
                      >
                        <span className="truncate font-medium">{lesson.title}</span>
                        {isCompleted && (
                          <span className="text-green-500/80 ml-2 text-[10px]">●</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Footer info */}
        <div className="p-4 border-t border-white/5 text-[10px] text-white/20 text-center font-mono">
            SQL Labs v2.0
        </div>
      </div>
    </aside>
  );
}
