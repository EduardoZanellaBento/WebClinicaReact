import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
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

interface SessionDetails {
    aparelhos: { [key: string]: boolean };
    exercicios: { [key: string]: boolean };
    observacoes: string;
}

export default function SessionDetails() {
    const location = useLocation();
    const navigate = useNavigate();
    const paciente = location.state?.paciente as Paciente;
    const session = location.state?.session as Session;

    // Estado para armazenar os detalhes da sessão
    const [sessionDetails, setSessionDetails] = useState<SessionDetails>({
        aparelhos: {},
        exercicios: {},
        observacoes: ""
    });

    // Carregar detalhes salvos do localStorage ao inicializar
    useEffect(() => {
        const savedDetails = localStorage.getItem(`session_details_${paciente.id}_${session.id}`);
        if (savedDetails) {
            try {
                const parsedDetails = JSON.parse(savedDetails);
                setSessionDetails(parsedDetails);
            } catch (error) {
                console.error('Erro ao carregar detalhes da sessão:', error);
            }
        }
    }, [paciente.id, session.id]);

    // Se não houver dados do paciente ou sessão, redirecionar
    if (!paciente || !session) {
        navigate('/RecordDailyEvolution', {
            state: { paciente: paciente }
        });
        return null;
    }

    const handleBackToEvolution = () => {
        navigate('/RecordDailyEvolution', {
            state: { paciente: paciente }
        });
    };

    const handleAparelhoChange = (aparelho: string, checked: boolean) => {
        const updatedDetails = {
            ...sessionDetails,
            aparelhos: {
                ...sessionDetails.aparelhos,
                [aparelho]: checked
            }
        };
        setSessionDetails(updatedDetails);

        // Salvar automaticamente no localStorage
        localStorage.setItem(`session_details_${paciente.id}_${session.id}`, JSON.stringify(updatedDetails));
    };

    const handleExercicioChange = (exercicio: string, checked: boolean) => {
        const updatedDetails = {
            ...sessionDetails,
            exercicios: {
                ...sessionDetails.exercicios,
                [exercicio]: checked
            }
        };
        setSessionDetails(updatedDetails);

        // Salvar automaticamente no localStorage
        localStorage.setItem(`session_details_${paciente.id}_${session.id}`, JSON.stringify(updatedDetails));
    };

    const handleObservacoesChange = (value: string) => {
        const updatedDetails = {
            ...sessionDetails,
            observacoes: value
        };
        setSessionDetails(updatedDetails);

        // Salvar automaticamente no localStorage
        localStorage.setItem(`session_details_${paciente.id}_${session.id}`, JSON.stringify(updatedDetails));
    };

    const handleSave = () => {
        // Salvar no localStorage (já está sendo salvo automaticamente, mas vamos garantir)
        localStorage.setItem(`session_details_${paciente.id}_${session.id}`, JSON.stringify(sessionDetails));

        console.log('Detalhes da sessão:', {
            paciente: paciente,
            session: session,
            sessionDetails: sessionDetails
        });
        alert('Sessão salva com sucesso!');
    };

    // Dados dos aparelhos
    const aparelhos = [
        "Infra Vermelho",
        "Ultrassom",
        "TENS",
        "Massageador",
        "Terapia Manual",
        "Laser",
        "FES",
        "Corrente Russa"
    ];

    // Dados dos exercícios
    const exercicios = [
        "Alongamento",
        "Treino de Equilíbrio",
        "Bicicleta",
        "Fortalecimento",
        "Mobilização Muscular"
    ];

    return (
        <div className="min-h-screen min-w-screen bg-green-100">
            <LogoCorner />

            {/* Letreiro */}
            <div className="text-center py-8">
                <h1 className="text-4xl font-bold text-green-800 bg-white rounded-lg shadow-lg inline-block px-8 py-4">
                    DETALHES DA SESSÃO
                </h1>
            </div>

            <div className="max-w-4xl mx-auto px-4 pb-8">
                <Card className="p-6 bg-green-200 shadow-md">
                    {/* Informações do Paciente e Sessão */}
                    <div className="mb-6 p-4 bg-white rounded-lg shadow-sm">
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">
                            Paciente: {paciente.nome}
                        </h2>
                        <p className="text-gray-600 mb-2">
                            ID: {paciente.id} | Idade: {paciente.idade} anos
                        </p>
                        <div className="border-t pt-2 mt-2">
                            <h3 className="text-lg font-semibold text-green-700">
                                Sessão #{session.numero}
                            </h3>
                            <p className="text-gray-600">
                                {session.horario} - {session.data}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Seção de Aparelhos */}
                        <div>
                            <h3 className="text-lg font-medium text-gray-800 mb-4">
                                Aparelhos Utilizados
                            </h3>
                            <div className="bg-white p-4 rounded-lg shadow-sm">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {aparelhos.map((aparelho) => (
                                        <div key={aparelho} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`aparelho-${aparelho}`}
                                                checked={sessionDetails.aparelhos[aparelho] || false}
                                                onCheckedChange={(checked) =>
                                                    handleAparelhoChange(aparelho, checked as boolean)
                                                }
                                            />
                                            <label
                                                htmlFor={`aparelho-${aparelho}`}
                                                className="text-sm text-gray-700 cursor-pointer"
                                            >
                                                {aparelho}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Seção de Exercícios */}
                        <div>
                            <h3 className="text-lg font-medium text-gray-800 mb-4">
                                Exercícios Realizados
                            </h3>
                            <div className="bg-white p-4 rounded-lg shadow-sm">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {exercicios.map((exercicio) => (
                                        <div key={exercicio} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`exercicio-${exercicio}`}
                                                checked={sessionDetails.exercicios[exercicio] || false}
                                                onCheckedChange={(checked) =>
                                                    handleExercicioChange(exercicio, checked as boolean)
                                                }
                                            />
                                            <label
                                                htmlFor={`exercicio-${exercicio}`}
                                                className="text-sm text-gray-700 cursor-pointer"
                                            >
                                                {exercicio}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Campo de Observações */}
                        <div>
                            <h3 className="text-lg font-medium text-gray-800 mb-4">
                                Observações
                            </h3>
                            <Textarea
                                placeholder="Digite suas observações sobre a sessão..."
                                value={sessionDetails.observacoes}
                                onChange={(e) => handleObservacoesChange(e.target.value)}
                                className="w-full min-h-[120px] bg-white"
                            />
                        </div>
                    </div>

                    {/* Botões de ação */}
                    <div className="flex space-x-4 pt-8 mt-8 border-t border-gray-300">
                        <Button
                            onClick={handleSave}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                        >
                            Salvar Sessão
                        </Button>

                        <Button
                            variant="outline"
                            onClick={handleBackToEvolution}
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
