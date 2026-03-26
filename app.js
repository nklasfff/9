/* ============================================================
   DE 9 LIVSFASER — App Logic
   ============================================================ */


/* ============================================================
   THEME — Dark/Light toggle with localStorage persistence
   ============================================================ */
function initTheme() {
  const saved = localStorage.getItem('livsfaser_theme');
  if (saved === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
}
function toggleTheme() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  if (isDark) {
    document.documentElement.removeAttribute('data-theme');
    localStorage.setItem('livsfaser_theme', 'light');
  } else {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('livsfaser_theme', 'dark');
  }
}
// Apply theme immediately to avoid flash
initTheme();


/* ============================================================
   SIDE MENU (Hamburger)
   ============================================================ */
function openMenu() {
  document.querySelector('.menu-frame').classList.add('open');
  document.querySelector('.side-menu').classList.add('open');
  document.querySelector('.menu-overlay').classList.add('open');
}
function closeMenu() {
  document.querySelector('.side-menu').classList.remove('open');
  document.querySelector('.menu-overlay').classList.remove('open');
  document.querySelector('.menu-frame').classList.remove('open');
}
function menuNav(screenId) {
  closeMenu();
  setTimeout(() => Router.navigate(screenId), 150);
}


/* ============================================================
   JOURNAL — write, save, display, delete
   ============================================================ */
const Journal = {
  storageKey: 'livsfaser_journal',

  getEntries() {
    const raw = localStorage.getItem(this.storageKey);
    return raw ? JSON.parse(raw) : [];
  },

  saveEntry(text) {
    const entries = this.getEntries();
    entries.unshift({
      id: Date.now(),
      text: text.trim(),
      date: new Date().toISOString()
    });
    localStorage.setItem(this.storageKey, JSON.stringify(entries));
  },

  deleteEntry(id) {
    const entries = this.getEntries().filter(e => e.id !== id);
    localStorage.setItem(this.storageKey, JSON.stringify(entries));
  }
};

function formatJournalDate(isoStr) {
  const d = new Date(isoStr);
  const months = ['januar','februar','marts','april','maj','juni','juli','august','september','oktober','november','december'];
  const day = d.getDate();
  const month = months[d.getMonth()];
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const mins = String(d.getMinutes()).padStart(2, '0');
  return `${day}. ${month} ${year} · kl. ${hours}:${mins}`;
}

function renderJournalEntries() {
  const container = document.getElementById('journal-entries');
  const empty = document.getElementById('journal-empty');
  if (!container) return;
  const entries = Journal.getEntries();
  if (entries.length === 0) {
    container.innerHTML = '';
    if (empty) empty.style.display = '';
    return;
  }
  if (empty) empty.style.display = 'none';
  container.innerHTML = entries.map(e => `
    <div class="journal-entry">
      <div class="journal-entry-date">${formatJournalDate(e.date)}</div>
      <div class="journal-entry-text">${e.text.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
      <div class="journal-entry-actions">
        <button class="journal-delete-btn" onclick="deleteJournalEntry(${e.id})">Slet</button>
      </div>
    </div>
  `).join('');
}

function saveJournalEntry() {
  const input = document.getElementById('journal-input');
  if (!input || !input.value.trim()) return;
  Journal.saveEntry(input.value);
  input.value = '';
  renderJournalEntries();
}

function deleteJournalEntry(id) {
  Journal.deleteEntry(id);
  renderJournalEntries();
}

function initJournalDate() {
  const el = document.getElementById('journal-date');
  if (el) {
    const now = new Date();
    const months = ['januar','februar','marts','april','maj','juni','juli','august','september','oktober','november','december'];
    el.textContent = `${now.getDate()}. ${months[now.getMonth()]} ${now.getFullYear()}`;
  }
}


/* ============================================================
   PROFIL — simple profile view
   ============================================================ */
function buildProfilScreen() {
  const container = document.getElementById('profil-content');
  if (!container) return;
  const user = Storage.get();
  const d = FASE_DATA;
  container.innerHTML = `
    <div class="card" style="cursor:default">
      <div class="card-title" style="text-align:center;font-size:1.3rem;margin-bottom:var(--sp-3)">${d.elementSymbol}</div>
      <div class="ob-pr"><span class="ob-pk">Element</span><span class="ob-pv">${d.elementLabel}</span></div>
      <div class="ob-pr"><span class="ob-pk">Livsfase</span><span class="ob-pv">Fase ${d.phase}</span></div>
      <div class="ob-pr"><span class="ob-pk">Kvaliteter</span><span class="ob-pv">${d.qualities}</span></div>
      <div class="ob-pr"><span class="ob-pk">Organpar</span><span class="ob-pv">${d.organPar}</span></div>
      <div class="ob-pr"><span class="ob-pk">Årstid</span><span class="ob-pv">${d.aarstid}</span></div>
      <div class="ob-pr"><span class="ob-pk">Smag</span><span class="ob-pv">${d.smag}</span></div>
    </div>
    <div style="text-align:center;margin-top:var(--sp-4)">
      <button class="journal-save-btn" onclick="resetProfile()" style="color:var(--text-muted);border-color:var(--text-dim);background:transparent">Nulstil profil</button>
    </div>
  `;
}

function resetProfile() {
  if (confirm('Er du sikker? Dette sletter din profil og starter forfra.')) {
    localStorage.removeItem('livsfaser_onboarded');
    localStorage.removeItem('livsfaser_user');
    location.reload();
  }
}


/* ============================================================
   STORAGE — Local persistence for onboarding state
   ============================================================ */
const Storage = {
  saveUser(data) {
    localStorage.setItem('livsfaser_user', JSON.stringify(data));
  },
  getUser() {
    const raw = localStorage.getItem('livsfaser_user');
    return raw ? JSON.parse(raw) : null;
  },
  isOnboarded() {
    return localStorage.getItem('livsfaser_onboarded') === 'true';
  },
  setOnboarded() {
    localStorage.setItem('livsfaser_onboarded', 'true');
  },
  getLocalDateStr() {
    return new Date().toISOString().split('T')[0];
  }
};


/* ============================================================
   CALCULATIONS — Life phase & element cycles
   ============================================================ */
const Calculations = {
  ELEMENT_LABELS: { 'VAND': 'Vand', 'TRÆ': 'Træ', 'ILD': 'Ild', 'JORD': 'Jord', 'METAL': 'Metal' },
  ELEMENT_TEGN:   { 'VAND': '水', 'TRÆ': '木', 'ILD': '火', 'JORD': '土', 'METAL': '金' },

  getLifePhase(birthdate) {
    const birth = new Date(birthdate);
    const now = new Date();
    const age = now.getFullYear() - birth.getFullYear() -
      (now < new Date(now.getFullYear(), birth.getMonth(), birth.getDate()) ? 1 : 0);

    // 9 life phases mapped to age ranges
    const phases = [
      { phase: 1, name: 'Vand', element: 'VAND', min: 0, max: 6 },
      { phase: 2, name: 'Træ', element: 'TRÆ', min: 7, max: 13 },
      { phase: 3, name: 'Ild', element: 'ILD', min: 14, max: 20 },
      { phase: 4, name: 'Jord', element: 'JORD', min: 21, max: 27 },
      { phase: 5, name: 'Metal', element: 'METAL', min: 28, max: 34 },
      { phase: 6, name: 'Vand', element: 'VAND', min: 35, max: 41 },
      { phase: 7, name: 'Træ', element: 'TRÆ', min: 42, max: 48 },
      { phase: 8, name: 'Ild', element: 'ILD', min: 49, max: 55 },
      { phase: 9, name: 'Metal', element: 'METAL', min: 56, max: 200 }
    ];

    for (const p of phases) {
      if (age >= p.min && age <= p.max) return p;
    }
    return phases[phases.length - 1];
  },

  getSeason() {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) return { season: 'Forår', element: 'TRÆ' };
    if (month >= 5 && month <= 6) return { season: 'Sommer', element: 'ILD' };
    if (month === 7) return { season: 'Sensommer', element: 'JORD' };
    if (month >= 8 && month <= 10) return { season: 'Efterår', element: 'METAL' };
    return { season: 'Vinter', element: 'VAND' };
  },

  getMonthCycle() {
    const month = new Date().getMonth();
    const elements = ['VAND', 'VAND', 'TRÆ', 'TRÆ', 'TRÆ', 'ILD', 'ILD', 'JORD', 'METAL', 'METAL', 'METAL', 'VAND'];
    return { element: elements[month] };
  },

  getOrganClock() {
    const hour = new Date().getHours();
    const clocks = [
      { hours: '23-01', organ: 'Galdeblæren', element: 'TRÆ' },
      { hours: '01-03', organ: 'Leveren', element: 'TRÆ' },
      { hours: '03-05', organ: 'Lungerne', element: 'METAL' },
      { hours: '05-07', organ: 'Tyktarmen', element: 'METAL' },
      { hours: '07-09', organ: 'Maven', element: 'JORD' },
      { hours: '09-11', organ: 'Milten', element: 'JORD' },
      { hours: '11-13', organ: 'Hjertet', element: 'ILD' },
      { hours: '13-15', organ: 'Tyndtarmen', element: 'ILD' },
      { hours: '15-17', organ: 'Blæren', element: 'VAND' },
      { hours: '17-19', organ: 'Nyrerne', element: 'VAND' },
      { hours: '19-21', organ: 'Perikardiet', element: 'ILD' },
      { hours: '21-23', organ: 'Trippelvarmeren', element: 'ILD' }
    ];
    const index = Math.floor(hour / 2) % 12;
    // Map hour to correct clock position
    if (hour >= 23 || hour < 1) return clocks[0];
    if (hour >= 1 && hour < 3) return clocks[1];
    if (hour >= 3 && hour < 5) return clocks[2];
    if (hour >= 5 && hour < 7) return clocks[3];
    if (hour >= 7 && hour < 9) return clocks[4];
    if (hour >= 9 && hour < 11) return clocks[5];
    if (hour >= 11 && hour < 13) return clocks[6];
    if (hour >= 13 && hour < 15) return clocks[7];
    if (hour >= 15 && hour < 17) return clocks[8];
    if (hour >= 17 && hour < 19) return clocks[9];
    if (hour >= 19 && hour < 21) return clocks[10];
    return clocks[11];
  },

  getUserCycles(birthdate) {
    const lifePhase = this.getLifePhase(birthdate);
    const season = this.getSeason();
    const monthCycle = this.getMonthCycle();
    const organ = this.getOrganClock();

    // Count element occurrences to find dominant
    const counts = {};
    [lifePhase.element, season.element, monthCycle.element, organ.element].forEach(el => {
      counts[el] = (counts[el] || 0) + 1;
    });

    let dominant = lifePhase.element;
    let maxCount = 0;
    for (const [el, count] of Object.entries(counts)) {
      if (count > maxCount) { maxCount = count; dominant = el; }
    }

    return {
      cycles: { lifePhase, season, monthCycle, organ },
      dominant: { element: dominant, count: maxCount }
    };
  }
};


/* ============================================================
   ONBOARDING DATA
   ============================================================ */
const ELEMENT_INTRO = {
  'VAND': 'Vand er det dybeste element — det der bærer alt andet. Lige nu kalder det på stilhed, hvile og tillid til det, der ikke kan ses endnu.',
  'TRÆ': 'Træ er vækst og retning. Det presser opad og udad, med kraft og vilje. Lige nu mærker du måske en trang til at skabe, bevæge dig, handle.',
  'ILD': 'Ild er glæde, intensitet og forbindelse. Den brænder i dig som nærvær og lidenskab. Lige nu er din evne til at møde andre på sit stærkeste.',
  'JORD': 'Jord er forankring og omsorg. Den bærer, nærer og holder fast. Lige nu har du en særlig evne til at skabe tryghed — for dig selv og andre.',
  'METAL': 'Metal er klarhed og essentiel styrke. Det skærer igennem og viser det væsentlige. Lige nu har du adgang til en dyb klarhed om hvad der virkelig betyder noget.'
};

const ELEMENT_KVALITETER = {
  'VAND': 'stilhed · dybde · intuition',
  'TRÆ': 'vækst · retning · vilje',
  'ILD': 'glæde · forbindelse · intensitet',
  'JORD': 'næring · omsorg · fundament',
  'METAL': 'klarhed · essens · frigivelse'
};

const MONTHS_DA = ['Januar', 'Februar', 'Marts', 'April', 'Maj', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'December'];

const LIVSFASE_FEELINGS = {
  1: { balance: 'tryghed og tillid', ubalance: 'frygt og tilbagetrækning' },
  2: { balance: 'nysgerrighed og kreativitet', ubalance: 'frustration og vrede' },
  3: { balance: 'glæde og forbindelse', ubalance: 'rastløshed og overstimulering' },
  4: { balance: 'stabilitet og omsorg', ubalance: 'bekymring og overansvar' },
  5: { balance: 'omsorg og stabilitet', ubalance: 'bekymring og udmattelse' },
  6: { balance: 'klarhed og frigivelse', ubalance: 'sorg og kontrolbehov' },
  7: { balance: 'fornyet retning og mod', ubalance: 'bitterhed og stagnation' },
  8: { balance: 'dybde og visdom', ubalance: 'ensomhed og overintensitet' },
  9: { balance: 'ro og accept', ubalance: 'isolation og stivhed' }
};


/* ============================================================
   ONBOARDING FUNCTIONS
   ============================================================ */
function initOnboarding() {
  const form = document.getElementById('onboarding-form');
  if (!form) return;

  const input = document.getElementById('birth-input');
  const btn = document.getElementById('birth-btn');

  if (btn) {
    btn.addEventListener('click', () => {
      const val = input ? input.value : '';
      if (!val) return;

      const date = new Date(val);
      if (isNaN(date.getTime())) {
        alert('Indtast venligst en gyldig dato');
        return;
      }

      Storage.saveUser({
        birthdate: val,
        createdAt: Storage.getLocalDateStr()
      });

      Router.navigate('onboarding-result');
    });
  }
}

