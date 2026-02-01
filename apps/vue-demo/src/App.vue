<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  Button,
  Input,
  Card,
  Modal,
  Toast,
  Select,
  Checkbox,
  Radio,
  Switch,
  Alert,
  Tabs,
  Breadcrumb,
  Dropdown,
  Pagination,
  Table,
  Progress,
  Skeleton,
} from '@toolkit-house/vue-components'
import { RequestPool } from '@toolkit-house/ts-utils'

// ============================================================================
// State
// ============================================================================
const inputValue = ref('')
const textAreaValue = ref('')
const checkboxValue = ref(false)
const radioValue = ref('option1')
const switchValue = ref(false)
const selectValue = ref('option1')
const selectOptions = ref([
  { label: 'Option 1', value: 'option1' },
  { label: 'Option 2', value: 'option2' },
  { label: 'Option 3', value: 'option3' },
])

const modalVisible = ref(false)
const toastVisible = ref(false)
const toastMessage = ref('')

const requestPoolResults = ref<string[]>([])
const requestPoolLoading = ref(false)

const activeTab = ref('tab1')

const breadcrumbItems = ref([
  { label: 'Home', path: '/' },
  { label: 'Components', path: '/components' },
  { label: 'Form', path: '/components/form' },
])

const dropdownVisible = ref(false)
const dropdownOptions = ref([
  { label: 'Action 1', value: 'action1' },
  { label: 'Action 2', value: 'action2' },
  { label: 'Action 3', value: 'action3' },
])

const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(100)

const progressValue = ref(60)

const tableColumns = ref([
  { key: 'name', title: 'Name' },
  { key: 'age', title: 'Age' },
  { key: 'email', title: 'Email' },
])

const tableData = ref([
  { name: 'Alice', age: 25, email: 'alice@example.com' },
  { name: 'Bob', age: 30, email: 'bob@example.com' },
  { name: 'Charlie', age: 35, email: 'charlie@example.com' },
])

const skeletonLoading = ref(false)

// ============================================================================
// Computed
// ============================================================================
const inputLength = computed(() => inputValue.value.length)

// ============================================================================
// Methods
// ============================================================================
const handleButtonClick = (message: string) => {
  showToast(message)
}

const handleModalOpen = () => {
  modalVisible.value = true
}

const handleModalClose = () => {
  modalVisible.value = false
}

const handleModalConfirm = () => {
  showToast('Modal confirmed!')
  modalVisible.value = false
}

const showToast = (message: string) => {
  toastMessage.value = message
  toastVisible.value = true
  setTimeout(() => {
    toastVisible.value = false
  }, 3000)
}

const handleReset = () => {
  inputValue.value = ''
  textAreaValue.value = ''
  checkboxValue.value = false
  radioValue.value = 'option1'
  switchValue.value = false
  selectValue.value = 'option1'
}

const fetchWithPool = async () => {
  requestPoolLoading.value = true
  requestPoolResults.value = []

  // Create a RequestPool with max 3 concurrent requests
  const pool = new RequestPool({
    maxConcurrent: 3,
    timeout: 10000,
  })

  // Simulate multiple API calls
  const urls = Array.from(
    { length: 10 },
    (_, i) => `https://jsonplaceholder.typicode.com/posts/${i + 1}`
  )

  try {
    const responses = await Promise.all(
      urls.map((url) =>
        pool.add(() =>
          fetch(url)
            .then((res) => res.json())
            .then((data) => data.title)
        )
      )
    )

    requestPoolResults.value = responses
    showToast(`Successfully fetched ${responses.length} posts!`)
  } catch (error) {
    requestPoolResults.value = [`Error: ${(error as Error).message}`]
    showToast('Failed to fetch posts')
  } finally {
    requestPoolLoading.value = false
  }
}

const toggleSkeleton = () => {
  skeletonLoading.value = !skeletonLoading.value
  setTimeout(() => {
    skeletonLoading.value = false
  }, 3000)
}

