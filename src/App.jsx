import { useState, useEffect, useRef, useCallback } from "react";

const Icon = {
  server:  (p={}) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="4" width="18" height="6" rx="1.5"/><rect x="3" y="14" width="18" height="6" rx="1.5"/><circle cx="7" cy="7" r=".9" fill="currentColor"/><circle cx="7" cy="17" r=".9" fill="currentColor"/><line x1="11" y1="7" x2="17" y2="7"/><line x1="11" y1="17" x2="17" y2="17"/></svg>,
  desktop: (p={}) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>,
  laptop:  (p={}) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="4" width="18" height="12" rx="2"/><path d="M2 20h20"/></svg>,
  phone:   (p={}) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="7" y="2" width="10" height="20" rx="2"/><circle cx="12" cy="17" r=".8" fill="currentColor"/></svg>,
  printer: (p={}) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>,
  camera:  (p={}) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>,
  switch:  (p={}) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="2" y="7" width="20" height="10" rx="2"/><line x1="6" y1="12" x2="6" y2="12" strokeWidth="3"/><line x1="10" y1="12" x2="10" y2="12" strokeWidth="3"/><line x1="14" y1="12" x2="14" y2="12" strokeWidth="3"/><line x1="18" y1="12" x2="18" y2="12" strokeWidth="3"/></svg>,
  firewall:(p={}) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M12 2L4 6v6c0 5 4 9.5 8 11 4-1.5 8-6 8-11V6z"/><path d="M9 12l2 2 4-4"/></svg>,
  storage: (p={}) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>,
  cloud:   (p={}) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>,
  backup:  (p={}) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.98"/></svg>,
  mail:    (p={}) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  web:     (p={}) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  ad:      (p={}) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  sdwan:   (p={}) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>,
  tape:    (p={}) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="2" y="5" width="20" height="14" rx="2"/><circle cx="8" cy="12" r="3"/><circle cx="16" cy="12" r="3"/><line x1="11" y1="12" x2="13" y2="12"/></svg>,
  iot:     (p={}) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="9" y="9" width="6" height="6" rx="1"/><path d="M5.5 5.5A9.6 9.6 0 0 0 3 12a9.6 9.6 0 0 0 2.5 6.5"/><path d="M18.5 5.5A9.6 9.6 0 0 1 21 12a9.6 9.6 0 0 1-2.5 6.5"/><path d="M7.5 7.5A6.5 6.5 0 0 0 5.5 12a6.5 6.5 0 0 0 2 4.5"/><path d="M16.5 7.5A6.5 6.5 0 0 1 18.5 12a6.5 6.5 0 0 1-2 4.5"/></svg>,
  vm:      (p={}) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="2" y="3" width="20" height="14" rx="2"/><rect x="5" y="6" width="6" height="5" rx="1"/><rect x="13" y="6" width="6" height="5" rx="1"/><line x1="7" y1="17" x2="17" y2="17"/><line x1="12" y1="17" x2="12" y2="21"/></svg>,
  close:   (p={}) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
};

const SITES = {
  hq: { id:"hq", label:"HQ",  sub:"Headquarters",      col:"#5b8def", col2:"#6366f1", floors:6 },
  dc: { id:"dc", label:"DC",  sub:"Data Center",        col:"#f97316", col2:"#ef4444", floors:8 },
  dr: { id:"dr", label:"DR",  sub:"Disaster Recovery",  col:"#8b5cf6", col2:"#ec4899", floors:5 },
  b1: { id:"b1", label:"B1",  sub:"Branch Office 1",    col:"#10b981", col2:"#06b6d4", floors:3 },
  b2: { id:"b2", label:"B2",  sub:"Branch Office 2",    col:"#10b981", col2:"#06b6d4", floors:3 },
};

