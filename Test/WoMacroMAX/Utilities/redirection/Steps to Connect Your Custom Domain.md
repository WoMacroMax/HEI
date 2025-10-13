Perfect! Here's how to connect womacromax.com to your Replit app:

Steps to Connect Your Custom Domain
1. Publish Your App First
Click the Publish button in Replit (or use the deployment feature)
Wait for your app to be successfully deployed

2. Access Domain Settings
Go to the Deployments tab in your Replit project
Click on Settings
Select "Manually connect from another registrar"
3. Enter Your Domain
Type in: womacromax.com
Replit will generate DNS records for you:
A record (points to Replit's server IP)
TXT record (for domain verification)
4. Update DNS Records at Netlify
Since your domain is hosted at Netlify, you'll need to update DNS there:

In Netlify:

Go to your Netlify dashboard
Navigate to Domains → womacromax.com → DNS settings
Add the A record Replit gives you
Add the TXT record Replit gives you
(If you want a subdomain like app.womacromax.com, add another A record for that)
5. Wait for DNS Propagation
This can take anywhere from a few minutes to 48 hours
You can check status at: https://dnschecker.org
6. Verify Connection
Back in Replit's domain settings, check for "Verified" status
Test by visiting womacromax.com in your browser
Note: Since you're currently using Netlify to host the domain, you'll need to decide if you want to keep the DNS at Netlify (and just point it to Replit) or transfer DNS management to your domain registrar directly.