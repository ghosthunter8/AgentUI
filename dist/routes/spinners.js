import"./chunk-6yc01c45.js";import"./chunk-0p814v3x.js";import"./chunk-pnmk505d.js";import"./chunk-cq3jhpch.js";import"./chunk-7bampcf2.js";import"./chunk-h1m0y636.js";import{i as e,j as a}from"./chunk-jxs5xaj9.js";class n extends e{static baseClass="au-spinner";static observedAttributes=["size","color"];render(){if(this.querySelector(".au-spinner__spinner"))return;if(!this.hasAttribute("role"))this.setAttribute("role","progressbar");if(!this.hasAttribute("aria-label"))this.setAttribute("aria-label","Loading");this.innerHTML=`<div class="au-spinner__progress">
    <div class="au-spinner__spinner">
        <div class="au-spinner__left"><div class="au-spinner__circle"></div></div>
        <div class="au-spinner__right"><div class="au-spinner__circle"></div></div>
    </div>
</div>`,this.#i()}update(r,t,s){this.#i()}#i(){let r=this.attr("size","md"),t=this.attr("color","primary"),s=["au-spinner",`au-spinner--${r}`,`au-spinner--${t}`];s.forEach((i)=>this.classList.add(i)),Array.from(this.classList).forEach((i)=>{if(i.startsWith("au-spinner--")&&!s.includes(i))this.classList.remove(i)})}}a("au-spinner",n);
