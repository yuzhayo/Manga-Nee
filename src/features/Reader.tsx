import { useEffect } from 'react';
import MangaControls from './reader/MangaControls.tsx';
import MangaReader from './reader/MangaReader.tsx';
import MangaToolbar from './reader/MangaToolbar.tsx';
import { useCbzLoader } from './reader/useCbzLoader.ts';
import { useKeyboardNav } from './reader/useKeyboardNav.ts';
import { useReaderState } from './reader/useReaderState.ts';

type ReaderProps = {
    file: File;
    seriesName?: string;
    onBack?: () => void;
    onPreviousChapter?: () => void;
    onNextChapter?: () => void;
    previousChapterLabel?: string;
    nextChapterLabel?: string;
};

export default function Reader({
    file,
    seriesName,
    onBack,
    onPreviousChapter,
    onNextChapter,
    previousChapterLabel,
    nextChapterLabel,
}: ReaderProps) {
    const { result, loadFile, reset } = useCbzLoader();
    const pages = result.status === 'ready' ? result.pages : [];
    const reader = useReaderState(pages.length);

    useEffect(() => {
        loadFile(file);
        return reset;
    }, [file, loadFile, reset]);

    useKeyboardNav({
        onNext: reader.goNext,
        onPrev: reader.goPrev,
        onZoomIn: reader.zoomIn,
        onZoomOut: reader.zoomOut,
        onResetZoom: reader.resetZoom,
        rtl: reader.rtl,
        enabled: result.status === 'ready',
    });

    if (result.status === 'idle' || result.status === 'loading') {
        return (
            <main className="flex h-screen w-screen items-center justify-center bg-neutral-950 text-neutral-400">
                Extracting pages{result.status === 'loading' ? ` ${result.progress}%` : '…'}
            </main>
        );
    }

    if (result.status === 'error') {
        return (
            <main className="flex h-screen w-screen flex-col items-center justify-center gap-4 bg-neutral-950 text-red-400">
                <p>{result.message}</p>
                {onBack && <button type="button" onClick={onBack}>← Back</button>}
            </main>
        );
    }

    return (
        <main className="h-screen w-screen overflow-hidden bg-neutral-950">
            <MangaToolbar
                fileName={result.fileName}
                seriesName={seriesName}
                currentPage={reader.currentPage}
                totalPages={pages.length}
                onBack={onBack ?? (() => undefined)}
                onPageJump={reader.goToPage}
            />
            <MangaReader
                pages={pages}
                currentPage={reader.currentPage}
                zoom={reader.zoom}
                mode={reader.mode}
                rtl={reader.rtl}
                onNext={reader.goNext}
                onPrev={reader.goPrev}
                onZoomIn={reader.zoomIn}
                onZoomOut={reader.zoomOut}
            />
            <MangaControls
                currentPage={reader.currentPage}
                totalPages={pages.length}
                zoom={reader.zoom}
                mode={reader.mode}
                rtl={reader.rtl}
                onPrev={reader.goPrev}
                onNext={reader.goNext}
                onZoomIn={reader.zoomIn}
                onZoomOut={reader.zoomOut}
                onResetZoom={reader.resetZoom}
                onToggleMode={reader.toggleMode}
                onToggleRtl={reader.toggleRtl}
                onPrevChapter={onPreviousChapter}
                onNextChapter={onNextChapter}
                prevChapterLabel={previousChapterLabel}
                nextChapterLabel={nextChapterLabel}
            />
        </main>
    );
}
