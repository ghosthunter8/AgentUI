function M(b,j,B={}){let{color:G="currentColor",centered:J=!1}=B,k=b.getBoundingClientRect(),q,w;if(J||!j)q=k.width/2,w=k.height/2;else{let K=j.touches?j.touches[0].clientX:j.clientX,L=j.touches?j.touches[0].clientY:j.clientY;q=K-k.left,w=L-k.top}let F=Math.max(Math.hypot(q,w),Math.hypot(k.width-q,w),Math.hypot(q,k.height-w),Math.hypot(k.width-q,k.height-w))*2,A=document.createElement("span");A.className="au-ripple-wave",A.style.cssText=`
        position: absolute;
        width: ${F}px;
        height: ${F}px;
        left: ${q-F/2}px;
        top: ${w-F/2}px;
        background: ${G};
        border-radius: 50%;
        transform: scale(0);
        opacity: 0.10;
        pointer-events: none;
    `;let I=getComputedStyle(b);if(I.position==="static")b.style.position="relative";if(I.overflow!=="hidden")b.style.overflow="hidden";b.appendChild(A),A.animate([{transform:"scale(0)"},{transform:"scale(1)"}],{duration:300,easing:"cubic-bezier(0.4, 0, 0.2, 1)",fill:"forwards"});let D=()=>{A.animate([{opacity:"0.10"},{opacity:"0"}],{duration:150,easing:"ease-out",fill:"forwards"}).onfinish=()=>A.remove(),b.removeEventListener("pointerup",D),b.removeEventListener("pointerleave",D),b.removeEventListener("pointercancel",D)};return b.addEventListener("pointerup",D,{once:!0}),b.addEventListener("pointerleave",D,{once:!0}),b.addEventListener("pointercancel",D,{once:!0}),A}var H=new WeakSet;function N(b,j={}){if(H.has(b))return()=>{};H.add(b);let B=(G)=>{if(b.hasAttribute("disabled"))return;M(b,G,j)};return b.addEventListener("pointerdown",B),()=>{H.delete(b),b.removeEventListener("pointerdown",B)}}var P=(b)=>class extends b{#b=null;initRipple(j=this,B={}){if(this.#b)this.#b(),this.#b=null;this.#b=N(j,B)}disconnectedCallback(){if(this.#b)this.#b(),this.#b=null;super.disconnectedCallback?.()}};
export{M as a,N as b,P as c};