const SITE_DEVICES = {
  hq:[
    {id:"hq-pc1",  label:"PC-001",   type:"desktop", ip:"10.1.1.10", os:"Windows 11"},
    {id:"hq-pc2",  label:"PC-002",   type:"desktop", ip:"10.1.1.11", os:"Windows 11"},
    {id:"hq-lap1", label:"Laptop-A", type:"laptop",  ip:"10.1.1.20", os:"macOS 14"},
    {id:"hq-lap2", label:"Laptop-B", type:"laptop",  ip:"10.1.1.21", os:"Windows 11"},
    {id:"hq-mob1", label:"iPhone-1", type:"phone",   ip:"10.1.1.30", os:"iOS 17"},
    {id:"hq-mob2", label:"Android",  type:"phone",   ip:"10.1.1.31", os:"Android 14"},
    {id:"hq-prt",  label:"Printer",  type:"printer", ip:"10.1.1.40", os:"Embedded"},
    {id:"hq-cam",  label:"IP-Cam",   type:"camera",  ip:"10.1.1.50", os:"IoT FW"},
    {id:"hq-iot",  label:"IoT Hub",  type:"iot",     ip:"10.1.1.60", os:"RTOS"},
  ],
  b1:[
    {id:"b1-pc1",  label:"PC-101",   type:"desktop", ip:"10.2.1.10", os:"Windows 11"},
    {id:"b1-pc2",  label:"PC-102",   type:"desktop", ip:"10.2.1.11", os:"Windows 10"},
    {id:"b1-lap",  label:"Laptop-C", type:"laptop",  ip:"10.2.1.20", os:"Windows 11"},
    {id:"b1-mob",  label:"iPhone-2", type:"phone",   ip:"10.2.1.30", os:"iOS 17"},
    {id:"b1-prt",  label:"Printer",  type:"printer", ip:"10.2.1.40", os:"Embedded"},
  ],
  b2:[
    {id:"b2-pc1",  label:"PC-201",   type:"desktop", ip:"10.3.1.10", os:"Windows 11"},
    {id:"b2-pc2",  label:"PC-202",   type:"desktop", ip:"10.3.1.11", os:"Windows 11"},
    {id:"b2-lap",  label:"Laptop-D", type:"laptop",  ip:"10.3.1.20", os:"macOS 14"},
    {id:"b2-mob",  label:"Android",  type:"phone",   ip:"10.3.1.30", os:"Android 14"},
    {id:"b2-cam",  label:"IP-Cam",   type:"camera",  ip:"10.3.1.50", os:"IoT FW"},
  ],
};

const DC_LAYERS = [
  {id:"sdwan-dc", label:"SD-WAN Edge",    icon:"sdwan",    col:"#5b8def", x:50, y:9},
  {id:"fw1-dc",   label:"FW-01 Active",   icon:"firewall", col:"#ef4444", x:28, y:22},
  {id:"fw2-dc",   label:"FW-02 Standby",  icon:"firewall", col:"#ef4444", x:62, y:22},
  {id:"sw-core",  label:"Core Switch L3", icon:"switch",   col:"#10b981", x:45, y:36},
  {id:"vmware",   label:"VMware Cluster", icon:"vm",       col:"#8b5cf6", x:14, y:52},
  {id:"mail",     label:"Mail Server",    icon:"mail",     col:"#06b6d4", x:34, y:52},
  {id:"web",      label:"Web Server",     icon:"web",      col:"#5b8def", x:55, y:52},
  {id:"ad",       label:"Active Dir.",    icon:"ad",       col:"#f97316", x:76, y:52},
  {id:"veeam",    label:"Veeam B&R v12",  icon:"backup",   col:"#10b981", x:22, y:70},
  {id:"san",      label:"SAN Storage",    icon:"storage",  col:"#eab308", x:45, y:70},
  {id:"tape",     label:"Tape Library",   icon:"tape",     col:"#6366f1", x:70, y:70},
];

const DR_LAYERS = [
  {id:"sdwan-dr", label:"SD-WAN Edge",    icon:"sdwan",    col:"#8b5cf6", x:50, y:9},
  {id:"fw-dr",    label:"FW Cluster",     icon:"firewall", col:"#ef4444", x:35, y:22},
  {id:"sw-dr",    label:"Core Switch",    icon:"switch",   col:"#10b981", x:50, y:36},
  {id:"vm-dr",    label:"VMware DR",      icon:"vm",       col:"#8b5cf6", x:22, y:52},
  {id:"rep",      label:"Veeam Replica",  icon:"backup",   col:"#10b981", x:50, y:52},
  {id:"stor-dr",  label:"DR Storage",     icon:"storage",  col:"#eab308", x:74, y:52},
];

function getTrafficHops(site) {
  if (site === "b1" || site === "b2") return [
    {label:"Access Switch",  icon:"switch",   col:"#10b981", ms:0},
    {label:"Core Switch",    icon:"switch",   col:"#10b981", ms:120},
    {label:"SD-WAN Edge",    icon:"sdwan",    col:"#06b6d4", ms:260},
    {label:"iNET Fabric",    icon:"cloud",    col:"#8b5cf6", ms:400},
    {label:"DC Firewall",    icon:"firewall", col:"#ef4444", ms:540},
    {label:"DC Core SW",     icon:"switch",   col:"#f97316", ms:680},
  ];
  return [
    {label:"Access Switch",  icon:"switch",   col:"#5b8def", ms:0},
    {label:"Core Switch",    icon:"switch",   col:"#5b8def", ms:120},
    {label:"Firewall",       icon:"firewall", col:"#ef4444", ms:260},
    {label:"SD-WAN Edge",    icon:"sdwan",    col:"#06b6d4", ms:400},
    {label:"iNET / Cloud",   icon:"cloud",    col:"#8b5cf6", ms:540},
  ];
}

