'use client';
import useCalligraphyStore from '../store/useCalligraphyStore';

const HowToUseModal = () => {
  const showHowToUse = useCalligraphyStore(state => state.showHowToUse);
  const setShowHowToUse = useCalligraphyStore(state => state.setShowHowToUse);

  if (!showHowToUse) return null;

  const handleClose = () => {
    setShowHowToUse(false);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <div
      className='fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4'
      onClick={handleBackdropClick}
    >
      <div className='bg-[var(--card-color)] rounded-2xl border border-[var(--border-color)] max-w-md w-full max-h-[85vh] overflow-hidden'>
        {/* Header */}
        <div className='flex items-center justify-between p-4 border-b border-[var(--border-color)]'>
          <h3 className='text-lg font-medium text-[var(--main-color)]'>
            How to Use
          </h3>
          <button
            onClick={handleClose}
            className='p-2 rounded-lg bg-[var(--background-color)] text-[var(--secondary-color)] hover:text-[var(--main-color)] transition-colors'
          >
            <svg
              className='w-5 h-5'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M6 18L18 6M6 6l12 12'
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className='p-4 overflow-y-auto max-h-[60vh] space-y-5'>
          {/* Stage 1 */}
          <div>
            <div className='flex items-center gap-2 mb-2'>
              <span className='w-6 h-6 rounded-full bg-[var(--main-color)] text-[var(--background-color)] text-xs font-bold flex items-center justify-center'>
                1
              </span>
              <span className='text-[var(--main-color)] font-medium'>
                Stroke Practice
              </span>
            </div>
            <p className='text-[var(--secondary-color)] text-sm pl-8'>
              Follow the yellow guide line starting from the green dot (●).
              Complete each stroke one by one to learn the proper stroke order.
            </p>
          </div>

          {/* Stage 2 */}
          <div>
            <div className='flex items-center gap-2 mb-2'>
              <span className='w-6 h-6 rounded-full bg-[var(--main-color)] text-[var(--background-color)] text-xs font-bold flex items-center justify-center'>
                2
              </span>
              <span className='text-[var(--main-color)] font-medium'>
                Full Character
              </span>
            </div>
            <p className='text-[var(--secondary-color)] text-sm pl-8'>
              After learning all strokes, write the complete character without
              any guides. A faded reference will be shown.
            </p>
          </div>

          {/* Stage 3 */}
          <div>
            <div className='flex items-center gap-2 mb-2'>
              <span className='w-6 h-6 rounded-full bg-[var(--main-color)] text-[var(--background-color)] text-xs font-bold flex items-center justify-center'>
                3
              </span>
              <span className='text-[var(--main-color)] font-medium'>
                Word Practice
              </span>
            </div>
            <p className='text-[var(--secondary-color)] text-sm pl-8'>
              Practice writing a word that contains the character you just
              learned. This helps reinforce the character in real context.
            </p>
          </div>

          {/* Divider */}
          <hr className='border-[var(--border-color)]' />

          {/* Brush Types */}
          <div>
            <div className='text-[var(--main-color)] font-medium mb-3'>
              Brush Types
            </div>
            <div className='space-y-3'>
              <div className='flex items-start gap-3'>
                <span className='text-xl'>🖌️</span>
                <div>
                  <span className='text-[var(--main-color)] font-medium'>
                    筆 Brush
                  </span>
                  <p className='text-[var(--secondary-color)] text-xs'>
                    Thick, pressure-sensitive strokes. Traditional calligraphy
                    style.
                  </p>
                </div>
              </div>
              <div className='flex items-start gap-3'>
                <span className='text-xl'>✒️</span>
                <div>
                  <span className='text-[var(--main-color)] font-medium'>
                    ペン Pen
                  </span>
                  <p className='text-[var(--secondary-color)] text-xs'>
                    Medium, clean lines. Good for everyday writing practice.
                  </p>
                </div>
              </div>
              <div className='flex items-start gap-3'>
                <span className='text-xl'>✏️</span>
                <div>
                  <span className='text-[var(--main-color)] font-medium'>
                    鉛筆 Pencil
                  </span>
                  <p className='text-[var(--secondary-color)] text-xs'>
                    Thin, light strokes. Sketchy feel for practice.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <hr className='border-[var(--border-color)]' />

          {/* Tips */}
          <div>
            <div className='text-[var(--main-color)] font-medium mb-2'>
              Tips
            </div>
            <ul className='text-[var(--secondary-color)] text-sm space-y-1.5 list-disc list-inside'>
              <li>Always start from the green dot</li>
              <li>Follow the stroke direction carefully</li>
              <li>Use the Clear button to restart</li>
              <li>Toggle Guide to show/hide help lines</li>
              <li>Click on characters to choose what to practice</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className='p-4 border-t border-[var(--border-color)]'>
          <button
            onClick={handleClose}
            className='w-full py-2.5 rounded-xl bg-[var(--main-color)] text-[var(--background-color)] font-medium hover:opacity-90 transition-opacity'
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
};

export default HowToUseModal;
