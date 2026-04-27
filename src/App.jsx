import { useState, useEffect, useRef, useCallback } from "react";

// ── PAGES ──────────────────────────────────────────────────────────────────
// 0 = Network Overview Map
// 1 = HQ Detail
// 2 = DC Detail
// 3 = Veeam Deep-Dive
// 4 = Branch-1 / Branch-2

// ── TOPOLOGY DATA ─────────────────────────────────────────────────────────
const SITES = {
  hq:  { id:"hq",  label:"HQ",        sub:"Headquarters",   x:18, y:68, color:"#06b6d4", icon:"🏢" },
  dc:  { id:"dc",  label:"DC",         sub:"Data Center",    x:78, y:68, color:"#f97316", icon:"⚡" },
  b1:  { id:"b1",  label:"Branch-1",   sub:"Branch Office",  x:12, y:28, color:"#10b981", icon:"🏪" },
  b2:  { id:"b2",  label:"Branch-2",   sub:"Branch Office",  x:85, y:28, color:"#8b5cf6", icon:"🏪" },
  rw1: { id:"rw1", label:"Remote-1",   sub:"Remote Worker",  x:30, y:10, color:"#eab308", icon:"👤" },
  rw2: { id:"rw2", label:"Remote-2",   sub:"Remote Worker",  x:68, y:10, color:"#eab308", icon:"👤" },
  inet:{ id:"inet",label:"iNET",       sub:"Internet / SD-WAN Fabric", x:50, y:44, color:"#38bdf8", icon:"🌐", isCloud:true },
};

const LINKS = [
  { a:"hq",  b:"inet", bw:90, health:"good" },
  { a:"b1",  b:"inet", bw:65, health:"good" },
  { a:"b2",  b:"inet", bw:50, health:"warn" },
  { a:"dc",  b:"inet", bw:88, health:"good" },
  { a:"rw1", b:"inet", bw:30, health:"good" },
  { a:"rw2", b:"inet", bw:25, health:"good" },
];

// ── VEEAM WORKFLOW ─────────────────────────────────────────────────────────
const VEEAM_STEPS = [
  { id:0, icon:"💻", color:"#38bdf8", label:"Endpoint Discovery",   desc:"Veeam Agent auto-discovers and catalogs all protected workloads across HQ, Branch offices, and Remote endpoints via the Veeam Backup & Replication console.", detail:["Agentless VMware / Hyper-V inventory","Agent-based physical servers & endpoints","Cloud workload discovery (AWS, Azure, GCP)","Continuous auto-refresh of protection scope"] },
  { id:1, icon:"📸", color:"#06b6d4", label:"Application-Consistent Snapshot", desc:"Before data capture, Veeam uses Microsoft VSS and VMware snapshot APIs to quiesce applications — guaranteeing zero RPO data loss and crash-consistent backups for every workload.", detail:["VSS coordination for Exchange, SQL, AD, SharePoint","VMware vSphere snapshot (no stun)","Oracle RMAN integration","Hyper-V WMI / checkpoint-based quiescing"] },
  { id:2, icon:"⚙️",  color:"#10b981", label:"Backup Proxy Processing",        desc:"Veeam Backup Proxy sits between the source and repository, offloading data processing from the VBR server. Multiple proxies load-balance across sites automatically.", detail:["Hot-Add / Direct NFS / NBD transport modes","On-host vs off-host proxy selection","Automatic load balancing across proxy pool","WAN Accelerator for branch-to-DC traffic"] },
  { id:3, icon:"🗜️", color:"#eab308", label:"Inline Compression",              desc:"All backup data is compressed inline before writing — reducing storage footprint by up to 50% with negligible CPU overhead using LZ4 or ZSTD algorithms.", detail:["LZ4 ultra-fast (default)","ZSTD high compression (up to 50% ratio)","Per-job compression level tuning","Hardware accelerator support (Intel QAT)"] },
  { id:4, icon:"♻️",  color:"#f97316", label:"Block-Level Deduplication",       desc:"Veeam performs block-level deduplication across all backup chains, eliminating redundant blocks. Combined with storage-side dedupe on SOBR, typical ratios reach 5–10×.", detail:["Inline source-side block dedup","Changed Block Tracking (CBT) for incremental","Scale-Out Backup Repository (SOBR) dedupe","Integration with HPE StoreOnce, Dell EMC DataDomain"] },
  { id:5, icon:"💾", color:"#8b5cf6", label:"Repository Write + Immutability",  desc:"Processed backup data is written to a Scale-Out Backup Repository. Immutability flags (S3 Object Lock or Linux Hardened Repository) prevent ransomware from deleting backup data.", detail:["Scale-Out Backup Repository (SOBR)","Linux Hardened Repository (immutable)","S3 Object Lock on cloud tier","Automated capacity tier offload to S3/Azure Blob"] },
  { id:6, icon:"📋", color:"#38bdf8", label:"3-2-1-1-0 Backup Copy",            desc:"Backup Copy Jobs replicate restore points to a secondary location automatically — enforcing the 3-2-1-1-0 rule: 3 copies, 2 media types, 1 offsite, 1 air-gapped, 0 errors.", detail:["GFS (Grandfather-Father-Son) retention","Seeding for remote location first run","Replication to cloud or tape tier","Automated SureBackup verification (0 errors)"] },
  { id:7, icon:"🔄", color:"#10b981", label:"VM Replication to DR",             desc:"Continuous VM replication creates a ready replica at the DR site. RPO can be as low as 15 minutes for Tier-1 workloads. Failover takes seconds — not hours.", detail:["vSphere / Hyper-V native replication","RPO as low as 15 minutes","Planned failover with no data loss","Partial failover — protect individual VMs"] },
  { id:8, icon:"⚡", color:"#ffd700", label:"Instant Recovery",                 desc:"Veeam Instant VM Recovery starts VMs directly from backup storage in under 2 minutes. No waiting for full restores. Migrate back to production with vMotion/Storage vMotion.", detail:["Instant VM Recovery to vSphere / Hyper-V","Instant Disk Recovery (iSCSI mount)","Granular file-level & application-item restore","Secure Restore — anti-malware scan before recovery"] },
];

