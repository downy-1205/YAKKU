// Screen 2 — Main editor (3D ball + sticker panel sliding up)

function EditorScreen({ team, onBack, onShare }) {
  const [stickers, setStickers] = React.useState([
    { kind:'logo', x:52, y:42, scale:0.9, rot:-10 },
    { kind:'number', x:35, y:62, scale:0.7, rot:5, payload:'10' },
    { kind:'cheer', x:70, y:72, scale:0.75, rot:12, payload:'V12' },
  ]);
  const [tab, setTab] = React.useState('logo');
  const [size, setSize] = React.useState(0.8);
  const [rotation, setRotation] = React.useState(0);
  const [autoSpin, setAutoSpin] = React.useState(true);
  const [number, setNumber] = React.useState('10');
  const [selectedIdx, setSelectedIdx] = React.useState(null);
  const [activeKind, setActiveKind] = React.useState(null); // kind queued for next tap-to-place
  const [activePayload, setActivePayload] = React.useState(null);

  const removeLast = () => { setStickers(s => s.slice(0,-1)); setSelectedIdx(null); };
  const queueSticker = (kind, payload) => {
    setActiveKind(kind);
    setActivePayload(payload);
    setSelectedIdx(null);
  };

  // When sliders change, apply to selected sticker
  React.useEffect(() => {
    if (selectedIdx == null) return;
    setStickers(s => s.map((sk, i) => i === selectedIdx ? { ...sk, scale: size, rot: rotation } : sk));
  }, [size, rotation]);

  // When user selects a sticker, sync sliders to its values
  React.useEffect(() => {
    if (selectedIdx == null) return;
    const sk = stickers[selectedIdx];
    if (!sk) return;
    setSize(sk.scale ?? 0.8);
    setRotation(sk.rot ?? 0);
  }, [selectedIdx]);

  const tabs = [
    { id:'logo',   label:'로고',   icon:'◎' },
    { id:'mascot', label:'마스코트', icon:'★' },
    { id:'number', label:'등번호', icon:'#' },
    { id:'cheer',  label:'응원',   icon:'♪' },
  ];

  return (
    <div style={{
      position:'absolute', inset:0,
      background:`radial-gradient(ellipse at 50% 30%, ${team.primary}2a 0%, #09090b 55%, #000 100%)`,
      color:'#fff', display:'flex', flexDirection:'column', overflow:'hidden',
    }}>
      {/* stadium light streaks */}
      <div style={{
        position:'absolute', inset:0,
        backgroundImage:`
          linear-gradient(115deg, transparent 45%, ${team.primary}10 50%, transparent 55%),
          linear-gradient(65deg, transparent 45%, #ffffff08 50%, transparent 55%)
        `,
        pointerEvents:'none',
      }}/>

      {/* top bar */}
      <div style={{
        position:'relative', zIndex:5, padding:'62px 16px 12px',
        display:'flex', alignItems:'center', justifyContent:'space-between',
      }}>
        <button onClick={onBack} style={{
          width:40, height:40, borderRadius:'50%', border:'1px solid #2a2a2e',
          background:'rgba(20,20,22,0.7)', backdropFilter:'blur(12px)',
          color:'#fff', cursor:'pointer', fontSize:18,
        }}>←</button>
        <div style={{display:'flex', alignItems:'center', gap:8}}>
          <div style={{width:8, height:8, borderRadius:'50%', background:team.primary,
            boxShadow:`0 0 10px ${team.primary}`}}/>
          <div style={{
            fontFamily:'Space Grotesk, sans-serif', fontSize:11, fontWeight:700,
            letterSpacing:2, textTransform:'uppercase', color:'#ccc',
          }}>{team.en}</div>
        </div>
        <button style={{
          width:40, height:40, borderRadius:'50%', border:'1px solid #2a2a2e',
          background:'rgba(20,20,22,0.7)', backdropFilter:'blur(12px)',
          color:'#fff', cursor:'pointer', fontSize:14,
        }}>↺</button>
      </div>

      {/* 3D ball viewport */}
      <div style={{
        flex:1, display:'flex', alignItems:'center', justifyContent:'center',
        position:'relative', minHeight: 300,
      }}>
        {/* spotlight floor */}
        <div style={{
          position:'absolute', bottom:'12%', left:'50%', transform:'translateX(-50%)',
          width:220, height:40, borderRadius:'50%',
          background:`radial-gradient(ellipse, ${team.primary}40, transparent 70%)`,
          filter:'blur(8px)',
        }}/>
        <Baseball team={team} size={280} stickers={stickers} setStickers={setStickers}
          spinning={autoSpin} rotation={rotation}
          interactive={true}
          selectedIndex={selectedIdx} setSelectedIndex={setSelectedIdx}
          activeStickerKind={activeKind} activePayload={activePayload} />

        {/* Positioning hint */}
        {activeKind && selectedIdx == null && (
          <div style={{
            position:'absolute', top:56, left:'50%', transform:'translateX(-50%)',
            padding:'8px 14px', borderRadius:20,
            background:'rgba(10,10,12,0.75)', backdropFilter:'blur(12px)',
            border:`1px solid ${team.primary}40`,
            fontFamily:'IBM Plex Sans KR, sans-serif', fontSize:12, color:'#fff', fontWeight:600,
            display:'flex', alignItems:'center', gap:8,
          }}>
            <span style={{width:6, height:6, borderRadius:'50%', background:team.primary,
              boxShadow:`0 0 8px ${team.primary}`, animation:'ballspin 1s linear infinite'}}/>
            야구공을 탭해 <span style={{color:team.primary}}>스티커를 붙이세요</span>
          </div>
        )}
        {selectedIdx != null && (
          <div style={{
            position:'absolute', top:56, left:'50%', transform:'translateX(-50%)',
            padding:'8px 14px', borderRadius:20,
            background:'rgba(10,10,12,0.75)', backdropFilter:'blur(12px)',
            border:`1px solid ${team.primary}40`,
            fontFamily:'IBM Plex Sans KR, sans-serif', fontSize:12, color:'#fff', fontWeight:600,
            display:'flex', alignItems:'center', gap:10,
          }}>
            <span style={{color:team.primary}}>◉ 스티커 #{selectedIdx+1}</span>
            <span style={{color:'#666'}}>드래그로 이동</span>
            <button onClick={()=>{setStickers(s=>s.filter((_,i)=>i!==selectedIdx)); setSelectedIdx(null);}}
              style={{background:'transparent', border:'none', color:'#fff', cursor:'pointer', fontSize:12}}>삭제</button>
            <button onClick={()=>setSelectedIdx(null)}
              style={{background:'transparent', border:'none', color:'#888', cursor:'pointer', fontSize:12}}>✕</button>
          </div>
        )}

        {/* floating sticker count chip */}
        <div style={{
          position:'absolute', top:8, right:16,
          padding:'8px 12px', borderRadius:20, border:'1px solid #2a2a2e',
          background:'rgba(10,10,12,0.6)', backdropFilter:'blur(12px)',
          fontFamily:'Space Grotesk, sans-serif', fontSize:11, fontWeight:600,
          letterSpacing:1, color:'#aaa', display:'flex', alignItems:'center', gap:6,
        }}>
          <span style={{color:team.primary}}>●</span>
          STICKERS {String(stickers.length).padStart(2,'0')}/12
        </div>

        {/* undo / reset floating */}
        <div style={{
          position:'absolute', left:16, bottom:12, display:'flex', flexDirection:'column', gap:8,
        }}>
          <IconBtn team={team} onClick={removeLast}>↶</IconBtn>
          <IconBtn team={team} onClick={()=>setStickers([])}>✕</IconBtn>
          <IconBtn team={team} active={autoSpin} onClick={()=>setAutoSpin(!autoSpin)}>⟳</IconBtn>
        </div>

        {/* share floating */}
        <div style={{ position:'absolute', right:16, bottom:12 }}>
          <button onClick={onShare} style={{
            height:44, padding:'0 18px', border:'none', borderRadius:22,
            background: team.primary, color:'#fff', cursor:'pointer',
            fontFamily:'IBM Plex Sans KR, sans-serif', fontWeight:700, fontSize:14,
            display:'flex', alignItems:'center', gap:8,
            boxShadow:`0 6px 20px ${team.primary}70`,
          }}>
            완성 <span style={{fontSize:16}}>→</span>
          </button>
        </div>
      </div>

      {/* Sticker panel — slid up from bottom */}
      <div style={{
        position:'relative', zIndex:10,
        background:'linear-gradient(to bottom, rgba(15,15,18,0.9), #0a0a0c)',
        borderTop:'1px solid #1e1e22', borderTopLeftRadius:28, borderTopRightRadius:28,
        backdropFilter:'blur(20px)',
        padding:'10px 0 30px',
      }}>
        {/* drag handle */}
        <div style={{width:40, height:4, borderRadius:2, background:'#333',
          margin:'0 auto 14px'}}/>

        {/* tabs */}
        <div style={{display:'flex', gap:6, padding:'0 16px', marginBottom:14}}>
          {tabs.map(tb => (
            <button key={tb.id} onClick={()=>setTab(tb.id)} style={{
              flex:1, height:36, border:'none', borderRadius:10,
              background: tab===tb.id ? team.primary : '#17171a',
              color: tab===tb.id ? '#fff' : '#888',
              fontFamily:'IBM Plex Sans KR, sans-serif', fontWeight:600, fontSize:13,
              cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:6,
              transition:'all .2s',
            }}>
              <span style={{fontSize:14}}>{tb.icon}</span>{tb.label}
            </button>
          ))}
        </div>

        {/* content per tab */}
        <div style={{padding:'0 16px', minHeight:120}}>
          {tab === 'logo' && <StickerGrid team={team} activeKind={activeKind} activePayload={activePayload} items={[
            {kind:'logo'}, {kind:'star'}, {kind:'logo', alt:true}, {kind:'star', alt:true},
          ]} onPick={(k)=>queueSticker(k.kind, k.payload)} />}
          {tab === 'mascot' && <StickerGrid team={team} activeKind={activeKind} activePayload={activePayload} items={[
            {kind:'mascot'}, {kind:'mascot', payload:'2'}, {kind:'mascot', payload:'3'}, {kind:'mascot', payload:'4'},
          ]} onPick={(k)=>queueSticker('mascot', k.payload)} />}
          {tab === 'number' && <NumberEditor team={team} value={number} onChange={setNumber}
            onAdd={()=>queueSticker('number', number)} />}
          {tab === 'cheer' && <StickerGrid team={team} activeKind={activeKind} activePayload={activePayload} items={[
            {kind:'cheer', payload:'V12'}, {kind:'cheer', payload:'최강'},
            {kind:'cheer', payload:'GO!'}, {kind:'cheer', payload:'KBO'},
          ]} onPick={(k)=>queueSticker('cheer', k.payload)} />}
        </div>

        {/* size & rotation */}
        <div style={{padding:'14px 16px 0', display:'grid', gap:10}}>
          <SliderRow label="크기" value={size} onChange={setSize} min={0.4} max={1.4} team={team} />
          <SliderRow label="회전" value={rotation} onChange={setRotation} min={-180} max={180} team={team} suffix="°" />
        </div>
      </div>
    </div>
  );
}

