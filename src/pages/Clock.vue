<template>
  <div class="min-h-screen bg-gray-100">
    <!-- 導航欄 -->
    <nav class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center space-x-4">
            <router-link to="/" class="text-blue-600 hover:text-blue-800">← 返回首頁</router-link>
            <h1 class="text-xl font-semibold">打卡系統</h1>
          </div>
          <div class="flex items-center">
            <span class="text-gray-700">{{ authStore.user?.name }}</span>
          </div>
        </div>
      </div>
    </nav>

    <main class="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        
        <!-- 當前時間和日期 -->
        <div class="bg-white shadow rounded-lg p-6 mb-6">
          <div class="text-center">
            <div class="text-4xl font-bold text-gray-900 mb-2">{{ currentTime }}</div>
            <div class="text-lg text-gray-600">{{ currentDate }}</div>
          </div>
        </div>

        <!-- 打卡按鈕區域 -->
        <div class="bg-white shadow rounded-lg p-6 mb-6">
          <h2 class="text-lg font-medium text-gray-900 mb-4">打卡操作</h2>
          
          <!-- 位置狀態 -->
          <div class="mb-4 p-4 rounded-md" :class="locationStatus.class">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5" :class="locationStatus.iconClass" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium" :class="locationStatus.textClass">
                  {{ locationStatus.title }}
                </h3>
                <div class="mt-2 text-sm" :class="locationStatus.descClass">
                  <p>{{ locationStatus.message }}</p>
                  <p v-if="userLocation" class="mt-1">
                    目前位置：{{ userLocation.latitude.toFixed(6) }}, {{ userLocation.longitude.toFixed(6) }}
                  </p>
                  <p v-if="clockStore.companyLocation" class="mt-1">
                    公司位置：{{ clockStore.companyLocation.address }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- 打卡按鈕 -->
          <div class="grid grid-cols-2 gap-4">
            <button
              @click="handleClockIn"
              :disabled="clockStore.loading || !userLocation"
              class="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div class="flex items-center justify-center">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
                </svg>
                {{ clockStore.loading ? '處理中...' : '上班打卡' }}
              </div>
            </button>
            
            <button
              @click="handleClockOut"
              :disabled="clockStore.loading || !userLocation"
              class="w-full bg-red-600 text-white py-3 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div class="flex items-center justify-center">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
                </svg>
                {{ clockStore.loading ? '處理中...' : '下班打卡' }}
              </div>
            </button>
          </div>
        </div>

        <!-- 今日打卡記錄 -->
        <div class="bg-white shadow rounded-lg p-6">
          <h2 class="text-lg font-medium text-gray-900 mb-4">今日打卡記錄</h2>
          
          <div v-if="todayRecords.length === 0" class="text-center text-gray-500 py-8">
            今日尚未打卡
          </div>
          
          <div v-else class="space-y-4">
            <div
              v-for="record in todayRecords"
              :key="record.id"
              class="border border-gray-200 rounded-lg p-4"
            >
              <div class="flex justify-between items-start">
                <div>
                  <div class="flex items-center space-x-2">
                    <span
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      :class="record.type === 'in' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                    >
                      {{ record.type === 'in' ? '上班' : '下班' }}
                    </span>
                    <span
                      v-if="record.needsApproval"
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"
                    >
                      需要審核
                    </span>
                  </div>
                  <div class="mt-1 text-sm text-gray-900">
                    時間：{{ new Date(record.timestamp).toLocaleString('zh-TW') }}
                  </div>
                  <div class="mt-1 text-sm text-gray-600">
                    距離公司：{{ record.distance }} 公尺
                  </div>
                </div>
                <div class="text-right">
                  <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="record.isInRange ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                  >
                    {{ record.isInRange ? '範圍內' : '範圍外' }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>

    <!-- 成功/錯誤訊息 -->
    <div
      v-if="message"
      class="fixed bottom-4 right-4 max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden"
    >
      <div class="p-4">
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <svg
              v-if="messageType === 'success'"
              class="h-6 w-6 text-green-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <svg
              v-else
              class="h-6 w-6 text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="ml-3 w-0 flex-1 pt-0.5">
            <p class="text-sm font-medium text-gray-900">{{ message }}</p>
          </div>
          <div class="ml-4 flex-shrink-0 flex">
            <button
              @click="clearMessage"
              class="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <span class="sr-only">關閉</span>
              <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useClockStore } from '../stores/clock'

const authStore = useAuthStore()
const clockStore = useClockStore()

const currentTime = ref('')
const currentDate = ref('')
const userLocation = ref<{ latitude: number; longitude: number } | null>(null)
const message = ref('')
const messageType = ref<'success' | 'error'>('success')

let timeInterval: number

// 計算今日打卡記錄
const todayRecords = computed(() => {
  const today = new Date().toISOString().split('T')[0]
  return clockStore.records
    .filter(record => record.timestamp.startsWith(today))
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
})

// 位置狀態
const locationStatus = computed(() => {
  if (!userLocation.value) {
    return {
      class: 'bg-yellow-50 border-yellow-200',
      iconClass: 'text-yellow-400',
      textClass: 'text-yellow-800',
      descClass: 'text-yellow-700',
      title: '正在取得位置...',
      message: '請允許瀏覽器取得您的位置資訊'
    }
  }

  if (!clockStore.companyLocation) {
    return {
      class: 'bg-gray-50 border-gray-200',
      iconClass: 'text-gray-400',
      textClass: 'text-gray-800',
      descClass: 'text-gray-700',
      title: '無法取得公司位置',
      message: '請聯絡管理員設定公司位置'
    }
  }

  // 計算距離
  const distance = calculateDistance(
    userLocation.value.latitude,
    userLocation.value.longitude,
    clockStore.companyLocation.latitude,
    clockStore.companyLocation.longitude
  )

  const isInRange = distance <= clockStore.companyLocation.radius

  if (isInRange) {
    return {
      class: 'bg-green-50 border-green-200',
      iconClass: 'text-green-400',
      textClass: 'text-green-800',
      descClass: 'text-green-700',
      title: '位置正常',
      message: `您在公司打卡範圍內（距離：${Math.round(distance)} 公尺）`
    }
  } else {
    return {
      class: 'bg-red-50 border-red-200',
      iconClass: 'text-red-400',
      textClass: 'text-red-800',
      descClass: 'text-red-700',
      title: '位置超出範圍',
      message: `您距離公司 ${Math.round(distance)} 公尺，超出允許範圍 ${clockStore.companyLocation.radius} 公尺`
    }
  }
})

// 計算兩點距離
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371e3 // 地球半徑（公尺）
  const φ1 = lat1 * Math.PI / 180
  const φ2 = lat2 * Math.PI / 180
  const Δφ = (lat2 - lat1) * Math.PI / 180
  const Δλ = (lon2 - lon1) * Math.PI / 180

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))

  return R * c
}