const VEEAM_ADVANTAGES = [
  { icon:"🛡️", title:"Ransomware-Proof",    body:"Immutable backups via Linux Hardened Repository and S3 Object Lock ensure attackers cannot delete or encrypt your backup data — even with admin credentials compromised." },
  { icon:"⚡", title:"2-Minute RTO",         body:"Instant VM Recovery runs workloads directly from backup storage. No full restore required. Production migrations happen live with Storage vMotion." },
  { icon:"♻️",  title:"15-Min RPO",           body:"Continuous VM replication and CBT-based incremental backups achieve RPO targets as low as 15 minutes for Tier-1 critical workloads." },
  { icon:"🌐", title:"Any Workload",          body:"One platform protects VMware vSphere, Microsoft Hyper-V, AWS EC2, Azure VMs, GCP instances, physical Windows/Linux servers, NAS, and Kubernetes." },
  { icon:"🔍", title:"SureBackup Verified",   body:"Automated backup verification boots every VM in an isolated Virtual Lab and runs application tests. Zero silent failures — every backup proven recoverable." },
  { icon:"📊", title:"Single Pane of Glass",  body:"Veeam ONE provides unified monitoring, reporting, and alerting across all protected workloads, backup jobs, and repository health — one dashboard." },
];

const DC_SECURITY_TOOLS = [
  { name:"Veeam B&R v12", color:"#00ff9d", category:"Backup & Recovery", icon:"🛡️", isVeeam:true },
  { name:"VMware vSphere 8", color:"#8b5cf6", category:"Virtualization", icon:"🖥️" },
  { name:"OPSWAT MetaDefender", color:"#06b6d4", category:"Content Disarm", icon:"🔬" },
  { name:"Ivanti EASM", color:"#f97316", category:"Attack Surface Mgmt", icon:"🎯" },
  { name:"SailPoint IGA", color:"#eab308", category:"Identity Governance", icon:"🔑" },
  { name:"Thales HSM", color:"#38bdf8", category:"Key Management", icon:"🔐" },
];

// ── UTILITIES ──────────────────────────────────────────────────────────────
function lerp(a, b, t) { return a + (b - a) * t; }

function useInterval(cb, ms, active = true) {
  const ref = useRef(cb);
  useEffect(() => { ref.current = cb; }, [cb]);
  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => ref.current(), ms);
    return () => clearInterval(id);
  }, [ms, active]);
}

function usePackets(active) {
  const [packets, setPackets] = useState([]);
  const idRef = useRef(0);

  useInterval(() => {
    setPackets(prev => {
      const moved = prev.map(p => ({ ...p, t: p.t + p.speed })).filter(p => p.t < 1);
      if (!active) return moved;
      const newPkts = [];
      LINKS.forEach((link, i) => {
        if (Math.random() < 0.35) {
          const a = SITES[link.a], b = SITES[link.b];
          const toCenter = Math.random() > 0.5;
          idRef.current++;
          newPkts.push({
            id: idRef.current,
            x1: toCenter ? a.x : b.x, y1: toCenter ? a.y : b.y,
            x2: toCenter ? b.x : a.x, y2: toCenter ? b.y : a.y,
            t: 0, speed: 0.007 + Math.random() * 0.006,
            color: "#38bdf8",
          });
        }
      });
      return [...moved, ...newPkts].slice(-60);
    });
  }, 32);

  return packets;
}

