import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import LogoCorner from "./components/LogoCorner";

interface Paciente {
    id: number;
    nome: string;
    idade: number;
}

export default function ChoosePatient() {
    const [searchTerm, setSearchTerm] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    const listaPacientes: Paciente[] = [
        {
            id: 1,
            nome: "João da Silva",
            idade: 30
        },
        {
            id: 2,
            nome: "Maria Oliveira",
            idade: 25
        },
        {
            id: 3,
            nome: "Pedro Santos",
            idade: 35
        },
        {
            id: 4,
            nome: "Ana Costa",
            idade: 28
        },
        {
            id: 5,
            nome: "Carlos Ferreira",
            idade: 42
        },
        {
            id: 6,
            nome: "Beatriz Almeida",
            idade: 33
        }
    ];

    // Ordenar pacientes alfabeticamente
    const pacientesOrdenados = [...listaPacientes].sort((a, b) =>
        a.nome.localeCompare(b.nome, 'pt-BR')
    );

    // Filtrar pacientes baseado no termo de busca
    const pacientesFiltrados = pacientesOrdenados.filter(paciente =>
        paciente.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Fechar dropdown quando clicar fora
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
        setShowDropdown(value.length > 0);
    };

    const handlePatientSelect = (paciente: Paciente) => {
        setSearchTerm(paciente.nome);
        setShowDropdown(false);

        // Navegar para ChooseRecord com os dados do paciente
        navigate('/ChooseRecord', {
            state: {
                paciente: paciente
            }
        });
    };

    const handleInputFocus = () => {
        if (searchTerm.length > 0) {
            setShowDropdown(true);
        }
    };

    return (
        <div className="min-h-screen min-w-screen flex items-center justify-center bg-green-100">
            <LogoCorner />
            <div className="relative w-full max-w-xs" ref={dropdownRef}>
                <Card className="w-full p-2 bg-green-200 shadow-md flex items-center">
                    <Input
                        ref={inputRef}
                        type="text"
                        placeholder="digite o nome do paciente"
                        value={searchTerm}
                        onChange={handleInputChange}
                        onFocus={handleInputFocus}
                        className="bg-green-200 text-gray-700 placeholder-gray-500 border-none shadow-none focus:outline-none focus:ring-0"
                    />
                </Card>

                {showDropdown && pacientesFiltrados.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
                        {pacientesFiltrados.map((paciente) => (
                            <div
                                key={paciente.id}
                                className="px-4 py-3 hover:bg-green-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                                onClick={() => handlePatientSelect(paciente)}
                            >
                                <div className="font-medium text-gray-900">{paciente.nome}</div>
                                <div className="text-sm text-gray-500">Idade: {paciente.idade} anos</div>
                            </div>
                        ))}
                    </div>
                )}

                {showDropdown && searchTerm.length > 0 && pacientesFiltrados.length === 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                        <div className="px-4 py-3 text-gray-500 text-center">
                            Nenhum paciente encontrado
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
