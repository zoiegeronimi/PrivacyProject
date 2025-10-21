// script.js - interactions + charts (runs after DOMContentLoaded)

(function(){
  // Wait until DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    initAccordions();
    initQuiz();
    initReveal();
    attachTooltips(); // optional tiny tooltip handler
    // Build small donuts for pages if canvas exists
    makeSmallDonut('tiktokMini', [8,22,70]);
    makeSmallDonut('igMini',    [10,25,65]);
    makeSmallDonut('snapMini',  [22,38,40]);
    // Radar on homepage (if present)
    makeRadarIfPresent('platformRadar');
  });

  // --- Accordions ---
  function initAccordions(){
    document.querySelectorAll('.accordion-btn').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const panel = btn.nextElementSibling;
        const open = !panel.classList.contains('hidden');
        // close siblings in group
        const group = btn.closest('.accordion-group') || document;
        group.querySelectorAll('.panel').forEach(p => p.classList.add('hidden'));
        if(!open) panel.classList.remove('hidden');
      });
    });
  }

  // --- Quiz ---
  function initQuiz(){
    const correct = 'TikTok';
    document.querySelectorAll('.quiz-btn').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        document.querySelectorAll('.quiz-btn').forEach(b=>b.classList.remove('bg-indigo-600','text-white'));
        btn.classList.add('bg-indigo-600','text-white');
        const res = document.getElementById('quizResult');
        if(!res) return;
        if(btn.dataset.answer === correct) res.textContent = "Correct — TikTok mentions biometric identifiers (face/voice) with consent. ✅";
        else res.textContent = "Not quite — TikTok's policy mentions biometric identifiers with consent.";
      });
    });
    // Tip randomizer on index
    const tipBtn = document.getElementById('tipBtn');
    if(tipBtn){
      const tips = [
        'Use a password manager for unique passwords.',
        'Enable 2FA (use an authenticator app if possible).',
        'Regularly review connected third-party apps.',
        'Turn off location sharing when not needed.'
      ];
      tipBtn.addEventListener('click', ()=> {
        const t = tips[Math.floor(Math.random()*tips.length)];
        document.getElementById('randomTip').textContent = t;
      });
    }
  }

  // --- Reveal animations (simple) ---
  function initReveal(){
    const obs = new IntersectionObserver(entries=>{
      entries.forEach(e=>{
        if(e.isIntersecting){
          e.target.style.opacity = 1;
          e.target.style.transform = 'translateY(0)';
        }
      });
    }, {threshold:0.12});
    document.querySelectorAll('.card, section').forEach(el=>{
      el.style.opacity = 0;
      el.style.transform = 'translateY(10px)';
      el.style.transition = 'opacity 600ms ease, transform 600ms ease';
      obs.observe(el);
    });
  }

  // --- tooltips (simple) ---
  function attachTooltips(){
    document.querySelectorAll('[data-tip]').forEach(el=>{
      let tEl = null;
      el.addEventListener('mouseenter', ()=> {
        const tip = el.getAttribute('data-tip');
        if(!tip) return;
        tEl = document.createElement('div');
        tEl.textContent = tip;
        tEl.style.position='fixed';
        tEl.style.background='rgba(0,0,0,0.75)';
        tEl.style.color='white';
        tEl.style.padding='6px 8px';
        tEl.style.borderRadius='6px';
        tEl.style.fontSize='12px';
        document.body.appendChild(tEl);
        const r = el.getBoundingClientRect();
        tEl.style.left = (r.right + 10) + 'px';
        tEl.style.top  = (r.top) + 'px';
      });
      el.addEventListener('mouseleave', ()=> {
        if(tEl){ tEl.remove(); tEl = null; }
      });
    });
  }

  // --- Chart helpers ---
  function makeSmallDonut(elemId, values=[20,30,50]){
    const el = document.getElementById(elemId);
    if(!el) return;
    // ensure Chart.js available
    if(typeof Chart === 'undefined'){ console.error('Chart.js not loaded'); return; }
    const ctx = el.getContext('2d');
    // resize canvas to desired pixel size for consistent rendering
    el.width = 400; el.height = 300;
    new Chart(ctx, {
      type:'doughnut',
      data:{
        labels:['Low','Medium','High'],
        datasets:[{
          data: values,
          backgroundColor:[getCssVar('--low'), getCssVar('--medium'), getCssVar('--high')],
          hoverOffset:6
        }]
      },
      options:{
        responsive:true,
        maintainAspectRatio:false,
        cutout: '72%',
        plugins:{
          legend:{display:false},
          tooltip:{callbacks:{label: function(i){
            return `${i.label}: ${i.formattedValue}%`;
          }}}
        }
      }
    });
  }

  function makeRadarIfPresent(elemId){
    const el = document.getElementById(elemId);
    if(!el) return;
    if(typeof Chart === 'undefined'){ console.error('Chart.js not loaded'); return; }
    const ctx = el.getContext('2d');
    new Chart(ctx, {
      type:'radar',
      data:{
        labels:['Data Collection','Ad Targeting','Location','Third-Party Sharing','Transparency'],
        datasets:[
          {label:'TikTok', data:[5,5,4,5,2], borderColor:'#06b6d4', backgroundColor:'rgba(6,182,212,0.08)', pointBackgroundColor:'#06b6d4'},
          {label:'Instagram', data:[5,5,4,5,2], borderColor:'#8134af', backgroundColor:'rgba(129,52,175,0.06)', pointBackgroundColor:'#8134af'},
          {label:'Snapchat', data:[4,4,5,4,3], borderColor:'#facc15', backgroundColor:'rgba(250,204,21,0.06)', pointBackgroundColor:'#facc15'}
        ]
      },
      options:{responsive:true,scales:{r:{beginAtZero:true,max:5}}}
    });
  }

  function getCssVar(name){
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || '#ccc';
  }

})();
