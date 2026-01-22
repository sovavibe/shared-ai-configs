# Form Patterns

> Ant Design Form patterns with validation

## Basic Form

```tsx
import { Form, Input, Button } from 'antd'
import type { FC } from 'react'

interface FormValues {
  email: string
  password: string
}

export const LoginForm: FC = () => {
  const [form] = Form.useForm<FormValues>()

  const handleSubmit = (values: FormValues) => {
    console.log('Form values:', values)
  }

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit} autoComplete="off">
      <Form.Item
        name="email"
        label="Email"
        rules={[
          { required: true, message: 'Email is required' },
          { type: 'email', message: 'Invalid email format' },
        ]}
      >
        <Input placeholder="Enter email" />
      </Form.Item>

      <Form.Item
        name="password"
        label="Password"
        rules={[
          { required: true, message: 'Password is required' },
          { min: 8, message: 'Password must be at least 8 characters' },
        ]}
      >
        <Input.Password placeholder="Enter password" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  )
}
```

## Form with Dynamic Fields

```tsx
import { Form, Input, Button, Space } from 'antd'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'

interface CargoItem {
  type: string
  quantity: number
}

interface CargoFormValues {
  cargos: CargoItem[]
}

export const CargoForm: FC = () => {
  const [form] = Form.useForm<CargoFormValues>()

  return (
    <Form form={form} layout="vertical">
      <Form.List name="cargos">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                <Form.Item
                  {...restField}
                  name={[name, 'type']}
                  rules={[{ required: true, message: 'Cargo type required' }]}
                >
                  <Input placeholder="Cargo type" />
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, 'quantity']}
                  rules={[{ required: true, message: 'Quantity required' }]}
                >
                  <Input type="number" placeholder="Quantity" />
                </Form.Item>
                <MinusCircleOutlined onClick={() => remove(name)} />
              </Space>
            ))}
            <Form.Item>
              <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                Add Cargo
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
    </Form>
  )
}
```

## Form with Custom Validation

```tsx
const validateLaycan = (_: unknown, value: [Date, Date]) => {
  if (!value || value.length !== 2) {
    return Promise.reject(new Error('Laycan dates required'))
  }
  const [from, to] = value
  if (from >= to) {
    return Promise.reject(new Error('Laycan "from" must be before "to"'))
  }
  return Promise.resolve()
}

;<Form.Item name="laycan" label="Laycan" rules={[{ validator: validateLaycan }]}>
  <DatePicker.RangePicker />
</Form.Item>
```

## Form with Mutation

```tsx
import { useMutation } from '@tanstack/react-query'
import { message } from 'antd'

interface RouteRequestFormValues {
  origin: string
  destination: string
  cargoType: string
}

export const RouteRequestForm: FC = () => {
  const [form] = Form.useForm<RouteRequestFormValues>()

  const { mutateAsync, isPending } = useMutation({
    mutationFn: createRouteRequest,
    onSuccess: () => {
      message.success('Route request created')
      form.resetFields()
    },
    onError: (error) => {
      message.error(`Failed: ${error.message}`)
    },
  })

  const handleSubmit = async (values: RouteRequestFormValues) => {
    await mutateAsync(values)
  }

  return (
    <Form form={form} onFinish={handleSubmit}>
      {/* form fields */}
      <Button type="primary" htmlType="submit" loading={isPending}>
        Create Request
      </Button>
    </Form>
  )
}
```

---

## Additional Validation Patterns

### Password Strength Validation

```tsx
const validatePassword = (_: unknown, value: string) => {
  if (!value) {
    return Promise.reject(new Error('Password is required'))
  }
  if (value.length < 8) {
    return Promise.reject(new Error('Password must be at least 8 characters'))
  }
  if (!/[A-Z]/.test(value)) {
    return Promise.reject(new Error('Password must contain an uppercase letter'))
  }
  if (!/[a-z]/.test(value)) {
    return Promise.reject(new Error('Password must contain a lowercase letter'))
  }
  if (!/[0-9]/.test(value)) {
    return Promise.reject(new Error('Password must contain a number'))
  }
  if (!/[!@#$%^&*]/.test(value)) {
    return Promise.reject(new Error('Password must contain a special character'))
  }
  return Promise.resolve()
}

;<Form.Item name="password" label="Password" rules={[{ validator: validatePassword }]}>
  <Input.Password placeholder="Enter password" />
</Form.Item>
```

### Confirm Password Validation

```tsx
const validateConfirmPassword = (form: FormInstance) => (_: unknown, value: string) => {
  const password = form.getFieldValue('password')
  if (!value) {
    return Promise.reject(new Error('Please confirm your password'))
  }
  if (value !== password) {
    return Promise.reject(new Error('Passwords do not match'))
  }
  return Promise.resolve()
}

;<Form form={form} layout="vertical">
  <Form.Item
    name="password"
    label="Password"
    rules={[
      { required: true, message: 'Password is required' },
      { min: 8, message: 'Password must be at least 8 characters' },
    ]}
  >
    <Input.Password placeholder="Enter password" />
  </Form.Item>

  <Form.Item
    name="confirmPassword"
    label="Confirm Password"
    dependencies={['password']}
    rules={[{ required: true, message: 'Please confirm your password' }, { validator: validateConfirmPassword(form) }]}
  >
    <Input.Password placeholder="Confirm password" />
  </Form.Item>
</Form>
```

### Phone Number Validation

```tsx
const validatePhone = (_: unknown, value: string) => {
  if (!value) {
    return Promise.resolve() // Optional field
  }
  const phoneRegex = /^\+?[\d\s-]{10,15}$/
  if (!phoneRegex.test(value)) {
    return Promise.reject(new Error('Invalid phone number format'))
  }
  return Promise.resolve()
}

;<Form.Item name="phone" label="Phone Number" rules={[{ validator: validatePhone }]}>
  <Input placeholder="+1 (555) 123-4567" />
</Form.Item>
```

