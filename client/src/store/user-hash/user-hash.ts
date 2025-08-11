import { create } from 'zustand'

type UserHashState = {
  hash: string | null
  setHash: (hash: string | null) => void
}

const useUserHashStore = create<UserHashState>((set) => ({
  hash: null,
  setHash: (hash) => set({ hash }),
}))

export default useUserHashStore
