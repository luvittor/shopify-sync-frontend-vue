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

    <!-- Pagination -->
    <div class="pagination-container" v-if="pagination.total > 0">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[5, 10, 20, 50]"
        :total="pagination.total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
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
  ElLoading,
  ElPagination
} from 'element-plus'
import { api, type Product, type PaginationInfo } from '../services/api'

// Reactive state
const products = ref<Product[]>([])
const pagination = ref<PaginationInfo>({
  current_page: 1,
  per_page: 10,
  total: 0,
  last_page: 1,
  from: 0,
  to: 0,
  has_more_pages: false,
  prev_page_url: null,
  next_page_url: null
})
const currentPage = ref(1)
const pageSize = ref(10)
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

// Pagination handlers
const handleSizeChange = (val: number): void => {
  pageSize.value = val
  currentPage.value = 1
  handleRefresh()
}

const handleCurrentChange = (val: number): void => {
  currentPage.value = val
  handleRefresh()
}

// Action handlers
const handleRefresh = async (): Promise<void> => {
  isRefreshing.value = true
  
  const loading = ElLoading.service({
    lock: true,
    text: 'Loading products...'
  })

  try {
    const response = await api.getProducts(currentPage.value, pageSize.value)
    products.value = response.data
    pagination.value = response.pagination
    ElMessage.success(`Loaded ${response.data.length} products (Page ${response.pagination.current_page} of ${response.pagination.last_page})`)
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
    
    // Reset to page 1 and refresh the list after sync
    currentPage.value = 1
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
    
    // Reset to page 1 and refresh the list after clear
    currentPage.value = 1
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
    const response = await api.getProducts(currentPage.value, pageSize.value)
    products.value = response.data
    pagination.value = response.pagination
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

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
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

  .pagination-container {
    margin-top: 15px;
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