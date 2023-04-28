import{x as s,j as t,d as a,L as m,p as h,z as u,l as r,k as f}from"./index-218255ac.js";const i="products",p={getProducts(e){return s.get(i,{params:e})},getProductsDetail(e){return s.get(`${i}/${e}`)}},g=p;function v({rating:e,activeClassName:o="h-3 w-3 fill-yellow-300 text-yellow-300",notActiveClassName:c="h-3 w-3 fill-current text-gray-300"}){const d=l=>l<=e?"100%":l>e&&l-e<1?(e-Math.floor(e))*100+"%":"0%";return t("div",{className:"flex items-center",children:Array(5).fill(0).map((l,n)=>a("div",{className:"relative",children:[t("div",{className:"absolute top-0 left-0 h-full overflow-hidden",style:{width:d(n+1)},children:t("svg",{enableBackground:"new 0 0 15 15",viewBox:"0 0 15 15",x:0,y:0,className:o,children:t("polygon",{points:"7.5 .8 9.7 5.4 14.5 5.9 10.7 9.1 11.8 14.2 7.5 11.6 3.2 14.2 4.3 9.1 .5 5.9 5.3 5.4",strokeLinecap:"round",strokeLinejoin:"round",strokeMiterlimit:10})})}),t("svg",{enableBackground:"new 0 0 15 15",viewBox:"0 0 15 15",x:0,y:0,className:c,children:t("polygon",{points:"7.5 .8 9.7 5.4 14.5 5.9 10.7 9.1 11.8 14.2 7.5 11.6 3.2 14.2 4.3 9.1 .5 5.9 5.3 5.4",strokeLinecap:"round",strokeLinejoin:"round",strokeMiterlimit:10})})]},n))})}function w({product:e}){return t(m,{to:`${h.home}${u({name:e.name,id:e._id})}`,children:a("div",{className:`overflow-hidden rounded-sm bg-white shadow transition-transform 
      duration-100 hover:translate-y-[0.04rem] hover:shadow-sm`,children:[t("div",{className:"relative w-full pt-[100%]",children:t("img",{src:e.image,alt:e.name,className:"absolute top-0 left-0 h-full w-full bg-white object-cover"})}),a("div",{className:"overflow-hidden p-3",children:[t("div",{className:"min-h-[2.5rem] text-sm line-clamp-2",children:e.name}),a("div",{className:"mt-3 flex items-center",children:[a("div",{className:"max-w-[50%] truncate text-[12px] text-gray-500 line-through",children:[t("span",{children:"₫"}),t("span",{children:r(e.price_before_discount)})]}),a("div",{className:"text-md ml-1 truncate text-orange",children:[t("span",{children:"₫"}),t("span",{children:r(e.price)})]})]}),a("div",{className:"flex-start mt-3 flex items-center",children:[t(v,{rating:e.rating}),a("div",{className:"ml-2 text-xs text-gray-600",children:[t("span",{children:"Đã bán"}),t("span",{className:"ml-1",children:f(e.sold)})]})]})]})]})})}export{v as P,w as a,g as p};
