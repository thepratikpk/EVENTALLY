import axios from 'axios'

export const API=axios.create({
    baseURL:import.meta.env.VITE_BACKEND_URL+'/api/v1',
    withCredentials:true
})