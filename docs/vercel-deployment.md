# Vercel Deployment Guide - Best Practices

## Configuration Overview

This guide documents the optimized Vercel deployment configuration for the NestJS Multi-Tenant SaaS API.

### Key Configurations Implemented

#### 1. **Build Configuration**
- **buildCommand**: `npm run build` - Explicit NestJS build step
- **outputDirectory**: `dist` - Compiled JavaScript output
- **NODE_OPTIONS**: `--max-old-space-size=3008` - Optimizes Node.js memory for faster builds

#### 2. **Function Configuration**
```json
{
  "maxDuration": 30,      // Timeout: 30 seconds (sufficient for API operations)
  "memory": 1024          // 1024 MB memory allocation
}
```

**Why these values?**
- **30s timeout**: Suitable for database queries and API operations. Increase to 60s for long-running operations.
- **1024 MB**: Sufficient for NestJS + PostgreSQL connection pooling. Standard for serverless APIs.

#### 3. **Security Headers**

All responses include:
- `X-Content-Type-Options: nosniff` - Prevent MIME-type sniffing
- `X-Frame-Options: DENY` - Prevent clickjacking
- `X-XSS-Protection: 1; mode=block` - XSS protection
- `Referrer-Policy: strict-origin-when-cross-origin` - Control referrer information
- `Permissions-Policy` - Disable unnecessary browser features (geolocation, microphone, camera)

#### 4. **Caching Strategy**

- **API routes** (`/api/*`): `public, s-maxage=3600, stale-while-revalidate=86400`
  - 1 hour server cache, 24 hours stale cache
  - **Warning**: Only cache GET requests for data that doesn't change frequently
  - Disable for user-specific or real-time data

- **Swagger docs** (`/docs`): `public, s-maxage=3600`
  - 1 hour cache

#### 5. **Clean URLs**

- `cleanUrls: true` - Serve `/api/users` instead of `/api/users.js`
- `trailingSlash: false` - Redirect `/api/users/` to `/api/users`

## Environment Variables

### Required Environment Variables

Create a `.env.production` file with:

```env
# Application
NODE_ENV=production
APP_ENV=production
APP_URL=https://your-domain.com
APP_NAME=YourApp
APP_HEADER_LANGUAGE=x-custom-lang

# API Configuration
API_PREFIX=/api/v1

# Database (PostgreSQL)
DATABASE_TYPE=postgres
DATABASE_HOST=your-postgres-host.com
DATABASE_PORT=5432
DATABASE_NAME=your_db
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your_secure_password

# JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRATION_TIME=3600
JWT_REFRESH_SECRET=your_refresh_secret_key
JWT_REFRESH_EXPIRATION_TIME=2592000

# AWS S3 (if using file uploads)
AWS_S3_REGION=us-east-1
AWS_S3_ACCESS_KEY_ID=your_access_key
AWS_S3_SECRET_ACCESS_KEY=your_secret_key
AWS_S3_BUCKET_NAME=your-bucket-name

# Email Configuration
MAIL_HOST=smtp.sendgrid.net
MAIL_PORT=587
MAIL_USER=apikey
MAIL_PASSWORD=your_sendgrid_api_key
MAIL_FROM_ADDRESS=noreply@your-domain.com
MAIL_FROM_NAME=YourApp

# Redis (if using sessions/caching)
REDIS_HOST=your-redis-host.com
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password

# Optional: Sentry for error tracking
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
```

### Setting Environment Variables in Vercel

1. Go to **Project Settings** → **Environment Variables**
2. Add each variable above
3. Select environments: **Production**, **Preview**, **Development** (as needed)
4. Deploy

## Deployment Steps

### 1. Initial Setup

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Link your project
vercel link
```

### 2. Pre-Deployment Checklist

```bash
# Ensure code builds locally
npm run build

# Run tests
npm run test
npm run test:e2e

# Check for environment variables
ls -la .env.production  # Should exist and be gitignored

# Lint code
npm run lint
```

### 3. Deploy

```bash
# Deploy to production
vercel --prod

