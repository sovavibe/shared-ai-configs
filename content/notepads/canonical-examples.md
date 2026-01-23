# Canonical Examples

This notepad contains canonical examples of common patterns and components. Use these as references when implementing similar features.

**IMPORTANT:** These are references for patterns, not code to copy directly. Adapt to your specific use case.

---

## Button Component

### Full Implementation

```typescript
import { FC } from 'react';
import styled from 'styled-components';

export interface ButtonProps {
  /** Button variant */
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  /** Button size */
  size?: 'small' | 'medium' | 'large';
  /** Button is disabled */
  disabled?: boolean;
  /** Loading state */
  loading?: boolean;
  /** Click handler */
  onClick?: () => void;
  /** Button content */
  children: React.ReactNode;
}

export const Button: FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  onClick,
  children,
}) => {
  return (
    <StyledButton
      variant={variant}
      size={size}
      disabled={disabled || loading}
      onClick={onClick}
      aria-disabled={disabled || loading}
      role="button"
    >
      {loading ? <Spinner /> : children}
    </StyledButton>
  );
};

const StyledButton = styled.button<{
  variant: ButtonProps['variant'];
  size: ButtonProps['size'];
  disabled: boolean;
}>`
  ${({ variant, size, disabled }) => {
    const sizes = {
      small: '0.5rem 1rem',
      medium: '1rem 2rem',
      large: '1.5rem 3rem',
    };

    const variants = {
      primary: `
        background: #1890ff;
        color: #ffffff;
        border: none;
      `,
      secondary: `
        background: #ffffff;
        color: #1890ff;
        border: 1px solid #1890ff;
      `,
      ghost: `
        background: transparent;
        color: #1890ff;
        border: none;
      `,
      danger: `
        background: #ff4d4f;
        color: #ffffff;
        border: none;
      `,
    };

    return `
      padding: ${sizes[size]};
      ${variants[variant]};
      border-radius: 4px;
      font-size: 1rem;
      cursor: ${disabled ? 'not-allowed' : 'pointer'};
      opacity: ${disabled ? 0.5 : 1};
      transition: all 0.2s ease;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;

      &:hover:not(:disabled) {
        opacity: 0.8;
      }

      &:active:not(:disabled) {
        transform: scale(0.98);
      }

      &:focus-visible {
        outline: 2px solid #1890ff;
        outline-offset: 2px;
      }
    `;
  }}
`;

const Spinner = styled.span`
  display: inline-block;
  width: 1rem;
  height: 1rem;
  border: 2px solid #ffffff;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;
```

---

## Form Component with TanStack Query + Zod

### Full Implementation

```typescript
import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import styled from 'styled-components';
import { Form, Input, Button, notification } from 'antd';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/shared/api/generated';

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Confirm password is required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type FormData = z.infer<typeof schema>;

export const RegisterForm: FC = () => {
  const queryClient = useQueryClient();
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const registerMutation = useMutation({
    mutationFn: (data: Omit<FormData, 'confirmPassword'>) =>
      api.register(data),
    onSuccess: () => {
      notification.success({ message: 'Registration successful!' });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error) => {
      notification.error({
        message: 'Registration failed',
        description: error.message,
      });
    },
  });

  const onSubmit = (data: FormData) => {
    const { confirmPassword, ...registerData } = data;
    registerMutation.mutate(registerData);
  };

  return (
    <Wrapper>
      <Form onFinish={handleSubmit(onSubmit)} layout="vertical">
        <Form.Item
          label="Email"
          validateStatus={errors.email ? 'error' : ''}
          help={errors.email?.message}
        >
          <Input type="email" placeholder="your@email.com" />
        </Form.Item>

        <Form.Item
          label="Password"
          validateStatus={errors.password ? 'error' : ''}
          help={errors.password?.message}
        >
          <Input.Password placeholder="At least 8 characters" />
        </Form.Item>

        <Form.Item
          label="Confirm Password"
          validateStatus={errors.confirmPassword ? 'error' : ''}
          help={errors.confirmPassword?.message}
        >
          <Input.Password placeholder="Re-enter password" />
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          loading={registerMutation.isPending}
          disabled={registerMutation.isPending}
        >
          {registerMutation.isPending ? 'Registering...' : 'Register'}
        </Button>
      </Form>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  max-width: 400px;
  padding: 2rem;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;
```

---

## Table Component with MUI DataGrid

### Full Implementation

```typescript
import { FC } from 'react';
import { DataGrid, GridColDef, GridActionsCellItem } from '@mui/x-data-grid';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import styled from 'styled-components';
import { useUserList } from '@/features/user/api/useUserList';
import { useDeleteUser } from '@/features/user/api/useDeleteUser';
import { notification } from 'antd';

export const UserTable: FC = () => {
  const { data: users, isLoading, error } = useUserList();
  const deleteUserMutation = useDeleteUser();

  const handleDelete = (id: string) => {
    deleteUserMutation.mutate(id, {
      onSuccess: () => {
        notification.success({ message: 'User deleted successfully' });
      },
      onError: (error) => {
        notification.error({ message: 'Failed to delete user' });
      },
    });
  };

  const handleEdit = (id: string) => {
    // Navigate to edit page or open modal
    console.log('Edit user:', id);
  };

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'ID',
      width: 100,
    },
    {
      field: 'name',
      headerName: 'Name',
      width: 200,
      editable: false,
    },
    {
      field: 'email',
      headerName: 'Email',
      width: 250,
    },
    {
      field: 'role',
      headerName: 'Role',
      width: 150,
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      getActions: (params) => [
        <GridActionsCellItem
          key="edit"
          icon={<EditIcon />}
          label="Edit"
          onClick={() => handleEdit(params.row.id)}
        />,
        <GridActionsCellItem
          key="delete"
          icon={<DeleteIcon />}
          label="Delete"
          onClick={() => handleDelete(params.row.id)}
        />,
      ],
    },
  ];

  if (isLoading) {
    return <LoadingState>Loading users...</LoadingState>;
  }

  if (error) {
    return <ErrorState>Failed to load users</ErrorState>;
  }

  return (
    <Wrapper>
      <DataGrid
        rows={users || []}
        columns={columns}
        pageSizeOptions={[10, 25, 50]}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 10 },
          },
        }}
        checkboxSelection
        disableRowSelectionOnClick
        loading={deleteUserMutation.isPending}
      />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  height: 600px;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const LoadingState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 600px;
  color: #8c8c8c;
