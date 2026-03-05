import React, { ChangeEvent } from 'react';

interface IInputProps {
    text: string;
    type: string;
    inputHandler: (e: ChangeEvent<HTMLInputElement>) => void;
    value: string | number;
}

const Input: React.FC<IInputProps> = ({ text, type, inputHandler, value }) => {
    const formattedLabel = text === 'FlatNumberOrBuildingName' ? text.split('Or').join(' / ') : text;

    return (
        <div className="relative group flex-grow min-w-[300px]">
            <input
                value={value}
                onChange={inputHandler}
                required
                type={type}
                name={text}
                autoComplete="off"
                className="w-full bg-emerald-950/20 border border-emerald-500/10 p-5 pt-8 pb-3 text-white font-mono text-sm tracking-widest transition-all duration-500 focus:outline-none focus:border-emerald-500/40 focus:bg-emerald-500/[0.03] peer rounded-xl placeholder-transparent"
                placeholder={formattedLabel}
            />
            <label
                className={`absolute left-5 pointer-events-none transition-all duration-500 ease-in-out uppercase font-bold tracking-[0.3em] overflow-hidden whitespace-nowrap max-w-[calc(100%-40px)] ${
                    value 
                    ? 'top-2 text-[8px] text-emerald-500 translate-y-0 opacity-60' 
                    : 'top-1/2 -translate-y-1/2 text-[10px] text-slate-500 opacity-40'
                } peer-focus:top-2 peer-focus:text-[8px] peer-focus:text-emerald-500 peer-focus:translate-y-0 peer-focus:opacity-60`}
            >
                {formattedLabel}
            </label>
            
            {/* Focus Decoration */}
            <div className="absolute bottom-0 left-0 h-[1px] w-0 bg-emerald-500/40 transition-all duration-700 peer-focus:w-full group-hover:w-1/4" />
        </div>
    );
};

export default Input;
