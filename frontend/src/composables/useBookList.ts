import { ref } from 'vue'
import { api } from '@/api'
import type { Book } from '@/types'

export interface UseBookListOptions {
  pageSize?: number
  withCategories?: boolean
}

/**
 * 图书列表通用逻辑：
 * - 统一管理 books / total / loading / 分页 / 搜索 / 分类
 * - 通过 inFlight 标记避免并发重复请求
 * - 可选拉取分类列表
 */
export function useBookList(options: UseBookListOptions = {}) {
  const { pageSize: initialPageSize = 12, withCategories = false } = options

  const loading = ref(false)
  const books = ref<Book[]>([])
  const total = ref(0)
  const currentPage = ref(1)
  const pageSize = ref(initialPageSize)
  const searchQuery = ref('')
  const selectedCategory = ref('')
  const categories = ref<string[]>([])

  // 并发去重标记：同一时刻只允许一个 fetchBooks 真正走网络
  let inFlight: Promise<void> | null = null

  async function fetchBooks(): Promise<void> {
    if (inFlight) {
      return inFlight
    }
    loading.value = true
    inFlight = (async () => {
      try {
        const response = await api.getBooks({
          page: currentPage.value,
          page_size: pageSize.value,
          search: searchQuery.value || undefined,
          category: selectedCategory.value || undefined
        })
        books.value = response.items
        total.value = response.total
      } catch (error) {
        console.error('获取图书列表失败:', error)
      } finally {
        loading.value = false
        inFlight = null
      }
    })()
    return inFlight
  }

  async function fetchCategories(): Promise<void> {
    try {
      categories.value = await api.getCategories()
    } catch (error) {
      console.error('获取分类失败:', error)
    }
  }

  /** 触发搜索：重置页码并重新请求 */
  function handleSearch(): Promise<void> {
    currentPage.value = 1
    return fetchBooks()
  }

  /** 初始化：可选并行拉取分类 */
  function init(): Promise<void> {
    if (withCategories) {
      return Promise.all([fetchBooks(), fetchCategories()]).then(() => undefined)
    }
    return fetchBooks()
  }

  return {
    // 状态
    loading,
    books,
    total,
    currentPage,
    pageSize,
    searchQuery,
    selectedCategory,
    categories,
    // 方法
    fetchBooks,
    fetchCategories,
    handleSearch,
    init
  }
}