/* --- Building SVG --- */
function Building({ site, onClick, isActive }) {
  const s = SITES[site];
  const W = s.floors >= 6 ? 80 : 62;
  const H = s.floors * 18 + 20;
  const totalH = H + 40;

  return (
    <div onClick={onClick} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6,cursor:"pointer"}}>
      <div style={{
        position:"relative",
        filter: isActive ? `drop-shadow(0 0 14px ${s.col}99)` : "none",
        transition:"filter 0.3s",
      }}>
        <svg width={W} height={totalH} viewBox={`0 0 ${W} ${totalH}`} style={{overflow:"visible"}}>
          <defs>
            <linearGradient id={`g-${site}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={s.col}/>
              <stop offset="100%" stopColor={s.col2}/>
            </linearGradient>
          </defs>
          {/* Shadow */}
          <ellipse cx={W/2} cy={totalH-6} rx={W*0.45} ry={5} fill={s.col} opacity="0.15"/>
          {/* Building body fill */}
          <rect x="4" y="20" width={W-8} height={H-20} rx="3" fill={`url(#g-${site})`} opacity="0.1"/>
          {/* Building outline */}
          <rect x="4" y="20" width={W-8} height={H-20} rx="3"
            fill="none" stroke={s.col} strokeWidth={isActive?2:1.5} opacity={isActive?1:0.7}/>
          {/* Floors */}
          {Array.from({length:s.floors-1}).map((_,i)=>(
            <line key={i} x1="4" y1={H-((i+1)*18)} x2={W-4} y2={H-((i+1)*18)}
              stroke={s.col} strokeWidth="0.5" opacity="0.35"/>
          ))}
          {/* Windows */}
          {Array.from({length:s.floors}).map((_,fi)=>
            [12,W/2-6,W-24].map((wx,wi)=>{
              const lit=(fi*3+wi)%4!==0;
              return <rect key={`${fi}-${wi}`} x={wx} y={H-((fi+1)*18)+5}
                width="10" height="8" rx="1"
                fill={lit?s.col:"transparent"}
                stroke={s.col} strokeWidth="0.5"
                opacity={lit?0.65:0.25}/>;
            })
          )}
          {/* Antenna for big buildings */}
          {s.floors >= 5 && <>
            <line x1={W/2} y1="20" x2={W/2} y2="4" stroke={s.col} strokeWidth="1.5"/>
            <circle cx={W/2} cy="3" r="3.5" fill={s.col} opacity="0.9">
              <animate attributeName="opacity" values="0.9;0.2;0.9" dur="2s" repeatCount="indefinite"/>
            </circle>
          </>}
          {/* Name banner */}
          <rect x="4" y={H} width={W-8} height={16} rx="0 0 3 3" fill={s.col} opacity="0.92"/>
          <text x={W/2} y={H+11} textAnchor="middle" fontSize="7.5"
            fontWeight="800" fill="#fff" fontFamily="JetBrains Mono,monospace" letterSpacing="0.12em">
            {s.label}
          </text>
          {/* Active ring */}
          {isActive && <rect x="1" y="17" width={W-2} height={H+2} rx="5"
            fill="none" stroke={s.col} strokeWidth="2.5" strokeDasharray="5,3" opacity="0.7">
            <animate attributeName="stroke-dashoffset" from="8" to="0" dur="0.5s" repeatCount="indefinite"/>
          </rect>}
        </svg>
      </div>
      <div style={{
        fontSize:10, fontWeight:700, color: isActive?s.col:"var(--ink-3)",
        fontFamily:"JetBrains Mono,monospace", letterSpacing:"0.1em",
        textAlign:"center", maxWidth:100, lineHeight:1.3,
        transition:"color 0.2s",
      }}>{s.sub}</div>
    </div>
  );
}