function initOnboardingResult() {
  const user = Storage.getUser();
  if (!user || !user.birthdate) {
    Router.navigate('onboarding');
    return;
  }

  const data = Calculations.getUserCycles(user.birthdate);
  const { cycles, dominant } = data;
  const elLabel = Calculations.ELEMENT_LABELS[dominant.element];
  const elTegn = Calculations.ELEMENT_TEGN[dominant.element];
  const phase = cycles.lifePhase;

  // Kanji
  const kanjiEl = document.getElementById('result-kanji');
  if (kanjiEl) kanjiEl.textContent = elTegn;

  // Climate label
  const climateLabel = dominant.count >= 3 ? 'Fuld resonans' : dominant.count === 2 ? 'Dobbelt resonans' : 'Blandet energi';
  const climateEl = document.getElementById('result-climate');
  if (climateEl) climateEl.textContent = climateLabel;

  // Main text
  const mainTextEl = document.getElementById('result-main-text');
  if (mainTextEl) mainTextEl.textContent = ELEMENT_INTRO[dominant.element] || 'Fem cyklusser danner tilsammen et unikt mønster — dit mønster, lige nu.';

  // Sub text
  const subTexts = {
    'VAND': 'Du mærker det måske som en dyb ro, eller som en stille kraft der bærer dig.',
    'TRÆ': 'Du mærker det måske som en trang til at handle, skabe og bevæge dig fremad.',
    'ILD': 'Du mærker det måske som en varme i brystet, en glæde der søger forbindelse.',
    'JORD': 'Du mærker det måske som en trang til at nære, samle og skabe tryghed.',
    'METAL': 'Du mærker det måske som klarhed — en evne til at se hvad der virkelig tæller.'
  };
  const subTextEl = document.getElementById('result-sub-text');
  if (subTextEl) subTextEl.textContent = subTexts[dominant.element] || '';

  // Profile rows
  const rows = [
    { label: 'Livsfase', value: `Fase ${phase.phase} – ${phase.name} (${Calculations.ELEMENT_LABELS[phase.element]})` },
    { label: 'Årstid', value: `${cycles.season.season} – ${Calculations.ELEMENT_LABELS[cycles.season.element]}` },
    { label: 'Måned', value: `${MONTHS_DA[new Date().getMonth()]} – ${Calculations.ELEMENT_LABELS[cycles.monthCycle.element]}` },
    { label: 'Organur', value: `${cycles.organ.hours} – ${cycles.organ.organ} (${Calculations.ELEMENT_LABELS[cycles.organ.element]})` }
  ];
  const profilEl = document.getElementById('result-profil-rows');
  if (profilEl) {
    profilEl.innerHTML = rows.map(r =>
      `<div class="ob-pr"><span class="ob-pk">${r.label}</span><span class="ob-pv">${r.value}</span></div>`
    ).join('');
  }

  // Feelings
  const phaseDetail = LIVSFASE_FEELINGS[phase.phase];
  if (phaseDetail) {
    const feelingsLabel = document.getElementById('result-feelings-label');
    if (feelingsLabel) feelingsLabel.textContent = `${elLabel}-elementets følelser`;
    const feelingsText = document.getElementById('result-feelings-text');
    if (feelingsText) feelingsText.textContent = `I balance: ${phaseDetail.balance}. I ubalance: ${phaseDetail.ubalance}.`;
  }

  // Profile fold toggle
  const profilToggle = document.getElementById('profil-toggle');
  if (profilToggle) {
    profilToggle.addEventListener('click', () => {
      profilToggle.closest('.ob-profil-fold').classList.toggle('open');
    });
  }

  // Continue button
  const continueBtn = document.getElementById('continue-btn');
  if (continueBtn) {
    continueBtn.addEventListener('click', () => {
      Storage.setOnboarded();
      document.body.classList.remove('onboarding');
      Router.navigate('forside');
    });
  }
}


/* --- DATA: Fase 5 (Jord) — used as default display --- */
const FASE_DATA = {
  phase: 5,
  element: 'JORD',
  elementLabel: 'Jord',
  elementSymbol: '土',
  qualities: 'næring · centrering · omsorg',
  organPar: 'Milt og Mave',
  smag: 'Sød',
  aarstid: 'Sensommer',
  elementInfo: { energi: 'Næring, centrering, at bære, at holde sammen', sanseorgan: 'Mund/Læber', kropsvaev: 'Muskler/Bindevæv', farve: 'Gul/Jordfarver' },

  introText: 'Jordens fase. Ansvar for karriere, måske børn, måske parforhold. Energien er centrerende og bærende — kvinden bliver den jord, alt og alle hviler på, men jorden har også brug for næring.',

  denneFaseIDig: 'En kvinde i Fase 5 er ofte i centrum af et netværk af relationer, der alle kræver noget af hende. Partner, mor, datter, kollega, veninde — hver rolle har sine forventninger, og tilsammen kan de føles som mere, end én jord kan bære.\n\nHvis du har børn, er de sandsynligvis i Fase 1 eller 2 — små børn, der har brug for alt: tryghed, nærvær, tålmodighed og kærlighed døgnet rundt. Mødet mellem en udmattet mor i Fase 5 og et lille barn i Fase 1 kan være både det smukkeste og det sværeste i verden. Barnet mærker din stress og kan blive mere krævende, og en ond cirkel kan opstå. Husk: dit barn har mere brug for en nogenlunde glad mor end en perfekt udmattet en.\n\nVenskaberne forandrer sig også. Kvinder uden børn kan opleve, at relationerne til veninder med børn skifter — samtalerne handler om noget andet, tidspunkterne passer ikke længere, og der kan opstå en distance, som ingen har ønsket. At finde fællesskaber med andre kvinder i lignende situation, eller veninder, der rummer forskellen, kan være en form for jord under fødderne.\n\nHvis der er et parforhold, sættes det ofte på prøve her. Travlheden sniger sig ind og tager pladsen fra intimiteten. Hvem tager sig af hvad? Hvem har ret til at være træt? De forhandlinger kan blive til magtkampe, hvis I ikke passer på. Jord-elementets gave til parforholdet er stabilitet og næring — at lave mad sammen, at sidde stille sammen, at huske at forbindelsen ikke kun lever i de store øjeblikke men i de helt små, daglige ritualer. Spørgsmålet er, hvad der er tilbage af jeres fælles jord på den anden side.',

  centralFoelelse: {
    title: 'Omsorg og Udmattelse',
    tekst: 'Den følelse der definerer denne fase, er omsorg — den dybe, instinktive omsorg der gør kvinden til jordens centrum. Hun nærer, hun bærer, hun holder sammen. Omsorgen er der i hvert måltid hun laver, hver konflikt hun mægler, hvert barn hun trøster, hvert ansvar hun tager på sig. Og den er smuk — det er jordens mest generøse gave.\n\nMen skyggefølelsen lurer tæt ved. Bekymring er jord-elementets mørke side, og den kan æde al den næring, milten forsøger at skabe. Tankerne kører i ring: har jeg gjort nok? Klarer børnene sig? Hvad hvis det går galt på arbejdet? Hvad hvis jeg glemmer noget vigtigt? Bekymringen er som en mølle der aldrig standser — og den slider jorden ned.\n\nEn kvinde i min praksis sagde engang: "Jeg elsker mine børn så meget, at det gør ondt. Og jeg er så træt, at det også gør ondt. Og jeg ved ikke, hvornår der er plads til mig selv i det." Den sætning rummer så meget af det, denne fase handler om. At give alt og mærke, at der måske ikke er nok jord tilbage til en selv.\n\nI den kinesiske medicin siger man, at milten er jordens organ — det center der holder de fem elementer sammen. Når milten er stærk, kan kvinden rumme alt uden at vakle. Men når milten er svag, falder alt fra hinanden: fordøjelsen, energien, tankeklarjeden, humøret. Udmattelsen i denne fase er ikke dovenskab. Det er en jord, der har båret for længe uden at blive pløjet og gødet.\n\nSensommeren er jordens årstid — den tid hvor frugterne er modne og marken bærer tungt. Men sensommeren er også den tid, hvor høsten skal i hus, inden efteråret kommer. At lære at høste — at nyde det man har, i stedet for altid at bekymre sig om det næste — er måske jordens dybeste visdom i denne fase.'
  },

  kropTekst: 'Milten og maven er i centrum. Mange kvinder føder i denne fase — kroppen gennemgår en af sine mest transformerende oplevelser. Fordøjelsen bærer byrden af stress og søvnmangel. Maven er det organ der omsætter alt til næring — mad, indtryk, følelser — og i denne fase arbejder den på overarbejde. Musklerne og bindevævet bærer bogstaveligt det hele: børn på hoften, tasker på skulderen, ansvar på ryggen.',

  sindTekst: 'Sindet jonglerer mange bolde. Karriere, børn, parforhold, identitet — alt kræver opmærksomhed. Omsorgen er stor men også opslidende. Jordens fælde er at nære alle andre og glemme sig selv. Bekymring er jord-elementets skyggefølelse, og den kan køre i ring som en mølle der aldrig standser. Mange kvinder opdager her, at de har båret så længe, at de ikke længere kan mærke deres egne behov under alle de andres.',

  balanceTekst: 'En kvinde i balance i denne fase er som varm, frugtbar jord. Der er stabilitet og ro i hendes nærvær, en evne til at rumme uden at vakle. Omsorgen flyder frit — til andre og til sig selv — og der er en naturlig rytme mellem at give og at modtage. Fordøjelsen fungerer, energien er stabil gennem dagen, og der er øjeblikke af dyb tilfredshed midt i travlheden.\n\nFysisk viser balance sig som god fordøjelse, stabile muskler, en krop der føles solid og bæredygtig. Menstruationen er regelmæssig, immunforsvaret holder, og der er en varme i kroppen der minder om sensommerens modne sol — ikke brændende, men nærende.',

  ubalanceTegn: {
    fysiske: [
      'Vedvarende træthed der ikke forsvinder med søvn — som om jorden er udpint',
      'Fordøjelsesproblemer: oppustethed, uregelmæssig mave, trang til sødt',
      'Tyngde i lemmer og krop — alt vejer mere end det burde',
      'Svage muskler, ømhed i bindevæv',
      'Tendens til at blive syg, så snart man holder pause',
      'Uregelmæssig eller kraftig menstruation med træthed'
    ],
    mentale: [
      'Bekymring der kører i ring — de samme tanker igen og igen',
      'Følelse af at være "på" hele tiden, at listen aldrig bliver kortere',
      'Grubleri der stjæler nattesøvnen',
      'En tomhed bag facaden — at gøre alt det rigtige, men føle sig udhulet',
      'Skyldfølelse uanset hvad man gør: aldrig nok'
    ],
    aarsag: 'Udmattelse er denne fases største fare, og den sker gradvist — som jord der langsomt mister sin frugtbarhed, fordi den aldrig får hvile. I den kinesiske medicin er milten den jord der transformerer alt til næring, men når den overbelastes, kan den ikke længere optage. Bekymring — jordens skyggefølelse — tærer direkte på milten og skaber en ond cirkel: jo mere du bekymrer dig, jo svagere bliver fordøjelsen, jo mere træt bliver du, jo mere bekymrer du dig.\n\nForskning i stress bekræfter, at kvinder i trediverne ofte rapporterer højere stressniveauer end mænd i samme alder, delvist på grund af det usynlige arbejde med at holde styr på hjem og relationer — det mentale load. Jord-elementet bærer dette load i kroppen som oppustethed, tyngde og en træthed der sidder i selve musklerne.\n\nAt lære at modtage er måske det vigtigste i denne fase. Jorden vil give og give, men uden at modtage næring udtørrer den. At bede om hjælp, at acceptere støtte, at lade andre gøre noget for dig er ikke svaghed — det er den visdom, der holder jorden frugtbar.'
  },

  temaer: [
    {
      title: 'Moderskab',
      tekst: 'For mange kvinder er denne fase forbundet med moderskabet. Børnene er ofte små og krævende, og selv den mest ønskede og elskede baby forandrer livet på måder, man ikke kunne forestille sig på forhånd.\n\nModerskabet er jord-elementets mest bogstavelige udtryk — at bære, at nære, at holde sammen. Kroppen har bogstaveligt båret et nyt liv, og den fortsætter med at give: mælk, varme, tryghed, nærvær døgnet rundt.\n\nJord-elementets fælde er at miste sig selv i omsorgen for andre. Kvinden der giver og giver, indtil der ikke er mere at give. Den tomme kande. Den udpinte mark. Det er ikke svaghed — det er jordens natur, når den ikke selv bliver næret.'
    },
    {
      title: 'Et liv uden børn i denne fase',
      tekst: 'For kvinder uden børn har denne fase sin egen tyngde og sin egen dybde. Spørgsmålene fra omgivelserne kan være utrættelige: "Hvornår skal du have børn?" "Har du ikke travlt?"\n\nNogen kvinder ved med sikkerhed, at de ikke ønsker børn, og må bruge energi på at forsvare et valg, der for dem føles helt naturligt. Andre kæmper med fertilitetsbehandlinger, med håb og skuffelse.\n\nUanset hvor du befinder dig, er din oplevelse gyldig. Jord-energien søger at nære — og den kan nære på utallige måder. Karrieren, kunsten, fællesskabet, haverne du planter. Jordens frugtbarhed handler ikke kun om børn.'
    },
    {
      title: 'Karriereintensitet',
      tekst: 'Parallelt med moderskabet — eller i stedet for det — er denne fase ofte præget af karriereintensitet. Det er nu, de afgørende forfremmelser kommer, de vigtige projekter, der kan definere en karriere.\n\nJord-elementet i karrieren viser sig som evnen til at skabe stabilitet og struktur — at holde teams sammen, at nære projekter fra idé til virkelighed. Men det viser sig også som en tendens til at påtage sig for meget, at sige ja når man burde sige nej.\n\nUanset konstellation er dette en fase, hvor mange kvinder oplever, at der simpelthen ikke er timer nok i døgnet — og at jorden de står på, ryster.'
    },
    {
      title: 'Sandwich-positionen begynder',
      tekst: 'I denne fase begynder mange at mærke presset fra flere sider. Forældre bliver ældre og har måske brug for hjælp. Sandwich-generationen — klemt mellem flere generationers behov — er et moderne fænomen, der rammer kvinder hårdest.\n\nJord-elementet forstærker dette mønster, fordi jordkvinden instinktivt vil nære alle — børnene opad, forældrene nedad, partneren ved siden af. Hun er midten, navet, det centrum alt drejer om. Og det er smukt, men det er også farligt, fordi navet slider ned, når hjulet aldrig holder stille.'
    }
  ],

  oevelser: [
    { type: 'Krop', title: 'Mave-massage i cirkler', desc: 'Læg dig ned. Placér begge hænder på maven og massér i langsomme, bløde cirkler med uret — ti til tyve gange. Varmer milten, støtter fordøjelsen og minder kroppen om at du også fortjener berøring.' },
    { type: 'Åndedræt', title: 'Jordens åndedræt', desc: 'Læg dig ned. Hånd på mave, hånd på bryst. Ånd ind i fire tæl ned i maven, hold i fire, ud i seks. Mærk hvordan maven hæver og sænker sig — roligt som jord der ånder. Otte gentagelser.' },
    { type: 'Meridian', title: 'Miltens meridian', desc: 'Stryg fra storetåens inderside op langs benets inderside, forbi knæet, op langs lårets inderside til ribbenene. Langsomt, med let tryk. Fem til syv gange på hvert ben.' },
    { type: 'Yin Yoga', title: 'Sphinx', desc: 'Læg dig på maven. Løft overkroppen op på underarmene, albuer under skuldrene. Tre til fem minutter. Åbner maven blødt og giver milten plads. Mærk jorden under dig som støtte.' },
    { type: 'Sind', title: 'Ét bekymringsritual', desc: 'Skriv alle dine bekymringer ned på et stykke papir. Alle sammen — de store og de små. Fold papiret og læg det væk. Sig til dig selv: de ligger her. Jeg behøver ikke bære dem i kroppen i nat.' }
  ],

  fasensRaad: [
    'Du kan ikke hælde fra en tom kande. Din egen næring er fundamentet for al den omsorg du giver andre — det er ikke egoisme, det er nødvendighed.',
    'Bed om hjælp, aktivt og konkret. De fleste vil gerne hjælpe, de ved bare ikke hvornår.',
    'Sænk standarden. En dag med højt humør og pizza er bedre end en dag med hjemmelavet mad og gråd.',
    'Spis varmt og regelmæssigt. Milten elsker varme måltider til faste tider.',
    'Vælg dine kampe. Alt er ikke lige vigtigt. Gem energien til det der virkelig gælder.',
    'Find øjeblikke af stilhed. Fem minutter med en kop varm te, en gåtur alene — de små øjeblikke genopbygger din jord.',
    'Husk: dette er en fase. Intensiteten er midlertidig, også når den føles evig.',
    'Læg bekymringerne ned. Skriv dem ned om aftenen og lad papiret bære dem i stedet for din krop.'
  ],

  elementEssay: 'I den kinesiske medicin er Fase 5 domineret af jord-elementet i sin fulde styrke. Det er sensommerens energi — nærende, centrerende, bærende og moden. Jorden er det element, der holder de andre fire sammen — den er midten, navet, fundamentet som alt hviler på.\n\nEn kvinde i denne fase bliver ofte til jord — bogstaveligt og symbolsk. Hun bærer, hun nærer, hun holder sammen. Hendes krop har måske båret børn, hendes sind bærer alles bekymringer, hendes skuldre bærer det usynlige arbejde der holder hverdagen kørende.\n\nMen jord der aldrig ligger brak, mister sin frugtbarhed. Det er den kinesiske medicins vigtigste advarsel til kvinder i denne fase. Milten — jordens organ — transformerer alt til næring: maden vi spiser, de indtryk vi modtager, de følelser vi bærer. Når milten overbelastes, kan den ikke længere omsætte, og resultatet er tyngde, fugt, bekymring og udmattelse.\n\nDen vediske tradition kalder denne fase den mest intense del af grihastha — husholderens livsfase, hvor ansvaret for andre er på sit højeste. Men traditionen minder også om, at selv husholdersken har brug for sit eget indre rum — et sted, hvor hun ikke er nogens mor, nogens partner, nogens kollega. Bare jord, der hviler i sig selv.',

  relationerIFasen: 'En kvinde i Fase 5 er ofte i centrum af et netværk af relationer der alle kræver noget af hende. Hun er jorden — det stabile centrum der holder det hele sammen. Børn i Fase 1-2 har brug for alt, parforholdet sættes på prøve af travlheden, og venskaber forandrer sig. Jord-elementets gave er evnen til at nære og rumme, men dets fælde er at give så meget, at ens egen jord udtørrer.',

  overgangTekst: 'Omkring femogtredive år begynder jorden at søge et nyt udtryk. Spørgsmålene handler mindre om at bære og mere om at skelne. Fase 6 er overgangen fra jord til metal — fra sensommerens modning til efterårets klarhed og den første sortering af livet.',

  refleksioner: [
    'Hvilke mønstre gentager du fra din mor?',
    'Hvad ville du gøre anderledes, hvis du kun havde ansvar for dig selv?',
    'Hvornår nærede du sidst dig selv med samme omsorg, som du giver andre?'
  ]
};


