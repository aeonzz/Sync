import { ExtendedChannelProps } from "@/types/channel";
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

interface ReplyMessageStore {
  messageId: string | null;
  setMessageId: (messageId: string | null) => void;
}

export const useReplyMessageStore = create<ReplyMessageStore>((set) => ({
  messageId: null,
  setMessageId: (messageId: string | null) => set(() => ({ messageId })),
}));

interface MessageRequestsStore {
  channel: ExtendedChannelProps[] | undefined;
  isError: boolean;
  isLoading: boolean;
  setIsError: (isError: boolean) => void;
  setIsLoading: (isError: boolean) => void;
  setChannel: (channel: ExtendedChannelProps[] | undefined) => void;
}

export const useMessageRequestsStore = create<MessageRequestsStore>((set) => ({
  channel: undefined,
  isError: false,
  isLoading: false,
  setIsError: (isError: boolean) => set(() => ({ isError })),
  setIsLoading: (isLoading: boolean) => set(() => ({ isLoading })),
  setChannel: (channel: ExtendedChannelProps[] | undefined) =>
    set(() => ({ channel })),
}));
