# نشر Backend على Render

## خطوات التوافق مع Render

### 1. تحضير الملفات
تأكدت من أن جميع الملفات المطلوبة موجودة:
- ✅ `package.json` - مع scripts البدء
- ✅ `server.js` - نقطة الدخول الرئيسية
- ✅ `.env.example` - مثال على متغيرات البيئة
- ✅ `render.yaml` - ملف التكوين
- ✅ `.gitignore` - يستثني `.env` و `node_modules`

### 2. متطلبات ما قبل النشر
- إنشاء حساب على [Render.com](https://render.com)
- إنشاء repository على GitHub وفعل push للكود
- توفر MongoDB Atlas connection string

### 3. خطوات النشر على Render

#### أ. إعداد Git Repository
```bash
cd Galaba-backend
git init
git add .
git commit -m "Initial commit for Render deployment"
git push origin main
```

#### ب. ربط بـ Render
1. اذهب إلى [dashboard.render.com](https://dashboard.render.com)
2. انقر على "New +" ثم اختر "Web Service"
3. اختر "Build and deploy from a Git repository"
4. اربط حساب GitHub الخاص بك
5. اختر repository `Al-Galaba-frontend` أو اسم المشروع الخاص بك
6. في خيار "Root Directory"، اكتب: `Galaba-backend`

#### ج. تكوين الإعدادات
- **Name**: `galaba-backend` (أو أي اسم تفضل)
- **Environment**: `Node`
- **Region**: اختر أقرب منطقة لك
- **Branch**: `main` (أو الفرع الخاص بك)
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Plan**: `Free` للبداية (أو `Paid` للأداء الأفضل)

#### د. إضافة متغيرات البيئة
في قسم "Environment Variables"، أضف:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `MONGODB_URI` | `your_mongodb_connected_string` |
| `JWT_SECRET` | `your_secure_jwt_secret` |
| `PORT` | `auto` (Render يعيينها تلقائياً) |

### 4. قيم مثال
#### MongoDB Connection String:
- اذهب إلى MongoDB Atlas
- انقر على "Connect" في cluster الخاص بك
- اختر "Drivers"
- انسخ connection string والصقها في `MONGODB_URI`

#### JWT Secret:
استخدم نص عشوائي آمن:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 5. بدء النشر
- انقر على "Create Web Service"
- انتظر اكتمال البناء والنشر (عادة 2-5 دقائق)
- ستحصل على URL مثل: `https://galaba-backend.onrender.com`

### 6. التحقق من النشر الناجح
اختبر health endpoint:
```bash
curl https://your-service-name.onrender.com/api/health
```

يجب أن ترى:
```json
{
  "status": "OK",
  "message": "Galaba API is running"
}
```

## 📝 ملاحظات مهمة

### أمان قوي (Security)
- **لا تضع** `JWT_SECRET` أو `MONGODB_URI` في GitHub
- استخدم `MONGODB_URI` من `.env.example` فقط
- عدّل `JWT_SECRET` إلى قيمة آمنة في الإنتاج

### Cold Start
- الخدمات المجانية على Render قد تأخذ وقتاً في البدء الأول
- لتجنب هذا، استخدم plan مدفوع أو setup cronjob للحفاظ على الخدمة

### CORS Settings
تأكد أن إعدادات CORS تسمح لـ frontend domain:
```javascript
// في server.js
app.use(cors({
  origin: [
    'https://your-frontend-domain.com',
    'http://localhost:3000'
  ]
}));
```

### قاعدة البيانات
- استخدم MongoDB Atlas (السحابة)
- تأكد من أن IP Whitelist تسمح بـ `0.0.0.0/0` أو أضف IP الخوادم

## 🆘 حل المشاكل

### الخدمة لا تبدأ
- افحص Logs في Render dashboard
- تأكد من صحة `MONGODB_URI`
- تأكد من أن `node_modules` في `.gitignore`

### خطأ في الاتصال بـ MongoDB
- تحقق من connection string
- تأكد من IP Whitelist في MongoDB Atlas
- تحقق من بيانات المستخدم والكلمة المرور

### الخدمة تتوقف بعد الخمول
- في الخطة المجانية، تتوقف الخدمات بعد 15 دقيقة بدون استخدام
- استخدم خدمة مثل [Uptime Robot](https://uptimerobot.com) لإرسال requests دورية

## 📚 موارد إضافية
- [Render Documentation](https://render.com/docs)
- [Express.js Deployment Guide](https://expressjs.com/en/advanced/best-practice-performance.html)
- [MongoDB Atlas Connection Guide](https://www.mongodb.com/docs/atlas/driver-connection/)
