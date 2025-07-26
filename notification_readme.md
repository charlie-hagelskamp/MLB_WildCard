# 📱 Push Notification Setup Guide

## Overview
Your MLB Wild Card Dashboard supports multiple types of push notifications to alert you when new data is available each morning at 7 AM EST.

## 🔔 Browser Push Notifications (Built-in)

### How it works:
- Click "Enable Push Notifications" on your dashboard
- Browser will request permission
- Notifications automatically trigger when you visit the site at 7 AM
- Works offline via Service Worker

### Supported Browsers:
- ✅ Chrome (Desktop & Mobile)
- ✅ Firefox (Desktop & Mobile) 
- ✅ Safari (macOS & iOS 16.4+)
- ✅ Edge (Desktop & Mobile)

### Setup Steps:
1. Visit your GitHub Pages URL
2. Click "Enable Push Notifications"
3. Allow when browser prompts for permission
4. Notification will show "✅ Notifications enabled!"

## 🌐 Advanced Notification Options

### Option 1: IFTTT Integration
Set up automated notifications via IFTTT webhooks:

1. Create IFTTT account
2. Create new applet:
   - **Trigger**: Webhooks (receive web request)
   - **Action**: Notifications (send notification to phone)
3. Get your webhook URL from IFTTT
4. Add to GitHub workflow:

```yaml
- name: Send IFTTT notification
  run: |
    curl -X POST https://maker.ifttt.com/trigger/mlb_update/with/key/YOUR_KEY \
      -H "Content-Type: application/json" \
      -d '{"value1": "MLB Wild Card Updated!", "value2": "Check your dashboard"}'
```

### Option 2: Slack/Discord Webhook
Send notifications to your personal Slack or Discord:

```yaml
# For Slack
- name: Slack notification
  run: |
    curl -X POST ${{ secrets.SLACK_WEBHOOK }} \
      -H "Content-Type: application/json" \
      -d '{"text": "🏆 MLB Wild Card standings updated! <https://your-username.github.io/mlb-tracker|View Dashboard>"}'

# For Discord  
- name: Discord notification
  run: |
    curl -X POST ${{ secrets.DISCORD_WEBHOOK }} \
      -H "Content-Type: application/json" \
      -d '{"content": "🏆 MLB Wild Card standings updated! Check your dashboard for the latest race updates."}'
```

### Option 3: Email Notifications
Keep the email option as backup:

```yaml
- name: Send email notification
  env:
    EMAIL_TO: ${{ secrets.EMAIL_TO }}
    EMAIL_FROM: ${{ secrets.EMAIL_FROM }}
  run: |
    python -c "
    import smtplib
    from email.mime.text import MIMEText
    
    msg = MIMEText('Your MLB Wild Card dashboard has been updated!')
    msg['Subject'] = '🏆 MLB Update Ready'
    msg['From'] = '$EMAIL_FROM'
    msg['To'] = '$EMAIL_TO'
    
    with smtplib.SMTP('smtp.gmail.com', 587) as server:
        server.starttls()
        server.login('$EMAIL_FROM', '${{ secrets.EMAIL_PASSWORD }}')
        server.send_message(msg)
    "
```

### Option 4: Mobile Push (Advanced)
For native mobile push notifications, integrate with services like:

- **OneSignal**: Free push notification service
- **Pusher**: Real-time messaging
- **Firebase Cloud Messaging**: Google's push service

Example OneSignal integration:
```javascript
// Add to your index.html
OneSignal.init({
  appId: "YOUR_ONESIGNAL_APP_ID",
});

// Trigger from GitHub Action
curl -X POST "https://onesignal.com/api/v1/notifications" \
  -H "Content-Type: application/json" \
  -H "Authorization: Basic YOUR_API_KEY" \
  -d '{
    "app_id": "YOUR_APP_ID",
    "included_segments": ["All"],
    "headings": {"en": "MLB Wild Card Update!"},
    "contents": {"en": "New standings are available on your dashboard"}
  }'
```

## 📋 Quick Setup Checklist

- [ ] Enable browser notifications on your dashboard
- [ ] Test notification works (visit site at 7 AM or use browser dev tools)
- [ ] Choose additional notification method (IFTTT, Slack, etc.)
- [ ] Add webhook secrets to GitHub repository
- [ ] Update workflow with notification step
- [ ] Test full workflow with manual trigger

## 🔧 Troubleshooting

### Browser Notifications Not Working:
1. **Check permissions**: Browser settings → Notifications → Allow for your site
2. **HTTPS required**: Ensure using GitHub Pages HTTPS URL
3. **Service Worker**: Check dev tools → Application → Service Workers
4. **Clear cache**: Sometimes needed after updates

### Webhook Notifications Failing:
1. **Check secrets**: Ensure webhook URLs are set correctly
2. **Test manually**: Try curl command locally first
3. **Rate limits**: Some services limit notification frequency
4. **Check logs**: GitHub Actions logs show detailed errors

### Timing Issues:
1. **Time zones**: GitHub Actions uses UTC, adjust cron accordingly
2. **Data freshness**: Ensure data updates before notification
3. **Weekend handling**: MLB has different schedules on weekends

## 📱 Mobile Experience

### Add to Home Screen:
1. Open dashboard in mobile browser
2. Tap share button
3. Select "Add to Home Screen"
4. Creates app-like icon with offline support

### Notification Settings:
- iOS: Settings → Notifications → Safari → Allow
- Android: Chrome → Settings → Site Settings → Notifications

## 🎯 Best Practices

1. **Test thoroughly**: Use manual workflow triggers during setup
2. **Multiple methods**: Browser + one backup (email/Slack) is ideal
3. **Customize timing**: Adjust for your schedule (maybe 6:30 AM for coffee prep)
4. **Respectful frequency**: Daily is perfect, more would be spam
5. **Graceful fallbacks**: If one method fails, others still work

---

## 🚀 Ready to Start?

1. Set up browser notifications first (easiest)
2. Add one advanced method for reliability
3. Test with manual workflow trigger
4. Enjoy your daily 7 AM MLB updates! ⚾

Your dashboard URL will be: `https://YOUR-USERNAME.github.io/mlb-tracker`