function IconBtn({ children, onClick, team, active }) {
  return (
    <button onClick={onClick} style={{
      width:40, height:40, borderRadius:'50%', cursor:'pointer',
      border: active ? `1px solid ${team.primary}` : '1px solid #2a2a2e',
      background: active ? `${team.primary}22` : 'rgba(10,10,12,0.6)',
      backdropFilter:'blur(12px)', color: active ? team.primary : '#ccc',
      fontSize:16, display:'flex', alignItems:'center', justifyContent:'center',
    }}>{children}</button>
  );
}

function StickerGrid({ team, items, onPick, activeKind, activePayload }) {
  return (
    <div style={{display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:8}}>
      {items.map((it, i) => {
        const isActive = activeKind === it.kind && (activePayload ?? null) === (it.payload ?? null);
        return (
        <button key={i} onClick={()=>onPick(it)} style={{
          aspectRatio:'1/1',
          border: isActive ? `1.5px solid ${team.primary}` : '1px solid #222',
          borderRadius:12,
          background: isActive ? `${team.primary}18` : '#121215',
          cursor:'pointer', display:'flex',
          alignItems:'center', justifyContent:'center', padding:8,
          transition:'all .2s',
        }}>
          <div style={{width:44, height:44, display:'flex', alignItems:'center', justifyContent:'center'}}>
            <StickerArt kind={it.kind} team={team} payload={it.payload} size={44} />
          </div>
        </button>
      );})}
    </div>
  );
}

