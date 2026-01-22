# Domain Terms

> Quick reference for Shipping & Freight domain terminology

## Core Entities

| Term              | Description                                                       |
| ----------------- | ----------------------------------------------------------------- |
| **Cargo**         | Goods transported by sea (Urea, Ammonia, Fertilizer)              |
| **Cargo Request** | Request for cargo transportation with ports, dates, cargo details |
| **Route**         | Shipping route from origin to destination port                    |
| **Voyage**        | Single journey of a vessel from loading to discharge port         |
| **Freight Rate**  | Cost of transportation per unit (MT, voyage)                      |
| **Vessel**        | Ship used for cargo transportation                                |
| **Counterparty**  | Business partner (carrier, charterer, shipowner)                  |

## Port Terms

| Term                  | Description                                        |
| --------------------- | -------------------------------------------------- |
| **Port of Loading**   | Port where cargo is loaded onto vessel             |
| **Port of Discharge** | Port where cargo is unloaded from vessel           |
| **Laycan**            | Laytime and Cancelling date range (loading window) |
| **Laycan From**       | Earliest date cargo can be loaded                  |
| **Laycan To**         | Latest date cargo can be loaded                    |
| **Berth**             | Specific docking location within a port            |

## Voyage Terms

| Term                 | Description                                       |
| -------------------- | ------------------------------------------------- |
| **Voyage Itinerary** | Sequence of ports in voyage (loading → discharge) |
| **Commence Date**    | Date when voyage started                          |
| **Complete Date**    | Date when voyage completed                        |
| **Laytime**          | Time allowed for loading/unloading cargo          |
| **Demurrage**        | Penalty for exceeding laytime                     |
| **Despatch**         | Bonus for completing faster than laytime          |

## Status Terms

| Term           | Description                                |
| -------------- | ------------------------------------------ |
| **Draft**      | Request not yet submitted                  |
| **Active**     | Request is active and being processed      |
| **In Transit** | Cargo is currently being transported       |
| **At Port**    | Vessel is at port (loading or discharging) |
| **Delivered**  | Cargo has been delivered to destination    |
| **Completed**  | Request/voyage is completed                |

## Business Process

| Term               | Description                                 |
| ------------------ | ------------------------------------------- |
| **Request Packet** | Group of related cargo requests             |
| **Request Number** | Unique identifier for cargo request         |
| **PSP Month**      | Planning month for cargo request            |
| **Freight Trader** | Person responsible for freight trading      |
| **Candidate**      | Vessel candidate offered for transportation |

## IMOS Terms

| Term                  | Description                                        |
| --------------------- | -------------------------------------------------- |
| **IMOS Ports**        | International Maritime Organization ports database |
| **IMOS Cargo**        | IMOS cargo types and classifications               |
| **IMOS Counterparty** | IMOS counterparty database                         |
| **IMOS Vessel Type**  | Vessel type classifications                        |

## Rate & Pricing

| Term             | Description                                    |
| ---------------- | ---------------------------------------------- |
| **Freight Rate** | Cost per unit (MT, voyage)                     |
| **Rate Unit**    | Unit for rate calculation (per MT, per voyage) |
| **Currency**     | Currency for freight rate (USD, EUR)           |
| **Charterer**    | Party that hires the vessel                    |
| **Shipowner**    | Party that owns the vessel                     |

## Quick Examples

```typescript
// Cargo Request
interface CargoRequestPacketDto {
  requestNumber: string // "REQ-2024-001"
  pspMonth: string // "2024-03"
  status: 'Draft' | 'Active' // Current status
  cargos: CargoDto[] // Multiple cargo items
}

// Cargo
interface CargoDto {
  cargoType: string // "Urea"
  quantity: number // 50000
  rateUnit: string // "MT"
  laycanFrom: Date // 2024-03-15
  laycanTo: Date // 2024-03-20
}

// Route
interface RouteDTO {
  routeNumber: string // "ROUTE-001"
  originPort: string // "Rotterdam"
  destinationPort: string // "Santos"
  freightRates: FreightRateDto[]
}

// Voyage
interface VoyageDto {
  voyageNumber: string // "VOY-2024-001"
  commenceDate: Date // 2024-03-15
  completeDate: Date // 2024-04-10
  status: 'In Transit' // Current status
  itinerary: VoyageItineraryDto[]
}
```

## Related Docs

- [docs/DOMAIN.md](docs/DOMAIN.md) — Full Business Domain Documentation
- [docs/API-MAP.md](docs/API-MAP.md) — API DTOs
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — Domain Glossary
