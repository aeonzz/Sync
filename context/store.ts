import { create } from "zustand";

interface ThemeStore {
  isDark: boolean;
  dark: () => void;
  light: () => void;
}

export const useThemeStore = create<ThemeStore>((set) => ({
  isDark: false,
  dark: () => {
    set({ isDark: true });
  },
  light: () => {
    set({ isDark: false });
  },
}));

interface MutateState {
  isMutate: boolean;
  setIsMutate: (isMutate: boolean) => void;
}

export const useMutationSuccess = create<MutateState>((set) => ({
  isMutate: false,
  setIsMutate: (isMutate: boolean) => set(() => ({ isMutate })),
}));

interface ReplyMessage {
  messageId: string | null;
  setMessageId: (messageId: string | null) => void;
}

export const useReplyMessage = create<ReplyMessage>((set) => ({
  messageId: null,
  setMessageId: (messageId: string | null) => set(() => ({ messageId })),
}));
