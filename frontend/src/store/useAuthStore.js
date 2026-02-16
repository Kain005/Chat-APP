import {create} from "zustand";
import { axiosInstance } from "../lib/axios.js";
//import { updateProfile } from "../../../backend/src/controllers/auth.controller.js";
import toast from "react-hot-toast";
//import { disconnect } from "mongoose";
import { io } from "socket.io-client";

const BASE_URL=import.meta.env.MODE ==="development" ? "http://localhost:5001/api" :"/api";
export const useAuthStore=create((set,get)=>({
    authUser:null,
    isSigningUp:false,
    onlineUsers: [],
    isLoggingIn:false,
    isUpdatingProfile:false,
    isCheckingAuth:true,
    socket:null,
    checkAuth:async()=>{
        try{
            const res=await axiosInstance.get("/auth/check");
            set({authUser:res.data});
            get().connectSocket();

        }
        catch(error){
            console.log("Error in checkAuth",error);
            set({authUser:null});
        }
        finally{
            set({isCheckingAuth:false});
        }
    },
    signup:async(data)=>{
        set({isSigningUp:true});
        try{
            const res=await axiosInstance.post("/auth/signup",data);
            set({authUser:res.data});
            toast.success("Account created successfully");
             get().connectSocket();

        }
        catch(error){
            toast.error(error?.response?.data?.message || "Something went wrong");
        }
        finally{
            set({isSigningUp:false});
        }
    },

    logout:async(data)=>{
        try{
            await axiosInstance.post("/auth/logout");
            set({authUser:null});
            toast.success("Logged out successfully");
            get().disconnectSocket();
        }
        catch(error){
            toast.error(error?.response?.data?.message || "Something went wrong");
        }
    },
     login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully");

      get().connectSocket();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      set({ isLoggingIn: false });
    }
  },
  updateProfile:async (data)=>{
    set({isUpdatingProfile:true});
    try{
        const res=await axiosInstance.put("/auth/update-profile",data);
        set({authUser:res.data});
        toast.success("Profile updated successfully");

    }
    catch(error){
        console.log("Error in update profile",error);
        toast.error(error?.response?.data?.message || "Something went wrong");
    }
    finally{
        set({isUpdatingProfile:false});
    }
  },
  connectSocket:()=>{
    const{authUser}=get();
    if(!authUser||get().socket?.connected)return;
    const socket=io("http://localhost:5001",{
        query:{
            userId:authUser._id,
        },
    });
    socket.connect();
    set({socket:socket});
    socket.on("getOnlineUsers",(userIds)=>{
        set({onlineUsers:useIds});

    });
  },
  disconnectSocket:()=>{
    if(get().socket?.connected) get().socket.disconnect();

  }
}));