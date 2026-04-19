import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
    return (
        <div className="flex items-center gap-2">
            
            {/* ICON */}
            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-sidebar-primary">
                <AppLogoIcon />
            </div>

            {/* TEXT */}
            <div className="grid text-left">
                <span className="truncate leading-tight font-semibold tracking-wide text-base font-serif text-slate-900">
                    Pujasera
                </span>
            </div>

        </div>
    );
}