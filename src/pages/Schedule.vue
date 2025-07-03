<template>
  <div class="min-h-screen bg-gray-100">
    <!-- 導航欄 -->
    <nav class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center space-x-4">
            <router-link to="/" class="text-blue-600 hover:text-blue-800">← 返回首頁</router-link>
            <h1 class="text-xl font-semibold">排班管理</h1>
          </div>
          <div class="flex items-center">
            <span class="text-gray-700">{{ authStore.user?.name }}</span>
          </div>
        </div>
      </div>
    </nav>

    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        
        <!-- 操作按鈕區 -->
        <div class="mb-6 flex justify-between items-center">
          <div class="flex space-x-4">
            <button
              @click="showAddModal = true"
              class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              + 新增排班
            </button>
            <div class="flex items-center space-x-2">
              <label class="text-sm font-medium text-gray-700">查看週期：</label>
              <input
                type="date"
                v-model="weekStart"
                @change="loadWeekSchedules"
                class="border border-gray-300 rounded-md px-3 py-1 text-sm"
              />
              <span class="text-sm text-gray-500">到</span>
              <input
                type="date"
                v-model="weekEnd"
                @change="loadWeekSchedules"
                class="border border-gray-300 rounded-md px-3 py-1 text-sm"
              />
            </div>
          </div>
          
          <!-- 管理員可切換查看所有人員 -->
          <div v-if="authStore.user?.role === 'manager'" class="flex items-center space-x-2">
            <label class="text-sm font-medium text-gray-700">查看對象：</label>
            <select
              v-model="selectedUserId"
              @change="loadWeekSchedules"
              class="border border-gray-300 rounded-md px-3 py-1 text-sm"
            >
              <option value="">所有員工</option>
              <option v-for="user in users" :key="user.id" :value="user.id">
                {{ user.name }}
              </option>
            </select>
          </div>
        </div>

        <!-- 週曆視圖 -->
        <div class="bg-white shadow rounded-lg overflow-hidden">
          <div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 class="text-lg font-medium text-gray-900">
              排班表 ({{ formatDate(weekStart) }} - {{ formatDate(weekEnd) }})
            </h2>
          </div>
          
          <div class="overflow-x-auto">
            <table class="min-w-full">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    員工
                  </th>
                  <th 
                    v-for="day in weekDays" 
                    :key="day.date"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {{ day.label }}<br>
                    <span class="text-xs font-normal">{{ day.date }}</span>
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="user in displayUsers" :key="user.id">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {{ user.name }}
                  </td>
                  <td 
                    v-for="day in weekDays" 
                    :key="`${user.id}-${day.date}`"
                    class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                  >
                    <div 
                      v-if="getScheduleForUserAndDate(user.id, day.date)"
                      class="bg-blue-100 border border-blue-300 rounded px-2 py-1 cursor-pointer hover:bg-blue-200"
                      @click="editSchedule(getScheduleForUserAndDate(user.id, day.date))"
                    >
                      <div class="font-medium text-blue-900">
                        {{ getScheduleForUserAndDate(user.id, day.date)?.startTime }} - 
                        {{ getScheduleForUserAndDate(user.id, day.date)?.endTime }}
                      </div>
                      <div v-if="getScheduleForUserAndDate(user.id, day.date)?.notes" class="text-xs text-blue-700">
                        {{ getScheduleForUserAndDate(user.id, day.date)?.notes }}
                      </div>
                    </div>
                    <div 
                      v-else-if="canEditScheduleForUser(user.id)"
                      class="text-center text-gray-400 cursor-pointer hover:bg-gray-100 rounded px-2 py-1"
                      @click="addScheduleForDate(user.id, day.date)"
                    >
                      + 排班
                    </div>
                    <div v-else class="text-center text-gray-300">
                      -
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </main>

    <!-- 新增/編輯排班對話框 -->
    <div 
      v-if="showAddModal || showEditModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full"
      @click="closeModal"
    >
      <div 
        class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white"
        @click.stop
      >
        <h3 class="text-lg font-bold text-gray-900 mb-4">
          {{ showAddModal ? '新增排班' : '編輯排班' }}
        </h3>
        
        <form @submit.prevent="saveSchedule">
          <!-- 選擇員工（管理員才顯示） -->
          <div v-if="authStore.user?.role === 'manager'" class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">員工</label>
            <select
              v-model="scheduleForm.userId"
              required
              class="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="">請選擇員工</option>
              <option v-for="user in users" :key="user.id" :value="user.id">
                {{ user.name }}
              </option>
            </select>
          </div>
          
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">日期</label>
            <input
              type="date"
              v-model="scheduleForm.date"
              required
              class="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
          
          <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">開始時間</label>
              <input
                type="time"
                v-model="scheduleForm.startTime"
                required
                class="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">結束時間</label>
              <input
                type="time"
                v-model="scheduleForm.endTime"
                required
                class="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
          </div>
          
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">備註</label>
            <textarea
              v-model="scheduleForm.notes"
              rows="3"
              class="w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="選填..."
            ></textarea>
          </div>
          
          <div class="flex justify-end space-x-2">
            <button
              type="button"
              @click="closeModal"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
            >
              取消
            </button>
            <button
              v-if="showEditModal"
              type="button"
              @click="deleteCurrentSchedule"
              class="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700"
            >
              刪除
            </button>
            <button
              type="submit"
              :disabled="saving"
              class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {{ saving ? '儲存中...' : '儲存' }}
            </button>
          </div>
        </form>
      </div>
    </div>

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
import { useScheduleStore } from '../stores/schedule'
import API_CONFIG from '../config/api'

