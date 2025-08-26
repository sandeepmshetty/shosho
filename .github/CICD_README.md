# CI/CD Documentation

This document describes the CI/CD setup for the ShoSho project.

## 🔄 Workflows Overview

### 1. **CI (Continuous Integration)** - `ci.yml`

Runs on every push and pull request to `main` and `develop` branches.

**Features:**

- **Backend Tests**: Unit tests, e2e tests, linting, type checking
- **Frontend Tests**: Build validation, linting, type checking
- **Database**: PostgreSQL and Redis services for testing
- **Security**: Trivy vulnerability scanning
- **Coverage**: Code coverage reports via Codecov

### 2. **CD (Continuous Deployment)** - `cd.yml`

Triggers after successful CI on `main` branch.

**Features:**

- **Docker Build**: Creates container images for backend and frontend
- **Registry**: Pushes to GitHub Container Registry (ghcr.io)
- **Staging**: Automatic deployment to staging environment
- **Production**: Manual approval required for production deployment
- **Notifications**: Success/failure notifications

### 3. **Pull Request** - `pr.yml`

Enhanced checks for pull requests.

**Features:**

- **Change Detection**: Identifies which components changed
- **Bundle Analysis**: Frontend bundle size impact analysis
- **Quality Gates**: Comprehensive code quality checks
- **PR Comments**: Automated summary comments on PRs

### 4. **Release** - `release.yml`

Triggers on version tags (`v*`).

**Features:**

- **GitHub Releases**: Automated release creation with changelog
- **Semantic Versioning**: Proper version tagging for container images
- **Production Deploy**: Automatic deployment of tagged releases

### 5. **Dependency Updates** - `dependency-update.yml`

Weekly automated dependency updates.

**Features:**

- **Automated Updates**: Uses `npm-check-updates` to update dependencies
- **Testing**: Runs tests to ensure compatibility
- **Pull Requests**: Creates PRs for dependency updates

### 6. **Environment Tests** - `environment-tests.yml`

Daily health checks and periodic testing of deployed environments.

**Features:**

- **Health Checks**: API and frontend availability tests
- **Performance Testing**: Load testing with k6
- **Security Scanning**: OWASP ZAP security tests
- **Monitoring**: Automated environment monitoring

## 🏗️ Setup Instructions

### 1. **Repository Secrets**

Configure the following secrets in your GitHub repository settings:

```bash
# Required for container registry
GITHUB_TOKEN                 # Automatically provided by GitHub

# Optional for enhanced features
CODECOV_TOKEN               # For code coverage reports
NEXT_PUBLIC_API_URL         # Frontend environment variable
NEXT_PUBLIC_APP_URL         # Frontend environment variable
```

### 2. **Environment Configuration**

Set up GitHub Environments:

- **staging**: For staging deployments
- **production**: For production deployments (with protection rules)

### 3. **Branch Protection**

Configure branch protection rules for `main`:

- Require status checks to pass
- Require pull request reviews
- Restrict pushes to main branch

## 🐳 Docker Setup

### Backend Dockerfile

- **Multi-stage build** for optimization
- **Node 20 Alpine** base image
- **Non-root user** for security
- **Health checks** included

### Frontend Dockerfile

- **Next.js standalone** output for smaller images
- **Static asset optimization**
- **Build-time environment variables**
- **Production-ready** configuration

## 📊 Monitoring & Quality Gates

### Quality Metrics

- **Test Coverage**: Minimum coverage thresholds
- **Bundle Size**: Frontend bundle size monitoring
- **Performance**: Response time thresholds
- **Security**: Vulnerability scanning

### Notifications

- **Slack/Discord**: Configure webhook URLs for notifications
- **Email**: GitHub notification settings
- **PR Comments**: Automated status updates

## 🚀 Deployment Strategy

### Staging Environment

- **Automatic**: Deploys on every push to `main`
- **Testing**: Full environment testing suite
- **Database**: Uses staging database

### Production Environment

- **Manual Approval**: Requires manual approval via GitHub Environments
- **Tagged Releases**: Only deploys tagged versions
- **Rollback**: Easy rollback via previous container images

## 🔧 Local Development

### Running Tests Locally

```bash
# Backend
cd backend
npm run test
npm run test:e2e

# Frontend
cd frontend
npm run lint
npm run type-check
npm run build
```

### Docker Build Locally

```bash
# Backend
docker build -t shosho-backend ./backend

# Frontend
docker build -t shosho-frontend ./frontend \
  --build-arg NEXT_PUBLIC_API_URL=http://localhost:3000 \
  --build-arg NEXT_PUBLIC_APP_URL=http://localhost:3001
```

## 📈 Best Practices

### Commit Messages

Follow conventional commits:

```
feat: add user authentication
fix: resolve login redirect issue
chore: update dependencies
docs: improve README
```

### Pull Requests

- Keep PRs focused and small
- Include tests for new features
- Update documentation when needed
- Wait for CI checks to pass

### Releases

- Use semantic versioning (v1.0.0)
- Include comprehensive changelog
- Test in staging before release
- Monitor production after deployment

## 🛠️ Troubleshooting

### Common Issues

**CI Fails on Dependencies**

```bash
# Clear npm cache
npm ci --cache .npm --prefer-offline
```

**Docker Build Issues**

```bash
# Check .dockerignore files
# Ensure proper file permissions
# Verify build context
```

**Environment Variable Issues**

```bash
# Check GitHub secrets configuration
# Verify environment variable names
# Test locally with .env files
```

### Getting Help

- Check workflow run logs in GitHub Actions
- Review error messages carefully
- Test changes locally before pushing
- Use GitHub Issues for persistent problems

---

This CI/CD setup provides a robust foundation for automated testing, building, and deployment while maintaining code quality and security standards.
