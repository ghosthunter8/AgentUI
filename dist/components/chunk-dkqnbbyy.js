function L(b,k,G={}){let{color:H="currentColor",centered:I=!1}=G,j=b.getBoundingClientRect(),q,w;if(I||!k)q=j.width/2,w=j.height/2;else{let J=k.touches?k.touches[0].clientX:k.clientX,K=k.touches?k.touches[0].clientY:k.clientY;q=J-j.left,w=K-j.top}let D=Math.max(Math.hypot(q,w),Math.hypot(j.width-q,w),Math.hypot(q,j.height-w),Math.hypot(j.width-q,j.height-w))*2,A=document.createElement("span");A.className="au-ripple-wave",A.style.cssText=`
        position: absolute;
        width: ${D}px;
        height: ${D}px;
        left: ${q-D/2}px;
        top: ${w-D/2}px;
        background: ${H};
        border-radius: 50%;
        transform: scale(0);
        opacity: 0.10;
        pointer-events: none;
    `;let F=getComputedStyle(b);if(F.position==="static")b.style.position="relative";if(F.overflow!=="hidden")b.style.overflow="hidden";b.appendChild(A),A.animate([{transform:"scale(0)"},{transform:"scale(1)"}],{duration:300,easing:"cubic-bezier(0.4, 0, 0.2, 1)",fill:"forwards"});let B=()=>{A.animate([{opacity:"0.10"},{opacity:"0"}],{duration:150,easing:"ease-out",fill:"forwards"}).onfinish=()=>A.remove(),b.removeEventListener("pointerup",B),b.removeEventListener("pointerleave",B),b.removeEventListener("pointercancel",B)};return b.addEventListener("pointerup",B,{once:!0}),b.addEventListener("pointerleave",B,{once:!0}),b.addEventListener("pointercancel",B,{once:!0}),A}
export{L as c};
