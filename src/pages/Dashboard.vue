<template>
  <div class="min-h-screen bg-gray-100">
    <!-- 導航欄 -->
    <nav class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <h1 class="text-xl font-semibold">人資管理系統</h1>
          </div>
          <div class="flex items-center space-x-4">
            <span class="text-gray-700">{{ authStore.user?.name }}</span>
            <span class="text-sm text-gray-500">({{ authStore.user?.role === 'manager' ? '管理員' : '員工' }})</span>
            <button
              @click="handleLogout"
              class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              登出
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- 主要內容 -->
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <!-- 打卡功能卡片 -->
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">打卡系統</dt>
                    <dd class="text-lg font-medium text-gray-900">上下班打卡</dd>
                  </dl>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-5 py-3">
              <div class="text-sm">
                <router-link to="/clock" class="font-medium text-blue-600 hover:text-blue-500">
                  進入打卡系統 →
                </router-link>
              </div>
            </div>
          </div>

          <!-- 排班功能卡片 -->
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">排班系統</dt>
                    <dd class="text-lg font-medium text-gray-900">工作班表管理</dd>
                  </dl>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-5 py-3">
              <div class="text-sm">
                <router-link to="/schedule" class="font-medium text-green-600 hover:text-green-500">
                  進入排班系統 →
                </router-link>
              </div>
            </div>
          </div>

          <!-- 設定功能卡片（僅管理員可見） -->
          <div v-if="authStore.user?.role === 'manager'" class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                  </div>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">系統設定</dt>
                    <dd class="text-lg font-medium text-gray-900">管理員設定</dd>
                  </dl>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-5 py-3">
              <div class="text-sm">
                <router-link to="/settings" class="font-medium text-purple-600 hover:text-purple-500">
                  進入系統設定 →
                </router-link>
              </div>
            </div>
          </div>

        </div>

        <!-- 快速資訊面板 -->
        <div class="mt-8">
          <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">今日資訊</h3>
          <div class="bg-white shadow overflow-hidden sm:rounded-md">
            <div class="px-4 py-5 sm:p-6">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="text-center">
                  <div class="text-2xl font-bold text-blue-600">{{ todayClockRecords.length }}</div>
                  <div class="text-sm text-gray-500">今日打卡次數</div>
                </div>
                <div class="text-center">
                  <div class="text-2xl font-bold text-green-600">{{ todaySchedules.length }}</div>
                  <div class="text-sm text-gray-500">今日排班數</div>
                </div>
                <div class="text-center">
                  <div class="text-2xl font-bold text-purple-600">{{ currentTime }}</div>
                  <div class="text-sm text-gray-500">目前時間</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useClockStore } from '../stores/clock'
import { useScheduleStore } from '../stores/schedule'

const router = useRouter()
const authStore = useAuthStore()
const clockStore = useClockStore()
const scheduleStore = useScheduleStore()

const currentTime = ref('')
let timeInterval: number

// 計算今日資料
const todayClockRecords = computed(() => {
  const today = new Date().toISOString().split('T')[0]
  return clockStore.records.filter(record => record.timestamp.startsWith(today))
})

const todaySchedules = computed(() => {
  const today = new Date().toISOString().split('T')[0]
  return scheduleStore.schedules.filter(schedule => schedule.date === today)
})

const updateTime = () => {
  currentTime.value = new Date().toLocaleTimeString('zh-TW')
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

onMounted(async () => {
  // 初始化資料
  await clockStore.fetchRecords(authStore.user?.id)
  await scheduleStore.fetchSchedules(authStore.user?.id)
  
  // 開始時間更新
  updateTime()
  timeInterval = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval)
  }
})
</script> 