import { ArrowRight, CheckCircle, AlertTriangle, Mail, MessageCircle } from 'lucide-react';
import { Link } from 'react-router';
import { PageMeta } from '@/components/PageMeta';

const Accessibility = () => {
  return (
    <div data-ev-id="ev_930273da99" dir="rtl" className="min-h-screen" style={{ background: 'linear-gradient(160deg, #0a0a14 0%, #0d0d1a 30%, #0f0a1a 60%, #0a0f14 100%)' }}>
      <PageMeta
        title="&#x05D4;&#x05E6;&#x05D4;&#x05E8;&#x05EA; &#x05E0;&#x05D2;&#x05D9;&#x05E9;&#x05D5;&#x05EA; | nVision Digital AI"
        description="&#x05D4;&#x05E6;&#x05D4;&#x05E8;&#x05EA; &#x05D4;&#x05E0;&#x05D2;&#x05D9;&#x05E9;&#x05D5;&#x05EA; &#x05E9;&#x05DC; nVision Digital AI. &#x05D4;&#x05D0;&#x05EA;&#x05E8; &#x05E2;&#x05D5;&#x05DE;&#x05D3; &#x05D1;&#x05EA;&#x05E7;&#x05DF; &#x05D9;&#x05E9;&#x05E8;&#x05D0;&#x05DC;&#x05D9; &#x05EA;&quot;&#x05D9; 5568 &#x05D5;-WCAG 2.1 AA."
      />
      {/* Skip Navigation */}
      <a data-ev-id="ev_957f896809"
      href="#a11y-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:right-4 focus:z-[100] focus:px-6 focus:py-3 focus:bg-primary focus:text-primary-foreground focus:rounded-lg focus:text-sm focus:font-semibold focus:shadow-lg focus:outline-none">

        דלג לתוכן הראשי
      </a>

      <div data-ev-id="ev_f8e9367e8a" className="relative z-10 w-full max-w-3xl mx-auto px-4 sm:px-6 py-10 md:py-16">
        {/* Back link */}
        <nav data-ev-id="ev_02afff5d25" aria-label="ניווט חזרה" className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-transparent rounded">

            <ArrowRight className="w-4 h-4" aria-hidden="true" />
            חזרה לעמוד הראשי
          </Link>
        </nav>

        <main data-ev-id="ev_f381669107" id="a11y-content" tabIndex={-1} className="outline-none">
          <h1 data-ev-id="ev_0253f856b8" className="text-2xl sm:text-3xl font-bold text-white mb-2">הצהרת נגישות</h1>
          <p data-ev-id="ev_0d4efc63c4" className="text-white/60 text-sm mb-8">עודכן לאחרונה: 26 בפברואר 2026</p>

          {/* Intro */}
          <section data-ev-id="ev_0f8badbb36" className="mb-8">
            <div data-ev-id="ev_82ea3e5762" className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-6">
              <p data-ev-id="ev_3b668f5c94" className="text-white/80 leading-relaxed">
                אתר <strong data-ev-id="ev_04d07b0b7c" className="text-primary">nVision Digital AI</strong> מחויב לאפשר לכל אדם, כולל אנשים עם מוגבלות,
                גישה שווה ונוחה לתכנים ולשירותים המוצעים בו.
              </p>
              <p data-ev-id="ev_c29f2fb735" className="text-white/70 leading-relaxed mt-3">
                האתר עומד בדרישות <strong data-ev-id="ev_0d4f747996" className="text-white/90">תקן ישראלי ת"י 5568</strong>, המבוסס על הנחיות
                הנגישות לתוכן אינטרנט <strong data-ev-id="ev_13ebde83e9" className="text-white/90">WCAG 2.1 ברמת AA</strong>, בהתאם
                לחוק שוויון זכויות לאנשים עם מוגבלות, התשנ"ח-1998 ותקנותיו.
              </p>
            </div>
          </section>

          {/* What we did */}
          <section data-ev-id="ev_cca50da6c3" className="mb-8" aria-labelledby="adaptations-heading">
            <h2 data-ev-id="ev_5b2d9cab5e" id="adaptations-heading" className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" aria-hidden="true" />
              התאמות הנגישות שבוצעו
            </h2>
            <ul data-ev-id="ev_a511ba8766" className="space-y-3">
              {[
              'ניווט מלא באמצעות מקלדת בלבד (Tab, Shift+Tab, חיצים, Enter/Space) לכל רכיב אינטראקטיבי באתר.',
              'קישור "דלג לתוכן הראשי" (Skip Navigation) בכל דף — נראה בלחיצה על Tab.',
              'היררכיית כותרות תקינה (h1–h2) למבנה הדף, המאפשרת ניווט מהיר עם קורא מסך.',
              'סמנטיקת HTML תקנית עם Landmarks: header, main, nav, footer — לניווט מהיר.',
              'תכונות ARIA מתאימות: role, aria-label, aria-checked, aria-expanded, aria-live, aria-hidden לאלמנטים דקורטיביים ואינטראקטיביים.',
              'ניגודיות צבעים מספקת בין טקסט לרקע בהתאם לדרישות WCAG 2.1 AA (יחס 4.5:1 לטקסט רגיל, 3:1 לטקסט גדול).',
              'תמיכה ב-prefers-reduced-motion: אנימציות מושבתות אוטומטית עבור משתמשים שהגדירו העדפה לצמצום תנועה.',
              'כל הקישורים החיצוניים מסומנים בבירור ונפתחים בחלון חדש עם ציון מתאים.',
              'תמיכה בשינוי גודל טקסט עד 200% ללא שבירת עיצוב.',
              'האתר מותאם לקריאה מימין לשמאל (RTL) בעברית, כולל כיוון מקלדת מתאים.',
              'כפתורים ואלמנטים אינטראקטיביים עם מצב פוקוס (focus-visible) ברור ונראה.',
              'ממשק הניהול (Admin) עומד באותם תקני נגישות: skip navigation, תוויות ARIA, ניווט מקלדת, focus-visible, ו-aria-live לעדכוני מצב.',
              'סרגל נגישות מובנה (כפתור נגישות בפינה הימנית התחתונה) המאפשר: הגדלת טקסט, ניגודיות גבוהה, הדגשת קישורים, עצירת אנימציות, סמן מוגדל וגופן קריא. ההגדרות נשמרות בין ביקורים.'].map((item) =>
              <li data-ev-id="ev_0eeed68df8" key={item.slice(0, 30)} className="flex gap-3 text-white/70 text-sm leading-relaxed">
                  <span data-ev-id="ev_af5546d86e" className="text-green-400/60 mt-1 flex-shrink-0" aria-hidden="true">✓</span>
                  {item}
                </li>
              )}
            </ul>
          </section>

          {/* Known limitations */}
          <section data-ev-id="ev_bf948d81c8" className="mb-8" aria-labelledby="limitations-heading">
            <h2 data-ev-id="ev_7a0d087ee7" id="limitations-heading" className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" aria-hidden="true" />
              מגבלות נגישות ידועות
            </h2>
            <div data-ev-id="ev_2411dce333" className="bg-amber-400/[0.04] border border-amber-400/10 rounded-xl p-6">
              <ul data-ev-id="ev_a86897d968" className="space-y-3">
                {[
                'חלק מהתצוגות היצירתיות (אקווריום, מולקולרי, מעגל חשמלי ועוד) משתמשות באנימציות מורכבות שעשויות להיות פחות נגיש למשתמשי קוראי מסך — הקישורים עצמם נשארים נגישים במלואם.',
                'אנימציית הלוגו (Canvas) היא דקורטיבית בלבד ומסומנת כ-aria-hidden. התוכן הטקסטואלי זמין דרך הכותרת הראשית.',
                'רכיב הרקע המונפש (חלקיקים) מושבת אוטומטית למשתמשים שמעדיפים צמצום תנועה.',
                'טעינת נתונים מ_SUPABASE_URL — גישה לאינטרנטית נוספת, נדרשת לצורך טעינת נתונים עבור האתר.'].map((item) =>
                <li data-ev-id="ev_df0ac64949" key={item.slice(0, 30)} className="flex gap-3 text-white/65 text-sm leading-relaxed">
                    <span data-ev-id="ev_bc9868931f" className="text-amber-400/60 mt-1 flex-shrink-0" aria-hidden="true">⚠</span>
                    {item}
                  </li>
                )}
              </ul>
            </div>
          </section>

          {/* Testing */}
          <section data-ev-id="ev_0db071505b" className="mb-8" aria-labelledby="testing-heading">
            <h2 data-ev-id="ev_8ddf8a46ca" id="testing-heading" className="text-lg font-semibold text-white mb-4">בדיקות שבוצעו</h2>
            <div data-ev-id="ev_0defdd148b" className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-6">
              <ul data-ev-id="ev_bc779b85e4" className="space-y-2 text-white/70 text-sm">
                <li data-ev-id="ev_976a309794">• ניווט מלא במקלדת ללא עכבר</li>
                <li data-ev-id="ev_b8afdb8bfb">• בדיקת ניגודיות צבעים לפי דרישות WCAG 2.1 AA</li>
                <li data-ev-id="ev_cde537f61a">• תאימות לקוראי מסך (NVDA, VoiceOver)</li>
                <li data-ev-id="ev_0a74896142">• בדיקת סדר פוקוס וקריאות כותרות</li>
                <li data-ev-id="ev_e5f18a0443">• בדיקת הגדלת טקסט עד 200%</li>
                <li data-ev-id="ev_b79f6daa1e">• בדיקת התנהגות ב-prefers-reduced-motion</li>
              </ul>
            </div>
          </section>

          {/* Contact */}
          <section data-ev-id="ev_f510efc8f0" className="mb-8" aria-labelledby="contact-heading">
            <h2 data-ev-id="ev_5412e416cd" id="contact-heading" className="text-lg font-semibold text-white mb-4">יצירת קשר בנושא נגישות</h2>
            <div data-ev-id="ev_37e50a31d1" className="bg-primary/[0.04] border border-primary/10 rounded-xl p-6">
              <p data-ev-id="ev_1e686660d8" className="text-white/70 text-sm leading-relaxed mb-4">
                אם נתקלתם בבעיית נגישות באתר, או שיש לכם הצעות לשיפור הנגישות, נשמח לשמוע.
                אנו מתחייבים לטפל בכל פנייה בנושא נגישות תוך 7 ימי עסקים.
              </p>
              <div data-ev-id="ev_08158786d8" className="space-y-3">
                <div data-ev-id="ev_c56bb97acf" className="flex items-center gap-3 text-white/80 text-sm">
                  <Mail className="w-4 h-4 text-primary" aria-hidden="true" />
                  <span data-ev-id="ev_819ee857f3">רכז/ת נגישות: </span>
                  <a data-ev-id="ev_3f80dbb7cc"
                  href="mailto:accessibility@nvision.me"
                  className="text-primary hover:text-primary/80 underline underline-offset-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded">

                    accessibility@nvision.me
                  </a>
                  <span className="text-white/70"> — רכז/ת נגישות: נדב פוקס</span>
                </div>
                <div data-ev-id="ev_7248615be1" className="flex items-center gap-3 text-white/80 text-sm">
                  <MessageCircle className="w-4 h-4 text-green-400" aria-hidden="true" />
                  <span data-ev-id="ev_58806584da">וואטסאפ בלבד: </span>
                  <a data-ev-id="ev_ffee9f0ece"
                  href="https://wa.me/972535300952"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-400 hover:text-green-300 underline underline-offset-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400 rounded"
                  dir="ltr">

                    +972-53-530-0952
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Standard info */}
          <section data-ev-id="ev_3d38961562" aria-labelledby="standard-heading">
            <h2 data-ev-id="ev_cdb2f293e3" id="standard-heading" className="text-lg font-semibold text-white mb-4">תקנים ורגולציה</h2>
            <div data-ev-id="ev_621559fb17" className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-6 text-white/65 text-sm leading-relaxed space-y-2">
              <p data-ev-id="ev_d53ef0fbf2">• <strong data-ev-id="ev_094402a053" className="text-white/80">תקן ישראלי ת"י 5568</strong> — נגישות אתרי אינטרנט, המבוסס על WCAG 2.1</p>
              <p data-ev-id="ev_ea2fec0a0a">• <strong data-ev-id="ev_3340061978" className="text-white/80">רמת עמידה: AA</strong> — הרמה הנדרשת בחוק לכל אתר המספק שירות או מידע לציבור בישראל</p>
              <p data-ev-id="ev_e3203547fc">• <strong data-ev-id="ev_6cadad6c15" className="text-white/80">חוק שוויון זכויות לאנשים עם מוגבלות</strong>, התשנ"ח-1998, ותקנות הנגישות לשירותי אינטרנט, התשע"ג-2013</p>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer data-ev-id="ev_40cb136268" role="contentinfo" className="mt-12 pb-8 text-center">
          <div data-ev-id="ev_37dd54a947" className="flex items-center justify-center flex-wrap gap-x-4 gap-y-2 text-xs">
            <Link
              to="/privacy"
              className="text-white/60 hover:text-white/70 underline underline-offset-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded">

              מדיניות פרטיות
            </Link>
            <span data-ev-id="ev_4c5fdd20d7" className="text-white/25" aria-hidden="true">|</span>
            <span data-ev-id="ev_8bd0ed065c" className="text-white/60" lang="en">nVision Digital AI © {new Date().getFullYear()}</span>
          </div>
        </footer>
      </div>
    </div>);

};

export default Accessibility;