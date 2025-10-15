// Utilitários para gerenciamento de dados locais e preparação para banco de dados

export interface StorageData {
  id: string;
  pacienteId: number;
  timestamp: string;
  data: any;
}

// Chaves do localStorage organizadas por tipo
export const STORAGE_KEYS = {
  MEDICAL_HISTORY: (pacienteId: number) => `medical_history_${pacienteId}`,
  PHYSICAL_EXAM: (pacienteId: number) => `physical_exam_${pacienteId}`,
  ARTICULATION_DATA: (pacienteId: number) => `articulation_data_${pacienteId}`,
  SESSIONS: (pacienteId: number) => `sessions_${pacienteId}`,
  SESSION_DETAILS: (pacienteId: number, sessionId: number) =>
    `session_details_${pacienteId}_${sessionId}`,
  PHOTOS: "fotosExameFisico",
} as const;

// Função genérica para salvar dados no localStorage
export const saveToLocalStorage = (key: string, data: any): void => {
  try {
    const storageData: StorageData = {
      id: `${key}_${Date.now()}`,
      pacienteId: data.paciente?.id || 0,
      timestamp: new Date().toISOString(),
      data: data,
    };

    localStorage.setItem(key, JSON.stringify(storageData.data));
    console.log(`Dados salvos em ${key}:`, storageData);
  } catch (error) {
    console.error(`Erro ao salvar dados em ${key}:`, error);
  }
};

// Função genérica para carregar dados do localStorage
export const loadFromLocalStorage = (key: string): any => {
  try {
    const savedData = localStorage.getItem(key);
    if (savedData) {
      return JSON.parse(savedData);
    }
    return null;
  } catch (error) {
    console.error(`Erro ao carregar dados de ${key}:`, error);
    return null;
  }
};

// Função para obter todos os dados de um paciente
export const getAllPatientData = (pacienteId: number) => {
  return {
    medicalHistory: loadFromLocalStorage(
      STORAGE_KEYS.MEDICAL_HISTORY(pacienteId)
    ),
    physicalExam: loadFromLocalStorage(STORAGE_KEYS.PHYSICAL_EXAM(pacienteId)),
    articulationData: loadFromLocalStorage(
      STORAGE_KEYS.ARTICULATION_DATA(pacienteId)
    ),
    sessions: loadFromLocalStorage(STORAGE_KEYS.SESSIONS(pacienteId)),
    photos: loadFromLocalStorage(STORAGE_KEYS.PHOTOS),
  };
};

// Função para limpar todos os dados de um paciente
export const clearPatientData = (pacienteId: number): void => {
  try {
    localStorage.removeItem(STORAGE_KEYS.MEDICAL_HISTORY(pacienteId));
    localStorage.removeItem(STORAGE_KEYS.PHYSICAL_EXAM(pacienteId));
    localStorage.removeItem(STORAGE_KEYS.ARTICULATION_DATA(pacienteId));
    localStorage.removeItem(STORAGE_KEYS.SESSIONS(pacienteId));

    // Remover detalhes de sessões
    const sessions = loadFromLocalStorage(STORAGE_KEYS.SESSIONS(pacienteId));
    if (sessions && Array.isArray(sessions)) {
      sessions.forEach((session: any) => {
        localStorage.removeItem(
          STORAGE_KEYS.SESSION_DETAILS(pacienteId, session.id)
        );
      });
    }

    console.log(`Dados do paciente ${pacienteId} removidos do localStorage`);
  } catch (error) {
    console.error(`Erro ao limpar dados do paciente ${pacienteId}:`, error);
  }
};

// Função para exportar dados de um paciente (preparação para banco de dados)
export const exportPatientData = (pacienteId: number) => {
  const patientData = getAllPatientData(pacienteId);

  const exportData = {
    pacienteId,
    exportDate: new Date().toISOString(),
    data: patientData,
  };

  // Criar arquivo JSON para download
  const dataStr = JSON.stringify(exportData, null, 2);
  const dataBlob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(dataBlob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `paciente_${pacienteId}_dados_${
    new Date().toISOString().split("T")[0]
  }.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  return exportData;
};

// Função para importar dados de um paciente (preparação para banco de dados)
export const importPatientData = (jsonData: string): boolean => {
  try {
    const importedData = JSON.parse(jsonData);

    if (importedData.pacienteId && importedData.data) {
      const { pacienteId, data } = importedData;

      // Salvar cada tipo de dado
      if (data.medicalHistory) {
        saveToLocalStorage(
          STORAGE_KEYS.MEDICAL_HISTORY(pacienteId),
          data.medicalHistory
        );
      }
      if (data.physicalExam) {
        saveToLocalStorage(
          STORAGE_KEYS.PHYSICAL_EXAM(pacienteId),
          data.physicalExam
        );
      }
      if (data.articulationData) {
        saveToLocalStorage(
          STORAGE_KEYS.ARTICULATION_DATA(pacienteId),
          data.articulationData
        );
      }
      if (data.sessions) {
        saveToLocalStorage(STORAGE_KEYS.SESSIONS(pacienteId), data.sessions);
      }
      if (data.photos) {
        saveToLocalStorage(STORAGE_KEYS.PHOTOS, data.photos);
      }

      console.log(`Dados do paciente ${pacienteId} importados com sucesso`);
      return true;
    }

    return false;
  } catch (error) {
    console.error("Erro ao importar dados:", error);
    return false;
  }
};

// Função para preparar dados para envio ao banco de dados
export const prepareDataForDatabase = (pacienteId: number) => {
  const patientData = getAllPatientData(pacienteId);

  return {
    paciente_id: pacienteId,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    medical_history: patientData.medicalHistory,
    physical_exam: patientData.physicalExam,
    articulation_data: patientData.articulationData,
    sessions: patientData.sessions,
    photos: patientData.photos,
  };
};

// Função para simular envio para banco de dados (para testes futuros)
export const saveToDatabase = async (pacienteId: number): Promise<boolean> => {
  try {
    const dataToSave = prepareDataForDatabase(pacienteId);

    // TODO: Implementar chamada real para API/banco de dados
    console.log("Dados preparados para banco de dados:", dataToSave);

    // Simular delay de rede
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Simular sucesso
    console.log(
      `Dados do paciente ${pacienteId} salvos no banco de dados com sucesso`
    );
    return true;
  } catch (error) {
    console.error("Erro ao salvar no banco de dados:", error);
    return false;
  }
};
