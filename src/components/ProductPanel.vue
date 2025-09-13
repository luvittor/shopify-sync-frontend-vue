<template>
  <div class="product-panel">
    <!-- Action Buttons -->
    <div class="toolbar">
      <el-button
        type="primary"
        :loading="isRefreshing"
        :disabled="isAnyActionLoading"
        @click="handleRefresh"
      >
        Refresh
      </el-button>
      <el-button
        type="success"
        :loading="isSyncing"
        :disabled="isAnyActionLoading"
        @click="handleSync"
      >
        Sync
      </el-button>
      <el-button
        type="danger"
        :loading="isClearing"
        :disabled="isAnyActionLoading"
        @click="handleClear"
      >
        Clear
      </el-button>
    </div>

    <!-- Products Table -->
    <el-table :data="products" style="width: 100%; margin-top: 20px">
      <el-table-column prop="id" label="Id" width="80" />
      <el-table-column prop="title" label="Title" min-width="200" />
      <el-table-column prop="price" label="Price" width="120">
        <template #default="{ row }">
          {{ formatCurrency(row.price) }}
        </template>
      </el-table-column>
      <el-table-column prop="stock" label="Stock" width="100" />
      <el-table-column prop="shopify_id" label="Shopify ID" width="150">
        <template #default="{ row }">
          {{ row.shopify_id || '—' }}
        </template>
      </el-table-column>
      <el-table-column prop="created_at" label="Created at" width="180">
        <template #default="{ row }">
          {{ row.created_at ? formatDate(row.created_at) : '—' }}
        </template>
      </el-table-column>
      <el-table-column prop="updated_at" label="Updated at" width="180">
        <template #default="{ row }">
          {{ row.updated_at ? formatDate(row.updated_at) : '—' }}
        </template>
      </el-table-column>

      <!-- Empty State -->
      <template #empty>
        <el-empty description="No products yet" />
      </template>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  ElButton,
  ElTable,
  ElTableColumn,
  ElEmpty,
  ElMessage,
  ElMessageBox,
  ElLoading
} from 'element-plus'
import { api, type Product } from '../services/api'

// Reactive state
const products = ref<Product[]>([])
const isRefreshing = ref(false)
const isSyncing = ref(false)
const isClearing = ref(false)

// Computed properties
const isAnyActionLoading = computed(() => 
  isRefreshing.value || isSyncing.value || isClearing.value
)

// Utility functions
const formatCurrency = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price)
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleString()
}

// Action handlers
const handleRefresh = async (): Promise<void> => {
  isRefreshing.value = true
  
  const loading = ElLoading.service({
    lock: true,
    text: 'Loading products...'
  })

  try {
    products.value = await api.getProducts()
    ElMessage.success(`Loaded ${products.value.length} products`)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load products'
    await ElMessageBox.alert(message, 'Error', {
      type: 'error',
      center: true
    })
  } finally {
    loading.close()
    isRefreshing.value = false
  }
}

const handleSync = async (): Promise<void> => {
  isSyncing.value = true
  
  const loading = ElLoading.service({
    lock: true,
    text: 'Syncing products...'
  })

  try {
    const result = await api.syncProducts()
    ElMessage.success(`Synced ${result.synced} products`)
    
    // Refresh the list after sync
    await refreshProductsInternal()
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to sync products'
    await ElMessageBox.alert(message, 'Error', {
      type: 'error',
      center: true
    })
  } finally {
    loading.close()
    isSyncing.value = false
  }
}

const handleClear = async (): Promise<void> => {
  isClearing.value = true
  
  const loading = ElLoading.service({
    lock: true,
    text: 'Clearing products...'
  })

  try {
    const result = await api.clearProducts()
    ElMessage.success(`Cleared ${result.cleared} products`)
    
    // Refresh the list after clear
    await refreshProductsInternal()
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to clear products'
    await ElMessageBox.alert(message, 'Error', {
      type: 'error',
      center: true
    })
  } finally {
    loading.close()
    isClearing.value = false
  }
}

// Internal refresh function (doesn't show loading states)
const refreshProductsInternal = async (): Promise<void> => {
  try {
    products.value = await api.getProducts()
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to refresh products'
    await ElMessageBox.alert(message, 'Error', {
      type: 'error',
      center: true
    })
  }
}

// Load products on component mount
onMounted(() => {
  handleRefresh()
})
</script>

<style scoped>
.product-panel {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.toolbar {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .product-panel {
    padding: 15px;
  }
  
  .toolbar {
    flex-direction: column;
  }
  
  .toolbar .el-button {
    width: 100%;
  }
}
</style>

<style>
/* Global font family for the entire page and modals */
* {
  font-family: Arial, sans-serif !important;
}

body {
  font-family: Arial, sans-serif !important;
}

/* Specifically target Element Plus components */
.el-loading-mask,
.el-message,
.el-alert,
.el-button,
.el-table,
.el-empty,
.el-loading-text {
  font-family: Arial, sans-serif !important;
}
</style>