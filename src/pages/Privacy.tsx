import { ArrowRight, Shield, Eye, EyeOff, Globe, Server, UserX, MessageCircle, Mail } from 'lucide-react';
import { Link } from 'react-router';
import { PageMeta } from '@/components/PageMeta';

const Privacy = () => {
  return (
    <div data-ev-id="ev_edc3837eaf" dir="rtl" className="min-h-screen" style={{ background: 'linear-gradient(160deg, #0a0a14 0%, #0d0d1a 30%, #0f0a1a 60%, #0a0f14 100%)' }}>
      <PageMeta
        title="&#x05DE;&#x05D3;&#x05D9;&#x05E0;&#x05D9;&#x05D5;&#x05EA; &#x05E4;&#x05E8;&#x05D8;&#x05D9;&#x05D5;&#x05EA; | nVision Digital AI"
        description="&#x05DE;&#x05D3;&#x05D9;&#x05E0;&#x05D9;&#x05D5;&#x05EA; &#x05D4;&#x05E4;&#x05E8;&#x05D8;&#x05D9;&#x05D5;&#x05EA; &#x05E9;&#x05DC; nVision Digital AI. &#x05D0;&#x05D9;&#x05E0;&#x05E0;&#x05D5; &#x05D0;&#x05D5;&#x05E1;&#x05E4;&#x05D9;&#x05DD; &#x05DE;&#x05D9;&#x05D3;&#x05E2; &#x05D0;&#x05D9;&#x05E9;&#x05D9; &#x2014; &#x05D4;&#x05D0;&#x05EA;&#x05E8; &#x05E2;&#x05D5;&#x05DE;&#x05D3; &#x05D1;&#x05D7;&#x05D5;&#x05E7; &#x05D4;&#x05D2;&#x05E0;&#x05EA; &#x05D4;&#x05E4;&#x05E8;&#x05D8;&#x05D9;&#x05D5;&#x05EA; &#x05DB;&#x05D5;&#x05DC;&#x05DC; &#x05EA;&#x05D9;&#x05E7;&#x05D5;&#x05DF; 13." />

      {/* Skip Navigation */}
      <a data-ev-id="ev_ade1a132ec"
      href="#privacy-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:right-4 focus:z-[100] focus:px-6 focus:py-3 focus:bg-primary focus:text-primary-foreground focus:rounded-lg focus:text-sm focus:font-semibold focus:shadow-lg focus:outline-none">

        דלג לתוכן הראשי
      </a>

      <div data-ev-id="ev_b9d2a94e31" className="relative z-10 w-full max-w-3xl mx-auto px-4 sm:px-6 py-10 md:py-16">
        {/* Back link */}
        <nav data-ev-id="ev_cd3d9b2057" aria-label="ניווט חזרה" className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-transparent rounded">

            <ArrowRight className="w-4 h-4" aria-hidden="true" />
            חזרה לעמוד הראשי
          </Link>
        </nav>

        <main data-ev-id="ev_7e81323a78" id="privacy-content" tabIndex={-1} className="outline-none">
          <div data-ev-id="ev_a7c8cf8a6d" className="flex items-center gap-3 mb-2">
            <Shield className="w-7 h-7 text-primary" aria-hidden="true" />
            <h1 data-ev-id="ev_5382af7452" className="text-2xl sm:text-3xl font-bold text-white">מדיניות פרטיות</h1>
          </div>
          <p data-ev-id="ev_ef1624d9dd" className="text-white/60 text-sm mb-8">עודכן לאחרונה: {new Date().toLocaleDateString('he-IL')}</p>

          {/* Summary box */}
          <section data-ev-id="ev_fa35726e4f" className="mb-8">
            <div data-ev-id="ev_2ca6d15228" className="bg-green-400/[0.04] border border-green-400/15 rounded-xl p-6">
              <div data-ev-id="ev_5d496e778b" className="flex items-start gap-3">
                <UserX className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <div data-ev-id="ev_4eecb01dab">
                  <p data-ev-id="ev_b16cc86f0a" className="text-white/90 font-semibold text-base mb-2">אנחנו לא אוספים מידע אישי עליכם.</p>
                  <p data-ev-id="ev_3d70c07df1" className="text-white/65 text-sm leading-relaxed">
                    אתר <strong data-ev-id="ev_3358ebb20a" className="text-primary">nVision Digital AI</strong> הוא עמוד קישורים בלבד.
                    אין באתר טפסים, אין הרשמה, אין מערכת משתמשים ואין איסוף מידע אישי.
                    לחיצה על קישור מעבירה אתכם ישירות לאתר המקושר.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* What we DON'T collect */}
          <section data-ev-id="ev_a209f67d9d" className="mb-8" aria-labelledby="no-collect-heading">
            <h2 data-ev-id="ev_8797de6286" id="no-collect-heading" className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <EyeOff className="w-5 h-5 text-cyan-400" aria-hidden="true" />
              מה אנחנו <span data-ev-id="ev_776d05e853" className="text-cyan-400">לא</span> אוספים
            </h2>
            <div data-ev-id="ev_6f0c08c06c" className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-6">
              <ul data-ev-id="ev_d5d6ba5b37" className="space-y-3">
                {[
                { icon: '✘', text: 'שמות, כתובות מייל, מספרי טלפון או כל מידע מזהה אחר' },
                { icon: '✘', text: 'Cookies למעקב, פיקסלים פרסומיים או קודי מעקב כלשהם' },
                { icon: '✘', text: 'כתובות IP, נתוני גלישה או התנהגות באתר' },
                { icon: '✘', text: 'Google Analytics, Facebook Pixel או כל שירות אנליטיקס' },
                { icon: '✘', text: 'מידע רגיש (בריאות, דעות פוליטיות, מידע ביומטרי)' }].
                map((item, i) =>
                <li data-ev-id="ev_99ff468f6d" key={i} className="flex gap-3 text-white/70 text-sm leading-relaxed">
                    <span data-ev-id="ev_4c230df02a" className="text-red-400/70 font-bold mt-0.5 flex-shrink-0" aria-hidden="true">{item.icon}</span>
                    {item.text}
                  </li>
                )}
              </ul>
            </div>
          </section>

          {/* External services */}
          <section data-ev-id="ev_4a929a2fb3" className="mb-8" aria-labelledby="external-heading">
            <h2 data-ev-id="ev_9cda751722" id="external-heading" className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5 text-purple-400" aria-hidden="true" />
              שירותים חיצוניים
            </h2>
            <div data-ev-id="ev_85b6800519" className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-6 space-y-4">
              <div data-ev-id="ev_680e6e26f2">
                <h3 data-ev-id="ev_1ac1c2393b" className="text-white/85 font-medium text-sm mb-1">Google Fonts</h3>
                <p data-ev-id="ev_3bd7d4800e" className="text-white/60 text-sm leading-relaxed">
                  האתר טוען גופנים משרתי Google Fonts.
                  בעת הטעינה, הדפדפן שלכם שולח בקשה לשרתי Google להורדת הגופנים.
                  בקשה זו עשויה לכלול את כתובת ה-IP שלכם.
                  אנו לא שולטים על מידע זה.
                  לפרטים נוספים ראו{' '}
                  <a data-ev-id="ev_836e2fe220"
                  href="https://developers.google.com/fonts/faq/privacy"
                  target="_blank" rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 underline underline-offset-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded">

                    מדיניות הפרטיות של Google Fonts
                  </a>.
                </p>
              </div>

              <div data-ev-id="ev_2b3f18b366">
                <h3 data-ev-id="ev_d83377699b" className="text-white/85 font-medium text-sm mb-1">שירות אחסון נתונים (Supabase)</h3>
                <p data-ev-id="ev_00ca695e50" className="text-white/60 text-sm leading-relaxed">
                  האתר טוען את תוכן הקישורים משרתי Supabase (ספק אחסון נתונים בענן).
                  בעת הטעינה, הדפדפן שלכם שולח בקשות לשרתי Supabase לקריאת תוכן בלבד.
                  בקשות אלו עשויות לכלול את כתובת ה-IP שלכם.
                  <strong data-ev-id="ev_256cad8a28" className="text-white/80"> לא נשמר מידע אישי מזהה בצד שלנו</strong> — הנתונים הנשמרים הם תוכן הקישורים בלבד (כותרות, כתובות URL ואייקונים).
                  לפרטים נוספים ראו{' '}
                  <a data-ev-id="ev_c4ec7788ab"
                  href="https://supabase.com/privacy"
                  target="_blank" rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 underline underline-offset-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded">
                    מדיניות הפרטיות של Supabase
                  </a>.
                </p>
              </div>

              <div data-ev-id="ev_2b3f18b366">
                <h3 data-ev-id="ev_d83377699b" className="text-white/85 font-medium text-sm mb-1">קישורים חיצוניים</h3>
                <p data-ev-id="ev_00ca695e50" className="text-white/60 text-sm leading-relaxed">
                  האתר מכיל קישורים לאתרים חיצוניים (טלגרם, וואטסאפ, פייסבוק ועוד).
                  לחיצה על קישור מעבירה אתכם לאתר המקושר, שעשוי להיות כפוף למדיניות הפרטיות שלו.
                  אנו ממליצים לקרוא את מדיניות הפרטיות של כל שירות לפני השימוש בו.
                </p>
              </div>

              <div data-ev-id="ev_62a1f27041">
                <h3 data-ev-id="ev_44f1433da0" className="text-white/85 font-medium text-sm mb-1">אחסון מקומי בדפדפן</h3>
                <p data-ev-id="ev_b5b8ad9e6e" className="text-white/60 text-sm leading-relaxed">
                  האתר משתמש ב-<span data-ev-id="ev_d4b41ce907" className="text-white/80">localStorage</span> לשמירת העדפות נגישות (גודל טקסט, ניגודיות וכו') — ללא מידע מזהה.
                  בממשק הניהול נעשה שימוש ב-<span data-ev-id="ev_198185bd2b" className="text-white/80">sessionStorage</span> לשמירת מזהה מוצפן (hash) של הסיסמה לצורך אימות — המזהה נמחק עם סגירת הדפדפן או אחרי 30 דקות של חוסר פעילות.
                  לא נעשה שימוש בעוגיות (cookies) כלשהן.
                </p>
              </div>

              <div data-ev-id="ev_dda07e89ff">
                <h3 data-ev-id="ev_c358d73008" className="text-white/85 font-medium text-sm mb-1">יומן פעולות ניהול</h3>
                <p data-ev-id="ev_7d42a3eb70" className="text-white/60 text-sm leading-relaxed">
                  פעולות ניהול (יצירה, עריכה, מחיקה של תכנים) מתועדות ביומן פנימי הכולל את סוג הפעולה,
                  מזהה התוכן שהשתנה, וכתובת IP של המנהל. מידע זה נגיש רק למנהלי האתר ונועד לצרכי אבטחה ושקיפות בלבד.
                </p>
              </div>

              <div data-ev-id="ev_891c19dda7">
                <h3 data-ev-id="ev_996d37f384" className="text-white/85 font-medium text-sm mb-1">סטטיסטיקות אנונימיות</h3>
                <p data-ev-id="ev_72f1f2c75e" className="text-white/60 text-sm leading-relaxed">
                  האתר סופר ביקורים וקליקים על קישורים באופן <strong data-ev-id="ev_8c2bf2e314" className="text-white/80">אנונימי לחלוטין</strong> —
                  ללא עוגיות, ללא כתובות IP, ללא מזהים ייחודיים וללא טביעות אצבע דיגיטליות.
                  כל אירוע (צפייה בדף, קליק על קישור, החלפת תצוגה) נשמר כ-+1 בלבד, ללא שום יכולת לקשר בין אירועים לאדם מסוים.
                  הנתונים הנשמרים: סוג האירוע, שם הקישור/תצוגה, ומועד (תאריך ושעה). מידע זה משמש את מנהלי האתר בלבד
                  להבנת דפוסי שימוש כלליים ואינו כולל שום מידע אישי.
                </p>
              </div>

              <div data-ev-id="ev_0f6c1fa860">
                <h3 data-ev-id="ev_1dffa53298" className="text-white/85 font-medium text-sm mb-1">תקופות שמירת מידע</h3>
                <p data-ev-id="ev_ef4b4890c0" className="text-white/60 text-sm leading-relaxed">
                  <strong data-ev-id="ev_e3cd25d47a" className="text-white/80">סטטיסטיקות אנונימיות</strong> (צפיות, קליקים) — נשמרות עד 12 חודשים ולאחר מכן נמחקות אוטומטית.
                  <br data-ev-id="ev_20f8d9a96e" />
                  <strong data-ev-id="ev_3938df70a3" className="text-white/80">יומן פעולות ניהול</strong> — נשמר עד 24 חודשים לצורכי אבטחה ובקרה.
                  <br data-ev-id="ev_ae6433fc52" />
                  <strong data-ev-id="ev_d126711ad5" className="text-white/80">העדפות נגישות</strong> (localStorage) — נשמרות בדפדפן שלכם בלבד עד שתמחקו אותן.
                  <br data-ev-id="ev_2bf4601601" />
                  <strong data-ev-id="ev_9ad4e5a1d2" className="text-white/80">מזהה מנהל</strong> (sessionStorage) — נמחק אוטומטית עם סגירת הדפדפן או אחרי 30 דקות של חוסר פעילות.
                </p>
              </div>
            </div>
          </section>

          {/* Data controller */}
          <section data-ev-id="ev_4049a6d41b" className="mb-8" aria-labelledby="controller-heading">
            <h2 data-ev-id="ev_2de30a762b" id="controller-heading" className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Server className="w-5 h-5 text-cyan-400" aria-hidden="true" />
              בעל השליטה ויצירת קשר
            </h2>
            <div data-ev-id="ev_46c6381504" className="bg-primary/[0.04] border border-primary/10 rounded-xl p-6">
              <p data-ev-id="ev_e140fa23ce" className="text-white/70 text-sm leading-relaxed mb-3">
                האתר מופעל על ידי <strong data-ev-id="ev_c1340b7423" className="text-primary">nVision Digital AI</strong>.
              </p>
              <p data-ev-id="ev_5df15e818f" className="text-white/70 text-sm leading-relaxed mb-4">
                לכל שאלה, בקשה או פנייה בנושא פרטיות ומימוש זכות עיון/תיקון/מחיקה:
              </p>
              <div data-ev-id="ev_9070129b9c" className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" aria-hidden="true" />
                <a data-ev-id="ev_282118f369"
                href="mailto:privacy@nvision.me"
                className="text-primary hover:text-primary/80 underline underline-offset-2 text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded">

                  privacy@nvision.me
                </a>
              </div>
              <div data-ev-id="ev_a3f4c7150e" className="flex items-center gap-2 mt-3">
                <MessageCircle className="w-4 h-4 text-green-400" aria-hidden="true" />
                <span data-ev-id="ev_38876d74be" className="text-white/60 text-sm">וואטסאפ בלבד:</span>
                <a data-ev-id="ev_2f27afc3fe"
                href="https://wa.me/972535300952"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-400 hover:text-green-300 underline underline-offset-2 text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400 rounded"
                dir="ltr">

                  +972-53-530-0952
                </a>
              </div>
            </div>
          </section>

          {/* Your rights */}
          <section data-ev-id="ev_1a88e2a0fb" className="mb-8" aria-labelledby="rights-heading">
            <h2 data-ev-id="ev_b35511362b" id="rights-heading" className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Eye className="w-5 h-5 text-green-400" aria-hidden="true" />
              הזכויות שלכם
            </h2>
            <div data-ev-id="ev_2fc51ea3d9" className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-6">
              <p data-ev-id="ev_13bc275266" className="text-white/70 text-sm leading-relaxed mb-3">
                בהתאם לסעיפים 13–14 לחוק הגנת הפרטיות, תשנ"א-1981 (כולל תיקון 13), עומדות לכם הזכויות הבאות:
              </p>
              <ul data-ev-id="ev_17beaf35f6" className="space-y-2">
                {[
                'זכות עיון — לבקש לדעת אם מוחזק עליכם מידע (באתר זה — אינו מוחזק).',
                'זכות תיקון — לבקש תיקון מידע שגוי.',
                'זכות מחיקה — לבקש מחיקת מידע שאינו נדרש עוד.',
                'זכות התנגדות — להתנגד לעיבוד מידע לצורך דיוור ישיר.'].
                map((item, i) =>
                <li data-ev-id="ev_af34bb028a" key={i} className="flex gap-3 text-white/65 text-sm leading-relaxed">
                    <span data-ev-id="ev_c0c236d247" className="text-green-400/60 mt-0.5 flex-shrink-0" aria-hidden="true">✓</span>
                    {item}
                  </li>
                )}
              </ul>
              <p data-ev-id="ev_6789085e91" className="text-white/60 text-xs mt-4 leading-relaxed">
                מאחר שאיננו אוספים מידע אישי, זכויות אלו רלוונטיות בעיקר לשירותים החיצוניים שאליהם אתם מופנים דרך האתר.
              </p>
            </div>
          </section>

          {/* Legal reference */}
          <section data-ev-id="ev_05c7337fda" aria-labelledby="legal-heading">
            <h2 data-ev-id="ev_f3ee6cf640" id="legal-heading" className="text-lg font-semibold text-white mb-4">בסיס משפטי</h2>
            <div data-ev-id="ev_b84f3ee150" className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-6 text-white/60 text-sm leading-relaxed space-y-2">
              <p data-ev-id="ev_fa921a8678">• <strong data-ev-id="ev_f6ef03fbe7" className="text-white/80">חוק הגנת הפרטיות</strong>, התשמ"א-1981 (כולל תיקון 13, תחילת תוקף 14.8.2025)</p>
              <p data-ev-id="ev_872614ff24">• <strong data-ev-id="ev_8925622d9a" className="text-white/80">תקנות הגנת הפרטיות (אבטחת מידע)</strong>, התשע"ג-2017</p>
              <p data-ev-id="ev_4605fae83b">• האתר אינו מפעיל <strong data-ev-id="ev_26dedf7085" className="text-white/80">מאגר מידע</strong> ולפיכך אינו חייב ברישום אצל רשות הפרטיות</p>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer data-ev-id="ev_4847574b13" role="contentinfo" className="mt-12 pb-8 text-center">
          <div data-ev-id="ev_cc1d719f15" className="flex items-center justify-center flex-wrap gap-x-4 gap-y-2 text-xs">
            <Link
              to="/accessibility"
              className="text-white/60 hover:text-white/70 underline underline-offset-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded">

              הצהרת נגישות
            </Link>
            <span data-ev-id="ev_6ebfcd57d5" className="text-white/25" aria-hidden="true">|</span>
            <span data-ev-id="ev_1fb9cca497" className="text-white/60" lang="en">nVision Digital AI © {new Date().getFullYear()}</span>
          </div>
        </footer>
      </div>
    </div>);

};

export default Privacy;