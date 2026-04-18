// Screen 3 — Share / Save result

function ShareScreen({ team, onBack }) {
  const [copied, setCopied] = React.useState(false);
  const demoStickers = [
    { kind:'logo', x:52, y:42, scale:0.9, rot:-10 },
    { kind:'number', x:35, y:62, scale:0.7, rot:5, payload:'10' },
    { kind:'cheer', x:70, y:72, scale:0.75, rot:12, payload:'V12' },
    { kind:'star', x:40, y:30, scale:0.5, rot:-20 },
  ];

  const actions = [
    { id:'link', label:'링크 복사', icon:'⎘', onClick:()=>{ setCopied(true); setTimeout(()=>setCopied(false), 1800); } },
    { id:'img',  label:'이미지 저장', icon:'⬇' },
    { id:'insta',label:'인스타 스토리', icon:'◻' },
    { id:'kakao',label:'카카오톡', icon:'💬' },
  ];

  return (
    <div style={{
      position:'absolute', inset:0, background:'#09090b', color:'#fff',
      display:'flex', flexDirection:'column', overflow:'hidden',
    }}>
      {/* colored fog */}
      <div style={{
        position:'absolute', top:-160, left:-100, width:500, height:500,
        background:`radial-gradient(circle, ${team.primary}55, transparent 60%)`,
        filter:'blur(40px)', pointerEvents:'none',
      }}/>
      <div style={{
        position:'absolute', bottom:-200, right:-120, width:500, height:500,
        background:`radial-gradient(circle, ${team.primary}3a, transparent 60%)`,
        filter:'blur(40px)', pointerEvents:'none',
      }}/>

      {/* top bar */}
      <div style={{
        position:'relative', zIndex:5, padding:'62px 16px 0',
        display:'flex', alignItems:'center', justifyContent:'space-between',
      }}>
        <button onClick={onBack} style={{
          width:40, height:40, borderRadius:'50%', border:'1px solid #2a2a2e',
          background:'rgba(20,20,22,0.7)', backdropFilter:'blur(12px)',
          color:'#fff', cursor:'pointer', fontSize:18,
        }}>←</button>
        <div style={{
          fontFamily:'Space Grotesk, sans-serif', fontSize:11, fontWeight:600,
          letterSpacing:2, color:'#888',
        }}>SHARE / 03</div>
        <div style={{width:40}}/>
      </div>

      {/* result card */}
      <div style={{
        padding:'20px 20px 12px', position:'relative', zIndex:3,
      }}>
        <div style={{
          fontFamily:'IBM Plex Sans KR, sans-serif', fontSize:11, color:team.primary,
          letterSpacing:2, marginBottom:6, fontWeight:700,
        }}>완성되었어요 ✨</div>
        <div style={{
          fontFamily:'IBM Plex Sans KR, sans-serif', fontSize:26, fontWeight:700,
          letterSpacing:-1, lineHeight:1.1,
        }}>내가 만든 <span style={{color:team.primary}}>{team.short}</span><br/>야구공을 공유하세요</div>
      </div>

      {/* Share card — like a trading card */}
      <div style={{
        flex:1, padding:'14px 20px 0', position:'relative', zIndex:3,
        display:'flex', justifyContent:'center',
      }}>
        <div style={{
          width:'100%', maxWidth:360, aspectRatio:'3/4',
          background: `linear-gradient(160deg, #13131a, #0c0c10)`,
          border:'1px solid #222', borderRadius:22,
          padding:18, position:'relative', overflow:'hidden',
          boxShadow:`0 30px 60px rgba(0,0,0,0.6), 0 0 0 1px ${team.primary}40, 0 0 40px ${team.primary}30`,
        }}>
          {/* corner marks */}
          <div style={{position:'absolute', top:12, left:12, width:14, height:14,
            borderTop:`2px solid ${team.primary}`, borderLeft:`2px solid ${team.primary}`}}/>
          <div style={{position:'absolute', top:12, right:12, width:14, height:14,
            borderTop:`2px solid ${team.primary}`, borderRight:`2px solid ${team.primary}`}}/>
          <div style={{position:'absolute', bottom:12, left:12, width:14, height:14,
            borderBottom:`2px solid ${team.primary}`, borderLeft:`2px solid ${team.primary}`}}/>
          <div style={{position:'absolute', bottom:12, right:12, width:14, height:14,
            borderBottom:`2px solid ${team.primary}`, borderRight:`2px solid ${team.primary}`}}/>

          {/* header of card */}
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', padding:'4px 8px'}}>
            <div>
              <div style={{fontFamily:'Space Grotesk, sans-serif', fontSize:9, letterSpacing:2,
                color:'#666', fontWeight:600}}>YAKKU · 야꾸</div>
              <div style={{fontFamily:'Space Grotesk, sans-serif', fontWeight:900, fontSize:22,
                color:'#fff', letterSpacing:-1, marginTop:2}}>{team.en}</div>
            </div>
            <div style={{
              padding:'4px 8px', borderRadius:4, background:team.primary,
              fontFamily:'Space Grotesk, sans-serif', fontSize:10, fontWeight:800,
              letterSpacing:1,
            }}>#{Math.floor(Math.random()*9000+1000)}</div>
          </div>

          {/* ball showcase */}
          <div style={{
            margin:'10px 0', aspectRatio:'1/1', borderRadius:16,
            background: `radial-gradient(ellipse at 50% 60%, ${team.primary}22 0%, transparent 70%),
              repeating-linear-gradient(90deg, #0c0c10 0 2px, transparent 2px 40px),
              repeating-linear-gradient(0deg, #0c0c10 0 2px, transparent 2px 40px),
              #07070a`,
            border:`1px solid ${team.primary}33`,
            display:'flex', alignItems:'center', justifyContent:'center',
            position:'relative', overflow:'hidden',
          }}>
            {/* spotlight */}
            <div style={{
              position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)',
              width:300, height:300, borderRadius:'50%',
              background:`radial-gradient(circle, ${team.primary}30, transparent 70%)`,
              filter:'blur(20px)',
            }}/>
            <Baseball team={team} size={200} stickers={demoStickers} spinning={true} />
          </div>

          {/* meta */}
          <div style={{padding:'4px 8px', display:'flex', justifyContent:'space-between', alignItems:'flex-end'}}>
            <div>
              <div style={{fontFamily:'IBM Plex Sans KR, sans-serif', fontSize:11, color:'#888'}}>MADE BY</div>
              <div style={{fontFamily:'IBM Plex Sans KR, sans-serif', fontSize:15, fontWeight:700,
                color:'#fff', marginTop:2}}>@yakku_fan · 2026</div>
            </div>
            <div style={{textAlign:'right'}}>
              <div style={{fontFamily:'Space Grotesk, sans-serif', fontSize:9, letterSpacing:2,
                color:'#666', fontWeight:600}}>STICKERS</div>
              <div style={{fontFamily:'Space Grotesk, sans-serif', fontSize:18, fontWeight:900,
                color:team.primary, letterSpacing:-0.5}}>04</div>
            </div>
          </div>
        </div>
      </div>

      {/* link row */}
      <div style={{padding:'16px 20px 0', position:'relative', zIndex:3}}>
        <div style={{
          height:48, borderRadius:14, background:'#111115', border:'1px solid #222',
          display:'flex', alignItems:'center', padding:'0 14px', gap:10,
        }}>
          <div style={{fontSize:13, color:'#666',
            fontFamily:'Space Grotesk, sans-serif', letterSpacing:0.3,
            flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>
            yakku.kr/b/{team.id}-XK42M7
          </div>
          <button onClick={()=>{setCopied(true); setTimeout(()=>setCopied(false),1800);}} style={{
            height:32, padding:'0 14px', border:'none', borderRadius:8,
            background: copied ? '#2a8f4a' : team.primary, color:'#fff', cursor:'pointer',
            fontFamily:'IBM Plex Sans KR, sans-serif', fontWeight:700, fontSize:12,
            transition:'background .2s',
          }}>{copied ? '복사됨 ✓' : '복사'}</button>
        </div>
      </div>

      {/* actions grid */}
      <div style={{
        padding:'14px 20px 34px', display:'grid',
        gridTemplateColumns:'repeat(4, 1fr)', gap:8,
      }}>
        {actions.map(a => (
          <button key={a.id} onClick={a.onClick} style={{
            aspectRatio:'1/1', border:'1px solid #222', borderRadius:14,
            background:'#111115', cursor:'pointer', display:'flex',
            flexDirection:'column', alignItems:'center', justifyContent:'center', gap:6,
          }}>
            <div style={{
              width:34, height:34, borderRadius:10, background:`${team.primary}22`,
              color:team.primary, display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:16, fontWeight:700,
            }}>{a.icon}</div>
            <div style={{fontFamily:'IBM Plex Sans KR, sans-serif', fontSize:10,
              color:'#aaa', fontWeight:600}}>{a.label}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

window.ShareScreen = ShareScreen;