const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('zh-TW')
  currentDate.value = now.toLocaleDateString('zh-TW', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    weekday: 'long'
  })
}

const getUserLocation = async () => {
  try {
    const position = await clockStore.getCurrentPosition()
    userLocation.value = position
  } catch (error) {
    showMessage('無法取得位置資訊，請確認已允許瀏覽器取得位置權限', 'error')
  }
}

const handleClockIn = async () => {
  if (!userLocation.value || !authStore.user) return

  const result = await clockStore.clockIn(
    authStore.user.id,
    userLocation.value.latitude,
    userLocation.value.longitude
  )

  if (result.success) {
    showMessage(result.message || '上班打卡成功', 'success')
  } else {
    showMessage(result.message || '打卡失敗', 'error')
  }
}

const handleClockOut = async () => {
  if (!userLocation.value || !authStore.user) return

  const result = await clockStore.clockOut(
    authStore.user.id,
    userLocation.value.latitude,
    userLocation.value.longitude
  )

  if (result.success) {
    showMessage(result.message || '下班打卡成功', 'success')
  } else {
    showMessage(result.message || '打卡失敗', 'error')
  }
}

const showMessage = (msg: string, type: 'success' | 'error') => {
  message.value = msg
  messageType.value = type
  setTimeout(clearMessage, 5000)
}

const clearMessage = () => {
  message.value = ''
}

onMounted(async () => {
  // 開始時間更新
  updateTime()
  timeInterval = setInterval(updateTime, 1000)

  // 取得公司位置和使用者位置
  await clockStore.getCompanyLocation()
  await getUserLocation()

  // 載入今日打卡記錄
  if (authStore.user) {
    await clockStore.fetchRecords(authStore.user.id, new Date().toISOString().split('T')[0])
  }
})

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval)
  }
})
</script> 