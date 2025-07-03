import { defineStore } from 'pinia'
import API_CONFIG from '../config/api'

export interface Schedule {
  id: string
  userId: string
  date: string
  startTime: string
  endTime: string
  notes: string
  userName?: string
  createdAt?: string
  updatedAt?: string
}

export const useScheduleStore = defineStore('schedule', {
  state: () => ({
    schedules: [] as Schedule[],
    loading: false
  }),
  
  actions: {
    async fetchSchedules(userId?: string, startDate?: string, endDate?: string) {
      this.loading = true
      try {
        const params = new URLSearchParams()
        if (userId) params.append('userId', userId)
        if (startDate) params.append('startDate', startDate)
        if (endDate) params.append('endDate', endDate)
        
        const response = await fetch(`${API_CONFIG.baseURL}/schedules?${params}`)
        const data = await response.json()
        
        if (data.success) {
          this.schedules = data.data
        }
      } catch (error) {
        console.error('取得排班資料失敗:', error)
      } finally {
        this.loading = false
      }
    },
    
    async createSchedule(schedule: Omit<Schedule, 'id' | 'userName' | 'createdAt'>) {
      try {
        const response = await fetch(`${API_CONFIG.baseURL}/schedules`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(schedule),
        })
        
        const data = await response.json()
        
        if (data.success) {
          this.schedules.push(data.data)
          return { success: true, data: data.data }
        } else {
          return { success: false, message: data.message }
        }
      } catch (error) {
        return { success: false, message: '新增排班失敗' }
      }
    },
    
    async updateSchedule(id: string, schedule: Partial<Schedule>) {
      try {
        const response = await fetch(`${API_CONFIG.baseURL}/schedules/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(schedule),
        })
        
        const data = await response.json()
        
        if (data.success) {
          const index = this.schedules.findIndex(s => s.id === id)
          if (index !== -1) {
            this.schedules[index] = data.data
          }
          return { success: true, data: data.data }
        } else {
          return { success: false, message: data.message }
        }
      } catch (error) {
        return { success: false, message: '更新排班失敗' }
      }
    },
    
    async deleteSchedule(id: string) {
      try {
        const response = await fetch(`${API_CONFIG.baseURL}/schedules/${id}`, {
          method: 'DELETE',
        })
        
        const data = await response.json()
        
        if (data.success) {
          this.schedules = this.schedules.filter(s => s.id !== id)
          return { success: true }
        } else {
          return { success: false, message: data.message }
        }
      } catch (error) {
        return { success: false, message: '刪除排班失敗' }
      }
    }
  }
}) 