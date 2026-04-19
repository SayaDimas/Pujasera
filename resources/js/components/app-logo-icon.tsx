import type { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <div className="relative flex items-center justify-center w-8 h-8">
            <div className="absolute w-6 h-6 rotate-45 bg-yellow-400 rounded-md"></div>

            <div className="absolute w-4 h-4 bg-yellow-400 rotate-0 flex items-center justify-center rounded-sm">
                <span className="text-[10px] font-bold text-slate-800">P</span>
            </div>
        </div>
    );
}
