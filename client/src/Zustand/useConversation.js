import { create } from "zustand";

const useConversation = create((set) => ({
  selectedConversation: null,
  setSelectedConversation: (selectedConversation) =>
    set({
      selectedConversation,
    }),
  messages: [],
  openMedia: {
    state: false,
    url: "",
    type: "",
  },
  setOpenMedia: (state, url, type) =>
    set({
      openMedia: {
        state,
        url,
        type,
      },
    }),

  setMessages: (messages) =>
    set({
      messages,
    }),
  typingUsers: {},
  setTypingUser: (userId, isTyping) =>
    set((state) => ({
      typingUsers: {
        ...state.typingUsers,
        [userId]: isTyping,
      },
    })),
  removeTypingUser: (userId) =>
    set((state) => {
      const { [userId]: _, ...rest } = state.typingUsers; //[userId]: _ (Will delete the user Key-value)
      return { typingUsers: rest };
    }),
}));

export default useConversation;
