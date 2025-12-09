# Production Readiness Audit - Multi-Agent Approach

## Description
A comprehensive production readiness audit using 9 parallel specialized agents to analyze every aspect of a codebase simultaneously. This approach provides thorough coverage in minimal time.

## When to Use
- Before deploying an application to production
- When taking over a new codebase
- For periodic security and quality reviews
- When preparing for a major release

## The 9 Audit Agents

Launch all agents in parallel using the Task tool with `subagent_type: "Explore"`.

---

### Agent 1: Security Audit

**Description:** Security audit

**Prompt:**
Perform a thorough SECURITY AUDIT of this codebase. Check for:
1. Authentication implementation - is it complete and secure?
2. Authorization/permissions - are all routes properly protected?
3. API key/secret handling - are they properly secured and not exposed?
4. XSS vulnerabilities in React components
5. CSRF protection
6. Input sanitization and validation
7. Secure headers configuration
8. Any hardcoded credentials or secrets
9. Environment variable usage for sensitive data
10. Third-party auth (OAuth, etc.) implementation security

Search through all relevant files including auth, middleware, API routes, components handling user input, and configuration files. Report any security issues or missing security measures that need to be addressed before production.

---

### Agent 2: Error Handling Audit

**Description:** Error handling audit

**Prompt:**
Perform a thorough ERROR HANDLING AND LOGGING audit of this codebase. Check for:
1. Global error boundaries in React
2. API error handling - are all API calls properly wrapped with try/catch?
3. User-friendly error messages vs technical errors exposed to users
4. Logging implementation - is there proper logging for debugging?
5. Error tracking integration (Sentry, LogRocket, etc.)
6. Network error handling and retry logic
7. Form validation error handling
8. Loading states and error states for async operations
9. 404 and other HTTP error pages
10. Unhandled promise rejections

Search through components, API handlers, utilities, and configuration. Report any gaps in error handling that could cause issues in production.

---

### Agent 3: Environment Configuration Audit

**Description:** Environment config audit

**Prompt:**
Perform a thorough ENVIRONMENT AND CONFIGURATION audit of this codebase. Check for:
1. Environment variables - are all required ones documented?
2. .env.example or similar template file existence
3. Different configs for dev/staging/production
4. Feature flags implementation
5. API endpoints configuration (hardcoded vs env vars)
6. Build configuration (next.config.js, vite.config, etc.)
7. Database connection configuration
8. Third-party service configurations (payment, email, etc.)
9. CORS configuration
10. Any TODO comments or placeholder values that need to be replaced

Search through config files, env files, and any hardcoded URLs/values. Report anything that needs attention before production deployment.

---

### Agent 4: API Validation Audit

**Description:** API validation audit

**Prompt:**
Perform a thorough API AND DATA VALIDATION audit of this codebase. Check for:
1. API route completeness - are all necessary endpoints implemented?
2. Request validation (Zod, Yup, or similar)
3. Response typing and consistency
4. Rate limiting implementation
5. API versioning strategy
6. Database schema completeness
7. Data models and types coverage
8. Form validation on both client and server
9. File upload validation and limits
10. Pagination implementation for list endpoints

Search through API routes, schemas, types, and form components. Report any incomplete or missing validation that needs to be added.

---

### Agent 5: Performance Audit

**Description:** Performance audit

**Prompt:**
Perform a thorough PERFORMANCE AND OPTIMIZATION audit of this codebase. Check for:
1. Image optimization (next/image, lazy loading, etc.)
2. Code splitting and dynamic imports
3. Bundle size optimization
4. Caching strategies (API responses, static assets)
5. Database query optimization (N+1 queries, indexes)
6. Memoization usage (useMemo, useCallback, React.memo)
7. Virtual scrolling for long lists
8. Debouncing/throttling for expensive operations
9. SSR/SSG usage where appropriate
10. Web Vitals optimization (LCP, FID, CLS)

Search through components, API handlers, and configuration. Report any performance issues or missing optimizations.

---

### Agent 6: Testing Quality Audit

**Description:** Testing quality audit

