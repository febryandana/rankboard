# RankBoard Deployment Guide

This guide provides comprehensive instructions for deploying RankBoard, a challenges scoring and leaderboard platform, to production environments using Docker Compose or traditional NPM + Nginx setup.

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Prerequisites](#2-prerequisites)
3. [Quick Start](#3-quick-start)
4. [Docker Compose Deployment](#4-docker-compose-deployment)
5. [NPM + Nginx Deployment](#5-npm--nginx-deployment)
6. [Environment Configuration](#6-environment-configuration)
7. [Database Setup](#7-database-setup)
8. [SSL/TLS Configuration](#8-ssltls-configuration)
9. [Security Considerations](#9-security-considerations)
10. [Monitoring & Logging](#10-monitoring--logging)
11. [Backup Strategy](#11-backup-strategy)
12. [Scaling Considerations](#12-scaling-considerations)
13. [Troubleshooting](#13-troubleshooting)

---

## 1. Project Overview

### Architecture

RankBoard is a full-stack web application consisting of:

- **Frontend**: React 18 + TypeScript SPA served by Nginx
- **Backend**: Node.js 18+ Express API with SQLite database
- **Database**: SQLite3 with file-based storage
- **File Storage**: Local filesystem for user uploads (avatars, submissions)

### Project Structure

```
rankboard/
├── backend/                 # Express.js API server
│   ├── src/                # Source code
│   ├── package.json        # Dependencies and scripts
│   ├── Dockerfile         # Backend container config
│   └── uploads/           # User uploaded files
├── frontend/               # React SPA
│   ├── src/               # Source code
│   ├── package.json       # Dependencies and scripts
│   ├── Dockerfile        # Frontend container config
│   └── nginx.conf        # Nginx configuration
├── docker-compose.yml     # Multi-service orchestration
├── .env.example          # Environment variables template
└── docs/                 # Documentation
```

### Key Components

- **Authentication**: Session-based with role-based access (admin/user)
- **Challenges Management**: CRUD operations for challenges
- **File Uploads**: PDF submissions and avatar images
- **Scoring System**: Multi-admin scoring with aggregate leaderboards
- **Real-time Updates**: Leaderboard updates after scoring

---

## 2. Prerequisites

### System Requirements

- **Docker & Docker Compose** (recommended)
  - Docker Engine 20.0+
  - Docker Compose v2.0+
  - Minimum 2GB RAM, 2 CPU cores

- **Manual Setup** (alternative)
  - Node.js 18+ LTS
  - npm 9+
  - Nginx 1.20+
  - Ubuntu 20.04+/CentOS 8+/Debian 11+

### Network Requirements

- Domain name (recommended for production)
- SSL certificate (Let's Encrypt or commercial)
- Firewall configured for ports 80/443
- DNS configured to point to server IP

### Security Prerequisites

- SSH key-based authentication
- Firewall (ufw/firewalld)
- Fail2ban for SSH protection
- Regular system updates

---

## 3. Quick Start

### Docker Compose (Recommended)

```bash
# Clone repository
git clone <repository-url>
cd rankboard

# Configure environment (optional)
cp .env.example .env
# Edit .env with your settings

# Deploy
docker-compose up -d

# Access application
# Frontend: http://your-server:8080
# API: http://your-server:3000/api
```

### Manual Setup

```bash
# Backend setup
cd backend
npm ci --production
npm run build
npm start &

# Frontend setup
cd ../frontend
npm ci --production
npm run build

# Configure Nginx (see section 5)
sudo cp nginx.conf /etc/nginx/sites-available/rankboard
sudo ln -s /etc/nginx/sites-available/rankboard /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

---

## 4. Docker Compose Deployment

### Production Configuration

The `docker-compose.yml` file is optimized for production with:

- **Multi-stage builds** for minimal image sizes
- **Health checks** for service monitoring
- **Named volumes** for persistent data
- **Network isolation** between services
- **Resource limits** and restart policies

### Service Architecture

```yaml
services:
  backend:
    # Node.js API server
    # - Port 3000 internal
    # - Health check via API endpoint
    # - Persistent volumes for uploads/db

  frontend:
    # Nginx serving React SPA
    # - Port 8080 external -> 80 internal
    # - Proxies API calls to backend
    # - Serves static assets with caching
```

### Deployment Steps

1. **Clone and Configure**

   ```bash
   git clone <repository-url>
   cd rankboard
   cp .env.example .env
   # Edit .env with production values
   ```

2. **Environment Variables**

   ```bash
   # .env file
   SESSION_SECRET=your-production-secret-here
   ROOT_ADMIN_USERNAME=admin
   ROOT_ADMIN_EMAIL=admin@yourdomain.com
   ROOT_ADMIN_PASSWORD=SecurePassword123!
   ```

3. **Build and Deploy**

   ```bash
   # Build images
   docker-compose build

   # Start services
   docker-compose up -d

   # Verify deployment
   docker-compose ps
   docker-compose logs -f
   ```

4. **Access Application**
   - Frontend: `http://your-server:8080`
   - Backend API: `http://your-server:3000/api`
   - Health check: `http://your-server:8080/health`

### Docker Commands

```bash
# View service status
docker-compose ps

# View logs
docker-compose logs -f [service-name]

# Restart services
docker-compose restart

# Update deployment
docker-compose pull && docker-compose up -d

# Stop and cleanup
docker-compose down
docker-compose down -v  # Remove volumes
```

### Volume Management

```bash
# List volumes
docker volume ls

# Inspect volume data
docker run --rm -v rankboard_backend-uploads:/data alpine ls -la /data

# Backup volumes
docker run --rm -v rankboard_backend-database:/db -v $(pwd):/backup alpine tar czf /backup/db-backup.tar.gz -C /db .
```

---

## 5. NPM + Nginx Deployment

### Backend Deployment

1. **Setup Production Environment**

   ```bash
   # Create production directory
   sudo mkdir -p /opt/rankboard/backend
   cd /opt/rankboard/backend

   # Clone or copy backend code
   git clone <repository-url> .
   # OR copy from development

   # Install production dependencies
   npm ci --production

   # Build TypeScript
   npm run build
   ```

2. **Environment Configuration**

   ```bash
   # Create .env file
   cp .env.example .env
   nano .env

   # Production settings
   NODE_ENV=production
   PORT=3000
   SESSION_SECRET=your-secure-session-secret
   ROOT_ADMIN_USERNAME=admin
   ROOT_ADMIN_EMAIL=admin@yourdomain.com
   ROOT_ADMIN_PASSWORD=YourSecurePassword123!
   ```

3. **Process Management**

   ```bash
   # Install PM2 for process management
   sudo npm install -g pm2

   # Start backend with PM2
   pm2 start dist/server.js --name rankboard-backend
   pm2 startup
   pm2 save

   # Monitor processes
   pm2 monit
   pm2 logs rankboard-backend
   ```

4. **Create Upload Directories**
   ```bash
   sudo mkdir -p uploads/avatars uploads/submissions database
   sudo chown -R $USER:$USER uploads database
   ```

### Frontend Deployment

1. **Build Production Assets**

   ```bash
   cd /opt/rankboard/frontend
   npm ci --production
   npm run build
   ```

2. **Configure Nginx**

   ```nginx
   # /etc/nginx/sites-available/rankboard
   server {
       listen 80;
       server_name yourdomain.com www.yourdomain.com;

       # Root directory for built frontend
       root /opt/rankboard/frontend/dist;
       index index.html;

       # Security headers
       add_header X-Frame-Options "SAMEORIGIN" always;
       add_header X-Content-Type-Options "nosniff" always;
       add_header X-XSS-Protection "1; mode=block" always;
       add_header Referrer-Policy "no-referrer-when-downgrade" always;

       # Gzip compression
       gzip on;
       gzip_vary on;
       gzip_min_length 1024;
       gzip_proxied any;
       gzip_comp_level 6;
       gzip_types text/plain text/css text/xml text/javascript application/json application/javascript application/xml+rss image/svg+xml;

       # API proxy to backend
       location /api {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }

       # File uploads proxy
       location /uploads {
           proxy_pass http://localhost:3000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }

       # Static asset caching
       location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
           expires 1y;
           add_header Cache-Control "public, immutable";
       }

       # SPA routing
       location / {
           try_files $uri $uri/ /index.html;
       }

       # Health check endpoint
       location /health {
           access_log off;
           return 200 "healthy\n";
           add_header Content-Type text/plain;
       }
   }
   ```

3. **Enable Site and Test**

   ```bash
   # Enable site
   sudo ln -s /etc/nginx/sites-available/rankboard /etc/nginx/sites-enabled/

   # Test configuration
   sudo nginx -t

   # Reload nginx
   sudo systemctl reload nginx
   ```

### Systemd Services

1. **Backend Service**

   ```bash
   # /etc/systemd/system/rankboard-backend.service
   [Unit]
   Description=RankBoard Backend
   After=network.target

   [Service]
   Type=simple
   User=www-data
   WorkingDirectory=/opt/rankboard/backend
   ExecStart=/usr/bin/node dist/server.js
   Restart=always
   Environment=NODE_ENV=production

   [Install]
   WantedBy=multi-user.target
   ```

2. **Enable and Start Services**
   ```bash
   sudo systemctl daemon-reload
   sudo systemctl enable rankboard-backend
   sudo systemctl start rankboard-backend
   sudo systemctl status rankboard-backend
   ```

---

## 6. Environment Configuration

### Backend Environment Variables

```env
# Server Configuration
PORT=3000
NODE_ENV=production
FRONTEND_URL=https://yourdomain.com

# Session Security
SESSION_SECRET=your-256-bit-secret-key-here

# Root Administrator (created on first run)
ROOT_ADMIN_USERNAME=admin
ROOT_ADMIN_EMAIL=admin@yourdomain.com
ROOT_ADMIN_PASSWORD=SecurePassword123!

# Database (SQLite - file-based)
# No additional config needed - uses ./database/rankboard.db
```

### Frontend Environment Variables

```env
# API Configuration
VITE_API_URL=https://yourdomain.com/api
```

### Environment Security

1. **Generate Secure Secrets**

   ```bash
   # Generate session secret
   openssl rand -hex 32

   # Or use Node.js crypto
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

2. **Environment File Permissions**

   ```bash
   # Secure .env file permissions
   chmod 600 .env
   chown root:root .env
   ```

3. **Runtime Environment Variables**

   ```bash
   # Docker Compose
   environment:
     - SESSION_SECRET=${SESSION_SECRET}
     - ROOT_ADMIN_PASSWORD=${ROOT_ADMIN_PASSWORD}

   # Systemd
   Environment=SESSION_SECRET=your-secret
   ```

---

## 7. Database Setup

### SQLite Configuration

RankBoard uses SQLite3 for data persistence:

- **File Location**: `./database/rankboard.db`
- **Backup**: File-based, easy to backup
- **Performance**: Suitable for moderate load (< 100 concurrent users)
- **Migration**: Schema created automatically on startup

### Initial Setup

```bash
# Create database directory
mkdir -p database
chmod 755 database

# For Docker: volumes handle this automatically
# For manual: ensure write permissions
chown www-data:www-data database
```

### Database Initialization

The application automatically:

1. Creates database file if not exists
2. Runs schema migrations
3. Creates root admin account from environment variables
4. Seeds initial data (optional)

### Backup Strategy

```bash
# Manual backup
cp database/rankboard.db database/rankboard-$(date +%Y%m%d-%H%M%S).db

# Docker volume backup
docker run --rm -v rankboard_backend-database:/db -v $(pwd):/backup alpine tar czf /backup/db-$(date +%Y%m%d).tar.gz -C /db .

# Automated backup script
#!/bin/bash
BACKUP_DIR="/opt/rankboard/backups"
DB_PATH="/opt/rankboard/backend/database/rankboard.db"

mkdir -p $BACKUP_DIR
cp $DB_PATH $BACKUP_DIR/rankboard-$(date +%Y%m%d-%H%M%S).db

# Keep only last 7 days
find $BACKUP_DIR -name "rankboard-*.db" -mtime +7 -delete
```

---

## 8. SSL/TLS Configuration

### Let's Encrypt (Recommended)

1. **Install Certbot**

   ```bash
   sudo apt update
   sudo apt install certbot python3-certbot-nginx
   ```

2. **Obtain Certificate**

   ```bash
   sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
   ```

3. **Automatic Renewal**
   ```bash
   sudo certbot renew --dry-run
   # Add to cron: 0 12 * * * /usr/bin/certbot renew --quiet
   ```

### Manual Certificate

```nginx
# /etc/nginx/sites-available/rankboard
server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /path/to/fullchain.pem;
    ssl_certificate_key /path/to/privkey.pem;

    # SSL Configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # HSTS
    add_header Strict-Transport-Security "max-age=63072000" always;

    # Rest of configuration...
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

### Docker SSL Termination

For containerized deployments, consider using:

- **Traefik** for automatic SSL
- **Caddy** web server
- **NGINX Proxy Manager**

---

## 9. Security Considerations

### Application Security

1. **Authentication & Authorization**
   - Session-based authentication with secure cookies
   - Role-based access control (admin/user)
   - Password hashing with bcrypt (10 rounds)
   - Admin-only user creation

2. **Input Validation**
   - Zod schemas for request validation
   - File upload restrictions (type, size, naming)
   - SQL injection prevention (parameterized queries)

3. **File Upload Security**
   - MIME type validation
   - Filename sanitization (no spaces)
   - Size limits (5MB avatars, 50MB PDFs)
   - Storage outside web root

### Infrastructure Security

1. **Network Security**

   ```bash
   # Configure firewall
   sudo ufw allow ssh
   sudo ufw allow 'Nginx Full'
   sudo ufw --force enable
   ```

2. **SSL/TLS Enforcement**
   - HTTPS redirect
   - Secure cookie settings
   - HSTS headers

3. **Container Security** (Docker)
   - Non-root user execution
   - Minimal base images
   - No privileged containers
   - Read-only filesystems where possible

### Best Practices

- **Regular Updates**: Keep dependencies updated
- **Monitoring**: Log analysis and alerting
- **Backup**: Regular database and file backups
- **Access Control**: Principle of least privilege
- **Security Headers**: CSP, X-Frame-Options, etc.

---

## 10. Monitoring & Logging

### Application Logs

```bash
# Docker logs
docker-compose logs -f backend
docker-compose logs -f frontend

# PM2 logs (manual setup)
pm2 logs rankboard-backend

# System logs
sudo journalctl -u rankboard-backend -f
sudo tail -f /var/log/nginx/error.log
```

### Health Checks

The application includes health check endpoints:

- **Frontend**: `GET /health` → HTTP 200 with "healthy"
- **Backend**: `GET /api/auth/session` → Session status

### Monitoring Setup

1. **Basic Monitoring**

   ```bash
   # Check service status
   docker-compose ps
   sudo systemctl status rankboard-backend

   # Resource usage
   docker stats
   htop
   ```

2. **Log Aggregation**

   ```bash
   # Install rsyslog or similar
   # Configure log rotation
   sudo logrotate /etc/logrotate.d/nginx
   ```

3. **Metrics Collection**
   - Application metrics (response times, error rates)
   - System metrics (CPU, memory, disk)
   - Database metrics (query performance)

### Alerting

Set up alerts for:

- Service downtime
- High resource usage
- Error rate spikes
- Disk space warnings

---

## 11. Backup Strategy

### What to Backup

1. **Database**: SQLite file (`rankboard.db`)
2. **User Uploads**: Avatar and submission files
3. **Configuration**: Environment files, nginx configs
4. **Application Code**: For rollback capability

### Automated Backup Script

```bash
#!/bin/bash
# /opt/rankboard/backup.sh

BACKUP_DIR="/opt/rankboard/backups"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
BACKUP_NAME="rankboard-${TIMESTAMP}"

# Create backup directory
mkdir -p ${BACKUP_DIR}

# Database backup
cp database/rankboard.db ${BACKUP_DIR}/${BACKUP_NAME}.db

# Upload files backup
tar czf ${BACKUP_DIR}/${BACKUP_NAME}-uploads.tar.gz uploads/

# Configuration backup
tar czf ${BACKUP_DIR}/${BACKUP_NAME}-config.tar.gz \
    .env \
    /etc/nginx/sites-available/rankboard

# Retention: keep last 7 daily backups
find ${BACKUP_DIR} -name "rankboard-*.db" -mtime +7 -delete
find ${BACKUP_DIR} -name "rankboard-*-uploads.tar.gz" -mtime +7 -delete
find ${BACKUP_DIR} -name "rankboard-*-config.tar.gz" -mtime +7 -delete

echo "Backup completed: ${BACKUP_NAME}"
```

### Docker Backup

```bash
# Backup volumes
docker run --rm \
  -v rankboard_backend-database:/db \
  -v rankboard_backend-uploads:/uploads \
  -v $(pwd)/backups:/backup \
  alpine:latest \
  sh -c "tar czf /backup/backup-$(date +%Y%m%d).tar.gz -C / ."
```

### Restore Procedure

```bash
# Stop services
docker-compose down

# Restore database
cp backups/rankboard-restore.db database/rankboard.db

# Restore uploads
tar xzf backups/rankboard-uploads-restore.tar.gz -C uploads/

# Start services
docker-compose up -d
```

---

## 12. Scaling Considerations

### Current Architecture Limits

- **Database**: SQLite suitable for < 100 concurrent users
- **File Storage**: Local filesystem (consider S3 for scaling)
- **Sessions**: File-based (consider Redis for multi-server)
- **Static Assets**: Served by Nginx (CDN recommended)

### Scaling Strategies

1. **Vertical Scaling**
   - Increase server resources (CPU, RAM)
   - Optimize database queries
   - Enable caching layers

2. **Horizontal Scaling**

   ```yaml
   # Multiple backend instances
   services:
     backend:
       scale: 3
       # Requires session storage (Redis)
       # Requires database migration (PostgreSQL)
   ```

3. **Database Scaling**
   - Migrate to PostgreSQL/MySQL
   - Implement read replicas
   - Add connection pooling

4. **Storage Scaling**
   - Move to cloud storage (S3, Cloud Storage)
   - Implement CDN for static assets
   - Use object storage for uploads

### Performance Optimizations

- **Database Indexing**: Ensure proper indexes on foreign keys
- **Caching**: Implement Redis for sessions and frequently accessed data
- **Compression**: Enable gzip/brotli compression
- **CDN**: Use CloudFlare or similar for global distribution
- **Monitoring**: Track performance metrics and bottlenecks

---

## 13. Troubleshooting

### Common Issues

1. **Application Won't Start**

   ```bash
   # Check logs
   docker-compose logs backend
   pm2 logs rankboard-backend

   # Verify environment variables
   cat .env

   # Check database permissions
   ls -la database/
   ```

2. **Database Connection Issues**

   ```bash
   # Check SQLite file
   ls -la database/rankboard.db

   # Test database access
   sqlite3 database/rankboard.db "SELECT * FROM users LIMIT 1;"
   ```

3. **File Upload Problems**

   ```bash
   # Check upload directories
   ls -la uploads/

   # Verify permissions
   chmod 755 uploads/avatars uploads/submissions
   ```

4. **Nginx Configuration Errors**

   ```bash
   # Test configuration
   sudo nginx -t

   # Check error logs
   sudo tail -f /var/log/nginx/error.log

   # Reload configuration
   sudo systemctl reload nginx
   ```

5. **SSL Certificate Issues**

   ```bash
   # Check certificate files
   openssl x509 -in /etc/letsencrypt/live/yourdomain.com/cert.pem -text

   # Test renewal
   sudo certbot renew --dry-run
   ```

6. **Performance Issues**

   ```bash
   # Monitor resources
   htop
   iotop
   docker stats

   # Check database performance
   sqlite3 database/rankboard.db "EXPLAIN QUERY PLAN SELECT * FROM users;"
   ```

### Debug Commands

```bash
# Docker debugging
docker-compose exec backend sh
docker-compose exec frontend sh

# Manual debugging
cd /opt/rankboard/backend
NODE_ENV=development npm run dev

# Network testing
curl -I http://localhost:3000/api/auth/session
curl -I http://localhost/health
```

### Support Resources

- Check application logs for error details
- Verify all prerequisites are met
- Test with development environment first
- Review firewall and network configuration
- Check system resources (disk space, memory)

---

## Additional Resources

- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Nginx Configuration Guide](https://nginx.org/en/docs/)
- [Let's Encrypt Documentation](https://certbot.eff.org/docs/)
- [Node.js Production Best Practices](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)
- [SQLite Performance Tuning](https://www.sqlite.org/optimization.html)

For application-specific issues, refer to the main documentation in the `docs/` directory.