# Deploy to preview (staging)
vercel
```

### 4. Verify Deployment

- Check logs: `vercel logs`
- Test API endpoints
- Verify database connectivity
- Check Swagger docs: `https://your-domain.com/docs`

## Database Connection Management

### PostgreSQL with Connection Pooling

For serverless environments, **connection pooling is critical**:

```typescript
// src/database/data-source.ts
import { DataSource, DataSourceOptions } from 'typeorm';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT, 10),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: ['src/**/*.entity{.ts,.js}'],
  migrations: ['src/database/migrations/*{.ts,.js}'],
  migrationsRun: false, // Run migrations manually
  synchronize: false,   // Never auto-sync in production
  logging: process.env.NODE_ENV === 'development',
  poolSize: 5,          // PgBouncer or connection pooler recommended
  extra: {
    max: 5,             // Maximum pool connections
    min: 1,             // Minimum pool connections
    idleTimeoutMillis: 30000,  // Close idle connections
    connectionTimeoutMillis: 2000,
  },
};
```

### Recommended: Use PgBouncer or Vercel Postgres

For production, use one of:
- **Vercel Postgres** (built-in, recommended)
- **Neon** (serverless PostgreSQL)
- **Supabase** (with PgBouncer)

These provide connection pooling out-of-the-box.

## Performance Optimization

### 1. Bundle Size Optimization

```bash
# Analyze bundle size
npm install --save-dev webpack-bundle-analyzer

# Add to package.json scripts:
"analyze": "nest build --webpack-path ./webpack.config.js"
```

### 2. Cold Start Reduction

- Keep dependencies minimal
- Use tree-shaking: Enable in `tsconfig.json` via Nest CLI
- Lazy-load modules where possible

### 3. Database Query Optimization

```typescript
// ❌ Avoid N+1 queries
const users = await this.usersRepository.find();
users.forEach(user => user.company); // Extra query per user

// ✅ Use eager loading
const users = await this.usersRepository.find({
  relations: ['company', 'tenants'],
  skip: 0,
  take: 20,
});
```

### 4. Response Compression

Vercel automatically handles gzip compression. Verify in response headers:

```bash
curl -i https://your-domain.com/api/health | grep -i "content-encoding"
# Should see: Content-Encoding: gzip
```

## Monitoring & Logging

### 1. Enable Structured Logging

```typescript
// src/main.ts
import { Logger } from '@nestjs/common';

const logger = new Logger('NestApplication');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalFilters(new AllExceptionsFilter());
  
  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  logger.log(`Application running on http://localhost:${port}`);
  logger.log(`Environment: ${process.env.NODE_ENV}`);
}
```

### 2. Error Tracking (Sentry)

```bash
npm install @sentry/node @sentry/integrations
```

```typescript
// src/main.ts
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1, // 10% for production
});

// Use in filters
app.useGlobalFilters(new SentryExceptionFilter());
```

### 3. Monitor Deployments

Access via Vercel Dashboard:
- **Deployments** tab: See all deployments
- **Function** logs: Real-time execution logs
- **Analytics**: Request metrics, latency, errors

## Security Best Practices

### 1. Environment Variables

- ✅ Store secrets in Vercel project settings
- ✅ Use different values for staging vs. production
- ✅ Rotate secrets regularly
- ❌ Never commit `.env.production` to Git

### 2. Database Access

```typescript
// src/database/data-source.ts

// ✅ Use environment variables
const dataSource = new DataSource({
  host: process.env.DATABASE_HOST,     // From Vercel env vars
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  // ...
});

