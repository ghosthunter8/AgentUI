import{a as p}from"./chunk-zv0xkssz.js";import"./chunk-jn8zd153.js";import"./chunk-ce0w0142.js";import"./chunk-wvr0ptzf.js";import"./chunk-s1kj67sf.js";import{i as _,l as o,m as h}from"./chunk-afwem87e.js";class f extends _{static get observedAttributes(){return["columns","page-size","sortable","selectable","filterable","empty-message"]}static baseClass="au-datatable";static cssFile="datatable";constructor(){super();this._data=[],this._filteredData=[],this._columns=[],this._currentPage=1,this._sortField=null,this._sortDirection="asc",this._selectedRows=new Set,this._filterValue=""}get columns(){let t=this.getAttribute("columns");if(t)try{return JSON.parse(t)}catch(a){return console.warn("[au-datatable] Invalid columns JSON:",a),[]}return this._columns}set columns(t){if(this._columns=Array.isArray(t)?t:[],this.isConnected)this.render()}get pageSize(){return parseInt(this.getAttribute("page-size"))||10}set pageSize(t){this.setAttribute("page-size",t)}get sortable(){return this.hasAttribute("sortable")}get selectable(){return this.hasAttribute("selectable")}get filterable(){return this.hasAttribute("filterable")}get emptyMessage(){return this.getAttribute("empty-message")||"No data available"}connectedCallback(){super.connectedCallback(),this.render()}attributeChangedCallback(t,a,e){if(this.isConnected&&a!==e)this.render()}setData(t){this._data=Array.isArray(t)?t:[],this._filteredData=[...this._data],this._currentPage=1,this._selectedRows.clear(),this._applySort(),this.render(),this.emit("au-data-change",{data:this._data,count:this._data.length},{bubbles:!0})}getData(){return[...this._data]}getSortState(){return{field:this._sortField,direction:this._sortDirection}}getSelectedRows(){return this._data.filter((t,a)=>this._selectedRows.has(a))}getPageInfo(){let t=Math.ceil(this._filteredData.length/this.pageSize);return{page:this._currentPage,pageSize:this.pageSize,totalPages:t,totalRows:this._filteredData.length}}goToPage(t){let a=Math.ceil(this._filteredData.length/this.pageSize)||1;this._currentPage=Math.max(1,Math.min(t,a)),this.render(),this.emit("au-page-change",this.getPageInfo(),{bubbles:!0})}sortBy(t,a){if(this._sortField===t&&!a)this._sortDirection=this._sortDirection==="asc"?"desc":"asc";else this._sortField=t,this._sortDirection=a||"asc";this._applySort(),this.render(),this.emit("au-sort-change",this.getSortState(),{bubbles:!0})}filter(t){this._filterValue=t.toLowerCase(),this._applyFilter(),this._currentPage=1,this.render(!1)}_applySort(){if(!this._sortField)return;this._filteredData.sort((t,a)=>{let e=t[this._sortField]??"",s=a[this._sortField]??"";if(typeof e==="number"&&typeof s==="number")return this._sortDirection==="asc"?e-s:s-e;let i=String(e).toLowerCase(),l=String(s).toLowerCase(),r=i.localeCompare(l);return this._sortDirection==="asc"?r:-r})}_applyFilter(){if(!this._filterValue){this._filteredData=[...this._data];return}let t=this.columns.filter((e)=>e.filterable!==!1),a=t.length>0?t.map((e)=>e.field):this.columns.map((e)=>e.field);this._filteredData=this._data.filter((e)=>{return a.some((s)=>{return String(e[s]??"").toLowerCase().includes(this._filterValue)})})}_getPageData(){let t=(this._currentPage-1)*this.pageSize,a=t+this.pageSize;return this._filteredData.slice(t,a)}_handleHeaderClick(t){if(this.columns.find((a)=>a.field===t)?.sortable!==!1&&this.sortable)this.sortBy(t)}_handleRowSelect(t,a){let e=(this._currentPage-1)*this.pageSize+t;if(a)this._selectedRows.add(e);else this._selectedRows.delete(e);this.render(),this.emit("au-selection-change",{selected:this.getSelectedRows()},{bubbles:!0})}_handleSelectAll(t){let a=this._getPageData(),e=(this._currentPage-1)*this.pageSize;a.forEach((s,i)=>{if(t)this._selectedRows.add(e+i);else this._selectedRows.delete(e+i)}),this.render(),this.emit("au-selection-change",{selected:this.getSelectedRows()},{bubbles:!0})}render(t=!0){let a=this.columns,e=this._getPageData(),{page:s,totalPages:i,totalRows:l}=this.getPageInfo(),r=(this._currentPage-1)*this.pageSize,d=e.length>0&&e.every((c,u)=>this._selectedRows.has(r+u)),n=this.querySelector(".au-datatable-table tbody"),b=this.querySelector(".au-datatable-footer");if(!t&&n){if(n.innerHTML=this._renderTbody(e,a,r,d),b)b.innerHTML=this._renderFooterContent(s,i,l);this._attachEventListeners();return}this.innerHTML=h`
            <div class="au-datatable-wrapper">
                ${this.filterable?h`
                    <div class="au-datatable-toolbar">
                        <div class="au-datatable-search">
                            <input 
                                type="search" 
                                placeholder="Search..." 
                                value="${this._filterValue}"
                            >
                        </div>
                    </div>
                `:""}

                <table class="au-datatable-table">
                    <thead>
                        <tr>
                            ${this.selectable?h`
                                <th class="au-datatable-checkbox-cell">
                                    <input 
                                        type="checkbox" 
                                        ${d?"checked":""}
                                        data-select-all
                                    >
                                </th>
                            `:""}
                            ${o(a.map((c)=>{let u=c.sortable!==!1&&this.sortable,g=this._sortField===c.field,m=g?this._sortDirection==="asc"?"↑":"↓":"↕";return h`
                                    <th 
                                        class="${u?"au-datatable-sortable":""} ${g?"au-datatable-sorted":""}"
                                        data-field="${c.field}"
                                    >
                                        ${c.label||c.field}
                                        ${u?o(`<span class="au-datatable-sort-icon">${m}</span>`):""}
                                    </th>
                                `}).join(""))}
                        </tr>
                    </thead>
                    <tbody>
                        ${o(this._renderTbody(e,a,r,d))}
                    </tbody>
                </table>

                ${o(this._renderFooter(s,i,l))}
            </div>
        `,this._attachEventListeners()}_renderTbody(t,a,e,s){if(t.length===0)return h`
                <tr>
                    <td colspan="${a.length+(this.selectable?1:0)}" class="au-datatable-empty-state">
                        ${this.emptyMessage}
                    </td>
                </tr>
            `;return t.map((i,l)=>{let r=e+l,d=this._selectedRows.has(r);return h`
                <tr class="${d?"au-datatable-selected":""}" data-row-index="${l}">
                    ${this.selectable?h`
                        <td class="au-datatable-checkbox-cell">
                            <input 
                                type="checkbox" 
                                ${d?"checked":""}
                                data-row-select="${l}"
                            >
                        </td>
                    `:""}
                    ${o(a.map((n)=>h`
                        <td data-field="${n.field}">
                            ${n.render?o(n.render(i[n.field],i)):i[n.field]??""}
                        </td>
                    `).join(""))}
                </tr>
            `}).join("")}_renderFooter(t,a,e){return`
            <div class="au-datatable-footer">
                ${this._renderFooterContent(t,a,e)}
            </div>
        `}_renderFooterContent(t,a,e){let s=this._selectedRows.size,i=`${e} row${e!==1?"s":""}${s>0?` · ${s} selected`:""}`;if(a<=1)return`
                <div class="au-datatable-footer-info">${i}</div>
            `;return`
            <div class="au-datatable-footer-info">
                Showing ${(t-1)*this.pageSize+1}–${Math.min(t*this.pageSize,e)} of ${i}
            </div>
            <div class="au-datatable-pagination-controls">
                <button class="au-datatable-pagination-btn" data-page="prev" ${t<=1?"disabled":""}>
                    ←
                </button>
                ${this._getPaginationButtons(t,a)}
                <button class="au-datatable-pagination-btn" data-page="next" ${t>=a?"disabled":""}>
                    →
                </button>
            </div>
        `}_getPaginationButtons(t,a){let e=[],s=5,i=Math.max(1,t-Math.floor(2.5)),l=Math.min(a,i+5-1);if(l-i<4)i=Math.max(1,l-5+1);for(let r=i;r<=l;r++)e.push(`
                <button 
                    class="au-datatable-pagination-btn ${r===t?"au-datatable-pagination-btn-active":""}"
                    data-page="${r}"
                >
                    ${r}
                </button>
            `);return e.join("")}_attachEventListeners(){this.querySelectorAll("th.au-datatable-sortable").forEach((e)=>{this.listen(e,"click",()=>{this._handleHeaderClick(e.dataset.field)})}),this.querySelectorAll(".au-datatable-pagination-btn[data-page]").forEach((e)=>{this.listen(e,"click",()=>{let s=e.dataset.page;if(s==="prev")this.goToPage(this._currentPage-1);else if(s==="next")this.goToPage(this._currentPage+1);else this.goToPage(parseInt(s))})}),this.querySelectorAll("[data-row-select]").forEach((e)=>{this.listen(e,"change",(s)=>{this._handleRowSelect(parseInt(e.dataset.rowSelect),s.target.checked)})});let t=this.querySelector("[data-select-all]");if(t)this.listen(t,"change",(e)=>{this._handleSelectAll(e.target.checked)});let a=this.querySelector(".au-datatable-search input");if(a){let e=p((s)=>this.filter(s),300);this.listen(a,"input",(s)=>e(s.target.value))}}}if(!customElements.get("au-datatable"))customElements.define("au-datatable",f);
