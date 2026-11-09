import * as THREE from 'three';
import './style.css';

const scene = new THREE.Scene();
scene.background = new THREE.Color('#a9c8b3');
scene.fog = new THREE.Fog('#a9c8b3', 24, 58);
const camera = new THREE.PerspectiveCamera(36, innerWidth / innerHeight, .1, 120);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.8));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.12;
document.querySelector('#game').appendChild(renderer.domElement);
scene.add(new THREE.HemisphereLight('#f4f4e3', '#687c53', 2.15));
const sun = new THREE.DirectionalLight('#fff0cb', 3.2); sun.position.set(-8, 15, 7); sun.castShadow = true;
sun.shadow.mapSize.set(1024, 1024); sun.shadow.camera.left = -20; sun.shadow.camera.right = 20; sun.shadow.camera.top = 20; sun.shadow.camera.bottom = -20; sun.shadow.bias = -.001;
scene.add(sun);
const mat = (color, roughness=.9) => new THREE.MeshStandardMaterial({ color, roughness });
const grassMat=mat('#91a975'), pathMat=mat('#c5ad7f'), stoneMat=mat('#aa9c7d'), darkStone=mat('#766e5c'), woodMat=mat('#76543c'), woodLight=mat('#9a7048'), plaster=mat('#e2d3ac'), roofMat=mat('#8c5440'), roofLight=mat('#a2654d'), green=mat('#607b4d'), leaf=mat('#829657'), cream=mat('#f2e5c8');
const boxGeo=new THREE.BoxGeometry(1,1,1);
function mesh(geo, material, parent=scene, x=0,y=0,z=0){const m=new THREE.Mesh(geo,material);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m}
function box(parent,x,y,z,sx,sy,sz,material){const m=mesh(boxGeo,material,parent,x,y,z);m.scale.set(sx,sy,sz);return m}
const ground=mesh(new THREE.PlaneGeometry(120,120),grassMat,scene,0,-.12,0);ground.rotation.x=-Math.PI/2;ground.receiveShadow=true;ground.castShadow=false;
// A winding stone road, laid from individual irregular pavers.
for(let i=0;i<27;i++) {let z=10-i*.72, x=Math.sin(i*.22)*1.7;const p=mesh(new THREE.CylinderGeometry(.42,.48,.12,6), i%3?pathMat:stoneMat,scene,x,.015,z);p.rotation.y=i*1.7;p.scale.set(1.05,.7,.66)}
for(let i=0;i<14;i++){const x=-5+(i%7)*1.5,z=4+Math.floor(i/7)*1.3;const p=mesh(new THREE.CylinderGeometry(.38,.42,.12,6),i%2?stoneMat:pathMat,scene,x,.015,z);p.rotation.y=i*1.3}
// Simple stylized medieval cottages.
function cottage(x,z,scale=1,angle=0){const g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=angle;g.scale.setScalar(scale);scene.add(g);
 box(g,0,1.08,0,2.7,2.05,2.2,plaster);
 // timber framing on the front
 for(const xx of [-1.17,0,1.17])box(g,xx,1.1,1.116,.13,2.08,.12,woodMat);
 box(g,0,.25,1.18,2.6,.15,.13,woodLight);box(g,0,1.98,1.18,2.6,.15,.13,woodLight);box(g,0,1.1,1.18,2.55,.11,.13,woodLight);
 // steep gabled roof
 const roof1=mesh(new THREE.BoxGeometry(1.68,.22,2.65),roofMat,g,-.58,2.25,0);roof1.rotation.z=-.66;
 const roof2=mesh(new THREE.BoxGeometry(1.68,.22,2.65),roofLight,g,.58,2.25,0);roof2.rotation.z=.66;
 const ridge=box(g,0,2.81,0,.16,.18,2.72,woodMat);
 box(g,0,.65,1.25,.67,1.3,.12,woodMat);box(g,0,.65,1.33,.5,1.08,.08,woodLight);
 // little glowing window
 box(g,-.83,1.27,1.22,.42,.53,.1,woodMat);box(g,-.83,1.27,1.285,.31,.4,.06,mat('#d7ba78'));box(g,-.83,1.27,1.33,.055,.5,.06,woodMat);box(g,-.83,1.27,1.33,.34,.05,.06,woodMat);
 box(g,0,.08,0,2.95,.18,2.42,darkStone);return g;}