/* --- Animated Overview Map --- */
function OverviewMap({ activeSite, onSiteClick }) {
  // Positions (% of container)
  const positions = {
    hq:{x:9,y:28}, b1:{x:9,y:62}, b2:{x:45,y:72},
    dc:{x:78,y:20}, dr:{x:78,y:62},
  };
  const inet = {x:50,y:44};

  const links = [
    {from:"hq", col:"#5b8def", bw:"90%", dur:"1.8s"},
    {from:"dc", col:"#f97316", bw:"88%", dur:"1.6s"},
    {from:"dr", col:"#8b5cf6", bw:"50%", dur:"2.2s"},
    {from:"b1", col:"#10b981", bw:"65%", dur:"2s"},
    {from:"b2", col:"#10b981", bw:"50%", dur:"2.4s"},
  ];

  return (
    <div style={{position:"relative",width:"100%",height:420}}>
      <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none"}} viewBox="0 0 900 420" preserveAspectRatio="xMidYMid meet">
        <defs>
          {links.map(l=>(
            <marker key={l.from} id={`ar-${l.from}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
              <path d="M2 1L8 5L2 9" fill="none" stroke={l.col} strokeWidth="1.5"/>
            </marker>
          ))}
        </defs>

        {/* iNET cloud */}
        <ellipse cx="450" cy="185" rx="58" ry="38" fill="rgba(91,141,239,0.07)" stroke="#5b8def" strokeWidth="1" strokeDasharray="5,3"/>
        <text x="450" y="181" textAnchor="middle" fontSize="11" fill="#5b8def" fontFamily="JetBrains Mono,monospace" fontWeight="700">iNET</text>
        <text x="450" y="197" textAnchor="middle" fontSize="9" fill="#8b93ab" fontFamily="JetBrains Mono,monospace">SD-WAN Fabric</text>

        {/* Animated links */}
        {links.map(l=>{
          const p = positions[l.from];
          const x1=p.x/100*900, y1=p.y/100*420;
          const x2=450, y2=185;
          const mx=(x1+x2)/2, my=(y1+y2)/2 - 20;
          return (
            <g key={l.from}>
              <path d={`M${x1},${y1} Q${mx},${my} ${x2},${y2}`} fill="none"
                stroke={l.col} strokeWidth="1.5" strokeDasharray="8,5" opacity="0.45">
                <animate attributeName="stroke-dashoffset" from="13" to="0" dur={l.dur} repeatCount="indefinite"/>
              </path>
              {/* Packet 1 */}
              <circle r="4.5" fill={l.col} opacity="0.85">
                <animateMotion dur={l.dur} repeatCount="indefinite">
                  <mpath href={`#lp-${l.from}`}/>
                </animateMotion>
              </circle>
              {/* Packet 2 offset */}
              <circle r="3.5" fill={l.col} opacity="0.55">
                <animateMotion dur={l.dur} repeatCount="indefinite" begin={`-${parseFloat(l.dur)/2}s`}>
                  <mpath href={`#lp-${l.from}`}/>
                </animateMotion>
              </circle>
              <path id={`lp-${l.from}`} d={`M${x1},${y1} Q${mx},${my} ${x2},${y2}`} fill="none"/>
              {/* BW label */}
              <text x={mx} y={my-6} textAnchor="middle" fontSize="9" fill={l.col}
                fontFamily="JetBrains Mono,monospace" opacity="0.7">{l.bw}</text>
            </g>
          );
        })}

        {/* DC ↔ DR replication */}
        <line x1="702" y1="105" x2="702" y2="260" stroke="#8b5cf6" strokeWidth="2" strokeDasharray="5,3" opacity="0.5"/>
        <text x="716" y="185" fontSize="9" fill="#8b5cf6" fontFamily="JetBrains Mono,monospace" opacity="0.8">REPL</text>
        <circle r="3.5" fill="#8b5cf6" opacity="0.85">
          <animateMotion dur="1.4s" repeatCount="indefinite">
            <mpath href="#lp-repl"/>
          </animateMotion>
        </circle>
        <circle r="3.5" fill="#8b5cf6" opacity="0.55">
          <animateMotion dur="1.4s" repeatCount="indefinite" begin="-0.7s">
            <mpath href="#lp-repl"/>
          </animateMotion>
        </circle>
        <path id="lp-repl" d="M702,105 L702,260" fill="none"/>
      </svg>

      {/* Building nodes */}
      <div style={{position:"absolute",left:"6%",top:"18%"}}><Building site="hq" onClick={()=>onSiteClick("hq")} isActive={activeSite==="hq"}/></div>
      <div style={{position:"absolute",left:"6%",top:"52%"}}><Building site="b1" onClick={()=>onSiteClick("b1")} isActive={activeSite==="b1"}/></div>
      <div style={{position:"absolute",left:"42%",top:"62%"}}><Building site="b2" onClick={()=>onSiteClick("b2")} isActive={activeSite==="b2"}/></div>
      <div style={{position:"absolute",right:"9%",top:"10%"}}><Building site="dc" onClick={()=>onSiteClick("dc")} isActive={activeSite==="dc"}/></div>
      <div style={{position:"absolute",right:"9%",top:"52%"}}><Building site="dr" onClick={()=>onSiteClick("dr")} isActive={activeSite==="dr"}/></div>
    </div>
  );
}