**Prompt:**
Perform a thorough TESTING AND QUALITY audit of this codebase. Check for:
1. Test file existence and coverage (unit, integration, e2e)
2. Testing framework setup (Jest, Vitest, Playwright, Cypress)
3. CI/CD pipeline configuration
4. Linting configuration (ESLint)
5. Type checking (TypeScript strict mode)
6. Pre-commit hooks (Husky, lint-staged)
7. Code formatting (Prettier)
8. Test scripts in package.json
9. Mock data and test utilities
10. Coverage reports configuration

Search through test files, config files, and CI/CD configs. Report the current state of testing and what's missing for production readiness.

---

### Agent 7: UI/UX Completeness Audit

**Description:** UI/UX completeness audit

**Prompt:**
Perform a thorough UI/UX COMPLETENESS audit of this codebase. Check for:
1. All pages/routes implemented and working
2. Responsive design implementation
3. Loading states for all async operations
4. Empty states for lists/data
5. Accessibility (a11y) - ARIA labels, keyboard navigation
6. Dark mode support if applicable
7. Toast/notification system
8. Modal/dialog implementations
9. Form UX (validation feedback, submit states)
10. Navigation and routing completeness
11. Legal pages (Privacy Policy, Terms of Service, etc.)
12. 404 and error pages

Search through pages, components, and styles. Report any incomplete UI elements or missing UX features.

---

### Agent 8: Deployment Infrastructure Audit

**Description:** Deployment infra audit

**Prompt:**
Perform a thorough DEPLOYMENT AND INFRASTRUCTURE audit of this codebase. Check for:
1. Dockerfile or container configuration
2. Deployment platform configuration (Vercel, AWS, etc.)
3. Build scripts and optimization
4. Static asset handling
5. CDN configuration
6. SSL/HTTPS configuration references
7. Domain and DNS setup references
8. Health check endpoints
9. Monitoring and alerting setup
10. Backup and recovery considerations
11. Scalability configuration
12. Any deployment checklists or documentation

Search through deployment configs, scripts, and documentation. Report what's in place and what's missing for production deployment.

---

### Agent 9: Business Features Audit

**Description:** Business features audit

**Prompt:**
Perform a thorough BUSINESS LOGIC AND FEATURES audit of this codebase. Check for:
1. Core feature completeness - what are the main features and are they complete?
2. Payment/subscription implementation if applicable
3. User management features (profile, settings, etc.)
4. Email/notification features
5. File upload/storage features
6. Search functionality
7. Analytics integration
8. Social features if applicable
9. Admin/dashboard features
10. Any incomplete or TODO features in the codebase

Search through all feature-related code, looking for incomplete implementations, TODO comments, commented-out code, or placeholder functionality. Report what features exist and their completion status.

---

## Execution Steps

1. **Launch all 9 agents in parallel** using the Task tool
   - Use `subagent_type: "Explore"` for each agent
   - Each agent runs independently and concurrently
   - All agents search through the entire codebase

2. **Wait for all agents to complete**
   - Each agent returns a detailed report
   - Reports include file locations, line numbers, and specific findings

3. **Compile findings into categories**
   - Critical blockers (must fix before production)
   - High priority (should fix soon)
   - Medium priority (nice to have)
   - What's working well

4. **Generate action plan**
   - Prioritize fixes by severity
   - Group related issues into phases
   - Estimate effort for each phase

5. **Create audit report**
   - Write comprehensive PRODUCTION_AUDIT_REPORT.md
   - Include all findings with file references
   - Add recommended action plan with phases

## Output Format

### Summary Table
| Category | Score | Status |
|----------|-------|--------|
| Security | X/100 | Status |
| Error Handling | X/100 | Status |
| ... | ... | ... |

### Critical Blockers
List issues that MUST be fixed before production.

### High Priority Issues
List issues that SHOULD be fixed before production.

### Medium Priority Issues
List issues that are nice to fix but not blocking.

### What's Working Well
List areas that are production-ready.

### Action Plan
Phased approach with estimated timelines.

---

## Example Usage

When user asks: "Audit this app for production readiness" or "Is this app ready for production?"

1. Launch all 9 Task agents in parallel
2. Wait for all results
3. Compile into structured report
4. Create PRODUCTION_AUDIT_REPORT.md
5. Commit to repository
6. Provide summary to user

---

## Notes

- All agents use `subagent_type: "Explore"` for thorough codebase analysis
- Agents run in parallel for speed (typically 1-2 minutes total)
- Each agent searches files, reads code, and provides detailed findings
- Results should be compiled into a single actionable report