/* ============================================================
   ROUTER
   ============================================================ */
const Router = {
  current: 'forside',

  navigate(screenId) {
    const prev = document.querySelector('.screen.active');
    const next = document.getElementById('screen-' + screenId);
    if (!next || screenId === this.current) return;

    if (prev) prev.classList.remove('active');
    next.classList.add('active');
    next.classList.add('screen-enter');
    setTimeout(() => next.classList.remove('screen-enter'), 500);

    this.current = screenId;
    window.scrollTo({ top: 0, behavior: 'instant' });

    // Toggle onboarding mode (hide header/nav)
    const isOnboarding = screenId.startsWith('onboarding');
    document.body.classList.toggle('onboarding', isOnboarding);

    // Update nav
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    const activeNav = document.querySelector(`[data-nav="${screenId}"]`);
    if (activeNav) activeNav.classList.add('active');

    // Toggle back button (show on sub-screens, not main nav screens)
    const mainScreens = ['forside', 'dybde', 'tidsrejse', 'relationer'];
    document.body.classList.toggle('sub-screen', !mainScreens.includes(screenId) && !isOnboarding);

    // Init screens
    if (screenId === 'onboarding') initOnboarding();
    if (screenId === 'onboarding-result') initOnboardingResult();
    if (screenId === 'journal') { initJournalDate(); renderJournalEntries(); }
    if (screenId === 'profil') buildProfilScreen();
    if (screenId === 'ni-faser') buildNiFaserScreen();
    if (screenId === 'praksis') buildPraksisScreen();
    if (screenId === 'min-rejse') buildMinRejseScreen();

    // Re-run scroll reveal for new screen
    setTimeout(() => {
      initScrollReveal();
    }, 100);
  },

  goBack() {
    const parentMap = { 'rel-dybere': 'relationer', 'tids-dybere': 'tidsrejse', 'onboarding-result': 'onboarding', 'journal': 'forside', 'profil': 'forside', 'ni-faser': 'forside', 'praksis': 'forside', 'min-rejse': 'forside' };
    this.navigate(parentMap[this.current] || 'forside');
  }
};


/* ============================================================
   SCROLL REVEAL
   ============================================================ */
function initScrollReveal() {
  const sections = document.querySelectorAll('.screen.active .section:not(.visible)');

  // Use IntersectionObserver if available, with scroll fallback
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px 50px 0px' });

    sections.forEach(s => observer.observe(s));
  }

  // Fallback: also reveal on scroll for environments where IO doesn't fire
  function revealOnScroll() {
    const windowH = window.innerHeight;
    document.querySelectorAll('.screen.active .section:not(.visible)').forEach(s => {
      const rect = s.getBoundingClientRect();
      if (rect.top < windowH - 40) {
        s.classList.add('visible');
      }
    });
  }
  window.addEventListener('scroll', revealOnScroll, { passive: true });
  // Run once immediately
  revealOnScroll();
}


/* ============================================================
   HEADER SCROLL EFFECT
   ============================================================ */
function initHeaderScroll() {
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}


/* ============================================================
   EXPANDABLE CARDS
   ============================================================ */
function initInteractions() {
  // Single event delegation for ALL expand cards and read-more buttons
  // Only runs once — handles all current and future elements
  document.addEventListener('click', (e) => {
    // Expand cards
    const header = e.target.closest('.expand-header');
    if (header) {
      const card = header.closest('.expand-card');
      const body = card.querySelector('.expand-body');
      if (!card || !body) return;
      const isOpen = card.classList.contains('open');
      card.classList.toggle('open');
      body.style.maxHeight = isOpen ? '0px' : body.scrollHeight + 'px';
      return;
    }

    // Read more buttons
    if (e.target.classList.contains('read-more-btn')) {
      const btn = e.target;
      const target = btn.previousElementSibling;
      if (!target) return;
      const isExpanded = target.classList.contains('expanded');
      target.classList.toggle('expanded');
      btn.textContent = isExpanded ? 'Læs mere →' : 'Læs mindre ↑';
      return;
    }
  });
}


/* ============================================================
   CHECK-IN
   ============================================================ */
function selectMood(el) {
  document.querySelectorAll('.checkin-btn').forEach(b => b.classList.remove('selected'));
  el.classList.add('selected');
}


/* ============================================================
   RENDER HELPERS
   ============================================================ */
function textToHtml(text) {
  return text.split('\n\n').map(p => `<p>${p.trim()}</p>`).join('');
}

function renderTruncated(text, lines) {
  const paragraphs = text.split('\n\n');
  const html = paragraphs.map(p => `<p>${p.trim()}</p>`).join('');
  return `<div class="prose text-truncated" style="-webkit-line-clamp:${lines}">${html}</div><button class="read-more-btn">Læs mere →</button>`;
}


/* ============================================================
   BUILD DYBDE SCREEN
   ============================================================ */
function buildDybdeScreen() {
  const d = FASE_DATA;
  const container = document.getElementById('dybde-content');
  if (!container) return;

  let html = '';

  // ── HERO ──
  html += `
    <div class="section dybde-hero">
      <div class="eyebrow">Din livsfase</div>
      <div class="dybde-fase-label">Fase ${d.phase} · ${d.elementLabel}</div>
      <div class="isa isa--sm">${d.introText}</div>
      <div class="fig" style="margin-top:var(--sp-4)">
        <img src="Gemini_Generated_Image_4llrmp4llrmp4llr.png" alt="Dine fem cyklusser" style="max-width:260px" class="no-bg">
      </div>
    </div>`;

  // ── DENNE FASE I DIG ──
  html += `
    <div class="section">
      <div class="eyebrow">Denne fase i dig</div>
      ${renderTruncated(d.denneFaseIDig, 5)}
    </div>`;

  // ── FIGUR 2: KRYDSFELTET ──
  html += `
    <div class="section" style="text-align:center">
      <div class="fig">
        <img src="krydsfelt-final.png" alt="Krydsfeltet" class="no-bg">
      </div>
    </div>`;

  // ── DIVIDER ──
  html += '<div class="section"><div class="divider"></div></div>';

  // ── DIN CENTRALE FØLELSE ──
  html += `
    <div class="section">
      <div class="eyebrow">Din centrale følelse</div>
      <div class="isa" style="margin-bottom:var(--sp-2)">${d.centralFoelelse.title}</div>
      ${renderTruncated(d.centralFoelelse.tekst, 5)}
    </div>`;

  // ── DIVIDER ──
  html += '<div class="section"><div class="divider"></div></div>';

  // ── KROP & SIND + BALANCE/UBALANCE — samlet som fordybelse ──
  html += `
    <div class="section">
      <div class="eyebrow">Krop, sind & balance</div>

      <div class="expand-card">
        <div class="expand-header">
          <span class="expand-header-title">Kroppen i denne fase</span>
          <span class="expand-chevron">›</span>
        </div>
        <div class="expand-body">
          <div class="expand-body-inner">
            <div class="prose">${textToHtml(d.kropTekst)}</div>
          </div>
        </div>
      </div>

      <div class="expand-card">
        <div class="expand-header">
          <span class="expand-header-title">Sindet i denne fase</span>
          <span class="expand-chevron">›</span>
        </div>
        <div class="expand-body">
          <div class="expand-body-inner">
            <div class="prose">${textToHtml(d.sindTekst)}</div>
          </div>
        </div>
      </div>

      <div class="expand-card">
        <div class="expand-header">
          <span class="expand-header-title">Tegn på balance</span>
          <span class="expand-chevron">›</span>
        </div>
        <div class="expand-body">
          <div class="expand-body-inner">
            <div class="prose">${textToHtml(d.balanceTekst)}</div>
          </div>
        </div>
      </div>

      <div class="expand-card">
        <div class="expand-header">
          <span class="expand-header-title">Tegn på ubalance</span>
          <span class="expand-chevron">›</span>
        </div>
        <div class="expand-body">
          <div class="expand-body-inner">
            <div class="ubalance-group">
              <div class="ubalance-group-label">Fysiske tegn</div>
              <ul class="ubalance-list">
                ${d.ubalanceTegn.fysiske.map(t => `<li>${t}</li>`).join('')}
              </ul>
            </div>
            <div class="ubalance-group">
              <div class="ubalance-group-label">Mentale tegn</div>
              <ul class="ubalance-list">
                ${d.ubalanceTegn.mentale.map(t => `<li>${t}</li>`).join('')}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div class="expand-card">
        <div class="expand-header">
          <span class="expand-header-title">Årsager til ubalance</span>
          <span class="expand-chevron">›</span>
        </div>
        <div class="expand-body">
          <div class="expand-body-inner">
            <div class="prose">${textToHtml(d.ubalanceTegn.aarsag)}</div>
          </div>
        </div>
      </div>
    </div>`;

  // ── DIVIDER ──
  html += '<div class="section"><div class="divider"></div></div>';

  // ── TEMAER — det dybe indhold ──
  html += `
    <div class="section">
      <div class="eyebrow">Fasens temaer</div>
      ${d.temaer.map(t => `
        <div class="expand-card">
          <div class="expand-header">
            <span class="expand-header-title">${t.title}</span>
            <span class="expand-chevron">›</span>
          </div>
          <div class="expand-body">
            <div class="expand-body-inner">
              <div class="prose">${textToHtml(t.tekst)}</div>
            </div>
          </div>
        </div>
      `).join('')}
    </div>`;

  // ── DIVIDER ──
  html += '<div class="section"><div class="divider"></div></div>';

  // ── ØVELSER & RÅD — det praktiske ──
  html += `
    <div class="section">
      <div class="eyebrow">Øvelser & råd</div>
      ${d.oevelser.map(o => `
        <div class="expand-card">
          <div class="expand-header">
            <span class="expand-header-title">${o.title}</span>
            <span class="expand-chevron">›</span>
          </div>
          <div class="expand-body">
            <div class="expand-body-inner">
              <div class="meta" style="margin-bottom:var(--sp-2)">${o.type}</div>
              <div class="prose"><p>${o.desc}</p></div>
            </div>
          </div>
        </div>
      `).join('')}

      <div class="expand-card">
        <div class="expand-header">
          <span class="expand-header-title">Fasens råd</span>
          <span class="expand-chevron">›</span>
        </div>
        <div class="expand-body">
          <div class="expand-body-inner">
            ${d.fasensRaad.map(r => `<div class="raad-item">${r}</div>`).join('')}
          </div>
        </div>
      </div>
    </div>`;

  // ── DIVIDER ──
  html += '<div class="section"><div class="divider"></div></div>';

  // ── FIGUR ──
  html += `
    <div class="section">
      <div class="fig fig--sm"><img src="blaa_lotus_5.png" alt="" style="max-width:180px;opacity:0.85"></div>
    </div>`;

  // ── REFLEKSION ──
  const refl = d.refleksioner[Math.floor(Math.random() * d.refleksioner.length)];
  html += `
    <div class="section">
      <div class="eyebrow eyebrow--center">Refleksion</div>
      <div class="refleksion-centered">
        <div class="isa">${refl}</div>
      </div>
    </div>`;

  // ── DIVIDER ──
  html += '<div class="section"><div class="divider"></div></div>';

  // ── DIT ELEMENT & RELATIONER — den dybere forståelse ──
  html += `
    <div class="section">
      <div class="eyebrow">Den dybere forståelse</div>

      <div class="expand-card">
        <div class="expand-header">
          <span class="expand-header-title">Dit element — ${d.elementLabel}</span>
          <span class="expand-chevron">›</span>
        </div>
        <div class="expand-body">
          <div class="expand-body-inner">
            <div class="prose">${textToHtml(d.elementEssay)}</div>
          </div>
        </div>
      </div>

      <div class="expand-card">
        <div class="expand-header">
          <span class="expand-header-title">Relationer i denne fase</span>
          <span class="expand-chevron">›</span>
        </div>
        <div class="expand-body">
          <div class="expand-body-inner">
            <div class="prose">${textToHtml(d.relationerIFasen)}</div>
          </div>
        </div>
      </div>

      <div class="expand-card">
        <div class="expand-header">
          <span class="expand-header-title">Overgangen til næste fase</span>
          <span class="expand-chevron">›</span>
        </div>
        <div class="expand-body">
          <div class="expand-body-inner">
            <div class="prose">${textToHtml(d.overgangTekst)}</div>
          </div>
        </div>
      </div>
    </div>`;

  // ── PULL QUOTE ──
  html += `
    <div class="section">
      <div class="closing-quote">Den fase du er i nu, er ikke et sted du skal forbi. Det er et sted du skal igennem — med opmærksomhed, med nærvær, med alt det du er.</div>
    </div>`;

  // ── BACK TO TOP ──
  html += `
    <div class="back-to-top" style="margin-top:var(--sp-6)">
      <a href="#" onclick="window.scrollTo({top:0,behavior:'smooth'});return false;">Tilbage til toppen ↑</a>
    </div>`;

  container.innerHTML = html;
}


