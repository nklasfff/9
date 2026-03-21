/* ============================================================
   DE 9 LIVSFASER — App Logic
   ============================================================ */

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

    // Update nav
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    const activeNav = document.querySelector(`[data-nav="${screenId}"]`);
    if (activeNav) activeNav.classList.add('active');

    // Toggle back button (show on sub-screens)
    const isSubScreen = screenId !== 'forside' && screenId !== 'relationer';
    document.body.classList.toggle('sub-screen', isSubScreen);

    // Re-run scroll reveal for new screen
    setTimeout(() => {
      initScrollReveal();
    }, 100);
  },

  goBack() {
    // If on a sub-screen of relationer, go back to relationer
    if (this.current === 'rel-dybere') {
      this.navigate('relationer');
    } else {
      this.navigate('forside');
    }
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
        <img src="Gemini_Generated_Image_4llrmp4llrmp4llr.png" alt="Dine fem cyklusser" style="max-width:260px">
      </div>
    </div>`;

  // ── DENNE FASE I DIG ──
  html += `
    <div class="section">
      <div class="eyebrow">Denne fase i dig</div>
      ${renderTruncated(d.denneFaseIDig, 5)}
    </div>`;

  // ── DIVIDER ──
  html += '<div class="section"><div class="divider"></div></div>';

  // ── DIN CENTRALE FØLELSE ──
  html += `
    <div class="section">
      <div class="eyebrow">Din centrale følelse</div>
      <div class="title-featured">${d.centralFoelelse.title}</div>
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

  // ── REFLEKSION ──
  const refl = d.refleksioner[Math.floor(Math.random() * d.refleksioner.length)];
  html += `
    <div class="section">
      <div class="eyebrow">Refleksion</div>
      <div class="refleksion-box">
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
      <div class="eyebrow" style="color:#88839e">Dine relationer</div>
      <div class="dybde-fase-label">Når livsfaser mødes</div>
      <div class="isa isa--sm">Hvert menneske du møder, bærer sin egen rytme. Når jeres energier mødes, sker der noget — noget der nærer, noget der udfordrer, noget der spejler det du selv bærer.</div>
    </div>`;

  // ── JERES ELEMENT-DYNAMIK ──
  html += `
    <div class="section">
      <div class="eyebrow" style="color:#88839e">Dit elements relationer</div>
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
      <div class="eyebrow" style="color:#88839e">Relationer i din fase</div>
      ${renderTruncated(d.relationerIFasen, 5)}
    </div>`;

  // ── DIVIDER ──
  html += '<div class="section"><div class="divider"></div></div>';

  // ── SAMTALÅBNER ──
  html += `
    <div class="section">
      <div class="eyebrow" style="color:#88839e">Samtaleåbner</div>
      <div class="refleksion-box" style="border-left-color:#88839e">
        <div class="isa">${samtale}</div>
      </div>
    </div>`;

  // ── DIVIDER ──
  html += '<div class="section"><div class="divider"></div></div>';

  // ── RÅD TIL JERES RELATION ──
  html += `
    <div class="section">
      <div class="eyebrow" style="color:#88839e">Råd til jeres relation</div>
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
      <div class="eyebrow" style="color:#88839e">Dyk dybere</div>
      <div class="explore-pills">
        <span class="explore-pill" data-link="rel-dybere" style="color:#88839e;border-color:rgba(123,122,158,0.2)">Dine Dybere Relationer →</span>
      </div>
    </div>`;

  // ── PULL QUOTE ──
  html += `
    <div class="section">
      <div class="pull-quote" style="border-left-color:#88839e">De mennesker vi vælger at bære med os, er sjældent tilfældige. De bærer det element vi selv mangler — eller det vi har for meget af.</div>
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
      <div class="eyebrow" style="color:#88839e">Dine dybere relationer</div>
      <div class="dybde-fase-label">Elementerne der mødes</div>
      <div class="isa isa--sm">Når to mennesker mødes, mødes to elementer. Den dynamik — hvad der nærer, hvad der udfordrer, hvad der spejler — er nøglen til at forstå jeres relation på et dybere plan.</div>
    </div>`;

  // ── ELEMENT-DYNAMIKKER ──
  html += `
    <div class="section">
      <div class="eyebrow" style="color:#88839e">Jord møder de andre elementer</div>
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
      <div class="eyebrow" style="color:#88839e">${faseMoeder.titel}</div>
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
      <div class="eyebrow" style="color:#88839e">Jeres centrale følelser</div>
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
      <div class="eyebrow" style="color:#88839e">Noget I kan gøre sammen</div>
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

  // ── REFLEKSION ──
  html += `
    <div class="section">
      <div class="eyebrow" style="color:#88839e">Refleksion</div>
      <div class="refleksion-box" style="border-left-color:#88839e">
        <div class="isa">Hvem giver dig energi — og hvem kræver den? Det er ikke et spørgsmål om skyld. Det er et spørgsmål om elementernes samspil.</div>
      </div>
    </div>`;

  // ── PULL QUOTE ──
  html += `
    <div class="section">
      <div class="pull-quote" style="border-left-color:#88839e">Måske undrer du dig over, hvorfor nogle mennesker føles som at komme hjem — mens andre langsomt tømmer dig. Det handler ikke om vilje. Det handler om elementer der mødes.</div>
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
  initHeaderScroll();
  initInteractions();
  initScrollReveal();

  // Nav items
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      const target = item.dataset.nav;
      if (target) Router.navigate(target);
    });
  });

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