function NumberEditor({ team, value, onChange, onAdd }) {
  return (
    <div style={{display:'flex', gap:10, alignItems:'center'}}>
      <div style={{
        flex:1, height:72, borderRadius:14, border:'1px solid #222',
        background:'#0f0f12', display:'flex', alignItems:'center', padding:'0 14px',
      }}>
        <div style={{flex:1, display:'flex', gap:8, alignItems:'center'}}>
          <div style={{fontSize:11, color:'#666', fontFamily:'Space Grotesk, sans-serif',
            fontWeight:600, letterSpacing:2}}>NO.</div>
          <input value={value} onChange={e=>onChange(e.target.value.slice(0,2))}
            inputMode="numeric" style={{
            flex:1, background:'transparent', border:'none', outline:'none', color:'#fff',
            fontFamily:'Space Grotesk, sans-serif', fontWeight:900, fontSize:34,
            fontStyle:'italic', padding:0,
          }}/>
        </div>
        <div style={{width:48, height:48, borderRadius:8, background: team.primary,
          display:'flex', alignItems:'center', justifyContent:'center',
          fontFamily:'Space Grotesk, sans-serif', fontWeight:900, fontSize:22,
          fontStyle:'italic', color:'#fff'}}>{value||'?'}</div>
      </div>
      <button onClick={onAdd} style={{
        height:72, padding:'0 18px', border:'none', borderRadius:14,
        background:team.primary, color:'#fff', cursor:'pointer',
        fontFamily:'IBM Plex Sans KR, sans-serif', fontWeight:700, fontSize:14,
      }}>추가</button>
    </div>
  );
}

