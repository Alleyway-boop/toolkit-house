# Vue Components Package Documentation

A modern Vue component library built with TypeScript and UnoCSS for responsive, accessible UI components.

## 📦 Installation

```bash
npm install vue-components
# or
pnpm add vue-components
# or
yarn add vue-components
```

## 🎨 Package Overview

The `vue-components` package provides:
- Reusable Vue 3 components
- TypeScript support
- UnoCSS for styling
- Accessibility features
- Responsive design patterns

## 🚀 Quick Start

### Basic Usage

```vue
<template>
  <div>
    <Button @click="handleClick">Click Me</Button>
    <Input v-model="searchText" placeholder="Search..." />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Button, Input } from 'vue-components'

const searchText = ref('')
const handleClick = () => {
  console.log('Button clicked!')
}
</script>
```

### With TypeScript

```vue
<template>
  <div>
    <Button variant="primary" :loading="isLoading">
      {{ buttonText }}
    </Button>
    <Input
      v-model="email"
      type="email"
      placeholder="Enter email"
      :error="emailError"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Button, Input } from 'vue-components'

const isLoading = ref(false)
const buttonText = ref('Submit')
const email = ref('')
const emailError = ref<string | null>(null)

const handleSubmit = async () => {
  isLoading.value = true
  try {
    await submitForm(email.value)
    buttonText.value = 'Success!'
  } catch (error) {
    emailError.value = 'Invalid email address'
  } finally {
    isLoading.value = false
  }
}
</script>
```

## 📚 API Reference

### Button Component

A versatile button component with multiple variants and states.

```vue
<template>
  <Button
    variant="primary"
    size="lg"
    :disabled="isDisabled"
    :loading="isLoading"
    @click="handleClick"
  >
    Button Text
  </Button>
</template>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'primary' \| 'secondary' \| 'success' \| 'danger' \| 'warning' \| 'ghost'` | `'primary'` | Button variant/style |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Button size |
| `disabled` | `boolean` | `false` | Whether button is disabled |
| `loading` | `boolean` | `false` | Whether button shows loading state |
| `block` | `boolean` | `false` | Whether button should take full width |

#### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `click` | `MouseEvent` | Emitted when button is clicked |

#### Slots

| Slot | Description |
|------|-------------|
| `default` | Button content |

#### Examples

```vue
<template>
  <div>
    <!-- Basic Button -->
    <Button @click="handleClick">Click Me</Button>

    <!-- Variant Buttons -->
    <Button variant="primary">Primary</Button>
    <Button variant="success">Success</Button>
    <Button variant="danger">Danger</Button>
    <Button variant="warning">Warning</Button>

    <!-- Size Buttons -->
    <Button size="sm">Small</Button>
    <Button size="md">Medium</Button>
    <Button size="lg">Large</Button>

    <!-- Disabled Button -->
    <Button disabled>Disabled</Button>

    <!-- Loading Button -->
    <Button :loading="isLoading">Loading...</Button>

    <!-- Full Width Button -->
    <Button block>Full Width</Button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Button } from 'vue-components'

const isLoading = ref(false)

const handleClick = () => {
  isLoading.value = true
  setTimeout(() => {
    isLoading.value = false
  }, 2000)
}
</script>
```

### Input Component

A flexible input component with support for different types and validation.

```vue
<template>
  <div>
    <Input
      v-model="value"
      type="text"
      placeholder="Enter text..."
      :error="error"
      :disabled="disabled"
      :readonly="readonly"
      :required="required"
    />

    <Input
      v-model="email"
      type="email"
      placeholder="Enter email..."
      :error="emailError"
    />

    <Input
      v-model="password"
      type="password"
      placeholder="Enter password..."
      showPassword
    />
  </div>
</template>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `'text' \| 'email' \| 'password' \| 'number' \| 'tel'` | `'text'` | Input type |
| `placeholder` | `string` | `''` | Input placeholder text |
| `value` | `string \| number` | `''` | Input value (v-model) |
| `disabled` | `boolean` | `false` | Whether input is disabled |
| `readonly` | `boolean` | `false` | Whether input is readonly |
| `required` | `boolean` | `false` | Whether input is required |
| `error` | `string \| null` | `null` | Error message |
| `showPassword` | `boolean` | `false` | Whether to show password toggle (only for password type) |

#### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:value` | `string \| number` | Emitted when value changes (v-model) |
| `focus` | `FocusEvent` | Emitted when input gains focus |
| `blur` | `FocusEvent` | Emitted when input loses focus |

#### Slots

| Slot | Description |
|------|-------------|
| `default` | Input content |

#### Examples

