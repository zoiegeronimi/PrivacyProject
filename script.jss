/* script.js - shared interactivity + charts */
document.addEventListener('DOMContentLoaded', ()=>{

  /* ---------- small donut helper ---------- */
  function createDonut(canvasId, scores){
    const ctx = document.getElementById(canvasId);
    if(!ctx) return;
    return new Chart(ctx.getContext('2d'), {
      type:'doughnut',
      data:{
        labels:['Low','Medium','High'],
        datasets:[{
          data: scores,
          backgroundColor:['#2A9D8F','#F4A261','#E63946'],
          borderWidth:0
        }]
      },
      options:{
        maintainAspectRatio:false,
        cutout:'70%',
        plugins:{legend:{display:false},tooltip:{callbacks:{label:ctx=>`${ctx.label}: ${ctx.parsed}%`}}}
      }
    });
  }

  /* Platforms risk distribution (these add to 100) */
  // TikTok: high 60%, med 30%, low 10%
  createDonut('tiktokDonut',[10,30,60]);
  // Instagram (Meta): high 55%, med 35%, low 10%
  createDonut('igDonut',[10,35,55]);
  // Snapchat: medium-lean: high 40%, med 40%, low 20%
  createDonut('snapDonut',[20,40,40]);

  // Radar on index (if present)
  const radarEl = document.getElementById('platformRadar');
  if(radarEl){
    new Chart(radarEl.getContext('2d'),{
      type:'radar',
      data:{
        labels:['Data Collection','Ad Targeting','Location Tracking','Third-Party Sharing','Transparency'],
        datasets:[
          {label:'TikTok', data:[5,5,4,5,2], borderColor:'#06b6d4', backgroundColor:'rgba(6,182,212,0.08)', pointBackgroundColor:'#06b6d4'},
          {label:'Instagram', data:[5,5,4,5,2], borderColor:'#8134af', backgroundColor:'rgba(129,52,175,0.06)', pointBackgroundColor:'#8134af'},
          {label:'Snapchat', data:[4,4,5,4,3], borderColor:'#facc15', backgroundColor:'rgba(250,204,21,0.06)', pointBackgroundColor:'#facc15'}
        ]
      },
      options:{scales:{r:{beginAtZero:true,max:5}},plugins:{legend:{position:'bottom'}}}
    });
  }

  // Accordion simple
  document.querySelectorAll('.accordion').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const panel = btn.nextElementSibling;
      const open = !panel.classList.contains('open');
      document.querySelectorAll('.panel.open').forEach(p=>p.classList.remove('open'));
      if(!open) panel.classList.add('open');
    });
  });

  // Quiz logic (index)
  const correct = 'TikTok';
  document.querySelectorAll('.quiz-btn').forEach(b=>{
    b.addEventListener('click', ()=>{
      document.querySelectorAll('.quiz-btn').forEach(x=>x.classList.remove('active'));
      b.classList.add('active');
      const res = document.getElementById('quizResult');
      if(b.dataset.answer===correct) res.textContent = "Correct — TikTok's policy references biometric identifiers (face/voice) with consent. ✅";
      else res.textContent = "Not quite — check TikTok's policy; it explicitly references biometric identifiers with consent.";
    });
  });

  // Tip randomizer
  const tips = [
    'Use a password manager to create and store unique passwords.',
    'Enable two-factor authentication (2FA) on your accounts.',
    'Regularly review and remove third-party app access.',
    'Turn off location sharing when you don’t need it.',
    'Limit ad personalization in app settings and browser preferences.'
  ];
  const tipBtn = document.getElementById('tipBtn');
  if(tipBtn){
    tipBtn.addEventListener('click', ()=> {
      document.getElementById('randomTip').textContent = tips[Math.floor(Math.random()*tips.length)];
    });
  }

  // Small platform tip buttons (exist on platform pages)
  const platTipButtons = document.querySelectorAll('.platform-tip-btn');
  platTipButtons.forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const list = JSON.parse(btn.dataset.tips);
      const el = document.getElementById(btn.dataset.target);
      el.textContent = list[Math.floor(Math.random()*list.length)];
    });
  });

  // Scroll reveal
  const observer = new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){ entry.target.style.opacity=1; entry.target.style.transform='translateY(0)'; observer.unobserve(entry.target); }
    });
  },{threshold:0.12});
  document.querySelectorAll('.card, .platform-card, section').forEach(el=>{
    el.style.opacity=0; el.style.transform='translateY(12px)'; el.style.transition='opacity .7s ease, transform .7s ease';
    observer.observe(el);
  });

});