/* ============================================================
   BUILD RELATIONER SCREEN
   ============================================================ */
function buildRelationerScreen() {
  const d = FASE_DATA;
  const container = document.getElementById('relationer-content');
  if (!container) return;

  const elDyn = {
    naerer: 'Din Jord nærer Metal — din stabilitet og omsorg skaber grundlag for klarhed.',
    kontrollerer: 'Jord kontrollerer Vand — dit fundament giver det flydende retning og form.',
    naeret_af: 'Ild nærer din Jord — passion og varme gør dit fundament levende.',
    kontrolleret_af: 'Træ kontrollerer din Jord — vækst og forandring forhindrer stagnation.'
  };

  const samtaleAabnere = [
    'Hvad giver dig energi i vores relation — og hvad koster?',
    'Hvornår føler du dig mest set af mig?',
    'Hvad har du brug for fra mig lige nu, som du ikke beder om?',
    'Hvornår nærede vi sidst hinanden — ikke af pligt, men af lyst?',
    'Hvad ville du ønske jeg forstod bedre ved dig?'
  ];

  const relRaad = {
    forDig: 'Jord-energien nærer din omsorg. Du mærker måske en trang til at tage vare på andre. Husk også at nære dig selv.',
    forAnden: 'Din partners krop kalder på det den har brug for. Mød dem der — ikke med løsninger, men med nærvær.',
    sammen: 'I kan mødes over mad, samtale og tryghed. Jord finder hvile i det kendte — lav noget hjemme sammen, noget roligt og varmt.'
  };

  const samtale = samtaleAabnere[Math.floor(Math.random() * samtaleAabnere.length)];

  let html = '';

  // ── HERO ──
  html += `
    <div class="section dybde-hero">
      <div class="eyebrow" >Dine relationer</div>
      <div class="dybde-fase-label">Når livsfaser mødes</div>
      <div class="isa isa--sm">Hvert menneske du møder, bærer sin egen rytme. Når jeres energier mødes, sker der noget — noget der nærer, noget der udfordrer, noget der spejler det du selv bærer.</div>
      <div class="fig" style="margin-top:var(--sp-4)">
        <img src="relationer_forside.png" alt="Relationer" style="max-width:260px">
      </div>
    </div>`;

  // ── JERES ELEMENT-DYNAMIK ──
  html += `
    <div class="section">
      <div class="eyebrow" >Dit elements relationer</div>
      <div class="expand-card">
        <div class="expand-header">
          <span class="expand-header-title">Det du nærer</span>
          <span class="expand-chevron">›</span>
        </div>
        <div class="expand-body">
          <div class="expand-body-inner">
            <div class="prose"><p>${elDyn.naerer}</p></div>
          </div>
        </div>
      </div>
      <div class="expand-card">
        <div class="expand-header">
          <span class="expand-header-title">Det der nærer dig</span>
          <span class="expand-chevron">›</span>
        </div>
        <div class="expand-body">
          <div class="expand-body-inner">
            <div class="prose"><p>${elDyn.naeret_af}</p></div>
          </div>
        </div>
      </div>
      <div class="expand-card">
        <div class="expand-header">
          <span class="expand-header-title">Det du udfordrer</span>
          <span class="expand-chevron">›</span>
        </div>
        <div class="expand-body">
          <div class="expand-body-inner">
            <div class="prose"><p>${elDyn.kontrollerer}</p></div>
          </div>
        </div>
      </div>
      <div class="expand-card">
        <div class="expand-header">
          <span class="expand-header-title">Det der udfordrer dig</span>
          <span class="expand-chevron">›</span>
        </div>
        <div class="expand-body">
          <div class="expand-body-inner">
            <div class="prose"><p>${elDyn.kontrolleret_af}</p></div>
          </div>
        </div>
      </div>
    </div>`;

  // ── DIVIDER ──
  html += '<div class="section"><div class="divider"></div></div>';

  // ── RELATIONER I DIN FASE ──
  html += `
    <div class="section">
      <div class="eyebrow" >Relationer i din fase</div>
      ${renderTruncated(d.relationerIFasen, 5)}
    </div>`;

  // ── DIVIDER ──
  html += '<div class="section"><div class="divider"></div></div>';

  // ── SAMTALÅBNER ──
  html += `
    <div class="section">
      <div class="eyebrow" >Samtaleåbner</div>
      <div class="refleksion-centered">
        <div class="isa">${samtale}</div>
      </div>
    </div>`;

  // ── DIVIDER ──
  html += '<div class="section"><div class="divider"></div></div>';

  // ── RÅD TIL JERES RELATION ──
  html += `
    <div class="section">
      <div class="eyebrow" >Råd til jeres relation</div>
      <div class="expand-card">
        <div class="expand-header">
          <span class="expand-header-title">For dig</span>
          <span class="expand-chevron">›</span>
        </div>
        <div class="expand-body">
          <div class="expand-body-inner">
            <div class="prose"><p>${relRaad.forDig}</p></div>
          </div>
        </div>
      </div>
      <div class="expand-card">
        <div class="expand-header">
          <span class="expand-header-title">For den anden</span>
          <span class="expand-chevron">›</span>
        </div>
        <div class="expand-body">
          <div class="expand-body-inner">
            <div class="prose"><p>${relRaad.forAnden}</p></div>
          </div>
        </div>
      </div>
      <div class="expand-card">
        <div class="expand-header">
          <span class="expand-header-title">Noget I kan gøre sammen</span>
          <span class="expand-chevron">›</span>
        </div>
        <div class="expand-body">
          <div class="expand-body-inner">
            <div class="prose"><p>${relRaad.sammen}</p></div>
          </div>
        </div>
      </div>
    </div>`;

  // ── DIVIDER ──
  html += '<div class="section"><div class="divider"></div></div>';

  // ── DYK DYBERE ──
  html += `
    <div class="section" style="text-align:center">
      <div class="eyebrow" >Dyk dybere</div>
      <div class="explore-pills">
        <span class="explore-pill" data-link="rel-dybere" style="color:var(--deep-link-color);border-color:var(--deep-link-border)">Dine Dybere Relationer →</span>
      </div>
    </div>`;

  // ── PULL QUOTE ──
  html += `
    <div class="section">
      <div class="fig fig--sm"><img src="relationer_blad.png" alt="" class="no-bg" style="max-width:180px;opacity:0.85"></div>
      <div class="closing-quote">De mennesker vi vælger at bære med os, er sjældent tilfældige. De bærer det element vi selv mangler — eller det vi har for meget af.</div>
    </div>`;

  html += `
    <div class="back-to-top" style="margin-top:var(--sp-6)">
      <a href="#" onclick="window.scrollTo({top:0,behavior:'smooth'});return false;">Tilbage til toppen ↑</a>
    </div>`;

  container.innerHTML = html;
}


/* ============================================================
   BUILD DYBERE RELATIONER SCREEN
   ============================================================ */
function buildRelDybereScreen() {
  const d = FASE_DATA;
  const container = document.getElementById('rel-dybere-content');
  if (!container) return;

  const dynamikker = {
    'JORD_VAND': 'Jord møder Vand. Din omsorg udfordrer vandets flow — men giver det retning og form. Der er en spænding mellem at holde fast og lade strømme, og det er netop den spænding der kan skabe dybde.',
    'JORD_TRAE': 'Jord møder Træ. Træets vækst rusker i dit fundament. Noget nyt vil frem, men noget andet vil holde fast. Kunsten er at lade væksten ske uden at miste dit fundament.',
    'JORD_ILD': 'Jord møder Ild. Ildens varme nærer din jord — passion og energi gør dit fundament levende. Det er en naturlig næring: ild skaber det, jord bærer det.',
    'JORD_METAL': 'Jord møder Metal. Din stabilitet skaber grundlag for metallets klarhed. Det er jordens gave: at bære, så andre kan se klart. Men husk at klarheden også kan vise dig, hvad din jord har brug for.',
    'JORD_JORD': 'Jord møder Jord. Dobbelt fundament — dyb tryghed og gensidig næring. To jordmennesker kan skabe et hjem der føles urokkeligt. Men husk bevægelse — jord der aldrig vendes, bliver hård.'
  };

  const faseMoeder = {
    titel: 'Når Fase 5 møder andre faser',
    tekster: [
      { fase: 'Fase 1-2 (børn)', tekst: 'Dine børn er sandsynligvis i de tidligste faser — ren vækst, ren sansning. Mødet mellem din jordfase og deres træ-fase kan være det smukkeste og det sværeste. De har brug for alt, og du giver alt. Husk: dit barn har mere brug for en nogenlunde glad mor end en perfekt udmattet en.' },
      { fase: 'Fase 3 (teenagere)', tekst: 'Ild møder jord. Teenagerens intensitet og behov for løsrivelse kan ryste dit fundament. De presser mod grænser lige når du selv har allermest brug for stabilitet. Jordens gave er at rumme ilden uden at slukke den.' },
      { fase: 'Fase 4-5 (partner/venner)', tekst: 'Jord møder jord — eller jord møder det element din partner bærer. Parforholdet sættes på prøve af travlheden. Hvem tager sig af hvad? Hvem har ret til at være træt? Det der holder jer sammen er evnen til at være et team — og at huske at nære forbindelsen, ikke kun forpligtelsen.' },
      { fase: 'Fase 8-9 (forældre)', tekst: 'Dine forældre bevæger sig mod dybde og visdom. Rollerne begynder at bytte — du bliver den der holder øje, koordinerer, bekymrer dig. Sandwich-positionen er reel og udmattende. Jord-elementet vil nære alle, men navet slider ned når hjulet aldrig holder stille.' }
    ]
  };

  const centraleFoelelser = {
    dig: { title: 'Din følelse: Omsorg', tekst: 'Jord-elementets gave er omsorg — den dybe, instinktive omsorg der gør dig til centrum. Men skyggefølelsen er bekymring. Tankerne kører i ring, og bekymringen slider jorden ned. At lære at modtage omsorg er lige så vigtigt som at give den.' },
    partner: { title: 'Det du møder i andre', tekst: 'Hvert element bærer sin egen følelse. Vand bærer frygt og dybde. Træ bærer frustration og vækst. Ild bærer glæde og rastløshed. Metal bærer sorg og klarhed. Når du forstår den andens element, forstår du deres følelsesliv — og hvorfor I nogle gange taler forbi hinanden.' }
  };

  const parOevelse = {
    title: 'Ét ritual for jeres forbindelse',
    desc: 'Sæt jer over for hinanden. Luk øjnene i ét minut. Åbn dem og se den anden i øjnene — uden ord, uden dagsorden. Bare to mennesker der ser hinanden. Jord-elementet finder hvile i nærvær, ikke i ord. Ti sekunder er nok til at minde jer om, at I er mere end en to-do-liste.'
  };

  let html = '';

  // ── HERO ──
  html += `
    <div class="section dybde-hero">
      <div class="eyebrow" >Dine dybere relationer</div>
      <div class="dybde-fase-label">Elementerne der mødes</div>
      <div class="isa isa--sm">Når to mennesker mødes, mødes to elementer. Den dynamik — hvad der nærer, hvad der udfordrer, hvad der spejler — er nøglen til at forstå jeres relation på et dybere plan.</div>
      <div class="fig" style="margin-top:var(--sp-4)">
        <img src="oejeblikke_skaerm_figur_2.png" alt="Dybere relationer" style="max-width:260px">
      </div>
    </div>`;

  // ── ELEMENT-DYNAMIKKER ──
  html += `
    <div class="section">
      <div class="eyebrow" >Jord møder de andre elementer</div>
      ${Object.entries(dynamikker).map(([key, tekst]) => {
        const elNavn = key.split('_')[1];
        const labels = { VAND: 'Vand', TRAE: 'Træ', ILD: 'Ild', METAL: 'Metal', JORD: 'Jord' };
        return `
        <div class="expand-card">
          <div class="expand-header">
            <span class="expand-header-title">Jord møder ${labels[elNavn]}</span>
            <span class="expand-chevron">›</span>
          </div>
          <div class="expand-body">
            <div class="expand-body-inner">
              <div class="prose"><p>${tekst}</p></div>
            </div>
          </div>
        </div>`;
      }).join('')}
    </div>`;

  // ── DIVIDER ──
  html += '<div class="section"><div class="divider"></div></div>';

  // ── NÅR FASE 5 MØDER ANDRE FASER ──
  html += `
    <div class="section">
      <div class="eyebrow" >${faseMoeder.titel}</div>
      ${faseMoeder.tekster.map(t => `
        <div class="expand-card">
          <div class="expand-header">
            <span class="expand-header-title">${t.fase}</span>
            <span class="expand-chevron">›</span>
          </div>
          <div class="expand-body">
            <div class="expand-body-inner">
              <div class="prose"><p>${t.tekst}</p></div>
            </div>
          </div>
        </div>
      `).join('')}
    </div>`;

  // ── DIVIDER ──
  html += '<div class="section"><div class="divider"></div></div>';

  // ── JERES CENTRALE FØLELSER ──
  html += `
    <div class="section">
      <div class="eyebrow" >Jeres centrale følelser</div>
      <div class="expand-card">
        <div class="expand-header">
          <span class="expand-header-title">${centraleFoelelser.dig.title}</span>
          <span class="expand-chevron">›</span>
        </div>
        <div class="expand-body">
          <div class="expand-body-inner">
            <div class="prose"><p>${centraleFoelelser.dig.tekst}</p></div>
          </div>
        </div>
      </div>
      <div class="expand-card">
        <div class="expand-header">
          <span class="expand-header-title">${centraleFoelelser.partner.title}</span>
          <span class="expand-chevron">›</span>
        </div>
        <div class="expand-body">
          <div class="expand-body-inner">
            <div class="prose"><p>${centraleFoelelser.partner.tekst}</p></div>
          </div>
        </div>
      </div>
    </div>`;

  // ── DIVIDER ──
  html += '<div class="section"><div class="divider"></div></div>';

  // ── ØVELSE SAMMEN ──
  html += `
    <div class="section">
      <div class="eyebrow" >Noget I kan gøre sammen</div>
      <div class="expand-card">
        <div class="expand-header">
          <span class="expand-header-title">${parOevelse.title}</span>
          <span class="expand-chevron">›</span>
        </div>
        <div class="expand-body">
          <div class="expand-body-inner">
            <div class="prose"><p>${parOevelse.desc}</p></div>
          </div>
        </div>
      </div>
    </div>`;

  // ── FIGUR ──
  html += `
    <div class="section">
      <div class="fig fig--sm"><img src="tidslinje-figur-2.png" alt="" style="max-width:180px;opacity:0.85"></div>
    </div>`;

  // ── REFLEKSION ──
  html += `
    <div class="section">
      <div class="eyebrow eyebrow--center">Refleksion</div>
      <div class="refleksion-centered">
        <div class="isa">Hvem giver dig energi — og hvem kræver den? Det er ikke et spørgsmål om skyld. Det er et spørgsmål om elementernes samspil.</div>
      </div>
    </div>`;

  // ── PULL QUOTE ──
  html += `
    <div class="section">
      <div class="closing-quote">Måske undrer du dig over, hvorfor nogle mennesker føles som at komme hjem — mens andre langsomt tømmer dig. Det handler ikke om vilje. Det handler om elementer der mødes.</div>
    </div>`;

  html += `
    <div class="back-to-top" style="margin-top:var(--sp-6)">
      <a href="#" onclick="window.scrollTo({top:0,behavior:'smooth'});return false;">Tilbage til toppen ↑</a>
    </div>`;

  container.innerHTML = html;
}