/* --- Device Node --- */
function DeviceNode({ device, onClick, isActive, col }) {
  const I = Icon[device.type] || Icon.desktop;
  return (
    <div onClick={onClick} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:5,cursor:"pointer",width:80}}>
      <div style={{
        width:64,height:64,borderRadius:14,
        background:isActive?`linear-gradient(135deg,${col},${col}cc)`:"#fff",
        border:`2px solid ${isActive?col:"#e6e9f2"}`,
        display:"grid",placeItems:"center",
        boxShadow:isActive?`0 8px 20px ${col}44`:"0 4px 12px rgba(15,21,48,0.06)",
        transition:"all 0.25s cubic-bezier(.2,.8,.2,1)",
        position:"relative",
      }}>
        <I style={{width:28,height:28,color:isActive?"#fff":"#8b93ab",transition:"color 0.2s"}}/>
        {isActive&&<div style={{position:"absolute",inset:-5,borderRadius:20,
          border:`1.5px solid ${col}`,animation:"dPulse 1.2s ease-out infinite",pointerEvents:"none"}}/>}
      </div>
      <div style={{fontFamily:"JetBrains Mono,monospace",fontSize:9,fontWeight:700,
        color:isActive?col:"#8b93ab",letterSpacing:"0.06em",textAlign:"center",
        transition:"color 0.2s"}}>{device.label}</div>
    </div>
  );
}

