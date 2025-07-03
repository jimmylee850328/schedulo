import { defineStore } from 'pinia'
import API_CONFIG from '../config/api'

export interface User {
  id: string
  username: string
  role: 'manager' | 'employee'
  name: string
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    isAuthenticated: false,
  }),
  
  actions: {
    async login(username: string, password: string) {
      try {
        const response = await fetch(`${API_CONFIG.baseURL}/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        })
        
        const data = await response.json()
        
        if (data.success) {
          this.user = data.user
          this.isAuthenticated = true
          // 儲存到 localStorage
          localStorage.setItem('hr_user', JSON.stringify(data.user))
          return { success: true }
        } else {
          return { success: false, message: data.message }
        }
      } catch (error) {
        return { success: false, message: '連線失敗，請檢查網路連線' }
      }
    },
    
    logout() {
      this.user = null
      this.isAuthenticated = false
      localStorage.removeItem('hr_user')
    },
    
    initAuth() {
      const savedUser = localStorage.getItem('hr_user')
      if (savedUser) {
        try {
          this.user = JSON.parse(savedUser)
          this.isAuthenticated = true
        } catch (error) {
          localStorage.removeItem('hr_user')
        }
      }
    }
  }
}) 