/* ============================================================
   BUILD TIDSREJSE SCREEN
   ============================================================ */
function buildTidsrejseScreen() {
  const d = FASE_DATA;
  const container = document.getElementById('tidsrejse-content');
  if (!container) return;

  const niCyklusser = [
    { navn: 'Livsfase', element: 'Jord', desc: 'Din livslange cyklus. Fase 5 — jord-elementet dominerer fra ca. 28 til 35 år. Ansvar, omsorg og modning.' },
    { navn: 'Årstid', element: 'Vand', desc: 'Vinteren hører til vand-elementet. Mørket inviterer til indadvendthed og hvile. Nyrerne samler kraft.' },
    { navn: 'Måned', element: 'Vand', desc: 'Denne måned bærer vandets energi. Dybde og intuition er tilgængelige — lyt til det der melder sig i stilheden.' },
    { navn: 'Ugedag', element: 'varierer', desc: 'Hver ugedag bærer sit element. Mandag er vand, tirsdag træ, onsdag ild, torsdag jord, fredag metal, lørdag vand, søndag træ.' },
    { navn: 'Organur', element: 'varierer', desc: 'Hvert organ har sin tid på døgnet. Milten er stærkest kl. 09-11, maven kl. 07-09. At spise varmt om morgenen nærer din jord.' }
  ];

  const tidSomSpiral = 'Tiden er ikke en linje. Den er en spiral — og de steder der gør ondt, er de steder der vil forstås. Hvert år vender du tilbage til de samme årstider, men du er ikke den samme. Foråret i år er ikke foråret sidste år. Vinteren nu er dybere end vinteren for ti år siden. Spiralen går indad og opad på samme tid.\n\nI den kinesiske medicin tænker man i cyklusser, ikke i fremskridt. Der er ingen destination — kun bevægelse. De fem elementer veksler i en evig dans: vand nærer træ, træ nærer ild, ild nærer jord, jord nærer metal, metal nærer vand. Og du er midt i den dans, med din egen rytme, din egen fase, dine egne skift.';

  const skiftTekst = 'Hvert element-skift er en overgang — en tid hvor den gamle energi langsomt giver plads til den nye. Overgangen fra ild til jord (Fase 4 til 5) mærkes som en bevægelse fra passion og retning mod næring og fundament. Det brændende spørgsmål "hvad vil jeg?" afløses gradvist af "hvad kan bære?".\n\nOvergangen fra jord til metal (Fase 5 til 6) begynder omkring femogtredive. Spørgsmålene handler mindre om at bære og mere om at skelne. Metallets klarhed sorterer i det jordens omsorg har samlet — og den sortering kan være både befriende og smertefuld.';

  const aarstidsTekst = 'Jord-elementet hører til sensommeren — den modne tid mellem sommerens intensitet og efterårets sortering. I sensommeren er der en fylde og en varme, der er anderledes end sommerens — mere stille, mere mættet, tættere på jorden.\n\nI denne fase kan du mærke sensommerens kvaliteter i din egen krop: en tyngde der kan være behagelig og nærende, men også udmattende. Efterårets invitation til at slippe og sortere er vigtig medicin for en jordkvinde der bærer for tungt.\n\nMiltens tid i organuret er kl. 09-11. Om formiddagen er din fordøjelse og din tankeklarhed stærkest — brug den tid til det der kræver koncentration og nærvær. Mavens tid er kl. 07-09, og en varm morgenmad i det tidsrum er måske det bedste, du kan gøre for din jord.';

  let html = '';

  // ── HERO ──
  html += `
    <div class="section dybde-hero">
      <div class="eyebrow" >Tidsrejse</div>
      <div class="dybde-fase-label">Din rejse gennem tid</div>
      <div class="isa isa--sm">Din krop og sjæl har bevæget sig gennem mange faser. Hvert øjeblik i dit liv bærer sine cyklusser — og de fortæller en historie om hvem du var, hvem du er, og hvem du er ved at blive.</div>
      <div class="fig" style="margin-top:var(--sp-4)">
        <img src="vinduer-tid-lilla.png" alt="Tidsrejse" style="max-width:390px">
      </div>
    </div>`;

  // ── DINE FEM CYKLUSSER ──
  html += `
    <div class="section">
      <div class="eyebrow" >Dine fem cyklusser</div>
      ${niCyklusser.map(c => `
        <div class="expand-card">
          <div class="expand-header">
            <span class="expand-header-title">${c.navn}${c.element !== 'varierer' ? ' · ' + c.element : ''}</span>
            <span class="expand-chevron">›</span>
          </div>
          <div class="expand-body">
            <div class="expand-body-inner">
              <div class="prose"><p>${c.desc}</p></div>
            </div>
          </div>
        </div>
      `).join('')}
    </div>`;

  // ── DIVIDER ──
  html += '<div class="section"><div class="divider"></div></div>';

  // ── ÅRSTIDERNES CYKLUS ──
  html += `
    <div class="section">
      <div class="eyebrow" >Årstidernes cyklus i din fase</div>
      ${renderTruncated(aarstidsTekst, 5)}
    </div>`;

  // ── DIVIDER ──
  html += '<div class="section"><div class="divider"></div></div>';

  // ── DINE ELEMENT-SKIFT ──
  html += `
    <div class="section">
      <div class="eyebrow" >Dine element-skift</div>
      ${renderTruncated(skiftTekst, 5)}
    </div>`;

  // ── DIVIDER ──
  html += '<div class="section"><div class="divider"></div></div>';

  // ── FIGUR ──
  html += `
    <div class="section">
      <div class="fig fig--sm"><img src="lilla-lotus.png" alt="" class="no-bg" style="max-width:140px;opacity:0.7"></div>
    </div>`;

  // ── REFLEKSION ──
  html += `
    <div class="section">
      <div class="eyebrow eyebrow--center">Refleksion</div>
      <div class="refleksion-centered">
        <div class="isa">Hvis du kunne rejse tilbage til dig selv for ti år siden — hvad ville du sige? Og hvad ville hun sige til dig?</div>
      </div>
    </div>`;

  // ── DIVIDER ──
  html += '<div class="section"><div class="divider"></div></div>';

  // ── DYK DYBERE ──
  html += `
    <div class="section" style="text-align:center">
      <div class="eyebrow" >Dyk dybere</div>
      <div class="explore-pills">
        <span class="explore-pill" data-link="tids-dybere" style="color:var(--deep-link-color-alt);border-color:var(--deep-link-border-alt)">Din Dybere Tidsrejse →</span>
      </div>
    </div>`;

  // ── PULL QUOTE ──
  html += `
    <div class="section">
      <div class="closing-quote">Tiden er ikke en linje. Den er en spiral — og de steder der gør ondt, er de steder der vil forstås.</div>
    </div>`;

  html += `
    <div class="back-to-top" style="margin-top:var(--sp-6)">
      <a href="#" onclick="window.scrollTo({top:0,behavior:'smooth'});return false;">Tilbage til toppen ↑</a>
    </div>`;

  container.innerHTML = html;
}


/* ============================================================
   BUILD DYBERE TIDSREJSE SCREEN
   ============================================================ */
function buildTidsDybereScreen() {
  const d = FASE_DATA;
  const container = document.getElementById('tids-dybere-content');
  if (!container) return;

  const tidSomSpiral = 'Tiden er ikke en linje. Den er en spiral — og de steder der gør ondt, er de steder der vil forstås. Hvert år vender du tilbage til de samme årstider, men du er ikke den samme. Foråret i år er ikke foråret sidste år. Vinteren nu er dybere end vinteren for ti år siden.\n\nI den kinesiske medicin tænker man i cyklusser, ikke i fremskridt. Der er ingen destination — kun bevægelse. De fem elementer veksler i en evig dans: vand nærer træ, træ nærer ild, ild nærer jord, jord nærer metal, metal nærer vand. Og du er midt i den dans, med din egen rytme, din egen fase, dine egne skift.\n\nDet er derfor vi kan tale om livsfaser og årstider i samme åndedræt. De følger den samme logik — den samme spiral af vækst, blomstring, modning, sortering og hvile. Forskellen er bare tempoet: årstiderne drejer på et år, livsfaserne på et liv.';

  const faseTidslinje = [
    { fase: 'Fase 1 · Vand (0-7 år)', tekst: 'Den spæde begyndelse. Barnet lever i ren sansning, uden filtre. Alt spirer og vokser — tillid, berøring, lyd. Her lægges grundstenen for alt det, der kommer. Nyrerne og vand-elementet dominerer: dybde, essens, grundlæggende livskraft.' },
    { fase: 'Fase 2 · Træ (7-14 år)', tekst: 'Udforskning og leg. Barnet bryder ud af den trygge base og opdager verden. Leveren og træ-elementet giver retning og nysgerrighed. Kreativiteten blomstrer, og de første venskaber får dybde.' },
    { fase: 'Fase 3 · Ild (14-21 år)', tekst: 'Forvandlingens ild. Teenagerens krop og sind gennemgår den mest dramatiske forandring siden spædbarnsalderen. Hjertet og ild-elementet bringer passion, identitetssøgen og de første dybe forbindelser.' },
    { fase: 'Fase 4 · Jord (21-28 år)', tekst: 'Den unge voksne bygger fundament. Karriere, relationer, identitet — alt tager form. Milten og jord-elementet giver evnen til at nære drømme og gøre dem til virkelighed.' },
    { fase: 'Fase 5 · Jord (28-35 år)', tekst: 'Du er her nu. Ansvar for karriere, måske børn, måske parforhold. Energien er centrerende og bærende — men jorden har også brug for næring. Milten arbejder på overarbejde.' },
    { fase: 'Fase 6 · Metal (35-42 år)', tekst: 'Den første sortering. Metallets klarhed begynder at skelne mellem det essentielle og det overflødige. Lungerne og tyktarmen renser — fysisk og mentalt.' },
    { fase: 'Fase 7 · Metal (42-49 år)', tekst: 'Overgangsalderen og den dybe sortering. Alt det der ikke længere tjener dig, falder væk. Der er sorg i det — men også en befrielse der kan overraske.' },
    { fase: 'Fase 8 · Vand (49-56 år)', tekst: 'Dybdens tid. Vandet vender tilbage. Efter metallets sortering synker kvinden ned i en ny stilhed — ikke tomhedens, men dybdens. Noget husker dette element fra livets allerførste år.' },
    { fase: 'Fase 9 · Træ (56+ år)', tekst: 'Det nye forår. Træet spirer igen — men nu med rødder der rækker helt ned til grundvandet. En ny vækst begynder, båret af al den erfaring der er samlet.' }
  ];

  const kropGennemTid = 'I Fase 5 bærer kroppen bogstaveligt. Musklerne og bindevævet — jord-elementets kropsvæv — holder det hele sammen: børn på hoften, tasker på skulderen, ansvar på ryggen. Fordøjelsen arbejder på overarbejde, og milten transformerer alt til næring.\n\nSammenlign med kroppen i Fase 3 (ild): ren energi, hurtig forbrænding, en krop der kunne alt. Eller med kroppen i Fase 8 (vand): langsommere, dybere, med en visdom der sidder i knoglerne. Din krop nu er midt imellem — stærk nok til at bære, men klog nok til at vide, at den ikke kan bære alt.';

  const sindGennemTid = 'Sindet i Fase 5 jonglerer mange bolde. Karriere, børn, parforhold, identitet — alt kræver opmærksomhed. Bekymring er jord-elementets skyggefølelse, og den kan køre i ring som en mølle der aldrig standser.\n\nI Fase 3 var sindet rettet udad — mod verden, mod muligheder, mod den man ville blive. I Fase 8 vender sindet indad — mod dybde, visdom, det essentielle. Dit sind nu er i krydsfeltet: udadvendt nok til at handle, indadvendt nok til at tvivle. Den dobbelthed er ikke en fejl — den er jordens natur.';

  let html = '';

  // ── HERO ──
  html += `
    <div class="section dybde-hero">
      <div class="eyebrow" >Din dybere tidsrejse</div>
      <div class="dybde-fase-label">Rejsen gennem tid</div>
      <div class="isa isa--sm">Se din egen historie gennem de ni fasers linse. Forstå hvad der formede dig, hvad der bærer dig nu, og hvad der venter forude.</div>
      <div class="fig" style="margin-top:var(--sp-4)">
        <img src="min-rejse-ikigai.png" alt="Din rejse" class="no-bg" style="max-width:260px">
      </div>
    </div>`;

  // ── TID SOM SPIRAL ──
  html += `
    <div class="section">
      <div class="eyebrow" >Tid som spiral</div>
      ${renderTruncated(tidSomSpiral, 5)}
    </div>`;

  // ── DIVIDER ──
  html += '<div class="section"><div class="divider"></div></div>';

  // ── DIN TIDSLINJE ──
  html += `
    <div class="section">
      <div class="eyebrow" >Din tidslinje — de ni faser</div>
      ${faseTidslinje.map(f => `
        <div class="expand-card">
          <div class="expand-header">
            <span class="expand-header-title">${f.fase}</span>
            <span class="expand-chevron">›</span>
          </div>
          <div class="expand-body">
            <div class="expand-body-inner">
              <div class="prose"><p>${f.tekst}</p></div>
            </div>
          </div>
        </div>
      `).join('')}
    </div>`;

  // ── DIVIDER ──
  html += '<div class="section"><div class="divider"></div></div>';

  // ── KROPPEN & SINDET GENNEM TID ──
  html += `
    <div class="section">
      <div class="eyebrow" >Kroppen & sindet gennem tid</div>
      <div class="expand-card">
        <div class="expand-header">
          <span class="expand-header-title">Kroppen gennem faserne</span>
          <span class="expand-chevron">›</span>
        </div>
        <div class="expand-body">
          <div class="expand-body-inner">
            <div class="prose">${textToHtml(kropGennemTid)}</div>
          </div>
        </div>
      </div>
      <div class="expand-card">
        <div class="expand-header">
          <span class="expand-header-title">Sindet gennem faserne</span>
          <span class="expand-chevron">›</span>
        </div>
        <div class="expand-body">
          <div class="expand-body-inner">
            <div class="prose">${textToHtml(sindGennemTid)}</div>
          </div>
        </div>
      </div>
    </div>`;

  // ── DIVIDER ──
  html += '<div class="section"><div class="divider"></div></div>';

  // ── OVERGANGEN ──
  html += `
    <div class="section">
      <div class="eyebrow" >Overgangen — dit næste kapitel</div>
      <div class="expand-card">
        <div class="expand-header">
          <span class="expand-header-title">Fra Jord til Metal (Fase 5 → 6)</span>
          <span class="expand-chevron">›</span>
        </div>
        <div class="expand-body">
          <div class="expand-body-inner">
            <div class="prose"><p>${d.overgangTekst}</p><p>Metallets klarhed vil sortere i alt det, jordens omsorg har samlet. Den sortering kan være befriende — men den begynder med at se klart på det der er, og det kræver mod.</p></div>
          </div>
        </div>
      </div>
    </div>`;

  // ── DIVIDER ──
  html += '<div class="section"><div class="divider"></div></div>';

  // ── ØVELSE: REJSEN ──
  html += `
    <div class="section">
      <div class="eyebrow" >Øvelse: Rejsen</div>
      <div class="expand-card">
        <div class="expand-header">
          <span class="expand-header-title">Mød dig selv gennem faserne</span>
          <span class="expand-chevron">›</span>
        </div>
        <div class="expand-body">
          <div class="expand-body-inner">
            <div class="prose">
              <p>Sæt dig et stille sted. Luk øjnene. Forestil dig dig selv som barn — i Fase 1, i ren sansning. Hvad ser du? Hvad mærker du? Giv hende et øjeblik.</p>
              <p>Flyt nu til teenageren — Fase 3, fuld af ild. Hvad brændte hun for? Hvad var hun bange for? Giv hende et øjeblik.</p>
              <p>Og nu den unge kvinde — Fase 4, fuld af drømme og planer. Hvad byggede hun? Hvad håbede hun? Giv hende et øjeblik.</p>
              <p>Og endelig — dig selv, nu. Fase 5. Jorden. Hvad bærer du? Hvad har du brug for? Og hvad ville alle de tidligere versioner af dig sige, hvis de kunne se dig nu?</p>
            </div>
          </div>
        </div>
      </div>
    </div>`;

  // ── FIGUR ──
  html += `
    <div class="section">
      <div class="fig fig--sm"><img src="spiral_final.png" alt="" style="max-width:180px;opacity:0.85"></div>
    </div>`;

  // ── REFLEKSION ──
  html += `
    <div class="section">
      <div class="eyebrow eyebrow--center">Refleksion</div>
      <div class="refleksion-centered">
        <div class="isa">Hvilken version af dig selv savner du mest? Og hvad ville hun sige til den kvinde, du er blevet?</div>
      </div>
    </div>`;

  // ── PULL QUOTE ──
  html += `
    <div class="section">
      <div class="closing-quote">Tiden er ikke en linje. Den er en spiral — og hvert lag bærer sine egne gaver, sine egne sår, sine egne sandheder.</div>
    </div>`;

  html += `
    <div class="back-to-top" style="margin-top:var(--sp-6)">
      <a href="#" onclick="window.scrollTo({top:0,behavior:'smooth'});return false;">Tilbage til toppen ↑</a>
    </div>`;

  container.innerHTML = html;
}