```vue
<template>
  <div>
    <!-- Basic Input -->
    <Input
      v-model="username"
      placeholder="Enter username"
    />

    <!-- Email Input with Validation -->
    <Input
      v-model="email"
      type="email"
      placeholder="Enter email"
      :error="emailError"
    />

    <!-- Password Input -->
    <Input
      v-model="password"
      type="password"
      placeholder="Enter password"
      showPassword
    />

    <!-- Number Input -->
    <Input
      v-model="age"
      type="number"
      placeholder="Enter age"
    />

    <!-- Disabled Input -->
    <Input
      v-model="disabledValue"
      disabled
      placeholder="This is disabled"
    />

    <!-- Required Input -->
    <Input
      v-model="requiredValue"
      required
      placeholder="This field is required"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Input } from 'vue-components'

const username = ref('')
const email = ref('')
const password = ref('')
const age = ref('')
const disabledValue = ref('Disabled')
const requiredValue = ref('')

const emailError = computed(() => {
  if (email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    return 'Please enter a valid email address'
  }
  return null
})
</script>
```

## 🛠️ Advanced Usage

### Component Composition

```vue
<template>
  <div>
    <form @submit="handleSubmit" class="form">
      <div class="form-group">
        <label class="form-label">Username</label>
        <Input
          v-model="form.username"
          placeholder="Enter username"
          :error="errors.username"
        />
      </div>

      <div class="form-group">
        <label class="form-label">Email</label>
        <Input
          v-model="form.email"
          type="email"
          placeholder="Enter email"
          :error="errors.email"
        />
      </div>

      <div class="form-group">
        <label class="form-label">Password</label>
        <Input
          v-model="form.password"
          type="password"
          placeholder="Enter password"
          showPassword
          :error="errors.password"
        />
      </div>

      <div class="form-actions">
        <Button type="submit" :loading="isLoading">
          {{ isLoading ? 'Creating...' : 'Create Account' }}
        </Button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Button, Input } from 'vue-components'

const isLoading = ref(false)
const form = reactive({
  username: '',
  email: '',
  password: ''
})

const errors = reactive({
  username: '',
  email: '',
  password: ''
})

const validateForm = () => {
  let isValid = true

  if (!form.username.trim()) {
    errors.username = 'Username is required'
    isValid = false
  }

  if (!form.email.trim()) {
    errors.email = 'Email is required'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Please enter a valid email'
    isValid = false
  }

  if (!form.password) {
    errors.password = 'Password is required'
    isValid = false
  } else if (form.password.length < 8) {
    errors.password = 'Password must be at least 8 characters'
    isValid = false
  }

  return isValid
}

const handleSubmit = async (e: Event) => {
  e.preventDefault()

  if (!validateForm()) {
    return
  }

  isLoading.value = true

  try {
    await submitForm(form)
    // Success handling
  } catch (error) {
    // Error handling
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.form {
  max-width: 400px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 1rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-actions {
  margin-top: 1.5rem;
}
</style>
```

### Custom Styling

```vue
<template>
  <div>
    <Button
      class="custom-button"
      @click="handleClick"
    >
      Custom Styled Button
    </Button>

    <Input
      class="custom-input"
      v-model="customValue"
      placeholder="Custom styled input"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Button, Input } from 'vue-components'

const customValue = ref('')

const handleClick = () => {
  console.log('Custom button clicked!')
}
</script>

<style scoped>
.custom-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 8px;
  padding: 12px 24px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.custom-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.custom-input {
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  padding: 12px;
  transition: border-color 0.3s ease;
}

.custom-input:focus {
  outline: none;
  border-color: #667eea;
}
</style>
```

### Form Validation Integration

```vue
<template>
  <div>
    <form @submit.prevent="submitForm" class="validation-form">
      <div class="form-field">
        <label>Username</label>
        <Input
          v-model="form.username"
          :error="validation.username"
          @blur="validateField('username')"
        />
        <span class="error-message" v-if="validation.username">
          {{ validation.username }}
        </span>
      </div>

      <div class="form-field">
        <label>Email</label>
        <Input
          v-model="form.email"
          type="email"
          :error="validation.email"
          @blur="validateField('email')"
        />
        <span class="error-message" v-if="validation.email">
          {{ validation.email }}
        </span>
      </div>

      <Button
        type="submit"
        :loading="loading"
        :disabled="!isFormValid"
      >
        Submit
      </Button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Button, Input } from 'vue-components'

const form = reactive({
  username: '',
  email: ''
})

const validation = reactive({
  username: '',
  email: ''
})

const loading = ref(false)

const validateField = (field: string) => {
  switch (field) {
    case 'username':
      if (!form.username.trim()) {
        validation.username = 'Username is required'
      } else if (form.username.length < 3) {
        validation.username = 'Username must be at least 3 characters'
      } else {
        validation.username = ''
      }
      break
    case 'email':
      if (!form.email.trim()) {
        validation.email = 'Email is required'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        validation.email = 'Please enter a valid email'
      } else {
        validation.email = ''
      }
      break
  }
}

const isFormValid = computed(() => {
  return form.username.trim() &&
         form.email.trim() &&
         !validation.username &&
         !validation.email
})

const submitForm = async () => {
  if (!isFormValid.value) {
    return
  }

  loading.value = true

  try {
    await submitToAPI(form)
    console.log('Form submitted successfully!')
  } catch (error) {
    console.error('Submission failed:', error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.validation-form {
  max-width: 500px;
  margin: 0 auto;
}

.form-field {
  margin-bottom: 1.5rem;
}

.error-message {
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}
</style>
```