// ── GLOBAL MAP ─────────────────────────────────────────────────────────────
function GlobalMap({ onSiteClick, activeSite }) {
  const svgRef = useRef(null);
  const [size, setSize] = useState({ w: 800, h: 500 });
  const packets = usePackets(true);

  useEffect(() => {
    const update = () => {
      if (svgRef.current) {
        const r = svgRef.current.getBoundingClientRect();
        setSize({ w: r.width, h: r.height });
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const px = (p) => (p / 100) * size.w;
  const py = (p) => (p / 100) * size.h;
  const hc = (h) => h === "good" ? "#10b981" : h === "warn" ? "#eab308" : "#ef4444";

  return (
    <svg ref={svgRef} width="100%" height="100%" style={{ position:"absolute", inset:0 }}>
      <defs>
        {Object.values(SITES).map(s => (
          <radialGradient key={s.id} id={`rg-${s.id}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={s.color} stopOpacity="0.2" />
            <stop offset="100%" stopColor={s.color} stopOpacity="0" />
          </radialGradient>
        ))}
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Ambient glow for internet */}
      <circle cx={px(50)} cy={py(44)} r={120} fill="url(#rg-inet)" />

      {/* Links */}
      {LINKS.map((link, i) => {
        const a = SITES[link.a], b = SITES[link.b];
        const x1=px(a.x), y1=py(a.y), x2=px(b.x), y2=py(b.y);
        const isVpn = a.id.startsWith("rw");
        return (
          <g key={i}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#0f2337" strokeWidth={3} />
            <line x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={hc(link.health)} strokeWidth={isVpn ? 1.5 : 2}
              strokeDasharray={isVpn ? "6,5" : "14,6"} opacity={0.65} filter="url(#glow)">
              <animate attributeName="stroke-dashoffset" from="20" to="0"
                dur={`${1.1 + i * 0.15}s`} repeatCount="indefinite" />
            </line>
            <text x={(x1+x2)/2} y={(y1+y2)/2 - 9}
              fill={hc(link.health)} fontSize="9" textAnchor="middle"
              fontFamily="'Share Tech Mono',monospace" opacity={0.6}>
              {link.bw}%
            </text>
          </g>
        );
      })}

      {/* Packets */}
      {packets.map(p => {
        const x = lerp(p.x1 / 100 * size.w, p.x2 / 100 * size.w, p.t);
        const y = lerp(p.y1 / 100 * size.h, p.y2 / 100 * size.h, p.t);
        return (
          <g key={p.id}>
            <circle cx={x} cy={y} r={2.5} fill={p.color} filter="url(#glow)" opacity={0.9} />
            <circle cx={x} cy={y} r={6} fill="none" stroke={p.color} strokeWidth={0.7} opacity={0.3} />
          </g>
        );
      })}

      {/* Site nodes */}
      {Object.values(SITES).map(site => {
        const cx=px(site.x), cy=py(site.y);
        const r = site.isCloud ? 48 : (site.id.startsWith("rw") ? 26 : 33);
        const isActive = activeSite === site.id;
        return (
          <g key={site.id}
            style={{ cursor: site.isCloud ? "default" : "pointer" }}
            onClick={() => !site.isCloud && onSiteClick(site.id)}>
            <circle cx={cx} cy={cy} r={r + 30} fill={`url(#rg-${site.id})`} opacity={isActive ? 1 : 0.5} />
            <circle cx={cx} cy={cy} r={r + 8} fill="none" stroke={site.color} strokeWidth={0.5} opacity={0.15}>
              <animate attributeName="r" values={`${r+6};${r+22};${r+6}`} dur="3s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.25;0;0.25" dur="3s" repeatCount="indefinite" />
            </circle>
            {isActive && (
              <circle cx={cx} cy={cy} r={r + 6} fill="none" stroke={site.color} strokeWidth={2} opacity={0.8}>
                <animate attributeName="r" values={`${r+4};${r+14};${r+4}`} dur="1.5s" repeatCount="indefinite" />
              </circle>
            )}
            <circle cx={cx} cy={cy} r={r} fill="rgba(4,8,20,0.88)" stroke={site.color}
              strokeWidth={isActive ? 2.5 : 1.5} filter="url(#glow)" />
            {site.isCloud && (
              <circle cx={cx} cy={cy} r={r} fill="none" stroke={site.color} strokeWidth={0.5}
                strokeDasharray="4,8" opacity={0.3}>
                <animateTransform attributeName="transform" type="rotate"
                  from={`0 ${cx} ${cy}`} to={`360 ${cx} ${cy}`} dur="20s" repeatCount="indefinite" />
              </circle>
            )}
            <text x={cx} y={cy - 3} textAnchor="middle" fontSize={site.isCloud ? 22 : 16}>{site.icon}</text>
            <text x={cx} y={cy + 14} textAnchor="middle"
              fill={site.color} fontSize={site.isCloud ? 10 : 8}
              fontFamily="'Share Tech Mono',monospace" fontWeight="700">
              {site.label}
            </text>
            {!site.isCloud && (
              <text x={cx} y={cy + r + 14} textAnchor="middle"
                fill={site.color} fontSize="7" fontFamily="'Share Tech Mono',monospace" opacity={0.6}>
                {site.sub}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

// ── VEEAM STEP CARD ─────────────────────────────────────────────────────────
function VeeamStepCard({ step, isActive, onClick }) {
  return (
    <div onClick={onClick} style={{
      cursor:"pointer",
      padding:"14px 16px",
      borderRadius:10,
      border:`1.5px solid ${isActive ? step.color : "rgba(255,255,255,0.07)"}`,
      background: isActive ? `rgba(${hexToRgb(step.color)},0.1)` : "rgba(255,255,255,0.02)",
      transition:"all 0.25s",
      position:"relative",
      overflow:"hidden",
    }}>
      {isActive && (
        <div style={{
          position:"absolute", top:0, left:0, right:0, height:2,
          background:`linear-gradient(90deg, transparent, ${step.color}, transparent)`,
          animation:"shimmer 2s infinite",
        }} />
      )}
      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
        <div style={{
          width:36, height:36, borderRadius:8,
          background:`rgba(${hexToRgb(step.color)},0.15)`,
          border:`1px solid rgba(${hexToRgb(step.color)},0.3)`,
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:18, flexShrink:0,
        }}>{step.icon}</div>
        <div>
          <div style={{ fontSize:11, fontWeight:700, color: isActive ? step.color : "rgba(255,255,255,0.7)",
            fontFamily:"'Share Tech Mono',monospace", letterSpacing:1 }}>
            STEP {step.id + 1}
          </div>
          <div style={{ fontSize:13, fontWeight:600, color:"rgba(255,255,255,0.9)", marginTop:2 }}>
            {step.label}
          </div>
        </div>
      </div>
    </div>
  );
}

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return `${r},${g},${b}`;
}

// ── VEEAM PAGE ─────────────────────────────────────────────────────────────
function VeeamPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [flowProgress, setFlowProgress] = useState(0);
  const step = VEEAM_STEPS[activeStep];

  useInterval(() => {
    if (!autoPlay) return;
    setFlowProgress(p => {
      if (p >= 100) {
        setActiveStep(s => (s + 1) % VEEAM_STEPS.length);
        return 0;
      }
      return p + 1.5;
    });
  }, 60, autoPlay);

  return (
    <div style={{ padding:"24px 28px", overflowY:"auto", height:"100%", boxSizing:"border-box" }}>
      {/* Header */}
      <div style={{ marginBottom:28 }}>
        <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:8 }}>
          <div style={{
            padding:"6px 14px", borderRadius:20,
            background:"rgba(0,255,157,0.1)", border:"1px solid rgba(0,255,157,0.3)",
            fontSize:11, color:"#00ff9d", fontFamily:"'Share Tech Mono',monospace", letterSpacing:2,
          }}>VEEAM BACKUP & REPLICATION v12</div>
          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
            <div style={{ width:6, height:6, borderRadius:"50%", background:"#10b981",
              animation:"blink 1.5s infinite" }} />
            <span style={{ fontSize:10, color:"#10b981", fontFamily:"'Share Tech Mono',monospace" }}>
              SIMULATION ACTIVE
            </span>
          </div>
        </div>
        <h2 style={{ margin:0, fontSize:26, fontWeight:700, color:"#fff",
          fontFamily:"'Orbitron',sans-serif", letterSpacing:2 }}>
          Full Workload Backup Architecture
        </h2>
        <p style={{ margin:"8px 0 0", fontSize:13, color:"rgba(255,255,255,0.5)", lineHeight:1.6 }}>
          Complete backup workflow across HQ, Branch Offices, DC, and Remote Workers — protecting every workload with zero data loss.
        </p>
      </div>

      {/* Main layout: steps list + detail */}
      <div style={{ display:"grid", gridTemplateColumns:"280px 1fr", gap:20, marginBottom:28 }}>
        {/* Steps list */}
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {/* Auto-play control */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
            marginBottom:4, padding:"6px 10px", borderRadius:6,
            background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)" }}>
            <span style={{ fontSize:10, color:"rgba(255,255,255,0.4)", fontFamily:"'Share Tech Mono',monospace" }}>
              AUTO-ADVANCE
            </span>
            <button onClick={() => setAutoPlay(!autoPlay)} style={{
              padding:"3px 10px", borderRadius:4, border:"1px solid rgba(255,255,255,0.15)",
              background: autoPlay ? "rgba(0,255,157,0.15)" : "rgba(255,255,255,0.05)",
              color: autoPlay ? "#00ff9d" : "rgba(255,255,255,0.4)",
              fontSize:9, cursor:"pointer", fontFamily:"'Share Tech Mono',monospace",
            }}>{autoPlay ? "● ON" : "○ OFF"}</button>
          </div>
          {VEEAM_STEPS.map((s, i) => (
            <VeeamStepCard key={s.id} step={s} isActive={activeStep === i}
              onClick={() => { setActiveStep(i); setAutoPlay(false); setFlowProgress(0); }} />
          ))}
        </div>

        {/* Detail panel */}
        <div style={{
          borderRadius:12, border:`1.5px solid rgba(${hexToRgb(step.color)},0.3)`,
          background:`rgba(${hexToRgb(step.color)},0.04)`,
          padding:24, position:"relative", overflow:"hidden",
        }}>
          {/* Progress bar */}
          {autoPlay && (
            <div style={{ position:"absolute", top:0, left:0, right:0, height:3,
              background:"rgba(255,255,255,0.05)" }}>
              <div style={{ height:"100%", background:step.color,
                width:`${flowProgress}%`, transition:"width 0.06s linear",
                boxShadow:`0 0 8px ${step.color}` }} />
            </div>
          )}

          {/* Step number & label */}
          <div style={{ display:"flex", alignItems:"flex-start", gap:16, marginBottom:20 }}>
            <div style={{
              width:56, height:56, borderRadius:12, flexShrink:0,
              background:`rgba(${hexToRgb(step.color)},0.15)`,
              border:`2px solid rgba(${hexToRgb(step.color)},0.4)`,
              display:"flex", alignItems:"center", justifyContent:"center", fontSize:26,
            }}>{step.icon}</div>
            <div>
              <div style={{ fontSize:10, color:step.color, fontFamily:"'Share Tech Mono',monospace",
                letterSpacing:3, marginBottom:4 }}>
                STEP {step.id + 1} OF {VEEAM_STEPS.length}
              </div>
              <h3 style={{ margin:0, fontSize:20, fontWeight:700, color:"#fff" }}>
                {step.label}
              </h3>
            </div>
          </div>

          {/* Description */}
          <p style={{ margin:"0 0 20px", fontSize:14, color:"rgba(255,255,255,0.75)", lineHeight:1.7 }}>
            {step.desc}
          </p>

          {/* Detail bullets */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
            {step.detail.map((d, i) => (
              <div key={i} style={{
                padding:"10px 12px", borderRadius:8,
                background:"rgba(255,255,255,0.04)",
                border:"1px solid rgba(255,255,255,0.07)",
                fontSize:12, color:"rgba(255,255,255,0.65)",
                display:"flex", alignItems:"flex-start", gap:8,
              }}>
                <span style={{ color:step.color, flexShrink:0, marginTop:1 }}>▸</span>
                {d}
              </div>
            ))}
          </div>

          {/* Navigation arrows */}
          <div style={{ display:"flex", gap:10, marginTop:20 }}>
            <button onClick={() => { setActiveStep(s => Math.max(0, s-1)); setAutoPlay(false); }} style={{
              padding:"8px 18px", borderRadius:6, border:"1px solid rgba(255,255,255,0.15)",
              background:"rgba(255,255,255,0.05)", color:"rgba(255,255,255,0.7)",
              fontSize:12, cursor:"pointer", fontFamily:"'Share Tech Mono',monospace",
            }}>← PREV</button>
            <button onClick={() => { setActiveStep(s => Math.min(VEEAM_STEPS.length-1, s+1)); setAutoPlay(false); }} style={{
              padding:"8px 18px", borderRadius:6, border:`1px solid rgba(${hexToRgb(step.color)},0.4)`,
              background:`rgba(${hexToRgb(step.color)},0.1)`, color:step.color,
              fontSize:12, cursor:"pointer", fontFamily:"'Share Tech Mono',monospace",
            }}>NEXT →</button>
          </div>
        </div>
      </div>

      {/* Veeam Advantages */}
      <div style={{ marginBottom:28 }}>
        <div style={{ fontSize:10, color:"rgba(255,255,255,0.35)", fontFamily:"'Share Tech Mono',monospace",
          letterSpacing:3, marginBottom:14 }}>
          KEY ADVANTAGES
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:12 }}>
          {VEEAM_ADVANTAGES.map((adv, i) => (
            <div key={i} style={{
              padding:"16px 14px", borderRadius:10,
              border:"1px solid rgba(0,255,157,0.12)",
              background:"rgba(0,255,157,0.03)",
              transition:"border-color 0.2s",
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor="rgba(0,255,157,0.3)"}
              onMouseLeave={e => e.currentTarget.style.borderColor="rgba(0,255,157,0.12)"}>
              <div style={{ fontSize:22, marginBottom:8 }}>{adv.icon}</div>
              <div style={{ fontSize:12, fontWeight:700, color:"#00ff9d", marginBottom:6 }}>{adv.title}</div>
              <div style={{ fontSize:11, color:"rgba(255,255,255,0.55)", lineHeight:1.6 }}>{adv.body}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Workload coverage */}
      <div>
        <div style={{ fontSize:10, color:"rgba(255,255,255,0.35)", fontFamily:"'Share Tech Mono',monospace",
          letterSpacing:3, marginBottom:14 }}>
          PROTECTED WORKLOADS — ACROSS ALL SITES
        </div>
        <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
          {["VMware vSphere VMs","Microsoft Hyper-V VMs","Windows Physical Servers","Linux Physical Servers",
            "Microsoft 365 (Exchange, SharePoint, Teams)","AWS EC2 Instances","Azure VMs",
            "NAS / File Shares (SMB, NFS)","Kubernetes Containers","Oracle Databases",
            "Microsoft SQL Server","Active Directory","Remote Worker Endpoints"].map((w, i) => (
            <div key={i} style={{
              padding:"5px 12px", borderRadius:20,
              background:"rgba(0,255,157,0.07)", border:"1px solid rgba(0,255,157,0.2)",
              fontSize:11, color:"rgba(0,255,157,0.9)",
            }}>{w}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── HQ PAGE ────────────────────────────────────────────────────────────────
function HQPage({ onVeeamClick }) {
  const site = SITES.hq;
  const layers = [
    { label:"ACCESS LAYER", color:"#06b6d4", devices:["SW-A1 (48-port PoE)","SW-A2 (48-port PoE)","SW-A3 (24-port PoE)","WAP-01..12 (WiFi-6E)","IP Phones (VOIP)","IoT Sensors"] },
    { label:"CORE LAYER", color:"#0ea5e9", devices:["Core-SW-01 (L3, HSRP Active)","Core-SW-02 (L3, HSRP Standby)","FW-01 (FortiGate Active)","FW-02 (FortiGate Standby HA)","IPS-01 (Inline IDS/IPS)"] },
  ];
  const securityTools = [
    { name:"FortiGate NGFW", color:"#ef4444", desc:"Next-Gen Firewall · HA Pair" },
    { name:"Veeam Agent", color:"#00ff9d", desc:"Endpoint & Server Backup", isVeeam:true },
    { name:"Ivanti UEM", color:"#f97316", desc:"Unified Endpoint Management" },
    { name:"SentinelOne EDR", color:"#8b5cf6", desc:"Endpoint Detection & Response" },
    { name:"Cisco ISE NAC", color:"#06b6d4", desc:"Network Access Control" },
    { name:"OPSWAT MetaDefender", color:"#eab308", desc:"File & Device Scanning" },
  ];
  const userGroups = [
    { type:"Workstations", count:120, icon:"💻" },
    { type:"Servers", count:18, icon:"🖥️" },
    { type:"IP Phones", count:85, icon:"☎️" },
    { type:"WiFi Clients", count:200, icon:"📱" },
    { type:"IoT Devices", count:40, icon:"🔌" },
  ];

  return (
    <div style={{ padding:"24px 28px", overflowY:"auto", height:"100%", boxSizing:"border-box" }}>
      <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:24 }}>
        <div style={{ fontSize:32 }}>🏢</div>
        <div>
          <h2 style={{ margin:0, fontSize:24, fontWeight:700, color:site.color,
            fontFamily:"'Orbitron',sans-serif", letterSpacing:2 }}>HEADQUARTERS</h2>
          <div style={{ fontSize:12, color:"rgba(255,255,255,0.4)", fontFamily:"'Share Tech Mono',monospace" }}>
            PRIMARY SITE · SD-WAN CONNECTED · 90% UPLINK UTILIZATION
          </div>
        </div>
      </div>

      {/* User stats */}
      <div style={{ display:"flex", gap:10, marginBottom:24 }}>
        {userGroups.map((g, i) => (
          <div key={i} style={{
            flex:1, padding:"12px 10px", borderRadius:8,
            border:"1px solid rgba(6,182,212,0.15)",
            background:"rgba(6,182,212,0.04)", textAlign:"center",
          }}>
            <div style={{ fontSize:20 }}>{g.icon}</div>
            <div style={{ fontSize:18, fontWeight:700, color:site.color, margin:"4px 0 2px" }}>{g.count}</div>
            <div style={{ fontSize:9, color:"rgba(255,255,255,0.4)", fontFamily:"'Share Tech Mono',monospace" }}>{g.type}</div>
          </div>
        ))}
      </div>

      {/* Network layers */}
      <div style={{ marginBottom:24 }}>
        <div style={{ fontSize:10, color:"rgba(255,255,255,0.35)", fontFamily:"'Share Tech Mono',monospace",
          letterSpacing:3, marginBottom:12 }}>NETWORK TOPOLOGY — DUAL-LAYER ARCHITECTURE</div>
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {layers.map((layer, i) => (
            <div key={i} style={{
              padding:"14px 16px", borderRadius:10,
              border:`1px dashed rgba(${hexToRgb(layer.color)},0.3)`,
              background:`rgba(${hexToRgb(layer.color)},0.03)`,
            }}>
              <div style={{ fontSize:9, color:layer.color, fontFamily:"'Share Tech Mono',monospace",
                letterSpacing:3, marginBottom:10 }}>{layer.label}</div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                {layer.devices.map((d, j) => (
                  <div key={j} style={{
                    padding:"4px 10px", borderRadius:6,
                    background:`rgba(${hexToRgb(layer.color)},0.1)`,
                    border:`1px solid rgba(${hexToRgb(layer.color)},0.2)`,
                    fontSize:11, color:layer.color,
                  }}>{d}</div>
                ))}
              </div>
            </div>
          ))}
          <div style={{ padding:"10px 16px", borderRadius:8, border:"1px solid rgba(56,189,248,0.2)",
            background:"rgba(56,189,248,0.04)", display:"flex", alignItems:"center", gap:12 }}>
            <span style={{ fontSize:18 }}>🔗</span>
            <div>
              <div style={{ fontSize:11, fontWeight:700, color:"#38bdf8" }}>SD-WAN Edge</div>
              <div style={{ fontSize:10, color:"rgba(255,255,255,0.4)" }}>iNET uplink · 90% utilization · QoS policies active</div>
            </div>
          </div>
        </div>
      </div>

      {/* Security solutions */}
      <div>
        <div style={{ fontSize:10, color:"rgba(255,255,255,0.35)", fontFamily:"'Share Tech Mono',monospace",
          letterSpacing:3, marginBottom:12 }}>SECURITY SOLUTIONS — ACTIVE AT HQ</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:10 }}>
          {securityTools.map((tool, i) => (
            <div key={i} onClick={tool.isVeeam ? onVeeamClick : undefined} style={{
              padding:"12px 14px", borderRadius:8,
              border:`1px solid rgba(${hexToRgb(tool.color)},0.25)`,
              background:`rgba(${hexToRgb(tool.color)},0.05)`,
              cursor: tool.isVeeam ? "pointer" : "default",
              transition:"all 0.2s",
            }}
              onMouseEnter={e => { if(tool.isVeeam) e.currentTarget.style.borderColor=tool.color; }}
              onMouseLeave={e => { if(tool.isVeeam) e.currentTarget.style.borderColor=`rgba(${hexToRgb(tool.color)},0.25)`; }}>
              <div style={{ fontSize:12, fontWeight:700, color:tool.color, marginBottom:3 }}>{tool.name}</div>
              <div style={{ fontSize:10, color:"rgba(255,255,255,0.45)" }}>{tool.desc}</div>
              {tool.isVeeam && (
                <div style={{ fontSize:9, color:tool.color, fontFamily:"'Share Tech Mono',monospace",
                  marginTop:5, opacity:0.8 }}>→ VIEW BACKUP WORKFLOW</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── DC PAGE ────────────────────────────────────────────────────────────────
function DCPage({ onVeeamClick }) {
  const dcLayers = [
    { label:"PERIMETER", color:"#38bdf8", items:["SD-WAN Edge (Dual ISP)","FortiGate FW Cluster (HA)","IDS/IPS Inline (Suricata)","DDoS Scrubbing (Cloudflare)"] },
    { label:"CORE NETWORK", color:"#10b981", items:["Core L3 Switch-01","Core L3 Switch-02","OOB Management Network","Jumbo Frame 9000 MTU"] },
    { label:"COMPUTE / VIRTUALIZATION", color:"#8b5cf6", items:["VMware vSphere 8 Cluster (12 hosts)","vSAN Stretched Cluster","ESXi VMs: AD, DNS, DHCP, SIEM, WAF, PAM, DLP","vCenter Server HA"] },
    { label:"STORAGE", color:"#eab308", items:["SAN Storage Array (32TB NVMe)","DC Storage (Object: 200TB)","Tape Library (LTO-9)","Veeam Scale-Out Backup Repo (SOBR)"] },
  ];

  return (
    <div style={{ padding:"24px 28px", overflowY:"auto", height:"100%", boxSizing:"border-box" }}>
      <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:24 }}>
        <div style={{ fontSize:32 }}>⚡</div>
        <div>
          <h2 style={{ margin:0, fontSize:24, fontWeight:700, color:"#f97316",
            fontFamily:"'Orbitron',sans-serif", letterSpacing:2 }}>DATA CENTER</h2>
          <div style={{ fontSize:12, color:"rgba(255,255,255,0.4)", fontFamily:"'Share Tech Mono',monospace" }}>
            PRIMARY DC · ALL WORKLOADS PROTECTED BY VEEAM B&R v12
          </div>
        </div>
      </div>

      {/* Stats row */}
      {[["12","vSphere Hosts"],["32TB","NVMe Storage"],["200TB","Object Storage"],["99.999%","Uptime SLA"]].map(([v,l],i)=>(
        <span key={i} style={{ display:"inline-block", textAlign:"center", marginRight:16, marginBottom:16 }}>
          <div style={{ fontSize:22, fontWeight:700, color:"#f97316" }}>{v}</div>
          <div style={{ fontSize:9, color:"rgba(255,255,255,0.4)", fontFamily:"'Share Tech Mono',monospace" }}>{l}</div>
        </span>
      ))}

      {/* DC layers */}
      <div style={{ marginBottom:24 }}>
        <div style={{ fontSize:10, color:"rgba(255,255,255,0.35)", fontFamily:"'Share Tech Mono',monospace",
          letterSpacing:3, marginBottom:12 }}>DC ARCHITECTURE LAYERS</div>
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {dcLayers.map((layer, i) => (
            <div key={i} style={{
              padding:"14px 16px", borderRadius:10,
              border:`1px dashed rgba(${hexToRgb(layer.color)},0.3)`,
              background:`rgba(${hexToRgb(layer.color)},0.03)`,
            }}>
              <div style={{ fontSize:9, color:layer.color, fontFamily:"'Share Tech Mono',monospace",
                letterSpacing:3, marginBottom:8 }}>{layer.label}</div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:7 }}>
                {layer.items.map((d, j) => (
                  <div key={j} style={{
                    padding:"4px 10px", borderRadius:6,
                    background:`rgba(${hexToRgb(layer.color)},0.08)`,
                    border:`1px solid rgba(${hexToRgb(layer.color)},0.2)`,
                    fontSize:11, color:layer.color,
                  }}>{d}</div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Security solutions including Veeam */}
      <div>
        <div style={{ fontSize:10, color:"rgba(255,255,255,0.35)", fontFamily:"'Share Tech Mono',monospace",
          letterSpacing:3, marginBottom:12 }}>SECURITY & DATA PROTECTION SOLUTIONS</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:10 }}>
          {DC_SECURITY_TOOLS.map((tool, i) => (
            <div key={i} onClick={tool.isVeeam ? onVeeamClick : undefined} style={{
              padding:"14px 14px", borderRadius:8,
              border:`1px solid rgba(${hexToRgb(tool.color)},${tool.isVeeam ? "0.5" : "0.2"})`,
              background:`rgba(${hexToRgb(tool.color)},${tool.isVeeam ? "0.08" : "0.04"})`,
              cursor: tool.isVeeam ? "pointer" : "default",
              transition:"all 0.2s",
              position:"relative",
            }}
              onMouseEnter={e => { if(tool.isVeeam) e.currentTarget.style.transform="translateY(-2px)"; }}
              onMouseLeave={e => { if(tool.isVeeam) e.currentTarget.style.transform="translateY(0)"; }}>
              {tool.isVeeam && (
                <div style={{ position:"absolute", top:8, right:8, fontSize:8, color:tool.color,
                  fontFamily:"'Share Tech Mono',monospace", border:`1px solid ${tool.color}`,
                  padding:"2px 6px", borderRadius:4 }}>CLICK</div>
              )}
              <div style={{ fontSize:11, fontWeight:700, color:tool.color, marginBottom:3 }}>{tool.name}</div>
              <div style={{ fontSize:10, color:"rgba(255,255,255,0.45)", marginBottom:4 }}>{tool.category}</div>
              {tool.isVeeam && (
                <div style={{ fontSize:9, color:tool.color, fontFamily:"'Share Tech Mono',monospace", opacity:0.8 }}>
                  → BACKUP WORKFLOW & DETAILS
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── BRANCH PAGE ────────────────────────────────────────────────────────────
function BranchPage({ site }) {
  const s = SITES[site];
  const devices = [
    { name:"SD-WAN Edge", color:"#38bdf8", desc:"Dual WAN · QoS · App-Aware" },
    { name:"Core Switch (L3)", color:s.color, desc:"HSRP · Redundant links" },
    { name:"Access Switches ×3", color:s.color, desc:"48-port PoE · VLAN segmented" },
    { name:"FortiGate NGFW", color:"#ef4444", desc:"UTM · SSL Inspection" },
    { name:"Veeam Agent", color:"#00ff9d", desc:"Backup to DC via WAN Acc.", isVeeam:true },
    { name:"Cisco WAP ×8", color:"#06b6d4", desc:"WiFi-6 · WPA3 Enterprise" },
  ];
  return (
    <div style={{ padding:"24px 28px", overflowY:"auto", height:"100%", boxSizing:"border-box" }}>
      <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:24 }}>
        <div style={{ fontSize:32 }}>{s.icon}</div>
        <div>
          <h2 style={{ margin:0, fontSize:24, fontWeight:700, color:s.color,
            fontFamily:"'Orbitron',sans-serif", letterSpacing:2 }}>{s.label.toUpperCase()}</h2>
          <div style={{ fontSize:12, color:"rgba(255,255,255,0.4)", fontFamily:"'Share Tech Mono',monospace" }}>
            BRANCH OFFICE · SD-WAN CONNECTED · VEEAM PROTECTED
          </div>
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:10, marginBottom:20 }}>
        {[["45","Workstations"],["8","Servers"],["6","Access Switches"],["8","WiFi APs"]].map(([v,l],i)=>(
          <div key={i} style={{ padding:"12px", borderRadius:8, textAlign:"center",
            border:`1px solid rgba(${hexToRgb(s.color)},0.15)`,
            background:`rgba(${hexToRgb(s.color)},0.04)` }}>
            <div style={{ fontSize:20, fontWeight:700, color:s.color }}>{v}</div>
            <div style={{ fontSize:9, color:"rgba(255,255,255,0.4)", fontFamily:"'Share Tech Mono',monospace" }}>{l}</div>
          </div>
        ))}
      </div>

      <div style={{ fontSize:10, color:"rgba(255,255,255,0.35)", fontFamily:"'Share Tech Mono',monospace",
        letterSpacing:3, marginBottom:12 }}>DEPLOYED SOLUTIONS</div>
      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
        {devices.map((d, i) => (
          <div key={i} style={{
            padding:"12px 14px", borderRadius:8,
            border:`1px solid rgba(${hexToRgb(d.color)},0.2)`,
            background:`rgba(${hexToRgb(d.color)},0.04)`,
            display:"flex", alignItems:"center", justifyContent:"space-between",
          }}>
            <div>
              <div style={{ fontSize:12, fontWeight:700, color:d.color }}>{d.name}</div>
              <div style={{ fontSize:10, color:"rgba(255,255,255,0.4)" }}>{d.desc}</div>
            </div>
            <div style={{ width:8, height:8, borderRadius:"50%", background:d.color,
              animation:"blink 2s infinite" }} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── SIDE PANEL ─────────────────────────────────────────────────────────────
function SidePanel({ page, onClose, onVeeamClick }) {
  const pageMap = {
    hq:    <HQPage onVeeamClick={onVeeamClick} />,
    dc:    <DCPage onVeeamClick={onVeeamClick} />,
    b1:    <BranchPage site="b1" />,
    b2:    <BranchPage site="b2" />,
    veeam: <VeeamPage />,
  };

  const titles = {
    hq:"HQ — Headquarters", dc:"DC — Data Center",
    b1:"Branch-1 Office", b2:"Branch-2 Office", veeam:"Veeam Backup & Replication",
  };

  const s = SITES[page];
  const titleColor = page === "veeam" ? "#00ff9d" : s ? s.color : "#38bdf8";

  return (
    <div style={{
      position:"absolute", top:0, bottom:0, right:0,
      width: "min(680px, 55vw)",
      background:"rgba(2,4,14,0.97)",
      borderLeft:"1px solid rgba(255,255,255,0.07)",
      display:"flex", flexDirection:"column",
      backdropFilter:"blur(20px)",
      zIndex:50,
      animation:"slideIn 0.25s ease",
    }}>
      {/* Panel header */}
      <div style={{
        padding:"14px 20px", borderBottom:"1px solid rgba(255,255,255,0.07)",
        display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0,
      }}>
        <div style={{ fontSize:13, fontWeight:700, color:titleColor,
          fontFamily:"'Share Tech Mono',monospace", letterSpacing:2 }}>
          {titles[page]}
        </div>
        <button onClick={onClose} style={{
          background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.12)",
          color:"rgba(255,255,255,0.7)", borderRadius:6, padding:"4px 10px",
          cursor:"pointer", fontSize:12, fontFamily:"'Share Tech Mono',monospace",
        }}>✕ CLOSE</button>
      </div>
      {/* Content */}
      <div style={{ flex:1, overflowY:"auto" }}>
        {pageMap[page]}
      </div>
    </div>
  );
}

// ── MINI NAV ───────────────────────────────────────────────────────────────
function MiniNav({ onNavigate, activePage }) {
  const navItems = [
    { id:"hq", icon:"🏢", label:"HQ" },
    { id:"dc", icon:"⚡", label:"DC" },
    { id:"b1", icon:"🏪", label:"B1" },
    { id:"b2", icon:"🏪", label:"B2" },
    { id:"veeam", icon:"🛡️", label:"Veeam", color:"#00ff9d" },
  ];

  return (
    <div style={{
      position:"fixed", bottom:24, left:"50%", transform:"translateX(-50%)",
      display:"flex", gap:8, zIndex:200,
      background:"rgba(2,4,14,0.92)", borderRadius:16,
      border:"1px solid rgba(255,255,255,0.1)",
      padding:"8px 12px",
      backdropFilter:"blur(16px)",
    }}>
      {navItems.map(item => {
        const s = SITES[item.id];
        const color = item.color || (s ? s.color : "#38bdf8");
        const isActive = activePage === item.id;
        return (
          <button key={item.id} onClick={() => onNavigate(item.id)} style={{
            display:"flex", flexDirection:"column", alignItems:"center", gap:3,
            padding:"6px 12px", borderRadius:10, cursor:"pointer",
            border:`1px solid ${isActive ? color : "rgba(255,255,255,0.08)"}`,
            background: isActive ? `rgba(${hexToRgb(color)},0.15)` : "transparent",
            transition:"all 0.2s",
          }}>
            <span style={{ fontSize:16 }}>{item.icon}</span>
            <span style={{ fontSize:8, color: isActive ? color : "rgba(255,255,255,0.4)",
              fontFamily:"'Share Tech Mono',monospace" }}>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ── HEADER ─────────────────────────────────────────────────────────────────
function Header({ clock }) {
  return (
    <div style={{
      position:"fixed", top:0, left:0, right:0, height:52, zIndex:100,
      display:"flex", alignItems:"center", justifyContent:"space-between",
      padding:"0 22px",
      background:"rgba(2,4,14,0.96)",
      borderBottom:"1px solid rgba(255,255,255,0.06)",
      backdropFilter:"blur(10px)",
      fontFamily:"'Share Tech Mono',monospace",
    }}>
      <div style={{ display:"flex", alignItems:"center", gap:12 }}>
        <div style={{
          width:32, height:32, borderRadius:8,
          border:"1.5px solid #38bdf8",
          display:"flex", alignItems:"center", justifyContent:"center",
          boxShadow:"0 0 12px rgba(56,189,248,0.3)",
        }}>
          <div style={{ width:10, height:10, background:"#38bdf8", borderRadius:3,
            animation:"pulse 2s infinite" }} />
        </div>
        <div>
          <div style={{ color:"#38bdf8", fontSize:13, fontWeight:700, letterSpacing:4 }}>
            ENTERPRISE NETWORK TOPOLOGY
          </div>
          <div style={{ color:"rgba(56,189,248,0.4)", fontSize:8, letterSpacing:3 }}>
            INTERACTIVE ARCHITECTURE · VEEAM PROTECTED
          </div>
        </div>
      </div>
      <div style={{ display:"flex", gap:16, alignItems:"center" }}>
        <div style={{ display:"flex", alignItems:"center", gap:5 }}>
          <div style={{ width:5, height:5, borderRadius:"50%", background:"#10b981",
            animation:"blink 1.5s infinite" }} />
          <span style={{ color:"#10b981", fontSize:9 }}>ALL SITES NOMINAL</span>
        </div>
        <span style={{ color:"rgba(255,255,255,0.25)", fontSize:10 }}>
          {clock.toLocaleTimeString("en-US", { hour12:false })} UTC
        </span>
      </div>
    </div>
  );
}

// ── MAIN APP ───────────────────────────────────────────────────────────────
export default function App() {
  const [activePage, setActivePage] = useState(null);
  const [clock, setClock] = useState(new Date());

  useInterval(() => setClock(new Date()), 1000);

  const handleSiteClick = (id) => {
    if (id === "rw1" || id === "rw2") return; // no detail page for remote workers (yet)
    setActivePage(id);
  };

  const handleNav = (id) => setActivePage(id);
  const handleVeeam = () => setActivePage("veeam");

  return (
    <div style={{
      width:"100vw", height:"100vh",
      background:"#02040e",
      overflow:"hidden", position:"relative",
      fontFamily:"'Segoe UI',system-ui,sans-serif",
    }}>
      {/* Import fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Orbitron:wght@700&display=swap');
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.15} }
        @keyframes pulse { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(0.8);opacity:0.5} }
        @keyframes slideIn { from{transform:translateX(100%);opacity:0} to{transform:translateX(0);opacity:1} }
        @keyframes shimmer { 0%{opacity:0;transform:translateX(-100%)} 50%{opacity:1} 100%{opacity:0;transform:translateX(100%)} }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width:5px; }
        ::-webkit-scrollbar-track { background:rgba(255,255,255,0.02); }
        ::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.12); border-radius:3px; }
      `}</style>

      {/* Grid bg */}
      <div style={{
        position:"absolute", inset:0, pointerEvents:"none",
        backgroundImage:"linear-gradient(rgba(56,189,248,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(56,189,248,0.02) 1px,transparent 1px)",
        backgroundSize:"44px 44px",
      }} />

      <Header clock={clock} />

      {/* Map area */}
      <div style={{ position:"absolute", top:52, bottom:0, left:0, right:0 }}>
        <GlobalMap onSiteClick={handleSiteClick} activeSite={activePage} />

        {/* Center label */}
        <div style={{
          position:"absolute", top:10, left:"50%", transform:"translateX(-50%)",
          background:"rgba(4,8,20,0.88)", border:"1px solid rgba(255,255,255,0.06)",
          borderRadius:6, padding:"4px 14px",
          fontSize:9, color:"rgba(255,255,255,0.3)",
          fontFamily:"'Share Tech Mono',monospace", letterSpacing:2,
          pointerEvents:"none",
        }}>
          CLICK ANY SITE · USE NAV BELOW TO EXPLORE · VEEAM PANEL FOR BACKUP DETAILS
        </div>
      </div>

      {/* Side panel */}
      {activePage && (
        <SidePanel
          page={activePage}
          onClose={() => setActivePage(null)}
          onVeeamClick={handleVeeam}
        />
      )}

      {/* Bottom nav */}
      <MiniNav onNavigate={handleNav} activePage={activePage} />
    </div>
  );
}