cottage(-5.3,-1,.91,.2);cottage(5.1,-3,.88,-.25);cottage(-7.3,4,.72,.3);cottage(7.5,4,.72,-.3);
// Well, market stall, fencing and a village sign.
const well=new THREE.Group();well.position.set(3.2,0,1.5);scene.add(well);
const wb=mesh(new THREE.CylinderGeometry(.73,.82,.62,10),stoneMat,well,0,.34,0);const opening=mesh(new THREE.CylinderGeometry(.48,.53,.18,10),darkStone,well,0,.72,0);const hole=mesh(new THREE.CylinderGeometry(.36,.4,.05,12),mat('#445448'),well,0,.82,0);
for(const x of [-.57,.57])box(well,x,1.43,0,.12,1.25,.12,woodMat);
box(well,0,2.02,0,1.46,.13,.15,woodMat);const roofA=mesh(new THREE.BoxGeometry(.8,.12,1.2),roofMat,well,-.3,1.85,0);roofA.rotation.z=-.52;const roofB=mesh(new THREE.BoxGeometry(.8,.12,1.2),roofLight,well,.3,1.85,0);roofB.rotation.z=.52;
const sign=new THREE.Group();sign.position.set(-2.2,0,1.5);scene.add(sign);box(sign,0,.75,0,.13,1.5,.13,woodMat);box(sign,.4,1.25,0,.95,.42,.15,woodLight);box(sign,.4,1.25,.09,.78,.28,.05,mat('#d4bd8e'));
// Trees: chunky trunks, layered low-poly canopies.
function tree(x,z,s=1){const g=new THREE.Group();g.position.set(x,0,z);g.scale.setScalar(s);scene.add(g);mesh(new THREE.CylinderGeometry(.19,.28,1.65,7),woodMat,g,0,.8,0);mesh(new THREE.DodecahedronGeometry(1.12,1),green,g,0,2,0).scale.set(1,1.05,.95);mesh(new THREE.DodecahedronGeometry(.78,0),leaf,g,-.38,2.55,.05);mesh(new THREE.DodecahedronGeometry(.7,0),green,g,.42,2.44,-.13);}
[[-10,-4,1.15],[-10,1,.95],[-9,7,1.15],[-6,9,1.05],[10,-5,1.15],[10,0,.9],[10,8,1.15],[5,9,1.1],[1,11,1.15],[-2,11,.9]].forEach(t=>tree(...t));
// A few fences along cottage gardens.
for(const side of [-1,1]){for(let i=0;i<5;i++){const x=side*7.6+i*.43;box(scene,x,.34,0,.09,.68,.09,woodLight)}box(scene,side*8.45,.36,0,2.2,.09,.1,woodMat);box(scene,side*8.45,.66,0,2.2,.09,.1,woodMat)}
// Wildflowers add life to the broad green beyond the path.
for(let i=0;i<85;i++){const x=(Math.sin(i*12.98)*.5+.5)*23-11.5,z=(Math.cos(i*4.77)*.5+.5)*22-10;if(Math.abs(x)<2.7&&z<5&&z> -10)continue;const stem=mesh(new THREE.CylinderGeometry(.018,.026,.29,5),green,scene,x,.14,z);stem.castShadow=false;const c=['#e6d293','#efe9d2','#bd886e','#c5cc9a'][i%4];const fl=mesh(new THREE.IcosahedronGeometry(.09,0),mat(c),scene,x,.31,z);fl.scale.y=.7;fl.castShadow=false;}
// Player character, constructed from soft low-poly shapes.
const hero=new THREE.Group();scene.add(hero);hero.position.set(0,0,4.2);
const skin=mat('#dfb28b'), tunic=mat('#627d54'), tunicLight=mat('#788f60'), belt=mat('#624b38'), pants=mat('#615c51'), boot=mat('#493d32');
const torso=mesh(new THREE.CapsuleGeometry(.34,.55,4,8),tunic,hero,0,1.03,0);torso.scale.set(.85,1,.62);
mesh(new THREE.SphereGeometry(.31,10,8),skin,hero,0,1.82,0).scale.set(1,.95,.9);
const hat=mesh(new THREE.ConeGeometry(.37,.45,8),woodLight,hero,0,2.17,0);hat.rotation.z=-.12;mesh(new THREE.CylinderGeometry(.39,.39,.09,10),woodLight,hero,0,1.99,0);
box(hero,0,.9,.29,.49,.12,.08,belt);
const legs=[];const arms=[];
for(const side of [-1,1]){const leg=mesh(new THREE.CapsuleGeometry(.13,.42,3,7),pants,hero,side*.17,.43,0);legs.push(leg);mesh(new THREE.BoxGeometry(.3,.15,.4),boot,hero,side*.17,.13,.1);const arm=mesh(new THREE.CapsuleGeometry(.12,.42,3,7),tunicLight,hero,side*.39,1.18,0);arm.rotation.z=side*-.17;arms.push(arm)}
// Herbs are visually distinct collectible sprigs, each with a soft gold glint.
const herbs=[];
function makeHerb(x,z){const g=new THREE.Group();g.position.set(x,0,z);scene.add(g);const stem=mesh(new THREE.CylinderGeometry(.025,.038,.42,5),green,g,0,.21,0);stem.castShadow=false;for(let i=0;i<3;i++){const l=mesh(new THREE.SphereGeometry(.15,7,5),i%2?leaf:green,g,(i-1)*.12,.22+i*.07,.02);l.scale.set(1,.48,.58);l.rotation.z=(i-1)*.55;l.castShadow=false}const bud=mesh(new THREE.IcosahedronGeometry(.12,0),mat('#e1c47b'),g,0,.48,0);bud.castShadow=false;const ring=mesh(new THREE.TorusGeometry(.35,.023,5,20),mat('#e8d18c'),g,0,.08,0);ring.rotation.x=Math.PI/2;ring.material.transparent=true;ring.material.opacity=.6;ring.castShadow=false;herbs.push({group:g,ring,collected:false,phase:Math.random()*6});}
[[-3.4,6.1],[3.3,5.6],[-4.8,2.8],[5.3,2.6],[1.6,8.2],[-1.8,8.7],[7,6]].forEach(p=>makeHerb(...p));
// Elowen waits near the village well.
const npc=new THREE.Group();scene.add(npc);npc.position.set(2.1,0,3.8);
mesh(new THREE.CapsuleGeometry(.34,.57,4,8),mat('#8b695d'),npc,0,1.03,0).scale.set(.82,1,.62);mesh(new THREE.SphereGeometry(.31,10,8),skin,npc,0,1.83,0).scale.set(1,.94,.9);
const hair=mesh(new THREE.SphereGeometry(.34,9,7),mat('#725841'),npc,0,1.99,-.025);hair.scale.set(1,.62,1);const hood=mesh(new THREE.ConeGeometry(.39,.42,8),mat('#75805a'),npc,0,2.2,-.01);hood.rotation.z=-.12;
for(const side of [-1,1]){mesh(new THREE.CapsuleGeometry(.13,.42,3,7),mat('#a17d6a'),npc,side*.4,1.18,0).rotation.z=side*-.2;mesh(new THREE.CapsuleGeometry(.13,.42,3,7),pants,npc,side*.16,.42,0)}
const npcMarker=mesh(new THREE.SphereGeometry(.16,12,8),mat('#efce79'),npc,0,2.75,0);npcMarker.material.emissive=new THREE.Color('#75551d');
// Camera looks down into a cozy miniature village.
const cameraOffset=new THREE.Vector3(10,12,16);function placeCamera(){camera.position.copy(hero.position).add(cameraOffset);camera.lookAt(hero.position.x,0,hero.position.z-1.6)}placeCamera();

