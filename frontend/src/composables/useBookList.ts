import { ref } from 'vue'
import { api } from '@/api'
import type { Book } from '@/types'

export interface UseBookListOptions {
  defaultPageSize?: number
  enableCategory?: boolean
}

export function useBookList(options: UseBookListOptions = {}) {
  const { defaultPageSize = 10, enableCategory = false } = options

  const loading = ref(false)
  const books = ref<Book[]>([])
  const total = ref(0)
  const currentPage = ref(1)
  const pageSize = ref(defaultPageSize)
  const searchQuery = ref('')
  const selectedCategory = ref('')
  const categories = ref<string[]>([])

  let requestSeq = 0

  async function fetchBooks() {
    const seq = ++requestSeq
    loading.value = true
    try {
      const response = await api.getBooks({
        page: currentPage.value,
        page_size: pageSize.value,
        search: searchQuery.value || undefined,
        category: enableCategory ? selectedCategory.value || undefined : undefined
      })
      if (seq === requestSeq) {
        books.value = response.items
        total.value = response.total
      }
    } catch (error) {
      if (seq === requestSeq) {
        console.error('获取图书列表失败:', error)
      }
    } finally {
      if (seq === requestSeq) {
        loading.value = false
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
