import { useState, useEffect, useRef, useCallback } from "react";

// ── UTILITIES ─────────────────────────────────────────────────────────────
function useInterval(cb, ms, active = true) {
  const ref = useRef(cb);
  useEffect(() => { ref.current = cb; }, [cb]);
  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => ref.current(), ms);
    return () => clearInterval(id);
  }, [ms, active]);
}

function lerp(a, b, t) { return a + (b - a) * t; }

function hexRgb(hex) {
  if (!hex || hex.length < 4) return "255,255,255";
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map(c => c + c).join("") : h;
  return [parseInt(full.slice(0,2),16), parseInt(full.slice(2,4),16), parseInt(full.slice(4,6),16)].join(",");
}

// ── PACKET ENGINE ──────────────────────────────────────────────────────────
function usePackets(lines) {
  const [packets, setPackets] = useState([]);
  const idRef = useRef(0);
  useInterval(() => {
    setPackets(prev => {
      const moved = prev.map(p => ({ ...p, t: p.t + p.speed })).filter(p => p.t < 1);
      const newPkts = [];
      lines.forEach(line => {
        if (Math.random() < 0.28) {
          const dir = Math.random() > 0.5;
          idRef.current++;
          newPkts.push({
            id: idRef.current,
            x1: dir ? line.x1 : line.x2, y1: dir ? line.y1 : line.y2,
            x2: dir ? line.x2 : line.x1, y2: dir ? line.y2 : line.y1,
            t: 0, speed: 0.006 + Math.random() * 0.005,
            color: line.color || "#38bdf8",
          });
        }
      });
      return [...moved, ...newPkts].slice(-80);
    });
  }, 40);
  return packets;
}

// ── DEVICE CHIP ────────────────────────────────────────────────────────────
function DeviceChip({ label, color, compact }) {
  return (
    <div style={{
      fontSize: compact ? 7 : 8, padding: compact ? "2px 5px" : "2px 7px", borderRadius: 4,
      border: `1px solid rgba(${hexRgb(color)},0.25)`,
      background: `rgba(${hexRgb(color)},0.08)`,
      color, fontFamily: "'Share Tech Mono',monospace", whiteSpace: "nowrap",
    }}>{label}</div>
  );
}

// ── SITE BOX ───────────────────────────────────────────────────────────────
function SiteBox({ title, color, accentColor, accessDevices, coreDevices, sdwan, extra, onClick, isActive, compact }) {
  const [hov, setHov] = useState(false);
  return (
    <div onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        border: `1.5px solid ${isActive ? color : hov ? color : "rgba(255,255,255,0.1)"}`,
        borderRadius: 10, padding: compact ? "8px" : "10px",
        background: isActive ? `rgba(${hexRgb(color)},0.06)` : "rgba(4,8,20,0.75)",
        cursor: "pointer", transition: "all 0.2s",
        position: "relative", width: "100%", boxSizing: "border-box",
        height: "100%",
      }}>
      {/* Header */}
      <div style={{
        fontSize: compact ? 9 : 11, fontWeight: 700, color,
        fontFamily: "'Share Tech Mono',monospace", letterSpacing: 2,
        marginBottom: compact ? 5 : 7,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <span>{title}</span>
        {sdwan && (
          <div style={{
            fontSize: compact ? 6 : 7, padding: "1px 5px", borderRadius: 3,
            border: "1px solid rgba(56,189,248,0.4)", color: "#38bdf8",
            background: "rgba(56,189,248,0.07)",
          }}>SD-WAN</div>
        )}
      </div>
      {/* CORE LAYER */}
      <div style={{
        border: `1px dashed rgba(${hexRgb(accentColor)},0.45)`,
        borderRadius: 6, padding: compact ? "4px 5px" : "5px 7px", marginBottom: compact ? 4 : 5,
        background: `rgba(${hexRgb(accentColor)},0.04)`,
      }}>
        <div style={{ fontSize: compact ? 6 : 7, color: accentColor, fontFamily: "'Share Tech Mono',monospace", letterSpacing: 2, marginBottom: compact ? 3 : 4, opacity: 0.8 }}>CORE LAYER</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: compact ? 2 : 3 }}>
          {coreDevices.map((d, i) => <DeviceChip key={i} label={d} color={accentColor} compact={compact} />)}
        </div>
      </div>
      {/* ACCESS LAYER */}
      <div style={{
        border: `1px dashed rgba(${hexRgb(color)},0.45)`,
        borderRadius: 6, padding: compact ? "4px 5px" : "5px 7px",
        background: `rgba(${hexRgb(color)},0.04)`,
      }}>
        <div style={{ fontSize: compact ? 6 : 7, color, fontFamily: "'Share Tech Mono',monospace", letterSpacing: 2, marginBottom: compact ? 3 : 4, opacity: 0.8 }}>ACCESS LAYER</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: compact ? 2 : 3 }}>
          {accessDevices.map((d, i) => <DeviceChip key={i} label={d} color={color} compact={compact} />)}
        </div>
      </div>
      {extra && <div style={{ marginTop: compact ? 4 : 6 }}>{extra}</div>}
      {isActive && <div style={{ position:"absolute", inset:-3, borderRadius:12, border:`1.5px solid ${color}`, opacity:0.35, animation:"pulseRing 1.5s ease-out infinite", pointerEvents:"none" }} />}
    </div>
  );
}

// ── REMOTE BOX ─────────────────────────────────────────────────────────────
function RemoteBox({ label, icon, compact, nodeRef }) {
  return (
    <div ref={nodeRef} style={{
      border: "1px solid rgba(234,179,8,0.3)", borderRadius: 8,
      padding: compact ? "6px 10px" : "8px 14px",
      background: "rgba(4,8,20,0.7)", textAlign: "center",
    }}>
      <div style={{ fontSize: compact ? 16 : 20, marginBottom: 3 }}>{icon}</div>
      <div style={{ fontSize: compact ? 7 : 8, color: "#eab308", fontFamily: "'Share Tech Mono',monospace", whiteSpace: "nowrap" }}>{label}</div>
    </div>
  );
}

