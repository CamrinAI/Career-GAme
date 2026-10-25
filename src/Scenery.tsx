export function Scenery({arena=false}:{arena?:boolean}){
return <svg className={`scenery ${arena?'arena-scenery':''}`} viewBox="0 0 1100 560" role="img" aria-label="Original illustration of a floating citadel above a violet mountain range">
<defs>
 <linearGradient id="sky" x2="0" y2="1"><stop stopColor="#11172f"/><stop offset=".6" stopColor="#292453"/><stop offset="1" stopColor="#716292"/></linearGradient>
 <linearGradient id="stone" x2=".6" y2="1"><stop stopColor="#35375c"/><stop offset="1" stopColor="#0b1125"/></linearGradient>
 <linearGradient id="spire" x2="1" y2=".6"><stop stopColor="#66658c"/><stop offset=".45" stopColor="#34354f"/><stop offset="1" stopColor="#121a30"/></linearGradient>
 <linearGradient id="portal" x2="0" y2="1"><stop stopColor="#c3b5ff"/><stop offset=".5" stopColor="#8778ef"/><stop offset="1" stopColor="#363778"/></linearGradient>
 <radialGradient id="halo"><stop stopColor="#9f8afc" stopOpacity=".36"/><stop offset="1" stopColor="#7b60ee" stopOpacity="0"/></radialGradient>
 <filter id="glow"><feGaussianBlur stdDeviation="4"/></filter>
</defs>
<path fill="url(#sky)" d="M0 0h1100v560H0z"/><ellipse cx="782" cy="245" rx="310" ry="260" fill="url(#halo)"/>
{Array.from({length:48},(_,i)=><circle key={i} cx={(i*137+19)%1100} cy={(i*71+13)%340} r={i%6===0?1.5:.7} fill="#dfdcff" opacity={.2+i%4*.15}/>)}
<circle cx="850" cy="118" r="61" fill="none" stroke="#9692d4" strokeWidth=".8" opacity=".3"/><circle cx="850" cy="118" r="53" fill="#b7afe3" opacity=".05"/>
<path fill="#343254" d="M0 371l100-83 69 56 98-144 80 144 105-66 88 89 127-130 83 85 92-108 94 112 65-70v304H0z"/>
<path fill="#22263f" d="M0 415l136-55 81 56 91-89 96 111 104-82 89 64 97-71 126 103 106-92 74 66v134H0z"/>
<path fill="#141c31" d="M0 483l103-52 83 54 140-68 117 81 135-47 92 64 170-89 127 66 133-65v133H0z"/>
<g className="floating-citadel">
<ellipse cx="776" cy="414" rx="209" ry="24" fill="#b09cf6" opacity=".12"/>
<path d="M581 354l64 62 39 15 38 78 34-47 40 45 36-77 68-14 62-68-145-36z" fill="url(#stone)" stroke="#626087" strokeWidth="1"/>
<path d="M672 395l31 29 19 85 15-94M787 399l9 108 23-100M855 394l-23 36" fill="none" stroke="#656085" opacity=".5"/>
<path d="M568 351l78-36 180-18 145 52-85 52-205 2z" fill="#45435f" stroke="#787197"/>
<path d="M600 351l86-25 139-11 108 36-62 30H685z" fill="#22283f"/>
<path d="M640 349v-84l20-14 21 14v84M850 345v-93l21-15 19 16v92" fill="url(#spire)" stroke="#77708b"/>
<path d="M631 268l29-68 31 68zM842 254l29-74 27 74z" fill="#252c48" stroke="#77708b"/>
<path d="M684 353V222l28-20 29 20v131M799 353V208l26-19 26 19v144" fill="url(#spire)" stroke="#77708b"/>
<path d="M679 225l33-83 34 83zM794 211l31-79 31 79z" fill="#252c48" stroke="#77708b"/>
<path d="M724 355V156l41-30 42 30v199" fill="url(#spire)" stroke="#8a819c"/>
<path d="M714 159l51-116 52 116z" fill="#292f4e" stroke="#807b9a"/>
<path d="M765 43v-23" stroke="#c1b6e6"/><path d="M723 166l42-13 42 13M730 181l35-12 34 12" fill="none" stroke="#8c81a7"/>
<path d="M702 356v-62q63-99 126 0v62z" fill="#171e35" stroke="#9583b9" strokeWidth="3"/>
<path d="M727 356v-58q38-67 76 0v58" fill="url(#portal)"/>
<path d="M727 356v-58q38-67 76 0v58" fill="none" stroke="#b5a0ff" strokeWidth="6" filter="url(#glow)"/>
<path d="M765 270v86M744 283v73M785 283v73" stroke="#c5b5ff" opacity=".3"/>
{[653,706,757,820,870].map((x,i)=><path key={x} d={`M${x} ${i===2?193:283}v20h7v-20z`} fill="#c3a3f9" opacity=".8"/>)}
<path d="M738 357l-35 38h125l-35-38" fill="#676080" stroke="#9b87b2"/><path d="M729 368h73M720 378h91M712 387h108" stroke="#252a43"/>
<ellipse cx="769" cy="400" rx="207" ry="41" fill="none" stroke="#8b7de3" strokeDasharray="110 20 30 20" opacity=".4"/>
</g>
<path d="M0 556Q430 470 723 557" stroke="#a295d5" strokeWidth="2" fill="none" opacity=".15"/>
<path fill="#0b1424" d="M0 491l91-18 99 41 89-14 84 60H0zM949 560l51-118 49 34 51-50v134z"/>
</svg>}
export function Warden(){return <svg className="warden" viewBox="0 0 220 280" role="img" aria-label="IAM Warden in original violet armor"><defs><linearGradient id="armor"><stop stopColor="#656083"/><stop offset="1" stopColor="#202841"/></linearGradient></defs><ellipse cx="112" cy="258" rx="80" ry="14" fill="#a084f1" opacity=".25"/><path d="M88 179l-14 69 27 8 15-65 9 65 29-8-13-72" fill="#262e49" stroke="#9485b7"/><path d="M57 91L25 109l15 76 28-12 11-61M161 90l36 19-13 78-27-15-10-60" fill="url(#armor)" stroke="#a28abf"/><path d="M57 94l49-22 54 21-15 93-62 6z" fill="url(#armor)" stroke="#ab91cf" strokeWidth="2"/><path d="M95 49l-7-30 22 15 24-16-7 32 11 29-30 17-30-18z" fill="#343c5b" stroke="#ab91cf"/><path d="M92 58h31l-7 9h-16z" fill="#9bf4ff"/><path d="M112 111l17 25-17 26-18-26z" fill="#c7b0ff"/><path d="M22 133l13 94M17 154h30" stroke="#c7b0ff" strokeWidth="6"/><path d="M164 121l42 8-4 65-32 14-17-27z" fill="#313650" stroke="#bb9ee3" strokeWidth="3"/><path d="M179 142l12 15-10 22-10-19z" fill="#a994ee"/></svg>}
