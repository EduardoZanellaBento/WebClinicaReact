import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import LogoCorner from "./components/LogoCorner";

interface Paciente {
   id: number;
   nome: string;
   idade: number;
}

interface ArticulationData {
   [articulation: string]: {
      [category: string]: { [item: string]: boolean };
   };
}

export default function RecordArticulation() {
   const location = useLocation();
   const navigate = useNavigate();
   const paciente = location.state?.paciente as Paciente;

   // Estados para controlar quais seções estão abertas
   const [openArticulation, setOpenArticulation] = useState<string | null>(null);
   const [openCategory, setOpenCategory] = useState<string | null>(null);
   const [openSpinalSection, setOpenSpinalSection] = useState<string | null>(null);

   // Estado para armazenar os dados dos checkboxes
   const [articulationData, setArticulationData] = useState<ArticulationData>({});

   // Carregar dados salvos do localStorage ao inicializar
   useEffect(() => {
      const savedData = localStorage.getItem(`articulation_data_${paciente.id}`);
      if (savedData) {
         try {
            const parsedData = JSON.parse(savedData);
            setArticulationData(parsedData);
         } catch (error) {
            console.error('Erro ao carregar dados das articulações:', error);
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

   const handleArticulationClick = (articulation: string) => {
      setOpenArticulation(openArticulation === articulation ? null : articulation);
      setOpenCategory(null);
   };

   const handleCategoryClick = (category: string) => {
      setOpenCategory(openCategory === category ? null : category);
   };

   const handleSpinalSectionClick = (section: string) => {
      setOpenSpinalSection(openSpinalSection === section ? null : section);
      setOpenCategory(null);
   };

   const handleCheckboxChange = (articulation: string, category: string, item: string, checked: boolean) => {
      const updatedData = {
         ...articulationData,
         [articulation]: {
            ...articulationData[articulation],
            [category]: {
               ...articulationData[articulation]?.[category],
               [item]: checked
            }
         }
      };
      setArticulationData(updatedData);

      // Salvar automaticamente no localStorage
      localStorage.setItem(`articulation_data_${paciente.id}`, JSON.stringify(updatedData));
   };

   const handleSave = () => {
      // Preparar dados para salvar
      const dataToSave = {
         paciente: paciente,
         articulationData,
         timestamp: new Date().toISOString()
      };

      // Salvar no localStorage (já está sendo salvo automaticamente, mas vamos garantir)
      localStorage.setItem(`articulation_data_${paciente.id}`, JSON.stringify(articulationData));

      console.log('Dados das articulações:', dataToSave);
      alert('Dados das articulações salvos com sucesso!');
   };

   // Dados das articulações baseados nas imagens
   const articulations = {
      "Ombro": {
         mobility: ["Flexão", "Extensão", "Abdução", "Adução", "Rotação Externa", "Rotação Interna"],
         tests: ["Impacto de Neer", "Hawkins Kennedy", "Jobe", "Apreensão", "Gerber", "Speed", "Yeargson"]
      },
      "Cotovelo": {
         mobility: ["Flexão", "Extensão", "Supinação", "Pronação"],
         tests: ["Valgo", "Vargo", "Epicondilite Medial", "Epicondilite Lateral"]
      },
      "Punho e Mão": {
         mobility: ["Flexão", "Extensão", "Desvio Ulnar", "Desvio Radial", "Supinação", "Pronação", "Extensão dos Dedos", "Flexão dos Dedos"],
         tests: ["Finkelstein", "Phalen", "Tinel"]
      },
      "Quadril": {
         mobility: ["Flexão", "Extensão", "Abdução", "Adução", "Rotação Interna", "Rotação Externa"],
         tests: ["Trendelemburg", "Thomas", "Ober", "Patrick ou Faber", "Ortolani", "Impacto"]
      },
      "Joelho": {
         mobility: ["Flexão", "Extensão"],
         tests: ["Gaveta Anterior", "Gaveta Posterior", "Lachmann", "Apley de Tração", "McMurray", "Pivo-Shift", "Apley de Compressão", "Estresse em Vargo", "Estresse em Valgo", "Condromalacia Patelar", "Joelho de Saltador"]
      },
      "Tornozelo e Pé": {
         mobility: ["Dorsiflexão", "Flexão Plantar", "Inversão", "Eversão"],
         tests: ["Tinel", "Thompson", "Gaveta Posterior", "Valgo", "Gaveta Anterior", "Varo"]
      }
   };

   // Dados da coluna vertebral
   const spinalSections = {
      "Cervical": {
         mobility: ["Flexão", "Lateralização Esquerda", "Lateralização Direita", "Rotação Direita", "Extensão", "Rotação Esquerda"],
         tests: ["Compressão", "Distração de Apley", "Compressão de Apley"]
      },
      "Toráxica": {
         mobility: ["Rotação à Direita", "Rotação à Esquerda"],
         tests: ["Adam", "Sinal da Flexa"]
      },
      "Lombar": {
         mobility: ["Extensão", "Lateralização Esquerda", "Flexão", "Lateralização Direita"],
         tests: ["Lasegue", "Slamp", "Patrick ou Faber", "Milgram", "Manobra de Valsalva", "Trendelemburg", "Hoover", "Discrepância Real"]
      }
   };

   return (
      <div className="min-h-screen min-w-screen bg-green-100">
         <LogoCorner />

         {/* Letreiro */}
         <div className="text-center py-8">
            <h1 className="text-4xl font-bold text-green-800 bg-white rounded-lg shadow-lg inline-block px-8 py-4">
               ARTICULAÇÕES
            </h1>
         </div>

         <div className="max-w-6xl mx-auto px-4 pb-8">
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

               {/* Grid das Articulações */}
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Object.entries(articulations).map(([articulation, categories]) => (
                     <div key={articulation} className="space-y-4">
                        {/* Botão da Articulação (Roxo) */}
                        <Button
                           onClick={() => handleArticulationClick(articulation)}
                           className="w-full bg-purple-600 hover:bg-purple-700 text-white text-lg font-semibold py-4"
                        >
                           {articulation}
                        </Button>

                        {/* Categorias (Amarelo) - só aparecem quando a articulação está aberta */}
                        {openArticulation === articulation && (
                           <div className="space-y-3 pl-4">
                              {/* Mobilidade */}
                              <Button
                                 onClick={() => handleCategoryClick(`${articulation}-mobility`)}
                                 className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-medium"
                              >
                                 Mobilidade
                              </Button>

                              {/* Testes */}
                              <Button
                                 onClick={() => handleCategoryClick(`${articulation}-tests`)}
                                 className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-medium"
                              >
                                 Testes
                              </Button>
                           </div>
                        )}

                        {/* Checkboxes (Branco) - só aparecem quando a categoria está aberta */}
                        {openArticulation === articulation && (
                           <div className="space-y-3 pl-8">
                              {/* Checkboxes de Mobilidade */}
                              {openCategory === `${articulation}-mobility` && (
                                 <div className="bg-white p-4 rounded-lg shadow-sm space-y-2">
                                    <h4 className="font-medium text-gray-800 mb-3">Mobilidade</h4>
                                    {categories.mobility.map((item) => (
                                       <div key={item} className="flex items-center space-x-2">
                                          <Checkbox
                                             id={`${articulation}-mobility-${item}`}
                                             checked={articulationData[articulation]?.mobility?.[item] || false}
                                             onCheckedChange={(checked) =>
                                                handleCheckboxChange(articulation, 'mobility', item, checked as boolean)
                                             }
                                          />
                                          <label
                                             htmlFor={`${articulation}-mobility-${item}`}
                                             className="text-sm text-gray-700"
                                          >
                                             {item}
                                          </label>
                                       </div>
                                    ))}
                                 </div>
                              )}

                              {/* Checkboxes de Testes */}
                              {openCategory === `${articulation}-tests` && (
                                 <div className="bg-white p-4 rounded-lg shadow-sm space-y-2">
                                    <h4 className="font-medium text-gray-800 mb-3">Testes</h4>
                                    {categories.tests.map((item) => (
                                       <div key={item} className="flex items-center space-x-2">
                                          <Checkbox
                                             id={`${articulation}-tests-${item}`}
                                             checked={articulationData[articulation]?.tests?.[item] || false}
                                             onCheckedChange={(checked) =>
                                                handleCheckboxChange(articulation, 'tests', item, checked as boolean)
                                             }
                                          />
                                          <label
                                             htmlFor={`${articulation}-tests-${item}`}
                                             className="text-sm text-gray-700"
                                          >
                                             {item}
                                          </label>
                                       </div>
                                    ))}
                                 </div>
                              )}
                           </div>
                        )}
                     </div>
                  ))}

                  {/* Seção da Coluna Vertebral */}
                  <div className="space-y-4">
                     {/* Botão da Coluna (Roxo) */}
                     <Button
                        onClick={() => handleArticulationClick("Coluna")}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white text-lg font-semibold py-4"
                     >
                        Coluna
                     </Button>

                     {/* Seções da Coluna - só aparecem quando Coluna está aberta */}
                     {openArticulation === "Coluna" && (
                        <div className="space-y-3 pl-4">
                           {Object.entries(spinalSections).map(([section, categories]) => (
                              <div key={section} className="space-y-2">
                                 {/* Botão da Seção da Coluna (Roxo mais claro) */}
                                 <Button
                                    onClick={() => handleSpinalSectionClick(section)}
                                    className="w-full bg-purple-500 hover:bg-purple-600 text-white font-medium py-2"
                                 >
                                    {section}
                                 </Button>

                                 {/* Categorias (Amarelo) - só aparecem quando a seção está aberta */}
                                 {openSpinalSection === section && (
                                    <div className="space-y-2 pl-4">
                                       {/* Mobilidade */}
                                       <Button
                                          onClick={() => handleCategoryClick(`${section}-mobility`)}
                                          className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-medium text-sm py-2"
                                       >
                                          Mobilidade
                                       </Button>

                                       {/* Testes */}
                                       <Button
                                          onClick={() => handleCategoryClick(`${section}-tests`)}
                                          className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-medium text-sm py-2"
                                       >
                                          Testes
                                       </Button>
                                    </div>
                                 )}

                                 {/* Checkboxes (Branco) - só aparecem quando a categoria está aberta */}
                                 {openSpinalSection === section && (
                                    <div className="space-y-2 pl-8">
                                       {/* Checkboxes de Mobilidade */}
                                       {openCategory === `${section}-mobility` && (
                                          <div className="bg-white p-3 rounded-lg shadow-sm space-y-2">
                                             <h4 className="font-medium text-gray-800 mb-2 text-sm">Mobilidade</h4>
                                             {categories.mobility.map((item) => (
                                                <div key={item} className="flex items-center space-x-2">
                                                   <Checkbox
                                                      id={`${section}-mobility-${item}`}
                                                      checked={articulationData[section]?.mobility?.[item] || false}
                                                      onCheckedChange={(checked) =>
                                                         handleCheckboxChange(section, 'mobility', item, checked as boolean)
                                                      }
                                                   />
                                                   <label
                                                      htmlFor={`${section}-mobility-${item}`}
                                                      className="text-xs text-gray-700"
                                                   >
                                                      {item}
                                                   </label>
                                                </div>
                                             ))}
                                          </div>
                                       )}

                                       {/* Checkboxes de Testes */}
                                       {openCategory === `${section}-tests` && (
                                          <div className="bg-white p-3 rounded-lg shadow-sm space-y-2">
                                             <h4 className="font-medium text-gray-800 mb-2 text-sm">Testes</h4>
                                             {categories.tests.map((item) => (
                                                <div key={item} className="flex items-center space-x-2">
                                                   <Checkbox
                                                      id={`${section}-tests-${item}`}
                                                      checked={articulationData[section]?.tests?.[item] || false}
                                                      onCheckedChange={(checked) =>
                                                         handleCheckboxChange(section, 'tests', item, checked as boolean)
                                                      }
                                                   />
                                                   <label
                                                      htmlFor={`${section}-tests-${item}`}
                                                      className="text-xs text-gray-700"
                                                   >
                                                      {item}
                                                   </label>
                                                </div>
                                             ))}
                                          </div>
                                       )}
                                    </div>
                                 )}
                              </div>
                           ))}
                        </div>
                     )}
                  </div>
               </div>

               {/* Botões de ação */}
               <div className="flex space-x-4 pt-8 mt-8 border-t border-gray-300">
                  <Button
                     onClick={handleSave}
                     className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  >
                     Salvar Articulações
                  </Button>

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