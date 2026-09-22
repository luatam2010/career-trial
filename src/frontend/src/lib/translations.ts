/**
 * Flat, keyed translation dictionary for the whole Career Trial site.
 *
 * Keys are dotted namespaces (`nav.*`, `hero.*`, `pricing.*`, …) so page tasks
 * can add their own keys without touching the provider. Every key MUST exist in
 * both `en` and `vi` — `t()` falls back to the key itself when a lookup misses.
 */

export type Language = "en" | "vi";

export const LANGUAGES: readonly Language[] = ["en", "vi"] as const;

export const LANGUAGE_LABELS: Record<Language, string> = {
  en: "EN",
  vi: "VI",
};

/** Human-readable language names, used for the switcher's accessible labels. */
export const LANGUAGE_NAMES: Record<Language, string> = {
  en: "English",
  vi: "Tiếng Việt",
};

export const translations: Record<Language, Record<string, string>> = {
  en: {
    /* ---------------------------------------------------------------- brand */
    "brand.name": "Career Trial",
    "brand.tagline": "Try the work before you choose the career",
    "brand.blurb":
      "Career Trial gives Vietnamese students a safe place to test real work, build evidence of what they can do, and choose a direction with confidence.",

    /* ------------------------------------------------------------ nav / shell */
    "nav.howItWorks": "How It Works",
    "nav.careerTrial": "Career Trial",
    "nav.evidence": "Evidence",
    "nav.businessModel": "Business Model",
    "nav.ourTeam": "Our Team",
    "nav.getInvolved": "Get involved",
    "nav.becomeMentor": "Become a Mentor",
    "nav.becomeMentorHint": "Support student feedback",
    "nav.partnerWithUs": "Partner with us",
    "nav.partnerWithUsHint": "Schools, companies & organisations",
    "nav.studentLogin": "Student Login",
    "nav.exploreCareer": "Explore Career",
    "nav.studentArea": "My Student Area",
    "nav.signOut": "Sign out",
    "nav.openMenu": "Open navigation menu",
    "nav.closeMenu": "Close navigation menu",
    "nav.languageSwitcher": "Change language",
    "nav.switchToEnglish": "Switch to English",
    "nav.switchToVietnamese": "Switch to Vietnamese",
    "nav.logoHome": "Career Trial — back to top of the Main Page",
    "nav.signedInAs": "Signed in as",

    /* ---------------------------------------------------------------- footer */
    "footer.quickLinks": "Quick links",
    "footer.forStudents": "For students",
    "footer.forPartners": "For partners",
    "footer.exploreTrials": "Explore career trials",
    "footer.seeEvidence": "See student evidence",
    "footer.pricing": "Pilot pricing",
    "footer.becomeMentor": "Become a mentor",
    "footer.partnerWithUs": "Partner with us",
    "footer.rights": "All rights reserved.",
    "footer.attribution": "Built with love using caffeine.ai",

    /* ------------------------------------------------------------------ hero */
    "hero.eyebrow": "Career orientation, rebuilt",
    "hero.title": "Try the work before you choose the career",
    "hero.subtitle":
      "Short, guided career trials let students experience real tasks, collect evidence of their strengths, and make a first career decision they can actually defend.",
    "hero.primaryCta": "Explore Career",
    "hero.secondaryCta": "See student evidence",
    "hero.stat1Value": "12+",
    "hero.stat1Label": "Career trials ready to start",
    "hero.stat2Value": "7 days",
    "hero.stat2Label": "Free trial on every pilot plan",
    "hero.stat3Value": "100%",
    "hero.stat3Label": "Evidence students can share",
    "hero.imageAlt":
      "Students working through a guided career trial together at a shared table",

    /* --------------------------------------------------------- how it works */
    "howItWorks.eyebrow": "How It Works",
    "howItWorks.title": "Four steps from curiosity to a confident decision",
    "howItWorks.subtitle":
      "Every trial follows the same rhythm, so students always know what happens next.",
    "howItWorks.step1Title": "Explore",
    "howItWorks.step1Body":
      "Browse career trials by field, skill and time commitment. Each one shows the real tasks before you commit.",
    "howItWorks.step2Title": "Trial",
    "howItWorks.step2Body":
      "Work through a short, guided brief with clear deliverables and a checklist you can tick off as you go.",
    "howItWorks.step3Title": "Reflect",
    "howItWorks.step3Body":
      "Score what you enjoyed and what you found hard. Mentors add feedback on the work you produced.",
    "howItWorks.step4Title": "Decide",
    "howItWorks.step4Body":
      "Turn the trial into an evidence card you can share with schools, employers and your own family.",

    /* ------------------------------------------------------- evidence preview */
    "evidence.eyebrow": "Evidence",
    "evidence.title": "Proof of what students can actually do",
    "evidence.subtitle":
      "Every completed trial produces a shareable evidence card: the work, the scores, and the mentor's read on it.",
    "evidence.viewAll": "View all evidence",
    "evidence.empty": "No evidence cards have been published yet.",
    "evidence.emptyHint":
      "Complete a career trial to publish the first evidence card.",
    "evidence.ratingLabel": "Mentor rating",
    "evidence.completionLabel": "Completion",
    "evidence.aspectsLabel": "Aspect scores",
    "evidence.testerLabel": "Student",

    /* --------------------------------------------------------- business model */
    "businessModel.eyebrow": "Business Model",
    "businessModel.title":
      "Affordable for students, sustainable for the platform",
    "businessModel.subtitle":
      "Students pay a small pilot fee, schools and companies sponsor cohorts, and mentors earn recognition for the feedback they give.",
    "businessModel.stream1Title": "Student pilot fees",
    "businessModel.stream1Body":
      "Low-cost access to every career trial, with a free seven-day trial so cost is never the first barrier.",
    "businessModel.stream2Title": "School & company licences",
    "businessModel.stream2Body":
      "Institutions buy cohort access and receive aggregated evidence on the skills their students are building.",
    "businessModel.stream3Title": "Mentor network",
    "businessModel.stream3Body":
      "Industry mentors review student work, building a verified record of the feedback they contribute.",

    /* ----------------------------------------------------------- pilot pricing */
    "pricing.eyebrow": "Pilot Pricing",
    "pricing.title": "Five pilot plans, one free week",
    "pricing.subtitle":
      "Start with the free entry plan, then upgrade only when a student needs mentor feedback or a full bundle.",
    "pricing.openModal": "See pilot pricing",
    "pricing.modalTitle": "Pilot pricing plans",
    "pricing.modalSubtitle":
      "Five plans for the pilot programme. Every plan starts with a seven-day free trial.",
    "pricing.trialCalloutTitle": "7-day free trial",
    "pricing.trialCalloutBody":
      "Try any pilot plan free for seven days. Cancel any time before the trial ends and you pay nothing.",
    "pricing.trialCalloutCta": "Start free trial",
    "pricing.close": "Close pricing",
    "pricing.featuresLabel": "What's included",
    "pricing.plan1Name": "Entry",
    "pricing.plan1Price": "FREE",
    "pricing.plan1Description":
      "For students who want to look around and try their first career trial.",
    "pricing.plan1Feature1": "Browse every career trial",
    "pricing.plan1Feature2": "One active trial at a time",
    "pricing.plan1Feature3": "Personal progress tracking",
    "pricing.plan2Name": "Most Practical",
    "pricing.plan2Price": "VND 39,000 – 69,000",
    "pricing.plan2Description":
      "For students who are ready to work through trials properly and keep the evidence.",
    "pricing.plan2Feature1": "Unlimited career trials",
    "pricing.plan2Feature2": "Downloadable evidence cards",
    "pricing.plan2Feature3": "Deliverable templates",
    "pricing.plan3Name": "Mentor",
    "pricing.plan3Price": "VND 99,000 – 149,000",
    "pricing.plan3Description":
      "For students who want a real professional to review the work they produce.",
    "pricing.plan3Feature1": "Everything in Most Practical",
    "pricing.plan3Feature2": "Written mentor feedback",
    "pricing.plan3Feature3": "One review call per trial",
    "pricing.plan4Name": "Bundle",
    "pricing.plan4Price": "VND 149,000 – 199,000",
    "pricing.plan4Description":
      "For students exploring several directions who want the full evidence portfolio.",
    "pricing.plan4Feature1": "Everything in Mentor",
    "pricing.plan4Feature2": "Portfolio of five trials",
    "pricing.plan4Feature3": "Priority mentor matching",
    "pricing.plan5Name": "School",
    "pricing.plan5Price": "NEGOTIATED",
    "pricing.plan5Description":
      "For schools, companies and organisations running a cohort of students.",
    "pricing.plan5Feature1": "Cohort seats and dashboards",
    "pricing.plan5Feature2": "Aggregated skills reporting",
    "pricing.plan5Feature3": "Dedicated onboarding support",

    /* -------------------------------------------------------------- our team */
    "team.eyebrow": "Our Team",
    "team.title": "Built by educators, engineers and industry mentors",
    "team.subtitle":
      "A small team that has run career programmes in Vietnamese schools and hired from them.",
    "team.member1Name": "Linh Nguyen",
    "team.member1Role": "Programme Lead",
    "team.member1Bio":
      "Former secondary-school careers adviser who designed the trial briefs.",
    "team.member2Name": "Minh Tran",
    "team.member2Role": "Product & Engineering",
    "team.member2Bio":
      "Builds the platform and the evidence tools students use every day.",
    "team.member3Name": "Dr. Hoa Pham",
    "team.member3Role": "Research & Assessment",
    "team.member3Bio":
      "Turns trial outcomes into scores schools and employers can trust.",
    "team.member4Name": "Quang Le",
    "team.member4Role": "Mentor Network",
    "team.member4Bio":
      "Recruits and supports the industry mentors who review student work.",

    /* --------------------------------------------------- path to profitability */
    "path.eyebrow": "Path to Profitability",
    "path.title": "From pilot cohort to a self-sustaining network",
    "path.subtitle":
      "Each phase funds the next, so growth never depends on a single revenue stream.",
    "path.phase1Title": "Phase 1 — Pilot",
    "path.phase1Body":
      "Free and low-cost student plans prove that trials change career decisions.",
    "path.phase2Title": "Phase 2 — Cohorts",
    "path.phase2Body":
      "School and company licences bring predictable revenue and larger evidence sets.",
    "path.phase3Title": "Phase 3 — Network",
    "path.phase3Body":
      "A paid mentor network and employer partnerships make the platform self-sustaining.",

    /* ------------------------------------------------------ join the ecosystem */
    "join.eyebrow": "Join the Ecosystem",
    "join.title": "There is a place for you in Career Trial",
    "join.subtitle":
      "Students, mentors, schools and companies all shape what the next cohort learns.",
    "join.studentsTitle": "Students",
    "join.studentsBody":
      "Start a free trial, work through a real brief, and keep the evidence you earn.",
    "join.studentsCta": "Explore Career",
    "join.mentorsTitle": "Mentors",
    "join.mentorsBody":
      "Review student work and give the feedback that helps someone choose well.",
    "join.mentorsCta": "Become a Mentor",
    "join.partnersTitle": "Schools & companies",
    "join.partnersBody":
      "Run a cohort and see the skills your students are building, in aggregate.",
    "join.partnersCta": "Partner with us",

    /* --------------------------------------------------------- career trial page */
    "trials.eyebrow": "Career Trial",
    "trials.title": "Choose a trial and start working",
    "trials.description":
      "Each trial is a short, guided piece of real work with clear deliverables and a checklist.",
    "trials.loading": "Loading career trials…",
    "trials.error": "We could not load the career trials. Please try again.",
    "trials.retry": "Try again",
    "trials.empty": "No career trials are published yet.",
    "trials.emptyHint": "New trials are added regularly — check back soon.",
    "trials.daysLabel": "Days to complete",
    "trials.startTrial": "Start this trial",
    "trials.viewTrial": "View trial",
    "trials.enrolled": "Enrolled",
    "trials.tagsLabel": "Tags",
    "trials.briefLabel": "The brief",
    "trials.deliverablesLabel": "Deliverables",
    "trials.checklistLabel": "Checklist",
    "trials.notFound": "That career trial could not be found.",
    "trials.backToTrials": "Back to all trials",

    /* ------------------------------------------------------------- evidence page */
    "evidencePage.eyebrow": "Evidence",
    "evidencePage.title": "Evidence from real student trials",
    "evidencePage.description":
      "Every card below comes from a completed trial, scored by the student and reviewed by a mentor.",
    "evidencePage.loading": "Loading evidence…",
    "evidencePage.error": "We could not load the evidence. Please try again.",
    "evidencePage.retry": "Try again",
    "evidencePage.empty": "No evidence has been published yet.",
    "evidencePage.emptyHint":
      "Evidence cards appear here as soon as students complete their trials.",

    /* --- evidence wall: filters, sorting and aspect bars (added by evidence page task) --- */
    "evidencePage.testerLabel": "Student",
    "evidencePage.completionLabel": "Completion",
    "evidencePage.ratingLabel": "Mentor rating",
    "evidencePage.aspectsLabel": "Aspect scores",
    "evidencePage.scaleLow": "Low",
    "evidencePage.scaleHigh": "High",
    "evidencePage.countLabel": "Evidence cards shown",
    "evidencePage.filterCareerLabel": "Career",
    "evidencePage.filterAllCareers": "All careers",
    "evidencePage.sortLabel": "Sort by",
    "evidencePage.sortCompletion": "Highest completion",
    "evidencePage.sortRating": "Highest rating",
    "evidencePage.sortName": "Tester name (A–Z)",
    "evidencePage.noMatch": "No evidence matches this career yet.",
    "evidencePage.noMatchHint":
      "Try another career, or clear the filter to see every published card.",
    "evidencePage.clearFilter": "Show all careers",
    /* --- end evidence wall keys --- */

    /* ------------------------------------------------------------ student area */
    "student.eyebrow": "Student Area",
    "student.title": "Your trials and evidence",
    "student.description":
      "Track the trials you have started and the evidence you have collected.",
    "student.signInTitle": "Sign in to open your student area",
    "student.signInBody":
      "Your trials, progress and evidence are tied to your Internet Identity. Sign in to continue where you left off.",
    "student.signInCta": "Student Login",
    "student.signingIn": "Signing in…",
    "student.enrollmentsTitle": "My trials",
    "student.enrollmentsEmpty": "You have not started a trial yet.",
    "student.enrollmentsEmptyHint":
      "Browse the career trials and start your first one.",
    "student.evidenceTitle": "My evidence",
    "student.evidenceEmpty": "You have not collected any evidence yet.",
    "student.evidenceEmptyHint":
      "Finish a trial to publish your first evidence card.",
    "student.progressLabel": "Progress",
    "student.startedLabel": "Started",
    "student.updatedLabel": "Last updated",
    "student.updateProgress": "Update progress",
    "student.saveProgress": "Save progress",
    "student.saving": "Saving…",
    "student.progressSaved": "Progress saved.",
    "student.loading": "Loading your student area…",
    "student.error": "We could not load your student area. Please try again.",
    "student.retry": "Try again",
    "student.browseTrials": "Browse career trials",

    /* ------------------------------------------------------------ enroll errors */
    "enroll.unknownTrial": "That career trial no longer exists.",
    "enroll.alreadyEnrolled": "You are already enrolled in this trial.",
    "enroll.notEnrolled": "You are not enrolled in that trial.",
    "enroll.notSignedIn": "Please sign in to continue.",
    "enroll.invalidProgress": "Progress must be between 0 and 100.",
    "enroll.genericError": "Something went wrong. Please try again.",

    /* ------------------------------------------------------------ common labels */
    "common.loading": "Loading…",
    "common.error": "Something went wrong.",
    "common.retry": "Try again",
    "common.close": "Close",
    "common.cancel": "Cancel",
    "common.confirm": "Confirm",
    "common.back": "Back",
    "common.next": "Next",
    "common.of": "of",
    "common.free": "Free",
    "common.learnMore": "Learn more",

    /* ==================================================== career trial page v2
       Added by the Career Trial page task. Keep this block self-contained. */
    "careerTrial.title": "Choose a career trial and start real work",
    "careerTrial.subtitle":
      "Short, guided trials that show you what the work is actually like — before you commit to a direction.",
    "careerTrial.countLabel": "trials available",
    "careerTrial.countOne": "trial available",
    "careerTrial.searchLabel": "Search trials",
    "careerTrial.searchPlaceholder": "Search by career name…",
    "careerTrial.searchClear": "Clear search",
    "careerTrial.filterLabel": "Filter by skill",
    "careerTrial.filterAll": "All skills",
    "careerTrial.clearFilters": "Clear filters",
    "careerTrial.resultsLabel": "Showing",
    "careerTrial.resultsOf": "of",
    "careerTrial.emptyTitle": "No trials match your filters",
    "careerTrial.emptyBody":
      "Try a different skill or clear the search to see every trial again.",
    "careerTrial.emptyAction": "Clear all filters",
    "careerTrial.daysBadge": "days",
    "careerTrial.startTrial": "Start Trial",
    "careerTrial.comingNextTitle": "Coming next",
    "careerTrial.comingNextBadge": "In development",
    "careerTrial.comingNextBody":
      "We are writing the brief for this career right now. Check back soon — it will be ready to start.",
    "careerTrial.modalEyebrow": "Trial brief",
    "careerTrial.modalClose": "Close trial brief",
    "careerTrial.modalBriefLabel": "The brief",
    "careerTrial.modalChecklistLabel": "Task checklist",
    "careerTrial.modalDeliverablesLabel": "What you will deliver",
    "careerTrial.modalDaysLabel": "Estimated time",
    "careerTrial.modalSkillsLabel": "Skills you will build",
    "careerTrial.modalStart": "Start this trial",
    "careerTrial.modalStarting": "Starting…",
    "careerTrial.modalSignIn": "Sign in to start",
    "careerTrial.modalSuccessTitle": "You are enrolled",
    "careerTrial.modalSuccessBody":
      "This trial is now in your student area. Open it any time to track your progress.",
    "careerTrial.modalSuccessCta": "Go to my student area",
    "careerTrial.modalAlreadyTitle": "Already enrolled",
    "careerTrial.modalAlreadyBody":
      "You have already started this trial. Pick up where you left off in your student area.",
    "careerTrial.modalAlreadyCta": "Open my student area",
    "careerTrial.modalErrorTitle": "We could not start this trial",
    "careerTrial.modalRetry": "Try again",
    "careerTrial.modalDone": "Done",

    /* ------------------------------------------------------- main page: hero */
    "main.heroEyebrow": "Career orientation, rebuilt",
    "main.heroTitle": "Try the work before you choose the career",
    "main.heroSubtitle":
      "Career Trial gives students short, guided experiences of real work — so a career decision is based on evidence, not guesswork.",
    "main.heroCta": "Explore Career",
    "main.heroVisualLabel": "A career trial in progress",
    "main.heroTrialCardTitle": "Career Trial",
    "main.heroTrialCardCareer": "Product Designer",
    "main.heroTrialCardTask": "Redesign an onboarding screen",
    "main.heroTrialCardProgress": "Progress",
    "main.heroTrialCardProgressValue": "72%",
    "main.heroEvidenceCardTitle": "Evidence Card",
    "main.heroEvidenceCardStudent": "Linh Giang",
    "main.heroEvidenceCardRating": "4.6 / 5",
    "main.heroEvidenceCardAspect1": "Problem solving",
    "main.heroEvidenceCardAspect2": "Communication",
    "main.heroEvidenceCardAspect3": "Craft",
    "main.heroEvidenceCardAspect4": "Ownership",

    /* ------------------------------------------- main page: how it works */
    "main.howEyebrow": "How It Works",
    "main.howTitle": "Four steps from curiosity to a confident decision",
    "main.howSubtitle":
      "Every Career Trial follows the same rhythm, so students always know what happens next.",
    "main.howStep1Title": "Explore",
    "main.howStep1Body":
      "Browse Career Trials by field, skill and time commitment — and see the real tasks before you commit.",
    "main.howStep2Title": "Trial",
    "main.howStep2Body":
      "Work through a short, guided brief with clear deliverables and a checklist you can tick off as you go.",
    "main.howStep3Title": "Reflect",
    "main.howStep3Body":
      "Score what you enjoyed and what you found hard, then read the mentor's feedback on the work you produced.",
    "main.howStep4Title": "Decide",
    "main.howStep4Body":
      "Turn the trial into an evidence card you can share with schools, employers and your own family.",

    /* --------------------------------------- main page: evidence preview */
    "main.evidenceEyebrow": "Evidence Card",
    "main.evidenceCardTitle": "Career Evidence Card",
    "main.evidenceTitle": "Every trial ends with proof of what you can do",
    "main.evidenceSubtitle":
      "A Career Evidence Card records the trial you completed, how far you got, and how a mentor rated the work. It is yours to keep and share.",
    "main.evidenceCta": "See student evidence",
    "main.evidenceCardStudent": "Tuan Duy",
    "main.evidenceCardCareer": "Data Analyst",
    "main.evidenceCardCompletion": "Completion",
    "main.evidenceCardRating": "Mentor rating",
    "main.evidenceCardAspects": "Aspect scores",
    "main.evidenceCardAspect1": "Analytical thinking",
    "main.evidenceCardAspect2": "Attention to detail",
    "main.evidenceCardAspect3": "Communication",
    "main.evidenceCardAspect4": "Initiative",
    "main.evidenceCardVerified": "Mentor reviewed",

    /* ----------------------------------------- main page: business model */
    "main.businessEyebrow": "Business Model",
    "main.businessTitle": "Who uses Career Trial, and who pays for it",
    "main.businessSubtitle":
      "Students get the experience. Schools, families and companies fund access — each for a different reason.",
    "main.businessUsersLabel": "Main Users",
    "main.businessPayersLabel": "Who can pay?",
    "main.businessUser1": "High-school students",
    "main.businessUser1Body":
      "Students who are about to choose a subject combination, a university major or a first job, and want to test a direction before committing to it.",
    "main.businessUser2": "Parents",
    "main.businessUser2Body":
      "Parents who want to support a decision with real experience instead of second-hand advice, and who are willing to pay for a structured programme.",
    "main.businessUser3": "Schools",
    "main.businessUser3Body":
      "Schools that need career-orientation and experiential-learning activities they can run for a whole cohort, with evidence of what students gained.",
    "main.businessUser4": "Companies",
    "main.businessUser4Body":
      "Companies that want young people to understand their industry early, and that are willing to sponsor or co-create a trial to reach future talent.",
    "main.businessPayer1": "Schools — Career-orientation",
    "main.businessPayer1Body":
      "Schools purchase Career Trial programmes for groups of students as part of career-orientation or experiential-learning activities.",
    "main.businessPayer2": "Parents / Students — Premium individual Trials",
    "main.businessPayer2Body":
      "Families pay for individual Trials, Trial bundles, deeper mentor feedback, or a more complete portfolio experience.",
    "main.businessPayer3": "Companies — Sponsored or co-created Trials",
    "main.businessPayer3Body":
      "Companies sponsor or co-create a Career Trial to help young people understand real roles, industries and future skills.",
    "main.revenue1Index": "01",
    "main.revenue1Title": "School Packages",
    "main.revenue1Badge": "Group Revenue",
    "main.revenue1Body":
      "Schools can purchase Career Trial programmes for groups of students as part of career-orientation or experiential-learning activities.",
    "main.revenue2Index": "02",
    "main.revenue2Title": "Premium Career Trials",
    "main.revenue2Badge": "Direct Revenue",
    "main.revenue2Body":
      "Students or parents can pay for individual Trials, Trial bundles, deeper mentor feedback, or a more complete portfolio experience.",
    "main.revenue3Index": "03",
    "main.revenue3Title": "Company Partnerships",
    "main.revenue3Badge": "Partnership Revenue",
    "main.revenue3Body":
      "Companies can sponsor or co-create a Career Trial to help young people understand real roles, industries and future skills.",

    /* ------------------------------------------ main page: pilot pricing */
    "main.pricingEyebrow": "Pilot Pricing",
    "main.pricingTitle": "Simple prices for the first market test.",
    "main.pricingBody":
      "These are trial prices for the pilot stage. We will adjust them after testing real willingness to pay with students, parents and schools.",
    "main.pricingBadge": "Pilot prices — not final",
    "main.pricingOpenModal": "Open pricing details",
    "main.pricingPlan1Index": "01",
    "main.pricingPlan1Category": "Entry",
    "main.pricingPlan1Title": "Career Trial Intro",
    "main.pricingPlan1Price": "FREE",
    "main.pricingPlan1Body":
      "A short introductory experience to help students understand how Career Trial works.",
    "main.pricingPlan1Feature1": "1 short career challenge",
    "main.pricingPlan1Feature2": "Basic reflection",
    "main.pricingPlan1Feature3": "No mentor feedback",
    "main.pricingPlan2Index": "02",
    "main.pricingPlan2Category": "Most Practical",
    "main.pricingPlan2Title": "1 Career Trial",
    "main.pricingPlan2Price": "VND 39,000 – 69,000",
    "main.pricingPlan2Body":
      "A complete career experience with realistic tasks and a final student product.",
    "main.pricingPlan2Feature1": "1 full Career Trial",
    "main.pricingPlan2Feature2": "Career Evidence Card",
    "main.pricingPlan2Feature3": "Basic assessment",
    "main.pricingPlan3Index": "03",
    "main.pricingPlan3Category": "Mentor",
    "main.pricingPlan3Title": "Career Trial + Mentor Feedback",
    "main.pricingPlan3Price": "VND 99,000 – 149,000",
    "main.pricingPlan3Body":
      "For students who want professional feedback on their work and stronger reflection.",
    "main.pricingPlan3Feature1": "1 full Career Trial",
    "main.pricingPlan3Feature2": "Mentor feedback",
    "main.pricingPlan3Feature3": "Career Evidence Card",
    "main.pricingPlan4Index": "04",
    "main.pricingPlan4Category": "Bundle",
    "main.pricingPlan4Title": "3-Career Trial Bundle",
    "main.pricingPlan4Price": "VND 149,000 – 199,000",
    "main.pricingPlan4Body":
      "Compare several career experiences before making a study or career decision.",
    "main.pricingPlan4Feature1": "3 Career Trials",
    "main.pricingPlan4Feature2": "3 Evidence Cards",
    "main.pricingPlan4Feature3": "Cross-career reflection",
    "main.pricingPlan5Index": "05",
    "main.pricingPlan5Category": "School",
    "main.pricingPlan5Title": "School Pilot Package",
    "main.pricingPlan5Price": "NEGOTIATED",
    "main.pricingPlan5Body":
      "The first school pilot may be free or low-cost in exchange for feedback and evaluation data.",
    "main.pricingPlan5Feature1": "Group student access",
    "main.pricingPlan5Feature2": "Pilot support",
    "main.pricingPlan5Feature3": "School feedback report",

    /* ----------------------------------------------- main page: our team */
    "main.teamEyebrow": "The students behind Career Trial",
    "main.teamTitle": "We are part of the problem we want to solve.",
    "main.teamBody":
      "As students ourselves, career orientation is not an abstract topic. It is a decision we are also preparing to make.",
    "main.teamMember1Initials": "LG",
    "main.teamMember1Name": "Linh Giang",
    "main.teamMember1Role": "Team Leader & Communication",
    "main.teamMember1Grade": "Grade 11",
    "main.teamMember1Bio":
      "Leads the team, coordinates project development, and represents the project in public speaking and pitching.",
    "main.teamMember2Initials": "TD",
    "main.teamMember2Name": "Tuan Duy",
    "main.teamMember2Role": "Research & Strategy",
    "main.teamMember2Grade": "Grade 10",
    "main.teamMember2Bio":
      "Focuses on research, critical thinking, argument development, and independent exploration of new ideas.",
    "main.teamMember3Initials": "TM",
    "main.teamMember3Name": "Thanh Mai",
    "main.teamMember3Role": "Technology & Product Development",
    "main.teamMember3Grade": "Grade 9",
    "main.teamMember3Bio":
      "Contributes programming and software skills to the website, product flow, and digital development of Career Trial.",

    /* ------------------------------------ main page: path to profitability */
    "main.pathEyebrow": "Path to Profitability",
    "main.pathTitle": "Create once. Improve continuously. Serve many students.",
    "main.pathBody":
      "The main cost is creating high-quality Career Trials and mentor systems. Once a Trial is built, the same digital content can be used by many students and schools. As the number of users grows, revenue can increase faster than content-delivery costs.",
    "main.pathStep1Title": "Build and test a Career Trial",
    "main.pathStep1Body":
      "Design one high-quality trial and run it with real students to prove it changes how they think about the work.",
    "main.pathStep2Title": "Reuse it across schools and students",
    "main.pathStep2Body":
      "The same digital content serves every new cohort, so the cost of each additional student stays low.",
    "main.pathStep3Title": "Add more Trials and partners",
    "main.pathStep3Body":
      "Companies and professionals co-create new trials, widening the catalogue without widening our costs.",
    "main.pathStep4Title": "Grow recurring revenue",
    "main.pathStep4Body":
      "School packages and premium plans turn one-off pilots into predictable, repeating income.",

    /* ---------------------------------------- main page: join ecosystem */
    "main.ecosystemEyebrow": "Join the Career Trial Ecosystem",
    "main.ecosystemTitle":
      "Real career learning needs real people and real partners.",
    "main.ecosystemBody":
      "Career Trial grows through collaboration with professionals, schools, companies and organisations that want to help students understand the world of work before making major decisions.",
    "main.ecosystemMentorTitle": "Become a Career Mentor",
    "main.ecosystemMentorBody":
      "Review student work, give practical feedback, or help us check whether a Career Trial reflects real workplace expectations.",
    "main.ecosystemMentorTag1": "Flexible",
    "main.ecosystemMentorTag2": "Remote-friendly",
    "main.ecosystemMentorTag3": "Meaningful impact",
    "main.ecosystemMentorCta": "Register as a mentor",
    "main.ecosystemPartnerTitle": "Partner with Career Trial",
    "main.ecosystemPartnerBody":
      "Schools, companies, professional groups and education organisations can co-create Trials, sponsor access, provide experts, or run pilots with us.",
    "main.ecosystemPartnerTag1": "Co-create Trials",
    "main.ecosystemPartnerTag2": "Pilot with schools",
    "main.ecosystemPartnerTag3": "Sponsor access",
    "main.ecosystemPartnerCta": "Explore partnership",

    /* ------------------------------------ main page: pricing disclaimer */
    "main.disclaimerTitle": "Important",
    "main.disclaimerBody":
      "Pricing has not been fixed yet. During the pilot, the team will test willingness to pay with schools and families before deciding the final price. This keeps the business model realistic and evidence-based.",

    /* ============================ student area (task: student page) ============================ */
    "studentArea.greeting": "Welcome back",
    "studentArea.principalLabel": "Signed in as",
    "studentArea.signOut": "Sign out",
    "studentArea.statTrials": "Trials started",
    "studentArea.statEvidence": "Evidence cards",
    "studentArea.privateTitle": "Your student area is private",
    "studentArea.privateBody":
      "Your trials, progress and evidence are tied to your Internet Identity, so only you can see them. Sign in to pick up where you left off.",
    "studentArea.oneFlowNote":
      "The same Student Login handles both new sign-ups and returning students — there is no separate registration step.",
    "studentArea.browseTrials": "Browse career trials",
    "studentArea.progressHeading": "Set your progress",
    "studentArea.progressHint":
      "Drag the slider to the percentage of the trial you have finished, then save.",
    "studentArea.progressSaved": "Progress saved.",
    "studentArea.progressError":
      "We could not save your progress. Please try again.",
    "studentArea.stepDecrease": "Decrease progress by 10 percent",
    "studentArea.stepIncrease": "Increase progress by 10 percent",
    "studentArea.aspectsHeading": "Aspect scores",
    "studentArea.ratingLabel": "Mentor rating",
    "studentArea.completionLabel": "Completion",
    "studentArea.lowLabel": "Low",
    "studentArea.highLabel": "High",
    "studentArea.evidenceEmptyCta": "Start a career trial",
    /* --- student results & display name (task: real results) --- */
    "studentArea.greetingNamed": "Welcome back, {name}",
    "studentArea.nameHeading": "Your name on evidence cards",
    "studentArea.nameHint":
      "This is the name that appears on every evidence card you publish, so mentors and schools know whose work they are reading.",
    "studentArea.nameLabel": "Display name",
    "studentArea.namePlaceholder": "e.g. Linh Giang",
    "studentArea.nameHelp":
      "Use the name you want schools and employers to see. Up to 60 characters.",
    "studentArea.nameSave": "Save name",
    "studentArea.nameSaving": "Saving…",
    "studentArea.nameSaved": "Your display name is saved.",
    "studentArea.nameRequired": "Enter a name before saving.",
    "studentArea.nameTooLong":
      "That name is too long. Keep it under 60 characters.",
    "studentArea.nameInvalid":
      "That name could not be accepted. Use letters and spaces, without leading or trailing spaces.",
    "studentArea.nameNotSignedIn": "Please sign in again to save your name.",
    "studentArea.nameError": "We could not save your name. Please try again.",
    "studentArea.unnamedStudent": "Unnamed student",
    "studentArea.resultHeading": "Your result",
    "studentArea.scoreLabel": "Overall score",
    "studentArea.notTestedBadge": "Not yet tested",
    "studentArea.notTestedTitle": "You have not taken this test yet",
    "studentArea.notTestedBody":
      "Your completion and scores appear here automatically once you finish the trial test. There is nothing to fill in by hand.",
    "studentArea.takeTest": "Take the trial test",
    "studentArea.testerLabel": "Student",
    /* ========================== end student area ========================== */

    /* ==================== trial knowledge test (task: trial test) ==================== */
    "test.eyebrow": "Knowledge test",
    "test.title": "Show what you learned in {trial}",
    "test.intro":
      "Five short questions. Answer every one, then submit — the backend scores your attempt and publishes your evidence card.",
    "test.questionLabel": "Question",
    "test.ofLabel": "of",
    "test.aspectLabel": "Aspect",
    "test.optionLabel": "Answer option",
    "test.back": "Back",
    "test.next": "Next",
    "test.submit": "Submit answers",
    "test.submitting": "Scoring your answers…",
    "test.retake": "Retake the test",
    "test.retakeHint":
      "You can retake this test any time. Your latest attempt replaces the previous result.",
    "test.answeredLabel": "answered",
    "test.unansweredPrompt":
      "Answer every question before submitting. Still unanswered:",
    "test.unansweredQuestion": "Question {number}",
    "test.loading": "Loading the test…",
    "test.loadError": "We could not load this test. Please try again.",
    "test.retry": "Try again",
    "test.empty": "This trial does not have a test yet.",
    "test.emptyHint": "Check back soon — the questions are being written.",
    "test.signInTitle": "Sign in to take the test",
    "test.signInBody":
      "Your answers, score and evidence card are tied to your Internet Identity. Sign in to start the test.",
    "test.signInCta": "Student Login",
    "test.signingIn": "Signing in…",
    "test.notEnrolledTitle": "Enrol in this trial first",
    "test.notEnrolledBody":
      "The test opens once you have joined the trial. Enrol from the trial brief, then come back to start.",
    "test.notEnrolledCta": "Back to the trial brief",
    "test.unknownTrialTitle": "This trial is no longer available",
    "test.unknownTrialBody":
      "We could not find the trial for this test. Close this panel and pick another trial.",
    "test.invalidAnswerTitle": "One answer could not be read",
    "test.invalidAnswerBody":
      "Something went wrong with one of your answers. Please review your choices and submit again.",
    "test.incompleteTitle": "Some questions are still unanswered",
    "test.incompleteBody":
      "Answer the questions listed below, then submit your attempt again.",
    "test.genericErrorTitle": "We could not score your attempt",
    "test.genericErrorBody":
      "Something went wrong while submitting. Your answers are still here — please try again.",
    "test.resultEyebrow": "Attempt scored",
    "test.resultTitle": "Your result is ready",
    "test.resultBody":
      "The backend scored your attempt automatically and published an evidence card to your student area.",
    "test.scoreLabel": "Score",
    "test.scoreOutOf": "out of {total}",
    "test.completionLabel": "Completion",
    "test.aspectsLabel": "Per-aspect breakdown",
    "test.evidenceCta": "View my evidence",
    "test.evidenceHint":
      "Your new evidence card is on the Evidence page, alongside every published card.",
    "test.close": "Close test",
    "test.startTest": "Start the test",
    "test.startTestHint":
      "Five multiple-choice questions, scored automatically when you submit.",
    "test.retakeResult": "Retake",
    "test.attemptLabel": "Attempt",
    /* ================== end trial knowledge test ================== */

    /* ============ evidence wall: own-result markers (task: evidence) ============ */
    "evidencePage.scoreLabel": "Overall score",
    "evidencePage.ownCardBadge": "Your published result",
    "evidencePage.ownSummary": "Your published results on this wall",
    "evidencePage.showMineOnly": "Show only my results",
    "evidencePage.showAllCards": "Show all results",
    "evidencePage.noMine": "You have no published evidence yet.",
    "evidencePage.noMineHint":
      "Finish a career trial to publish your first evidence card here.",
    /* ================ end own-result markers ================ */

    /* ====== trial test result → evidence navigation (task: test flow fixes) ====== */
    "test.viewEvidenceAria": "View my evidence on the Evidence page",
    "test.viewEvidenceOpening": "Opening your evidence…",
    /* ================ end test flow fixes ================ */

    /* ====== student area: real per-enrolment result (task: real results) ====== */
    "studentArea.resultLoading": "Loading your result…",
    /* ================ end real per-enrolment result ================ */
  },

  vi: {
    /* ---------------------------------------------------------------- brand */
    "brand.name": "Career Trial",
    "brand.tagline": "Thử việc thật trước khi chọn nghề",
    "brand.blurb":
      "Career Trial cho học sinh Việt Nam một không gian an toàn để thử những công việc thật, ghi lại bằng chứng về năng lực của mình và chọn hướng đi một cách tự tin.",

    /* ------------------------------------------------------------ nav / shell */
    "nav.howItWorks": "Cách hoạt động",
    "nav.careerTrial": "Thử nghề",
    "nav.evidence": "Bằng chứng",
    "nav.businessModel": "Mô hình kinh doanh",
    "nav.ourTeam": "Đội ngũ",
    "nav.getInvolved": "Tham gia cùng chúng tôi",
    "nav.becomeMentor": "Trở thành cố vấn",
    "nav.becomeMentorHint": "Đồng hành cùng phản hồi của học sinh",
    "nav.partnerWithUs": "Hợp tác với chúng tôi",
    "nav.partnerWithUsHint": "Trường học, doanh nghiệp & tổ chức",
    "nav.studentLogin": "Đăng nhập học sinh",
    "nav.exploreCareer": "Khám phá nghề nghiệp",
    "nav.studentArea": "Khu vực học sinh",
    "nav.signOut": "Đăng xuất",
    "nav.openMenu": "Mở menu điều hướng",
    "nav.closeMenu": "Đóng menu điều hướng",
    "nav.languageSwitcher": "Đổi ngôn ngữ",
    "nav.switchToEnglish": "Chuyển sang tiếng Anh",
    "nav.switchToVietnamese": "Chuyển sang tiếng Việt",
    "nav.logoHome": "Career Trial — về đầu trang chính",
    "nav.signedInAs": "Đang đăng nhập với",

    /* ---------------------------------------------------------------- footer */
    "footer.quickLinks": "Liên kết nhanh",
    "footer.forStudents": "Dành cho học sinh",
    "footer.forPartners": "Dành cho đối tác",
    "footer.exploreTrials": "Khám phá các bài thử nghề",
    "footer.seeEvidence": "Xem bằng chứng của học sinh",
    "footer.pricing": "Học phí thử nghiệm",
    "footer.becomeMentor": "Trở thành cố vấn",
    "footer.partnerWithUs": "Hợp tác với chúng tôi",
    "footer.rights": "Bảo lưu mọi quyền.",
    "footer.attribution": "Được tạo bằng caffeine.ai",

    /* ------------------------------------------------------------------ hero */
    "hero.eyebrow": "Định hướng nghề nghiệp, làm lại từ đầu",
    "hero.title": "Thử việc thật trước khi chọn nghề",
    "hero.subtitle":
      "Những bài thử nghề ngắn và có hướng dẫn giúp học sinh trải nghiệm công việc thật, ghi lại bằng chứng về điểm mạnh của mình và đưa ra quyết định nghề nghiệp đầu tiên mà các em có thể lý giải được.",
    "hero.primaryCta": "Khám phá nghề nghiệp",
    "hero.secondaryCta": "Xem bằng chứng của học sinh",
    "hero.stat1Value": "12+",
    "hero.stat1Label": "Bài thử nghề sẵn sàng để bắt đầu",
    "hero.stat2Value": "7 ngày",
    "hero.stat2Label": "Dùng thử miễn phí cho mọi gói thử nghiệm",
    "hero.stat3Value": "100%",
    "hero.stat3Label": "Bằng chứng học sinh có thể chia sẻ",
    "hero.imageAlt":
      "Các bạn học sinh cùng nhau thực hiện một bài thử nghề có hướng dẫn tại bàn chung",

    /* --------------------------------------------------------- how it works */
    "howItWorks.eyebrow": "Cách hoạt động",
    "howItWorks.title": "Bốn bước từ tò mò đến một quyết định tự tin",
    "howItWorks.subtitle":
      "Mỗi bài thử nghề đều theo cùng một nhịp, nên học sinh luôn biết bước tiếp theo là gì.",
    "howItWorks.step1Title": "Khám phá",
    "howItWorks.step1Body":
      "Tìm bài thử nghề theo lĩnh vực, kỹ năng và thời gian. Mỗi bài đều cho thấy công việc thật trước khi bạn bắt đầu.",
    "howItWorks.step2Title": "Thử nghề",
    "howItWorks.step2Body":
      "Thực hiện một đề bài ngắn có hướng dẫn, với sản phẩm cần nộp rõ ràng và danh sách việc cần làm để bạn đánh dấu dần.",
    "howItWorks.step3Title": "Nhìn lại",
    "howItWorks.step3Body":
      "Tự chấm điểm những gì bạn thấy thích và những gì còn khó. Cố vấn sẽ bổ sung phản hồi cho sản phẩm bạn làm ra.",
    "howItWorks.step4Title": "Quyết định",
    "howItWorks.step4Body":
      "Biến bài thử nghề thành một thẻ bằng chứng bạn có thể chia sẻ với nhà trường, nhà tuyển dụng và gia đình.",

    /* ------------------------------------------------------- evidence preview */
    "evidence.eyebrow": "Bằng chứng",
    "evidence.title": "Bằng chứng về điều học sinh thực sự làm được",
    "evidence.subtitle":
      "Mỗi bài thử nghề hoàn thành đều tạo ra một thẻ bằng chứng có thể chia sẻ: sản phẩm, điểm số và nhận xét của cố vấn.",
    "evidence.viewAll": "Xem tất cả bằng chứng",
    "evidence.empty": "Chưa có thẻ bằng chứng nào được công bố.",
    "evidence.emptyHint":
      "Hoàn thành một bài thử nghề để công bố thẻ bằng chứng đầu tiên.",
    "evidence.ratingLabel": "Điểm cố vấn",
    "evidence.completionLabel": "Mức hoàn thành",
    "evidence.aspectsLabel": "Điểm theo tiêu chí",
    "evidence.testerLabel": "Học sinh",

    /* --------------------------------------------------------- business model */
    "businessModel.eyebrow": "Mô hình kinh doanh",
    "businessModel.title": "Vừa sức với học sinh, bền vững cho nền tảng",
    "businessModel.subtitle":
      "Học sinh trả một khoản phí thử nghiệm nhỏ, trường học và doanh nghiệp tài trợ theo nhóm, còn cố vấn được ghi nhận cho phản hồi mình đóng góp.",
    "businessModel.stream1Title": "Phí thử nghiệm của học sinh",
    "businessModel.stream1Body":
      "Chi phí thấp để truy cập mọi bài thử nghề, kèm bảy ngày dùng thử miễn phí để chi phí không còn là rào cản đầu tiên.",
    "businessModel.stream2Title": "Giấy phép cho trường học & doanh nghiệp",
    "businessModel.stream2Body":
      "Các đơn vị mua quyền truy cập theo nhóm và nhận báo cáo tổng hợp về kỹ năng mà học sinh của mình đang xây dựng.",
    "businessModel.stream3Title": "Mạng lưới cố vấn",
    "businessModel.stream3Body":
      "Cố vấn trong ngành đánh giá sản phẩm của học sinh, đồng thời xây dựng hồ sơ được xác thực cho những phản hồi mình đã đóng góp.",

    /* ----------------------------------------------------------- pilot pricing */
    "pricing.eyebrow": "Học phí thử nghiệm",
    "pricing.title": "Năm gói thử nghiệm, một tuần miễn phí",
    "pricing.subtitle":
      "Bắt đầu với gói miễn phí, chỉ nâng cấp khi học sinh cần phản hồi từ cố vấn hoặc muốn trọn bộ.",
    "pricing.openModal": "Xem học phí thử nghiệm",
    "pricing.modalTitle": "Các gói học phí thử nghiệm",
    "pricing.modalSubtitle":
      "Năm gói cho chương trình thử nghiệm. Mọi gói đều bắt đầu với bảy ngày dùng thử miễn phí.",
    "pricing.trialCalloutTitle": "Dùng thử miễn phí 7 ngày",
    "pricing.trialCalloutBody":
      "Dùng thử miễn phí bất kỳ gói nào trong bảy ngày. Huỷ trước khi hết hạn và bạn không phải trả gì.",
    "pricing.trialCalloutCta": "Bắt đầu dùng thử miễn phí",
    "pricing.close": "Đóng bảng học phí",
    "pricing.featuresLabel": "Bao gồm",
    "pricing.plan1Name": "Khởi đầu",
    "pricing.plan1Price": "MIỄN PHÍ",
    "pricing.plan1Description":
      "Dành cho học sinh muốn tìm hiểu trước và thử bài thử nghề đầu tiên.",
    "pricing.plan1Feature1": "Xem mọi bài thử nghề",
    "pricing.plan1Feature2": "Tham gia một bài tại một thời điểm",
    "pricing.plan1Feature3": "Theo dõi tiến độ cá nhân",
    "pricing.plan2Name": "Thiết thực nhất",
    "pricing.plan2Price": "39.000 – 69.000 ₫",
    "pricing.plan2Description":
      "Dành cho học sinh sẵn sàng làm bài thử nghề một cách nghiêm túc và giữ lại bằng chứng.",
    "pricing.plan2Feature1": "Không giới hạn bài thử nghề",
    "pricing.plan2Feature2": "Tải thẻ bằng chứng về máy",
    "pricing.plan2Feature3": "Mẫu sản phẩm cần nộp",
    "pricing.plan3Name": "Cố vấn",
    "pricing.plan3Price": "99.000 – 149.000 ₫",
    "pricing.plan3Description":
      "Dành cho học sinh muốn một người làm nghề thật đánh giá sản phẩm mình tạo ra.",
    "pricing.plan3Feature1": "Toàn bộ gói Thiết thực nhất",
    "pricing.plan3Feature2": "Phản hồi bằng văn bản từ cố vấn",
    "pricing.plan3Feature3": "Một buổi trao đổi cho mỗi bài thử nghề",
    "pricing.plan4Name": "Trọn bộ",
    "pricing.plan4Price": "149.000 – 199.000 ₫",
    "pricing.plan4Description":
      "Dành cho học sinh muốn khám phá nhiều hướng đi và cần đầy đủ hồ sơ bằng chứng.",
    "pricing.plan4Feature1": "Toàn bộ gói Cố vấn",
    "pricing.plan4Feature2": "Hồ sơ gồm năm bài thử nghề",
    "pricing.plan4Feature3": "Ưu tiên ghép cố vấn",
    "pricing.plan5Name": "Nhà trường",
    "pricing.plan5Price": "THƯƠNG LƯỢNG",
    "pricing.plan5Description":
      "Dành cho trường học, doanh nghiệp và tổ chức triển khai cho một nhóm học sinh.",
    "pricing.plan5Feature1": "Chỗ ngồi theo nhóm và bảng điều khiển",
    "pricing.plan5Feature2": "Báo cáo kỹ năng tổng hợp",
    "pricing.plan5Feature3": "Hỗ trợ triển khai riêng",

    /* -------------------------------------------------------------- our team */
    "team.eyebrow": "Đội ngũ",
    "team.title": "Được xây dựng bởi nhà giáo dục, kỹ sư và cố vấn trong ngành",
    "team.subtitle":
      "Một đội ngũ nhỏ từng triển khai chương trình hướng nghiệp tại các trường Việt Nam và tuyển dụng từ chính các em.",
    "team.member1Name": "Nguyễn Linh",
    "team.member1Role": "Trưởng chương trình",
    "team.member1Bio":
      "Cựu giáo viên tư vấn hướng nghiệp cấp hai, người thiết kế các đề bài thử nghề.",
    "team.member2Name": "Trần Minh",
    "team.member2Role": "Sản phẩm & Kỹ thuật",
    "team.member2Bio":
      "Xây dựng nền tảng và các công cụ bằng chứng mà học sinh dùng mỗi ngày.",
    "team.member3Name": "TS. Phạm Hoa",
    "team.member3Role": "Nghiên cứu & Đánh giá",
    "team.member3Bio":
      "Chuyển kết quả thử nghề thành điểm số mà nhà trường và doanh nghiệp có thể tin cậy.",
    "team.member4Name": "Lê Quang",
    "team.member4Role": "Mạng lưới cố vấn",
    "team.member4Bio":
      "Tuyển chọn và hỗ trợ các cố vấn trong ngành đánh giá sản phẩm của học sinh.",

    /* --------------------------------------------------- path to profitability */
    "path.eyebrow": "Lộ trình sinh lời",
    "path.title": "Từ nhóm thử nghiệm đến một mạng lưới tự vận hành",
    "path.subtitle":
      "Mỗi giai đoạn nuôi giai đoạn kế tiếp, nên tăng trưởng không phụ thuộc vào một nguồn thu duy nhất.",
    "path.phase1Title": "Giai đoạn 1 — Thử nghiệm",
    "path.phase1Body":
      "Các gói miễn phí và giá thấp chứng minh rằng thử nghề thay đổi quyết định hướng nghiệp.",
    "path.phase2Title": "Giai đoạn 2 — Theo nhóm",
    "path.phase2Body":
      "Giấy phép cho trường học và doanh nghiệp mang lại doanh thu ổn định và nguồn bằng chứng lớn hơn.",
    "path.phase3Title": "Giai đoạn 3 — Mạng lưới",
    "path.phase3Body":
      "Mạng lưới cố vấn trả phí và quan hệ đối tác với doanh nghiệp giúp nền tảng tự vận hành.",

    /* ------------------------------------------------------ join the ecosystem */
    "join.eyebrow": "Tham gia hệ sinh thái",
    "join.title": "Luôn có một vị trí cho bạn tại Career Trial",
    "join.subtitle":
      "Học sinh, cố vấn, trường học và doanh nghiệp cùng định hình điều mà nhóm học sinh kế tiếp sẽ học.",
    "join.studentsTitle": "Học sinh",
    "join.studentsBody":
      "Bắt đầu dùng thử miễn phí, làm một đề bài thật và giữ lại bằng chứng mình đạt được.",
    "join.studentsCta": "Khám phá nghề nghiệp",
    "join.mentorsTitle": "Cố vấn",
    "join.mentorsBody":
      "Đánh giá sản phẩm của học sinh và đưa ra phản hồi giúp một bạn chọn đúng hướng.",
    "join.mentorsCta": "Trở thành cố vấn",
    "join.partnersTitle": "Trường học & doanh nghiệp",
    "join.partnersBody":
      "Triển khai cho một nhóm học sinh và xem tổng hợp những kỹ năng các em đang xây dựng.",
    "join.partnersCta": "Hợp tác với chúng tôi",

    /* --------------------------------------------------------- career trial page */
    "trials.eyebrow": "Thử nghề",
    "trials.title": "Chọn một bài thử nghề và bắt đầu làm",
    "trials.description":
      "Mỗi bài thử nghề là một phần việc thật ngắn gọn, có hướng dẫn, với sản phẩm cần nộp và danh sách việc rõ ràng.",
    "trials.loading": "Đang tải các bài thử nghề…",
    "trials.error": "Không tải được các bài thử nghề. Vui lòng thử lại.",
    "trials.retry": "Thử lại",
    "trials.empty": "Chưa có bài thử nghề nào được công bố.",
    "trials.emptyHint":
      "Các bài mới được bổ sung thường xuyên — hãy quay lại sớm nhé.",
    "trials.daysLabel": "Số ngày hoàn thành",
    "trials.startTrial": "Bắt đầu bài này",
    "trials.viewTrial": "Xem bài thử nghề",
    "trials.enrolled": "Đã tham gia",
    "trials.tagsLabel": "Thẻ",
    "trials.briefLabel": "Đề bài",
    "trials.deliverablesLabel": "Sản phẩm cần nộp",
    "trials.checklistLabel": "Danh sách việc",
    "trials.notFound": "Không tìm thấy bài thử nghề này.",
    "trials.backToTrials": "Về danh sách bài thử nghề",

    /* ------------------------------------------------------------- evidence page */
    "evidencePage.eyebrow": "Bằng chứng",
    "evidencePage.title": "Bằng chứng từ những bài thử nghề thật",
    "evidencePage.description":
      "Mỗi thẻ bên dưới đến từ một bài thử nghề đã hoàn thành, do học sinh tự chấm và cố vấn đánh giá.",
    "evidencePage.loading": "Đang tải bằng chứng…",
    "evidencePage.error": "Không tải được bằng chứng. Vui lòng thử lại.",
    "evidencePage.retry": "Thử lại",
    "evidencePage.empty": "Chưa có bằng chứng nào được công bố.",
    "evidencePage.emptyHint":
      "Thẻ bằng chứng sẽ xuất hiện ngay khi học sinh hoàn thành bài thử nghề.",

    /* --- evidence wall: filters, sorting and aspect bars (added by evidence page task) --- */
    "evidencePage.testerLabel": "Học sinh",
    "evidencePage.completionLabel": "Mức hoàn thành",
    "evidencePage.ratingLabel": "Điểm cố vấn",
    "evidencePage.aspectsLabel": "Điểm theo tiêu chí",
    "evidencePage.scaleLow": "Thấp",
    "evidencePage.scaleHigh": "Cao",
    "evidencePage.countLabel": "Số thẻ bằng chứng đang hiển thị",
    "evidencePage.filterCareerLabel": "Nghề nghiệp",
    "evidencePage.filterAllCareers": "Tất cả nghề nghiệp",
    "evidencePage.sortLabel": "Sắp xếp theo",
    "evidencePage.sortCompletion": "Hoàn thành cao nhất",
    "evidencePage.sortRating": "Điểm cao nhất",
    "evidencePage.sortName": "Tên học sinh (A–Z)",
    "evidencePage.noMatch": "Chưa có bằng chứng nào thuộc nghề này.",
    "evidencePage.noMatchHint":
      "Hãy chọn nghề khác, hoặc bỏ bộ lọc để xem toàn bộ thẻ đã công bố.",
    "evidencePage.clearFilter": "Xem tất cả nghề nghiệp",
    /* --- end evidence wall keys --- */

    /* ------------------------------------------------------------ student area */
    "student.eyebrow": "Khu vực học sinh",
    "student.title": "Bài thử nghề và bằng chứng của bạn",
    "student.description":
      "Theo dõi những bài thử nghề bạn đã bắt đầu và bằng chứng bạn đã thu thập.",
    "student.signInTitle": "Đăng nhập để mở khu vực học sinh",
    "student.signInBody":
      "Bài thử nghề, tiến độ và bằng chứng của bạn gắn với Internet Identity. Đăng nhập để tiếp tục từ nơi bạn dừng lại.",
    "student.signInCta": "Đăng nhập học sinh",
    "student.signingIn": "Đang đăng nhập…",
    "student.enrollmentsTitle": "Bài thử nghề của tôi",
    "student.enrollmentsEmpty": "Bạn chưa bắt đầu bài thử nghề nào.",
    "student.enrollmentsEmptyHint":
      "Xem danh sách bài thử nghề và bắt đầu bài đầu tiên của bạn.",
    "student.evidenceTitle": "Bằng chứng của tôi",
    "student.evidenceEmpty": "Bạn chưa thu thập bằng chứng nào.",
    "student.evidenceEmptyHint":
      "Hoàn thành một bài thử nghề để công bố thẻ bằng chứng đầu tiên.",
    "student.progressLabel": "Tiến độ",
    "student.startedLabel": "Bắt đầu",
    "student.updatedLabel": "Cập nhật lần cuối",
    "student.updateProgress": "Cập nhật tiến độ",
    "student.saveProgress": "Lưu tiến độ",
    "student.saving": "Đang lưu…",
    "student.progressSaved": "Đã lưu tiến độ.",
    "student.loading": "Đang tải khu vực học sinh…",
    "student.error": "Không tải được khu vực học sinh. Vui lòng thử lại.",
    "student.retry": "Thử lại",
    "student.browseTrials": "Xem các bài thử nghề",

    /* ------------------------------------------------------------ enroll errors */
    "enroll.unknownTrial": "Bài thử nghề này không còn tồn tại.",
    "enroll.alreadyEnrolled": "Bạn đã tham gia bài thử nghề này rồi.",
    "enroll.notEnrolled": "Bạn chưa tham gia bài thử nghề đó.",
    "enroll.notSignedIn": "Vui lòng đăng nhập để tiếp tục.",
    "enroll.invalidProgress": "Tiến độ phải nằm trong khoảng 0 đến 100.",
    "enroll.genericError": "Đã xảy ra lỗi. Vui lòng thử lại.",

    /* ------------------------------------------------------------ common labels */
    "common.loading": "Đang tải…",
    "common.error": "Đã xảy ra lỗi.",
    "common.retry": "Thử lại",
    "common.close": "Đóng",
    "common.cancel": "Huỷ",
    "common.confirm": "Xác nhận",
    "common.back": "Quay lại",
    "common.next": "Tiếp theo",
    "common.of": "trong",
    "common.free": "Miễn phí",
    "common.learnMore": "Tìm hiểu thêm",

    /* ==================================================== career trial page v2
       Added by the Career Trial page task. Keep this block self-contained. */
    "careerTrial.title": "Chọn một bài thử nghề và bắt tay vào việc thật",
    "careerTrial.subtitle":
      "Những bài thử nghề ngắn, có hướng dẫn, cho bạn thấy công việc thật sự diễn ra thế nào — trước khi bạn chọn một hướng đi.",
    "careerTrial.countLabel": "bài thử nghề đang mở",
    "careerTrial.countOne": "bài thử nghề đang mở",
    "careerTrial.searchLabel": "Tìm bài thử nghề",
    "careerTrial.searchPlaceholder": "Tìm theo tên nghề…",
    "careerTrial.searchClear": "Xoá từ khoá tìm kiếm",
    "careerTrial.filterLabel": "Lọc theo kỹ năng",
    "careerTrial.filterAll": "Tất cả kỹ năng",
    "careerTrial.clearFilters": "Xoá bộ lọc",
    "careerTrial.resultsLabel": "Đang hiển thị",
    "careerTrial.resultsOf": "trên",
    "careerTrial.emptyTitle": "Không có bài thử nghề nào khớp bộ lọc",
    "careerTrial.emptyBody":
      "Hãy thử một kỹ năng khác hoặc xoá từ khoá tìm kiếm để xem lại toàn bộ danh sách.",
    "careerTrial.emptyAction": "Xoá tất cả bộ lọc",
    "careerTrial.daysBadge": "ngày",
    "careerTrial.startTrial": "Bắt đầu thử",
    "careerTrial.comingNextTitle": "Sắp ra mắt",
    "careerTrial.comingNextBadge": "Đang biên soạn",
    "careerTrial.comingNextBody":
      "Chúng tôi đang viết đề bài cho nghề này. Hãy quay lại sớm nhé — bài sẽ sớm sẵn sàng để bạn bắt đầu.",
    "careerTrial.modalEyebrow": "Đề bài thử nghề",
    "careerTrial.modalClose": "Đóng đề bài",
    "careerTrial.modalBriefLabel": "Đề bài",
    "careerTrial.modalChecklistLabel": "Danh sách việc cần làm",
    "careerTrial.modalDeliverablesLabel": "Sản phẩm bạn sẽ nộp",
    "careerTrial.modalDaysLabel": "Thời gian dự kiến",
    "careerTrial.modalSkillsLabel": "Kỹ năng bạn sẽ rèn luyện",
    "careerTrial.modalStart": "Bắt đầu bài này",
    "careerTrial.modalStarting": "Đang bắt đầu…",
    "careerTrial.modalSignIn": "Đăng nhập để bắt đầu",
    "careerTrial.modalSuccessTitle": "Bạn đã tham gia",
    "careerTrial.modalSuccessBody":
      "Bài thử nghề này đã có trong khu vực học sinh của bạn. Mở lại bất cứ lúc nào để theo dõi tiến độ.",
    "careerTrial.modalSuccessCta": "Đến khu vực học sinh",
    "careerTrial.modalAlreadyTitle": "Bạn đã tham gia rồi",
    "careerTrial.modalAlreadyBody":
      "Bạn đã bắt đầu bài thử nghề này. Hãy tiếp tục từ nơi bạn dừng lại trong khu vực học sinh.",
    "careerTrial.modalAlreadyCta": "Mở khu vực học sinh",
    "careerTrial.modalErrorTitle": "Không bắt đầu được bài thử nghề này",
    "careerTrial.modalRetry": "Thử lại",
    "careerTrial.modalDone": "Xong",

    /* ============================ student area (task: student page) ============================ */
    "studentArea.greeting": "Chào mừng trở lại",
    "studentArea.principalLabel": "Đang đăng nhập với",
    "studentArea.signOut": "Đăng xuất",
    "studentArea.statTrials": "Bài đã bắt đầu",
    "studentArea.statEvidence": "Thẻ bằng chứng",
    "studentArea.privateTitle": "Khu vực học sinh là riêng tư",
    "studentArea.privateBody":
      "Bài thử nghề, tiến độ và bằng chứng của bạn gắn với Internet Identity, nên chỉ mình bạn xem được. Đăng nhập để tiếp tục từ nơi bạn dừng lại.",
    "studentArea.oneFlowNote":
      "Cùng một nút Đăng nhập học sinh áp dụng cho cả bạn mới và bạn đã từng học — không cần bước đăng ký riêng.",
    "studentArea.browseTrials": "Xem các bài thử nghề",
    "studentArea.progressHeading": "Đặt tiến độ của bạn",
    "studentArea.progressHint":
      "Kéo thanh trượt tới phần trăm bài bạn đã hoàn thành, rồi lưu lại.",
    "studentArea.progressSaved": "Đã lưu tiến độ.",
    "studentArea.progressError": "Không lưu được tiến độ. Vui lòng thử lại.",
    "studentArea.stepDecrease": "Giảm tiến độ 10 phần trăm",
    "studentArea.stepIncrease": "Tăng tiến độ 10 phần trăm",
    "studentArea.aspectsHeading": "Điểm theo tiêu chí",
    "studentArea.ratingLabel": "Điểm cố vấn",
    "studentArea.completionLabel": "Mức hoàn thành",
    "studentArea.lowLabel": "Thấp",
    "studentArea.highLabel": "Cao",
    "studentArea.evidenceEmptyCta": "Bắt đầu một bài thử nghề",
    /* --- student results & display name (task: real results) --- */
    "studentArea.greetingNamed": "Chào mừng trở lại, {name}",
    "studentArea.nameHeading": "Tên của bạn trên thẻ bằng chứng",
    "studentArea.nameHint":
      "Đây là tên xuất hiện trên mọi thẻ bằng chứng bạn công bố, để cố vấn và nhà trường biết sản phẩm này là của ai.",
    "studentArea.nameLabel": "Tên hiển thị",
    "studentArea.namePlaceholder": "ví dụ: Linh Giang",
    "studentArea.nameHelp":
      "Hãy dùng tên bạn muốn nhà trường và nhà tuyển dụng nhìn thấy. Tối đa 60 ký tự.",
    "studentArea.nameSave": "Lưu tên",
    "studentArea.nameSaving": "Đang lưu…",
    "studentArea.nameSaved": "Đã lưu tên hiển thị của bạn.",
    "studentArea.nameRequired": "Hãy nhập tên trước khi lưu.",
    "studentArea.nameTooLong": "Tên này quá dài. Hãy giữ dưới 60 ký tự.",
    "studentArea.nameInvalid":
      "Không thể chấp nhận tên này. Hãy dùng chữ cái và khoảng trắng, không có khoảng trắng ở đầu hoặc cuối.",
    "studentArea.nameNotSignedIn": "Vui lòng đăng nhập lại để lưu tên của bạn.",
    "studentArea.nameError": "Không lưu được tên của bạn. Vui lòng thử lại.",
    "studentArea.unnamedStudent": "Học sinh chưa đặt tên",
    "studentArea.resultHeading": "Kết quả của bạn",
    "studentArea.scoreLabel": "Điểm tổng",
    "studentArea.notTestedBadge": "Chưa làm bài",
    "studentArea.notTestedTitle": "Bạn chưa làm bài kiểm tra này",
    "studentArea.notTestedBody":
      "Mức hoàn thành và điểm số sẽ tự động xuất hiện ở đây sau khi bạn hoàn thành bài kiểm tra. Bạn không cần tự điền gì.",
    "studentArea.takeTest": "Làm bài kiểm tra",
    "studentArea.testerLabel": "Học sinh",
    /* ========================== end student area ========================== */

    /* ------------------------------------------------------- main page: hero */
    "main.heroEyebrow": "Định hướng nghề nghiệp, làm lại từ đầu",
    "main.heroTitle": "Thử việc thật trước khi chọn nghề",
    "main.heroSubtitle":
      "Career Trial mang đến cho học sinh những trải nghiệm ngắn, có hướng dẫn về công việc thật — để quyết định nghề nghiệp dựa trên bằng chứng, không phải phỏng đoán.",
    "main.heroCta": "Khám phá nghề nghiệp",
    "main.heroVisualLabel": "Một bài thử nghề đang diễn ra",
    "main.heroTrialCardTitle": "Bài thử nghề",
    "main.heroTrialCardCareer": "Nhà thiết kế sản phẩm",
    "main.heroTrialCardTask": "Thiết kế lại màn hình chào mừng",
    "main.heroTrialCardProgress": "Tiến độ",
    "main.heroTrialCardProgressValue": "72%",
    "main.heroEvidenceCardTitle": "Thẻ bằng chứng",
    "main.heroEvidenceCardStudent": "Linh Giang",
    "main.heroEvidenceCardRating": "4,6 / 5",
    "main.heroEvidenceCardAspect1": "Giải quyết vấn đề",
    "main.heroEvidenceCardAspect2": "Giao tiếp",
    "main.heroEvidenceCardAspect3": "Tay nghề",
    "main.heroEvidenceCardAspect4": "Tinh thần trách nhiệm",

    /* ------------------------------------------- main page: how it works */
    "main.howEyebrow": "Cách hoạt động",
    "main.howTitle": "Bốn bước từ tò mò đến một quyết định tự tin",
    "main.howSubtitle":
      "Mỗi bài thử nghề đều theo cùng một nhịp, nên học sinh luôn biết bước tiếp theo là gì.",
    "main.howStep1Title": "Khám phá",
    "main.howStep1Body":
      "Tìm bài thử nghề theo lĩnh vực, kỹ năng và thời gian — và xem công việc thật trước khi bắt đầu.",
    "main.howStep2Title": "Thử nghề",
    "main.howStep2Body":
      "Thực hiện một đề bài ngắn có hướng dẫn, với sản phẩm cần nộp rõ ràng và danh sách việc để bạn đánh dấu dần.",
    "main.howStep3Title": "Nhìn lại",
    "main.howStep3Body":
      "Tự chấm điểm điều bạn thấy thích và điều còn khó, rồi đọc phản hồi của cố vấn cho sản phẩm bạn làm ra.",
    "main.howStep4Title": "Quyết định",
    "main.howStep4Body":
      "Biến bài thử nghề thành một thẻ bằng chứng bạn có thể chia sẻ với nhà trường, nhà tuyển dụng và gia đình.",

    /* --------------------------------------- main page: evidence preview */
    "main.evidenceEyebrow": "Thẻ bằng chứng",
    "main.evidenceCardTitle": "Thẻ bằng chứng nghề nghiệp",
    "main.evidenceTitle":
      "Mỗi bài thử nghề kết thúc bằng bằng chứng về điều bạn làm được",
    "main.evidenceSubtitle":
      "Thẻ bằng chứng nghề nghiệp ghi lại bài thử nghề bạn đã hoàn thành, mức độ bạn đạt được và đánh giá của cố vấn cho sản phẩm đó. Thẻ này thuộc về bạn để lưu giữ và chia sẻ.",
    "main.evidenceCta": "Xem bằng chứng của học sinh",
    "main.evidenceCardStudent": "Tuấn Duy",
    "main.evidenceCardCareer": "Chuyên viên phân tích dữ liệu",
    "main.evidenceCardCompletion": "Mức hoàn thành",
    "main.evidenceCardRating": "Điểm cố vấn",
    "main.evidenceCardAspects": "Điểm theo tiêu chí",
    "main.evidenceCardAspect1": "Tư duy phân tích",
    "main.evidenceCardAspect2": "Chú ý đến chi tiết",
    "main.evidenceCardAspect3": "Giao tiếp",
    "main.evidenceCardAspect4": "Tinh thần chủ động",
    "main.evidenceCardVerified": "Cố vấn đã đánh giá",

    /* ----------------------------------------- main page: business model */
    "main.businessEyebrow": "Mô hình kinh doanh",
    "main.businessTitle": "Ai dùng Career Trial, và ai trả phí",
    "main.businessSubtitle":
      "Học sinh nhận được trải nghiệm. Nhà trường, gia đình và doanh nghiệp chi trả cho quyền truy cập — mỗi bên vì một lý do khác nhau.",
    "main.businessUsersLabel": "Người dùng chính",
    "main.businessPayersLabel": "Ai có thể trả phí?",
    "main.businessUser1": "Học sinh trung học phổ thông",
    "main.businessUser1Body":
      "Học sinh sắp chọn tổ hợp môn, ngành đại học hoặc công việc đầu tiên, và muốn thử một hướng đi trước khi cam kết.",
    "main.businessUser2": "Phụ huynh",
    "main.businessUser2Body":
      "Phụ huynh muốn đồng hành cùng con bằng trải nghiệm thật thay vì lời khuyên gián tiếp, và sẵn sàng trả phí cho một chương trình có cấu trúc.",
    "main.businessUser3": "Nhà trường",
    "main.businessUser3Body":
      "Trường học cần các hoạt động hướng nghiệp và trải nghiệm có thể triển khai cho cả một nhóm học sinh, kèm bằng chứng về điều các em đạt được.",
    "main.businessUser4": "Doanh nghiệp",
    "main.businessUser4Body":
      "Doanh nghiệp muốn người trẻ hiểu về ngành của mình từ sớm, và sẵn sàng tài trợ hoặc đồng thiết kế một bài thử nghề để tiếp cận nhân tài tương lai.",
    "main.businessPayer1": "Nhà trường — Hướng nghiệp",
    "main.businessPayer1Body":
      "Nhà trường mua các chương trình Career Trial cho nhóm học sinh như một phần của hoạt động hướng nghiệp hoặc học tập trải nghiệm.",
    "main.businessPayer2":
      "Phụ huynh / Học sinh — Bài thử nghề cá nhân cao cấp",
    "main.businessPayer2Body":
      "Gia đình trả phí cho từng bài thử nghề, gói nhiều bài, phản hồi cố vấn sâu hơn, hoặc một hồ sơ trải nghiệm đầy đủ hơn.",
    "main.businessPayer3":
      "Doanh nghiệp — Bài thử nghề tài trợ hoặc đồng thiết kế",
    "main.businessPayer3Body":
      "Doanh nghiệp tài trợ hoặc đồng thiết kế một bài thử nghề để giúp người trẻ hiểu về vị trí, ngành nghề và kỹ năng tương lai.",
    "main.revenue1Index": "01",
    "main.revenue1Title": "Gói cho nhà trường",
    "main.revenue1Badge": "Doanh thu theo nhóm",
    "main.revenue1Body":
      "Nhà trường có thể mua các chương trình Career Trial cho nhóm học sinh như một phần của hoạt động hướng nghiệp hoặc học tập trải nghiệm.",
    "main.revenue2Index": "02",
    "main.revenue2Title": "Bài thử nghề cao cấp",
    "main.revenue2Badge": "Doanh thu trực tiếp",
    "main.revenue2Body":
      "Học sinh hoặc phụ huynh có thể trả phí cho từng bài thử nghề, gói nhiều bài, phản hồi cố vấn sâu hơn, hoặc một hồ sơ trải nghiệm đầy đủ hơn.",
    "main.revenue3Index": "03",
    "main.revenue3Title": "Hợp tác doanh nghiệp",
    "main.revenue3Badge": "Doanh thu từ đối tác",
    "main.revenue3Body":
      "Doanh nghiệp có thể tài trợ hoặc đồng thiết kế một bài thử nghề để giúp người trẻ hiểu về vị trí, ngành nghề và kỹ năng tương lai.",

    /* ------------------------------------------ main page: pilot pricing */
    "main.pricingEyebrow": "Học phí thử nghiệm",
    "main.pricingTitle": "Mức giá đơn giản cho lần thử thị trường đầu tiên.",
    "main.pricingBody":
      "Đây là mức giá thử nghiệm cho giai đoạn pilot. Chúng tôi sẽ điều chỉnh sau khi kiểm chứng mức sẵn sàng chi trả thực tế của học sinh, phụ huynh và nhà trường.",
    "main.pricingBadge": "Giá thử nghiệm — chưa chốt",
    "main.pricingOpenModal": "Mở chi tiết học phí",
    "main.pricingPlan1Index": "01",
    "main.pricingPlan1Category": "Khởi đầu",
    "main.pricingPlan1Title": "Trải nghiệm thử nghề",
    "main.pricingPlan1Price": "MIỄN PHÍ",
    "main.pricingPlan1Body":
      "Một trải nghiệm ngắn giúp học sinh hiểu Career Trial hoạt động như thế nào.",
    "main.pricingPlan1Feature1": "1 thử thách nghề ngắn",
    "main.pricingPlan1Feature2": "Nhìn lại cơ bản",
    "main.pricingPlan1Feature3": "Không có phản hồi cố vấn",
    "main.pricingPlan2Index": "02",
    "main.pricingPlan2Category": "Thiết thực nhất",
    "main.pricingPlan2Title": "1 bài thử nghề",
    "main.pricingPlan2Price": "39.000 – 69.000 ₫",
    "main.pricingPlan2Body":
      "Một trải nghiệm nghề trọn vẹn với công việc sát thực tế và sản phẩm cuối cùng của học sinh.",
    "main.pricingPlan2Feature1": "1 bài thử nghề đầy đủ",
    "main.pricingPlan2Feature2": "Thẻ bằng chứng nghề nghiệp",
    "main.pricingPlan2Feature3": "Đánh giá cơ bản",
    "main.pricingPlan3Index": "03",
    "main.pricingPlan3Category": "Cố vấn",
    "main.pricingPlan3Title": "Bài thử nghề + Phản hồi cố vấn",
    "main.pricingPlan3Price": "99.000 – 149.000 ₫",
    "main.pricingPlan3Body":
      "Dành cho học sinh muốn nhận phản hồi chuyên môn cho sản phẩm của mình và nhìn lại sâu sắc hơn.",
    "main.pricingPlan3Feature1": "1 bài thử nghề đầy đủ",
    "main.pricingPlan3Feature2": "Phản hồi từ cố vấn",
    "main.pricingPlan3Feature3": "Thẻ bằng chứng nghề nghiệp",
    "main.pricingPlan4Index": "04",
    "main.pricingPlan4Category": "Trọn bộ",
    "main.pricingPlan4Title": "Gói 3 bài thử nghề",
    "main.pricingPlan4Price": "149.000 – 199.000 ₫",
    "main.pricingPlan4Body":
      "So sánh nhiều trải nghiệm nghề trước khi đưa ra quyết định học tập hoặc nghề nghiệp.",
    "main.pricingPlan4Feature1": "3 bài thử nghề",
    "main.pricingPlan4Feature2": "3 thẻ bằng chứng",
    "main.pricingPlan4Feature3": "Nhìn lại giữa các nghề",
    "main.pricingPlan5Index": "05",
    "main.pricingPlan5Category": "Nhà trường",
    "main.pricingPlan5Title": "Gói thử nghiệm cho trường",
    "main.pricingPlan5Price": "THƯƠNG LƯỢNG",
    "main.pricingPlan5Body":
      "Lần thử nghiệm đầu tiên với nhà trường có thể miễn phí hoặc chi phí thấp, đổi lại là phản hồi và dữ liệu đánh giá.",
    "main.pricingPlan5Feature1": "Quyền truy cập cho nhóm học sinh",
    "main.pricingPlan5Feature2": "Hỗ trợ triển khai thử nghiệm",
    "main.pricingPlan5Feature3": "Báo cáo phản hồi cho nhà trường",

    /* ----------------------------------------------- main page: our team */
    "main.teamEyebrow": "Những học sinh đứng sau Career Trial",
    "main.teamTitle": "Chúng em là một phần của vấn đề mình muốn giải quyết.",
    "main.teamBody":
      "Vì cũng là học sinh, hướng nghiệp với chúng em không phải một chủ đề trừu tượng. Đó là quyết định mà chính chúng em cũng đang chuẩn bị đưa ra.",
    "main.teamMember1Initials": "LG",
    "main.teamMember1Name": "Linh Giang",
    "main.teamMember1Role": "Trưởng nhóm & Truyền thông",
    "main.teamMember1Grade": "Lớp 11",
    "main.teamMember1Bio":
      "Dẫn dắt nhóm, điều phối phát triển dự án và đại diện dự án trong các buổi thuyết trình và gọi vốn.",
    "main.teamMember2Initials": "TD",
    "main.teamMember2Name": "Tuấn Duy",
    "main.teamMember2Role": "Nghiên cứu & Chiến lược",
    "main.teamMember2Grade": "Lớp 10",
    "main.teamMember2Bio":
      "Tập trung vào nghiên cứu, tư duy phản biện, xây dựng lập luận và tự tìm tòi những ý tưởng mới.",
    "main.teamMember3Initials": "TM",
    "main.teamMember3Name": "Thanh Mai",
    "main.teamMember3Role": "Công nghệ & Phát triển sản phẩm",
    "main.teamMember3Grade": "Lớp 9",
    "main.teamMember3Bio":
      "Đóng góp kỹ năng lập trình và phần mềm cho website, luồng sản phẩm và phát triển số của Career Trial.",

    /* ------------------------------------ main page: path to profitability */
    "main.pathEyebrow": "Lộ trình sinh lời",
    "main.pathTitle": "Tạo một lần. Cải tiến liên tục. Phục vụ nhiều học sinh.",
    "main.pathBody":
      "Chi phí lớn nhất là xây dựng những bài thử nghề chất lượng cao và hệ thống cố vấn. Khi một bài đã hoàn thành, cùng một nội dung số có thể phục vụ nhiều học sinh và nhà trường. Khi số người dùng tăng, doanh thu có thể tăng nhanh hơn chi phí phân phối nội dung.",
    "main.pathStep1Title": "Xây dựng và thử nghiệm một bài thử nghề",
    "main.pathStep1Body":
      "Thiết kế một bài chất lượng cao và chạy thử với học sinh thật để chứng minh nó thay đổi cách các em nhìn về công việc.",
    "main.pathStep2Title": "Tái sử dụng cho nhiều trường và học sinh",
    "main.pathStep2Body":
      "Cùng một nội dung số phục vụ mọi nhóm học sinh mới, nên chi phí cho mỗi học sinh thêm vào luôn ở mức thấp.",
    "main.pathStep3Title": "Bổ sung thêm bài thử nghề và đối tác",
    "main.pathStep3Body":
      "Doanh nghiệp và người làm nghề cùng đồng thiết kế bài mới, mở rộng danh mục mà không làm tăng chi phí.",
    "main.pathStep4Title": "Tăng doanh thu định kỳ",
    "main.pathStep4Body":
      "Gói cho nhà trường và các gói cao cấp biến những lần thử nghiệm đơn lẻ thành nguồn thu lặp lại, ổn định.",

    /* ---------------------------------------- main page: join ecosystem */
    "main.ecosystemEyebrow": "Tham gia hệ sinh thái Career Trial",
    "main.ecosystemTitle": "Học nghề thật cần người thật và đối tác thật.",
    "main.ecosystemBody":
      "Career Trial phát triển nhờ sự hợp tác với những người làm nghề, nhà trường, doanh nghiệp và tổ chức mong muốn giúp học sinh hiểu thế giới công việc trước khi đưa ra quyết định lớn.",
    "main.ecosystemMentorTitle": "Trở thành cố vấn nghề nghiệp",
    "main.ecosystemMentorBody":
      "Đánh giá sản phẩm của học sinh, đưa ra phản hồi thiết thực, hoặc giúp chúng tôi kiểm tra xem một bài thử nghề có sát với kỳ vọng nơi làm việc thật hay không.",
    "main.ecosystemMentorTag1": "Linh hoạt",
    "main.ecosystemMentorTag2": "Làm từ xa",
    "main.ecosystemMentorTag3": "Tác động ý nghĩa",
    "main.ecosystemMentorCta": "Đăng ký làm cố vấn",
    "main.ecosystemPartnerTitle": "Hợp tác với Career Trial",
    "main.ecosystemPartnerBody":
      "Nhà trường, doanh nghiệp, nhóm chuyên môn và tổ chức giáo dục có thể đồng thiết kế bài thử nghề, tài trợ quyền truy cập, cung cấp chuyên gia hoặc cùng chạy thử nghiệm.",
    "main.ecosystemPartnerTag1": "Đồng thiết kế bài thử nghề",
    "main.ecosystemPartnerTag2": "Thử nghiệm cùng nhà trường",
    "main.ecosystemPartnerTag3": "Tài trợ quyền truy cập",
    "main.ecosystemPartnerCta": "Tìm hiểu hợp tác",

    /* ------------------------------------ main page: pricing disclaimer */
    "main.disclaimerTitle": "Lưu ý quan trọng",
    "main.disclaimerBody":
      "Học phí vẫn chưa được chốt. Trong giai đoạn thử nghiệm, nhóm sẽ kiểm chứng mức sẵn sàng chi trả của nhà trường và các gia đình trước khi quyết định mức giá cuối cùng. Điều này giúp mô hình kinh doanh luôn thực tế và dựa trên bằng chứng.",

    /* ==================== trial knowledge test (task: trial test) ==================== */
    "test.eyebrow": "Bài kiểm tra kiến thức",
    "test.title": "Thể hiện điều bạn học được ở {trial}",
    "test.intro":
      "Năm câu hỏi ngắn. Trả lời hết rồi gửi bài — hệ thống sẽ tự chấm điểm và công bố thẻ bằng chứng của bạn.",
    "test.questionLabel": "Câu hỏi",
    "test.ofLabel": "trong",
    "test.aspectLabel": "Tiêu chí",
    "test.optionLabel": "Phương án trả lời",
    "test.back": "Quay lại",
    "test.next": "Tiếp theo",
    "test.submit": "Gửi bài",
    "test.submitting": "Đang chấm điểm…",
    "test.retake": "Làm lại bài kiểm tra",
    "test.retakeHint":
      "Bạn có thể làm lại bài kiểm tra bất cứ lúc nào. Lần làm mới nhất sẽ thay thế kết quả trước đó.",
    "test.answeredLabel": "đã trả lời",
    "test.unansweredPrompt":
      "Hãy trả lời tất cả câu hỏi trước khi gửi bài. Còn thiếu:",
    "test.unansweredQuestion": "Câu hỏi {number}",
    "test.loading": "Đang tải bài kiểm tra…",
    "test.loadError": "Không tải được bài kiểm tra này. Vui lòng thử lại.",
    "test.retry": "Thử lại",
    "test.empty": "Bài thử nghề này chưa có bài kiểm tra.",
    "test.emptyHint": "Hãy quay lại sớm nhé — các câu hỏi đang được biên soạn.",
    "test.signInTitle": "Đăng nhập để làm bài kiểm tra",
    "test.signInBody":
      "Câu trả lời, điểm số và thẻ bằng chứng của bạn gắn với Internet Identity. Đăng nhập để bắt đầu bài kiểm tra.",
    "test.signInCta": "Đăng nhập học sinh",
    "test.signingIn": "Đang đăng nhập…",
    "test.notEnrolledTitle": "Hãy tham gia bài thử nghề trước",
    "test.notEnrolledBody":
      "Bài kiểm tra mở ra sau khi bạn đã tham gia bài thử nghề. Hãy tham gia từ phần đề bài, rồi quay lại bắt đầu.",
    "test.notEnrolledCta": "Về lại đề bài",
    "test.unknownTrialTitle": "Bài thử nghề này không còn nữa",
    "test.unknownTrialBody":
      "Không tìm thấy bài thử nghề cho bài kiểm tra này. Hãy đóng bảng này và chọn bài khác.",
    "test.invalidAnswerTitle": "Một câu trả lời không đọc được",
    "test.invalidAnswerBody":
      "Có lỗi với một trong các câu trả lời của bạn. Hãy xem lại lựa chọn và gửi lại.",
    "test.incompleteTitle": "Vẫn còn câu hỏi chưa trả lời",
    "test.incompleteBody":
      "Hãy trả lời những câu được liệt kê bên dưới, rồi gửi lại bài làm.",
    "test.genericErrorTitle": "Không chấm được bài của bạn",
    "test.genericErrorBody":
      "Đã xảy ra lỗi khi gửi bài. Câu trả lời của bạn vẫn còn — vui lòng thử lại.",
    "test.resultEyebrow": "Đã chấm điểm",
    "test.resultTitle": "Kết quả của bạn đã sẵn sàng",
    "test.resultBody":
      "Hệ thống đã tự động chấm bài và công bố một thẻ bằng chứng trong khu vực học sinh của bạn.",
    "test.scoreLabel": "Điểm",
    "test.scoreOutOf": "trên {total}",
    "test.completionLabel": "Mức hoàn thành",
    "test.aspectsLabel": "Chi tiết theo tiêu chí",
    "test.evidenceCta": "Xem bằng chứng của tôi",
    "test.evidenceHint":
      "Thẻ bằng chứng mới của bạn nằm trên trang Bằng chứng, cùng với mọi thẻ đã công bố.",
    "test.close": "Đóng bài kiểm tra",
    "test.startTest": "Bắt đầu bài kiểm tra",
    "test.startTestHint":
      "Năm câu hỏi trắc nghiệm, được chấm tự động khi bạn gửi bài.",
    "test.retakeResult": "Làm lại",
    "test.attemptLabel": "Lần làm",
    /* ================== end trial knowledge test ================== */

    /* ============ evidence wall: own-result markers (task: evidence) ============ */
    "evidencePage.scoreLabel": "Điểm tổng",
    "evidencePage.ownCardBadge": "Kết quả bạn đã công bố",
    "evidencePage.ownSummary": "Kết quả bạn đã công bố trên tường này",
    "evidencePage.showMineOnly": "Chỉ xem kết quả của tôi",
    "evidencePage.showAllCards": "Xem tất cả kết quả",
    "evidencePage.noMine": "Bạn chưa công bố bằng chứng nào.",
    "evidencePage.noMineHint":
      "Hoàn thành một bài thử nghề để công bố thẻ bằng chứng đầu tiên tại đây.",
    /* ================ end own-result markers ================ */

    /* ====== trial test result → evidence navigation (task: test flow fixes) ====== */
    "test.viewEvidenceAria": "Xem bằng chứng của tôi trên trang Bằng chứng",
    "test.viewEvidenceOpening": "Đang mở bằng chứng của bạn…",
    /* ================ end test flow fixes ================ */

    /* ====== student area: real per-enrolment result (task: real results) ====== */
    "studentArea.resultLoading": "Đang tải kết quả của bạn…",
    /* ================ end real per-enrolment result ================ */
  },
};

/** Every translation key, derived from the English dictionary. */
export type TranslationKey = keyof (typeof translations)["en"];
