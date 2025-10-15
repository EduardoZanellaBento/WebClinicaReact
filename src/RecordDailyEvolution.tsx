import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import LogoCorner from "./components/LogoCorner";

interface Paciente {
    id: number;
    nome: string;
    idade: number;
}

interface Session {
    id: number;
    numero: number;
    horario: string;
    data: string;
}

export default function RecordDailyEvolution() {
    const location = useLocation();
    const navigate = useNavigate();
    const paciente = location.state?.paciente as Paciente;

    // Estado para armazenar as sessões
    const [sessions, setSessions] = useState<Session[]>([]);

    // Carregar sessões salvas do localStorage ao inicializar
    useEffect(() => {
        const savedSessions = localStorage.getItem(`sessions_${paciente.id}`);
        if (savedSessions) {
            try {
                const parsedSessions = JSON.parse(savedSessions);
                setSessions(parsedSessions);
            } catch (error) {
                console.error('Erro ao carregar sessões salvas:', error);
            }
        }
    }, [paciente.id]);

    // Se não houver dados do paciente, redirecionar para ChoosePatient
    if (!paciente) {
        navigate('/ChoosePatient');
        return null;
    }

    const handleBackToRecords = () => {
        navigate('/ChooseRecord', {
            state: {
                paciente: paciente
            }
        });
    };

    const addNewSession = () => {
        const now = new Date();
        const newSession: Session = {
            id: Date.now(),
            numero: sessions.length + 1,
            horario: now.toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit'
            }),
            data: now.toLocaleDateString('pt-BR')
        };

        const updatedSessions = [...sessions, newSession];
        setSessions(updatedSessions);

        // Salvar no localStorage
        localStorage.setItem(`sessions_${paciente.id}`, JSON.stringify(updatedSessions));
    };

    const handleSessionClick = (session: Session) => {
        navigate('/SessionDetails', {
            state: {
                paciente: paciente,
                session: session
            }
        });
    };

    // Verificar se uma sessão tem detalhes salvos
    const hasSessionDetails = (sessionId: number) => {
        const savedDetails = localStorage.getItem(`session_details_${paciente.id}_${sessionId}`);
        return savedDetails !== null;
    };

    const formatSessionTime = (horario: string, data: string) => {
        return `${horario} - ${data}`;
    };

    return (
        <div className="min-h-screen min-w-screen bg-green-100">
            <LogoCorner />

            {/* Letreiro */}
            <div className="text-center py-8">
                <h1 className="text-4xl font-bold text-green-800 bg-white rounded-lg shadow-lg inline-block px-8 py-4">
                    EVOLUÇÃO DIÁRIA
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

                    {/* Botão para adicionar nova sessão */}
                    <div className="mb-6">
                        <Button
                            onClick={addNewSession}
                            className="w-full bg-green-600 hover:bg-green-700 text-white text-lg font-semibold py-4 flex items-center justify-center space-x-2"
                        >
                            <span className="text-2xl">+</span>
                            <span>Adicionar Nova Sessão</span>
                        </Button>
                    </div>

                    {/* Lista de Sessões */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-800 mb-4">
                            Sessões do Dia ({sessions.length})
                        </h3>

                        {sessions.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <p className="text-lg">Nenhuma sessão adicionada ainda.</p>
                                <p className="text-sm">Clique no botão "+" acima para adicionar a primeira sessão.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {sessions.map((session) => (
                                    <Card
                                        key={session.id}
                                        className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors shadow-sm border-2 border-transparent hover:border-green-400 ${hasSessionDetails(session.id) ? 'bg-green-50 border-green-200' : 'bg-white'
                                            }`}
                                        onClick={() => handleSessionClick(session)}
                                    >
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-green-600 mb-2">
                                                Sessão #{session.numero}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                {formatSessionTime(session.horario, session.data)}
                                            </div>
                                            {hasSessionDetails(session.id) && (
                                                <div className="mt-2 text-xs text-green-600 font-medium">
                                                    ✓ Dados salvos
                                                </div>
                                            )}
                                            <div className="mt-3 text-xs text-gray-500">
                                                Clique para editar
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Botões de ação */}
                    <div className="flex space-x-4 pt-8 mt-8 border-t border-gray-300">
                        <Button
                            variant="outline"
                            onClick={handleBackToRecords}
                            className="flex-1 border-gray-400 text-gray-600 hover:bg-gray-50"
                        >
                            ← Voltar
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    );
}