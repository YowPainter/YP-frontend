// components/ui/AnimatedBlob.tsx
'use client';

interface AnimatedBlobProps {
    className?: string;
    color?: string;
    delay?: boolean;
}

export function AnimatedBlob({ className = '', color = 'accent', delay = false }: AnimatedBlobProps) {
    return (
        <div
            className={`absolute ${className} ${color === 'accent'
                    ? 'bg-accent/10 dark:bg-accent/20'
                    : color === 'amber'
                        ? 'bg-amber-500/10 dark:bg-amber-600/15'
                        : 'bg-slate-400/10 dark:bg-slate-500/15'
                } blur-[100px] z-[-20] ${delay ? 'animate-blob-delayed' : 'animate-blob'}`}
            style={{
                borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
            }}
        />
    );
}