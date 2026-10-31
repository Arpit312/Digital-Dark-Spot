# DarkSpot Atlas (React Native, Expo)
No dummy data. Every screen reads from your backend and shows an empty state when there is nothing.

## Run
1. npm install
2. copy .env.example to .env and set EXPO_PUBLIC_API_URL (your backend, https)
3. npx expo start  (scan the QR with Expo Go)
Build an APK: npx eas build -p android --profile preview

## API your backend must provide (JSON, Bearer token)
Auth:      POST /auth/login {email,password} and POST /auth/signup {name,email,password} -> {token, user?}
           GET /me -> {id,name,email,role: "citizen"|"officer"|"admin"}   DELETE /me   GET /me/export
Analyze:   POST /sources/upload (multipart "file") -> {id}
           POST /analyze {question,topic,depth,sources:[{type:"url"|"text"|"pdf",value,id?}]} -> {id}
           GET /analyses -> [{id,question,created_at,coverage,status}]
           GET /analyses/{id} -> {status:"running"|"done"|"failed", error?, agents:[{name,status:"pending"|"running"|"done"}],
              question, coverage?(0-1), findings:[{id,type:"gap"|"conflict"|"outdated"|"unanswered",title,statement,confidence,
              evidence:[{source,tier,quote,location,url}]}], checklist:[{id,text,priority,done}]}
           PATCH /checklist/{id} {done}
Watch:     GET /watch -> [{id,url,frequency,last_checked}]  POST /watch {url,frequency}  DELETE /watch/{id}
           GET /alerts -> [{id,title,source,before,after,created_at}]
Accuracy:  GET /eval/report -> {metrics:[{label,value}], ablation:[{label,value}], by_type:[{type,precision,recall}], note?}
Campus:    POST /campus/check (multipart "files") -> {gaps:[{title,detail}]}
Officer:   GET /officer/modules -> [{key,title}]   GET /officer/{key} -> {columns:[...], rows:[[...]]}   (403 if not verified)
Admin:     GET /admin/stats -> [{label,value}]  GET /admin/verifications -> [{id,name,dept,email}]
           POST /admin/verifications/{id}/approve|reject   GET /admin/audit -> [{id,text,created_at}]
Change paths or shapes in src/api.ts and the screen files if yours differ.

## Notes
Google sign-in is not included (needs OAuth setup). Add your logo/icon in app.json (icon, splash).
Not tested on a device from this environment: if npm or Expo reports an error, paste it into your AI IDE.