// ❌ Avoid hardcoding
// host: 'postgres.example.com',
```

### 3. API Rate Limiting

```bash
npm install @nestjs/throttler
```

```typescript
// src/app.module.ts
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000,        // 1 minute
        limit: 100,        // 100 requests per minute
      },
    ]),
  ],
})
export class AppModule {}
```

### 4. CORS Configuration

```typescript
// src/main.ts
const app = await NestFactory.create(AppModule, {
  cors: {
    origin: process.env.CORS_ORIGIN?.split(',') || ['https://your-domain.com'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-custom-lang'],
  },
});
```

## Troubleshooting

### Issue: "Cannot find module '@app/...' on Vercel"

**Error**:
```
Cannot find module '@app/companies/companies.service'
```

**Solution**: Path aliases need to be registered at runtime.

**Steps**:
1. ✅ Ensure `src/main.ts` imports `tsconfig-paths/register` first:
```typescript
import 'dotenv/config';
import 'tsconfig-paths/register';  // Must be before other imports
import { NestFactory } from '@nestjs/core';
// ... rest of imports
```

2. ✅ Configure `nest-cli.json` for webpack:
```json
{
  "compilerOptions": {
    "builder": "webpack",
    "webpack": true,
    "webpackConfigPath": "webpack.config.js",
    "tsConfigPath": "tsconfig.build.json"
  }
}
```

3. ✅ Create `webpack.config.js`:
```javascript
export default (options, webpack) => ({
  ...options,
  output: { ...options.output, filename: 'main.js' },
  plugins: [
    ...options.plugins,
    new webpack.IgnorePlugin({
      checkResource(resource) {
        return [
          '@nestjs/microservices/microservices-module',
          '@nestjs/websockets/socket-module',
        ].includes(resource) ? !tryResolve(resource) : false;
      },
    }),
  ],
});

function tryResolve(module) {
  try {
    require.resolve(module);
    return true;
  } catch {
    return false;
  }
}
```

4. ✅ Ensure `tsconfig.json` has proper paths:
```json
{
  "compilerOptions": {
    "baseUrl": "./",
    "paths": { "@app/*": ["src/*"] }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "test", "dist"]
}
```

5. ✅ Update `vercel.json` to remove `.env.production` from includeFiles (it's not needed):
```json
{
  "builds": [{
    "config": {
      "includeFiles": ["dist/**", "node_modules/**"]
    }
  }]
}
```

6. ✅ Rebuild and deploy:
```bash
npm run build
vercel --prod
```

**Why this works**: `tsconfig-paths/register` registers the TypeScript path aliases with Node.js at runtime, allowing the compiled JavaScript to resolve `@app/*` imports correctly.

### Issue: Cold Start Time Too Long

**Solution**:
1. Reduce bundle size
2. Increase function memory in `vercel.json` (max 3008 MB)
3. Use SWC compiler: `nest start -b swc`

### Issue: Database Connection Timeout

**Solution**:
1. Verify network connectivity: Can Vercel reach your database?
2. Check connection pool settings
3. Use Vercel Postgres or Neon with built-in pooling
4. Increase `connectionTimeoutMillis` in DataSource config

### Issue: Environment Variables Not Loading

**Solution**:
```bash
# Verify in Vercel logs
vercel logs --tail

# Check env vars in deployment
vercel env list
vercel env pull  # Pull to local .env.local
```

### Issue: 413 Payload Too Large

**Solution**:
```typescript
// src/main.ts
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
```

## Rollback & Recovery

### Rollback to Previous Deployment

```bash
# List recent deployments
vercel ls

# Rollback to specific deployment
vercel rollback <deployment-url>

# Or via Vercel Dashboard: Deployments → Select previous → Promote to Production
```

### Database Migrations

Always run migrations manually before new deployments:

```bash
# Production
vercel env pull .env.production
npm run migration:run -- --dataSource=src/database/data-source.ts
```

## Scaling Considerations

- **Automatic scaling**: Vercel scales functions automatically
- **Concurrency limit**: Default is sufficient for most APIs
- **Monitor function duration**: Keep under 30 seconds
- **Use caching**: Reduce database calls with Redis or in-memory cache

## Additional Resources

- [Vercel Node.js Documentation](https://vercel.com/docs/frameworks/nextjs)
- [NestJS Production Deployment](https://docs.nestjs.com/deployment)
- [TypeORM Connection Pooling](https://typeorm.io/data-source-options)
- [OWASP Security Headers](https://owasp.org/www-project-secure-headers/)
