// Screen 1 — Onboarding / Team Selection

function OnboardingScreen({ onSelect, selectedTeam }) {
  const [hovered, setHovered] = React.useState(null);
  const active = hovered || selectedTeam;

  return (
    <div style={{
      position:'absolute', inset:0, background:'#0a0a0c',
      color:'#fff', display:'flex', flexDirection:'column',
      overflow:'hidden',
    }}>
      {/* Ambient team color glow (follows hover) */}
      <div style={{
        position:'absolute', top:-120, left:'50%', transform:'translateX(-50%)',
        width:600, height:600, borderRadius:'50%',
        background: `radial-gradient(circle, ${active.primary}50 0%, transparent 60%)`,
        filter:'blur(30px)', transition:'all .5s ease', pointerEvents:'none',
      }}/>
      {/* Noise grain */}
      <div style={{
        position:'absolute', inset:0, opacity:0.5, mixBlendMode:'overlay',
        backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='.9'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)' opacity='.4'/%3E%3C/svg%3E")`,
        pointerEvents:'none',
      }}/>

      {/* header area */}
      <div style={{ padding: '70px 24px 16px', position:'relative', zIndex:2 }}>
        <div style={{
          fontFamily:'Space Grotesk, sans-serif', fontSize:11, fontWeight:600,
          letterSpacing:3, color:'#888', textTransform:'uppercase', marginBottom:8,
        }}>STEP 01 / 야꾸 시작</div>
        <div style={{
          fontFamily:'IBM Plex Sans KR, sans-serif', fontWeight:700,
          fontSize:34, lineHeight:1.1, letterSpacing:-1.2,
          textWrap:'pretty',
        }}>
          당신의 팀을<br/>
          <span style={{color: active.primary, transition:'color .4s'}}>선택하세요</span>
        </div>
        <div style={{
          fontSize:13, color:'#888', marginTop:10, lineHeight:1.5,
          fontFamily:'IBM Plex Sans KR, sans-serif',
        }}>
          야구공을 내 손으로 꾸미고, 팬들과 공유하세요.<br/>
          <span style={{color:active.primary}}>10개 구단</span> · 커스텀 스티커 · 3D 미리보기
        </div>
      </div>

      {/* team grid — 2x5 */}
      <div style={{
        padding:'18px 16px', display:'grid',
        gridTemplateColumns:'repeat(2, 1fr)', gap:10,
        position:'relative', zIndex:2, flex:1, alignContent:'start',
      }}>
        {TEAMS.map(t => {
          const isSel = selectedTeam?.id === t.id;
          return (
            <button key={t.id}
              onPointerEnter={()=>setHovered(t)}
              onPointerLeave={()=>setHovered(null)}
              onClick={()=>onSelect(t)}
              style={{
                position:'relative', aspectRatio:'1/0.88', border:'none', padding:0,
                borderRadius:16, overflow:'hidden', cursor:'pointer',
                background: isSel ? t.primary : '#141416',
                outline: isSel ? `2px solid #fff` : `1px solid #1f1f22`,
                outlineOffset: isSel ? -2 : -1,
                transform: isSel ? 'scale(1.02)' : 'scale(1)',
                transition:'all .25s cubic-bezier(.2,.9,.3,1.2)',
                textAlign:'left',
              }}>
              {/* big translucent team-color wedge */}
              <div style={{
                position:'absolute', right:-20, top:-20, width:90, height:90,
                background:t.primary, borderRadius:'50%', opacity: isSel ? 0 : 0.9,
                transition:'opacity .3s',
              }}/>
              <div style={{
                position:'absolute', right:-8, top:-8, width:54, height:54,
                background:t.secondary === '#FFFFFF' ? '#fff' : t.secondary,
                borderRadius:'50%', opacity: isSel ? 0 : 0.5, mixBlendMode:'screen',
              }}/>
              <div style={{
                position:'relative', padding:'12px', height:'100%', display:'flex',
                flexDirection:'column', justifyContent:'space-between', color:'#fff',
              }}>
                <div>
                  <div style={{
                    fontFamily:'Space Grotesk, sans-serif', fontWeight:800,
                    fontSize:22, letterSpacing:-0.5, lineHeight:1,
                  }}>{t.short}</div>
                  <div style={{
                    fontFamily:'IBM Plex Sans KR, sans-serif', fontSize:11,
                    color: isSel ? 'rgba(255,255,255,0.8)' : '#999', marginTop:4,
                  }}>{t.city}</div>
                </div>
                <div style={{
                  fontFamily:'IBM Plex Sans KR, sans-serif', fontSize:13,
                  fontWeight:600, letterSpacing:-0.3,
                }}>{t.name.replace(t.short+' ', '')}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* bottom sticky CTA */}
      <div style={{
        padding:'12px 16px 34px', position:'relative', zIndex:3,
        background:'linear-gradient(to top, #0a0a0c, #0a0a0c 70%, transparent)',
      }}>
        <button onClick={()=> selectedTeam && onSelect(selectedTeam, true)} disabled={!selectedTeam}
          style={{
            width:'100%', height:56, border:'none', borderRadius:14,
            background: selectedTeam ? selectedTeam.primary : '#232327',
            color: selectedTeam ? '#fff' : '#555',
            fontFamily:'IBM Plex Sans KR, sans-serif', fontWeight:700, fontSize:16,
            letterSpacing:-0.3, cursor: selectedTeam ? 'pointer' : 'default',
            boxShadow: selectedTeam ? `0 8px 24px ${selectedTeam.primary}60` : 'none',
            display:'flex', alignItems:'center', justifyContent:'center', gap:10,
            transition:'all .3s',
          }}>
          {selectedTeam ? <><span>야꾸 시작하기</span><span style={{fontSize:20}}>→</span></> : '팀을 선택해주세요'}
        </button>
      </div>
    </div>
  );
}

window.OnboardingScreen = OnboardingScreen;
