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
  dr1: {id:"dr1", label:"DR-1",sub:"Disaster Recovery 1",col:"#a855f7", col2:"#ec4899", floors:5},
  b1:  {id:"b1",  label:"B1",  sub:"Branch Office 1",   col:"#10b981", col2:"#06b6d4", floors:3},
  b2:  {id:"b2",  label:"B2",  sub:"Branch Office 2",   col:"#10b981", col2:"#06b6d4", floors:3},
};

const ISPS = [
  {id:"isp1",label:"ISP-1",name:"Mobicom",        col:"#38bdf8", bw:"10G",  health:"good"},
  {id:"isp2",label:"ISP-2",name:"Unitel Fiber",   col:"#10b981", bw:"10G",  health:"good"},
  {id:"isp3",label:"ISP-3",name:"Univision",      col:"#eab308", bw:"1G",   health:"warn"},
  {id:"isp4",label:"ISP-4",name:"Skytel",          col:"#a855f7", bw:"1G",   health:"good"},
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
  dr1:[
    {id:"sdwan-dr1",label:"SD-WAN Edge",  icon:"sdwan",   col:"#a855f7",x:50,y:9},
    {id:"fw-dr1a",  label:"FW Cluster",   icon:"firewall",col:"#ef4444",x:35,y:22},
    {id:"sw-dr1",   label:"Core Switch",  icon:"switch",  col:"#10b981",x:50,y:36},
    {id:"vm-dr1",   label:"VMware DR",    icon:"vm",      col:"#a855f7",x:22,y:52},
    {id:"rep-dr1",  label:"Veeam Replica",icon:"backup",  col:"#10b981",x:50,y:52,badge:true},
    {id:"str-dr1",  label:"DR Storage",   icon:"storage", col:"#eab308",x:74,y:52},
  ],
};

function getSiteIspCount(site){
  return site === "hq" ? 4 : 2;
}

function getHops(site){
  const ispLabel=`${getSiteIspCount(site)}×ISP`;
  if(site==="b1"||site==="b2") return [
    {label:"Access Switch", icon:"switch",  col:"#10b981",ms:0},
    {label:"Core Switch",   icon:"switch",  col:"#06b6d4",ms:130},
    {label:"Firewall",      icon:"firewall",col:"#ef4444",ms:260},
    {label:"SD-WAN Edge",   icon:"sdwan",   col:"#38bdf8",ms:390},
    {label:ispLabel,         icon:"isp",     col:"#a855f7",ms:520},
    {label:"iNET Fabric",   icon:"cloud",   col:"#6366f1",ms:650},
    {label:"DC-1 Firewall", icon:"firewall",col:"#ef4444",ms:780},
    {label:"DC-1 Core",     icon:"switch",  col:"#f97316",ms:900},
  ];
  return [
    {label:"Access Switch", icon:"switch",  col:"#38bdf8",ms:0},
    {label:"Core Switch",   icon:"switch",  col:"#38bdf8",ms:130},
    {label:"Firewall",      icon:"firewall",col:"#ef4444",ms:270},
    {label:"SD-WAN Edge",   icon:"sdwan",   col:"#06b6d4",ms:400},
    {label:ispLabel,         icon:"isp",     col:"#a855f7",ms:530},
    {label:"iNET / Cloud",  icon:"cloud",   col:"#6366f1",ms:660},
  ];
}

const SITE_SOLUTION_TEMPLATE = [
  {id:"access", label:"Access Switch", icon:"switch", col:"#10b981", x:38, y:42},
  {id:"core", label:"Core Switch", icon:"switch", col:"#06b6d4", x:52, y:42},
  {id:"firewall", label:"Firewall", icon:"firewall", col:"#ef4444", x:65, y:42},
  {id:"sdwan", label:"SD-WAN Edge", icon:"sdwan", col:"#38bdf8", x:78, y:42},
  {id:"isp", label:"4×ISP", icon:"isp", col:"#a855f7", x:90, y:24},
  {id:"inet", label:"iNET Fabric", icon:"cloud", col:"#6366f1", x:90, y:56},
  {id:"dcfw", label:"DC-1 Firewall", icon:"firewall", col:"#f97316", x:78, y:74},
  {id:"dccore", label:"DC-1 Core", icon:"switch", col:"#f97316", x:63, y:74},
  {id:"apps", label:"Apps / AD / Mail", icon:"server", col:"#38bdf8", x:48, y:74},
  {id:"veeam", label:"Veeam Backup", icon:"backup", col:"#10b981", x:33, y:74, badge:true},
];

const SITE_LINKS = [
  ["access","core"],["core","firewall"],["firewall","sdwan"],
  ["sdwan","isp"],["isp","inet"],["inet","dcfw"],["dcfw","dccore"],["dccore","apps"],["apps","veeam"]
];

const SITE_TRAFFIC_PATH = ["access","core","firewall","sdwan","isp","inet","dcfw","dccore","apps","veeam"];

function getSiteSolutionFlow(site,id){
  const siteLabel=SITES[site]?.label||site?.toUpperCase?.()||"SITE";
  const ispCount=getSiteIspCount(site);
  const flows={
    access:{
      path:["access"],
      visible:["access"],
      showDevices:true,
      description:`This view shows how endpoint traffic starts in the end devices zone and lands on the ${siteLabel} access layer.`
    },
    core:{
      path:["access","core"],
      visible:["access","core"],
      showDevices:true,
      description:`This view shows the normal path from end devices into the access switch and then into the ${siteLabel} core switch for LAN aggregation and routing.`
    },
    firewall:{
      path:["access","core","firewall"],
      visible:["access","core","firewall"],
      showDevices:true,
      description:`This view shows endpoint traffic moving from the end devices zone through access and core switching, then reaching the firewall for local inspection and policy enforcement.`
    },
    sdwan:{
      path:["access","core","firewall","sdwan"],
      visible:["access","core","firewall","sdwan"],
      showDevices:true,
      description:`This view shows user traffic moving from end devices through access, core, and firewall, then arriving at the SD-WAN edge for WAN path selection.`
    },
    isp:{
      path:["access","core","firewall","sdwan","isp"],
      visible:["access","core","firewall","sdwan","isp"],
      showDevices:true,
      description:`This view shows the WAN handoff path: end devices → access → core → firewall → SD-WAN → ${ispCount}-link ISP bundle.`
    },
    inet:{
      path:["access","core","firewall","sdwan","isp","inet"],
      visible:["access","core","firewall","sdwan","isp","inet"],
      showDevices:true,
      description:`This view shows the inter-site transport path from end devices through the local site stack and out across ${ispCount} ISP uplinks into the iNET fabric.`
    },
    dcfw:{
      path:["access","core","firewall","sdwan","isp","inet","dcfw"],
      visible:["access","core","firewall","sdwan","isp","inet","dcfw"],
      showDevices:true,
      description:`This view shows the secure path from end devices through the local site and iNET, ending at the Imperva / DC security layer for data center entry inspection.`
    },
    apps:{
      path:["access","core","firewall","sdwan","isp","inet","dcfw","dccore","apps"],
      visible:["access","core","firewall","sdwan","isp","inet","dcfw","dccore","apps"],
      showDevices:true,
      description:`This view shows business-service access from end devices through the full site and WAN path into the DC core and finally the Apps / AD / Mail service zone.`
    },
    veeam:{
      path:["access","core","firewall","sdwan","isp","inet","dcfw","dccore","apps","veeam"],
      visible:["access","core","firewall","sdwan","isp","inet","dcfw","dccore","apps","veeam"],
      showDevices:true,
      description:`This view shows the backup-related path from end devices through the local site, WAN, iNET, and DC services, ending at the Veeam backup and recovery platform.`
    },
  };
  return flows[id] || {
    path:["access","core","firewall","sdwan"],
    visible:["access","core","firewall","sdwan"],
    showDevices:true,
    description:"Click a solution or end device to show the actual traffic path starting from end devices and continuing only through the components used by that solution."
  };
}

