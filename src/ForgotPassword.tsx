

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function ForgotPassword() {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    const [error, setError] = useState('');

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError('As senhas não coincidem.');
            return;
        }
        setError('');
        // Adicionar a validação real. Da ideia
        navigate('/Login');
    }

    return (
        <div className="min-h-screen min-w-screen flex items-center justify-center bg-green-100">
            <div className="w-full max-w-sm p-8 rounded-xl bg-green-100 flex flex-col items-center justify-center min-h-screen">
                <h1 className="text-4xl font-bold mb-10 mt-4 text-black text-center">ESQUECEU SUA SENHA</h1>
                <h2 className="text-lg font-bold mb-12 text-black text-center">FISIOTERAPEUTA</h2>
                <form onSubmit={handleSubmit} className="w-full space-y-8">
                    {error && (
                        <div className="text-red-600 text-center mb-4">{error}</div>
                    )}
                    <div>
                        <Label htmlFor="newPassword" className="text-base font-normal text-black mb-1">Nova Senha</Label>
                        <Input
                            id="newPassword"
                            type="password"
                            value={newPassword}
                            onChange={e => setNewPassword(e.target.value)}
                            placeholder="Digite aqui sua nova senha"
                            required
                            className="w-full border-b border-gray-500 bg-transparent px-2 py-2 focus:outline-none focus:border-black text-black placeholder:text-gray-400"
                        />
                    </div>
                    <div>
                        <Label htmlFor="confirmPassword" className="text-base font-normal text-black mb-1">Confirmar Senha</Label>
                        <Input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            placeholder="Digite novamente sua nova senha"
                            required
                            className="w-full border-b border-gray-500 bg-transparent px-2 py-2 focus:outline-none focus:border-black text-black placeholder:text-gray-400"
                        />
                    </div>
                    <div className="flex justify-center mt-8">
                        <Button type="submit" className="w-40 py-2 bg-black text-white font-semibold rounded-lg shadow hover:bg-gray-900 transition">CONFIRMAR</Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
