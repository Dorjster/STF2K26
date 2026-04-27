import { useState, useEffect, useRef } from "react";

/* ═══════════════════════════════════════════ ICONS ═══ */
const Ic = {
  server:  p=><svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="4" width="18" height="6" rx="1.5"/><rect x="3" y="14" width="18" height="6" rx="1.5"/><circle cx="7" cy="7" r=".9" fill="currentColor"/><circle cx="7" cy="17" r=".9" fill="currentColor"/><line x1="11" y1="7" x2="17" y2="7"/><line x1="11" y1="17" x2="17" y2="17"/></svg>,
  desktop: p=><svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>,
  laptop:  p=><svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="4" width="18" height="12" rx="2"/><path d="M2 20h20"/></svg>,
  phone:   p=><svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="7" y="2" width="10" height="20" rx="2"/><circle cx="12" cy="17" r=".8" fill="currentColor"/></svg>,
  printer: p=><svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>,
  camera:  p=><svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>,
  switch:  p=><svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="2" y="7" width="20" height="10" rx="2"/><line x1="6" y1="12" x2="6" y2="12" strokeWidth="3"/><line x1="10" y1="12" x2="10" y2="12" strokeWidth="3"/><line x1="14" y1="12" x2="14" y2="12" strokeWidth="3"/><line x1="18" y1="12" x2="18" y2="12" strokeWidth="3"/></svg>,
  firewall:p=><svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M12 2L4 6v6c0 5 4 9.5 8 11 4-1.5 8-6 8-11V6z"/><path d="M9 12l2 2 4-4"/></svg>,
  storage: p=><svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>,
  cloud:   p=><svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>,
  backup:  p=><svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.98"/></svg>,
  mail:    p=><svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  web:     p=><svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  ad:      p=><svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  sdwan:   p=><svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>,
  tape:    p=><svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="2" y="5" width="20" height="14" rx="2"/><circle cx="8" cy="12" r="3"/><circle cx="16" cy="12" r="3"/><line x1="11" y1="12" x2="13" y2="12"/></svg>,
  iot:     p=><svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="9" y="9" width="6" height="6" rx="1"/><path d="M5.5 5.5A9.6 9.6 0 0 0 3 12a9.6 9.6 0 0 0 2.5 6.5"/><path d="M18.5 5.5A9.6 9.6 0 0 1 21 12a9.6 9.6 0 0 1-2.5 6.5"/><path d="M7.5 7.5A6.5 6.5 0 0 0 5.5 12a6.5 6.5 0 0 0 2 4.5"/><path d="M16.5 7.5A6.5 6.5 0 0 1 18.5 12a6.5 6.5 0 0 1-2 4.5"/></svg>,
  vm:      p=><svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="2" y="3" width="20" height="14" rx="2"/><rect x="5" y="6" width="6" height="5" rx="1"/><rect x="13" y="6" width="6" height="5" rx="1"/><line x1="7" y1="17" x2="17" y2="17"/><line x1="12" y1="17" x2="12" y2="21"/></svg>,
  close:   p=><svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  isp:     p=><svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M1.05 12A11 11 0 0 1 23 12"/><path d="M5 12A7 7 0 0 1 19 12"/><path d="M9 12a3 3 0 0 1 6 0"/><circle cx="12" cy="12" r="1" fill="currentColor"/></svg>,
  router:  p=><svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="2" y="9" width="20" height="8" rx="2"/><line x1="8" y1="9" x2="8" y2="7"/><line x1="12" y1="9" x2="12" y2="5"/><line x1="16" y1="9" x2="16" y2="7"/><circle cx="6" cy="13" r=".8" fill="currentColor"/><circle cx="10" cy="13" r=".8" fill="currentColor"/></svg>,
  activity:p=><svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
};

/* ═══════════════════════════════════════════ DATA ═══ */
const SITES = {
  hq:  {id:"hq",  label:"HQ",  sub:"Headquarters",      col:"#38bdf8", col2:"#6366f1", floors:6},
  dc1: {id:"dc1", label:"DC-1",sub:"Primary Data Center",col:"#f97316", col2:"#ef4444", floors:8},
  dc2: {id:"dc2", label:"DC-2",sub:"Secondary DC",       col:"#fb923c", col2:"#f97316", floors:7},
  dr1: {id:"dr1", label:"DR-1",sub:"Disaster Recovery 1",col:"#a855f7", col2:"#ec4899", floors:5},
  dr2: {id:"dr2", label:"DR-2",sub:"Disaster Recovery 2",col:"#8b5cf6", col2:"#a855f7", floors:4},
  b1:  {id:"b1",  label:"B1",  sub:"Branch Office 1",   col:"#10b981", col2:"#06b6d4", floors:3},
  b2:  {id:"b2",  label:"B2",  sub:"Branch Office 2",   col:"#10b981", col2:"#06b6d4", floors:3},
};

const ISPS = [
  {id:"isp1",label:"ISP-1",name:"MCS Telecom",    col:"#38bdf8", bw:"10G",  health:"good"},
  {id:"isp2",label:"ISP-2",name:"Mobicom Fiber",  col:"#10b981", bw:"10G",  health:"good"},
  {id:"isp3",label:"ISP-3",name:"Univision",       col:"#eab308", bw:"1G",   health:"warn"},
  {id:"isp4",label:"ISP-4",name:"Skytel Backup",  col:"#a855f7", bw:"1G",   health:"good"},
];

const SITE_DEVICES = {
  hq:[
    {id:"hq-pc1", label:"PC-001",  type:"desktop",ip:"10.1.1.10",os:"Windows 11"},
    {id:"hq-pc2", label:"PC-002",  type:"desktop",ip:"10.1.1.11",os:"Windows 11"},
    {id:"hq-lap1",label:"Laptop-A",type:"laptop", ip:"10.1.1.20",os:"macOS 14"},
    {id:"hq-lap2",label:"Laptop-B",type:"laptop", ip:"10.1.1.21",os:"Windows 11"},
    {id:"hq-mob1",label:"iPhone-1",type:"phone",  ip:"10.1.1.30",os:"iOS 17"},
    {id:"hq-mob2",label:"Android", type:"phone",  ip:"10.1.1.31",os:"Android 14"},
    {id:"hq-prt", label:"Printer", type:"printer",ip:"10.1.1.40",os:"Embedded"},
    {id:"hq-cam", label:"IP-Cam",  type:"camera", ip:"10.1.1.50",os:"IoT FW"},
    {id:"hq-iot", label:"IoT Hub", type:"iot",    ip:"10.1.1.60",os:"RTOS"},
  ],
  b1:[
    {id:"b1-pc1",label:"PC-101",  type:"desktop",ip:"10.2.1.10",os:"Windows 11"},
    {id:"b1-pc2",label:"PC-102",  type:"desktop",ip:"10.2.1.11",os:"Windows 10"},
    {id:"b1-lap",label:"Laptop-C",type:"laptop", ip:"10.2.1.20",os:"Windows 11"},
    {id:"b1-mob",label:"iPhone-2",type:"phone",  ip:"10.2.1.30",os:"iOS 17"},
    {id:"b1-prt",label:"Printer", type:"printer",ip:"10.2.1.40",os:"Embedded"},
  ],
  b2:[
    {id:"b2-pc1",label:"PC-201",  type:"desktop",ip:"10.3.1.10",os:"Windows 11"},
    {id:"b2-pc2",label:"PC-202",  type:"desktop",ip:"10.3.1.11",os:"Windows 11"},
    {id:"b2-lap",label:"Laptop-D",type:"laptop", ip:"10.3.1.20",os:"macOS 14"},
    {id:"b2-mob",label:"Android", type:"phone",  ip:"10.3.1.30",os:"Android 14"},
    {id:"b2-cam",label:"IP-Cam",  type:"camera", ip:"10.3.1.50",os:"IoT FW"},
  ],
};

