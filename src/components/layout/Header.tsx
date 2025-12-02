import Image from 'next/image';

export const Header = ({ title, subtitle }: { title?: string, subtitle?: string }) => (
    <header className="sticky top-0 z-40 bg-stoneo-900/80 backdrop-blur-md border-b border-white/5 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-4">
            {/* Logos */}
            <div className="flex items-center gap-4 border-r border-white/10 pr-4 h-10">
                <div className="relative w-24 h-full">
                    <Image
                        src="/logos/stoneo.png"
                        alt="Stoneo"
                        fill
                        className="object-contain"
                    />
                </div>
                <div className="relative w-24 h-full">
                    <Image
                        src="/logos/avest.png"
                        alt="Avest"
                        fill
                        className="object-contain opacity-90"
                    />
                </div>
            </div>

            {/* Title (Optional, hidden on small screens if needed) */}
            <div>
                <h1 className="text-sm font-bold font-outfit text-white tracking-tight leading-none">
                    {title || "Padel Cup"}
                </h1>
                {subtitle && <p className="text-[10px] text-padel-yellow font-medium leading-none mt-0.5">{subtitle}</p>}
            </div>
        </div>
    </header>
);