function getSiteDeviceFlow(site,device){
  const ispCount=getSiteIspCount(site);
  return {
    path:["access","core","firewall","sdwan","isp","inet","dcfw","dccore","apps","veeam"],
    visible:["access","core","firewall","sdwan","isp","inet","dcfw","dccore","apps","veeam"],
    showDevices:true,
    description:`${device?.label||"Selected endpoint"} traffic is highlighted end-to-end from the end devices zone through access, core, firewall, SD-WAN, the ${ispCount}-link ISP bundle, the iNET fabric, and into DC service and backup zones.`
  };
}

function solutionDescription(id,siteLabel){
  return getSiteSolutionFlow("hq", id).description;
}

function getSiteDevicePositions(site){
  const devices=SITE_DEVICES[site]||[];
  const columns = site === "hq" ? 3 : 2;
  const startX = site === "hq" ? 10.5 : 12.5;
  const gapX = site === "hq" ? 8.2 : 10.5;
  const startY = site === "hq" ? 22 : 26;
  const gapY = site === "hq" ? 16 : 18;
  return devices.map((d,i)=>({
    ...d,
    x:startX+(i%columns)*gapX,
    y:startY+Math.floor(i/columns)*gapY,
    col:SITES[site].col,
  }));
}

function mapIntoBand(value,left,width){
  return left + (value/100)*width;
}

const SITE_BAND = { left: 7, width: 86 };
const DC_BAND = { left: 7, width: 86 };

function getSiteSolutionCatalog(site){
  const siteLabel=SITES[site]?.label||site?.toUpperCase?.()||"SITE";
  const ispCount=getSiteIspCount(site);
  return [
    {id:"access", title:`${siteLabel} Access Network`, sub:"Endpoints / VLAN access"},
    {id:"core", title:"Core Switching", sub:"LAN aggregation / routing"},
    {id:"firewall", title:"Sophos Firewall", sub:"North-south policy control"},
    {id:"sdwan", title:"SD-WAN Edge", sub:"Path steering / WAN control"},
    {id:"isp", title:`${ispCount}× ISP Bundle`, sub:"Site WAN uplinks"},
    {id:"inet", title:"iNET Fabric", sub:"Inter-site secure transport"},
    {id:"dcfw", title:"Imperva / DC Security", sub:"DC entry inspection"},
    {id:"apps", title:"Apps / AD / Mail", sub:"Business service landing zone"},
    {id:"veeam", title:"Veeam Backup", sub:"Backup and recovery"},
  ];
}

function getDcSolutionCatalog(site){
  if(site==="dc1") return [
    {id:"sdwan1", title:"SD-WAN Edge", sub:"WAN/DC ingress"},
    {id:"fw1a", title:"Sophos Firewall Cluster", sub:"Perimeter security"},
    {id:"core1", title:"Core Switch L3", sub:"DC aggregation fabric"},
    {id:"vm1", title:"VMware Cluster", sub:"Compute workloads"},
    {id:"web1", title:"Imperva / Web Tier", sub:"Application delivery"},
    {id:"mail1", title:"Mail Services", sub:"Messaging"},
    {id:"ad1", title:"Active Directory", sub:"Identity services"},
    {id:"san1", title:"SAN Storage", sub:"Primary data store"},
    {id:"veeam1", title:"Veeam Backup", sub:"Backup orchestrator"},
    {id:"tape1", title:"Tape Library", sub:"Archive / retention"},
  ];
  return [
    {id:"sdwan-dr1", title:"SD-WAN Edge", sub:"DR WAN ingress"},
    {id:"fw-dr1a", title:"Sophos Firewall", sub:"DR perimeter security"},
    {id:"sw-dr1", title:"DR Core Switch", sub:"DR traffic aggregation"},
    {id:"vm-dr1", title:"VM Replica Cluster", sub:"Recovered workloads"},
    {id:"rep-dr1", title:"Replication Services", sub:"Replica / sync engine"},
    {id:"str-dr1", title:"DR Storage", sub:"Recovery data store"},
  ];
}

function SiteTopoNode({node,isActive,onClick}){
  const I=Ic[node.icon]||Ic.server;
  return(
    <button onClick={onClick} className="topo-click-node" style={{
      position:"absolute",left:`${node.x}%`,top:`${node.y}%`,transform:"translate(-50%,-50%)",
      display:"flex",flexDirection:"column",alignItems:"center",gap:5,zIndex:4,
      background:"transparent",border:0,cursor:"pointer",color:node.col,minWidth:88,
    }}>
      <div style={{width:58,height:58,borderRadius:16,position:"relative",
        background:isActive?`linear-gradient(135deg,${node.col}55,${node.col}18)`:"rgba(3,15,34,0.92)",
        border:`1.5px solid ${isActive?node.col:`${node.col}55`}`,
        display:"grid",placeItems:"center",
        boxShadow:isActive?`0 0 30px ${node.col}66, inset 0 0 18px ${node.col}18`:`0 0 12px ${node.col}18`,
        transition:"all .25s ease"}}>
        <I style={{width:25,height:25,color:node.col}}/>
        {node.badge&&<div style={{position:"absolute",top:-5,right:-5,width:13,height:13,borderRadius:"50%",background:"#10b981",border:"2px solid #020b18",boxShadow:"0 0 10px #10b981",animation:"blink 1.4s infinite"}}/>}
        {isActive&&<div style={{position:"absolute",inset:-6,borderRadius:22,border:`1px solid ${node.col}`,animation:"dPulse 1.4s ease-out infinite",pointerEvents:"none"}}/>}
      </div>
      <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,fontWeight:800,letterSpacing:"0.07em",lineHeight:1.25,
        color:isActive?node.col:"#5ca1c8",textAlign:"center",textShadow:isActive?`0 0 8px ${node.col}`:"none"}}>
        {node.label}
      </div>
    </button>
  );
}