/* ============================================================
   BUILD DE NI FASER SCREEN
   ============================================================ */
function buildNiFaserScreen() {
  const d = FASE_DATA;
  const container = document.getElementById('ni-faser-content');
  if (!container) return;

  const faser = [
    { fase: 'Fase 1 · Vand · 0–7 år', titel: 'Livets begyndelse', tekst: 'Vandets tid. Alt er nyt, alt er muligt. Barnet lever i kroppen og i øjeblikket — uden at spørge hvorfor. Nyrerne og vand-elementet dominerer: dybde, essens, grundlæggende livskraft. Her lægges grundstenen for alt det, der kommer.' },
    { fase: 'Fase 2 · Vand · 7–14 år', titel: 'Udforskning', tekst: 'Vandets anden bølge. Barnet begynder at spørge, at mærke grænser, at forstå at verden er større end hjemmet. Nysgerrigheden vokser — og med den evnen til at bevæge sig ud i det ukendte.' },
    { fase: 'Fase 3 · Træ · 14–21 år', titel: 'Forvandling', tekst: 'Træets tid. Kroppen forandres, identiteten brydes og bygges. Alt er intenst, alt er vigtigt, alt er nu. Leveren og træ-elementet giver retning og nysgerrighed. De første dybe forbindelser får form.' },
    { fase: 'Fase 4 · Træ · 21–28 år', titel: 'Blomstring', tekst: 'Træets blomstring. Kroppen er stærk, viljen er klar. Livet folder sig ud med en kraft der føles ustoppelig. Karriere, relationer, identitet — alt tager form.' },
    { fase: 'Fase 5 · Jord · 28–35 år', titel: 'Ansvar', tekst: 'Jordens tid. Alt kræver opmærksomhed — børn, karriere, parforhold. Energien er centrerende og bærende — men jorden har også brug for næring. Milten arbejder på overarbejde.' },
    { fase: 'Fase 6 · Jord · 35–42 år', titel: 'Modning', tekst: 'Jordens høst. Kroppen beder om langsommere, dybere, mere rodfæstet. Prioriteterne skifter stille — fra mere til nok. Det du har sået, modner nu.' },
    { fase: 'Fase 7 · Metal · 42–49 år', titel: 'Høst', tekst: 'Metallets tid. Overgangsalderen og den dybe sortering. Alt det der ikke længere tjener dig, falder væk. Lungerne og tyktarmen renser — fysisk og mentalt. Der er sorg i det — men også en befrielse der kan overraske.' },
    { fase: 'Fase 8 · Metal · 49–56 år', titel: 'Frigørelse', tekst: 'Metallets klarhed. Skarphed, klarhed, afskillelse. Du giver slip på det der ikke længere tjener dig — og finder frihed i det tomme rum. En ny stilhed melder sig.' },
    { fase: 'Fase 9 · Vand · 56–63 år', titel: 'Visdom', tekst: 'Vandets tilbagevenden. Cirklen slutter sig. Alt det du har lært, mærket og sluppet samler sig nu i en stille vished. Du er hele dit liv. Det niende kapitel er ikke en afslutning — det er det sted hvor alt samler sig til noget stille og helt.' }
  ];

  let html = '';

  // ── HERO ──
  html += `
    <div class="section dybde-hero">
      <div class="eyebrow">De Ni Livsfaser</div>
      <div class="dybde-fase-label">Ni kapitler · Ét liv</div>
      <div class="isa isa--sm">Fra det første åndedrag til visdommens stille rum. Ni faser med hvert sit element, sin krop og sin opgave. Find din fase — og forstå de kapitler der kom før dig, og dem der venter.</div>
      <div class="fig" style="margin-top:var(--sp-4)">
        <img src="assets/images/ni-livsfaser.png" alt="De ni livsfaser" style="max-width:260px" class="no-bg">
      </div>
    </div>`;

  // ── DIN FASE LIGE NU ──
  html += `
    <div class="section">
      <div class="eyebrow">Din fase lige nu</div>
      <div class="isa" style="margin-bottom:var(--sp-2)">Fase ${d.phase} · ${d.elementLabel}</div>
      <div class="prose"><p>${d.introText}</p></div>
    </div>`;

  // ── DIVIDER ──
  html += '<div class="section"><div class="divider"></div></div>';

  // ── DE TIDLIGE ÅR (1-3) ──
  html += `
    <div class="section">
      <div class="eyebrow">De tidlige år · Fase 1–3</div>
      <div class="isa isa--sm" style="margin-bottom:var(--sp-3)">De første 21 år er spiringens tid. Vand giver rod, Træ giver retning. Her lægges fundamentet for alt der kommer efter.</div>
      ${faser.slice(0, 3).map(f => `
        <div class="expand-card">
          <div class="expand-header">
            <span class="expand-header-title">${f.fase}</span>
            <span class="expand-chevron">›</span>
          </div>
          <div class="expand-body">
            <div class="expand-body-inner">
              <div class="isa" style="margin-bottom:var(--sp-2)">${f.titel}</div>
              <div class="prose"><p>${f.tekst}</p></div>
            </div>
          </div>
        </div>
      `).join('')}
    </div>`;

  // ── DIVIDER ──
  html += '<div class="section"><div class="divider"></div></div>';

  // ── LIVETS MIDTE (4-6) ──
  html += `
    <div class="section">
      <div class="eyebrow">Livets midte · Fase 4–6</div>
      <div class="isa isa--sm" style="margin-bottom:var(--sp-3)">De midterste år er fyldens tid. Træ blomstrer, Ild brænder, Jord modner. Her skabes, elskes og formes det liv der bliver dit.</div>
      ${faser.slice(3, 6).map(f => `
        <div class="expand-card">
          <div class="expand-header">
            <span class="expand-header-title">${f.fase}</span>
            <span class="expand-chevron">›</span>
          </div>
          <div class="expand-body">
            <div class="expand-body-inner">
              <div class="isa" style="margin-bottom:var(--sp-2)">${f.titel}</div>
              <div class="prose"><p>${f.tekst}</p></div>
            </div>
          </div>
        </div>
      `).join('')}
    </div>`;

  // ── DIVIDER ──
  html += '<div class="section"><div class="divider"></div></div>';

  // ── FIGUR ──
  html += `
    <div class="section">
      <div class="fig fig--sm"><img src="spiral_final.png" alt="Elementernes vandring" style="max-width:180px;opacity:0.85"></div>
    </div>`;

  // ── DEN MODNE REJSE (7-9) ──
  html += `
    <div class="section">
      <div class="eyebrow">Den modne rejse · Fase 7–9</div>
      <div class="isa isa--sm" style="margin-bottom:var(--sp-3)">De modne år er frigørelsens tid. Metal renser, Vand vender hjem. Her slipper du det overflødige — og finder det essentielle.</div>
      ${faser.slice(6, 9).map(f => `
        <div class="expand-card">
          <div class="expand-header">
            <span class="expand-header-title">${f.fase}</span>
            <span class="expand-chevron">›</span>
          </div>
          <div class="expand-body">
            <div class="expand-body-inner">
              <div class="isa" style="margin-bottom:var(--sp-2)">${f.titel}</div>
              <div class="prose"><p>${f.tekst}</p></div>
            </div>
          </div>
        </div>
      `).join('')}
    </div>`;

  // ── DIVIDER ──
  html += '<div class="section"><div class="divider"></div></div>';

  // ── CIRKLEN DER SLUTTER SIG ──
  html += `
    <div class="section">
      <div class="eyebrow">Cirklen der slutter sig</div>
      <div class="expand-card">
        <div class="expand-header">
          <span class="expand-header-title">Fra Vand til Vand</span>
          <span class="expand-chevron">›</span>
        </div>
        <div class="expand-body">
          <div class="expand-body-inner">
            <div class="prose"><p>Elementerne vandrer gennem livet — og vender hjem til begyndelsen. Du begyndte i Vand, og du vender tilbage til Vand. Men det er ikke det samme vand. Det er dybere, stille, og det bærer alt det du har været igennem. Cirklen er ikke lukket — den er hel.</p></div>
          </div>
        </div>
      </div>
      <div class="expand-card">
        <div class="expand-header">
          <span class="expand-header-title">Det alle faser har tilfælles</span>
          <span class="expand-chevron">›</span>
        </div>
        <div class="expand-body">
          <div class="expand-body-inner">
            <div class="prose"><p>Hver fase har sin egen tone, sit eget element, sin egen visdom. Men de har én ting tilfælles: de kalder på dig. Ikke på at du skal præstere — men på at du tør mærke, hvor du er.</p></div>
          </div>
        </div>
      </div>
    </div>`;

  // ── DIVIDER ──
  html += '<div class="section"><div class="divider"></div></div>';

  // ── REFLEKSION ──
  html += `
    <div class="section">
      <div class="eyebrow eyebrow--center">Refleksion</div>
      <div class="refleksion-centered">
        <div class="isa">Hvilken fase i dit liv var den sværeste — og hvad lærte den dig, som du ikke vidste du lærte?</div>
      </div>
    </div>`;

  // ── PULL QUOTE ──
  html += `
    <div class="section">
      <div class="closing-quote">Du er ikke summen af dine faser. Du er det stille punkt midt i cirklen — der hvor alt begynder, og alt vender hjem.</div>
    </div>`;

  html += `
    <div class="back-to-top" style="margin-top:var(--sp-6)">
      <a href="#" onclick="window.scrollTo({top:0,behavior:'smooth'});return false;">Tilbage til toppen ↑</a>
    </div>`;

  container.innerHTML = html;
}


/* ============================================================
   BUILD MIN PRAKSIS SCREEN
   ============================================================ */