const DC_LAYERS = {
  dc1:[
    {id:"sdwan1",label:"SD-WAN Edge",   icon:"sdwan",   col:"#38bdf8",x:50,y:9},
    {id:"fw1a",  label:"FW-01 Active",  icon:"firewall",col:"#ef4444",x:28,y:22},
    {id:"fw1b",  label:"FW-02 Standby", icon:"firewall",col:"#f97316",x:62,y:22},
    {id:"core1", label:"Core Switch L3",icon:"switch",  col:"#10b981",x:45,y:36},
    {id:"vm1",   label:"VMware Cluster",icon:"vm",      col:"#a855f7",x:14,y:52},
    {id:"mail1", label:"Mail Server",   icon:"mail",    col:"#06b6d4",x:34,y:52},
    {id:"web1",  label:"Web Server",    icon:"web",     col:"#38bdf8",x:55,y:52},
    {id:"ad1",   label:"Active Dir.",   icon:"ad",      col:"#f97316",x:76,y:52},
    {id:"veeam1",label:"Veeam B&R v12", icon:"backup",  col:"#10b981",x:22,y:70,badge:true},
    {id:"san1",  label:"SAN Storage",   icon:"storage", col:"#eab308",x:45,y:70},
    {id:"tape1", label:"Tape Library",  icon:"tape",    col:"#6366f1",x:70,y:70},
  ],
  dc2:[
    {id:"sdwan2",label:"SD-WAN Edge",   icon:"sdwan",   col:"#fb923c",x:50,y:9},
    {id:"fw2a",  label:"FW-01 Active",  icon:"firewall",col:"#ef4444",x:30,y:22},
    {id:"fw2b",  label:"FW-02 Standby", icon:"firewall",col:"#f97316",x:60,y:22},
    {id:"core2", label:"Core Switch",   icon:"switch",  col:"#10b981",x:45,y:36},
    {id:"vm2",   label:"VMware Cluster",icon:"vm",      col:"#a855f7",x:18,y:52},
    {id:"web2",  label:"Web Cluster",   icon:"web",     col:"#38bdf8",x:50,y:52},
    {id:"stor2", label:"SAN Storage",   icon:"storage", col:"#eab308",x:76,y:52},
    {id:"veem2", label:"Veeam Replica", icon:"backup",  col:"#10b981",x:38,y:70,badge:true},
    {id:"san2",  label:"DR Storage",    icon:"storage", col:"#eab308",x:64,y:70},
  ],
  dr1:[
    {id:"sdwan-dr1",label:"SD-WAN Edge",  icon:"sdwan",   col:"#a855f7",x:50,y:9},
    {id:"fw-dr1a",  label:"FW Cluster",   icon:"firewall",col:"#ef4444",x:35,y:22},
    {id:"sw-dr1",   label:"Core Switch",  icon:"switch",  col:"#10b981",x:50,y:36},
    {id:"vm-dr1",   label:"VMware DR",    icon:"vm",      col:"#a855f7",x:22,y:52},
    {id:"rep-dr1",  label:"Veeam Replica",icon:"backup",  col:"#10b981",x:50,y:52,badge:true},
    {id:"str-dr1",  label:"DR Storage",   icon:"storage", col:"#eab308",x:74,y:52},
  ],
  dr2:[
    {id:"sdwan-dr2",label:"SD-WAN Edge",  icon:"sdwan",   col:"#8b5cf6",x:50,y:9},
    {id:"fw-dr2",   label:"FW Cluster",   icon:"firewall",col:"#ef4444",x:35,y:22},
    {id:"sw-dr2",   label:"Core Switch",  icon:"switch",  col:"#10b981",x:50,y:36},
    {id:"vm-dr2",   label:"VMware DR2",   icon:"vm",      col:"#8b5cf6",x:25,y:52},
    {id:"str-dr2",  label:"Cold Storage", icon:"storage", col:"#eab308",x:65,y:52},
  ],
};

function getHops(site){
  if(site==="b1"||site==="b2") return [
    {label:"Access Switch", icon:"switch",  col:"#10b981",ms:0},
    {label:"Core Switch",   icon:"switch",  col:"#06b6d4",ms:130},
    {label:"SD-WAN Edge",   icon:"sdwan",   col:"#38bdf8",ms:270},
    {label:"ISP x4",        icon:"isp",     col:"#a855f7",ms:400},
    {label:"iNET Fabric",   icon:"cloud",   col:"#6366f1",ms:540},
    {label:"DC-1 Firewall", icon:"firewall",col:"#ef4444",ms:680},
    {label:"DC-1 Core",     icon:"switch",  col:"#f97316",ms:800},
  ];
  return [
    {label:"Access Switch", icon:"switch",  col:"#38bdf8",ms:0},
    {label:"Core Switch",   icon:"switch",  col:"#38bdf8",ms:130},
    {label:"Firewall",      icon:"firewall",col:"#ef4444",ms:270},
    {label:"SD-WAN Edge",   icon:"sdwan",   col:"#06b6d4",ms:400},
    {label:"ISP x4",        icon:"isp",     col:"#a855f7",ms:530},
    {label:"iNET / Cloud",  icon:"cloud",   col:"#6366f1",ms:660},
  ];
}