/* --- Traffic Flow --- */
function TrafficFlow({ device, site, onClose }) {
  const [step, setStep] = useState(-1);
  const hops = getTrafficHops(site);
  const s = SITES[site];

  useEffect(() => {
    setStep(-1);
    const timers = hops.map((h,i) => setTimeout(()=>setStep(i), h.ms+300));
    return () => timers.forEach(clearTimeout);
  }, [device.id]);

  const DI = Icon[device.type]||Icon.desktop;

  return (
    <div style={{
      background:"#fff",borderRadius:16,border:"1px solid #e6e9f2",
      boxShadow:"0 16px 48px rgba(15,21,48,0.1)",padding:22,marginTop:18,
      animation:"fsu 0.3s ease",
    }}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:36,height:36,borderRadius:10,
            background:`linear-gradient(135deg,${s.col},${s.col2})`,
            display:"grid",placeItems:"center",color:"#fff"}}>
            <DI style={{width:18,height:18}}/>
          </div>
          <div>
            <div style={{fontSize:14,fontWeight:700,color:"#0f1530"}}>{device.label} — Traffic Path</div>
            <div style={{fontFamily:"JetBrains Mono,monospace",fontSize:10,color:"#8b93ab"}}>
              {device.ip} · {device.os}
            </div>
          </div>
        </div>
        <button onClick={onClose} style={{width:28,height:28,borderRadius:8,border:"1px solid #e6e9f2",
          background:"#fff",cursor:"pointer",display:"grid",placeItems:"center"}}>
          <Icon.close style={{width:14,height:14,color:"#8b93ab"}}/>
        </button>
      </div>

      {/* Hop chain */}
      <div style={{display:"flex",alignItems:"center",overflowX:"auto",paddingBottom:6,gap:0}}>
        {/* Source device */}
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:5,flexShrink:0}}>
          <div style={{width:52,height:52,borderRadius:13,
            background:`linear-gradient(135deg,${s.col},${s.col2})`,
            display:"grid",placeItems:"center",color:"#fff",
            boxShadow:`0 6px 16px ${s.col}44`}}>
            <DI style={{width:24,height:24}}/>
          </div>
          <div style={{fontFamily:"JetBrains Mono,monospace",fontSize:9,color:s.col,fontWeight:700}}>{device.label}</div>
        </div>

        {hops.map((hop,i)=>{
          const HI = Icon[hop.icon]||Icon.server;
          const on = step >= i;
          return (
            <div key={i} style={{display:"flex",alignItems:"center",flexShrink:0}}>
              {/* Connector line */}
              <div style={{position:"relative",width:48,height:2,margin:"0 3px",marginBottom:22}}>
                <div style={{height:2,borderRadius:1,background:on?hop.col:"#e6e9f2",transition:"background 0.4s",width:"100%"}}/>
                {on && <div style={{
                  position:"absolute",top:-3,left:0,
                  width:8,height:8,borderRadius:"50%",
                  background:hop.col,boxShadow:`0 0 6px ${hop.col}`,
                  animation:"pkt 1.1s linear infinite",
                }}/>}
                <div style={{
                  position:"absolute",right:-1,top:-5,
                  borderLeft:`8px solid ${on?hop.col:"#e6e9f2"}`,
                  borderTop:"6px solid transparent",borderBottom:"6px solid transparent",
                  transition:"border-color 0.4s",
                }}/>
              </div>
              {/* Hop node */}
              <div style={{
                display:"flex",flexDirection:"column",alignItems:"center",gap:4,flexShrink:0,
                opacity:on?1:0.25,
                transform:on?"translateY(0)":"translateY(6px)",
                transition:"all 0.4s ease",
              }}>
                <div style={{
                  width:52,height:52,borderRadius:13,
                  background:on?`linear-gradient(135deg,${hop.col},${hop.col}bb)`:"#f4f6fc",
                  border:`2px solid ${on?hop.col:"#e6e9f2"}`,
                  display:"grid",placeItems:"center",
                  color:on?"#fff":"#8b93ab",
                  boxShadow:on?`0 6px 16px ${hop.col}44`:"none",
                  transition:"all 0.4s ease",
                }}>
                  <HI style={{width:24,height:24}}/>
                </div>
                <div style={{fontFamily:"JetBrains Mono,monospace",fontSize:8,fontWeight:700,
                  color:on?hop.col:"#8b93ab",textAlign:"center",maxWidth:70,lineHeight:1.3,
                  transition:"color 0.3s"}}>{hop.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Stats row */}
      <div style={{display:"flex",gap:8,marginTop:14}}>
        {[
          {label:"Latency",    val:site==="dc"?"3ms":site==="b1"||site==="b2"?"18ms":"10ms", col:"#5b8def"},
          {label:"Throughput", val:"847 Mbps", col:"#10b981"},
          {label:"Packet Loss",val:"0.02%",    col:"#f59e0b"},
          {label:"Protocol",   val:"TLS 1.3",  col:"#8b5cf6"},
        ].map((st,i)=>(
          <div key={i} style={{flex:1,padding:"10px 10px",borderRadius:10,
            background:"linear-gradient(180deg,#fafbfe,#f4f6fc)",border:"1px solid #e6e9f2",textAlign:"center"}}>
            <div style={{fontFamily:"JetBrains Mono,monospace",fontSize:16,fontWeight:800,color:st.col}}>{st.val}</div>
            <div style={{fontSize:9,textTransform:"uppercase",letterSpacing:"0.12em",color:"#8b93ab",marginTop:3,fontWeight:700}}>{st.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* --- Topology View (DC/DR) --- */
function TopoView({ site }) {
  const layers = site==="dr" ? DR_LAYERS : DC_LAYERS;
  const s = SITES[site];
  return (
    <div>
      <div style={{fontSize:10,fontFamily:"JetBrains Mono,monospace",letterSpacing:"0.18em",
        color:"#8b93ab",textTransform:"uppercase",fontWeight:700,marginBottom:14}}>
        {s.sub} — Internal Architecture
      </div>
      <div style={{
        position:"relative",height:340,
        background:"linear-gradient(180deg,#fafbfe,#f4f6fc)",
        borderRadius:16,border:"1px solid #e6e9f2",overflow:"hidden",
      }}>
        <div style={{position:"absolute",inset:0,
          backgroundImage:"radial-gradient(circle,rgba(15,21,48,0.055) 1px,transparent 1px)",
          backgroundSize:"22px 22px",pointerEvents:"none"}}/>
        <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none"}}>
          {/* SD-WAN to FWs */}
          <line x1="50%" y1="9%" x2={site==="dr"?"35%":"28%"} y2="24%" stroke="#e6e9f2" strokeWidth="1.5" strokeDasharray="4,3"/>
          <line x1="50%" y1="9%" x2={site==="dr"?"50%":"62%"} y2="24%" stroke="#e6e9f2" strokeWidth="1.5" strokeDasharray="4,3"/>
          {/* FW to Core */}
          <line x1={site==="dr"?"35%":"28%"} y1="26%" x2="45%" y2="38%" stroke="#e6e9f2" strokeWidth="1.5" strokeDasharray="4,3"/>
          {site==="dc"&&<line x1="62%" y1="26%" x2="45%" y2="38%" stroke="#e6e9f2" strokeWidth="1.5" strokeDasharray="4,3"/>}
          {/* Core to servers */}
          {(site==="dc"?[14,34,55,76]:[22,50,74]).map((x,i)=>(
            <line key={i} x1="45%" y1="40%" x2={`${x}%`} y2="54%" stroke="#e6e9f2" strokeWidth="1" strokeDasharray="3,3"/>
          ))}
          {/* Servers to storage (DC only) */}
          {site==="dc"&&[22,45,70].map((x,i)=>(
            <line key={i} x1={`${[14,34,76][i]}%`} y1="58%" x2={`${x}%`} y2="72%" stroke="#e6e9f2" strokeWidth="1" strokeDasharray="3,3"/>
          ))}
        </svg>

        {layers.map(node=>{
          const NI = Icon[node.icon]||Icon.server;
          return (
            <div key={node.id} style={{
              position:"absolute",left:`${node.x}%`,top:`${node.y}%`,
              transform:"translate(-50%,-50%)",
              display:"flex",flexDirection:"column",alignItems:"center",gap:4,zIndex:2,
            }}>
              <div
                style={{
                  width:50,height:50,borderRadius:13,
                  background:`${node.col}14`,
                  border:`1.5px solid ${node.col}50`,
                  display:"grid",placeItems:"center",
                  boxShadow:`0 4px 12px ${node.col}20`,
                  transition:"all 0.2s",cursor:"default",
                }}
                onMouseEnter={e=>{e.currentTarget.style.background=`${node.col}28`;e.currentTarget.style.borderColor=node.col;e.currentTarget.style.transform="scale(1.1)";}}
                onMouseLeave={e=>{e.currentTarget.style.background=`${node.col}14`;e.currentTarget.style.borderColor=`${node.col}50`;e.currentTarget.style.transform="scale(1)";}}
              >
                <NI style={{width:22,height:22,color:node.col}}/>
                {node.id==="veeam"&&<div style={{
                  position:"absolute",top:-5,right:-5,width:12,height:12,
                  borderRadius:"50%",background:"#10b981",border:"2px solid #fff",
                  animation:"pulse2 2s infinite",
                }}/>}
              </div>
              <div style={{fontFamily:"JetBrains Mono,monospace",fontSize:8,fontWeight:700,
                color:node.col,textAlign:"center",maxWidth:70,lineHeight:1.3}}>{node.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* --- Site Device Panel --- */
function SitePanel({ site }) {
  const [active, setActive] = useState(null);
  const s = SITES[site];
  const devices = SITE_DEVICES[site]||[];
  return (
    <div>
      <div style={{fontSize:10,fontFamily:"JetBrains Mono,monospace",letterSpacing:"0.18em",
        color:"#8b93ab",textTransform:"uppercase",fontWeight:700,marginBottom:14}}>
        {s.sub} — Click a device to trace its traffic path
      </div>
      <div style={{display:"flex",flexWrap:"wrap",gap:12}}>
        {devices.map(d=>(
          <DeviceNode key={d.id} device={d} col={s.col}
            isActive={active?.id===d.id}
            onClick={()=>setActive(active?.id===d.id?null:d)}/>
        ))}
      </div>
      {active && <TrafficFlow device={active} site={site} onClose={()=>setActive(null)}/>}
    </div>
  );
}

/* --- MAIN APP --- */
export default function App() {
  const [site, setSite] = useState(null);
  const [clock, setClock] = useState(new Date());
  useEffect(()=>{const id=setInterval(()=>setClock(new Date()),1000);return()=>clearInterval(id);},[]);

  const s = site?SITES[site]:null;
  const isTopo = site==="dc"||site==="dr";
  const isDevs = site==="hq"||site==="b1"||site==="b2";

  return (
    <div style={{
      minHeight:"100vh",
      background:"radial-gradient(900px 500px at 90% -5%,rgba(139,92,246,.07),transparent 60%),radial-gradient(700px 400px at -5% 10%,rgba(91,141,239,.09),transparent 60%),#f6f7fb",
      fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif",
      color:"#0f1530",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700;800&display=swap');
        *{box-sizing:border-box}
        @keyframes dPulse{0%{transform:scale(1);opacity:.5}100%{transform:scale(1.45);opacity:0}}
        @keyframes pulse2{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(.75);opacity:.4}}
        @keyframes fsu{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
        @keyframes pkt{0%{left:0%}100%{left:calc(100% - 8px)}}
      `}</style>

      <div style={{maxWidth:1120,margin:"0 auto",padding:"32px 24px 60px"}}>

        {/* Kicker */}
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
          <div style={{width:8,height:8,borderRadius:"50%",background:"#5b8def",boxShadow:"0 0 0 4px rgba(91,141,239,.18)"}}/>
          <span style={{fontFamily:"JetBrains Mono,monospace",fontSize:11,letterSpacing:"0.22em",color:"#8b93ab",textTransform:"uppercase"}}>
            Enterprise Network Topology
          </span>
          <span style={{marginLeft:"auto",fontFamily:"JetBrains Mono,monospace",fontSize:10,color:"#8b93ab"}}>
            {clock.toLocaleTimeString("en-US",{hour12:false})} UTC
          </span>
        </div>

        <h1 style={{fontSize:"clamp(26px,4vw,38px)",fontWeight:800,letterSpacing:"-0.025em",lineHeight:1.05,margin:"0 0 6px"}}>
          <span style={{background:"linear-gradient(90deg,#5b8def,#8b5cf6 45%,#ec4899)",WebkitBackgroundClip:"text",backgroundClip:"text",color:"transparent"}}>
            Network Topology
          </span>{" "}Visualization
        </h1>
        <p style={{color:"#4a5578",fontSize:14,maxWidth:640,lineHeight:1.55,marginTop:6,marginBottom:0}}>
          Click a <b>building</b> to explore internal topology. Click an <b>end-user device</b> to trace how traffic flows through the network.
        </p>

        {/* Main card */}
        <div style={{marginTop:22,borderRadius:20,background:"#fff",border:"1px solid #e6e9f2",boxShadow:"0 8px 40px rgba(15,21,48,.06)",overflow:"hidden"}}>

          {/* Topbar */}
          <div style={{padding:"13px 20px",borderBottom:"1px solid #f0f2f8",display:"flex",alignItems:"center",gap:12,background:"linear-gradient(180deg,rgba(246,247,251,.6),transparent)"}}>
            <div style={{
              width:40,height:40,borderRadius:10,
              background:s?`linear-gradient(135deg,${s.col},${s.col2})`:"linear-gradient(135deg,#5b8def,#6366f1)",
              display:"grid",placeItems:"center",color:"#fff",transition:"background 0.3s",
            }}>
              {s ? (isTopo ? <Icon.server style={{width:19,height:19}}/> : <Icon.desktop style={{width:19,height:19}}/>) : <Icon.sdwan style={{width:19,height:19}}/>}
            </div>
            <div>
              <div style={{fontSize:16,fontWeight:700,letterSpacing:"-0.01em"}}>
                {site?SITES[site].sub:"Enterprise Network Overview"}
              </div>
              <div style={{fontFamily:"JetBrains Mono,monospace",fontSize:10.5,color:"#8b93ab",letterSpacing:"0.1em",textTransform:"uppercase",marginTop:2}}>
                {site?`${site.toUpperCase()} · ${isTopo?"Internal Topology":"End-User Devices"}`:"HQ · DC · DR · Branch-1 · Branch-2"}
              </div>
            </div>

            {site && (
              <button onClick={()=>setSite(null)} style={{
                marginLeft:"auto",appearance:"none",border:"1px solid #e6e9f2",background:"#fff",
                color:"#0f1530",padding:"8px 16px",borderRadius:10,cursor:"pointer",
                fontFamily:"inherit",fontSize:13,fontWeight:600,
                display:"flex",alignItems:"center",gap:6,transition:"all .2s",
              }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor="#5b8def";e.currentTarget.style.color="#5b8def";}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor="#e6e9f2";e.currentTarget.style.color="#0f1530";}}>
                ← Overview
              </button>
            )}

            <div style={{
              marginLeft:site?"8px":"auto",
              padding:"5px 12px",borderRadius:999,
              background:"rgba(16,185,129,0.1)",color:"#10b981",
              fontFamily:"JetBrains Mono,monospace",fontSize:10,fontWeight:800,letterSpacing:"0.1em",
              display:"flex",alignItems:"center",gap:6,
            }}>
              <div style={{width:6,height:6,borderRadius:"50%",background:"#10b981",animation:"pulse2 1.5s infinite"}}/>
              ALL SITES NOMINAL
            </div>
          </div>

          {/* Canvas */}
          <div style={{padding:28,minHeight:460}}>
            {!site && (
              <>
                <div style={{display:"flex",gap:18,marginBottom:18,flexWrap:"wrap",fontFamily:"JetBrains Mono,monospace",fontSize:10,color:"#8b93ab"}}>
                  {[
                    {col:"#5b8def",label:"HQ — Headquarters"},
                    {col:"#f97316",label:"DC — Data Center"},
                    {col:"#8b5cf6",label:"DR — Disaster Recovery"},
                    {col:"#10b981",label:"Branch Offices"},
                  ].map((l,i)=>(
                    <div key={i} style={{display:"flex",alignItems:"center",gap:6}}>
                      <div style={{width:9,height:9,borderRadius:3,background:l.col}}/>
                      {l.label}
                    </div>
                  ))}
                </div>
                <OverviewMap activeSite={site} onSiteClick={setSite}/>
              </>
            )}
            {isTopo && <TopoView site={site}/>}
            {isDevs && <SitePanel site={site}/>}
          </div>
        </div>

        {/* Quick nav pills */}
        <div style={{display:"flex",gap:8,marginTop:14,flexWrap:"wrap"}}>
          {Object.values(SITES).map(sv=>(
            <button key={sv.id} onClick={()=>setSite(site===sv.id?null:sv.id)} style={{
              padding:"7px 16px",borderRadius:999,
              border:`1.5px solid ${site===sv.id?sv.col:"#e6e9f2"}`,
              background:site===sv.id?`${sv.col}12`:"#fff",
              color:site===sv.id?sv.col:"#4a5578",
              fontFamily:"JetBrains Mono,monospace",fontSize:11,fontWeight:700,
              cursor:"pointer",letterSpacing:"0.08em",transition:"all 0.2s",
              display:"flex",alignItems:"center",gap:6,
            }}>
              <div style={{width:6,height:6,borderRadius:"50%",background:sv.col}}/>
              {sv.label} — {sv.sub}
            </button>
          ))}
        </div>

        <div style={{marginTop:22,paddingTop:16,borderTop:"1px solid #e6e9f2",
          color:"#8b93ab",fontFamily:"JetBrains Mono,monospace",fontSize:10,
          letterSpacing:"0.14em",textTransform:"uppercase",
          display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
          <span>Enterprise Network · SD-WAN · Veeam Protected</span>
          <span>HQ · DC · DR · B1 · B2</span>
        </div>
      </div>
    </div>
  );
}
