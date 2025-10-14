import { useState, useRef, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import LogoCorner from "./components/LogoCorner";

interface Paciente {
  id: number;
  nome: string;
  idade: number;
}


export default function RecordPhysicalExam() {
  const location = useLocation();
  const navigate = useNavigate();
  const paciente = location.state?.paciente as Paciente;

  // Estados para os campos do formulário
  const [palpitacao, setPalpitacao] = useState("");
  const [inspecao, setInspecao] = useState("");
  const [diagnosticoPrognostico, setDiagnosticoPrognostico] = useState("");
  const [objetivoTerapeutico, setObjetivoTerapeutico] = useState("");
  const [tratamento, setTratamento] = useState("");

  // Estados para captura de fotos
  const [fotos, setFotos] = useState<string[]>([]);
  const [mostrarCamera, setMostrarCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  //TODO - A CAMERA NAO FUNCIONA
  const iniciarCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment' // Usar câmera traseira se disponível
        }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setMostrarCamera(true);
      }
    } catch (error) {
      console.error('Erro ao acessar a câmera:', error);
      alert('Não foi possível acessar a câmera. Verifique as permissões.');
    }
  };

  const capturarFoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');

      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);

        // Converter para base64 e salvar
        const fotoData = canvas.toDataURL('image/jpeg', 0.8);
        setFotos(prev => [...prev, fotoData]);

        // Salvar no localStorage
        const fotosSalvas = JSON.parse(localStorage.getItem('fotosExameFisico') || '[]');
        fotosSalvas.push({
          id: Date.now(),
          pacienteId: paciente?.id,
          pacienteNome: paciente?.nome,
          foto: fotoData,
          data: new Date().toISOString()
        });
        localStorage.setItem('fotosExameFisico', JSON.stringify(fotosSalvas));
      }
    }
  }, [paciente?.id, paciente?.nome]);

  const fecharCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setMostrarCamera(false);
  };

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

  const handleSave = () => {
    // Aqui você pode implementar a lógica para salvar os dados
    console.log('Dados do exame físico:', {
      paciente: paciente,
      palpitacao,
      inspecao,
      diagnosticoPrognostico,
      objetivoTerapeutico,
      tratamento,
      fotos: fotos.length
    });

    // Por enquanto, apenas mostra um alerta
    alert('Exame físico salvo com sucesso!');
  };


  const removerFoto = (index: number) => {
    setFotos(prev => prev.filter((_, i) => i !== index));

    // Atualizar localStorage
    const fotosSalvas = JSON.parse(localStorage.getItem('fotosExameFisico') || '[]');
    const fotosAtualizadas = fotosSalvas.filter((_: unknown, i: number) => i !== index);
    localStorage.setItem('fotosExameFisico', JSON.stringify(fotosAtualizadas));
  };

  return (
    <div className="min-h-screen min-w-screen bg-green-100">
      <LogoCorner />

      {/* Letreiro */}
      <div className="text-center py-8">
        <h1 className="text-4xl font-bold text-green-800 bg-white rounded-lg shadow-lg inline-block px-8 py-4">
          EXAME FÍSICO
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
            {/* Palpitação */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Palpitação
              </label>
              <Textarea
                placeholder="Descreva a palpitação"
                value={palpitacao}
                onChange={(e) => setPalpitacao(e.target.value)}
                className="w-full min-h-[100px]"
              />
            </div>

            {/* Inspeção */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Inspeção
              </label>
              <Textarea
                placeholder="Descreva a inspeção"
                value={inspecao}
                onChange={(e) => setInspecao(e.target.value)}
                className="w-full min-h-[100px]"
              />
            </div>

            {/* Diagnóstico/Prognóstico Fisioterapêutico */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Diagnóstico/Prognóstico Fisioterapêutico
              </label>
              <Textarea
                placeholder="Digite o diagnóstico e prognóstico fisioterapêutico"
                value={diagnosticoPrognostico}
                onChange={(e) => setDiagnosticoPrognostico(e.target.value)}
                className="w-full min-h-[100px]"
              />
            </div>

            {/* Objetivo Terapêutico */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Objetivo Terapêutico
              </label>
              <Textarea
                placeholder="Descreva o objetivo terapêutico"
                value={objetivoTerapeutico}
                onChange={(e) => setObjetivoTerapeutico(e.target.value)}
                className="w-full min-h-[100px]"
              />
            </div>

            {/* Tratamento - Radio Group */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Tratamento
              </label>
              <RadioGroup value={tratamento} onValueChange={setTratamento}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="analgesia" id="analgesia" />
                  <Label htmlFor="analgesia">Analgesia</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cinesioterapia" id="cinesioterapia" />
                  <Label htmlFor="cinesioterapia">Cinesioterapia</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Exames Complementares - Câmera */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Exames Complementares
              </label>

              <Button
                onClick={iniciarCamera}
                className="bg-blue-600 hover:bg-blue-700 text-white mb-4"
              >
                📷 Abrir Câmera
              </Button>

              {/* Área da Câmera */}
              {mostrarCamera && (
                <div className="mb-4 p-4 bg-white rounded-lg border-2 border-blue-300">
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-medium text-gray-800">
                      Câmera Ativa
                    </h3>
                  </div>

                  <div className="flex justify-center mb-4">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="max-w-full h-64 rounded-lg border"
                    />
                  </div>

                  <canvas ref={canvasRef} className="hidden" />

                  <div className="flex space-x-4 justify-center">
                    <Button
                      onClick={capturarFoto}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      📸 Capturar Foto
                    </Button>
                    <Button
                      onClick={fecharCamera}
                      variant="outline"
                      className="border-red-400 text-red-600 hover:bg-red-50"
                    >
                      ❌ Fechar Câmera
                    </Button>
                  </div>
                </div>
              )}

              {/* Galeria de Fotos */}
              {fotos.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-md font-medium text-gray-700 mb-3">
                    Fotos Capturadas ({fotos.length})
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {fotos.map((foto, index) => (
                      <div key={index} className="relative">
                        <img
                          src={foto}
                          alt={`Exame ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border"
                        />
                        <Button
                          onClick={() => removerFoto(index)}
                          className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white p-1 h-6 w-6 rounded-full"
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Botões de ação */}
            <div className="flex space-x-4 pt-6">
              <Button
                onClick={handleSave}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                Salvar Exame Físico
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