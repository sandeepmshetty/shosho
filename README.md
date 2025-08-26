# SHO-SHO

A comprehensive social media management platform with NestJS backend and Next.js frontend.

## ✨ Features

- **Multi-platform Integration**: Support for Twitter, Facebook, and Instagram
- **User Authentication**: JWT-based authentication system
- **Social Account Management**: Link and manage multiple social media accounts
- **Modern Tech Stack**: NestJS + Next.js + TypeORM + PostgreSQL
- **🚀 CI/CD Pipeline**: Comprehensive GitHub Actions workflows

## 🛠️ CI/CD Pipeline Status

This project includes a complete CI/CD pipeline with:
- ✅ **Continuous Integration**: Automated testing and code quality checks
- ✅ **Pull Request Analysis**: Bundle size analysis and change detection  
- ✅ **Security Scanning**: Vulnerability detection with Trivy
- ✅ **Multi-environment Support**: Development, staging, and production deployments

## Project Structure

```
shosho/
├── frontend/          # Next.js 15.4 Frontend Application
├── backend/          # NestJS 11 Backend Application
└── docker/          # Docker configuration files
```

## Tech Stack

### Frontend
- **Framework**: Next.js 15.4
- **Language**: TypeScript
- **State Management**: Redux Toolkit
- **Form Handling**: React Hook Form with Yup validation
- **HTTP Client**: Axios
- **GraphQL Client**: Apollo Client
- **Authentication**: JWT with js-cookie
- **UI Components**: React 19.1 with Lucide React icons

### Backend
- **Framework**: NestJS 11
- **Language**: TypeScript
- **API**: REST & GraphQL (Apollo)
- **Authentication**: JWT with Passport
- **Database**: PostgreSQL
- **Caching**: Redis

### Infrastructure
- **Database**: PostgreSQL 15 (Alpine)
- **Cache**: Redis 7 (Alpine)
- **Containerization**: Docker & Docker Compose
- **Monitoring**: Grafana & Prometheus

## Getting Started

### Prerequisites
- Node.js
- Docker and Docker Compose
- pnpm (recommended) or npm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/sandeepmshetty/shosho.git
   cd shosho
   ```

2. Start the infrastructure:
   ```bash
   docker-compose up -d
   ```

3. Install frontend dependencies:
   ```bash
   cd frontend
   pnpm install
   ```

4. Install backend dependencies:
   ```bash
   cd backend
   pnpm install
   ```

### Development

1. Start the backend:
   ```bash
   cd backend
   pnpm start:dev
   ```

2. Start the frontend:
   ```bash
   cd frontend
   pnpm dev
   ```

The frontend will be available at `http://localhost:3000` and the backend at `http://localhost:3001`.

## Available Scripts

### Frontend
- `pnpm dev`: Start development server with Turbopack
- `pnpm build`: Build for production
- `pnpm start`: Start production server
- `pnpm lint`: Run ESLint
- `pnpm type-check`: Run TypeScript type checking

### Backend
- `pnpm start:dev`: Start development server
- `pnpm start:debug`: Start server in debug mode
- `pnpm start:prod`: Start production server
- `pnpm test`: Run tests
- `pnpm test:e2e`: Run end-to-end tests
- `pnpm test:cov`: Generate test coverage

## Infrastructure

The project includes:
- PostgreSQL database with multiple database support
- Redis for caching and session management
- Grafana for monitoring and visualization
- Prometheus for metrics collection

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private and unlicensed.