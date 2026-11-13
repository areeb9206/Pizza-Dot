import {initializeApp} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js';
import {getAuth} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js';
import {getDatabase} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-database.js';
import {firebaseConfig,businessConfig} from './firebase-config.js';
export {businessConfig};
export const configured = Object.values(firebaseConfig).every(value=>typeof value==='string'&&value.length>5&&!value.includes('PASTE_'));
export const firebaseApp = configured ? initializeApp(firebaseConfig) : null;
export const auth = firebaseApp ? getAuth(firebaseApp) : null;
export const db = firebaseApp ? getDatabase(firebaseApp) : null;
export const siteBase = new URL('../../',import.meta.url);
export const path = relative => new URL(relative,siteBase).href;
export const $ = (sel,ctx=document)=>ctx.querySelector(sel);
export const $$ = (sel,ctx=document)=>Array.from(ctx.querySelectorAll(sel));
export const money = v=>'Rs. '+(Number(v)||0).toLocaleString('en-PK',{maximumFractionDigits:0});
export const esc = s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const safeImage = image => /^(assets\/images\/)[a-zA-Z0-9._-]+\.(webp|png|jpg|jpeg|svg)$/.test(image||'') ? path(image) : path('assets/images/real-pizza-1.webp');
export function toast(message,error=false){const node=$('#toast');if(!node){alert(message);return;} node.textContent=message;node.classList.toggle('error',error);node.classList.add('show');clearTimeout(toast._timer);toast._timer=setTimeout(()=>node.classList.remove('show'),3600)}
export function errorText(e){const code=String(e?.code||'');const custom={
'auth/invalid-credential':'Incorrect email or password.','auth/email-already-in-use':'This email is already registered.','auth/weak-password':'Choose a stronger password (at least 8 characters).','auth/invalid-email':'Enter a valid email address.','auth/too-many-requests':'Too many attempts. Try again later.','PERMISSION_DENIED':'Database permission denied. Check the Firebase rules and your account.','auth/network-request-failed':'Network error. Check your internet connection.'};return custom[code] || (String(e?.message||'Something went wrong. Please try again.').slice(0,180));}
const CART_KEY='pizza-dot-cart-v1';
export function readCart(){try{let a=JSON.parse(localStorage.getItem(CART_KEY)||'[]');return Array.isArray(a)?a.filter(x=>x&&typeof x.id==='string'&&typeof x.variant==='string'&&Number.isInteger(x.qty)&&x.qty>0&&x.qty<=10).slice(0,35):[]}catch{return[]}}
export function saveCart(cart){localStorage.setItem(CART_KEY,JSON.stringify(cart));window.dispatchEvent(new Event('pizzadot:cart'));}
export function addCart(id,variant,qty=1){const cart=readCart();const old=cart.find(x=>x.id===id&&x.variant===variant);if(old)old.qty=Math.min(10,old.qty+qty);else cart.push({id,variant,qty});saveCart(cart);}
export function cartLines(cart,products){return cart.map(row=>{const product=products[row.id],v=product?.variants?.[row.variant];if(!product||!v||!product.active||!Number.isInteger(v.price)||v.price<1)return null;return{...row,product,variantData:v,lineTotal:v.price*row.qty}}).filter(Boolean)}
export function calcTotal(lines){return lines.reduce((sum,x)=>sum+x.lineTotal,0)}
export const statusLabel={pending_payment:'Pending Payment Verification',confirmed:'Order Confirmed',preparing:'Preparing',ready:'Ready for Delivery',out_for_delivery:'Out for Delivery',delivered:'Delivered',cancelled:'Cancelled'};
export function statusChip(status){return `<span class="status-chip ${esc(status)}">${esc(statusLabel[status]||status)}</span>`}
export const orderIdLabel=id=>String(id||'').slice(-9).toUpperCase();
export function formatDate(epoch){return new Date(epoch||Date.now()).toLocaleString('en-PK',{day:'numeric',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'})}
export function isEmail(s){return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(s))}
export function validPhone(s){return /^\+?\d[\d -]{8,16}$/.test(s||'')}
export function backToAccount(next=''){const q=next==='checkout'?'?next=checkout':next==='orders'?'?next=orders':'';location.href=path('account/'+q)}
export async function loadSampleCatalog(){try{const response=await fetch(path('assets/js/catalog-data.json'));if(!response.ok)throw new Error('Starter catalog missing');return await response.json()}catch(e){console.error(e);return {}}}
export function priceFromOrder(order){return Object.values(order?.lines||{}).reduce((sum,x)=>sum+Number(x.unitPrice||0)*Number(x.qty||0),0)+Number(order.deliveryFee||0)}
export async function compressScreenshot(file){if(!file)throw new Error('Select a payment screenshot.');if(!['image/png','image/jpeg','image/webp'].includes(file.type))throw new Error('Only JPG, PNG or WEBP screenshots are accepted.');if(file.size>businessConfig.maxScreenshotBytes)throw new Error('Screenshot must be smaller than 5 MB.');
let bitmap;try{bitmap=await createImageBitmap(file)}catch{throw new Error('Invalid or damaged image. Choose a different screenshot.')}try{let longSide=1400,quality=.81;for(let attempts=0;attempts<8;attempts++){const ratio=Math.min(1,longSide/Math.max(bitmap.width,bitmap.height));let canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(bitmap.width*ratio));canvas.height=Math.max(1,Math.round(bitmap.height*ratio));canvas.getContext('2d',{alpha:false}).drawImage(bitmap,0,0,canvas.width,canvas.height);const uri=canvas.toDataURL('image/jpeg',quality);canvas.width=0;canvas.height=0;if(uri.length<=310000)return uri;longSide=Math.floor(longSide*.86);quality=Math.max(.54,quality-.055)}throw new Error('Screenshot is too detailed. Crop it to the transaction area and try again.')}finally{bitmap.close?.()}}
export function applyImagePreview(file,target){if(!file){target.classList.add('hidden');return;}const url=URL.createObjectURL(file);target.onload=()=>URL.revokeObjectURL(url);target.onerror=()=>URL.revokeObjectURL(url);target.src=url;target.classList.remove('hidden')}
export function formBusy(button,busy,label){button.disabled=busy;if(busy){if(!button.dataset.before)button.dataset.before=button.textContent;button.textContent=label||'Please wait…'}else{button.textContent=button.dataset.before||button.textContent;delete button.dataset.before;}}
export function cleanText(s){return String(s||'').trim().replace(/[\u0000-\u001f\u007f]/g,' ').slice(0,400)}
export function firebaseRequired(){if(configured)return false;toast('Firebase setup is required. Edit assets/js/firebase-config.js.',true);return true}
