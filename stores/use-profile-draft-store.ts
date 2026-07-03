// Estado global do rascunho do questionário (Fase 1: cadastro → tema → pagamento).
// O perfil de emergência em si é renderizado no servidor; o Zustand vive aqui,
// no fluxo multi-step em que o estado precisa sobreviver entre as etapas.

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { RiderTheme } from "@/lib/profiles";

export type DraftStep = "dados" | "vitais" | "tema" | "pagamento";

export interface ProfileDraft {
  name: string;
  firstName: string;
  tagline: string;
  emergencyContactName: string;
  emergencyContactRelation: string;
  emergencyContactPhone: string;
  bloodType: string;
  allergies: string;
  conditions: string;
  motoModel: string;
  motoPlate: string;
  message: string;
  theme: RiderTheme;
}

const emptyDraft: ProfileDraft = {
  name: "",
  firstName: "",
  tagline: "",
  emergencyContactName: "",
  emergencyContactRelation: "",
  emergencyContactPhone: "",
  bloodType: "",
  allergies: "",
  conditions: "",
  motoModel: "",
  motoPlate: "",
  message: "",
  theme: "amber",
};

interface ProfileDraftState {
  step: DraftStep;
  draft: ProfileDraft;
  setStep: (step: DraftStep) => void;
  update: (patch: Partial<ProfileDraft>) => void;
  reset: () => void;
}

export const useProfileDraftStore = create<ProfileDraftState>()(
  persist(
    (set) => ({
      step: "dados",
      draft: emptyDraft,
      setStep: (step) => set({ step }),
      update: (patch) => set((s) => ({ draft: { ...s.draft, ...patch } })),
      reset: () => set({ step: "dados", draft: emptyDraft }),
    }),
    { name: "rider-id-draft" },
  ),
);