// ============================================================================
// Lifecycle
// ============================================================================
onMounted(() => {
  console.log('Vue Demo App mounted')
  console.log('Available components:', {
    Button,
    Input,
    Card,
    Modal,
    Toast,
    Select,
    Checkbox,
    Radio,
    Switch,
    Alert,
    Tabs,
    Breadcrumb,
    Dropdown,
    Pagination,
    Table,
    Progress,
    Skeleton,
  })
})
</script>

<template>
  <div class="app">
    <!-- Header -->
    <header class="header">
      <h1>🏠 Toolkit House - Vue Demo</h1>
      <p class="subtitle">
        Vue 3 Composition API + @toolkit-house/vue-components + ts-utils
      </p>
    </header>

    <!-- Main Content -->
    <main class="main">
      <div class="grid">
        <!-- Form Components Card -->
        <Card title="Form Components" class="card">
          <div class="form-section">
            <!-- Input -->
            <div class="form-group">
              <label>Text Input</label>
              <Input
                v-model="inputValue"
                placeholder="Enter some text..."
                :disabled="false"
              />
              <small class="hint">{{ inputLength }} characters</small>
            </div>

            <!-- Textarea -->
            <div class="form-group">
              <label>Textarea</label>
              <Input
                v-model="textAreaValue"
                type="textarea"
                placeholder="Enter multi-line text..."
                :rows="4"
              />
            </div>

            <!-- Select -->
            <div class="form-group">
              <label>Select Dropdown</label>
              <Select
                v-model="selectValue"
                :options="selectOptions"
                placeholder="Choose an option"
              />
            </div>

            <!-- Checkbox -->
            <div class="form-group-inline">
              <Checkbox v-model="checkboxValue">
                I agree to the terms and conditions
              </Checkbox>
            </div>

            <!-- Radio -->
            <div class="form-group">
              <label>Radio Options</label>
              <div class="radio-group">
                <Radio v-model="radioValue" value="option1">
                  Option 1
                </Radio>
                <Radio v-model="radioValue" value="option2">
                  Option 2
                </Radio>
                <Radio v-model="radioValue" value="option3">
                  Option 3
                </Radio>
              </div>
            </div>

            <!-- Switch -->
            <div class="form-group-inline">
              <Switch v-model="switchValue">
                Enable notifications
              </Switch>
            </div>

            <!-- Buttons -->
            <div class="button-group">
              <Button type="primary" @click="handleButtonClick('Primary button clicked!')">
                Primary
              </Button>
              <Button type="default" @click="handleButtonClick('Default button clicked!')">
                Default
              </Button>
              <Button type="danger" @click="handleButtonClick('Danger button clicked!')">
                Danger
              </Button>
              <Button type="success" @click="handleButtonClick('Success button clicked!')">
                Success
              </Button>
            </div>

            <div class="button-group">
              <Button type="primary" @click="handleModalOpen">
                Open Modal
              </Button>
              <Button type="default" @click="handleReset">
                Reset Form
              </Button>
            </div>
          </div>
        </Card>

        <!-- Feedback & Display Components Card -->
        <Card title="Feedback & Display Components" class="card">
          <div class="feedback-section">
            <!-- Alert -->
            <div class="subsection">
              <h3>Alert</h3>
              <Alert type="success" message="Success message example" />
              <Alert type="warning" message="Warning message example" />
              <Alert type="error" message="Error message example" />
              <Alert type="info" message="Info message example" />
            </div>

            <!-- Progress -->
            <div class="subsection">
              <h3>Progress: {{ progressValue }}%</h3>
              <Progress :percent="progressValue" />
            </div>

            <!-- Skeleton -->
            <div class="subsection">
              <h3>Skeleton</h3>
              <Button @click="toggleSkeleton" type="default" size="small">
                Toggle Skeleton (3s)
              </Button>
              <div v-if="skeletonLoading" class="skeleton-demo">
                <Skeleton :rows="3" />
              </div>
            </div>

            <!-- Breadcrumb -->
            <div class="subsection">
              <h3>Breadcrumb</h3>
              <Breadcrumb :items="breadcrumbItems" />
            </div>
          </div>
        </Card>

        <!-- Tabs & Table Card -->
        <Card title="Navigation & Data Display" class="card">
          <div class="nav-data-section">
            <!-- Tabs -->
            <div class="subsection">
              <h3>Tabs</h3>
              <Tabs v-model="activeTab">
                <div tab-key="tab1" tab="Tab 1">
                  <p>Content for Tab 1</p>
                </div>
                <div tab-key="tab2" tab="Tab 2">
                  <p>Content for Tab 2</p>
                </div>
                <div tab-key="tab3" tab="Tab 3">
                  <p>Content for Tab 3</p>
                </div>
              </Tabs>
            </div>

            <!-- Table -->
            <div class="subsection">
              <h3>Table</h3>
              <Table :columns="tableColumns" :data="tableData" />
            </div>

            <!-- Pagination -->
            <div class="subsection">
              <h3>Pagination</h3>
              <Pagination
                v-model="currentPage"
                :page-size="pageSize"
                :total="total"
              />
              <p>Current page: {{ currentPage }}</p>
            </div>
          </div>
        </Card>

        <!-- RequestPool Demo Card -->
        <Card title="RequestPool Demo (ts-utils)" class="card">
          <p class="description">
            Demonstrates the RequestPool utility from @toolkit-house/ts-utils
            for controlling concurrent requests.
          </p>
          <Button
            type="primary"
            @click="fetchWithPool"
            :disabled="requestPoolLoading"
          >
            {{ requestPoolLoading ? 'Fetching...' : 'Fetch 10 Posts (Max 3 Concurrent)' }}
          </Button>

          <div v-if="requestPoolResults.length > 0" class="results">
            <h4>Results:</h4>
            <ul>
              <li v-for="(result, index) in requestPoolResults.slice(0, 5)" :key="index">
                {{ result }}
              </li>
              <li v-if="requestPoolResults.length > 5">
                ...and {{ requestPoolResults.length - 5 }} more
              </li>
            </ul>
          </div>
        </Card>
      </div>
    </main>

    <!-- Toast Notification -->
    <Toast
      v-model:visible="toastVisible"
      :message="toastMessage"
      type="success"
      :duration="3000"
    />

    <!-- Modal -->
    <Modal
      v-model:visible="modalVisible"
      title="Confirm Action"
      @confirm="handleModalConfirm"
      @cancel="handleModalClose"
    >
      <p>Are you sure you want to proceed with this action?</p>
      <p>This will demonstrate the Modal component functionality.</p>
    </Modal>

    <!-- Footer -->
    <footer class="footer">
      <p>
        Built with
        <a href="https://vitejs.dev" target="_blank">Vite</a>
        +
        <a href="https://vuejs.org" target="_blank">Vue 3</a>
        +
        <a href="https://typescript.lang.org" target="_blank">TypeScript</a>
      </p>
    </footer>
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.header {
  text-align: center;
  color: white;
  padding: 2rem 1rem;
}

