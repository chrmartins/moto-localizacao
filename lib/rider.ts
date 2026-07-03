// ===== Dados do rider — edite aqui =====
// Todas as informações exibidas no perfil de emergência vêm deste arquivo.

export type Hospital = {
  name: string;
  info: string;
  emergency: boolean; // true => destaca em verde (pronto-socorro/trauma)
  distanceKm: string;
  timeMin: string;
  mapsQuery: string; // nome ou "lat,lng" para o Google Maps
};

export const rider = {
  name: "Christian Martins",
  firstName: "Christian",
  tagline: "Rider · Estradas & Aventura",

  emergencyContact: {
    name: "Maria Martins",
    relation: "esposa",
    phone: "+5511999998888", // usado no botão de ligação
    phoneLabel: "11 99999-8888",
    whatsapp: "5511999998888", // usado no envio de localização
  },

  vitals: {
    bloodType: "O+",
    allergies: "Dipirona · Penicilina",
    conditions: "Nenhuma condição pré-existente relatada",
    age: "34 anos",
    weight: "78 kg",
    healthPlanPreference: "Unimed · levar ao Hospital Santa Casa",
  },

  location: {
    label: "Av. Paulista, São Paulo · SP",
    updated: "atualizado há 2 min",
  },

  hospitals: [
    { name: "Hospital Santa Casa", info: "Pronto-socorro 24h", emergency: true, distanceKm: "1,2 km", timeMin: "~4 min", mapsQuery: "Hospital Santa Casa de São Paulo" },
    { name: "Hospital das Clínicas", info: "Trauma / emergência", emergency: true, distanceKm: "2,8 km", timeMin: "~9 min", mapsQuery: "Hospital das Clínicas FMUSP" },
    { name: "Hospital Sírio-Libanês", info: "Pronto atendimento", emergency: false, distanceKm: "3,5 km", timeMin: "~11 min", mapsQuery: "Hospital Sírio-Libanês São Paulo" },
  ] as Hospital[],

  assistance: {
    towName: "Porto Seguro Assistência",
    towPhone: "08007001234",
    insurer: "Porto Seguro",
    policyMasked: "•••• ••••",
    policyNumber: "12.345.678-9",
  },

  moto: {
    model: "Honda XRE 300 · 2024 · Vermelha/Preta",
    plate: "ABC-1D23",
    healthPlan: "Unimed · 0000 0000 0000 00",
  },

  message:
    "Se você está lendo isso, obrigado por parar. Toda ajuda importa. Por favor, avise minha família — eles são tudo pra mim. Bora com cuidado, sempre. 🏍️",

  demoMode: true, // mostra o aviso "dados de exemplo"; troque para false quando os dados forem reais
};

export function mapsDirUrl(query: string) {
  return (
    "https://www.google.com/maps/dir/?api=1&destination=" +
    encodeURIComponent(query) +
    "&travelmode=driving"
  );
}
