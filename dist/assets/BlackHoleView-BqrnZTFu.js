import{r,j as e,b4 as x}from"./index-CEtVxEzz.js";const k=({sections:p,visible:m})=>{const[i,g]=r.useState(0),[a,d]=r.useState("idle"),[n,c]=r.useState(!1),[f,u]=r.useState(!1),j=r.useRef(null),v=r.useRef(null);r.useEffect(()=>{if(m){const t=setTimeout(()=>u(!0),150),s=setTimeout(()=>c(!0),400);return()=>{clearTimeout(t),clearTimeout(s)}}u(!1),c(!1)},[m]);const y=t=>{t===i||a!=="idle"||(j.current=t,d("sucking"),c(!1),setTimeout(()=>{g(t),d("emerging"),setTimeout(()=>{c(!0),setTimeout(()=>d("idle"),600)},150)},500))},o=p[i];if(!o)return null;const l=o.links||[],b=[-.8,.5,-.4,.7,-.6,.3],w=b[i%b.length];return e.jsx("div",{className:"w-full max-w-6xl mx-auto px-3 sm:px-4 pt-4",dir:"rtl",children:e.jsxs("div",{className:"flex flex-col lg:flex-row gap-4 lg:gap-6",children:[e.jsx("div",{className:`
            lg:w-52 flex-shrink-0 flex lg:flex-col gap-2
            overflow-x-auto lg:overflow-visible pb-2 lg:pb-0
            scrollbar-hide transition-all duration-600
            ${f?"opacity-100 translate-x-0":"opacity-0 translate-x-8"}
          `,children:p.map((t,s)=>{const h=s===i,N="emoji"in t?t.emoji:"";return e.jsxs("button",{onClick:()=>y(s),className:`
                  flex-shrink-0 flex items-center gap-2 px-4 py-3 rounded-2xl
                  text-sm font-medium transition-all duration-300 border text-right
                  ${h?"bg-gradient-to-l from-primary/20 to-purple-500/10 border-primary/30 text-white shadow-lg shadow-primary/10 scale-[1.03]":"bg-white/[0.02] border-white/[0.05] text-white/40 hover:bg-white/[0.05] hover:text-white/60"}
                `,children:[e.jsx("span",{className:"text-lg",children:N}),e.jsx("span",{className:"hidden lg:inline whitespace-nowrap",children:t.title}),e.jsx("span",{className:"lg:hidden whitespace-nowrap text-xs",children:t.title}),h&&e.jsx("span",{className:"mr-auto text-[10px] text-primary/60",children:l.length})]},s)})}),e.jsxs("div",{className:"flex-1 relative min-h-[400px]",children:[e.jsxs("div",{ref:v,className:`
              absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2
              w-48 h-48 rounded-full pointer-events-none z-10
              transition-all duration-700
              ${a==="sucking"?"scale-150 opacity-90":a==="emerging"?"scale-125 opacity-70":"scale-100 opacity-40"}
            `,style:{background:"radial-gradient(circle, #000 0%, #0a001a 25%, rgba(99,50,200,0.15) 50%, transparent 70%)",boxShadow:a!=="idle"?"0 0 80px 30px rgba(120,60,220,0.3), 0 0 120px 60px rgba(80,30,180,0.15), inset 0 0 60px rgba(0,0,0,0.8)":"0 0 40px 15px rgba(80,40,160,0.15), inset 0 0 40px rgba(0,0,0,0.6)"},children:[e.jsx("div",{className:`
                absolute inset-2 rounded-full border border-purple-500/20
                transition-all duration-700
                ${a!=="idle"?"animate-spin border-purple-400/40":""}
              `,style:{animationDuration:"3s"}}),e.jsx("div",{className:`
                absolute inset-6 rounded-full border border-cyan-500/10
                transition-all duration-700
                ${a!=="idle"?"animate-spin border-cyan-400/30":""}
              `,style:{animationDuration:"2s",animationDirection:"reverse"}})]}),e.jsxs("div",{className:"relative",children:[[1,2].map(t=>e.jsx("div",{className:`
                  absolute inset-0 rounded-3xl border border-white/[0.03] bg-white/[0.008]
                  transition-all duration-700
                  ${n?"opacity-100":"opacity-0"}
                `,style:{transform:`rotate(${t*1.2*(i%2===0?1:-1)}deg) translateX(${t*6}px) translateY(${t*3}px)`,zIndex:-t}},t)),e.jsxs("div",{className:`
                relative rounded-3xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-sm
                p-4 sm:p-6 transition-all
                ${a==="sucking"?"duration-500 opacity-0 scale-75 translate-y-24 blur-sm":a==="emerging"?"duration-100 opacity-0 scale-90 translate-y-8":n?"duration-600 opacity-100 scale-100 translate-y-0 blur-0":"duration-500 opacity-0 scale-95 translate-y-8"}
              `,style:{transform:a==="idle"&&n?`rotate(${w}deg) scale(1) translateY(0)`:a==="sucking"?"rotate(8deg) scale(0.6) translateY(120px)":void 0,transition:"all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)"},children:[e.jsxs("div",{className:"text-center mb-5",children:[e.jsxs("h2",{className:"text-lg font-bold text-white/90",children:["emoji"in o?o.emoji:""," ",o.title]}),e.jsxs("p",{className:"text-white/30 text-xs mt-1",children:[l.length," כלים"]})]}),e.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-3",children:[l.length>0&&e.jsx("div",{className:"col-span-1 sm:col-span-2",children:e.jsx(x,{...l[0],delay:0,visible:n&&a==="idle",featured:!0,direction:"right"},`bh-${i}-${l[0].id}`)}),e.jsx("div",{className:"flex flex-col gap-3",children:l.slice(1).filter((t,s)=>s%2===0).map((t,s)=>e.jsx(x,{...t,delay:(s+1)*50,visible:n&&a==="idle",direction:"right"},`bh-${i}-${t.id}`))}),e.jsx("div",{className:"flex flex-col gap-3",children:l.slice(1).filter((t,s)=>s%2===1).map((t,s)=>e.jsx(x,{...t,delay:(s+1)*50+25,visible:n&&a==="idle",direction:"left"},`bh-${i}-${t.id}`))})]})]})]}),e.jsx("div",{className:`
              absolute bottom-0 left-0 right-0 h-32 pointer-events-none
              bg-gradient-to-t from-purple-900/10 to-transparent
              transition-opacity duration-700
              ${a!=="idle"?"opacity-100":"opacity-30"}
            `})]})]})})};export{k as BlackHoleView};