/* ═══════════════════════════════════════════ BUILDING ═══ */
function Building({site,onClick,isActive,hovered,onHover}){
  const s=SITES[site];
  const W=s.floors>=6?86:s.floors>=5?72:60;
  const H=s.floors*17+20;
  const total=H+50;
  return(
    <div onClick={onClick}
      onMouseEnter={()=>onHover(site)}
      onMouseLeave={()=>onHover(null)}
      style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6,cursor:"pointer",userSelect:"none",
        transition:"transform 0.2s",transform:hovered||isActive?"translateY(-6px) scale(1.04)":"scale(1)"}}>
      <div style={{position:"relative",
        filter:isActive?`drop-shadow(0 0 22px ${s.col}) drop-shadow(0 0 8px ${s.col})`:
               hovered?`drop-shadow(0 0 12px ${s.col}88)`:`drop-shadow(0 0 4px ${s.col}30)`,
        transition:"filter 0.3s"}}>
        <svg width={W} height={total} viewBox={`0 0 ${W} ${total}`} style={{overflow:"visible"}}>
          <defs>
            <linearGradient id={`gf-${site}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={s.col} stopOpacity={isActive?"0.3":"0.12"}/>
              <stop offset="100%" stopColor={s.col2} stopOpacity={isActive?"0.12":"0.04"}/>
            </linearGradient>
            <linearGradient id={`gb-${site}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={s.col}/>
              <stop offset="100%" stopColor={s.col2} stopOpacity="0.7"/>
            </linearGradient>
            <filter id={`glow-${site}`}><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          </defs>
          {/* Ground shadow */}
          <ellipse cx={W/2} cy={total-6} rx={W*0.45} ry={5} fill={s.col} opacity="0.14"/>
          {/* Body fill */}
          <rect x="3" y="18" width={W-6} height={H-20} rx="3" fill={`url(#gf-${site})`}/>
          {/* Body border */}
          <rect x="3" y="18" width={W-6} height={H-20} rx="3" fill="none"
            stroke={isActive||hovered?s.col:`${s.col}60`} strokeWidth={isActive?"2":hovered?"1.5":"1"}
            filter={`url(#glow-${site})`}/>
          {/* Vertical structure lines */}
          <line x1={W*0.33} y1="18" x2={W*0.33} y2={H-2} stroke={s.col} strokeWidth="0.4" opacity="0.2"/>
          <line x1={W*0.67} y1="18" x2={W*0.67} y2={H-2} stroke={s.col} strokeWidth="0.4" opacity="0.2"/>
          {/* Floor lines */}
          {Array.from({length:s.floors-1}).map((_,i)=>(
            <line key={i} x1="3" y1={H-((i+1)*17)} x2={W-3} y2={H-((i+1)*17)}
              stroke={s.col} strokeWidth="0.5" opacity="0.25"/>
          ))}
          {/* Windows */}
          {Array.from({length:s.floors}).map((_,fi)=>
            [8, W/2-6, W-20].map((wx,wi)=>{
              const lit=Math.sin(fi*5+wi*11+site.charCodeAt(0)*3)>-0.3;
              const amber=fi===s.floors-1;
              return <rect key={`${fi}-${wi}`} x={wx} y={H-((fi+1)*17)+5}
                width="10" height="8" rx="1.5"
                fill={lit?(amber?"#fbbf24":s.col):"transparent"}
                stroke={s.col} strokeWidth="0.5"
                opacity={lit?(amber?0.9:0.7):0.2}>
                {lit&&wi===1&&fi%3===0&&<animate attributeName="opacity" values="0.7;0.2;0.7" dur={`${2+fi*0.4}s`} repeatCount="indefinite"/>}
              </rect>;
            })
          )}
          {/* Antenna */}
          {s.floors>=4&&<>
            <line x1={W/2} y1="18" x2={W/2} y2="2" stroke={s.col} strokeWidth="1.5" opacity="0.9"/>
            <line x1={W/2-10} y1="8" x2={W/2} y2="6" stroke={s.col} strokeWidth="0.8" opacity="0.5"/>
            <line x1={W/2+10} y1="8" x2={W/2} y2="6" stroke={s.col} strokeWidth="0.8" opacity="0.5"/>
            <circle cx={W/2} cy="1.5" r="4" fill={s.col} filter={`url(#glow-${site})`}>
              <animate attributeName="opacity" values="1;0.1;1" dur="2s" repeatCount="indefinite"/>
            </circle>
          </>}
          {/* Selection ring */}
          {isActive&&<rect x="0" y="14" width={W} height={H-12} rx="5" fill={s.col} opacity="0.05"/>}
          {(isActive||hovered)&&<rect x="0" y="14" width={W} height={H-12} rx="5"
            fill="none" stroke={s.col} strokeWidth="1.5" strokeDasharray="5,3" opacity="0.8">
            <animate attributeName="stroke-dashoffset" from="8" to="0" dur="0.5s" repeatCount="indefinite"/>
          </rect>}
          {/* Banner */}
          <rect x="3" y={H-2} width={W-6} height={22} rx="0 0 3 3" fill={`url(#gb-${site})`} opacity="0.92"/>
          <text x={W/2} y={H+13} textAnchor="middle" fontSize="7.5" fontWeight="900"
            fill="#fff" fontFamily="'JetBrains Mono',monospace" letterSpacing="0.18em">{s.label}</text>
        </svg>
      </div>
      <div style={{
        fontSize:10,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.12em",
        color:isActive||hovered?s.col:`${s.col}70`,
        textShadow:isActive||hovered?`0 0 10px ${s.col}`:"none",
        fontFamily:"'JetBrains Mono',monospace",textAlign:"center",
        transition:"all 0.2s",maxWidth:100,lineHeight:1.3,
      }}>{s.sub}</div>
    </div>
  );
}

/* ═══════════════════════════════════════════ ISP NODE ═══ */
function IspNode({isp}){
  return(
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
      <div style={{
        width:52,height:52,borderRadius:14,
        background:`linear-gradient(135deg,${isp.col}25,${isp.col}0a)`,
        border:`1.5px solid ${isp.col}55`,
        display:"grid",placeItems:"center",
        boxShadow:`0 0 14px ${isp.col}30, inset 0 0 10px ${isp.col}08`,
        position:"relative",
      }}>
        <Ic.isp style={{width:22,height:22,color:isp.col}}/>
        <div style={{
          position:"absolute",top:-5,right:-5,
          width:14,height:14,borderRadius:"50%",
          background:isp.health==="good"?"#10b981":"#eab308",
          border:"2px solid #020b18",
          boxShadow:`0 0 8px ${isp.health==="good"?"#10b981":"#eab308"}`,
          animation:"blink 2s infinite",
        }}/>
      </div>
      <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,fontWeight:700,
        color:isp.col,letterSpacing:"0.1em",textTransform:"uppercase"}}>{isp.label}</div>
      <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:7,color:"#2a5a7a",
        letterSpacing:"0.06em"}}>{isp.bw}</div>
    </div>
  );
}

