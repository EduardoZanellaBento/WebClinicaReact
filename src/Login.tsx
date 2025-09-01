

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        // Adicionar a validação real da ideia
        navigate('/escolha-pacientes');
    }

    return (
        <div className="min-h-screen min-w-screen flex items-center justify-center bg-green-100">
            <div className="w-full max-w-sm p-8 rounded-xl bg-green-100 flex flex-col items-center justify-center min-h-screen">
                <h1 className="text-4xl font-bold mb-10 mt-4 text-black text-center">LOGIN</h1>
                <h2 className="text-lg font-bold mb-12 text-black text-center">FISIOTERAPEUTA</h2>
                <form onSubmit={handleSubmit} className="w-full space-y-8">
                    <div>
                        <Label htmlFor="email" className="text-base font-normal text-black mb-1">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            placeholder="Digite aqui seu email"
                            required
                            className="w-full border-b border-gray-500 bg-transparent px-2 py-2 focus:outline-none focus:border-black text-black placeholder:text-gray-400"
                        />
                    </div>
                    <div>
                        <Label htmlFor="password" className="text-base font-normal text-black mb-1">Senha</Label>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="Digite aqui sua senha"
                            required
                            className="w-full border-b border-gray-500 bg-transparent px-2 py-2 focus:outline-none focus:border-black text-black placeholder:text-gray-400"
                        />
                        <div className="flex justify-end mt-1">
                            <span className="text-xs text-black">Esqueceu a senha? <a href="#" className="underline">Clique aqui</a></span>
                        </div>
                    </div>
                    <div className="flex justify-center mt-8">
                        <Button type="submit" className="w-40 py-2 bg-black text-white font-semibold rounded-lg shadow hover:bg-gray-900 transition">ENTRAR</Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