function SliderRow({ label, value, onChange, min, max, team, suffix='' }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div style={{display:'flex', justifyContent:'space-between', marginBottom:6,
        fontFamily:'IBM Plex Sans KR, sans-serif', fontSize:11}}>
        <span style={{color:'#888'}}>{label}</span>
        <span style={{color:team.primary, fontFamily:'Space Grotesk, sans-serif', fontWeight:700}}>
          {typeof value === 'number' ? value.toFixed(suffix ? 0 : 2) : value}{suffix}
        </span>
      </div>
      <div style={{position:'relative', height:20, display:'flex', alignItems:'center'}}>
        <div style={{position:'absolute', inset:'8px 0', height:4, background:'#1e1e22', borderRadius:2}}/>
        <div style={{position:'absolute', top:8, left:0, width:`${pct}%`, height:4,
          background:team.primary, borderRadius:2}}/>
        <input type="range" min={min} max={max} step={(max-min)/200} value={value}
          onChange={e=>onChange(parseFloat(e.target.value))}
          style={{position:'absolute', inset:0, width:'100%', opacity:0, cursor:'pointer'}}/>
        <div style={{position:'absolute', left:`${pct}%`, width:16, height:16,
          borderRadius:'50%', background:'#fff', transform:'translateX(-50%)',
          boxShadow:`0 0 0 3px ${team.primary}, 0 2px 6px rgba(0,0,0,0.5)`}}/>
      </div>
    </div>
  );
}

window.EditorScreen = EditorScreen;