/* ═══════════════════════════════════════════ OVERVIEW MAP ═══ */
function OverviewMap({activeSite,onSiteClick}){
  const [hov,setHov]=useState(null);

  // Node positions (% of 1100×620 viewBox)
  const POS={
    hq: {x:8,  y:32},
    b1: {x:8,  y:62},
    b2: {x:38, y:75},
    dc1:{x:74, y:22},
    dc2:{x:88, y:38},
    dr1:{x:74, y:62},
    dr2:{x:88, y:75},
  };
  const INET={x:50,y:46};

  const links=[
    {from:"hq", col:"#38bdf8",bw:"10G",  dur:"1.6s",width:2.5},
    {from:"dc1",col:"#f97316",bw:"10G",  dur:"1.4s",width:2.5},
    {from:"dc2",col:"#fb923c",bw:"10G",  dur:"1.5s",width:2},
    {from:"dr1",col:"#a855f7",bw:"1G",   dur:"2s",  width:1.5},
    {from:"dr2",col:"#8b5cf6",bw:"1G",   dur:"2.2s",width:1.5},
    {from:"b1", col:"#10b981",bw:"1G",   dur:"2.1s",width:1.5},
    {from:"b2", col:"#06b6d4",bw:"500M", dur:"2.4s",width:1.2},
  ];

  return(
    <div style={{position:"relative",width:"100%",height:580}}>
      <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none"}}
        viewBox="0 0 1100 580" preserveAspectRatio="xMidYMid meet">
        <defs>
          <radialGradient id="inetGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.18"/>
            <stop offset="60%" stopColor="#6366f1" stopOpacity="0.08"/>
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0"/>
          </radialGradient>
          <filter id="glow-svg"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          <filter id="glow-sm"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          {/* ISP ring gradient */}
          <radialGradient id="ispRing" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.12"/>
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0"/>
          </radialGradient>
        </defs>

        {/* Background grid dots */}
        <pattern id="dots" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
          <circle cx="15" cy="15" r="0.8" fill="#0a2a4a" opacity="0.7"/>
        </pattern>
        <rect width="1100" height="580" fill="url(#dots)"/>

        {/* iNET ambient glow */}
        <circle cx="550" cy="267" r="110" fill="url(#inetGrad)"/>

        {/* iNET rings */}
        <circle cx="550" cy="267" r="60" fill="rgba(2,14,32,0.95)" stroke="#0f3a60" strokeWidth="1"/>
        <circle cx="550" cy="267" r="72" fill="none" stroke="#38bdf8" strokeWidth="0.6" strokeDasharray="5,8" opacity="0.45">
          <animateTransform attributeName="transform" type="rotate" from="0 550 267" to="360 550 267" dur="18s" repeatCount="indefinite"/>
        </circle>
        <circle cx="550" cy="267" r="85" fill="none" stroke="#6366f1" strokeWidth="0.4" strokeDasharray="3,10" opacity="0.25">
          <animateTransform attributeName="transform" type="rotate" from="360 550 267" to="0 550 267" dur="28s" repeatCount="indefinite"/>
        </circle>
        <circle cx="550" cy="267" r="98" fill="none" stroke="#a855f7" strokeWidth="0.3" strokeDasharray="2,14" opacity="0.15">
          <animateTransform attributeName="transform" type="rotate" from="0 550 267" to="360 550 267" dur="40s" repeatCount="indefinite"/>
        </circle>
        <text x="550" y="262" textAnchor="middle" fontSize="13" fill="#38bdf8"
          fontFamily="'JetBrains Mono',monospace" fontWeight="800" letterSpacing="0.2em" filter="url(#glow-sm)">iNET</text>
        <text x="550" y="278" textAnchor="middle" fontSize="8" fill="#2a5a8a"
          fontFamily="'JetBrains Mono',monospace" letterSpacing="0.25em">SD-WAN FABRIC</text>

        {/* ISP cloud above iNET */}
        <circle cx="550" cy="110" r="44" fill="rgba(2,14,32,0.9)" stroke="#1a3a60" strokeWidth="1"/>
        <circle cx="550" cy="110" r="55" fill="url(#ispRing)"/>
        <circle cx="550" cy="110" r="54" fill="none" stroke="#a855f7" strokeWidth="0.5" strokeDasharray="4,6" opacity="0.35">
          <animateTransform attributeName="transform" type="rotate" from="0 550 110" to="360 550 110" dur="12s" repeatCount="indefinite"/>
        </circle>
        <text x="550" y="105" textAnchor="middle" fontSize="10" fill="#a855f7"
          fontFamily="'JetBrains Mono',monospace" fontWeight="800" letterSpacing="0.15em" filter="url(#glow-sm)">4 × ISP</text>
        <text x="550" y="119" textAnchor="middle" fontSize="7.5" fill="#3a4a6a"
          fontFamily="'JetBrains Mono',monospace" letterSpacing="0.2em">MULTI-HOMED</text>

        {/* ISP → iNET vertical trunk — thick glowing */}
        <line x1="550" y1="154" x2="550" y2="207" stroke="#a855f7" strokeWidth="3" opacity="0.15"/>
        <line x1="550" y1="154" x2="550" y2="207" stroke="#a855f7" strokeWidth="1.5" strokeDasharray="6,3" opacity="0.7" filter="url(#glow-sm)">
          <animate attributeName="stroke-dashoffset" from="9" to="0" dur="0.6s" repeatCount="indefinite"/>
        </line>
        {[0,0.4,0.8].map(o=>(
          <circle key={o} r="4" fill="#a855f7" filter="url(#glow-sm)">
            <animateMotion dur="0.8s" repeatCount="indefinite" begin={`-${0.8*o}s`}><mpath href="#trunk"/></animateMotion>
          </circle>
        ))}
        <path id="trunk" d="M550,154 L550,207" fill="none"/>

        {/* ISP individual lines */}
        {ISPS.map((isp,i)=>{
          const angles=[-55,-20,20,55];
          const a=angles[i]*Math.PI/180;
          const ex=550+62*Math.sin(a), ey=110-62*Math.cos(a);
          const ix=550+44*Math.sin(a), iy=110-44*Math.cos(a);
          return(
            <g key={isp.id}>
              <line x1={ix} y1={iy} x2={ex} y2={ey} stroke={isp.col} strokeWidth="2" opacity="0.1"/>
              <line x1={ix} y1={iy} x2={ex} y2={ey} stroke={isp.col} strokeWidth="1.5"
                strokeDasharray="4,3" opacity="0.6" filter="url(#glow-sm)">
                <animate attributeName="stroke-dashoffset" from="7" to="0" dur={`${0.5+i*0.1}s`} repeatCount="indefinite"/>
              </line>
            </g>
          );
        })}

        {/* Site ↔ iNET links */}
        {links.map(l=>{
          const p=POS[l.from];
          const x1=p.x/100*1100, y1=p.y/100*580;
          const x2=550, y2=267;
          const cx=(x1+x2)/2, cy=(y1+y2)/2-(Math.abs(x1-x2)*0.18);
          const isHov=hov===l.from||activeSite===l.from;
          return(
            <g key={l.from}>
              {/* Thick glow underlay */}
              <path d={`M${x1},${y1} Q${cx},${cy} ${x2},${y2}`} fill="none"
                stroke={l.col} strokeWidth={l.width*3} opacity={isHov?"0.18":"0.08"}
                style={{transition:"opacity 0.3s"}}/>
              {/* Main line */}
              <path d={`M${x1},${y1} Q${cx},${cy} ${x2},${y2}`} fill="none"
                stroke={l.col} strokeWidth={isHov?l.width*1.6:l.width}
                strokeDasharray="8,5" opacity={isHov?"0.95":"0.55"}
                filter={isHov?"url(#glow-sm)":"none"}
                style={{transition:"all 0.3s"}}>
                <animate attributeName="stroke-dashoffset" from="13" to="0" dur={l.dur} repeatCount="indefinite"/>
              </path>
              {/* Packet 1 */}
              <circle r={isHov?6:4.5} fill={l.col} filter="url(#glow-sm)" opacity={isHov?1:0.8}>
                <animateMotion dur={l.dur} repeatCount="indefinite">
                  <mpath href={`#lp-${l.from}`}/>
                </animateMotion>
              </circle>
              {/* Packet 2 */}
              <circle r={isHov?4:3} fill={l.col} opacity={isHov?0.6:0.4}>
                <animateMotion dur={l.dur} repeatCount="indefinite" begin={`-${parseFloat(l.dur)/2}s`}>
                  <mpath href={`#lp-${l.from}`}/>
                </animateMotion>
              </circle>
              <path id={`lp-${l.from}`} d={`M${x1},${y1} Q${cx},${cy} ${x2},${y2}`} fill="none"/>
              {/* BW label */}
              {isHov&&<>
                <rect x={cx-16} y={cy-20} width={32} height={16} rx="4"
                  fill={`${l.col}22`} stroke={`${l.col}88`} strokeWidth="0.8"/>
                <text x={cx} y={cy-9} textAnchor="middle" fontSize="9" fill={l.col}
                  fontFamily="'JetBrains Mono',monospace" fontWeight="700">{l.bw}</text>
              </>}
            </g>
          );
        })}

        {/* DC1 ↔ DC2 replication */}
        {[["dc1","dc2","#f97316"],["dr1","dr2","#8b5cf6"],["dc1","dr1","#a855f7"],["dc2","dr2","#6366f1"]].map(([a,b,col],i)=>{
          const pa=POS[a],pb=POS[b];
          const x1=pa.x/100*1100,y1=pa.y/100*580,x2=pb.x/100*1100,y2=pb.y/100*580;
          return(
            <g key={i}>
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={col} strokeWidth="3" opacity="0.07"/>
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={col} strokeWidth="1.5"
                strokeDasharray="5,4" opacity="0.5" filter="url(#glow-sm)"/>
              <circle r="3.5" fill={col} opacity="0.85" filter="url(#glow-sm)">
                <animateMotion dur={`${1.2+i*0.2}s`} repeatCount="indefinite">
                  <mpath href={`#repl-${i}`}/>
                </animateMotion>
              </circle>
              <circle r="3.5" fill={col} opacity="0.5">
                <animateMotion dur={`${1.2+i*0.2}s`} repeatCount="indefinite" begin={`-${(1.2+i*0.2)/2}s`}>
                  <mpath href={`#repl-${i}`}/>
                </animateMotion>
              </circle>
              <path id={`repl-${i}`} d={`M${x1},${y1} L${x2},${y2}`} fill="none"/>
            </g>
          );
        })}
      </svg>

      {/* ISP nodes top center */}
      <div style={{position:"absolute",left:"50%",top:"5%",transform:"translateX(-50%)",
        display:"flex",gap:28,zIndex:5}}>
        {ISPS.map(isp=><IspNode key={isp.id} isp={isp}/>)}
      </div>

      {/* Building nodes */}
      <div style={{position:"absolute",left:"4%", top:"18%",zIndex:5}}><Building site="hq" onClick={()=>onSiteClick("hq")} isActive={activeSite==="hq"} hovered={hov==="hq"} onHover={setHov}/></div>
      <div style={{position:"absolute",left:"4%", top:"53%",zIndex:5}}><Building site="b1" onClick={()=>onSiteClick("b1")} isActive={activeSite==="b1"} hovered={hov==="b1"} onHover={setHov}/></div>
      <div style={{position:"absolute",left:"34%",top:"65%",zIndex:5}}><Building site="b2" onClick={()=>onSiteClick("b2")} isActive={activeSite==="b2"} hovered={hov==="b2"} onHover={setHov}/></div>
      <div style={{position:"absolute",right:"18%",top:"10%",zIndex:5}}><Building site="dc1" onClick={()=>onSiteClick("dc1")} isActive={activeSite==="dc1"} hovered={hov==="dc1"} onHover={setHov}/></div>
      <div style={{position:"absolute",right:"4%", top:"26%",zIndex:5}}><Building site="dc2" onClick={()=>onSiteClick("dc2")} isActive={activeSite==="dc2"} hovered={hov==="dc2"} onHover={setHov}/></div>
      <div style={{position:"absolute",right:"18%",top:"54%",zIndex:5}}><Building site="dr1" onClick={()=>onSiteClick("dr1")} isActive={activeSite==="dr1"} hovered={hov==="dr1"} onHover={setHov}/></div>
      <div style={{position:"absolute",right:"4%", top:"66%",zIndex:5}}><Building site="dr2" onClick={()=>onSiteClick("dr2")} isActive={activeSite==="dr2"} hovered={hov==="dr2"} onHover={setHov}/></div>
    </div>
  );
}

