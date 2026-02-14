import{h as U}from"./chunk-hwrk9hgf.js";import{n as W,o as O}from"./chunk-0f7ph7sp.js";import{p as H}from"./chunk-aeetm00j.js";class q extends H{static get observedAttributes(){return["columns","page-size","sortable","selectable","filterable","empty-message"]}static baseClass="au-datatable";static cssFile="datatable";constructor(){super();this._data=[],this._filteredData=[],this._columns=[],this._currentPage=1,this._sortField=null,this._sortDirection="asc",this._selectedRows=new Set,this._filterValue=""}get columns(){let z=this.getAttribute("columns");if(z)try{return JSON.parse(z)}catch(J){return console.warn("[au-datatable] Invalid columns JSON:",J),[]}return this._columns}set columns(z){if(this._columns=Array.isArray(z)?z:[],this.isConnected)this.render()}get pageSize(){return parseInt(this.getAttribute("page-size"))||10}set pageSize(z){this.setAttribute("page-size",z)}get sortable(){return this.hasAttribute("sortable")}get selectable(){return this.hasAttribute("selectable")}get filterable(){return this.hasAttribute("filterable")}get emptyMessage(){return this.getAttribute("empty-message")||"No data available"}connectedCallback(){super.connectedCallback(),this.render()}attributeChangedCallback(z,J,G){if(this.isConnected&&J!==G)this.render()}setData(z){this._data=Array.isArray(z)?z:[],this._filteredData=[...this._data],this._currentPage=1,this._selectedRows.clear(),this._applySort(),this.render(),this.emit("au-data-change",{data:this._data,count:this._data.length},{bubbles:!0})}getData(){return[...this._data]}getSortState(){return{field:this._sortField,direction:this._sortDirection}}getSelectedRows(){return this._data.filter((z,J)=>this._selectedRows.has(J))}getPageInfo(){let z=Math.ceil(this._filteredData.length/this.pageSize);return{page:this._currentPage,pageSize:this.pageSize,totalPages:z,totalRows:this._filteredData.length}}goToPage(z){let J=Math.ceil(this._filteredData.length/this.pageSize)||1;this._currentPage=Math.max(1,Math.min(z,J)),this.render(),this.emit("au-page-change",this.getPageInfo(),{bubbles:!0})}sortBy(z,J){if(this._sortField===z&&!J)this._sortDirection=this._sortDirection==="asc"?"desc":"asc";else this._sortField=z,this._sortDirection=J||"asc";this._applySort(),this.render(),this.emit("au-sort-change",this.getSortState(),{bubbles:!0})}filter(z){this._filterValue=z.toLowerCase(),this._applyFilter(),this._currentPage=1,this.render(!1)}_applySort(){if(!this._sortField)return;this._filteredData.sort((z,J)=>{let G=z[this._sortField]??"",K=J[this._sortField]??"";if(typeof G==="number"&&typeof K==="number")return this._sortDirection==="asc"?G-K:K-G;let L=String(G).toLowerCase(),N=String(K).toLowerCase(),M=L.localeCompare(N);return this._sortDirection==="asc"?M:-M})}_applyFilter(){if(!this._filterValue){this._filteredData=[...this._data];return}let z=this.columns.filter((G)=>G.filterable!==!1),J=z.length>0?z.map((G)=>G.field):this.columns.map((G)=>G.field);this._filteredData=this._data.filter((G)=>{return J.some((K)=>{return String(G[K]??"").toLowerCase().includes(this._filterValue)})})}_getPageData(){let z=(this._currentPage-1)*this.pageSize,J=z+this.pageSize;return this._filteredData.slice(z,J)}_handleHeaderClick(z){if(this.columns.find((G)=>G.field===z)?.sortable!==!1&&this.sortable)this.sortBy(z)}_handleRowSelect(z,J){let G=(this._currentPage-1)*this.pageSize+z;if(J)this._selectedRows.add(G);else this._selectedRows.delete(G);this.render(),this.emit("au-selection-change",{selected:this.getSelectedRows()},{bubbles:!0})}_handleSelectAll(z){let J=this._getPageData(),G=(this._currentPage-1)*this.pageSize;J.forEach((K,L)=>{if(z)this._selectedRows.add(G+L);else this._selectedRows.delete(G+L)}),this.render(),this.emit("au-selection-change",{selected:this.getSelectedRows()},{bubbles:!0})}render(z=!0){let J=this.columns,G=this._getPageData(),{page:K,totalPages:L,totalRows:N}=this.getPageInfo(),M=(this._currentPage-1)*this.pageSize,X=G.length>0&&G.every((Y,Z)=>this._selectedRows.has(M+Z)),Q=this.querySelector(".au-datatable-table tbody"),_=this.querySelector(".au-datatable-footer");if(!z&&Q){if(Q.innerHTML=this._renderTbody(G,J,M,X),_)_.innerHTML=this._renderFooterContent(K,L,N);this._attachEventListeners();return}this.innerHTML=O`
            <div class="au-datatable-wrapper">
                ${this.filterable?O`
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
                            ${this.selectable?O`
                                <th class="au-datatable-checkbox-cell">
                                    <input 
                                        type="checkbox" 
                                        ${X?"checked":""}
                                        data-select-all
                                    >
                                </th>
                            `:""}
                            ${W(J.map((Y)=>{let Z=Y.sortable!==!1&&this.sortable,$=this._sortField===Y.field,E=$?this._sortDirection==="asc"?"↑":"↓":"↕";return O`
                                    <th 
                                        class="${Z?"au-datatable-sortable":""} ${$?"au-datatable-sorted":""}"
                                        data-field="${Y.field}"
                                    >
                                        ${Y.label||Y.field}
                                        ${Z?W(`<span class="au-datatable-sort-icon">${E}</span>`):""}
                                    </th>
                                `}).join(""))}
                        </tr>
                    </thead>
                    <tbody>
                        ${W(this._renderTbody(G,J,M,X))}
                    </tbody>
                </table>

                ${W(this._renderFooter(K,L,N))}
            </div>
        `,this._attachEventListeners()}_renderTbody(z,J,G,K){if(z.length===0)return O`
                <tr>
                    <td colspan="${J.length+(this.selectable?1:0)}" class="au-datatable-empty-state">
                        ${this.emptyMessage}
                    </td>
                </tr>
            `;return z.map((L,N)=>{let M=G+N,X=this._selectedRows.has(M);return O`
                <tr class="${X?"au-datatable-selected":""}" data-row-index="${N}">
                    ${this.selectable?O`
                        <td class="au-datatable-checkbox-cell">
                            <input 
                                type="checkbox" 
                                ${X?"checked":""}
                                data-row-select="${N}"
                            >
                        </td>
                    `:""}
                    ${W(J.map((Q)=>O`
                        <td data-field="${Q.field}">
                            ${Q.render?W(Q.render(L[Q.field],L)):L[Q.field]??""}
                        </td>
                    `).join(""))}
                </tr>
            `}).join("")}_renderFooter(z,J,G){return`
            <div class="au-datatable-footer">
                ${this._renderFooterContent(z,J,G)}
            </div>
        `}_renderFooterContent(z,J,G){let K=this._selectedRows.size,L=`${G} row${G!==1?"s":""}${K>0?` · ${K} selected`:""}`;if(J<=1)return`
                <div class="au-datatable-footer-info">${L}</div>
            `;return`
            <div class="au-datatable-footer-info">
                Showing ${(z-1)*this.pageSize+1}–${Math.min(z*this.pageSize,G)} of ${L}
            </div>
            <div class="au-datatable-pagination-controls">
                <button class="au-datatable-pagination-btn" data-page="prev" ${z<=1?"disabled":""}>
                    ←
                </button>
                ${this._getPaginationButtons(z,J)}
                <button class="au-datatable-pagination-btn" data-page="next" ${z>=J?"disabled":""}>
                    →
                </button>
            </div>
        `}_getPaginationButtons(z,J){let G=[],K=5,L=Math.max(1,z-Math.floor(2.5)),N=Math.min(J,L+5-1);if(N-L<4)L=Math.max(1,N-5+1);for(let M=L;M<=N;M++)G.push(`
                <button 
                    class="au-datatable-pagination-btn ${M===z?"au-datatable-pagination-btn-active":""}"
                    data-page="${M}"
                >
                    ${M}
                </button>
            `);return G.join("")}_attachEventListeners(){this.querySelectorAll("th.au-datatable-sortable").forEach((G)=>{this.listen(G,"click",()=>{this._handleHeaderClick(G.dataset.field)})}),this.querySelectorAll(".au-datatable-pagination-btn[data-page]").forEach((G)=>{this.listen(G,"click",()=>{let K=G.dataset.page;if(K==="prev")this.goToPage(this._currentPage-1);else if(K==="next")this.goToPage(this._currentPage+1);else this.goToPage(parseInt(K))})}),this.querySelectorAll("[data-row-select]").forEach((G)=>{this.listen(G,"change",(K)=>{this._handleRowSelect(parseInt(G.dataset.rowSelect),K.target.checked)})});let z=this.querySelector("[data-select-all]");if(z)this.listen(z,"change",(G)=>{this._handleSelectAll(G.target.checked)});let J=this.querySelector(".au-datatable-search input");if(J){let G=U((K)=>this.filter(K),300);this.listen(J,"input",(K)=>G(K.target.value))}}}if(!customElements.get("au-datatable"))customElements.define("au-datatable",q);export{q as AuDataTable};
