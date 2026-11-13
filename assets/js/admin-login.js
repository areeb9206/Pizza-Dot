import {signInWithEmailAndPassword,signOut,onAuthStateChanged} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js';
import {ref,get} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-database.js';
import {auth,db,configured,$,path,errorText,formBusy} from './shared.js';
const form=$('#adminLoginForm'),message=$('#adminLoginError');
if(!configured){message.textContent='Firebase setup required: edit assets/js/firebase-config.js.';$('#adminLoginButton').disabled=true;}
async function isAllowed(user){if(!user)return false;try{const role=await get(ref(db,`admins/${user.uid}`));return role.val()===true}catch{return false}}
if(configured)onAuthStateChanged(auth,async user=>{if(user&&await isAllowed(user))location.replace(path('admin/dashboard/'))});
form.addEventListener('submit',async e=>{e.preventDefault();if(!configured)return;message.textContent='';const button=$('#adminLoginButton');formBusy(button,true,'Checking access…');try{const res=await signInWithEmailAndPassword(auth,$('#adminEmail').value.trim(),$('#adminPassword').value);if(!await isAllowed(res.user)){await signOut(auth);throw new Error('This account is not authorized as an administrator. Ask the owner to add its Firebase UID under /admins in the Realtime Database console.')}location.replace(path('admin/dashboard/'))}catch(err){message.textContent=errorText(err)}finally{formBusy(button,false)}});
