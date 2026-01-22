# Table Patterns

> **Note:** This document covers Material React Table (MRT) patterns as an alternative reference. The primary table implementation for this project uses Ant Design Table (see ADR-005). Use these patterns for understanding MRT if needed, but prefer Ant Design for new features.

> Material React Table (MRT) patterns with server-side pagination

## Basic Table with Pagination

```tsx
import { useMemo, useState } from 'react'
import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table'
import type { MRT_ColumnDef, MRT_PaginationState, MRT_SortingState } from 'material-react-table'
import type { RouteDTO } from 'shared/api'

export const RoutesTable: FC = () => {
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const [sorting, setSorting] = useState<MRT_SortingState>([])

  const { data, isFetching } = useQuery({
    queryKey: ['routes', pagination, sorting],
    queryFn: () =>
      getAllRoutes({
        pagination: {
          pageNumber: pagination.pageIndex,
          pageSize: pagination.pageSize,
        },
        sort: sorting[0],
      }),
    placeholderData: keepPreviousData,
  })

  const columns = useMemo<MRT_ColumnDef<RouteDTO>[]>(
    () => [
      {
        accessorKey: 'routeNumber',
        header: 'Route Number',
        size: 150,
      },
      {
        accessorKey: 'originPort',
        header: 'Origin',
        size: 200,
      },
      {
        accessorKey: 'destinationPort',
        header: 'Destination',
        size: 200,
      },
    ],
    [],
  )

  const table = useMaterialReactTable({
    columns,
    data: data?.items ?? [],
    rowCount: data?.totalCount ?? 0,
    state: {
      pagination,
      sorting,
      isLoading: isFetching,
    },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    manualPagination: true,
    manualSorting: true,
    enableRowSelection: true,
    enableColumnFilters: false,
  })

  return <MaterialReactTable table={table} />
}
```

## Table with Row Actions

```tsx
const table = useMaterialReactTable({
  columns,
  data: data?.items ?? [],
  enableRowActions: true,
  renderRowActions: ({ row }) => (
    <Box sx={{ display: 'flex', gap: '8px' }}>
      <IconButton onClick={() => handleView(row.original.id)}>
        <VisibilityOutlined />
      </IconButton>
      <IconButton onClick={() => handleEdit(row.original.id)}>
        <EditOutlined />
      </IconButton>
      <IconButton onClick={() => handleDelete(row.original.id)}>
        <DeleteOutlined />
      </IconButton>
    </Box>
  ),
})
```

## Table with Custom Cell Rendering

```tsx
const columns = useMemo<MRT_ColumnDef<CargoStatusDto>[]>(
  () => [
    {
      accessorKey: 'status',
      header: 'Status',
      Cell: ({ cell }) => {
        const status = cell.getValue<string>()
        const color = status === 'Active' ? 'success' : 'default'
        return <Tag color={color}>{status}</Tag>
      },
    },
    {
      accessorKey: 'laycan',
      header: 'Laycan',
      Cell: ({ row }) => {
        const from = row.original.laycanFrom
        const to = row.original.laycanTo
        return `${dayjs(from).format('DD.MM.YYYY')} - ${dayjs(to).format('DD.MM.YYYY')}`
      },
    },
  ],
  [],
)
```

## Table with Export

```tsx
import { Download } from '@mui/icons-material'

const handleExport = () => {
  const csv = generateCsv(csvConfig)(data?.items ?? [])
  download(csvConfig)(csv)
}

const table = useMaterialReactTable({
  columns,
  data: data?.items ?? [],
  renderTopToolbarCustomActions: () => (
    <Button onClick={handleExport} startIcon={<Download />} variant="outlined">
      Export to CSV
    </Button>
  ),
})
```

## Related Docs

- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — Table Patterns
- [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) — MRT Configuration