`;

const ErrorState = styled(LoadingState)`
  color: #ff4d4f;
`;
```

---

## Modal Component

### Full Implementation

```typescript
import { FC, useEffect } from 'react';
import { Modal, Button } from 'antd';
import styled from 'styled-components';

export interface ModalProps {
  /** Modal title */
  title: string;
  /** Modal is visible */
  open: boolean;
  /** Close handler */
  onClose: () => void;
  /** Confirm handler */
  onConfirm?: () => void;
  /** Modal content */
  children: React.ReactNode;
  /** Confirm button text */
  confirmText?: string;
  /** Cancel button text */
  cancelText?: string;
  /** Show confirm button */
  showConfirm?: boolean;
  /** Danger mode (red confirm button) */
  danger?: boolean;
}

export const ConfirmModal: FC<ModalProps> = ({
  title,
  open,
  onClose,
  onConfirm,
  children,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  showConfirm = true,
  danger = false,
}) => {
  const handleConfirm = () => {
    onConfirm?.();
    onClose();
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onClose();
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open, onClose]);

  return (
    <StyledModal
      title={title}
      open={open}
      onCancel={onClose}
      footer={showConfirm ? (
        <Footer>
          <Button onClick={onClose}>{cancelText}</Button>
          <Button
            type={danger ? 'primary' : 'default'}
            danger={danger}
            onClick={handleConfirm}
          >
            {confirmText}
          </Button>
        </Footer>
      ) : null}
      centered
      maskClosable
    >
      <Content>{children}</Content>
    </StyledModal>
  );
};

const StyledModal = styled(Modal)`
  .ant-modal-body {
    padding: 1.5rem;
  }
`;

const Content = styled.div`
  color: #595959;
  line-height: 1.6;
`;

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
`;
```

---

## API Hooks Pattern

### TanStack Query Hook with Error Handling

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/shared/api/generated';
import { notification } from 'antd';

// Query Hook
export const useUserList = (params?: UserListParams) => {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => api.getUsers(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

// Mutation Hook
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserRequest) => api.createUser(data),
    onMutate: async (newUser) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['users'] });

      // Snapshot previous value
      const previousUsers = queryClient.getQueryData(['users']);

      // Optimistically update
      queryClient.setQueryData(['users'], (old: User[] = []) => [
        ...old,
        { ...newUser, id: 'temp-id' },
      ]);

      return { previousUsers };
    },
    onError: (error, variables, context) => {
      // Rollback
      if (context?.previousUsers) {
        queryClient.setQueryData(['users'], context.previousUsers);
      }
      notification.error({ message: 'Failed to create user' });
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['users'] });
      notification.success({ message: 'User created successfully' });
    },
  });
};

// Delete Mutation
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      notification.success({ message: 'User deleted successfully' });
    },
    onError: () => {
      notification.error({ message: 'Failed to delete user' });
    },
  });
};
```

---

## Usage Notes

### When to Reference These Examples

- **New component development**: Review patterns before starting
- **Code review**: Compare against canonical patterns
- **Refactoring**: Ensure refactored code follows patterns
- **Onboarding**: Learn project conventions

### What to Adapt

- Rename components/functions to your use case
- Adjust props to match your requirements
- Update styling to match design
- Modify logic to fit your feature
- Add or remove validations as needed

### What to Keep

- Component structure (Props → FC → Styled)
- Error handling patterns
- TypeScript typing approach
- Form validation with Zod
- TanStack Query patterns
- Testing approach

## References

- `.cursor/rules/skills/react-patterns.md` — React patterns skill
- `.cursor/rules/skills/code-quality.md` — Code quality standards
- `.cursor/rules/skills/testing.md` — Testing patterns
- `.cursor/rules/skills/styling.md` — Styling patterns
