import{p as B,q as D}from"./chunk-aeetm00j.js";class F extends B{static baseClass="au-spinner";static observedAttributes=["size","color"];render(){if(this.querySelector(".au-spinner__layer"))return;if(!this.hasAttribute("role"))this.setAttribute("role","progressbar");if(!this.hasAttribute("aria-label"))this.setAttribute("aria-label","Loading");this.innerHTML=`<div class="au-spinner__layer">
    <div class="au-spinner__clip-left"><div class="au-spinner__circle"></div></div>
    <div class="au-spinner__gap"><div class="au-spinner__circle"></div></div>
    <div class="au-spinner__clip-right"><div class="au-spinner__circle"></div></div>
</div>`,this.#k()}update(x,y,q){this.#k()}#k(){let x=this.attr("size","md"),y=this.attr("color","primary"),q=["au-spinner",`au-spinner--${x}`,`au-spinner--${y}`];q.forEach((k)=>this.classList.add(k)),Array.from(this.classList).forEach((k)=>{if(k.startsWith("au-spinner--")&&!q.includes(k))this.classList.remove(k)})}}D("au-spinner",F);export{F as AuSpinner};