/* ═══════════════════════════════════════════ TOPOLOGY VIEW ═══ */
function TopoView({site}){
  const nodes=DC_LAYERS[site]||[];
  const s=SITES[site];
  if(!nodes.length) return null;
  return(
    <div style={{animation:"fadeIn 0.4s ease"}}>
      <div style={{fontSize:9.5,fontFamily:"'JetBrains Mono',monospace",letterSpacing:"0.22em",
        color:"#2a5a7a",textTransform:"uppercase",fontWeight:700,marginBottom:14,
        display:"flex",alignItems:"center",gap:8}}>
        <div style={{width:6,height:6,borderRadius:"50%",background:s.col,
          boxShadow:`0 0 8px ${s.col}`,animation:"blink 1.5s infinite"}}/>
        {s.sub} · Internal Architecture
      </div>
      <div style={{position:"relative",height:340,borderRadius:14,overflow:"hidden",
        background:"linear-gradient(180deg,rgba(2,10,24,0.95),rgba(2,14,32,0.98))",
        border:"1px solid #0a2a4a"}}>
        <div style={{position:"absolute",inset:0,
          backgroundImage:"radial-gradient(circle,rgba(56,189,248,0.06) 1px,transparent 1px)",
          backgroundSize:"22px 22px",pointerEvents:"none"}}/>
        <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none"}}>
          <line x1="50%" y1="9%" x2="28%" y2="23%" stroke="#0a2a4a" strokeWidth="1.5" strokeDasharray="4,3"/>
          <line x1="50%" y1="9%" x2="62%" y2="23%" stroke="#0a2a4a" strokeWidth="1.5" strokeDasharray="4,3"/>
          <line x1="28%" y1="26%" x2="45%" y2="38%" stroke="#061428" strokeWidth="1.5" strokeDasharray="4,3"/>
          <line x1="62%" y1="26%" x2="45%" y2="38%" stroke="#061428" strokeWidth="1.5" strokeDasharray="4,3"/>
          {[14,34,55,76].map((x,i)=><line key={i} x1="45%" y1="40%" x2={`${x}%`} y2="54%" stroke="#061428" strokeWidth="1" strokeDasharray="3,4"/>)}
          {[22,45,70].map((x,i)=><line key={i} x1={`${[14,34,76][i]||45}%`} y1="58%" x2={`${x}%`} y2="72%" stroke="#041020" strokeWidth="1" strokeDasharray="3,4"/>)}
        </svg>
        {nodes.map(node=>{
          const NI=Ic[node.icon]||Ic.server;
          return(
            <div key={node.id} style={{position:"absolute",left:`${node.x}%`,top:`${node.y}%`,
              transform:"translate(-50%,-50%)",
              display:"flex",flexDirection:"column",alignItems:"center",gap:4,zIndex:2}}>
              <div style={{width:52,height:52,borderRadius:13,
                background:`linear-gradient(135deg,${node.col}20,${node.col}08)`,
                border:`1.5px solid ${node.col}44`,
                display:"grid",placeItems:"center",position:"relative",
                boxShadow:`0 0 14px ${node.col}20`,transition:"all 0.2s",cursor:"default"}}
                onMouseEnter={e=>{e.currentTarget.style.background=`linear-gradient(135deg,${node.col}44,${node.col}18)`;e.currentTarget.style.borderColor=node.col;e.currentTarget.style.boxShadow=`0 0 28px ${node.col}66`;e.currentTarget.style.transform="scale(1.14)";}}
                onMouseLeave={e=>{e.currentTarget.style.background=`linear-gradient(135deg,${node.col}20,${node.col}08)`;e.currentTarget.style.borderColor=`${node.col}44`;e.currentTarget.style.boxShadow=`0 0 14px ${node.col}20`;e.currentTarget.style.transform="scale(1)";}}>
                <NI style={{width:22,height:22,color:node.col}}/>
                {node.badge&&<div style={{position:"absolute",top:-5,right:-5,width:12,height:12,
                  borderRadius:"50%",background:"#10b981",border:"2px solid #020b18",
                  boxShadow:"0 0 8px #10b981",animation:"blink 1.5s infinite"}}/>}
              </div>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:7.5,fontWeight:700,
                color:node.col,textAlign:"center",maxWidth:74,lineHeight:1.3,
                letterSpacing:"0.06em",textShadow:`0 0 6px ${node.col}55`}}>{node.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════ DEVICE NODE ═══ */
function DeviceNode({device,onClick,isActive,col}){
  const I=Ic[device.type]||Ic.desktop;
  return(
    <div onClick={onClick} style={{display:"flex",flexDirection:"column",alignItems:"center",
      gap:5,cursor:"pointer",width:82,transition:"transform 0.2s",
      transform:isActive?"translateY(-4px)":"none"}}>
      <div style={{width:66,height:66,borderRadius:14,position:"relative",
        background:isActive?`linear-gradient(135deg,${col}35,${col}15)`:"rgba(4,14,32,0.8)",
        border:`1.5px solid ${isActive?col:`${col}28`}`,
        display:"grid",placeItems:"center",
        boxShadow:isActive?`0 0 24px ${col}55,inset 0 0 16px ${col}12`:"none",
        transition:"all 0.25s"}}>
        <I style={{width:28,height:28,color:isActive?col:"#2a5a7a",transition:"color 0.2s"}}/>
        {isActive&&<>
          <div style={{position:"absolute",inset:-5,borderRadius:19,
            border:`1px solid ${col}`,animation:"dPulse 1.3s ease-out infinite",pointerEvents:"none"}}/>
          <div style={{position:"absolute",top:4,right:4,width:7,height:7,
            borderRadius:"50%",background:col,boxShadow:`0 0 6px ${col}`,animation:"blink 1s infinite"}}/>
        </>}
      </div>
      <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8.5,fontWeight:700,
        color:isActive?col:"#2a5a7a",letterSpacing:"0.08em",textAlign:"center",
        textShadow:isActive?`0 0 6px ${col}`:"",transition:"all 0.2s"}}>{device.label}</div>
    </div>
  );
}

/* ═══════════════════════════════════════════ TRAFFIC FLOW ═══ */
function TrafficFlow({device,site,onClose}){
  const [step,setStep]=useState(-1);
  const hops=getHops(site);
  const s=SITES[site];
  const DI=Ic[device.type]||Ic.desktop;
  useEffect(()=>{
    setStep(-1);
    const t=hops.map((h,i)=>setTimeout(()=>setStep(i),h.ms+300));
    return()=>t.forEach(clearTimeout);
  },[device.id]);
  return(
    <div style={{marginTop:20,borderRadius:14,padding:22,animation:"fsu 0.3s ease",
      background:"rgba(2,10,24,0.97)",border:"1px solid #0f3a60",
      boxShadow:"0 0 60px rgba(56,189,248,0.06),0 20px 40px rgba(0,0,0,0.4)"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{width:40,height:40,borderRadius:11,
            background:`linear-gradient(135deg,${s.col}44,${s.col2}22)`,
            border:`1.5px solid ${s.col}88`,display:"grid",placeItems:"center",
            boxShadow:`0 0 16px ${s.col}44`}}>
            <DI style={{width:19,height:19,color:s.col}}/>
          </div>
          <div>
            <div style={{fontSize:15,fontWeight:700,color:"#c8e8ff",letterSpacing:"0.04em"}}>{device.label} — Network Traffic Path</div>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9.5,color:"#2a5a7a",marginTop:2}}>
              IP: {device.ip} · OS: {device.os} · VLAN: 10
            </div>
          </div>
        </div>
        <button onClick={onClose} style={{width:32,height:32,borderRadius:8,
          border:"1px solid #0f3a60",background:"rgba(2,14,32,0.8)",cursor:"pointer",
          display:"grid",placeItems:"center",transition:"all 0.2s"}}
          onMouseEnter={e=>{e.currentTarget.style.borderColor="#38bdf8";e.currentTarget.style.background="rgba(56,189,248,0.1)";}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor="#0f3a60";e.currentTarget.style.background="rgba(2,14,32,0.8)";}}>
          <Ic.close style={{width:14,height:14,color:"#2a5a7a"}}/>
        </button>
      </div>
      <div style={{display:"flex",alignItems:"center",overflowX:"auto",paddingBottom:8,gap:0}}>
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:5,flexShrink:0}}>
          <div style={{width:56,height:56,borderRadius:14,
            background:`linear-gradient(135deg,${s.col}44,${s.col2}22)`,
            border:`1.5px solid ${s.col}`,display:"grid",placeItems:"center",color:s.col,
            boxShadow:`0 0 20px ${s.col}55`}}>
            <DI style={{width:25,height:25}}/>
          </div>
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:s.col,fontWeight:700,letterSpacing:"0.08em"}}>{device.label}</div>
        </div>
        {hops.map((hop,i)=>{
          const HI=Ic[hop.icon]||Ic.server;
          const on=step>=i;
          return(
            <div key={i} style={{display:"flex",alignItems:"center",flexShrink:0}}>
              <div style={{position:"relative",width:52,height:2,margin:"0 2px",marginBottom:26}}>
                <div style={{height:2,background:on?`linear-gradient(90deg,${hop.col}66,${hop.col})`:"#0a1a2a",
                  transition:"background 0.5s",width:"100%",borderRadius:1}}/>
                <div style={{position:"absolute",left:0,top:-2,right:0,height:6,
                  background:on?`linear-gradient(90deg,transparent,${hop.col}44,transparent)`:"transparent",
                  transition:"background 0.5s",filter:on?"blur(2px)":"none"}}/>
                {on&&<div style={{position:"absolute",top:-3,left:0,width:8,height:8,borderRadius:"50%",
                  background:hop.col,boxShadow:`0 0 10px ${hop.col}`,animation:"pkt 1s linear infinite"}}/>}
                <div style={{position:"absolute",right:-1,top:-6,
                  borderLeft:`9px solid ${on?hop.col:"#0a1a2a"}`,
                  borderTop:"7px solid transparent",borderBottom:"7px solid transparent",
                  transition:"border-color 0.5s"}}/>
              </div>
              <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4,flexShrink:0,
                opacity:on?1:0.15,transform:on?"translateY(0)":"translateY(8px)",transition:"all 0.5s ease"}}>
                <div style={{width:56,height:56,borderRadius:14,
                  background:on?`linear-gradient(135deg,${hop.col}44,${hop.col}18)`:"rgba(4,14,28,0.5)",
                  border:`1.5px solid ${on?hop.col:"#0a1a2a"}`,
                  display:"grid",placeItems:"center",color:on?hop.col:"#1a3a5a",
                  boxShadow:on?`0 0 22px ${hop.col}55`:"none",transition:"all 0.5s ease"}}>
                  <HI style={{width:25,height:25}}/>
                </div>
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,fontWeight:700,
                  color:on?hop.col:"#1a3a5a",textAlign:"center",maxWidth:74,lineHeight:1.3,
                  letterSpacing:"0.06em",transition:"color 0.4s"}}>{hop.label}</div>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{display:"flex",gap:8,marginTop:18}}>
        {[
          {label:"LATENCY",    val:site==="dc1"||site==="dc2"?"3ms":"18ms", col:"#38bdf8"},
          {label:"THROUGHPUT", val:"847 Mbps",   col:"#10b981"},
          {label:"PKT LOSS",   val:"0.02%",      col:"#f97316"},
          {label:"PROTOCOL",   val:"TLS 1.3",    col:"#a855f7"},
          {label:"ISPs ACTIVE",val:"4 / 4",      col:"#eab308"},
        ].map((st,i)=>(
          <div key={i} style={{flex:1,padding:"11px 8px",borderRadius:10,
            background:"rgba(2,10,22,0.9)",border:`1px solid ${st.col}25`,textAlign:"center",
            boxShadow:`inset 0 0 14px ${st.col}06`,position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",top:0,left:0,right:0,height:"1px",
              background:`linear-gradient(90deg,transparent,${st.col}88,transparent)`}}/>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:15,fontWeight:800,
              color:st.col,textShadow:`0 0 10px ${st.col}`}}>{st.val}</div>
            <div style={{fontSize:8,letterSpacing:"0.14em",color:"#2a5a7a",marginTop:4,
              fontFamily:"'JetBrains Mono',monospace",fontWeight:700}}>{st.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════ SITE PANEL ═══ */
function SitePanel({site}){
  const [active,setActive]=useState(null);
  const s=SITES[site];
  const devices=SITE_DEVICES[site]||[];
  return(
    <div style={{animation:"fadeIn 0.4s ease"}}>
      <div style={{fontSize:9.5,fontFamily:"'JetBrains Mono',monospace",letterSpacing:"0.22em",
        color:"#2a5a7a",textTransform:"uppercase",fontWeight:700,marginBottom:16,
        display:"flex",alignItems:"center",gap:8}}>
        <div style={{width:6,height:6,borderRadius:"50%",background:s.col,
          boxShadow:`0 0 8px ${s.col}`,animation:"blink 1.5s infinite"}}/>
        {s.sub} · Select device to trace traffic path
      </div>
      <div style={{display:"flex",flexWrap:"wrap",gap:14}}>
        {devices.map(d=>(
          <DeviceNode key={d.id} device={d} col={s.col}
            isActive={active?.id===d.id}
            onClick={()=>setActive(active?.id===d.id?null:d)}/>
        ))}
      </div>
      {active&&<TrafficFlow device={active} site={site} onClose={()=>setActive(null)}/>}
    </div>
  );
}

/* ═══════════════════════════════════════════ MAIN APP ═══ */
export default function App(){
  const [site,setSite]=useState(null);
  const [clock,setClock]=useState(new Date());
  const [tick,setTick]=useState(0);

  useEffect(()=>{
    const id=setInterval(()=>{setClock(new Date());setTick(t=>t+1);},1000);
    return()=>clearInterval(id);
  },[]);

  const s=site?SITES[site]:null;
  const isTopo=site&&["dc1","dc2","dr1","dr2"].includes(site);
  const isDevs=site&&["hq","b1","b2"].includes(site);

  const navItems=[
    {id:"hq", label:"HQ"},
    {id:"dc1",label:"DC-1"},
    {id:"dc2",label:"DC-2"},
    {id:"dr1",label:"DR-1"},
    {id:"dr2",label:"DR-2"},
    {id:"b1", label:"B1"},
    {id:"b2", label:"B2"},
  ];

  return(
    <div style={{minHeight:"100vh",background:"#020b18",color:"#c8e8ff",
      fontFamily:"'Rajdhani','Plus Jakarta Sans',system-ui,sans-serif"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700;800&family=Orbitron:wght@700;900&family=Rajdhani:wght@400;500;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        html,body,#root{width:100%;min-height:100vh;background:#020b18}
        ::-webkit-scrollbar{width:4px;height:4px}
        ::-webkit-scrollbar-track{background:#020b18}
        ::-webkit-scrollbar-thumb{background:#0f3a60;border-radius:2px}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:.15}}
        @keyframes dPulse{0%{transform:scale(1);opacity:.55}100%{transform:scale(1.6);opacity:0}}
        @keyframes fsu{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes pkt{0%{left:0}100%{left:calc(100% - 8px)}}
        @keyframes scan{0%{transform:translateY(-10px)}100%{transform:translateY(360px)}}
        @keyframes hbar{from{width:0}to{width:100%}}
      `}</style>

      {/* ── HEADER ── */}
      <div style={{borderBottom:"1px solid #071828",background:"rgba(2,11,24,0.98)",
        backdropFilter:"blur(20px)",position:"sticky",top:0,zIndex:100}}>
        <div style={{maxWidth:1400,margin:"0 auto",padding:"0 24px",
          display:"flex",alignItems:"center",height:56,gap:20}}>

          {/* Logo */}
          <div style={{display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
            <div style={{width:36,height:36,borderRadius:10,
              background:"linear-gradient(135deg,#38bdf844,#6366f122)",
              border:"1.5px solid #38bdf866",display:"grid",placeItems:"center",
              boxShadow:"0 0 16px #38bdf833"}}>
              <Ic.activity style={{width:18,height:18,color:"#38bdf8"}}/>
            </div>
            <div>
              <div style={{fontFamily:"Orbitron,monospace",fontSize:12,fontWeight:900,
                color:"#38bdf8",letterSpacing:"0.18em",
                textShadow:"0 0 12px #38bdf8"}}>NETOPS</div>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:7.5,
                color:"#1a4a6a",letterSpacing:"0.25em",textTransform:"uppercase",marginTop:1}}>
                TOPOLOGY DASHBOARD
              </div>
            </div>
          </div>

          {/* Status bar */}
          <div style={{display:"flex",gap:14,marginLeft:20}}>
            {[
              {label:"SITES",val:"7",   col:"#38bdf8"},
              {label:"ISPs", val:"4",   col:"#a855f7"},
              {label:"DCs",  val:"2",   col:"#f97316"},
              {label:"DRs",  val:"2",   col:"#8b5cf6"},
              {label:"UPTIME",val:"99.99%",col:"#10b981"},
            ].map((st,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:6,
                padding:"4px 10px",borderRadius:6,
                background:`rgba(${st.col==="#38bdf8"?"56,189,248":st.col==="#f97316"?"249,115,22":st.col==="#a855f7"?"168,85,247":st.col==="#8b5cf6"?"139,92,246":"16,185,129"},0.08)`,
                border:`1px solid ${st.col}22`}}>
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:13,fontWeight:800,
                  color:st.col,textShadow:`0 0 8px ${st.col}`}}>{st.val}</div>
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:"#1a4a6a",
                  letterSpacing:"0.12em",textTransform:"uppercase"}}>{st.label}</div>
              </div>
            ))}
          </div>

          {/* Right: clock + status */}
          <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:16}}>
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              <div style={{width:6,height:6,borderRadius:"50%",background:"#10b981",
                boxShadow:"0 0 8px #10b981",animation:"blink 2s infinite"}}/>
              <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9.5,
                color:"#10b981",letterSpacing:"0.1em"}}>ALL SYSTEMS NOMINAL</span>
            </div>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:"#1a4a6a",
              letterSpacing:"0.12em",borderLeft:"1px solid #071828",paddingLeft:16}}>
              {clock.toLocaleTimeString("en-US",{hour12:false})} UTC
            </div>
          </div>
        </div>

        {/* ISP status strip */}
        <div style={{borderTop:"1px solid #071828",background:"rgba(2,8,18,0.6)",
          padding:"6px 24px",display:"flex",alignItems:"center",gap:20,
          maxWidth:1400,margin:"0 auto",flexWrap:"wrap"}}>
          <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:"#1a4a6a",
            letterSpacing:"0.2em",textTransform:"uppercase",flexShrink:0}}>ISP LINKS:</span>
          {ISPS.map(isp=>(
            <div key={isp.id} style={{display:"flex",alignItems:"center",gap:6}}>
              <div style={{width:5,height:5,borderRadius:"50%",
                background:isp.health==="good"?"#10b981":"#eab308",
                boxShadow:`0 0 6px ${isp.health==="good"?"#10b981":"#eab308"}`,
                animation:"blink 2s infinite"}}/>
              <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8.5,
                color:isp.col,fontWeight:700,letterSpacing:"0.1em"}}>{isp.name}</span>
              <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:"#1a4a6a"}}>
                {isp.bw}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── MAIN ── */}
      <div style={{maxWidth:1400,margin:"0 auto",padding:"24px 24px 60px"}}>

        {/* Title */}
        <div style={{marginBottom:20,display:"flex",alignItems:"flex-end",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
          <div>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:"0.28em",
              color:"#1a4a6a",textTransform:"uppercase",marginBottom:6,display:"flex",alignItems:"center",gap:8}}>
              <div style={{width:20,height:1,background:"linear-gradient(90deg,transparent,#1a4a6a)"}}/>
              Enterprise Network Operations Center
              <div style={{width:20,height:1,background:"linear-gradient(90deg,#1a4a6a,transparent)"}}/>
            </div>
            <h1 style={{fontFamily:"Orbitron,monospace",fontSize:"clamp(22px,3.5vw,36px)",
              fontWeight:900,letterSpacing:"0.08em",lineHeight:1.1,
              background:"linear-gradient(90deg,#38bdf8,#6366f1 40%,#a855f7)",
              WebkitBackgroundClip:"text",backgroundClip:"text",color:"transparent",
              textShadow:"none"}}>
              NETWORK TOPOLOGY
            </h1>
          </div>
          {site&&(
            <button onClick={()=>setSite(null)} style={{
              padding:"9px 20px",borderRadius:8,cursor:"pointer",
              fontFamily:"'JetBrains Mono',monospace",fontSize:11,fontWeight:700,
              letterSpacing:"0.1em",textTransform:"uppercase",
              background:"rgba(56,189,248,0.08)",
              border:"1px solid #38bdf844",color:"#38bdf8",
              transition:"all 0.2s",
            }}
              onMouseEnter={e=>{e.currentTarget.style.background="rgba(56,189,248,0.18)";e.currentTarget.style.boxShadow="0 0 16px #38bdf844";}}
              onMouseLeave={e=>{e.currentTarget.style.background="rgba(56,189,248,0.08)";e.currentTarget.style.boxShadow="none";}}>
              ← Overview
            </button>
          )}
        </div>

        {/* Main panel */}
        <div style={{borderRadius:16,overflow:"hidden",
          background:"rgba(2,10,24,0.85)",
          border:"1px solid #071828",
          boxShadow:"0 0 80px rgba(56,189,248,0.04),0 30px 60px rgba(0,0,0,0.5)",
          backdropFilter:"blur(12px)",
          position:"relative",
        }}>
          {/* Top glowing border */}
          <div style={{position:"absolute",top:0,left:0,right:0,height:"1px",
            background:"linear-gradient(90deg,transparent,#38bdf8,#6366f1,#a855f7,transparent)"}}/>

          {/* Panel header */}
          <div style={{padding:"14px 22px",borderBottom:"1px solid #071828",
            display:"flex",alignItems:"center",gap:14,
            background:"linear-gradient(180deg,rgba(4,18,40,0.6),transparent)"}}>
            <div style={{width:38,height:38,borderRadius:10,
              background:s?`linear-gradient(135deg,${s.col}44,${s.col2}18)`:"linear-gradient(135deg,#38bdf844,#6366f118)",
              border:`1.5px solid ${s?s.col+"66":"#38bdf844"}`,
              display:"grid",placeItems:"center",
              boxShadow:s?`0 0 14px ${s.col}33`:"0 0 14px #38bdf822",
              transition:"all 0.3s"}}>
              <Ic.sdwan style={{width:18,height:18,color:s?s.col:"#38bdf8"}}/>
            </div>
            <div>
              <div style={{fontSize:15,fontWeight:700,color:"#a8d8f0",letterSpacing:"0.04em"}}>
                {site?SITES[site].sub:"Enterprise Network Overview"}
              </div>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:"#1a4a6a",
                letterSpacing:"0.16em",textTransform:"uppercase",marginTop:2}}>
                {site
                  ?`${site.toUpperCase()} · ${isTopo?"Internal Topology":"End-User Devices & Traffic"}`
                  :"HQ · DC-1 · DC-2 · DR-1 · DR-2 · Branch-1 · Branch-2 · 4×ISP SD-WAN"}
              </div>
            </div>
            {/* Scanning indicator */}
            <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:8}}>
              <div style={{padding:"4px 12px",borderRadius:5,
                background:"rgba(16,185,129,0.1)",border:"1px solid #10b98130",
                fontFamily:"'JetBrains Mono',monospace",fontSize:8.5,color:"#10b981",
                display:"flex",alignItems:"center",gap:6,letterSpacing:"0.1em"}}>
                <div style={{width:5,height:5,borderRadius:"50%",background:"#10b981",
                  animation:"blink 1.5s infinite"}}/>
                LIVE MONITORING
              </div>
            </div>
          </div>

          {/* Canvas */}
          <div style={{padding:site?24:16,minHeight:500}}>
            {!site&&(
              <>
                {/* Legend */}
                <div style={{display:"flex",gap:16,marginBottom:16,flexWrap:"wrap",
                  fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:"#1a4a6a",
                  padding:"8px 16px",borderRadius:8,
                  background:"rgba(4,14,32,0.6)",border:"1px solid #071828",
                  alignItems:"center"}}>
                  <span style={{letterSpacing:"0.18em",textTransform:"uppercase",color:"#0f3a60",marginRight:4}}>LEGEND:</span>
                  {[
                    {col:"#38bdf8",label:"HQ — Headquarters"},
                    {col:"#f97316",label:"DC-1/2 — Data Centers"},
                    {col:"#a855f7",label:"DR-1/2 — Disaster Recovery"},
                    {col:"#10b981",label:"Branch Offices"},
                    {col:"#a855f7",label:"4×ISP Multi-Homed SD-WAN"},
                  ].map((l,i)=>(
                    <div key={i} style={{display:"flex",alignItems:"center",gap:5}}>
                      <div style={{width:7,height:7,borderRadius:2,background:l.col,
                        boxShadow:`0 0 4px ${l.col}`}}/>
                      <span>{l.label}</span>
                    </div>
                  ))}
                  <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:5}}>
                    <div style={{width:5,height:5,borderRadius:"50%",background:"#38bdf8",animation:"blink 2s infinite"}}/>
                    <span>Hover buildings for glow · Click to drill-in</span>
                  </div>
                </div>
                <OverviewMap activeSite={site} onSiteClick={setSite}/>
              </>
            )}
            {isTopo&&<TopoView site={site}/>}
            {isDevs&&<SitePanel site={site}/>}
          </div>
        </div>

        {/* Quick nav */}
        <div style={{display:"flex",gap:8,marginTop:16,flexWrap:"wrap"}}>
          {navItems.map(n=>{
            const sv=SITES[n.id];
            const isAct=site===n.id;
            return(
              <button key={n.id} onClick={()=>setSite(isAct?null:n.id)} style={{
                padding:"7px 16px",borderRadius:7,cursor:"pointer",
                border:`1px solid ${isAct?sv.col:`${sv.col}22`}`,
                background:isAct?`${sv.col}14`:"rgba(2,14,32,0.6)",
                color:isAct?sv.col:`${sv.col}70`,
                fontFamily:"'JetBrains Mono',monospace",fontSize:10.5,fontWeight:700,
                letterSpacing:"0.1em",transition:"all 0.2s",
                display:"flex",alignItems:"center",gap:6,
                boxShadow:isAct?`0 0 12px ${sv.col}33`:"none",
              }}
                onMouseEnter={e=>{if(!isAct){e.currentTarget.style.borderColor=`${sv.col}66`;e.currentTarget.style.color=sv.col;e.currentTarget.style.background=`${sv.col}0a`;e.currentTarget.style.boxShadow=`0 0 10px ${sv.col}22`;}}}
                onMouseLeave={e=>{if(!isAct){e.currentTarget.style.borderColor=`${sv.col}22`;e.currentTarget.style.color=`${sv.col}70`;e.currentTarget.style.background="rgba(2,14,32,0.6)";e.currentTarget.style.boxShadow="none";}}}>
                <div style={{width:5,height:5,borderRadius:"50%",background:sv.col,
                  boxShadow:isAct?`0 0 6px ${sv.col}`:""}}/>
                {n.label}
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div style={{marginTop:20,paddingTop:16,borderTop:"1px solid #071828",
          display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:8,
          fontFamily:"'JetBrains Mono',monospace",fontSize:8.5,color:"#0f3a60",
          letterSpacing:"0.16em",textTransform:"uppercase"}}>
          <span>Enterprise Network Ops · SD-WAN · 4×ISP · Veeam Protected</span>
          <span>2×DC · 2×DR · HQ · 2×Branch · © 2026</span>
        </div>
      </div>
    </div>
  );
}