// ── INET CLOUD ─────────────────────────────────────────────────────────────
function InetCloud({ nodeRef, compact }) {
  const r = compact ? 44 : 60;
  const w = r * 2 + 40; const h = r + 50;
  return (
    <div ref={nodeRef} style={{ display:"flex", alignItems:"center", justifyContent:"center" }}>
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ overflow:"visible" }}>
        <defs>
          <filter id="cglow"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        </defs>
        <ellipse cx={w/2} cy={h*0.6} rx={r} ry={r*0.52} fill="rgba(56,189,248,0.07)" stroke="rgba(56,189,248,0.4)" strokeWidth="1" filter="url(#cglow)" />
        <ellipse cx={w/2-r*0.35} cy={h*0.52} rx={r*0.55} ry={r*0.44} fill="rgba(56,189,248,0.07)" stroke="rgba(56,189,248,0.28)" strokeWidth="0.8" />
        <ellipse cx={w/2+r*0.35} cy={h*0.52} rx={r*0.55} ry={r*0.44} fill="rgba(56,189,248,0.07)" stroke="rgba(56,189,248,0.28)" strokeWidth="0.8" />
        <ellipse cx={w/2} cy={h*0.38} rx={r*0.65} ry={r*0.48} fill="rgba(56,189,248,0.09)" stroke="rgba(56,189,248,0.4)" strokeWidth="1" />
        <circle cx={w/2} cy={h*0.5} r={r*0.72} fill="none" stroke="rgba(56,189,248,0.12)" strokeWidth="0.8" strokeDasharray="4,8">
          <animateTransform attributeName="transform" type="rotate" from={`0 ${w/2} ${h*0.5}`} to={`360 ${w/2} ${h*0.5}`} dur="18s" repeatCount="indefinite" />
        </circle>
        <text x={w/2} y={h*0.48} textAnchor="middle" fill="#38bdf8" fontSize={compact ? 11 : 14} fontFamily="'Share Tech Mono',monospace" fontWeight="700" fontStyle="italic">iNET</text>
        <text x={w/2} y={h*0.62} textAnchor="middle" fill="rgba(56,189,248,0.45)" fontSize={compact ? 6 : 7} fontFamily="'Share Tech Mono',monospace">SD-WAN FABRIC</text>
      </svg>
    </div>
  );
}

// ── DC EXTRA CONTENT ───────────────────────────────────────────────────────
function DCExtra({ compact }) {
  const servers = [{ l:"Storage",c:"#eab308" },{ l:"Mail Srv",c:"#10b981" },{ l:"AD",c:"#06b6d4" },{ l:"Web Srv",c:"#38bdf8" }];
  const vms = [{ l:"Veeam",c:"#00ff9d" },{ l:"OPSWAT",c:"#06b6d4" },{ l:"Ivanti",c:"#f97316" },{ l:"SailPoint",c:"#eab308" },{ l:"Thales",c:"#8b5cf6" },{ l:"VMware",c:"#8b5cf6" }];
  const chip = (item, i) => (
    <div key={i} style={{ fontSize: compact ? 6 : 7, padding:"1px 5px", borderRadius:3, border:`1px solid rgba(${hexRgb(item.c)},0.3)`, background:`rgba(${hexRgb(item.c)},0.08)`, color:item.c, fontFamily:"'Share Tech Mono',monospace" }}>{item.l}</div>
  );
  return (
    <div style={{ display:"flex", gap: compact ? 4 : 6 }}>
      <div style={{ flex:1, border:"1px dashed rgba(239,68,68,0.28)", borderRadius:5, padding: compact ? "3px 4px" : "4px 6px", background:"rgba(239,68,68,0.03)" }}>
        <div style={{ fontSize: compact ? 6 : 7, color:"#ef4444", fontFamily:"'Share Tech Mono',monospace", marginBottom:3 }}>SERVERS</div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:2 }}>{servers.map(chip)}</div>
      </div>
      <div style={{ flex:1, border:"1px dashed rgba(139,92,246,0.28)", borderRadius:5, padding: compact ? "3px 4px" : "4px 6px", background:"rgba(139,92,246,0.03)" }}>
        <div style={{ fontSize: compact ? 6 : 7, color:"#8b5cf6", fontFamily:"'Share Tech Mono',monospace", marginBottom:3 }}>VM / SECURITY</div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:2 }}>{vms.map(chip)}</div>
      </div>
    </div>
  );
}

// ── SITE DATA ──────────────────────────────────────────────────────────────
const SITE_DATA = {
  hq: { title:"HQ", color:"#06b6d4", accentColor:"#0e7490", sdwan:true, coreDevices:["FW-01 Active","FW-02 Standby","Core SW-01","Core SW-02"], accessDevices:["SW-A1 48p","SW-A2 48p","SW-A3 24p","WAP ×12","IP Phones ×85"] },
  dc: { title:"DC", color:"#f97316", accentColor:"#c2410c", sdwan:true, coreDevices:["Core SW-01 L3","Core SW-02 L3","FW Cluster HA","IDS/IPS Inline"], accessDevices:["SAN 32TB NVMe","Object 200TB","SOBR (Veeam)","Tape LTO-9"] },
  b1: { title:"Branch-1", color:"#10b981", accentColor:"#047857", sdwan:true, coreDevices:["FW-01 Active","FW-02 Standby","Core SW-01","Core SW-02"], accessDevices:["SW-A1 48p","SW-A2 48p","SW-A3 48p","WAP ×8","IP Phones ×40"] },
  b2: { title:"Branch-2", color:"#8b5cf6", accentColor:"#6d28d9", sdwan:true, coreDevices:["FW-01 Active","FW-02 Standby","Core SW-01","Core SW-02"], accessDevices:["SW-A1 48p","SW-A2 48p","SW-A3 48p","SW-A4 48p","WAP ×10"] },
};

