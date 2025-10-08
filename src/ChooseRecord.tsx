import { useLocation, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import LogoCorner from "./components/LogoCorner";

interface Paciente {
    id: number;
    nome: string;
    idade: number;
}

export default function ChooseRecord() {
    const location = useLocation();
    const navigate = useNavigate();
    const paciente = location.state?.paciente as Paciente;

    if (!paciente) {
        navigate('/ChoosePatient');
        return null;
    }

    const handleBackToPatients = () => {
        navigate('/ChoosePatient');
    };

    return (
        <div className="min-h-screen min-w-screen flex items-center justify-center bg-green-100">
            <LogoCorner />
            <div className="w-full max-w-md">
                <Card className="p-6 bg-green-200 shadow-md">
                    <div className="text-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">
                            Ficha do Paciente
                        </h1>
                        <div className="bg-white rounded-lg p-4 shadow-sm">
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                {paciente.nome}
                            </h2>
                            <p className="text-gray-600">
                                ID: {paciente.id} | Idade: {paciente.idade} anos
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-800 mb-3">
                            Escolha o tipo de ficha:
                        </h3>

                        <div className="space-y-3">
                            <Button
                                className="w-full bg-green-600 hover:bg-green-700 text-white"
                                onClick={() => {
                                    navigate('/RecordMedicalHistory');
                                }}
                            >
                                Histórico Clinico
                            </Button>

                            <Button
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                                onClick={() => {
                                    navigate('/RecordPhysicalExam');
                                }}
                            >
                                Exame Físico
                            </Button>

                            <Button
                                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                                onClick={() => {
                                    navigate('/RecordDailyEvolution');
                                }}
                            >
                                Evolução Diária
                            </Button>

                            <Button
                                className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                                onClick={() => {
                                    navigate('/RecordArticulation');
                                }}
                            >
                                Articulações
                            </Button>
                        </div>

                        <div className="pt-4 border-t border-gray-300">
                            <Button
                                variant="outline"
                                className="w-full border-gray-400 text-gray-600 hover:bg-gray-50"
                                onClick={handleBackToPatients}
                            >
                                ← Voltar para Seleção de Pacientes
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}