const authStore = useAuthStore()
const scheduleStore = useScheduleStore()

// 狀態
const showAddModal = ref(false)
const showEditModal = ref(false)
const saving = ref(false)
const message = ref('')
const messageType = ref<'success' | 'error'>('success')
const selectedUserId = ref('')
const users = ref<any[]>([])
const currentEditingSchedule = ref<any>(null)

// 週期選擇
const weekStart = ref('')
const weekEnd = ref('')

// 表單
const scheduleForm = reactive({
  userId: '',
  date: '',
  startTime: '',
  endTime: '',
  notes: ''
})

// 計算週天數
const weekDays = computed(() => {
  const days = []
  const start = new Date(weekStart.value)
  const end = new Date(weekEnd.value)
  
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    days.push({
      date: d.toISOString().split('T')[0],
      label: d.toLocaleDateString('zh-TW', { weekday: 'short' })
    })
  }
  
  return days
})

// 顯示的使用者列表
const displayUsers = computed(() => {
  if (authStore.user?.role === 'manager') {
    return users.value
  } else {
    return [authStore.user].filter(Boolean)
  }
})

// 方法
const initWeek = () => {
  const today = new Date()
  const monday = new Date(today)
  monday.setDate(today.getDate() - today.getDay() + 1)
  
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)
  
  weekStart.value = monday.toISOString().split('T')[0]
  weekEnd.value = sunday.toISOString().split('T')[0]
}

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('zh-TW')
}

const getScheduleForUserAndDate = (userId: string, date: string) => {
  return scheduleStore.schedules.find(s => s.userId === userId && s.date === date)
}

const canEditScheduleForUser = (userId: string) => {
  return authStore.user?.role === 'manager' || authStore.user?.id === userId
}

const addScheduleForDate = (userId: string, date: string) => {
  if (!canEditScheduleForUser(userId)) return
  
  scheduleForm.userId = userId
  scheduleForm.date = date
  scheduleForm.startTime = '09:00'
  scheduleForm.endTime = '18:00'
  scheduleForm.notes = ''
  showAddModal.value = true
}

const editSchedule = (schedule: any) => {
  if (!canEditScheduleForUser(schedule.userId)) return
  
  currentEditingSchedule.value = schedule
  scheduleForm.userId = schedule.userId
  scheduleForm.date = schedule.date
  scheduleForm.startTime = schedule.startTime
  scheduleForm.endTime = schedule.endTime
  scheduleForm.notes = schedule.notes
  showEditModal.value = true
}

const closeModal = () => {
  showAddModal.value = false
  showEditModal.value = false
  currentEditingSchedule.value = null
  resetForm()
}

const resetForm = () => {
  scheduleForm.userId = authStore.user?.id || ''
  scheduleForm.date = ''
  scheduleForm.startTime = ''
  scheduleForm.endTime = ''
  scheduleForm.notes = ''
}

const saveSchedule = async () => {
  saving.value = true
  
  try {
    let result
    
    if (showEditModal.value && currentEditingSchedule.value) {
      result = await scheduleStore.updateSchedule(currentEditingSchedule.value.id, {
        date: scheduleForm.date,
        startTime: scheduleForm.startTime,
        endTime: scheduleForm.endTime,
        notes: scheduleForm.notes
      })
    } else {
      result = await scheduleStore.createSchedule({
        userId: scheduleForm.userId,
        date: scheduleForm.date,
        startTime: scheduleForm.startTime,
        endTime: scheduleForm.endTime,
        notes: scheduleForm.notes
      })
    }
    
    if (result.success) {
      showMessage('排班儲存成功', 'success')
      closeModal()
      await loadWeekSchedules()
    } else {
      showMessage(result.message || '儲存失敗', 'error')
    }
  } catch (error) {
    showMessage('儲存失敗', 'error')
  } finally {
    saving.value = false
  }
}

const deleteCurrentSchedule = async () => {
  if (!currentEditingSchedule.value) return
  
  if (!confirm('確定要刪除這個排班嗎？')) return
  
  saving.value = true
  
  try {
    const result = await scheduleStore.deleteSchedule(currentEditingSchedule.value.id)
    
    if (result.success) {
      showMessage('排班刪除成功', 'success')
      closeModal()
      await loadWeekSchedules()
    } else {
      showMessage(result.message || '刪除失敗', 'error')
    }
  } catch (error) {
    showMessage('刪除失敗', 'error')
  } finally {
    saving.value = false
  }
}

const loadWeekSchedules = async () => {
  const userId = authStore.user?.role === 'manager' ? selectedUserId.value : authStore.user?.id
  await scheduleStore.fetchSchedules(userId, weekStart.value, weekEnd.value)
}

const loadUsers = async () => {
  if (authStore.user?.role === 'manager') {
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
  initWeek()
  resetForm()
  await loadUsers()
  await loadWeekSchedules()
})
</script> 