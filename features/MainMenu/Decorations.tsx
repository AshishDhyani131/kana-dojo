'use client';
import { useEffect, useState, useRef } from 'react';
import themeSets from '@/features/Preferences/data/themes';
import { useClick } from '@/shared/hooks/useAudio';
import clsx from 'clsx';

// Explosion animation styles
const explosionKeyframes = `
@keyframes explode {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.5);
    opacity: 0.5;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
`;

type RawKanjiEntry = {
  kanjiChar: string;
};

type DecorationFont = {
  name: string;
  font: {
    className: string;
  };
};

const kanjiSources = ['N5', 'N4', 'N3'] as const;

const shuffle = <T,>(arr: T[]) => arr.slice().sort(() => Math.random() - 0.5);

// Tailwind animations
const animations = [
  'motion-safe:animate-pulse'
  // 'animate-bounce',
  //   'animate-ping',
  //   'animate-spin',
];

// Get all available main colors from themes
const getAllMainColors = () => {
  const colors = new Set<string>();
  /* themeSets.forEach(themeGroup => {
    themeGroup.themes.forEach(theme => {
      colors.add(theme.mainColor);
      if (theme.secondaryColor) colors.add(theme.secondaryColor);
    });
  }); */
  themeSets[2].themes.forEach(theme => {
    colors.add(theme.mainColor);
    if (theme.secondaryColor) colors.add(theme.secondaryColor);
  });
  return Array.from(colors);
};

const allMainColors = getAllMainColors();

// Lazy-load fonts cache
let fontsCache: DecorationFont[] | null = null;
let fontsLoadingPromise: Promise<DecorationFont[]> | null = null;

const loadDecorationFonts = async (
  forceLoad = false
): Promise<DecorationFont[]> => {
  // Only load decoration fonts in production (unless forced)
  if (process.env.NODE_ENV !== 'production' && !forceLoad) {
    return [];
  }

  if (fontsCache) return fontsCache;
  if (fontsLoadingPromise) return fontsLoadingPromise;

  fontsLoadingPromise = import('./decorationFonts').then(module => {
    fontsCache = module.decorationFonts;
    fontsLoadingPromise = null;
    return module.decorationFonts;
  });

  return fontsLoadingPromise;
};

// Component to render a single kanji character with random styles
const KanjiCharacter = ({
  char,
  forceShow = false,
  interactive = false
}: {
  char: string;
  forceShow?: boolean;
  interactive?: boolean;
}) => {
  const [mounted, setMounted] = useState(false);
  const [animState, setAnimState] = useState<
    'idle' | 'exploding' | 'hidden' | 'fading-in'
  >('idle');
  const { playClick } = useClick();
  const [styles, setStyles] = useState({
    color: '',
    fontClass: '',
    animation: ''
  });
  // Store a stable animation delay
  const [animationDelay] = useState(() => `${Math.random() * 1000}ms`);

  useEffect(() => {
    let isMounted = true;

    const initializeStyles = async () => {
      // Lazy load fonts
      const fonts = await loadDecorationFonts(forceShow);

      if (!isMounted) return;

      // Generate random styles on mount
      const randomColor =
        allMainColors[Math.floor(Math.random() * allMainColors.length)];
      const randomFont =
        fonts.length > 0
          ? fonts[Math.floor(Math.random() * fonts.length)]
          : null;
      const randomAnimation =
        animations[Math.floor(Math.random() * animations.length)];

      setStyles({
        color: randomColor,
        fontClass: randomFont?.font.className ?? '',
        animation: randomAnimation
      });
      setMounted(true);
    };

    void initializeStyles();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleClick = () => {
    if (!interactive || animState !== 'idle') return;
    playClick();
    setAnimState('exploding');
    // After explosion animation (300ms), hide it
    setTimeout(() => {
      setAnimState('hidden');
      // After 1.5s hidden, start fading back in
      setTimeout(() => {
        setAnimState('fading-in');
        // After fade-in animation (500ms), return to idle
        setTimeout(() => {
          setAnimState('idle');
        }, 500);
      }, 1500);
    }, 300);
  };

  if (!mounted) return null;

  const getAnimationStyle = () => {
    if (!interactive) {
      return { animationDelay };
    }
    switch (animState) {
      case 'exploding':
        return { animation: 'explode 300ms ease-out forwards' };
      case 'hidden':
        return { opacity: 0 };
      case 'fading-in':
        return { animation: 'fadeIn 500ms ease-in forwards' };
      default:
        return {};
    }
  };

  return (
    <span
      className={clsx(
        'text-4xl',
        styles.fontClass,
        !interactive && styles.animation,
        interactive && 'cursor-pointer'
      )}
      aria-hidden='true'
      style={{
        color: styles.color,
        ...getAnimationStyle()
      }}
      onClick={interactive ? handleClick : undefined}
    >
      {char}
    </span>
  );
};

const Decorations = ({
  expandDecorations,
  forceShow = false,
  interactive = false
}: {
  expandDecorations: boolean;
  forceShow?: boolean;
  interactive?: boolean;
}) => {
  const [kanjiList, setKanjiList] = useState<string[]>([]);

  useEffect(() => {
    let isMounted = true;

    const loadKanji = async () => {
      const results = await Promise.all(
        kanjiSources.map(async level => {
          const response = await fetch(`/kanji/${level}.json`);
          const data = (await response.json()) as RawKanjiEntry[];
          return data.map(entry => entry.kanjiChar);
        })
      );

      if (!isMounted) return;
      setKanjiList(shuffle(results.flat()));
    };

    void loadKanji();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      {interactive && <style>{explosionKeyframes}</style>}
      <div
        className={clsx(
          'fixed inset-0 overflow-hidden',
          expandDecorations ? 'opacity-100' : 'opacity-30',
          interactive ? 'pointer-events-auto' : 'pointer-events-none'
        )}
      >
        <div
          className={clsx(
            'grid gap-0.5 p-2 h-full w-full',
            interactive ? 'grid-cols-10 md:grid-cols-28' : 'grid-cols-28'
          )}
        >
          {kanjiList.map((char, index) => (
            <KanjiCharacter
              char={char}
              key={index}
              forceShow={forceShow}
              interactive={interactive}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Decorations;