.header h1 {
  font-size: 2.5rem;
  margin: 0 0 0.5rem 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.subtitle {
  font-size: 1.1rem;
  opacity: 0.9;
  margin: 0;
}

.main {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
  gap: 1.5rem;
}

.card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 600;
  color: #2d3748;
}

.hint {
  color: #718096;
  font-size: 0.875rem;
}

.form-group-inline {
  display: flex;
  align-items: center;
}

.radio-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.button-group {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.feedback-section,
.nav-data-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.subsection {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.subsection h3 {
  margin: 0;
  color: #2d3748;
}

.description {
  color: #4a5568;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.results {
  margin-top: 1rem;
  padding: 1rem;
  background: #f7fafc;
  border-radius: 8px;
}

.results h4 {
  margin: 0 0 0.75rem 0;
}

.results ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.results li {
  padding: 0.25rem 0;
  color: #4a5568;
}

.skeleton-demo {
  margin-top: 1rem;
  padding: 1rem;
  background: #f7fafc;
  border-radius: 8px;
}

.footer {
  text-align: center;
  color: white;
  padding: 2rem;
  opacity: 0.8;
}

.footer a {
  color: white;
  text-decoration: underline;
}

.footer a:hover {
  text-decoration: none;
}

@media (max-width: 768px) {
  .header h1 {
    font-size: 1.75rem;
  }

  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