## 🎨 Styling Customization

### UnoCSS Integration

The package uses UnoCSS for styling, which allows for highly customizable utilities:

```vue
<template>
  <Button class="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
    Gradient Button
  </Button>
</template>
```

### CSS Custom Properties

You can customize components using CSS variables:

```css
:root {
  --button-primary-bg: #3b82f6;
  --button-primary-hover: #2563eb;
  --input-border: #e5e7eb;
  --input-focus-border: #3b82f6;
}

.vue-button--primary {
  background-color: var(--button-primary-bg);
}

.vue-button--primary:hover {
  background-color: var(--button-primary-hover);
}

.vue-input {
  border-color: var(--input-border);
}

.vue-input:focus {
  border-color: var(--input-focus-border);
}
```

## 🧪 Testing

### Component Testing

```typescript
// Button.test.ts
import { mount } from '@vue/test-utils'
import { Button } from 'vue-components'

describe('Button', () => {
  it('renders correctly', () => {
    const wrapper = mount(Button, {
      slots: {
        default: 'Click Me'
      }
    })

    expect(wrapper.text()).toBe('Click Me')
  })

  it('emits click event', async () => {
    const wrapper = mount(Button, {
      slots: {
        default: 'Click Me'
      }
    })

    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
  })

  it('shows loading state', () => {
    const wrapper = mount(Button, {
      props: {
        loading: true
      }
    })

    expect(wrapper.find('.spinner')).toBeTruthy()
  })
})
```

### Integration Testing

```typescript
// Form.test.ts
import { mount } from '@vue/test-utils'
import { Button, Input } from 'vue-components'

describe('Form Integration', () => {
  it('handles form submission', async () => {
    const wrapper = mount({
      template: `
        <div>
          <Input v-model="email" type="email" />
          <Button @click="submit">Submit</Button>
        </div>
      `,
      components: { Input, Button },
      data() {
        return { email: '' }
      },
      methods: {
        submit() {
          this.$emit('submit', this.email)
        }
      }
    })

    await wrapper.find('input').setValue('test@example.com')
    await wrapper.find('button').trigger('click')

    expect(wrapper.emitted('submit')).toBeTruthy()
    expect(wrapper.emitted('submit')[0][0]).toBe('test@example.com')
  })
})
```

## 🚀 Accessibility

### ARIA Attributes

The components include proper ARIA attributes for accessibility:

```vue
<Button
  aria-label="Save changes"
  aria-pressed="false"
  :disabled="isSaving"
>
  Save
</Button>

<Input
  aria-label="Email address"
  aria-required="true"
  :aria-invalid="!!emailError"
/>
```

### Keyboard Navigation

- Tab navigation works seamlessly through components
- Enter/Space keys trigger button clicks
- Escape key closes dropdowns (when applicable)

## 📱 Responsive Design

The components are responsive and work well across different screen sizes:

```vue
<template>
  <div class="responsive-container">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Input placeholder="Mobile input" />
      <Button variant="primary">Action</Button>
    </div>
  </div>
</template>

<style scoped>
.responsive-container {
  padding: 1rem;
}

@media (max-width: 768px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
```

## 🚀 Migration Guide

### From Version 0.x to 1.x

**Breaking Changes:**
- Props renamed for consistency (`size` instead of `size`)
- Event names updated (`click` instead of `onClick`)
- Removed deprecated `type` prop for Input

**Migration Steps:**

1. Update prop names:
   ```vue
   <!-- Before -->
   <Button size="large">Button</Button>

   <!-- After -->
   <Button size="lg">Button</Button>
   ```

2. Update event names:
   ```vue
   <!-- Before -->
   <Button @onClick="handleClick">Button</Button>

   <!-- After -->
   <Button @click="handleClick">Button</Button>
   ```

3. Update Input props:
   ```vue
   <!-- Before -->
   <Input type="text" error-text="Invalid input" />

   <!-- After -->
   <Input type="text" error="Invalid input" />
   ```

## 🤝 Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md) for contribution guidelines.

## 📄 License

MIT License - see [LICENSE](../LICENSE) file for details.

## 🔗 Related Resources

- [UnoCSS Documentation](https://unocss.dev/)
- [Vue 3 Composition API](https://vuejs.org/guide/introduction.html)
- [Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Responsive Design Patterns](https://css-tricks.com/snippets/css/responsive-nav-menu/)