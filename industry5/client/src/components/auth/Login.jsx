import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Facebook, Twitter, Github, Globe, TrendingUp, ShieldCheck } from 'lucide-react';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = (e) => {
        e.preventDefault();
        setIsLoading(true);

        setTimeout(() => {
            setIsLoading(false);
            navigate('/select');
        }, 1500);
    };

    return (
        <div className="flex h-screen w-full bg-slate-950 text-slate-200 overflow-hidden font-sans">

            {/* --- LEFT SIDE: ILLUSTRATION --- */}
            <div className="hidden lg:flex w-2/3 bg-slate-900 relative items-center justify-center p-12 overflow-hidden">

                {/* Background Decor */}
                <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px]" />

                {/* Logo Top Left */}
                <div className="absolute top-8 left-8 flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-xl font-bold text-white shadow-lg shadow-blue-500/20">V</div>
                    <span className="font-bold text-xl text-white tracking-wide">VAULT</span>
                </div>

                {/* Main Visual Composition */}
                <div className="relative w-full max-w-lg aspect-square">

                    {/* Central Character/Element Placeholder - Using a glowing shield concept for 'Vault' */}
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                        <div className="relative">
                            <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-40 animate-pulse"></div>
                            <ShieldCheck size={180} className="text-blue-500 relative z-10 drop-shadow-[0_0_50px_rgba(59,130,246,0.6)]" strokeWidth={1.5} />
                        </div>
                    </div>

                    {/* Floating Card 1: Stats */}
                    <div className="absolute top-10 right-0 bg-slate-800/80 backdrop-blur-xl border border-slate-700 p-4 rounded-2xl shadow-2xl z-20 w-48 animate-[float_4s_ease-in-out_infinite]">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-emerald-500/20 rounded-lg">
                                <TrendingUp size={16} className="text-emerald-400" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-400">Total Revenue</p>
                                <p className="font-bold text-white text-sm">$86,400</p>
                            </div>
                        </div>
                        <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-emerald-500 h-full w-[75%] rounded-full"></div>
                        </div>
                    </div>

                    {/* Floating Card 2: New Project */}
                    <div className="absolute bottom-20 left-4 bg-slate-800/80 backdrop-blur-xl border border-slate-700 p-4 rounded-2xl shadow-2xl z-20 w-40 animate-[float_5s_ease-in-out_infinite_1s]">
                        <div className="flex justify-between items-start mb-3">
                            <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold text-xs">AI</div>
                            <div className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">+18%</div>
                        </div>
                        <p className="font-bold text-white text-sm">New Model</p>
                        <p className="text-xs text-slate-500">Industry 5.0</p>
                    </div>

                    {/* Floating Card 3: User */}
                    <div className="absolute top-40 left-[-20px] bg-slate-800/80 backdrop-blur-xl border border-slate-700 p-3 rounded-2xl shadow-2xl z-10 animate-[float_6s_ease-in-out_infinite_2s]">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-400 border-2 border-slate-900"></div>
                            <div className="space-y-1">
                                <div className="w-16 h-2 bg-slate-600 rounded-full"></div>
                                <div className="w-10 h-2 bg-slate-700 rounded-full"></div>
                            </div>
                        </div>
                    </div>

                </div>

            </div>

            {/* --- RIGHT SIDE: FORM --- */}
            <div className="w-full lg:w-1/3 bg-slate-950 flex flex-col justify-center px-8 md:px-16 relative">

                {/* Mobile Logo */}
                <div className="lg:hidden absolute top-8 left-8 flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-lg font-bold text-white">V</div>
                    <span className="font-bold text-lg text-white">VAULT</span>
                </div>

                <div className="max-w-md w-full mx-auto">
                    <h2 className="text-2xl font-bold text-white mb-2">Welcome to Vault! 👋</h2>
                    <p className="text-slate-400 mb-8">Please sign-in to your account and start the adventure</p>

                    <form onSubmit={handleLogin} className="space-y-5">

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-300">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-600"
                                placeholder="admin@vault.com"
                                required
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-300">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-slate-900 border border-slate-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-600 pr-10"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input type="checkbox" className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500/20" />
                                <span className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">Remember Me</span>
                            </label>
                            <a href="#" className="text-sm text-blue-500 hover:text-blue-400 font-medium transition-colors">Forgot Password?</a>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-lg transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-blue-600/20"
                        >
                            {isLoading ? 'Signing In...' : 'LOGIN'}
                        </button>

                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-slate-400 text-sm">
                            New on our platform? <a href="#" className="text-blue-500 hover:text-blue-400 font-medium">Create an account</a>
                        </p>
                    </div>

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-800"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-slate-950 text-slate-500">or</span>
                        </div>
                    </div>

                    <div className="flex justify-center gap-4">
                        <SocialButton Icon={Facebook} color="text-blue-500" />
                        <SocialButton Icon={Twitter} color="text-sky-400" />
                        <SocialButton Icon={Github} color="text-white" />
                        <SocialButton Icon={Globe} color="text-red-500" />
                    </div>
                </div>
            </div>

        </div>
    );
};

const SocialButton = ({ Icon, color }) => (
    <button className="p-2 bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800 hover:border-slate-700 transition-all group">
        <Icon size={20} className={`${color} opacity-80 group-hover:opacity-100 transition-opacity`} />
    </button>
);

export default Login;