function SiteTopologyView({site}){
  const [selected,setSelected]=useState({type:"solution",id:"sdwan",label:"SD-WAN Edge",icon:"sdwan",col:"#38bdf8"});
  const s=SITES[site];
  const ispLabel=`${getSiteIspCount(site)}×ISP`;
  const solutionNodes=SITE_SOLUTION_TEMPLATE.map(n=>({
    ...n,
    label:n.id==="isp"?ispLabel:n.label,
    x: mapIntoBand(n.x, SITE_BAND.left, SITE_BAND.width)
  }));
  const deviceNodes=getSiteDevicePositions(site).map(d=>({...d, x: mapIntoBand(d.x, SITE_BAND.left, SITE_BAND.width)}));
  const nodeById=Object.fromEntries(solutionNodes.map(n=>[n.id,n]));
  const solutionCatalog=getSiteSolutionCatalog(site);
  const flowConfig=selected?.type==="device" ? getSiteDeviceFlow(site,selected) : getSiteSolutionFlow(site,selected?.id);
  const activePath=flowConfig.path;
  const visibleNodeIds=new Set(flowConfig.visible || activePath);
  const showDevices=selected?.type==="device" ? true : !!flowConfig.showDevices;
  const activeLinks=new Set(activePath.slice(0,-1).map((id,i)=>`${id}-${activePath[i+1]}`));
  const visibleSolutionNodes=solutionNodes.filter(n=>visibleNodeIds.has(n.id));
  const visibleDeviceNodes=showDevices ? deviceNodes : [];
  const SelectedIcon=Ic[selected?.icon]||Ic.activity;

  return(
    <div style={{animation:"fadeIn .35s ease"}}>
      <div style={{fontSize:9.5,fontFamily:"'JetBrains Mono',monospace",letterSpacing:"0.22em",
        color:"#2a5a7a",textTransform:"uppercase",fontWeight:700,marginBottom:14,
        display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
        <div style={{width:6,height:6,borderRadius:"50%",background:s.col,boxShadow:`0 0 8px ${s.col}`,animation:"blink 1.5s infinite"}}/>
        {s.sub} · responsive site topology · click any solution or end device
      </div>

      <div className="topology-overlay-shell site-topology-shell">
        <div className="overlay-panel overlay-panel-left">
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:8}}>
            <div>
              <div style={{fontSize:12,fontWeight:800,color:"#c8e8ff",letterSpacing:".04em"}}>Solutions</div>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:"#2a5a7a",letterSpacing:".12em",textTransform:"uppercase"}}>click to highlight traffic</div>
            </div>
            <div style={{padding:"4px 8px",borderRadius:999,border:`1px solid ${s.col}30`,background:`${s.col}10`,fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:s.col}}>{s.label}</div>
          </div>
          <div className="solution-list">
            {solutionCatalog.map(item=>{
              const node=nodeById[item.id];
              const active=selected?.id===item.id;
              const I=Ic[node?.icon]||Ic.server;
              return (
                <button key={item.id} className="solution-btn" onClick={()=>setSelected({type:"solution",...node})} style={{borderColor:active?(node?.col||s.col):"#0f2942",background:active?`${node?.col||s.col}12`:"rgba(3,15,34,.78)",boxShadow:active?`0 0 18px ${(node?.col||s.col)}22`:"none"}}>
                  <div style={{width:34,height:34,borderRadius:10,display:"grid",placeItems:"center",background:active?`${node?.col||s.col}18`:"rgba(2,10,24,.94)",border:`1px solid ${active?(node?.col||s.col):`${node?.col||s.col}35`}`}}>
                    <I style={{width:16,height:16,color:node?.col||s.col}}/>
                  </div>
                  <div style={{textAlign:"left",minWidth:0}}>
                    <div style={{fontSize:11.5,fontWeight:800,color:active?(node?.col||"#c8e8ff"):"#a8d8f0",letterSpacing:".03em"}}>{item.title}</div>
                    <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:7.5,color:"#2a5a7a",letterSpacing:".08em",textTransform:"uppercase"}}>{item.sub}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="topology-stage topology-stage-wide">
          <div style={{position:"absolute",inset:0,backgroundImage:"radial-gradient(circle,rgba(56,189,248,.08) 1px,transparent 1px)",backgroundSize:"28px 28px",pointerEvents:"none"}}/>
          <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none"}} viewBox="0 0 1280 720" preserveAspectRatio="xMidYMid meet">
            <defs>
              <filter id={`siteGlow-${site}`}><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
              <radialGradient id={`siteInet-${site}`} cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#6366f1" stopOpacity=".18"/><stop offset="100%" stopColor="#6366f1" stopOpacity="0"/></radialGradient>
            </defs>
            <circle cx="960" cy="395" r="120" fill={`url(#siteInet-${site})`}/>
            {SITE_LINKS.map(([a,b],i)=>{
              if(!visibleNodeIds.has(a) || !visibleNodeIds.has(b)) return null;
              const n1=nodeById[a], n2=nodeById[b];
              const x1=n1.x/100*1280, y1=n1.y/100*720, x2=n2.x/100*1280, y2=n2.y/100*720;
              const col=n2.col||s.col;
              const active=activeLinks.has(`${a}-${b}`);
              const cx=(x1+x2)/2, cy=(y1+y2)/2-((a==="isp"||b==="isp")?48:0);
              const d=`M${x1},${y1} Q${cx},${cy} ${x2},${y2}`;
              return(
                <g key={`${a}-${b}`}>
                  <path d={d} fill="none" stroke={col} strokeWidth={active?8:5} opacity={active ? .18 : .06}/>
                  <path id={`site-path-${site}-${i}`} d={d} fill="none" stroke={col} strokeWidth={active?2.2:1.2}
                    strokeDasharray="8,5" opacity={active ? .95 : .28} filter={active?`url(#siteGlow-${site})`:"none"}>
                    <animate attributeName="stroke-dashoffset" from="13" to="0" dur={`${1.1+i*.08}s`} repeatCount="indefinite"/>
                  </path>
                  {active&&<>
                    <circle r="4.8" fill={col} filter={`url(#siteGlow-${site})`}>
                      <animateMotion dur={`${1.15+i*.08}s`} repeatCount="indefinite"><mpath href={`#site-path-${site}-${i}`}/></animateMotion>
                    </circle>
                    <circle r="3" fill={col} opacity=".55">
                      <animateMotion dur={`${1.15+i*.08}s`} repeatCount="indefinite" begin="-.55s"><mpath href={`#site-path-${site}-${i}`}/></animateMotion>
                    </circle>
                  </>}
                </g>
              );
            })}
            {visibleDeviceNodes.map((d,i)=>{
              const access=nodeById.access;
              const x1=d.x/100*1280,y1=d.y/100*720,x2=access.x/100*1280,y2=access.y/100*720;
              const active=selected?.id===d.id;
              return <g key={d.id}>
                <path id={`dev-path-${d.id}`} d={`M${x1},${y1} Q${(x1+x2)/2},${Math.min(y1,y2)-20} ${x2},${y2}`} fill="none"/>
                <use href={`#dev-path-${d.id}`} stroke={s.col} strokeWidth={active?2:1} strokeDasharray="5,4" opacity={active ? .9 : .25}/>
                {active&&<circle r="3.4" fill={s.col} filter={`url(#siteGlow-${site})`}><animateMotion dur={`${1+i*.08}s`} repeatCount="indefinite"><mpath href={`#dev-path-${d.id}`}/></animateMotion></circle>}
              </g>
            })}
          </svg>

          <div style={{position:"absolute",left:18,top:16,zIndex:5,padding:"7px 12px",borderRadius:9,border:"1px solid #0f3a60",background:"rgba(2,14,32,.84)",fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:"#5ca1c8",letterSpacing:".12em"}}>
            {s.label} LIVE SITE TOPOLOGY
          </div>

          {visibleDeviceNodes.map(d=>{
            const I=Ic[d.type]||Ic.desktop;
            const isActive=selected?.id===d.id;
            return(
              <button key={d.id} onClick={()=>setSelected({type:"device",...d,label:d.label,icon:d.type,col:s.col})}
                style={{position:"absolute",left:`${d.x}%`,top:`${d.y}%`,transform:"translate(-50%,-50%)",zIndex:4,
                  display:"flex",flexDirection:"column",alignItems:"center",gap:4,width:64,cursor:"pointer",background:"transparent",border:0}}>
                <div style={{width:40,height:40,borderRadius:12,display:"grid",placeItems:"center",background:isActive?`linear-gradient(135deg,${s.col}44,${s.col2}18)`:"rgba(4,14,32,.88)",border:`1.2px solid ${isActive?s.col:`${s.col}35`}`,boxShadow:isActive?`0 0 20px ${s.col}55`:"none",position:"relative"}}>
                  <I style={{width:19,height:19,color:isActive?s.col:"#3b789b"}}/>
                  {isActive&&<span style={{position:"absolute",top:3,right:3,width:6,height:6,borderRadius:"50%",background:s.col,boxShadow:`0 0 7px ${s.col}`,animation:"blink 1s infinite"}}/>}
                </div>
                <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:7.2,fontWeight:800,color:isActive?s.col:"#3b789b",textAlign:"center",letterSpacing:".05em"}}>{d.label}</span>
              </button>
            );
          })}

          {showDevices && visibleDeviceNodes.length > 0 && (() => {
            const xs = visibleDeviceNodes.map(d => d.x);
            const ys = visibleDeviceNodes.map(d => d.y);
            const paddingX = 5;
            const paddingY = 6;
            const minX = Math.min(...xs);
            const maxX = Math.max(...xs);
            const minY = Math.min(...ys);
            const maxY = Math.max(...ys);
            const left = minX - paddingX;
            const top = minY - paddingY;
            const width = maxX - minX + paddingX * 2;
            const height = maxY - minY + paddingY * 2;

            return (
              <>
                <div
                  style={{
                    position: "absolute",
                    left: `${left}%`,
                    top: `${top}%`,
                    zIndex: 2,
                    width: `${width}%`,
                    height: `${height}%`,
                    borderRadius: 18,
                    border: `1px solid ${s.col}26`,
                    background: "rgba(3,15,34,.28)",
                    boxShadow: `inset 0 0 26px ${s.col}08`,
                    pointerEvents: "none",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    left: `${left + 1}%`,
                    top: `${top + 1.5}%`,
                    zIndex: 4,
                    fontFamily: "'JetBrains Mono',monospace",
                    fontSize: 8.5,
                    color: s.col,
                    letterSpacing: ".18em",
                    fontWeight: 800,
                    textTransform: "uppercase",
                    pointerEvents: "none",
                  }}
                >
                  End devices zone
                </div>
              </>
            );
          })()}
          {visibleSolutionNodes.map(n=><SiteTopoNode key={n.id} node={n} isActive={selected?.id===n.id} onClick={()=>setSelected({type:"solution",...n})}/>) }
        </div>

        <div className="overlay-panel overlay-panel-right">
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:4}}>
            <div style={{width:42,height:42,borderRadius:12,display:"grid",placeItems:"center",background:`${(selected?.col||s.col)}18`,border:`1px solid ${(selected?.col||s.col)}66`}}>
              <SelectedIcon style={{width:20,height:20,color:selected?.col||s.col}}/>
            </div>
            <div>
              <div style={{fontSize:13,fontWeight:800,color:"#c8e8ff",letterSpacing:".04em"}}>Traffic Hub</div>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:"#2a5a7a",letterSpacing:".12em",textTransform:"uppercase"}}>selected path visibility</div>
            </div>
          </div>

          <div style={{padding:"12px 0",borderTop:"1px solid #071828",borderBottom:"1px solid #071828"}}>
            <div style={{fontSize:14,fontWeight:800,color:selected?.col||s.col,marginBottom:4}}>{selected?.label||"Traffic path"}</div>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:"#2a5a7a",letterSpacing:".12em",textTransform:"uppercase",marginBottom:10}}>
              {selected?.type==="device"?`${selected.ip} · ${selected.os}`:"Solution traffic visibility"}
            </div>
            <p style={{fontSize:11.5,lineHeight:1.6,color:"#7fb6d8"}}>
              {flowConfig.description}
            </p>
          </div>

          <div>
            <div style={{fontSize:10,fontWeight:700,color:"#7fb6d8",marginBottom:8}}>Highlighted Path</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
              {activePath.map((id,i)=>{
                const n=nodeById[id];
                return <span key={id} style={{fontFamily:"'JetBrains Mono',monospace",fontSize:7.5,color:n?.col||s.col,border:`1px solid ${(n?.col||s.col)}35`,borderRadius:999,padding:"4px 7px",background:`${(n?.col||s.col)}0f`}}>{i+1}. {n?.label||id}</span>
              })}
            </div>
          </div>

          <div style={{marginTop:"auto",paddingTop:10,borderTop:"1px solid #071828"}}>
            <div style={{display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:8}}>
              <div style={{padding:"10px 12px",borderRadius:12,border:"1px solid #0f2942",background:"rgba(3,15,34,.7)"}}>
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:"#2a5a7a",textTransform:"uppercase",letterSpacing:".12em"}}>Mode</div>
                <div style={{marginTop:4,fontSize:12,color:"#c8e8ff",fontWeight:800}}>{selected?.type==="device"?"Endpoint Flow":"Solution Flow"}</div>
              </div>
              <div style={{padding:"10px 12px",borderRadius:12,border:"1px solid #0f2942",background:"rgba(3,15,34,.7)"}}>
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:"#2a5a7a",textTransform:"uppercase",letterSpacing:".12em"}}>Scope</div>
                <div style={{marginTop:4,fontSize:12,color:"#c8e8ff",fontWeight:800}}>{s.sub}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
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

  const POS={
    hq: {x:8,  y:32},
    b1: {x:8,  y:62},
    b2: {x:38, y:75},
    dc1:{x:74, y:22},
    dr1:{x:74, y:62},
  };
  const INET={x:50,y:46};

  const linkGroups=[
    {site:"hq",  col:"#38bdf8", count:4, label:"4 WAN uplinks", dur:"1.15s", width:2.35, bend:-34},
    {site:"b1",  col:"#10b981", count:2, label:"2 WAN uplinks", dur:"1.7s",  width:1.7,  bend:24},
    {site:"b2",  col:"#06b6d4", count:2, label:"2 WAN uplinks", dur:"1.9s",  width:1.7,  bend:56},
    {site:"dc1", col:"#f97316", count:1, label:"DC uplink",    dur:"1.35s", width:2.2,  bend:-26},
    {site:"dr1", col:"#a855f7", count:1, label:"DR uplink",    dur:"1.8s",  width:1.6,  bend:28},
  ];

  const badgeMap={hq:"4 LINKS", b1:"2 LINKS", b2:"2 LINKS", dc1:"DC WAN", dr1:"DR WAN"};

  return(
    <div style={{position:"relative",width:"100%",height:580}}>
      <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none"}}
        viewBox="0 0 1100 580" preserveAspectRatio="xMidYMid meet">
        <defs>
          <pattern id="dots" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
            <circle cx="15" cy="15" r="0.8" fill="#0a2a4a" opacity="0.7"/>
          </pattern>
          <filter id="glow-svg"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          <filter id="glow-sm"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          <radialGradient id="inetAura" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.18"/>
            <stop offset="55%" stopColor="#6366f1" stopOpacity="0.08"/>
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0"/>
          </radialGradient>
        </defs>

        <rect width="1100" height="580" fill="url(#dots)"/>
        <circle cx="550" cy="267" r="118" fill="url(#inetAura)"/>

        {linkGroups.map(group=>{
          const p=POS[group.site];
          const x1=p.x/100*1100;
          const y1=p.y/100*580;
          const x2=INET.x/100*1100;
          const y2=INET.y/100*580;
          const dx=x2-x1;
          const dy=y2-y1;
          const len=Math.hypot(dx,dy)||1;
          const nx=-dy/len;
          const ny=dx/len;
          const offsets=Array.from({length:group.count},(_,i)=>(i-(group.count-1)/2)*10);
          const isHov=hov===group.site||activeSite===group.site;
          const midX=(x1+x2)/2;
          const midY=(y1+y2)/2 + group.bend - 18;
          return (
            <g key={group.site}>
              {offsets.map((off,idx)=>{
                const sx=x1+nx*off;
                const sy=y1+ny*off;
                const tx=x2+nx*off*0.2;
                const ty=y2+ny*off*0.12;
                const cx=(sx+tx)/2 + nx*off*0.4;
                const cy=(sy+ty)/2 + group.bend + (idx-(group.count-1)/2)*2;
                const id=`ov-${group.site}-${idx}`;
                const d=`M${sx},${sy} Q${cx},${cy} ${tx},${ty}`;
                return (
                  <g key={id}>
                    <path d={d} fill="none" stroke={group.col} strokeWidth={group.width*3} opacity={isHov?0.18:0.07}/>
                    <path id={id} d={d} fill="none" stroke={group.col}
                      strokeWidth={isHov?group.width*1.55:group.width}
                      strokeDasharray="8,5" opacity={isHov?0.98:0.56}
                      filter={isHov?"url(#glow-sm)":"none"}>
                      <animate attributeName="stroke-dashoffset" from="13" to="0" dur={group.dur} repeatCount="indefinite"/>
                    </path>
                    <circle r={isHov?5.8:4.2} fill={group.col} filter="url(#glow-sm)" opacity={isHov?1:0.78}>
                      <animateMotion dur={group.dur} repeatCount="indefinite" begin={`-${idx*0.18}s`}>
                        <mpath href={`#${id}`}/>
                      </animateMotion>
                    </circle>
                    <circle r={isHov?3.6:2.8} fill={group.col} opacity={isHov?0.55:0.34}>
                      <animateMotion dur={group.dur} repeatCount="indefinite" begin={`-${0.55+idx*0.12}s`}>
                        <mpath href={`#${id}`}/>
                      </animateMotion>
                    </circle>
                  </g>
                );
              })}
              {isHov&&(
                <g>
                  <rect x={midX-38} y={midY-10} width="76" height="18" rx="5" fill={`${group.col}20`} stroke={`${group.col}88`} strokeWidth="0.8"/>
                  <text x={midX} y={midY+2} textAnchor="middle" fontSize="9" fill={group.col}
                    fontFamily="'JetBrains Mono',monospace" fontWeight="700" letterSpacing="0.08em">{group.label}</text>
                </g>
              )}
            </g>
          );
        })}

        {[['dc1','dr1','#a855f7']].map(([a,b,col],i)=>{
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

      <div style={{
        position:"absolute",left:`${INET.x}%`,top:`${INET.y}%`,transform:"translate(-50%,-50%)",
        width:138,height:138,borderRadius:"50%",zIndex:6,pointerEvents:"none",
        background:"radial-gradient(circle at 50% 45%, rgba(56,189,248,.22), rgba(8,28,56,.95) 58%, rgba(2,14,32,.98) 100%)",
        border:"1px solid #0f3a60",
        boxShadow:"0 0 42px rgba(56,189,248,.18), inset 0 0 32px rgba(99,102,241,.12)",
        display:"grid",placeItems:"center"
      }}>
        <div style={{position:"absolute",inset:12,borderRadius:"50%",border:"1px dashed rgba(56,189,248,.35)"}}/>
        <div style={{position:"absolute",inset:28,borderRadius:"50%",border:"1px solid rgba(99,102,241,.28)"}}/>
        <div style={{textAlign:"center"}}>
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:28,fontWeight:900,letterSpacing:"0.16em",color:"#7dd3fc",textShadow:"0 0 14px rgba(56,189,248,.55)"}}>iNET</div>
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:"#4b93c0",letterSpacing:"0.28em"}}>SD-WAN FABRIC</div>
        </div>
      </div>

      {[
        {site:"hq", left:"4%", top:"18%"},
        {site:"b1", left:"4%", top:"53%"},
        {site:"b2", left:"34%", top:"65%"},
        {site:"dc1", right:"18%", top:"10%"},
        {site:"dr1", right:"18%", top:"54%"},
      ].map(item=>(
        <div key={item.site} style={{position:"absolute",zIndex:5,...item}}>
          <Building site={item.site} onClick={()=>onSiteClick(item.site)} isActive={activeSite===item.site} hovered={hov===item.site} onHover={setHov}/>
          <div style={{position:"absolute",top:-18,left:"50%",transform:"translateX(-50%)",padding:"3px 8px",borderRadius:999,
            background:`${SITES[item.site].col}12`,border:`1px solid ${SITES[item.site].col}33`,
            fontFamily:"'JetBrains Mono',monospace",fontSize:7.4,color:SITES[item.site].col,letterSpacing:".12em"}}>{badgeMap[item.site]}</div>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════ TOPOLOGY VIEW ═══ */
function TopoView({site}){
  const nodes=(DC_LAYERS[site]||[]).map(n=>({...n,x:mapIntoBand(n.x, DC_BAND.left, DC_BAND.width)}));
  const s=SITES[site];
  const [selected,setSelected]=useState(nodes[0]||null);
  if(!nodes.length) return null;

  const dcLinks = site==="dc1"
    ? [
        ["sdwan1","fw1a"],["sdwan1","fw1b"],["fw1a","core1"],["fw1b","core1"],
        ["core1","vm1"],["core1","mail1"],["core1","web1"],["core1","ad1"],
        ["vm1","veeam1"],["vm1","san1"],["veeam1","tape1"],["san1","tape1"]
      ]
    : [
        ["sdwan-dr1","fw-dr1a"],["fw-dr1a","sw-dr1"],["sw-dr1","vm-dr1"],
        ["sw-dr1","rep-dr1"],["sw-dr1","str-dr1"],["vm-dr1","rep-dr1"],["rep-dr1","str-dr1"]
      ];

  const pathMap = site==="dc1" ? {
    sdwan1:["sdwan1"], fw1a:["sdwan1","fw1a"], fw1b:["sdwan1","fw1b"], core1:["sdwan1","fw1a","core1"],
    vm1:["sdwan1","fw1a","core1","vm1"], mail1:["sdwan1","fw1a","core1","mail1"], web1:["sdwan1","fw1a","core1","web1"], ad1:["sdwan1","fw1a","core1","ad1"],
    veeam1:["sdwan1","fw1a","core1","vm1","veeam1"], san1:["sdwan1","fw1a","core1","vm1","san1"], tape1:["sdwan1","fw1a","core1","vm1","veeam1","tape1"],
  } : {
    "sdwan-dr1":["sdwan-dr1"], "fw-dr1a":["sdwan-dr1","fw-dr1a"], "sw-dr1":["sdwan-dr1","fw-dr1a","sw-dr1"],
    "vm-dr1":["sdwan-dr1","fw-dr1a","sw-dr1","vm-dr1"], "rep-dr1":["sdwan-dr1","fw-dr1a","sw-dr1","rep-dr1"], "str-dr1":["sdwan-dr1","fw-dr1a","sw-dr1","rep-dr1","str-dr1"],
  };

  const nodeById=Object.fromEntries(nodes.map(n=>[n.id,n]));
  const activePath=pathMap[selected?.id]||[nodes[0]?.id].filter(Boolean);
  const activeLinks=new Set(activePath.slice(0,-1).map((id,i)=>`${id}-${activePath[i+1]}`));
  const SelectedIcon=Ic[selected?.icon]||Ic.activity;
  const solutionCatalog=getDcSolutionCatalog(site);

  return(
    <div style={{animation:"fadeIn .35s ease"}}>
      <div style={{fontSize:9.5,fontFamily:"'JetBrains Mono',monospace",letterSpacing:"0.22em",
        color:"#2a5a7a",textTransform:"uppercase",fontWeight:700,marginBottom:14,
        display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
        <div style={{width:6,height:6,borderRadius:"50%",background:s.col,boxShadow:`0 0 8px ${s.col}`,animation:"blink 1.5s infinite"}}/>
        {s.sub} · responsive topology · click any solution to show traffic
      </div>

      <div className="topology-overlay-shell">
        <div className="overlay-panel overlay-panel-left">
          <div>
            <div style={{fontSize:12,fontWeight:800,color:"#c8e8ff",letterSpacing:".04em"}}>Solutions</div>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:"#2a5a7a",letterSpacing:".12em",textTransform:"uppercase"}}>dc / dr services list</div>
          </div>
          <div className="solution-list">
            {solutionCatalog.map(item=>{
              const node=nodeById[item.id] || nodeById.fw1a;
              const active=selected?.id===item.id;
              const I=Ic[node?.icon]||Ic.server;
              return (
                <button key={item.id} className="solution-btn" onClick={()=>node && setSelected(node)} style={{borderColor:active?(node?.col||s.col):"#0f2942",background:active?`${node?.col||s.col}12`:"rgba(3,15,34,.78)",boxShadow:active?`0 0 18px ${(node?.col||s.col)}22`:"none"}}>
                  <div style={{width:34,height:34,borderRadius:10,display:"grid",placeItems:"center",background:active?`${node?.col||s.col}18`:"rgba(2,10,24,.94)",border:`1px solid ${active?(node?.col||s.col):`${node?.col||s.col}35`}`}}>
                    <I style={{width:16,height:16,color:node?.col||s.col}}/>
                  </div>
                  <div style={{textAlign:"left",minWidth:0}}>
                    <div style={{fontSize:11.5,fontWeight:800,color:active?(node?.col||"#c8e8ff"):"#a8d8f0",letterSpacing:".03em"}}>{item.title}</div>
                    <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:7.5,color:"#2a5a7a",letterSpacing:".08em",textTransform:"uppercase"}}>{item.sub}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="topology-stage topology-stage-wide">
          <div style={{position:"absolute",inset:0,backgroundImage:"radial-gradient(circle,rgba(56,189,248,.08) 1px,transparent 1px)",backgroundSize:"28px 28px",pointerEvents:"none"}}/>
          <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none"}} viewBox="0 0 1280 720" preserveAspectRatio="xMidYMid meet">
            <defs>
              <filter id={`dcGlow-${site}`}><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
              <radialGradient id={`dcCore-${site}`} cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor={s.col} stopOpacity=".17"/><stop offset="100%" stopColor={s.col} stopOpacity="0"/></radialGradient>
            </defs>
            <circle cx="640" cy="390" r="185" fill={`url(#dcCore-${site})`}/>
            {dcLinks.map(([a,b],i)=>{
              const n1=nodeById[a],n2=nodeById[b];
              if(!n1||!n2) return null;
              const x1=n1.x/100*1280,y1=n1.y/100*720,x2=n2.x/100*1280,y2=n2.y/100*720;
              const col=n2.col||s.col;
              const active=activeLinks.has(`${a}-${b}`);
              const cx=(x1+x2)/2,cy=(y1+y2)/2-20;
              const d=`M${x1},${y1} Q${cx},${cy} ${x2},${y2}`;
              return(
                <g key={`${a}-${b}`}>
                  <path d={d} fill="none" stroke={col} strokeWidth={active?8:5} opacity={active ? .18 : .06}/>
                  <path id={`dc-path-${site}-${i}`} d={d} fill="none" stroke={col} strokeWidth={active?2.2:1.2}
                    strokeDasharray="8,5" opacity={active ? .95 : .30} filter={active?`url(#dcGlow-${site})`:"none"}>
                    <animate attributeName="stroke-dashoffset" from="13" to="0" dur={`${1.05+i*.08}s`} repeatCount="indefinite"/>
                  </path>
                  {active&&<>
                    <circle r="4.8" fill={col} filter={`url(#dcGlow-${site})`}>
                      <animateMotion dur={`${1.05+i*.08}s`} repeatCount="indefinite"><mpath href={`#dc-path-${site}-${i}`}/></animateMotion>
                    </circle>
                    <circle r="3" fill={col} opacity=".55">
                      <animateMotion dur={`${1.05+i*.08}s`} repeatCount="indefinite" begin="-.5s"><mpath href={`#dc-path-${site}-${i}`}/></animateMotion>
                    </circle>
                  </>}
                </g>
              );
            })}
          </svg>

          <div style={{position:"absolute",left:18,top:16,zIndex:5,padding:"7px 12px",borderRadius:9,border:"1px solid #0f3a60",background:"rgba(2,14,32,.84)",fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:"#5ca1c8",letterSpacing:".12em"}}>
            {s.label} LIVE TOPOLOGY
          </div>

          {nodes.map(n=><SiteTopoNode key={n.id} node={n} isActive={selected?.id===n.id} onClick={()=>setSelected(n)}/>)}
        </div>

        <div className="overlay-panel overlay-panel-right">
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:4}}>
            <div style={{width:42,height:42,borderRadius:12,display:"grid",placeItems:"center",background:`${(selected?.col||s.col)}18`,border:`1px solid ${(selected?.col||s.col)}66`}}>
              <SelectedIcon style={{width:20,height:20,color:selected?.col||s.col}}/>
            </div>
            <div>
              <div style={{fontSize:13,fontWeight:800,color:"#c8e8ff",letterSpacing:".04em"}}>Traffic Hub</div>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:"#2a5a7a",letterSpacing:".12em",textTransform:"uppercase"}}>selected service path</div>
            </div>
          </div>
          <div style={{padding:"12px 0",borderTop:"1px solid #071828",borderBottom:"1px solid #071828"}}>
            <div style={{fontSize:14,fontWeight:800,color:selected?.col||s.col,marginBottom:4}}>{selected?.label||"Traffic path"}</div>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:"#2a5a7a",letterSpacing:".12em",textTransform:"uppercase",marginBottom:10}}>Clickable DC/DR solution traffic visibility</div>
            <p style={{fontSize:11.5,lineHeight:1.6,color:"#7fb6d8"}}>
              {site==="dc1"
                ? `${selected?.label||"Selected node"} traffic is shown through the primary DC path from SD-WAN/firewall to core, applications, storage, and backup services.`
                : `${selected?.label||"Selected node"} traffic is shown through the DR path from SD-WAN/firewall to DR core, replica workloads, and DR storage.`}
            </p>
          </div>
          <div>
            <div style={{fontSize:10,fontWeight:700,color:"#7fb6d8",marginBottom:8}}>Highlighted Path</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
              {activePath.map((id,i)=>{
                const n=nodeById[id];
                return <span key={id} style={{fontFamily:"'JetBrains Mono',monospace",fontSize:7.5,color:n?.col||s.col,border:`1px solid ${(n?.col||s.col)}35`,borderRadius:999,padding:"4px 7px",background:`${(n?.col||s.col)}0f`}}>{i+1}. {n?.label||id}</span>
              })}
            </div>
          </div>
          <div style={{marginTop:"auto",paddingTop:10,borderTop:"1px solid #071828"}}>
            <div style={{display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:8}}>
              <div style={{padding:"10px 12px",borderRadius:12,border:"1px solid #0f2942",background:"rgba(3,15,34,.7)"}}>
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:"#2a5a7a",textTransform:"uppercase",letterSpacing:".12em"}}>Zone</div>
                <div style={{marginTop:4,fontSize:12,color:"#c8e8ff",fontWeight:800}}>{site==="dc1"?"Primary DC":"Recovery DC"}</div>
              </div>
              <div style={{padding:"10px 12px",borderRadius:12,border:"1px solid #0f2942",background:"rgba(3,15,34,.7)"}}>
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:"#2a5a7a",textTransform:"uppercase",letterSpacing:".12em"}}>Scope</div>
                <div style={{marginTop:4,fontSize:12,color:"#c8e8ff",fontWeight:800}}>{s.label}</div>
              </div>
            </div>
          </div>
        </div>
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
          {label:"LATENCY",    val:site==="dc1", col:"#38bdf8"},
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
  const isTopo=site&&["dc1","dr1"].includes(site);
  const isDevs=site&&["hq","b1","b2"].includes(site);

  const navItems=[
    {id:"hq", label:"HQ"},
    {id:"dc1",label:"DC-1"},

    {id:"dr1",label:"DR-1"},

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
        .topology-overlay-shell{position:relative;display:grid;grid-template-columns:minmax(180px,210px) minmax(0,1fr) minmax(205px,240px);gap:10px;align-items:stretch;min-height:clamp(500px,56vh,700px);width:100%;padding:10px;border:1px solid #071d33;border-radius:20px;background:linear-gradient(180deg,rgba(2,10,24,.72),rgba(2,14,32,.92));overflow:hidden}
        .site-topology-shell{grid-template-columns:minmax(210px,245px) minmax(0,1fr) minmax(175px,205px);height:clamp(560px,calc(100vh - 270px),760px);min-height:clamp(560px,calc(100vh - 270px),760px)}
        .site-topology-shell .topology-stage-wide{min-height:100%;height:100%}
        .topology-stage{position:relative;border-radius:16px;overflow:hidden;background:linear-gradient(180deg,rgba(2,10,24,.98),rgba(2,14,32,.99))}
        .topology-stage-wide{width:100%;height:100%;min-height:clamp(450px,50vh,640px);border:1px solid #0a2a4a;box-shadow:inset 0 0 40px rgba(56,189,248,.035)}
        .overlay-panel{position:relative;z-index:7;min-width:0;border-radius:16px;border:1px solid #0a2a4a;background:rgba(2,10,24,.92);padding:12px;display:flex;flex-direction:column;gap:10px;backdrop-filter:blur(6px);overflow:hidden}
        .overlay-panel-left,.overlay-panel-right{width:100%}
        .overview-map-shell{max-width:1320px;margin:0 auto;padding:0 10px}
        .solution-list{display:flex;flex-direction:column;gap:8px;min-height:0}
        .solution-btn{width:100%;display:flex;align-items:center;gap:10px;padding:9px 10px;border-radius:12px;border:1px solid #0f2942;cursor:pointer;transition:all .2s;background:rgba(3,15,34,.78);min-width:0}
        .solution-btn:hover{transform:translateY(-1px);border-color:#1b4b72}
        @media(max-width:1320px){.topology-overlay-shell{grid-template-columns:minmax(165px,190px) minmax(0,1fr) minmax(190px,220px);gap:10px;padding:10px}.site-topology-shell{grid-template-columns:minmax(195px,225px) minmax(0,1fr) minmax(165px,190px);height:clamp(540px,calc(100vh - 250px),720px);min-height:clamp(540px,calc(100vh - 250px),720px)}.overlay-panel{padding:10px}.solution-btn{padding:8px 9px;gap:8px}}
        @media(max-width:1160px){.topology-overlay-shell,.site-topology-shell{grid-template-columns:1fr 1fr;grid-template-areas:"stage stage" "left right";min-height:auto;height:auto}.topology-stage-wide{grid-area:stage;min-height:clamp(400px,50vw,560px);height:auto;aspect-ratio:16/9}.overlay-panel-left{grid-area:left}.overlay-panel-right{grid-area:right}.overlay-panel{min-height:240px}.solution-list{display:grid;grid-template-columns:repeat(2,minmax(0,1fr))}}
        @media(max-width:760px){.topology-overlay-shell,.site-topology-shell{grid-template-columns:1fr;grid-template-areas:"stage" "left" "right";padding:8px;height:auto;min-height:auto}.topology-stage-wide{min-height:340px}.overlay-panel{min-height:auto}.solution-list{grid-template-columns:1fr}.overview-map-shell{padding:0 8px}}
        @media(max-width:980px){.overview-map-shell{padding:0 8px}}
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
        <div style={{maxWidth:1560,margin:"0 auto",padding:"0 16px",
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
              <div style={{fontFamily:"Orbitron,monospace",fontSize:13,fontWeight:900,
                color:"#38bdf8",letterSpacing:"0.18em",
                textShadow:"0 0 12px #38bdf8"}}>ITZONE</div>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:7.5,
                color:"#1a4a6a",letterSpacing:"0.25em",textTransform:"uppercase",marginTop:1}}>
                ENTERPRISE TOPOLOGY
              </div>
            </div>
          </div>

          {/* Status bar */}
          <div style={{display:"flex",gap:14,marginLeft:20}}>
            {[
              {label:"SITES",val:"5",   col:"#38bdf8"},
              {label:"ISPs", val:"4",   col:"#a855f7"},
              {label:"DCs",  val:"1",   col:"#f97316"},
              {label:"DRs",  val:"1",   col:"#8b5cf6"},
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
          padding:"6px 16px",display:"flex",alignItems:"center",gap:20,
          maxWidth:1560,margin:"0 auto",flexWrap:"wrap"}}>
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
      <div style={{maxWidth:1560,margin:"0 auto",padding:"18px 12px 40px"}}>

        {/* Title */}
        <div style={{marginBottom:20,display:"flex",alignItems:"flex-end",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
         <div>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:"0.28em",
              color:"#1a4a6a",textTransform:"uppercase",marginBottom:6,display:"flex",alignItems:"center",gap:8}}>
              <div style={{width:20,height:1,background:"linear-gradient(90deg,transparent,#1a4a6a)"}}/>
            
              <div style={{width:20,height:1,background:"linear-gradient(90deg,#1a4a6a,transparent)"}}/>
            </div>
            <h1 style={{fontFamily:"Orbitron,monospace",fontSize:"clamp(22px,3.5vw,36px)",
              fontWeight:900,letterSpacing:"0.08em",lineHeight:1.1,
              background:"linear-gradient(90deg,#38bdf8,#6366f1 40%,#a855f7)",
              WebkitBackgroundClip:"text",backgroundClip:"text",color:"transparent",
              textShadow:"none"}}>
            
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
                  ?`${site.toUpperCase()} · ${isTopo?"Internal Topology":"Site Topology & Live Traffic"}`
                  :"HQ · DC-1 · DR-1 · Branch-1 · Branch-2 · iNET SD-WAN"}
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
          <div style={{padding:site?12:14,minHeight:site?0:620}}>
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
                    {col:"#f97316",label:"DC-1 — Data Center"},
                    {col:"#a855f7",label:"DR-1 — Disaster Recovery"},
                    {col:"#10b981",label:"Branch Offices"},
                    {col:"#38bdf8",label:"Multi-link site WAN to iNET"},
                  ].map((l,i)=>(
                    <div key={i} style={{display:"flex",alignItems:"center",gap:5}}>
                      <div style={{width:7,height:7,borderRadius:2,background:l.col,
                        boxShadow:`0 0 4px ${l.col}`}}/>
                      <span>{l.label}</span>
                    </div>
                  ))}
                  <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:5}}>
                    <div style={{width:5,height:5,borderRadius:"50%",background:"#38bdf8",animation:"blink 2s infinite"}}/>
                    <span>Hover buildings for glow · Click to drill in</span>
                  </div>
                </div>
                <div className="overview-map-shell"><OverviewMap activeSite={site} onSiteClick={setSite}/></div>
              </>
            )}
            {isTopo&&<TopoView site={site}/>}
            {isDevs&&<SiteTopologyView site={site}/>}
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
          <span>Enterprise Network Ops · SD-WAN · Multi-Link iNET · Veeam Protected</span>
          <span>1×DC · 1×DR · HQ · 2×Branch · © 2026</span>
        </div>
      </div>
    </div>
  );
}