// ── CONNECTION LINES OVERLAY ───────────────────────────────────────────────
function ConnectionLines({ nodeRefs, containerRef, compact }) {
  const [lines, setLines] = useState([]);

  const recalc = useCallback(() => {
    if (!containerRef.current) return;
    const base = containerRef.current.getBoundingClientRect();
    const center = (ref) => {
      if (!ref?.current) return null;
      const r = ref.current.getBoundingClientRect();
      return { x: r.left - base.left + r.width / 2, y: r.top - base.top + r.height / 2 };
    };
    const cloud = center(nodeRefs.cloud);
    if (!cloud) return;
    const cfg = [
      { ref:nodeRefs.hq,  color:"#06b6d4", label:"90%", health:"good" },
      { ref:nodeRefs.dc,  color:"#f97316", label:"88%", health:"good" },
      { ref:nodeRefs.b1,  color:"#10b981", label:"65%", health:"good" },
      { ref:nodeRefs.b2,  color:"#8b5cf6", label:"50%", health:"warn" },
      { ref:nodeRefs.rw1, color:"#eab308", label:"30%", health:"good", vpn:true },
      { ref:nodeRefs.rw2, color:"#eab308", label:"25%", health:"good", vpn:true },
    ];
    const newLines = cfg.map(c => {
      const pos = center(c.ref);
      if (!pos) return null;
      return { ...c, x1:pos.x, y1:pos.y, x2:cloud.x, y2:cloud.y };
    }).filter(Boolean);
    setLines(newLines);
  }, [nodeRefs, containerRef]);

  useEffect(() => {
    recalc();
    const t1 = setTimeout(recalc, 100);
    const t2 = setTimeout(recalc, 400);
    window.addEventListener("resize", recalc);
    return () => { clearTimeout(t1); clearTimeout(t2); window.removeEventListener("resize", recalc); };
  }, [recalc]);

  const packets = usePackets(lines);
  const hc = h => h === "good" ? "#10b981" : "#eab308";

  return (
    <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%", pointerEvents:"none", overflow:"visible", zIndex:5 }}>
      <defs>
        <filter id="lg"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      {lines.map((line, i) => (
        <g key={i}>
          <line x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2} stroke="#000" strokeWidth={3} opacity={0.5} />
          <line x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2}
            stroke={hc(line.health)} strokeWidth={line.vpn ? 1.2 : 1.8}
            strokeDasharray={line.vpn ? "5,5" : "12,6"} opacity={0.7} filter="url(#lg)">
            <animate attributeName="stroke-dashoffset" from="18" to="0" dur={`${1.0+i*0.1}s`} repeatCount="indefinite" />
          </line>
          {!compact && (
            <text x={(line.x1+line.x2)/2} y={(line.y1+line.y2)/2-7}
              fill={hc(line.health)} fontSize="8" textAnchor="middle"
              fontFamily="'Share Tech Mono',monospace" opacity={0.8}>{line.label}</text>
          )}
        </g>
      ))}
      {packets.map(p => {
        const x = lerp(p.x1, p.x2, p.t);
        const y = lerp(p.y1, p.y2, p.t);
        return (
          <g key={p.id}>
            <circle cx={x} cy={y} r={2.5} fill={p.color} filter="url(#lg)" opacity={0.9} />
            <circle cx={x} cy={y} r={6} fill="none" stroke={p.color} strokeWidth={0.6} opacity={0.28} />
          </g>
        );
      })}
    </svg>
  );
}

