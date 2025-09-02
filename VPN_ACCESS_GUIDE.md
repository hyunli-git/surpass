# VPN Access Guide for Surpass

If you're having trouble accessing surpass.so while connected to a corporate VPN, try these solutions:

## Quick Solutions

### 1. Use Vercel Subdomain
Access the site directly via: https://surpass-lime.vercel.app

### 2. Configure VPN Split Tunneling
Add these domains to your VPN bypass list:
- surpass.so
- *.vercel.app
- *.vercel-dns.com

### 3. Browser Proxy Settings
In your browser settings, add surpass.so to the proxy exceptions list.

## For macOS Users

1. Go to System Settings > Network > VPN
2. Click "Advanced" > "Proxies"
3. Add `*.surpass.so, *.vercel.app` to "Bypass proxy settings for these Hosts & Domains"

## For Windows Users

1. Go to Settings > Network & Internet > Proxy
2. Under "Manual proxy setup", add exceptions for surpass.so

## For IT Administrators

Please whitelist the following:
- Domain: surpass.so
- IP: 216.198.79.1
- Backup domain: surpass-lime.vercel.app
- IP ranges: 64.29.17.0/24, 216.198.79.0/24

## Technical Details

The issue occurs because:
1. Corporate firewalls may block Vercel's edge network
2. VPN may not properly forward SNI (Server Name Indication) headers
3. DNS resolution might be altered by corporate DNS servers

## Still Having Issues?

Contact your IT department with this information or access the site from a personal network.