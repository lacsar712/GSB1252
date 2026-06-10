import { ref } from 'vue'
import { api } from '@/api'
import type { Book } from '@/types'

export interface UseBookListOptions {
  defaultPageSize?: number
  withCategory?: boolean
}

let pendingRequest: Promise<void> | null = null

export function useBookList(options: UseBookListOptions = {}) {
  const { defaultPageSize = 12, withCategory = false } = options

  const loading = ref(false)
  const books = ref<Book[]>([])
  const total = ref(0)
  const currentPage = ref(1)
  const pageSize = ref(defaultPageSize)
  const searchQuery = ref('')
  const selectedCategory = ref('')
  const categories = ref<string[]>([])

  async function fetchBooks() {
    if (pendingRequest) return pendingRequest

    loading.value = true
    pendingRequest = (async () => {
      try {
        const response = await api.getBooks({
          page: currentPage.value,
          page_size: pageSize.value,
          search: searchQuery.value || undefined,
          category: withCategory && selectedCategory.value
            ? selectedCategory.value
            : undefined
        })
        books.value = response.items
        total.value = response.total
      } catch (error) {
        console.error('获取图书列表失败:', error)
      } finally {
        loading.value = false
        pendingRequest = null
      }
    })()

    return pendingRequest
  }

  async function fetchCategories() {
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
    handleSearch
  }
}