// ── TOPOLOGY DIAGRAM ───────────────────────────────────────────────────────
function TopologyDiagram({ onSiteClick, activeSite }) {
  const containerRef = useRef(null);
  const [w, setW] = useState(1000);

  const nodeRefs = {
    hq: useRef(null), dc: useRef(null),
    b1: useRef(null), b2: useRef(null),
    rw1: useRef(null), rw2: useRef(null),
    cloud: useRef(null),
  };

  useEffect(() => {
    const update = () => containerRef.current && setW(containerRef.current.offsetWidth);
    update(); window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const compact = w < 700;
  const mobile = w < 500;

  if (mobile) {
    // ── MOBILE LAYOUT ────────────────────────────────────────────────────
    return (
      <div ref={containerRef} style={{ width:"100%", height:"100%", overflowY:"auto", padding:10, boxSizing:"border-box", position:"relative" }}>
        <ConnectionLines nodeRefs={nodeRefs} containerRef={containerRef} compact />
        <div style={{ display:"flex", flexDirection:"column", gap:8, position:"relative", zIndex:10 }}>
          <div ref={nodeRefs.hq}><SiteBox {...SITE_DATA.hq} compact onClick={() => onSiteClick("hq")} isActive={activeSite==="hq"} /></div>
          <div ref={nodeRefs.dc}><SiteBox {...SITE_DATA.dc} compact onClick={() => onSiteClick("dc")} isActive={activeSite==="dc"} extra={<DCExtra compact />} /></div>
          <div style={{ display:"flex", justifyContent:"center" }} ref={nodeRefs.cloud}><InetCloud nodeRef={nodeRefs.cloud} compact /></div>
          <div style={{ display:"flex", gap:8, justifyContent:"center" }}>
            <div ref={nodeRefs.rw1}><RemoteBox label="Remote-1" icon="🖥️" compact /></div>
            <div ref={nodeRefs.rw2}><RemoteBox label="Remote-2" icon="📱" compact /></div>
          </div>
          <div ref={nodeRefs.b1}><SiteBox {...SITE_DATA.b1} compact onClick={() => onSiteClick("b1")} isActive={activeSite==="b1"} /></div>
          <div ref={nodeRefs.b2}><SiteBox {...SITE_DATA.b2} compact onClick={() => onSiteClick("b2")} isActive={activeSite==="b2"} /></div>
        </div>
      </div>
    );
  }

  // ── DESKTOP / TABLET: PDF-accurate 3×3 grid ──────────────────────────
  // Columns: left-site | center(cloud/remotes) | right-site
  // Rows:    top(HQ|DC) | center(cloud) | bottom(B1|remotes|B2)
  return (
    <div ref={containerRef} style={{ width:"100%", height:"100%", padding: compact ? 8 : 14, boxSizing:"border-box", position:"relative" }}>
      <ConnectionLines nodeRefs={nodeRefs} containerRef={containerRef} compact={compact} />

      <div style={{
        display:"grid",
        gridTemplateColumns:"5fr 3fr 5fr",
        gridTemplateRows:"1fr auto 1fr",
        gap: compact ? 8 : 14,
        height:"100%",
        position:"relative", zIndex:10,
      }}>
        {/* R1C1: HQ */}
        <div ref={nodeRefs.hq} style={{ gridColumn:1, gridRow:1 }}>
          <SiteBox {...SITE_DATA.hq} compact={compact} onClick={() => onSiteClick("hq")} isActive={activeSite==="hq"} />
        </div>
        {/* R1C2: empty top */}
        <div style={{ gridColumn:2, gridRow:1 }} />
        {/* R1C3: DC */}
        <div ref={nodeRefs.dc} style={{ gridColumn:3, gridRow:1 }}>
          <SiteBox {...SITE_DATA.dc} compact={compact} onClick={() => onSiteClick("dc")} isActive={activeSite==="dc"} extra={<DCExtra compact={compact} />} />
        </div>

        {/* R2C1: empty */}
        <div style={{ gridColumn:1, gridRow:2 }} />
        {/* R2C2: iNET cloud CENTER */}
        <div style={{ gridColumn:2, gridRow:2, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <InetCloud nodeRef={nodeRefs.cloud} compact={compact} />
          {/* invisible anchor for connection lines */}
          <div ref={nodeRefs.cloud} style={{ position:"absolute", width:1, height:1, opacity:0, pointerEvents:"none" }} />
        </div>
        {/* R2C3: empty */}
        <div style={{ gridColumn:3, gridRow:2 }} />

        {/* R3C1: Branch-1 */}
        <div ref={nodeRefs.b1} style={{ gridColumn:1, gridRow:3 }}>
          <SiteBox {...SITE_DATA.b1} compact={compact} onClick={() => onSiteClick("b1")} isActive={activeSite==="b1"} />
        </div>
        {/* R3C2: Remote workers */}
        <div style={{ gridColumn:2, gridRow:3, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap: compact ? 8 : 12 }}>
          <div ref={nodeRefs.rw1}><RemoteBox label="Remote worker-1" icon="🖥️" compact={compact} /></div>
          <div ref={nodeRefs.rw2}><RemoteBox label="Remote worker-2" icon="📱" compact={compact} /></div>
        </div>
        {/* R3C3: Branch-2 */}
        <div ref={nodeRefs.b2} style={{ gridColumn:3, gridRow:3 }}>
          <SiteBox {...SITE_DATA.b2} compact={compact} onClick={() => onSiteClick("b2")} isActive={activeSite==="b2"} />
        </div>
      </div>
    </div>
  );
}

// ── VEEAM DATA ─────────────────────────────────────────────────────────────
const VEEAM_STEPS = [
  { id:0, icon:"💻", color:"#38bdf8", label:"Endpoint Discovery", desc:"Veeam auto-discovers all protected workloads across HQ, Branch, and Remote sites via the VBR console.", detail:["Agentless VMware / Hyper-V inventory","Agent-based physical servers","Cloud workload discovery","Continuous auto-refresh"] },
  { id:1, icon:"📸", color:"#06b6d4", label:"App-Consistent Snapshot", desc:"VSS and VMware snapshot APIs quiesce applications before capture — guaranteeing zero data loss.", detail:["VSS for Exchange, SQL, AD","VMware vSphere (no stun)","Oracle RMAN integration","Hyper-V WMI checkpoint"] },
  { id:2, icon:"⚙️",  color:"#10b981", label:"Backup Proxy Processing", desc:"Backup Proxy offloads data processing from the VBR server. Multiple proxies load-balance automatically.", detail:["Hot-Add / Direct NFS / NBD","Automatic load balancing","WAN Accelerator for branches","On-host vs off-host proxy"] },
  { id:3, icon:"🗜️", color:"#eab308", label:"Inline Compression", desc:"All data compressed inline before writing — reducing storage footprint by up to 50%.", detail:["LZ4 ultra-fast (default)","ZSTD high compression ~50%","Per-job level tuning","Intel QAT acceleration"] },
  { id:4, icon:"♻️",  color:"#f97316", label:"Block-Level Deduplication", desc:"Block-level deduplication eliminates redundant blocks. Combined with SOBR, ratios reach 5–10×.", detail:["Inline source-side dedupe","Changed Block Tracking (CBT)","Scale-Out Backup Repository","HPE/Dell DataDomain integration"] },
  { id:5, icon:"💾", color:"#8b5cf6", label:"Repository + Immutability", desc:"Data written to SOBR with immutability — ransomware cannot delete backup data even with admin credentials.", detail:["Scale-Out Backup Repo (SOBR)","Linux Hardened Repository","S3 Object Lock on cloud tier","Auto capacity-tier offload"] },
  { id:6, icon:"📋", color:"#38bdf8", label:"3-2-1-1-0 Backup Copy", desc:"Backup Copy Jobs replicate to secondary location automatically enforcing the 3-2-1-1-0 rule.", detail:["GFS retention policy","Seeding for remote sites","Cloud or tape replication","SureBackup verification"] },
  { id:7, icon:"🔄", color:"#10b981", label:"VM Replication to DR", desc:"Continuous VM replication creates ready replicas at DR site. RPO as low as 15 minutes.", detail:["vSphere / Hyper-V native","RPO as low as 15 minutes","Planned failover, no data loss","Partial VM failover support"] },
  { id:8, icon:"⚡", color:"#ffd700", label:"Instant Recovery", desc:"Instant VM Recovery starts VMs directly from backup storage in under 2 minutes.", detail:["Instant VM Recovery","Instant Disk (iSCSI mount)","Granular file/app-item restore","Secure Restore anti-malware"] },
];

const VEEAM_ADV = [
  { icon:"🛡️", title:"Ransomware-Proof",  body:"Linux Hardened Repo + S3 Object Lock — attackers can't delete backups even with admin credentials." },
  { icon:"⚡", title:"2-Min RTO",          body:"Instant VM Recovery runs directly from backup storage. No full restore needed." },
  { icon:"♻️",  title:"15-Min RPO",         body:"CBT incremental + continuous VM replication reaches RPO of 15 minutes." },
  { icon:"🌐", title:"Any Workload",        body:"VMware, Hyper-V, AWS, Azure, GCP, physical, NAS, Kubernetes — one platform." },
  { icon:"🔍", title:"SureBackup Verified", body:"Every VM booted in isolated Virtual Lab and tested. Zero silent failures." },
  { icon:"📊", title:"Single Pane",         body:"Veeam ONE provides unified monitoring, alerting, and reporting across all sites." },
];

// ── VEEAM PAGE ─────────────────────────────────────────────────────────────
function VeeamPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [progress, setProgress] = useState(0);
  const step = VEEAM_STEPS[activeStep];

  useInterval(() => {
    if (!autoPlay) return;
    setProgress(p => {
      if (p >= 100) { setActiveStep(s => (s+1) % VEEAM_STEPS.length); return 0; }
      return p + 1.5;
    });
  }, 60, autoPlay);

  return (
    <div style={{ padding:"18px 20px", overflowY:"auto", height:"100%", boxSizing:"border-box" }}>
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
        <div style={{ padding:"3px 10px", borderRadius:20, background:"rgba(0,255,157,0.08)", border:"1px solid rgba(0,255,157,0.3)", fontSize:9, color:"#00ff9d", fontFamily:"'Share Tech Mono',monospace", letterSpacing:2 }}>VEEAM B&R v12</div>
        <div style={{ width:5, height:5, borderRadius:"50%", background:"#10b981", animation:"blink 1.5s infinite" }} />
      </div>
      <h2 style={{ margin:"0 0 4px", fontSize:18, fontWeight:700, color:"#fff", fontFamily:"'Orbitron',sans-serif" }}>Full Workload Backup</h2>
      <p style={{ margin:"0 0 14px", fontSize:11, color:"rgba(255,255,255,0.4)" }}>9-step workflow · HQ, DC, Branches, Remote Workers</p>

      {/* Steps */}
      <div style={{ display:"flex", flexDirection:"column", gap:5, marginBottom:14 }}>
        {VEEAM_STEPS.map((s, i) => {
          const isA = activeStep === i;
          return (
            <div key={s.id} onClick={() => { setActiveStep(i); setAutoPlay(false); setProgress(0); }}
              style={{ cursor:"pointer", padding:"9px 11px", borderRadius:7, border:`1.5px solid ${isA ? s.color : "rgba(255,255,255,0.06)"}`, background: isA ? `rgba(${hexRgb(s.color)},0.08)` : "rgba(255,255,255,0.02)", transition:"all 0.18s" }}>
              <div style={{ display:"flex", alignItems:"center", gap:9 }}>
                <div style={{ width:28, height:28, borderRadius:6, flexShrink:0, background:`rgba(${hexRgb(s.color)},0.15)`, border:`1px solid rgba(${hexRgb(s.color)},0.3)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13 }}>{s.icon}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:9, color: isA ? s.color : "rgba(255,255,255,0.35)", fontFamily:"'Share Tech Mono',monospace", letterSpacing:1 }}>STEP {s.id+1}</div>
                  <div style={{ fontSize:11, fontWeight:600, color: isA ? "#fff" : "rgba(255,255,255,0.65)" }}>{s.label}</div>
                </div>
                {isA && autoPlay && (
                  <div style={{ width:32, height:3, borderRadius:2, background:"rgba(255,255,255,0.07)", overflow:"hidden", flexShrink:0 }}>
                    <div style={{ height:"100%", width:`${progress}%`, background:s.color, transition:"width 0.06s linear" }} />
                  </div>
                )}
              </div>
              {isA && (
                <div style={{ marginTop:8, paddingTop:8, borderTop:`1px solid rgba(${hexRgb(s.color)},0.18)` }}>
                  <p style={{ margin:"0 0 7px", fontSize:11, color:"rgba(255,255,255,0.6)", lineHeight:1.6 }}>{s.desc}</p>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:4 }}>
                    {s.detail.map((d, j) => (
                      <div key={j} style={{ fontSize:9, color:"rgba(255,255,255,0.5)", padding:"4px 7px", borderRadius:5, background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.05)", display:"flex", gap:5 }}>
                        <span style={{ color:s.color, flexShrink:0 }}>▸</span>{d}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ display:"flex", gap:7, marginBottom:16 }}>
        <button onClick={() => setAutoPlay(!autoPlay)} style={{ padding:"5px 12px", borderRadius:5, border:`1px solid ${autoPlay?"#00ff9d":"rgba(255,255,255,0.12)"}`, background: autoPlay?"rgba(0,255,157,0.09)":"rgba(255,255,255,0.04)", color: autoPlay?"#00ff9d":"rgba(255,255,255,0.45)", fontSize:9, cursor:"pointer", fontFamily:"'Share Tech Mono',monospace" }}>{autoPlay?"⏸ PAUSE":"▶ AUTO"}</button>
        <button onClick={() => { setActiveStep(s=>Math.max(0,s-1)); setAutoPlay(false); }} style={{ padding:"5px 10px", borderRadius:5, border:"1px solid rgba(255,255,255,0.1)", background:"rgba(255,255,255,0.04)", color:"rgba(255,255,255,0.55)", fontSize:9, cursor:"pointer" }}>← PREV</button>
        <button onClick={() => { setActiveStep(s=>Math.min(VEEAM_STEPS.length-1,s+1)); setAutoPlay(false); }} style={{ padding:"5px 10px", borderRadius:5, border:`1px solid rgba(${hexRgb(step.color)},0.4)`, background:`rgba(${hexRgb(step.color)},0.08)`, color:step.color, fontSize:9, cursor:"pointer" }}>NEXT →</button>
      </div>

      <div style={{ fontSize:8, color:"rgba(255,255,255,0.28)", fontFamily:"'Share Tech Mono',monospace", letterSpacing:3, marginBottom:9 }}>KEY ADVANTAGES</div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))", gap:7, marginBottom:16 }}>
        {VEEAM_ADV.map((a,i) => (
          <div key={i} style={{ padding:"10px 11px", borderRadius:7, border:"1px solid rgba(0,255,157,0.1)", background:"rgba(0,255,157,0.02)" }}>
            <div style={{ fontSize:16, marginBottom:4 }}>{a.icon}</div>
            <div style={{ fontSize:10, fontWeight:700, color:"#00ff9d", marginBottom:3 }}>{a.title}</div>
            <div style={{ fontSize:9, color:"rgba(255,255,255,0.45)", lineHeight:1.5 }}>{a.body}</div>
          </div>
        ))}
      </div>

      <div style={{ fontSize:8, color:"rgba(255,255,255,0.28)", fontFamily:"'Share Tech Mono',monospace", letterSpacing:3, marginBottom:9 }}>PROTECTED WORKLOADS</div>
      <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
        {["VMware vSphere","Microsoft Hyper-V","Windows Servers","Linux Servers","Microsoft 365","AWS EC2","Azure VMs","NAS / File Shares","Kubernetes","Oracle DB","SQL Server","Active Directory","Remote Endpoints"].map((w,i) => (
          <div key={i} style={{ padding:"2px 8px", borderRadius:20, fontSize:8, background:"rgba(0,255,157,0.05)", border:"1px solid rgba(0,255,157,0.16)", color:"rgba(0,255,157,0.8)" }}>{w}</div>
        ))}
      </div>
    </div>
  );
}

// ── SITE DETAIL PANELS ─────────────────────────────────────────────────────
function PanelRow({ v, l, color }) {
  return (
    <span style={{ display:"inline-block", textAlign:"center", marginRight:14, marginBottom:12 }}>
      <div style={{ fontSize:18, fontWeight:700, color }}>{v}</div>
      <div style={{ fontSize:8, color:"rgba(255,255,255,0.32)", fontFamily:"'Share Tech Mono',monospace" }}>{l}</div>
    </span>
  );
}

function HQPanel({ onVeeamClick }) {
  const sec = [
    { name:"FortiGate NGFW", color:"#ef4444", desc:"HA Pair · Next-Gen Firewall" },
    { name:"Veeam Agent", color:"#00ff9d", desc:"Endpoint & Server Backup", isVeeam:true },
    { name:"Ivanti UEM", color:"#f97316", desc:"Unified Endpoint Management" },
    { name:"SentinelOne EDR", color:"#8b5cf6", desc:"Endpoint Detection & Response" },
    { name:"Cisco ISE NAC", color:"#06b6d4", desc:"Network Access Control" },
    { name:"OPSWAT MetaDefender", color:"#eab308", desc:"File & Device Scanning" },
  ];
  return (
    <div style={{ padding:"18px 20px", overflowY:"auto", height:"100%", boxSizing:"border-box" }}>
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
        <span style={{ fontSize:26 }}>🏢</span>
        <div>
          <h2 style={{ margin:0, fontSize:18, fontWeight:700, color:"#06b6d4", fontFamily:"'Orbitron',sans-serif" }}>HEADQUARTERS</h2>
          <div style={{ fontSize:9, color:"rgba(255,255,255,0.32)", fontFamily:"'Share Tech Mono',monospace" }}>PRIMARY SITE · SD-WAN · 90% UPLINK</div>
        </div>
      </div>
      <PanelRow v="120" l="Workstations" color="#06b6d4" />
      <PanelRow v="85" l="IP Phones" color="#06b6d4" />
      <PanelRow v="200+" l="WiFi Clients" color="#06b6d4" />
      <PanelRow v="40" l="IoT Devices" color="#06b6d4" />
      <div style={{ fontSize:8, color:"rgba(255,255,255,0.28)", fontFamily:"'Share Tech Mono',monospace", letterSpacing:3, margin:"10px 0 9px" }}>SECURITY SOLUTIONS</div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))", gap:7 }}>
        {sec.map((s,i) => (
          <div key={i} onClick={s.isVeeam?onVeeamClick:undefined} style={{ padding:"9px 11px", borderRadius:7, border:`1px solid rgba(${hexRgb(s.color)},${s.isVeeam?"0.42":"0.16"})`, background:`rgba(${hexRgb(s.color)},${s.isVeeam?"0.07":"0.03"})`, cursor:s.isVeeam?"pointer":"default" }}>
            <div style={{ fontSize:10, fontWeight:700, color:s.color, marginBottom:2 }}>{s.name}</div>
            <div style={{ fontSize:9, color:"rgba(255,255,255,0.38)" }}>{s.desc}</div>
            {s.isVeeam && <div style={{ fontSize:8, color:s.color, fontFamily:"'Share Tech Mono',monospace", marginTop:4 }}>→ VIEW BACKUP WORKFLOW</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

function DCPanel({ onVeeamClick }) {
  const tools = [
    { name:"Veeam B&R v12", color:"#00ff9d", cat:"Backup & Recovery", isVeeam:true },
    { name:"VMware vSphere 8", color:"#8b5cf6", cat:"Virtualization" },
    { name:"OPSWAT MetaDefender", color:"#06b6d4", cat:"Content Disarm" },
    { name:"Ivanti EASM", color:"#f97316", cat:"Attack Surface Mgmt" },
    { name:"SailPoint IGA", color:"#eab308", cat:"Identity Governance" },
    { name:"Thales HSM", color:"#38bdf8", cat:"Key Management" },
  ];
  return (
    <div style={{ padding:"18px 20px", overflowY:"auto", height:"100%", boxSizing:"border-box" }}>
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
        <span style={{ fontSize:26 }}>⚡</span>
        <div>
          <h2 style={{ margin:0, fontSize:18, fontWeight:700, color:"#f97316", fontFamily:"'Orbitron',sans-serif" }}>DATA CENTER</h2>
          <div style={{ fontSize:9, color:"rgba(255,255,255,0.32)", fontFamily:"'Share Tech Mono',monospace" }}>PRIMARY DC · ALL WORKLOADS VEEAM PROTECTED</div>
        </div>
      </div>
      <PanelRow v="12" l="vSphere Hosts" color="#f97316" />
      <PanelRow v="32TB" l="NVMe SAN" color="#f97316" />
      <PanelRow v="200TB" l="Object Storage" color="#f97316" />
      <PanelRow v="99.999%" l="Uptime SLA" color="#f97316" />
      <div style={{ fontSize:8, color:"rgba(255,255,255,0.28)", fontFamily:"'Share Tech Mono',monospace", letterSpacing:3, margin:"10px 0 9px" }}>SOLUTIONS</div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))", gap:7 }}>
        {tools.map((t,i) => (
          <div key={i} onClick={t.isVeeam?onVeeamClick:undefined} style={{ padding:"9px 11px", borderRadius:7, border:`1px solid rgba(${hexRgb(t.color)},${t.isVeeam?"0.42":"0.16"})`, background:`rgba(${hexRgb(t.color)},${t.isVeeam?"0.07":"0.03"})`, cursor:t.isVeeam?"pointer":"default" }}>
            <div style={{ fontSize:10, fontWeight:700, color:t.color, marginBottom:2 }}>{t.name}</div>
            <div style={{ fontSize:9, color:"rgba(255,255,255,0.38)" }}>{t.cat}</div>
            {t.isVeeam && <div style={{ fontSize:8, color:t.color, fontFamily:"'Share Tech Mono',monospace", marginTop:4 }}>→ BACKUP WORKFLOW</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

function BranchPanel({ siteId, onVeeamClick }) {
  const s = SITE_DATA[siteId];
  return (
    <div style={{ padding:"18px 20px", overflowY:"auto", height:"100%", boxSizing:"border-box" }}>
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
        <span style={{ fontSize:26 }}>🏪</span>
        <div>
          <h2 style={{ margin:0, fontSize:18, fontWeight:700, color:s.color, fontFamily:"'Orbitron',sans-serif" }}>{s.title.toUpperCase()}</h2>
          <div style={{ fontSize:9, color:"rgba(255,255,255,0.32)", fontFamily:"'Share Tech Mono',monospace" }}>BRANCH OFFICE · SD-WAN · VEEAM PROTECTED</div>
        </div>
      </div>
      <div style={{ fontSize:8, color:"rgba(255,255,255,0.28)", fontFamily:"'Share Tech Mono',monospace", letterSpacing:3, marginBottom:8 }}>CORE LAYER</div>
      <div style={{ display:"flex", flexWrap:"wrap", gap:5, marginBottom:12 }}>
        {s.coreDevices.map((d,i) => <DeviceChip key={i} label={d} color={s.accentColor} />)}
      </div>
      <div style={{ fontSize:8, color:"rgba(255,255,255,0.28)", fontFamily:"'Share Tech Mono',monospace", letterSpacing:3, marginBottom:8 }}>ACCESS LAYER</div>
      <div style={{ display:"flex", flexWrap:"wrap", gap:5, marginBottom:16 }}>
        {s.accessDevices.map((d,i) => <DeviceChip key={i} label={d} color={s.color} />)}
      </div>
      <div onClick={onVeeamClick} style={{ padding:"11px 13px", borderRadius:8, cursor:"pointer", border:"1px solid rgba(0,255,157,0.32)", background:"rgba(0,255,157,0.05)" }}>
        <div style={{ fontSize:11, fontWeight:700, color:"#00ff9d", marginBottom:2 }}>🛡️ Veeam Agent</div>
        <div style={{ fontSize:9, color:"rgba(255,255,255,0.38)" }}>Backup to DC via WAN Accelerator</div>
        <div style={{ fontSize:8, color:"#00ff9d", fontFamily:"'Share Tech Mono',monospace", marginTop:4 }}>→ VIEW BACKUP WORKFLOW</div>
      </div>
    </div>
  );
}

// ── SIDE PANEL ─────────────────────────────────────────────────────────────
function SidePanel({ page, onClose, onVeeamClick, isMobile }) {
  const content = { hq:<HQPanel onVeeamClick={onVeeamClick}/>, dc:<DCPanel onVeeamClick={onVeeamClick}/>, b1:<BranchPanel siteId="b1" onVeeamClick={onVeeamClick}/>, b2:<BranchPanel siteId="b2" onVeeamClick={onVeeamClick}/>, veeam:<VeeamPage/> };
  const colors = { hq:"#06b6d4", dc:"#f97316", b1:"#10b981", b2:"#8b5cf6", veeam:"#00ff9d" };
  const c = colors[page] || "#38bdf8";
  return (
    <div style={{
      position:"fixed",
      ...(isMobile ? { bottom:0, left:0, right:0, top:"38%", borderRadius:"14px 14px 0 0" } : { top:0, bottom:0, right:0, width:"min(600px,50vw)" }),
      background:"rgba(2,4,14,0.97)", border:`1px solid rgba(${hexRgb(c)},0.18)`,
      display:"flex", flexDirection:"column", backdropFilter:"blur(20px)",
      zIndex:200, animation: isMobile ? "slideUp 0.22s ease" : "slideIn 0.22s ease",
    }}>
      <div style={{ padding:"11px 16px", borderBottom:"1px solid rgba(255,255,255,0.06)", display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0 }}>
        <div style={{ fontSize:11, fontWeight:700, color:c, fontFamily:"'Share Tech Mono',monospace", letterSpacing:2 }}>
          {page === "veeam" ? "VEEAM BACKUP & REPLICATION" : page.toUpperCase() + " — DETAIL"}
        </div>
        <button onClick={onClose} style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.09)", color:"rgba(255,255,255,0.55)", borderRadius:5, padding:"3px 9px", cursor:"pointer", fontSize:10 }}>✕</button>
      </div>
      <div style={{ flex:1, overflowY:"auto" }}>{content[page]}</div>
    </div>
  );
}

// ── HEADER ─────────────────────────────────────────────────────────────────
function Header({ clock, isMobile }) {
  return (
    <div style={{ position:"fixed", top:0, left:0, right:0, height: isMobile?44:52, zIndex:100, display:"flex", alignItems:"center", justifyContent:"space-between", padding: isMobile?"0 12px":"0 20px", background:"rgba(2,4,14,0.96)", borderBottom:"1px solid rgba(255,255,255,0.06)", backdropFilter:"blur(10px)" }}>
      <div style={{ display:"flex", alignItems:"center", gap:9 }}>
        <div style={{ width: isMobile?24:28, height: isMobile?24:28, borderRadius:7, border:"1.5px solid #38bdf8", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 0 9px rgba(56,189,248,0.28)" }}>
          <div style={{ width:7, height:7, background:"#38bdf8", borderRadius:2, animation:"pulse 2s infinite" }} />
        </div>
        <div>
          <div style={{ color:"#38bdf8", fontSize: isMobile?9:11, fontWeight:700, letterSpacing:3, fontFamily:"'Share Tech Mono',monospace" }}>ENTERPRISE NETWORK TOPOLOGY</div>
          {!isMobile && <div style={{ color:"rgba(56,189,248,0.32)", fontSize:7, letterSpacing:3, fontFamily:"'Share Tech Mono',monospace" }}>INTERACTIVE ARCHITECTURE · VEEAM PROTECTED</div>}
        </div>
      </div>
      <div style={{ display:"flex", gap:10, alignItems:"center" }}>
        <div style={{ display:"flex", alignItems:"center", gap:4 }}>
          <div style={{ width:5, height:5, borderRadius:"50%", background:"#10b981", animation:"blink 1.5s infinite" }} />
          {!isMobile && <span style={{ color:"#10b981", fontSize:8, fontFamily:"'Share Tech Mono',monospace" }}>ALL SITES NOMINAL</span>}
        </div>
        <span style={{ color:"rgba(255,255,255,0.2)", fontSize:9, fontFamily:"'Share Tech Mono',monospace" }}>{clock.toLocaleTimeString("en-US",{hour12:false})}</span>
      </div>
    </div>
  );
}

// ── BOTTOM NAV ─────────────────────────────────────────────────────────────
function BottomNav({ activePage, onNavigate }) {
  const items = [
    { id:"hq", icon:"🏢", label:"HQ", color:"#06b6d4" },
    { id:"dc", icon:"⚡", label:"DC", color:"#f97316" },
    { id:"b1", icon:"🏪", label:"Branch-1", color:"#10b981" },
    { id:"b2", icon:"🏪", label:"Branch-2", color:"#8b5cf6" },
    { id:"veeam", icon:"🛡️", label:"Veeam", color:"#00ff9d" },
  ];
  return (
    <div style={{ position:"fixed", bottom:14, left:"50%", transform:"translateX(-50%)", display:"flex", gap:5, zIndex:300, background:"rgba(2,4,14,0.94)", borderRadius:12, border:"1px solid rgba(255,255,255,0.07)", padding:"5px 8px", backdropFilter:"blur(16px)" }}>
      {items.map(item => {
        const isA = activePage === item.id;
        return (
          <button key={item.id} onClick={() => onNavigate(item.id === activePage ? null : item.id)} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:2, padding:"4px 9px", borderRadius:7, cursor:"pointer", border:`1px solid ${isA?item.color:"rgba(255,255,255,0.06)"}`, background: isA?`rgba(${hexRgb(item.color)},0.11)`:"transparent", transition:"all 0.18s" }}>
            <span style={{ fontSize:13 }}>{item.icon}</span>
            <span style={{ fontSize:7, color: isA?item.color:"rgba(255,255,255,0.3)", fontFamily:"'Share Tech Mono',monospace", whiteSpace:"nowrap" }}>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ── ROOT APP ───────────────────────────────────────────────────────────────
export default function App() {
  const [activePage, setActivePage] = useState(null);
  const [clock, setClock] = useState(new Date());
  const [winW, setWinW] = useState(window.innerWidth);

  useInterval(() => setClock(new Date()), 1000);
  useEffect(() => {
    const u = () => setWinW(window.innerWidth);
    window.addEventListener("resize", u);
    return () => window.removeEventListener("resize", u);
  }, []);

  const isMobile = winW < 640;
  const headerH = isMobile ? 44 : 52;

  return (
    <div style={{ width:"100vw", height:"100vh", background:"#02040e", overflow:"hidden", position:"relative" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Orbitron:wght@700&display=swap');
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0.1}}
        @keyframes pulse{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(0.75);opacity:0.35}}
        @keyframes pulseRing{0%{transform:scale(1);opacity:0.35}100%{transform:scale(1.09);opacity:0}}
        @keyframes slideIn{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}
        @keyframes slideUp{from{transform:translateY(100%);opacity:0}to{transform:translateY(0);opacity:1}}
        *{box-sizing:border-box}
        button{outline:none;font-family:inherit}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-track{background:rgba(255,255,255,0.02)}
        ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.1);border-radius:2px}
      `}</style>

      {/* Grid BG */}
      <div style={{ position:"absolute", inset:0, pointerEvents:"none", backgroundImage:"linear-gradient(rgba(56,189,248,0.016) 1px,transparent 1px),linear-gradient(90deg,rgba(56,189,248,0.016) 1px,transparent 1px)", backgroundSize:"38px 38px" }} />

      <Header clock={clock} isMobile={isMobile} />

      {/* Main diagram */}
      <div style={{ position:"absolute", top:headerH, bottom:0, left:0, right:0 }}>
        <TopologyDiagram
          onSiteClick={id => setActivePage(id === activePage ? null : id)}
          activeSite={activePage}
        />
      </div>

      {/* Hint */}
      <div style={{ position:"fixed", top:headerH+5, left:"50%", transform:"translateX(-50%)", background:"rgba(4,8,20,0.82)", border:"1px solid rgba(255,255,255,0.04)", borderRadius:4, padding:"3px 10px", fontSize:7, color:"rgba(255,255,255,0.22)", fontFamily:"'Share Tech Mono',monospace", letterSpacing:2, pointerEvents:"none", zIndex:50, whiteSpace:"nowrap" }}>
        CLICK SITE TO EXPLORE · NAV BELOW FOR VEEAM BACKUP DETAILS
      </div>

      {activePage && (
        <SidePanel page={activePage} onClose={() => setActivePage(null)} onVeeamClick={() => setActivePage("veeam")} isMobile={isMobile} />
      )}

      <BottomNav activePage={activePage} onNavigate={setActivePage} />
    </div>
  );
}
