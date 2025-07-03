import { defineStore } from 'pinia'
import API_CONFIG from '../config/api'

export interface ClockRecord {
  id: string
  userId: string
  type: 'in' | 'out'
  timestamp: string
  location: {
    latitude: number
    longitude: number
  }
  distance: number
  isInRange: boolean
  needsApproval: boolean
  userName?: string
}

export interface CompanyLocation {
  latitude: number
  longitude: number
  address: string
  radius: number
}

export const useClockStore = defineStore('clock', {
  state: () => ({
    records: [] as ClockRecord[],
    companyLocation: null as CompanyLocation | null,
    loading: false
  }),
  
  actions: {
    async getCompanyLocation() {
      try {
        const response = await fetch(`${API_CONFIG.baseURL}/company/location`)
        const data = await response.json()
        
        if (data.success) {
          this.companyLocation = data.data
        }
      } catch (error) {
        console.error('取得公司位置失敗:', error)
      }
    },
    
    async updateCompanyLocation(location: CompanyLocation) {
      try {
        const response = await fetch(`${API_CONFIG.baseURL}/company/location`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(location),
        })
        
        const data = await response.json()
        
        if (data.success) {
          this.companyLocation = data.data
          return { success: true }
        } else {
          return { success: false, message: data.message }
        }
      } catch (error) {
        return { success: false, message: '更新失敗' }
      }
    },
    
    async clockIn(userId: string, latitude: number, longitude: number) {
      this.loading = true
      try {
        const response = await fetch(`${API_CONFIG.baseURL}/clock`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            type: 'in',
            latitude,
            longitude
          }),
        })
        
        const data = await response.json()
        
        if (data.success) {
          await this.fetchRecords(userId)
          return { success: true, message: data.message, data: data.data }
        } else {
          return { success: false, message: data.message }
        }
      } catch (error) {
        return { success: false, message: '打卡失敗' }
      } finally {
        this.loading = false
      }
    },
    
    async clockOut(userId: string, latitude: number, longitude: number) {
      this.loading = true
      try {
        const response = await fetch(`${API_CONFIG.baseURL}/clock`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            type: 'out',
            latitude,
            longitude
          }),
        })
        
        const data = await response.json()
        
        if (data.success) {
          await this.fetchRecords(userId)
          return { success: true, message: data.message, data: data.data }
        } else {
          return { success: false, message: data.message }
        }
      } catch (error) {
        return { success: false, message: '打卡失敗' }
      } finally {
        this.loading = false
      }
    },
    
    async fetchRecords(userId?: string, date?: string) {
      try {
        const params = new URLSearchParams()
        if (userId) params.append('userId', userId)
        if (date) params.append('date', date)
        
        const response = await fetch(`${API_CONFIG.baseURL}/clock/records?${params}`)
        const data = await response.json()
        
        if (data.success) {
          this.records = data.data
        }
      } catch (error) {
        console.error('取得打卡記錄失敗:', error)
      }
    },
    
    async getCurrentPosition(): Promise<{ latitude: number; longitude: number } | null> {
      return new Promise((resolve) => {
        if (!navigator.geolocation) {
          resolve(null)
          return
        }
        
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            })
          },
          () => {
            resolve(null)
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000
          }
        )
      })
    }
  }
}) 