### Date Range Validation

```tsx
const validateDateRange = (_: unknown, value: [Date, Date]) => {
  if (!value || value.length !== 2) {
    return Promise.reject(new Error('Please select date range'))
  }
  const [start, end] = value
  const now = new Date()

  if (start < now) {
    return Promise.reject(new Error('Start date must be in the future'))
  }

  const maxDuration = 90 * 24 * 60 * 60 * 1000 // 90 days
  if (end.getTime() - start.getTime() > maxDuration) {
    return Promise.reject(new Error('Date range cannot exceed 90 days'))
  }

  return Promise.resolve()
}

;<Form.Item name="dateRange" label="Date Range" rules={[{ validator: validateDateRange }]}>
  <DatePicker.RangePicker />
</Form.Item>
```

### URL Validation

```tsx
const validateUrl = (_: unknown, value: string) => {
  if (!value) {
    return Promise.resolve() // Optional field
  }
  try {
    new URL(value)
    return Promise.resolve()
  } catch {
    return Promise.reject(new Error('Invalid URL format'))
  }
}

;<Form.Item name="website" label="Website" rules={[{ validator: validateUrl }]}>
  <Input placeholder="https://example.com" />
</Form.Item>
```

### Email with Domain Validation

```tsx
const allowedDomains = ['company.com', 'partner.com']

const validateEmailDomain = (_: unknown, value: string) => {
  if (!value) {
    return Promise.reject(new Error('Email is required'))
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(value)) {
    return Promise.reject(new Error('Invalid email format'))
  }
  const domain = value.split('@')[1]
  if (!allowedDomains.includes(domain)) {
    return Promise.reject(new Error(`Email must be from ${allowedDomains.join(' or ')}`))
  }
  return Promise.resolve()
}

;<Form.Item name="email" label="Work Email" rules={[{ validator: validateEmailDomain }]}>
  <Input placeholder="user@company.com" />
</Form.Item>
```

### Async Validation (Check Email Uniqueness)

```tsx
const validateEmailUnique = async (_: unknown, value: string) => {
  if (!value) {
    return Promise.resolve()
  }

  try {
    const exists = await api.checkEmailExists(value)
    if (exists) {
      return Promise.reject(new Error('Email already registered'))
    }
    return Promise.resolve()
  } catch {
    return Promise.reject(new Error('Failed to check email'))
  }
}

;<Form.Item
  name="email"
  label="Email"
  rules={[
    { required: true, message: 'Email is required' },
    { type: 'email', message: 'Invalid email format' },
    { validator: validateEmailUnique },
  ]}
  validateTrigger={['onBlur', 'onChange']}
>
  <Input placeholder="Enter email" />
</Form.Item>
```

---

## Error Display Patterns

### Show Field-Specific Errors

```tsx
<Form form={form} onFinish={handleSubmit} validateTrigger={['onBlur', 'onChange']}>
  <Form.Item
    name="email"
    label="Email"
    help={form.getFieldError('email')[0]}
    validateStatus={form.getFieldError('email').length > 0 ? 'error' : ''}
  >
    <Input placeholder="Enter email" />
  </Form.Item>
</Form>
```

### Show Form-Level Errors

```tsx
const [formErrors, setFormErrors] = useState<string[]>([])

const handleSubmit = async (values: FormValues) => {
  try {
    await api.submitForm(values)
    setFormErrors([])
  } catch (error) {
    setFormErrors(['Submission failed', error.message])
  }
}

;<Form onFinish={handleSubmit}>
  {/* form fields */}
  {formErrors.length > 0 && (
    <Alert
      type="error"
      message="Submission Error"
      description={formErrors.map((err) => (
        <div key={err}>{err}</div>
      ))}
    />
  )}
</Form>
```

---

## Form State Management

### Reset Form on Success

```tsx
const { mutateAsync } = useMutation({
  mutationFn: submitForm,
  onSuccess: () => {
    message.success('Form submitted successfully')
    form.resetFields()
  },
})
```

### Keep Form Values on Error

```tsx
const { mutateAsync } = useMutation({
  mutationFn: submitForm,
  onSuccess: () => {
    message.success('Form submitted successfully')
    form.resetFields()
  },
  onError: (error) => {
    message.error(`Failed: ${error.message}`)
    // Form values are preserved
  },
})
```

### Set Initial Values

```tsx
useEffect(() => {
  if (userData) {
    form.setFieldsValue({
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
    })
  }
}, [userData, form])
```

### Dynamic Validation Rules

```tsx
const [requirePhone, setRequirePhone] = useState(false)

<Form>
  <Form.Item
    name="phone"
    label="Phone"
    rules={requirePhone ? [
      { required: true, message: 'Phone is required' },
    ] : []}
  >
    <Input placeholder="Enter phone" />
  </Form.Item>

  <Checkbox checked={requirePhone} onChange={(e) => setRequirePhone(e.target.checked)}>
    Require phone number
  </Checkbox>
</Form>
```

---

## Related Docs

- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — Form Patterns
- [docs/DOMAIN.md](docs/DOMAIN.md) — Business Rules
- [.cursor/rules/styling.mdc](.cursor/rules/styling.mdc) — Styling Guidelines
- [.cursor/rules/skills/react-patterns.md](.cursor/rules/skills/react-patterns.md) — React Patterns
- [.cursor/notepads/canonical-examples.md](.cursor/notepads/canonical-examples.md) — Form Component Example