// Story and interaction state.
let begun=false,dialogueOpen=false,questState='intro',herbCount=0,coins=12,day=1,clockMinutes=8*60+15,toastTimer=0;
const $=s=>document.querySelector(s);
const toastEl=$('#toast');
function toast(text){toastEl.textContent=text;toastEl.classList.add('show');toastTimer=2.1}
function refreshQuest(){
  const fraction=questState==='intro'?0:questState==='herbs'?herbCount/3:1;
  $('#progress-fill').style.width=`${fraction*100}%`;
  $('#progress-text').textContent=questState==='intro'?'0 / 3':questState==='herbs'?`${herbCount} / 3`:'DONE';
  if(questState==='intro'){$('#quest-title').textContent='A helping hand';$('#quest-desc').textContent='The village healer needs three meadow herbs. Find them growing in the grass.';$('#quest-hint').textContent='Wander the meadow to find herbs'}
  if(questState==='herbs'){$('#quest-title').textContent='Meadow remedies';$('#quest-desc').textContent='Gather three golden sprigs for Elowen. Look for their little glimmer in the grass.';$('#quest-hint').textContent='Bring your herbs back to Elowen'}
  if(questState==='done'){$('#quest-title').textContent='A kindness remembered';$('#quest-desc').textContent='Elowen has everything she needs. Meadowmere is a little brighter today.';$('#quest-hint').textContent='The meadow is yours to explore'}
}
function showDialogue(name,copy,button='CONTINUE',avatar='E'){$('#dialogue-name').textContent=name;$('#dialogue-copy').textContent=copy;$('#dialogue-next').innerHTML=`${button} <span>→</span>`;$('#dialogue-avatar').textContent=avatar;$('#dialogue').classList.remove('hidden');dialogueOpen=true}
function hideDialogue(){$('#dialogue').classList.add('hidden');dialogueOpen=false}
function openNpc(){if(!begun||dialogueOpen)return;if(questState==='intro')showDialogue('ELOWEN · VILLAGE HEALER','Good morning, neighbor! Would you gather three golden meadow herbs for my remedies? The little sprigs glow in the grass.','I’LL HELP');else if(questState==='herbs'&&herbCount<3)showDialogue('ELOWEN · VILLAGE HEALER',`You have found ${herbCount} of the three herbs. Keep an eye out for their golden glimmer, dear.`, 'I’LL KEEP LOOKING');else if(questState==='herbs'&&herbCount>=3)showDialogue('ELOWEN · VILLAGE HEALER','Oh, these are perfect! Thank you for taking the time to help. Here, a few coins for your kindness.','ACCEPT THANKS');else showDialogue('ELOWEN · VILLAGE HEALER','The day is young, and the meadow is full of wonders. Thank you again, good neighbor.','LOVELY DAY');}
function interact(){if(!begun||dialogueOpen)return;const d=Math.hypot(hero.position.x-npc.position.x,hero.position.z-npc.position.z);if(d<2.2){openNpc();return}let nearest=null,dist=2.4;for(const h of herbs){if(questState!=='herbs'||h.collected)continue;const hd=Math.hypot(hero.position.x-h.group.position.x,hero.position.z-h.group.position.z);if(hd<dist){nearest=h;dist=hd}}if(nearest){nearest.collected=true;nearest.group.visible=false;herbCount++;refreshQuest();toast(`Meadow herb gathered · ${herbCount} / 3`);if(herbCount===3&&questState==='herbs')toast('You found them all! Bring the herbs to Elowen.');return}toast('Nothing to gather here. Follow the little golden glimmers.');}
$('#dialogue-next').addEventListener('click',()=>{if(questState==='intro'){questState='herbs';refreshQuest();hideDialogue();toast('A new errand · Find 3 meadow herbs')}else if(questState==='herbs'&&herbCount>=3){questState='done';coins+=18;$('#coins').textContent=coins;refreshQuest();hideDialogue();$('#completion').classList.remove('hidden')}else hideDialogue()});
$('#dialogue-close').addEventListener('click',hideDialogue);
$('#continue-button').addEventListener('click',()=>{$('#completion').classList.add('hidden');toast('The village is yours to explore')});
$('#start-button').addEventListener('click',()=>{begun=true;$('#start-screen').style.display='none';toast('Welcome to Meadowmere')});
$('#action-button').addEventListener('pointerdown',e=>{e.preventDefault();interact()});
window.addEventListener('keydown',e=>{const key=e.key.toLowerCase();if(['arrowup','arrowdown','arrowleft','arrowright',' '].includes(key))e.preventDefault();if(key==='e'||key===' '||key==='enter'){if(dialogueOpen)$('#dialogue-next').click();else interact()}keys.add(key)},{passive:false});
window.addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));
const keys=new Set();let joy={x:0,y:0};
const joyZone=$('#joy-zone'),knob=$('#joy-knob');let joyPointer=null;
joyZone.addEventListener('pointerdown',e=>{joyPointer=e.pointerId;joyZone.setPointerCapture(e.pointerId);moveJoy(e)});
joyZone.addEventListener('pointermove',e=>{if(e.pointerId===joyPointer)moveJoy(e)});
function moveJoy(e){const r=joyZone.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;let dx=e.clientX-cx,dy=e.clientY-cy;const max=35,len=Math.hypot(dx,dy);if(len>max){dx*=max/len;dy*=max/len}joy.x=dx/max;joy.y=dy/max;knob.style.transform=`translate(${dx}px,${dy}px)`}
function resetJoy(e){if(e.pointerId!==joyPointer)return;joyPointer=null;joy.x=joy.y=0;knob.style.transform='translate(0,0)'}
joyZone.addEventListener('pointerup',resetJoy);joyZone.addEventListener('pointercancel',resetJoy);
let last=performance.now(),walkTime=0;
const clockEl=$('#clock');
function update(now){requestAnimationFrame(update);const dt=Math.min(.05,(now-last)/1000);last=now;
  if(begun&&!dialogueOpen){let ix=0,iz=0;if(keys.has('w')||keys.has('arrowup'))iz-=1;if(keys.has('s')||keys.has('arrowdown'))iz+=1;if(keys.has('a')||keys.has('arrowleft'))ix-=1;if(keys.has('d')||keys.has('arrowright'))ix+=1;ix+=joy.x;iz+=joy.y;const len=Math.hypot(ix,iz);if(len>.14){ix/=Math.max(1,len);iz/=Math.max(1,len);const speed=3.15;hero.position.x=THREE.MathUtils.clamp(hero.position.x+ix*speed*dt,-9,9);hero.position.z=THREE.MathUtils.clamp(hero.position.z+iz*speed*dt,-7,10);hero.rotation.y=Math.atan2(ix,iz);walkTime+=dt*10;legs[0].rotation.x=Math.sin(walkTime)*.52;legs[1].rotation.x=-Math.sin(walkTime)*.52;arms[0].rotation.x=-Math.sin(walkTime)*.35;arms[1].rotation.x=Math.sin(walkTime)*.35}else{legs.forEach(l=>l.rotation.x=THREE.MathUtils.damp(l.rotation.x,0,8,dt));arms.forEach(a=>a.rotation.x=THREE.MathUtils.damp(a.rotation.x,0,8,dt));}camera.position.lerp(new THREE.Vector3(hero.position.x+cameraOffset.x,hero.position.y+cameraOffset.y,hero.position.z+cameraOffset.z),1-Math.exp(-dt*3));camera.lookAt(hero.position.x,0,hero.position.z-1.6);clockMinutes+=dt*1.1;const hh=Math.floor(clockMinutes/60)%12||12,mm=Math.floor(clockMinutes%60);clockEl.textContent=`${hh}:${String(mm).padStart(2,'0')} ${clockMinutes%1440<720?'AM':'PM'}`;}
  const nd=Math.hypot(hero.position.x-npc.position.x,hero.position.z-npc.position.z);const nearHerb=questState==='herbs'&&herbs.some(h=>!h.collected&&Math.hypot(hero.position.x-h.group.position.x,hero.position.z-h.group.position.z)<1.9);const interaction=$('#interaction');if(begun&&!dialogueOpen&&(nd<2.2||nearHerb)){interaction.classList.add('visible');$('#interaction-text').textContent=nd<2.2?'Talk to Elowen':'Gather meadow herb';$('#interaction-icon').textContent=nd<2.2?'☘':'✦'}else interaction.classList.remove('visible');
  npcMarker.position.y=2.75+Math.sin(now*.002)*.09;for(const h of herbs)if(!h.collected){h.group.position.y=Math.sin(now*.002+h.phase)*.055;h.ring.material.opacity=.4+Math.sin(now*.003+h.phase)*.17}
  if(toastTimer>0){toastTimer-=dt;if(toastTimer<=0)toastEl.classList.remove('show')}
  renderer.render(scene,camera);
}
requestAnimationFrame(update);
function resize(){camera.aspect=innerWidth/innerHeight;camera.fov=innerWidth<700?44:36;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,1.8))}
window.addEventListener('resize',resize);resize();
