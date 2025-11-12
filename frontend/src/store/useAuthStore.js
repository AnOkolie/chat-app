import { create } from "zustand";

//manage global states. Use set to update states
export const useAuthStore = create((set,get) => ({
    authUser:{name:"john",id:123,age:25},
    isLoading:false,

    login: () => {
        console.log("We just logged in")
        set({isLoading:true})
    }
}))