function buildPraksisScreen() {
  const d = FASE_DATA;
  const container = document.getElementById('praksis-content');
  if (!container) return;

  const kropOevelser = [
    { title: 'Yin Yoga · Sphinx', type: 'Krop · Stillinger', desc: 'Åbner maven og miltmeridianen. En blid position der støtter fordøjelsen og giver jorden lov til at hvile. Hold stillingen i 3–5 minutter, og lad tyngden gøre arbejdet. Mærk efter hvor kroppen holder og hvor den giver slip.' },
    { title: 'Meridianstrygninger · Milt', type: 'Krop · Meridianarbejde', desc: 'Stryg med flad hånd fra storetåen op langs indersiden af benet til ribbenene. Langsomt, med let tryk. Det stimulerer miltmeridianen og hjælper fordøjelsen — både den fysiske og den mentale. Gentag 9 gange på hver side.' },
    { title: 'EFT Tapping · Bekymring', type: 'Krop · Bankepunkter', desc: 'Bank let med fingerspidserne på de klassiske EFT-punkter: siden af hånden, øjenbryn, side af øjet, under øjet, under næsen, hagen, kravebenet, under armen. Sig for hvert punkt: "Selvom jeg bekymrer mig, accepterer jeg mig selv." Gentag tre runder.' }
  ];

  const sindOevelser = [
    { title: 'Mindfulness · Jordens nærvær', type: 'Sind · Nærvær', desc: 'Sæt dig med begge fødder i gulvet. Mærk kontakten — tyngden af kroppen, stolen der bærer dig. Luk øjnene. Tæl tre vejrtrækninger. Åbn øjnene og se rummet som for første gang. Jord-elementet finder ro i det der allerede er der.' },
    { title: 'Refleksion · Tre spørgsmål', type: 'Sind · Refleksion', desc: 'Skriv svar på tre spørgsmål: Hvad bærer du lige nu, som ikke er dit at bære? Hvad ville du gøre, hvis ingen havde brug for dig i dag? Hvornår nærede du sidst dig selv med samme omsorg, som du giver andre?' },
    { title: 'Følelsernes hjul · Jord', type: 'Sind · Følelser', desc: 'Jordens følelsespar er omsorg og bekymring. Når du mærker bekymringen køre i ring, er det jord-elementet der er i ubalance. Spørg dig selv: er denne tanke nærende eller tærende? Hvis den tærer — læg den ned. Den hører ikke til i dette øjeblik.' }
  ];

  const naeringOevelser = [
    { title: 'Kost · Det der nærer Jord', type: 'Næring · Mad', desc: 'Jord-elementet næres af det naturligt søde: græskar, søde kartofler, hirse, ris, gulerødder. En varm suppe med rodfrugter er måske det bedste du kan gøre for din milt. Undgå rå, kold mad der kræver ekstra fordøjelsesenergi. Spis langsomt og med opmærksomhed.' },
    { title: 'Healinglyd · Huuuu', type: 'Næring · Lyd', desc: 'Jord-elementets healinglyd er "Huuuu" — en dyb, blød lyd der vibrerer i mave-regionen. Sid oprejst, læg hænderne på maven. Ind igennem næsen, ud med lyden "Huuuuuu" — langsomt, blødt, som et suk. Mærk vibrationen i maven. Gentag 6 gange.' },
    { title: 'Urter · Ingefær og kanel', type: 'Næring · Urter', desc: 'Ingefær varmer fordøjelsen og hjælper milten med at transformere fugt. Kanel styrker nyreild og varmer nedefra. En kop varmt vand med frisk ingefær og en smule honning er enkel medicin for en træt jord.' }
  ];

  let html = '';

  // ── HERO ──
  html += `
    <div class="section dybde-hero">
      <div class="eyebrow">Din Praksis</div>
      <div class="dybde-fase-label">Hvad kroppen beder om</div>
      <div class="isa isa--sm">Øvelser, kost, healinglyde og refleksion. Alt er valgt ud fra det element der dominerer dit liv lige nu. Vælg det der kalder — eller lad være.</div>
      <div class="fig" style="margin-top:var(--sp-4)">
        <img src="assets/images/aandedraet.png" alt="Din praksis" style="max-width:260px" class="no-bg">
      </div>
    </div>`;

  // ── DET KROPPEN PRØVER AT FORTÆLLE DIG ──
  html += `
    <div class="section">
      <div class="eyebrow">Det kroppen prøver at fortælle dig</div>
      <div class="isa isa--sm">Når ${d.elementLabel}-elementet dominerer, mærker du det måske som en tyngde der kan være behagelig og nærende, men også udmattende. Kroppen beder ikke om mere — den beder om det rigtige.</div>
    </div>`;

  // ── DIVIDER ──
  html += '<div class="section"><div class="divider"></div></div>';

  // ── KROP ──
  html += `
    <div class="section">
      <div class="eyebrow">Krop</div>
      ${kropOevelser.map(o => `
        <div class="expand-card">
          <div class="expand-header">
            <span class="expand-header-title">${o.title}</span>
            <span class="expand-chevron">›</span>
          </div>
          <div class="expand-body">
            <div class="expand-body-inner">
              <div class="meta" style="margin-bottom:var(--sp-2)">${o.type}</div>
              <div class="prose"><p>${o.desc}</p></div>
            </div>
          </div>
        </div>
      `).join('')}
    </div>`;

  // ── DIVIDER ──
  html += '<div class="section"><div class="divider"></div></div>';

  // ── SIND ──
  html += `
    <div class="section">
      <div class="eyebrow">Sind</div>
      ${sindOevelser.map(o => `
        <div class="expand-card">
          <div class="expand-header">
            <span class="expand-header-title">${o.title}</span>
            <span class="expand-chevron">›</span>
          </div>
          <div class="expand-body">
            <div class="expand-body-inner">
              <div class="meta" style="margin-bottom:var(--sp-2)">${o.type}</div>
              <div class="prose"><p>${o.desc}</p></div>
            </div>
          </div>
        </div>
      `).join('')}
    </div>`;

  // ── DIVIDER ──
  html += '<div class="section"><div class="divider"></div></div>';

  // ── FIGUR ──
  html += `
    <div class="section">
      <div class="fig fig--sm"><img src="assets/images/refleksion.png" alt="Refleksion" style="max-width:180px;opacity:0.85"></div>
    </div>`;

  // ── NÆRING ──
  html += `
    <div class="section">
      <div class="eyebrow">Næring</div>
      ${naeringOevelser.map(o => `
        <div class="expand-card">
          <div class="expand-header">
            <span class="expand-header-title">${o.title}</span>
            <span class="expand-chevron">›</span>
          </div>
          <div class="expand-body">
            <div class="expand-body-inner">
              <div class="meta" style="margin-bottom:var(--sp-2)">${o.type}</div>
              <div class="prose"><p>${o.desc}</p></div>
            </div>
          </div>
        </div>
      `).join('')}
    </div>`;

  // ── DIVIDER ──
  html += '<div class="section"><div class="divider"></div></div>';

  // ── REFLEKSION ──
  html += `
    <div class="section">
      <div class="eyebrow eyebrow--center">Refleksion</div>
      <div class="refleksion-centered">
        <div class="isa">Hvornår lyttede du sidst til kroppen — ikke for at fikse den, men for at forstå hvad den prøver at fortælle?</div>
      </div>
    </div>`;

  // ── PULL QUOTE ──
  html += `
    <div class="section">
      <div class="closing-quote">Kroppen lyver aldrig. Den taler bare et sprog vi har glemt at lytte til.</div>
    </div>`;

  html += `
    <div class="back-to-top" style="margin-top:var(--sp-6)">
      <a href="#" onclick="window.scrollTo({top:0,behavior:'smooth'});return false;">Tilbage til toppen ↑</a>
    </div>`;

  container.innerHTML = html;
}


/* ============================================================
   BUILD MIN REJSE SCREEN
   ============================================================ */
function buildRejseScreen() {
  const d = FASE_DATA;
  const container = document.getElementById('min-rejse-content');
  if (!container) return;

  const dagbogEmner = [
    { title: 'Din udvikling', tekst: 'Energi, stemning, balance — alt følger mønstre. Nogle dage mærker du jordens stabilitet og omsorg. Andre dage mærker du bekymringen køre i ring. Mønstrene viser sig over tid: de gentager sig med årstiderne, med den månedlige cyklus, med det organur der tikker i kroppen. At se mønsteret er det første skridt til at forstå det.' },
    { title: 'Din journal', tekst: 'Et stille rum til dine tanker. Skriv frit, eller brug dagens spørgsmål som afsæt. Ingen regler — bare et sted at lande. Journalen er ikke til nogen andre end dig. Den er det sted hvor tanker kan få form uden at blive bedømt.' },
    { title: 'Hvad mærker du lige nu?', tekst: 'Fem elementer, fem følelsesfelter. Vand er stilhed og dybde. Træ er vækst og frustration. Ild er glæde og intensitet. Jord er omsorg og bekymring. Metal er klarhed og sorg. Hvad mærker du mest lige nu? Din stemning i dag bliver en del af dit mønster i morgen.' }
  ];

  const samlingEmner = [
    { title: 'Dine opdagelser', tekst: 'De øjeblikke hvor noget pludselig gav mening. Måske var det en sætning der ramte dig. Måske var det en forbindelse mellem din krop og dit sind som du ikke havde set før. De øjeblikke er værd at samle — de er kompasset på din rejse.' },
    { title: 'Det du har gemt', tekst: 'Øvelser, indsigter og sider du vil vende tilbage til. Dit personlige bibliotek af det der virker for dig. Ikke alt virker for alle — men det der virker for dig, er værd at huske.' }
  ];

  const videnEmner = [
    { title: 'Alle ni faser', tekst: 'Fra fødsel til visdom. Ni kapitler, fem elementer, én rejse. Hver fase har sin krop, sit sind, sin opgave. Find din — og forstå dem der kom før, og dem der venter forude. Faserne er ikke en stige man klatrer op ad. De er en spiral man bevæger sig igennem — og hvert lag har sin egen dybde.' },
    { title: 'Om bogen og systemet', tekst: 'De fem elementer stammer fra den kinesiske medicins tradition, men de genfindes i mange kulturer: anishinaabe, keltisk, vedisk, ayurvedisk. Systemet bag De 9 Livsfaser bygger på disse traditioner og oversætter dem til et sprog der giver mening i dag — for den krop du har, det liv du lever, den fase du er i.' }
  ];

  let html = '';

  // ── HERO ──
  html += `
    <div class="section dybde-hero">
      <div class="eyebrow">Min Rejse</div>
      <div class="dybde-fase-label">Din vej gennem faserne</div>
      <div class="isa isa--sm">Se tilbage på dine oplevelser, opdag mønstre i din energi, og følg din udvikling over tid. Her samler dine oplevelser sig til indsigt.</div>
      <div class="fig" style="margin-top:var(--sp-4)">
        <img src="blaa_lotus_5.png" alt="Min rejse" style="max-width:260px" class="no-bg">
      </div>
    </div>`;

  // ── DET DER ER SVÆRT AT SE ──
  html += `
    <div class="section">
      <div class="eyebrow">Det der er svært at se</div>
      <div class="isa isa--sm">Det er næsten umuligt at forstå sin egen rejse mens man er midt i den. Du kan ikke se mønsteret, når du selv er en del af det. Men mønsteret er der. Det viser sig i de øjeblikke hvor noget gentager sig — og i de øjeblikke hvor noget pludselig hører op.</div>
    </div>`;

  // ── DIVIDER ──
  html += '<div class="section"><div class="divider"></div></div>';

  // ── DIN DAGBOG ──
  html += `
    <div class="section">
      <div class="eyebrow">Din dagbog</div>
      ${dagbogEmner.map(e => `
        <div class="expand-card">
          <div class="expand-header">
            <span class="expand-header-title">${e.title}</span>
            <span class="expand-chevron">›</span>
          </div>
          <div class="expand-body">
            <div class="expand-body-inner">
              <div class="prose"><p>${e.tekst}</p></div>
            </div>
          </div>
        </div>
      `).join('')}
    </div>`;

  // ── DIVIDER ──
  html += '<div class="section"><div class="divider"></div></div>';

  // ── DIN SAMLING ──
  html += `
    <div class="section">
      <div class="eyebrow">Din samling</div>
      ${samlingEmner.map(e => `
        <div class="expand-card">
          <div class="expand-header">
            <span class="expand-header-title">${e.title}</span>
            <span class="expand-chevron">›</span>
          </div>
          <div class="expand-body">
            <div class="expand-body-inner">
              <div class="prose"><p>${e.tekst}</p></div>
            </div>
          </div>
        </div>
      `).join('')}
    </div>`;

  // ── DIVIDER ──
  html += '<div class="section"><div class="divider"></div></div>';

  // ── FIGUR ──
  html += `
    <div class="section">
      <div class="fig fig--sm"><img src="krydsfelt-final.png" alt="Din rejse" style="max-width:180px;opacity:0.85"></div>
    </div>`;

  // ── VIDEN ──
  html += `
    <div class="section">
      <div class="eyebrow">Viden</div>
      ${videnEmner.map(e => `
        <div class="expand-card">
          <div class="expand-header">
            <span class="expand-header-title">${e.title}</span>
            <span class="expand-chevron">›</span>
          </div>
          <div class="expand-body">
            <div class="expand-body-inner">
              <div class="prose"><p>${e.tekst}</p></div>
            </div>
          </div>
        </div>
      `).join('')}
    </div>`;

  // ── DIVIDER ──
  html += '<div class="section"><div class="divider"></div></div>';

  // ── REFLEKSION ──
  html += `
    <div class="section">
      <div class="eyebrow eyebrow--center">Refleksion</div>
      <div class="refleksion-centered">
        <div class="isa">Hvis du kunne se dit livs mønster ovenfra — som et landskab set fra luften — hvad ville overraske dig mest?</div>
      </div>
    </div>`;

  // ── PULL QUOTE ──
  html += `
    <div class="section">
      <div class="closing-quote">Du behøver ikke forstå hele din rejse. Bare det næste skridt. Resten viser sig, når du er klar.</div>
    </div>`;

  html += `
    <div class="back-to-top" style="margin-top:var(--sp-6)">
      <a href="#" onclick="window.scrollTo({top:0,behavior:'smooth'});return false;">Tilbage til toppen ↑</a>
    </div>`;

  container.innerHTML = html;
}


/* ============================================================
   BUILD DE NI FASER SCREEN
   ============================================================ */
