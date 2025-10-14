import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import LogoCorner from "./components/LogoCorner";

interface Paciente {
    id: number;
    nome: string;
    idade: number;
}

interface Medico {
    id: number;
    nome: string;
    especialidade: string;
}

export default function RecordMedicalHistory() {
    const location = useLocation();
    const navigate = useNavigate();
    const paciente = location.state?.paciente as Paciente;

    // Estados para os campos do formulário
    const [diagnosticoMedico, setDiagnosticoMedico] = useState("");
    const [medicamentos, setMedicamentos] = useState("");
    const [queixaPrincipal, setQueixaPrincipal] = useState("");
    const [historiaMolestia, setHistoriaMolestia] = useState("");

    // Estados para o dropdown de médicos
    const [searchTermMedico, setSearchTermMedico] = useState("");
    const [showDropdownMedico, setShowDropdownMedico] = useState(false);
    const [selectedMedico, setSelectedMedico] = useState<Medico | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Lista de médicos (dados mockados)
    const listaMedicos: Medico[] = [
        {
            id: 1,
            nome: "Dr. Carlos Silva",
            especialidade: "Cardiologia"
        },
        {
            id: 2,
            nome: "Dra. Ana Oliveira",
            especialidade: "Neurologia"
        },
        {
            id: 3,
            nome: "Dr. Pedro Santos",
            especialidade: "Ortopedia"
        },
        {
            id: 4,
            nome: "Dra. Maria Costa",
            especialidade: "Pediatria"
        },
        {
            id: 5,
            nome: "Dr. João Ferreira",
            especialidade: "Dermatologia"
        },
        {
            id: 6,
            nome: "Dra. Beatriz Almeida",
            especialidade: "Ginecologia"
        }
    ];

    // Ordenar médicos alfabeticamente
    const medicosOrdenados = [...listaMedicos].sort((a, b) =>
        a.nome.localeCompare(b.nome, 'pt-BR')
    );

    // Filtrar médicos baseado no termo de busca
    const medicosFiltrados = medicosOrdenados.filter(medico =>
        medico.nome.toLowerCase().includes(searchTermMedico.toLowerCase())
    );

    // Fechar dropdown quando clicar fora
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdownMedico(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Se não houver dados do paciente, redirecionar para ChoosePatient
    if (!paciente) {
        navigate('/ChoosePatient');
        return null;
    }

    const handleMedicoInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTermMedico(value);
        setShowDropdownMedico(value.length > 0);
        setSelectedMedico(null);
    };

    const handleMedicoSelect = (medico: Medico) => {
        setSelectedMedico(medico);
        setSearchTermMedico(medico.nome);
        setShowDropdownMedico(false);
    };

    const handleMedicoInputFocus = () => {
        if (searchTermMedico.length > 0) {
            setShowDropdownMedico(true);
        }
    };

    const handleBackToRecords = () => {
        navigate('/ChooseRecord', {
            state: {
                paciente: paciente
            }
        });
    };

    const handleSave = () => {
        // Aqui você pode implementar a lógica para salvar os dados
        console.log('Dados do histórico clínico:', {
            paciente: paciente,
            medico: selectedMedico,
            diagnosticoMedico,
            medicamentos,
            queixaPrincipal,
            historiaMolestia
        });

        // Por enquanto, apenas mostra um alerta
        alert('Histórico clínico salvo com sucesso!');
    };

    return (
        <div className="min-h-screen min-w-screen bg-green-100">
            <LogoCorner />

            {/* Letreiro */}
            <div className="text-center py-8">
                <h1 className="text-4xl font-bold text-green-800 bg-white rounded-lg shadow-lg inline-block px-8 py-4">
                    HISTÓRICO CLÍNICO
                </h1>
            </div>

            <div className="max-w-4xl mx-auto px-4 pb-8">
                <Card className="p-6 bg-green-200 shadow-md">
                    {/* Informações do Paciente */}
                    <div className="mb-6 p-4 bg-white rounded-lg shadow-sm">
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">
                            Paciente: {paciente.nome}
                        </h2>
                        <p className="text-gray-600">
                            ID: {paciente.id} | Idade: {paciente.idade} anos
                        </p>
                    </div>

                    <div className="space-y-6">
                        {/* Diagnóstico Médico */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Diagnóstico Médico
                            </label>
                            <Input
                                type="text"
                                placeholder="Digite o diagnóstico médico"
                                value={diagnosticoMedico}
                                onChange={(e) => setDiagnosticoMedico(e.target.value)}
                                className="w-full"
                            />
                        </div>

                        {/* Médico que encaminhou */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Médico que encaminhou o histórico
                            </label>
                            <div className="relative" ref={dropdownRef}>
                                <Input
                                    type="text"
                                    placeholder="Digite o nome do médico"
                                    value={searchTermMedico}
                                    onChange={handleMedicoInputChange}
                                    onFocus={handleMedicoInputFocus}
                                    className="w-full"
                                />

                                {showDropdownMedico && medicosFiltrados.length > 0 && (
                                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
                                        {medicosFiltrados.map((medico) => (
                                            <div
                                                key={medico.id}
                                                className="px-4 py-3 hover:bg-green-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                                                onClick={() => handleMedicoSelect(medico)}
                                            >
                                                <div className="font-medium text-gray-900">{medico.nome}</div>
                                                <div className="text-sm text-gray-500">{medico.especialidade}</div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {showDropdownMedico && searchTermMedico.length > 0 && medicosFiltrados.length === 0 && (
                                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                                        <div className="px-4 py-3 text-gray-500 text-center">
                                            Nenhum médico encontrado
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Medicamentos */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Medicamentos
                            </label>
                            <Textarea
                                placeholder="Digite os medicamentos utilizados"
                                value={medicamentos}
                                onChange={(e) => setMedicamentos(e.target.value)}
                                className="w-full min-h-[100px]"
                            />
                        </div>

                        {/* Queixa Principal */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Queixa Principal
                            </label>
                            <Textarea
                                placeholder="Descreva a queixa principal do paciente"
                                value={queixaPrincipal}
                                onChange={(e) => setQueixaPrincipal(e.target.value)}
                                className="w-full min-h-[100px]"
                            />
                        </div>

                        {/* História da Moléstia */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                História da Moléstia
                            </label>
                            <Textarea
                                placeholder="Descreva a história da moléstia"
                                value={historiaMolestia}
                                onChange={(e) => setHistoriaMolestia(e.target.value)}
                                className="w-full min-h-[100px]"
                            />
                        </div>

                        {/* Botões de ação */}
                        <div className="flex space-x-4 pt-6">
                            <Button
                                onClick={handleSave}
                                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                            >
                                Salvar Histórico
                            </Button>

                            <Button
                                variant="outline"
                                onClick={handleBackToRecords}
                                className="flex-1 border-gray-400 text-gray-600 hover:bg-gray-50"
                            >
                                ← Voltar
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}