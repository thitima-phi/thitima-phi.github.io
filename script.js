const galleries={};
Object.assign(galleries, driveCollections);
document.querySelectorAll('video').forEach(video=>{
 video.addEventListener('play',()=>document.querySelectorAll('video').forEach(other=>{if(other!==video)other.pause();}));
});
document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{
 document.querySelectorAll('[data-filter]').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button));});
 document.querySelectorAll('[data-company]').forEach(heading=>heading.hidden=button.dataset.filter!=='all'&&heading.dataset.company!==button.dataset.filter);
 document.querySelectorAll('[data-category]').forEach(card=>{
  card.hidden=button.dataset.filter!=='all'&&card.dataset.category!==button.dataset.filter;
  if(card.hidden)card.querySelectorAll('video').forEach(video=>video.pause());
 });
}));
const dialog=document.getElementById('gallery'), image=document.getElementById('gallery-image');
let current=null,index=0,opener=null;
function render(){const [src,caption]=current.items[index];image.src=src;image.alt=caption;document.getElementById('gallery-title').textContent=current.title;document.getElementById('gallery-count').textContent=`${index+1} / ${current.items.length}`;document.getElementById('gallery-caption').textContent=caption;document.getElementById('previous').disabled=index===0;document.getElementById('next').disabled=index===current.items.length-1;}
document.querySelectorAll('[data-gallery]').forEach(button=>button.addEventListener('click',()=>{opener=button;current=galleries[button.dataset.gallery];index=0;render();dialog.showModal();document.body.classList.add('modal-open');}));
document.querySelector('.close-button').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
dialog.addEventListener('close',()=>{document.body.classList.remove('modal-open');opener?.focus();});
document.getElementById('previous').addEventListener('click',()=>{if(index>0){index--;render();}});
document.getElementById('next').addEventListener('click',()=>{if(index<current.items.length-1){index++;render();}});
dialog.addEventListener('keydown',e=>{if(e.key==='ArrowRight'&&index<current.items.length-1){index++;render();}if(e.key==='ArrowLeft'&&index>0){index--;render();}});
