<template>
  <div class="min-h-screen bg-gray-100">
    <!-- 導航欄 -->
    <nav class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center space-x-4">
            <router-link to="/" class="text-blue-600 hover:text-blue-800">← 返回首頁</router-link>
            <h1 class="text-xl font-semibold">系統設定</h1>
          </div>
          <div class="flex items-center">
            <span class="text-gray-700">{{ authStore.user?.name }}</span>
          </div>
        </div>
      </div>
    </nav>

    <main class="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        
        <!-- 公司位置設定 -->
        <div class="bg-white shadow rounded-lg p-6 mb-6">
          <h2 class="text-lg font-medium text-gray-900 mb-4">公司位置設定</h2>
          <p class="text-sm text-gray-600 mb-4">
            設定公司的地理位置和允許的打卡範圍，員工需要在此範圍內才能正常打卡。
          </p>
          
          <form @submit.prevent="saveCompanyLocation">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">緯度</label>
                <input
                  type="number"
                  step="0.000001"
                  v-model="locationForm.latitude"
                  required
                  class="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="25.033964"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">經度</label>
                <input
                  type="number"
                  step="0.000001"
                  v-model="locationForm.longitude"
                  required
                  class="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="121.564468"
                />
              </div>
            </div>
            
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">地址</label>
              <input
                type="text"
                v-model="locationForm.address"
                required
                class="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="台北市信義區市府路1號"
              />
            </div>
            
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                允許打卡範圍（公尺）
              </label>
              <input
                type="number"
                min="10"
                max="1000"
                v-model="locationForm.radius"
                required
                class="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="100"
              />
              <p class="text-xs text-gray-500 mt-1">
                建議設定 50-200 公尺，太小可能造成定位誤差，太大可能失去管控效果
              </p>
            </div>
            
            <div class="flex justify-end space-x-2">
              <button
                type="button"
                @click="getCurrentLocation"
                :disabled="gettingLocation"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 disabled:opacity-50"
              >
                {{ gettingLocation ? '取得中...' : '取得目前位置' }}
              </button>
              <button
                type="submit"
                :disabled="saving"
                class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {{ saving ? '儲存中...' : '儲存設定' }}
              </button>
            </div>
          </form>
        </div>

        <!-- 打卡記錄管理 -->
        <div class="bg-white shadow rounded-lg p-6 mb-6">
          <h2 class="text-lg font-medium text-gray-900 mb-4">打卡記錄管理</h2>
          
          <div class="mb-4 flex flex-wrap gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">選擇日期</label>
              <input
                type="date"
                v-model="selectedDate"
                @change="loadClockRecords"
                class="border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">選擇員工</label>
              <select
                v-model="selectedUserId"
                @change="loadClockRecords"
                class="border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="">所有員工</option>
                <option v-for="user in users" :key="user.id" :value="user.id">
                  {{ user.name }}
                </option>
              </select>
            </div>
            <div class="flex items-end">
              <button
                @click="loadClockRecords"
                class="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700"
              >
                查詢記錄
              </button>
            </div>
          </div>
          
          <div v-if="clockRecords.length === 0" class="text-center text-gray-500 py-8">
            {{ selectedDate ? '該日期沒有打卡記錄' : '請選擇日期查看打卡記錄' }}
          </div>
          
          <div v-else class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    員工
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    類型
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    時間
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    距離
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    狀態
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="record in clockRecords" :key="record.id">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {{ record.userName }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      :class="record.type === 'in' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                    >
                      {{ record.type === 'in' ? '上班' : '下班' }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ new Date(record.timestamp).toLocaleString('zh-TW') }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ record.distance }} 公尺
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center space-x-2">
                      <span
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        :class="record.isInRange ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'"
                      >
                        {{ record.isInRange ? '正常' : '需審核' }}
                      </span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 系統統計 -->
        <div class="bg-white shadow rounded-lg p-6">
          <h2 class="text-lg font-medium text-gray-900 mb-4">系統統計</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="text-center">
              <div class="text-3xl font-bold text-blue-600">{{ totalUsers }}</div>
              <div class="text-sm text-gray-500 mt-1">總員工數</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold text-green-600">{{ todayClockCount }}</div>
              <div class="text-sm text-gray-500 mt-1">今日打卡次數</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold text-yellow-600">{{ pendingApprovalCount }}</div>
              <div class="text-sm text-gray-500 mt-1">待審核打卡</div>
            </div>
          </div>
        </div>

      </div>
    </main>

    <!-- 訊息提示 -->
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
import { ref, computed, onMounted, reactive } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useClockStore } from '../stores/clock'
import API_CONFIG from '../config/api'

const authStore = useAuthStore()
const clockStore = useClockStore()

// 狀態
const saving = ref(false)
const gettingLocation = ref(false)
const message = ref('')
const messageType = ref<'success' | 'error'>('success')
const users = ref<any[]>([])
const clockRecords = ref<any[]>([])
const selectedDate = ref('')
const selectedUserId = ref('')

// 表單
const locationForm = reactive({
  latitude: 25.033964,
  longitude: 121.564468,
  address: '台北市信義區市府路1號',
  radius: 100
})

// 計算屬性
const totalUsers = computed(() => users.value.length)
const todayClockCount = computed(() => {
  const today = new Date().toISOString().split('T')[0]
  return clockRecords.value.filter(record => record.timestamp.startsWith(today)).length
})
const pendingApprovalCount = computed(() => {
  return clockRecords.value.filter(record => record.needsApproval).length
})

// 方法
const loadCompanyLocation = async () => {
  await clockStore.getCompanyLocation()
  if (clockStore.companyLocation) {
    locationForm.latitude = clockStore.companyLocation.latitude
    locationForm.longitude = clockStore.companyLocation.longitude
    locationForm.address = clockStore.companyLocation.address
    locationForm.radius = clockStore.companyLocation.radius
  }
}

const getCurrentLocation = async () => {
  gettingLocation.value = true
  
  try {
    const position = await clockStore.getCurrentPosition()
    if (position) {
      locationForm.latitude = position.latitude
      locationForm.longitude = position.longitude
      showMessage('位置取得成功', 'success')
    } else {
      showMessage('無法取得位置，請手動輸入', 'error')
    }
  } catch (error) {
    showMessage('位置取得失敗', 'error')
  } finally {
    gettingLocation.value = false
  }
}

const saveCompanyLocation = async () => {
  saving.value = true
  
  try {
    const result = await clockStore.updateCompanyLocation(locationForm)
    
    if (result.success) {
      showMessage('公司位置設定成功', 'success')
    } else {
      showMessage(result.message || '設定失敗', 'error')
    }
  } catch (error) {
    showMessage('設定失敗', 'error')
  } finally {
    saving.value = false
  }
}

const loadUsers = async () => {
  try {
    const response = await fetch(`${API_CONFIG.baseURL}/users`)
    const data = await response.json()
    if (data.success) {
      users.value = data.data
    }
  } catch (error) {
    console.error('載入使用者列表失敗:', error)
  }
}

const loadClockRecords = async () => {
  try {
    await clockStore.fetchRecords(selectedUserId.value, selectedDate.value)
    clockRecords.value = clockStore.records
  } catch (error) {
    console.error('載入打卡記錄失敗:', error)
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
  // 設定今日日期
  selectedDate.value = new Date().toISOString().split('T')[0]
  
  // 載入資料
  await loadCompanyLocation()
  await loadUsers()
  await loadClockRecords()
})
</script> 