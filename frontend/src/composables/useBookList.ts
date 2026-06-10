import { ref, onMounted } from 'vue'
import { api } from '@/api'
import type { Book } from '@/types'

interface UseBookListOptions {
  initialPageSize?: number
  enableCategory?: boolean
  autoFetch?: boolean
}

export function useBookList(options: UseBookListOptions = {}) {
  const {
    initialPageSize = 12,
    enableCategory = false,
    autoFetch = true
  } = options

  const loading = ref(false)
  const books = ref<Book[]>([])
  const total = ref(0)
  const currentPage = ref(1)
  const pageSize = ref(initialPageSize)
  const searchQuery = ref('')
  const selectedCategory = ref('')
  const categories = ref<string[]>([])

  let abortController: AbortController | null = null
  let requestId = 0

  async function fetchBooks() {
    if (abortController) {
      abortController.abort()
    }

    abortController = new AbortController()
    const currentRequestId = ++requestId

    loading.value = true
    try {
      const response = await api.getBooks({
        page: currentPage.value,
        page_size: pageSize.value,
        search: searchQuery.value || undefined,
        category: enableCategory ? selectedCategory.value || undefined : undefined
      })

      if (currentRequestId === requestId) {
        books.value = response.items
        total.value = response.total
      }
    } catch (error) {
      if (currentRequestId === requestId) {
        console.error('获取图书列表失败:', error)
      }
    } finally {
      if (currentRequestId === requestId) {
        loading.value = false
        abortController = null
      }
    }
  }

  async function fetchCategories() {
    if (!enableCategory) return
    try {
      categories.value = await api.getCategories()
    } catch (error) {
      console.error('获取分类失败:', error)
    }
  }

  function handleSearch() {
    currentPage.value = 1
    fetchBooks()
  }

  function refresh() {
    fetchBooks()
  }

  onMounted(() => {
    if (autoFetch) {
      const tasks: Promise<void>[] = [fetchBooks()]
      if (enableCategory) {
        tasks.push(fetchCategories())
      }
      Promise.all(tasks)
    }
  })

  return {
    loading,
    books,
    total,
    currentPage,
    pageSize,
    searchQuery,
    selectedCategory,
    categories,
    fetchBooks,
    fetchCategories,
    handleSearch,
    refresh
  }
}
