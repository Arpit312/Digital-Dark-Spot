# DarkSpot Admin (Next.js)
npm install, copy .env.example to .env.local, set NEXT_PUBLIC_API_URL, npm run dev -> http://localhost:3001
Same backend, same accounts as the website and the app. Only users with role "admin" can sign in.
No dummy data: every page reads from the API and shows an empty state when there is nothing.

## Connect to the website and app
- Use ONE backend and ONE users table. The website, the app and this dashboard all call the same API and sign in with the same /auth/login.
- Backend CORS: allow the admin origin (http://localhost:3001 and your deployed admin URL).
- Everything admins change (roles, verifications, trust tiers, feature flags) is saved in your database, so the app and website pick it up.
- Log each admin action to your audit table so it appears in the Audit log.

## API this dashboard calls (JSON, Bearer token)
Auth:     POST /auth/login {email,password,otp?} -> {token,user?}   GET /me -> {id,name,email,role}
Overview: GET /admin/stats -> [{label,value,delta?}]
          GET /admin/timeseries?metric=analyses&range=24h|7d|30d -> [{t,v}]
          GET /admin/health -> [{name,status,latency_ms?}]
          GET /admin/audit?limit=&q= -> [{id,text,actor?,created_at}]
AI:       GET /admin/ai/insights -> [{id,title,detail,severity:"high|medium|low",action?:{label,href}}]
          POST /admin/ai/ask {message,history:[{role,content}]} -> {answer, actions?:[{label,href}]}
          POST /admin/ai/review {kind:"verification"|"finding", id} -> {summary, recommendation?, risk?}
Users:    GET /admin/users?q=&role=   PATCH /admin/users/{id} {role?|suspended?}
Verif.:   GET /admin/verifications -> [{id,name,dept,email,note?}]   POST /admin/verifications/{id}/approve|reject
Analyses: GET /admin/analyses?q=&status= -> [{id,question,user,channel:"web"|"app",status,latency_ms,created_at}]
Flagged:  GET /admin/flagged -> [{id,type,title,statement,reason,evidence:[{quote}]}]   PATCH /admin/flagged/{id} {action:"confirm"|"dismiss"}
Sources:  GET /admin/sources -> [{id,domain,tier,count?}]   POST /admin/sources {domain,tier}   PATCH /admin/sources/{id}
Agents:   GET /admin/agents -> [{name,runs,avg_ms,error_rate(0-1)}]
Flags:    GET /admin/flags -> [{key,label?,description?,enabled}]   PUT /admin/flags/{key} {enabled}
Return 403 for non-admins. Change paths in the page files if yours differ.

## AI on the backend (your side)
The AI features call YOUR endpoints. Implement /admin/ai/* with your LLM and query your own database (tool-calling or fixed SQL). Never send raw user data to the browser that the admin should not see. Keep the "AI suggestion, review before acting" rule.

## Shortcuts
Ctrl K command palette, Ctrl J AI Copilot.
Not built or run from this environment (no npm network). If npm shows an error, paste it into your AI IDE.