function buildNiFaserScreen() {
  const container = document.getElementById('ni-faser-content');
  if (!container || container.innerHTML) return;
  const d = FASE_DATA;

  const faser = [
    { nr: 1, element: 'Vand', tegn: '水', aar: '0–7 år', tema: 'Tillid · Rod · Essens', beskrivelse: 'Den spæde begyndelse. Barnet lever i ren sansning, uden filtre. Alt spirer og vokser — tillid, berøring, lyd. Nyrerne og vand-elementet dominerer: dybde, essens, grundlæggende livskraft.' },
    { nr: 2, element: 'Træ', tegn: '木', aar: '7–14 år', tema: 'Udforskning · Leg · Retning', beskrivelse: 'Udforskning og leg. Barnet bryder ud af den trygge base og opdager verden. Leveren og træ-elementet giver retning og nysgerrighed. Kreativiteten blomstrer, og de første venskaber får dybde.' },
    { nr: 3, element: 'Ild', tegn: '火', aar: '14–21 år', tema: 'Passion · Identitet · Forbindelse', beskrivelse: 'Forvandlingens ild. Teenagerens krop og sind gennemgår den mest dramatiske forandring siden spædbarnsalderen. Hjertet og ild-elementet bringer passion, identitetssøgen og de første dybe forbindelser.' },
    { nr: 4, element: 'Jord', tegn: '土', aar: '21–28 år', tema: 'Fundament · Drømme · Form', beskrivelse: 'Den unge voksne bygger fundament. Karriere, relationer, identitet — alt tager form. Milten og jord-elementet giver evnen til at nære drømme og gøre dem til virkelighed.' },
    { nr: 5, element: 'Jord', tegn: '土', aar: '28–35 år', tema: 'Næring · Ansvar · Centrering', beskrivelse: 'Ansvar for karriere, måske børn, måske parforhold. Energien er centrerende og bærende — kvinden bliver den jord alt hviler på. Men jorden har også brug for næring.', aktiv: true },
    { nr: 6, element: 'Metal', tegn: '金', aar: '35–42 år', tema: 'Sortering · Klarhed · Slip', beskrivelse: 'Den første sortering. Metallets klarhed begynder at skelne mellem det essentielle og det overflødige. Lungerne og tyktarmen renser — fysisk og mentalt.' },
    { nr: 7, element: 'Metal', tegn: '金', aar: '42–49 år', tema: 'Overgang · Befrielse · Dybde', beskrivelse: 'Overgangsalderen og den dybe sortering. Alt det der ikke længere tjener dig, falder væk. Der er sorg i det — men også en befrielse der kan overraske.' },
    { nr: 8, element: 'Vand', tegn: '水', aar: '49–56 år', tema: 'Stilhed · Visdom · Dybde', beskrivelse: 'Dybdens tid. Vandet vender tilbage. Efter metallets sortering synker kvinden ned i en ny stilhed — ikke tomhedens, men dybdens.' },
    { nr: 9, element: 'Træ', tegn: '木', aar: '56+ år', tema: 'Nyt forår · Rødder · Vækst', beskrivelse: 'Det nye forår. Træet spirer igen — men nu med rødder der rækker helt ned til grundvandet. En ny vækst begynder, båret af al den erfaring der er samlet.' }
  ];

  let html = '';

  html += `
    <div class="section dybde-hero">
      <div class="eyebrow">De ni livsfaser</div>
      <div class="dybde-fase-label">En kvindes livscyklus</div>
      <div class="isa isa--sm">Ni faser af syv år. Fem elementer. Én rejse — din.</div>
      <div class="fig" style="margin-top:var(--sp-4)">
        <img src="vinduer-tid-lilla.png" alt="De ni faser" style="max-width:390px">
      </div>
    </div>`;

  html += `
    <div class="section">
      <div class="eyebrow">Faserne</div>
      ${faser.map(f => `
        <div class="expand-card">
          <div class="expand-header">
            <span class="expand-header-title">${f.aktiv ? '● ' : ''}Fase ${f.nr} · ${f.element} · ${f.aar}</span>
            <span class="expand-chevron">›</span>
          </div>
          <div class="expand-body">
            <div class="expand-body-inner">
              <div class="meta" style="margin-bottom:var(--sp-2)">${f.tegn} ${f.tema}</div>
              <div class="prose"><p>${f.beskrivelse}</p></div>
              ${f.aktiv ? '<div class="meta" style="margin-top:var(--sp-2);color:var(--accent)">← Du er her</div>' : ''}
            </div>
          </div>
        </div>
      `).join('')}
    </div>`;

  html += '<div class="section"><div class="divider"></div></div>';

  html += `
    <div class="section">
      <div class="eyebrow">De fem elementer</div>
      <div class="expand-card">
        <div class="expand-header">
          <span class="expand-header-title">水 Vand — Dybde & Essens</span>
          <span class="expand-chevron">›</span>
        </div>
        <div class="expand-body">
          <div class="expand-body-inner">
            <div class="prose"><p>Vand er livets oprindelse. Det er det dybeste element — det der bærer alt det skjulte, den stille kraft under overfladen. Nyrerne er vandets organ, og de lagrer essensen: den medfødte energi der definerer din konstitution. Vand søger altid nedad — mod stilheden, mod dybden, mod roden.</p></div>
          </div>
        </div>
      </div>
      <div class="expand-card">
        <div class="expand-header">
          <span class="expand-header-title">木 Træ — Vækst & Retning</span>
          <span class="expand-chevron">›</span>
        </div>
        <div class="expand-body">
          <div class="expand-body-inner">
            <div class="prose"><p>Træet vokser opad og udad. Det er forårets element, nysgerrighedens, kreativitetens. Leveren er træets organ og den der sikrer, at energien flyder frit. Når træet er i balance, er der bevægelse, vision og mod. Når det er i ubalance, er der frustration og stagnation.</p></div>
          </div>
        </div>
      </div>
      <div class="expand-card">
        <div class="expand-header">
          <span class="expand-header-title">火 Ild — Passion & Forbindelse</span>
          <span class="expand-chevron">›</span>
        </div>
        <div class="expand-body">
          <div class="expand-body-inner">
            <div class="prose"><p>Ilden er sommerens element — den brændende varme der forbinder mennesker. Hjertet er ildens organ, og det styrer ikke bare kredsløbet men også bevidstheden og evnen til intim forbindelse. Ild er glæde, passion og nærvær.</p></div>
          </div>
        </div>
      </div>
      <div class="expand-card">
        <div class="expand-header">
          <span class="expand-header-title">土 Jord — Næring & Centrering</span>
          <span class="expand-chevron">›</span>
        </div>
        <div class="expand-body">
          <div class="expand-body-inner">
            <div class="prose"><p>${d.elementEssay || 'Jorden er midten — det element der holder de fire andre sammen. Sensommeren er jordens årstid, det øjeblik hvor frugterne modnes og alt bærer tungt. Milten og maven er jordens organer — de transformerer alt til næring. Når jorden er stærk, er der ro, stabilitet og dyb omsorg.'}</p></div>
          </div>
        </div>
      </div>
      <div class="expand-card">
        <div class="expand-header">
          <span class="expand-header-title">金 Metal — Klarhed & Slip</span>
          <span class="expand-chevron">›</span>
        </div>
        <div class="expand-body">
          <div class="expand-body-inner">
            <div class="prose"><p>Metal er efterårets element — den skarpe klarhed der skelner det essentielle fra det overflødige. Lungerne og tyktarmen er metallets organer. De tager ind og slipper løs. Metal handler om at finde det rene, det værdifulde, og lade resten falde.</p></div>
          </div>
        </div>
      </div>
    </div>`;

  html += `
    <div class="section">
      <div class="refleksion-centered">
        <div class="isa">Hvilken fase præger dig mest lige nu — og hvilken fase længes du efter at vende tilbage til?</div>
      </div>
    </div>`;

  html += `
    <div class="back-to-top" style="margin-top:var(--sp-6)">
      <a href="#" onclick="window.scrollTo({top:0,behavior:'smooth'});return false;">Tilbage til toppen ↑</a>
    </div>`;

  container.innerHTML = html;
}


/* ============================================================
   BUILD DIN PRAKSIS SCREEN
   ============================================================ */
function buildPraksisScreen() {
  const container = document.getElementById('praksis-content');
  if (!container || container.innerHTML) return;
  const d = FASE_DATA;

  let html = '';

  html += `
    <div class="section dybde-hero">
      <div class="eyebrow">Din praksis</div>
      <div class="dybde-fase-label">Øvelser for ${d.elementLabel}</div>
      <div class="isa isa--sm">Konkrete øvelser og råd til din krop og dit sind — tilpasset din fase og dit element.</div>
    </div>`;

  // Øvelser
  html += `
    <div class="section">
      <div class="eyebrow">Øvelser</div>
      ${d.oevelser.map(o => `
        <div class="expand-card">
          <div class="expand-header">
            <span class="expand-header-title">${o.title}</span>
            <span class="expand-chevron">›</span>
          </div>
          <div class="expand-body">
            <div class="expand-body-inner">
              <div class="meta" style="margin-bottom:var(--sp-2)">${o.type}</div>
              <div class="prose"><p>${o.desc}</p></div>
            </div>
          </div>
        </div>
      `).join('')}
    </div>`;

  html += '<div class="section"><div class="divider"></div></div>';

  // Fasens råd
  html += `
    <div class="section">
      <div class="eyebrow">Fasens visdom</div>
      ${d.fasensRaad.map(r => `
        <div class="raad-item">${r}</div>
      `).join('')}
    </div>`;

  html += '<div class="section"><div class="divider"></div></div>';

  // Krop & sind
  html += `
    <div class="section">
      <div class="eyebrow">Krop & sind</div>
      <div class="expand-card">
        <div class="expand-header">
          <span class="expand-header-title">Kroppen i denne fase</span>
          <span class="expand-chevron">›</span>
        </div>
        <div class="expand-body">
          <div class="expand-body-inner">
            <div class="prose">${textToHtml(d.kropTekst)}</div>
          </div>
        </div>
      </div>
      <div class="expand-card">
        <div class="expand-header">
          <span class="expand-header-title">Sindet i denne fase</span>
          <span class="expand-chevron">›</span>
        </div>
        <div class="expand-body">
          <div class="expand-body-inner">
            <div class="prose">${textToHtml(d.sindTekst)}</div>
          </div>
        </div>
      </div>
    </div>`;

  html += '<div class="section"><div class="divider"></div></div>';

  // Balance / ubalance
  html += `
    <div class="section">
      <div class="eyebrow">Tegn på balance</div>
      ${renderTruncated(d.balanceTekst, 5)}
    </div>`;

  html += '<div class="section"><div class="divider"></div></div>';

  html += `
    <div class="section">
      <div class="eyebrow">Tegn på ubalance</div>
      <div class="expand-card">
        <div class="expand-header">
          <span class="expand-header-title">Fysiske tegn</span>
          <span class="expand-chevron">›</span>
        </div>
        <div class="expand-body">
          <div class="expand-body-inner">
            <ul class="ubalance-list">
              ${d.ubalanceTegn.fysiske.map(t => `<li>${t}</li>`).join('')}
            </ul>
          </div>
        </div>
      </div>
      <div class="expand-card">
        <div class="expand-header">
          <span class="expand-header-title">Mentale tegn</span>
          <span class="expand-chevron">›</span>
        </div>
        <div class="expand-body">
          <div class="expand-body-inner">
            <ul class="ubalance-list">
              ${d.ubalanceTegn.mentale.map(t => `<li>${t}</li>`).join('')}
            </ul>
          </div>
        </div>
      </div>
    </div>`;

  html += `
    <div class="section">
      <div class="refleksion-centered">
        <div class="isa">Hvornår har du sidst gjort noget blot for din egen krop — uden formål, uden præstation?</div>
      </div>
    </div>`;

  html += `
    <div class="back-to-top" style="margin-top:var(--sp-6)">
      <a href="#" onclick="window.scrollTo({top:0,behavior:'smooth'});return false;">Tilbage til toppen ↑</a>
    </div>`;

  container.innerHTML = html;
}


/* ============================================================
   BUILD MIN REJSE SCREEN
   ============================================================ */
function buildMinRejseScreen() {
  const container = document.getElementById('min-rejse-content');
  if (!container || container.innerHTML) return;
  const d = FASE_DATA;
  const entries = Journal.getEntries();
  const moodHistory = JSON.parse(localStorage.getItem('livsfaser_moods') || '[]');

  let html = '';

  html += `
    <div class="section dybde-hero">
      <div class="eyebrow">Min rejse</div>
      <div class="dybde-fase-label">Din personlige historie</div>
      <div class="isa isa--sm">Alt hvad du har mærket, skrevet og opdaget — samlet ét sted.</div>
      <div class="fig" style="margin-top:var(--sp-4)">
        <img src="min-rejse-ikigai.png" alt="Din rejse" class="no-bg" style="max-width:260px">
      </div>
    </div>`;

  // Profil-resumé
  html += `
    <div class="section">
      <div class="eyebrow">Dit billede lige nu</div>
      <div class="card" style="cursor:default">
        <div class="card-title" style="text-align:center;font-size:2rem;margin-bottom:var(--sp-2)">${d.elementSymbol}</div>
        <div class="meta" style="text-align:center">${d.elementLabel} · Fase ${d.phase} · ${d.qualities}</div>
      </div>
    </div>`;

  html += '<div class="section"><div class="divider"></div></div>';

  // Journal-indlæg
  html += `
    <div class="section">
      <div class="eyebrow">Min journal</div>`;

  if (entries.length > 0) {
    html += entries.slice(0, 5).map(e => `
      <div class="journal-entry">
        <div class="journal-entry-date">${formatJournalDate(e.date)}</div>
        <div class="journal-entry-text">${e.text.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
      </div>
    `).join('');
    if (entries.length > 5) {
      html += `<div class="link-center"><span class="link-subtle" data-link="journal">Se alle ${entries.length} indlæg →</span></div>`;
    }
  } else {
    html += `
      <div class="isa isa--sm isa--muted" style="text-align:center;margin-bottom:var(--sp-3)">Du har ikke skrevet i din journal endnu.</div>
      <div class="link-center"><span class="link-subtle" data-link="journal">Skriv dit første indlæg →</span></div>`;
  }
  html += '</div>';

  html += '<div class="section"><div class="divider"></div></div>';

  // Refleksioner
  html += `
    <div class="section">
      <div class="eyebrow">Refleksioner til vejen</div>
      ${d.refleksioner.map(r => `
        <div class="refleksion-box" style="margin-bottom:var(--sp-3)">
          <div class="isa isa--sm">${r}</div>
        </div>
      `).join('')}
    </div>`;

  html += `
    <div class="section">
      <div class="refleksion-centered">
        <div class="isa">Din rejse er ikke en linje. Den er en spiral — og hvert skridt bringer dig dybere ind i dig selv.</div>
      </div>
    </div>`;

  html += `
    <div class="back-to-top" style="margin-top:var(--sp-6)">
      <a href="#" onclick="window.scrollTo({top:0,behavior:'smooth'});return false;">Tilbage til toppen ↑</a>
    </div>`;

  container.innerHTML = html;
}


/* ============================================================
   INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  buildDybdeScreen();
  buildRelationerScreen();
  buildRelDybereScreen();
  buildTidsrejseScreen();
  buildTidsDybereScreen();
  buildNiFaserScreen();
  buildPraksisScreen();
  buildRejseScreen();
  initHeaderScroll();
  initInteractions();

  // Check if user needs onboarding
  if (!Storage.isOnboarded()) {
    // Start with onboarding
    document.querySelector('.screen.active')?.classList.remove('active');
    Router.current = null;
    Router.navigate('onboarding');
  } else {
    // Ensure forside is active for returning users
    const forside = document.getElementById('screen-forside');
    if (forside && !forside.classList.contains('active')) {
      forside.classList.add('active');
    }
    Router.current = 'forside';
    initScrollReveal();
  }

  // Nav items
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      const target = item.dataset.nav;
      if (target) Router.navigate(target);
    });
  });

  // Hamburger menu
  document.querySelector('.header-hamburger').addEventListener('click', openMenu);

  // Check-in buttons
  document.querySelectorAll('.checkin-btn').forEach(btn => {
    btn.addEventListener('click', () => selectMood(btn));
  });

  // Dybde link from forside
  document.querySelectorAll('[data-link]').forEach(el => {
    el.addEventListener('click', () => {
      const target = el.dataset.link;
      if (target) Router.navigate(target);
    });
  });

  // Force first section visible
  const firstSections = document.querySelectorAll('.screen.active .section');
  if (firstSections.length > 0) {
    firstSections[0].classList.add('visible');
    if (firstSections.length > 1) firstSections[1].classList.add('visible');
  }
});
