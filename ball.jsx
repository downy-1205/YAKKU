// 3D-looking baseball (SVG pseudo-3D). Now with interactive sticker positioning.
// - Click empty ball surface to PLACE the active sticker at that position
// - Click a sticker to SELECT it
// - Drag a selected sticker to REPOSITION it
// - Exposes `usePositioning` hook: returns active sticker index + handlers

function Baseball({
  team, size = 280, stickers = [], setStickers,
  activeStickerKind, activePayload,
  rotation = 0, spinning = true,
  selectedIndex, setSelectedIndex,
  interactive = false,
}) {
  const R = size / 2;
  const seamColor = team.primary;
  const ballRef = React.useRef(null);
  const [dragIdx, setDragIdx] = React.useState(null);

  // pause spin while dragging or when a sticker is selected, for easier edits
  const shouldSpin = spinning && dragIdx === null && selectedIndex == null;
  const spinStyle = shouldSpin ? {
    animation: 'ballspin 14s linear infinite',
  } : { transform: `rotate(${rotation}deg)` };

  // Convert pointer coords → ball-relative % (0..100) and return null if outside circle
  const pointerToBallPct = (clientX, clientY) => {
    const el = ballRef.current; if (!el) return null;
    const rect = el.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top)  / rect.height) * 100;
    // clamp within ball disc (approx)
    const dx = x - 50, dy = y - 50;
    if (dx*dx + dy*dy > 50*50) return null;
    return { x, y };
  };

  const onBallPointerDown = (e) => {
    if (!interactive || !setStickers) return;
    // Only fire if the user clicked the ball BG (not a sticker, handled separately).
    if (e.target.closest('[data-sticker-idx]')) return;
    const pt = pointerToBallPct(e.clientX, e.clientY);
    if (!pt || !activeStickerKind) return;
    // Add new sticker at that pos
    const idx = stickers.length;
    setStickers(s => [...s, {
      kind: activeStickerKind, payload: activePayload,
      x: pt.x, y: pt.y, scale: 0.85, rot: 0,
    }]);
    setSelectedIndex?.(idx);
  };

  const onStickerPointerDown = (i) => (e) => {
    if (!interactive || !setStickers) return;
    e.stopPropagation();
    setSelectedIndex?.(i);
    setDragIdx(i);
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const onStickerPointerMove = (e) => {
    if (dragIdx == null) return;
    const pt = pointerToBallPct(e.clientX, e.clientY);
    if (!pt) return;
    setStickers(s => s.map((sk, i) => i === dragIdx ? { ...sk, x: pt.x, y: pt.y } : sk));
  };

  const onStickerPointerUp = (e) => {
    if (dragIdx != null) {
      e.currentTarget.releasePointerCapture?.(e.pointerId);
      setDragIdx(null);
    }
  };

  return (
    <div style={{
      width: size, height: size, position: 'relative',
      filter: `drop-shadow(0 30px 40px ${team.primary}55) drop-shadow(0 8px 12px rgba(0,0,0,0.45))`,
      touchAction: interactive ? 'none' : 'auto',
    }}>
      <style>{`
        @keyframes ballspin { from { transform: rotate(0deg);} to { transform: rotate(360deg);} }
      `}</style>
      <div
        ref={ballRef}
        onPointerDown={onBallPointerDown}
        onPointerMove={onStickerPointerMove}
        onPointerUp={onStickerPointerUp}
        style={{
          width: size, height: size, borderRadius: '50%', position: 'relative', overflow: 'hidden',
          cursor: interactive && activeStickerKind ? 'crosshair' : 'default',
          background: `radial-gradient(circle at 32% 28%, #ffffff 0%, #fafaf5 22%, #ebe6db 55%, #b8b0a1 85%, #6b6557 100%)`,
          boxShadow: `inset -14px -20px 40px rgba(40,28,10,0.35), inset 18px 22px 30px rgba(255,255,255,0.7)`,
        }}>
        <div style={{position:'absolute', inset:0, opacity:0.15, mixBlendMode:'multiply',
          backgroundImage: `radial-gradient(rgba(90,70,40,0.6) 1px, transparent 1.4px)`,
          backgroundSize: '4px 4px', pointerEvents:'none',
        }} />

        <div style={{ position:'absolute', inset:0, ...spinStyle, pointerEvents:'none' }}>
          <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} style={{position:'absolute', inset:0}}>
            <BaseballSeam cx={R*0.35} cy={R} r={R*0.72} color={seamColor} flip={false} />
            <BaseballSeam cx={R*1.65} cy={R} r={R*0.72} color={seamColor} flip={true} />
          </svg>
        </div>

        {/* Stickers — live in non-spinning layer when interactive, so drag coords line up */}
        <div style={{
          position:'absolute', inset:0,
          ...(interactive ? {} : spinStyle),
          pointerEvents:'none',
        }}>
          {stickers.map((s, i) => (
            <Sticker key={i} idx={i} sticker={s} team={team} size={size}
              selected={selectedIndex === i}
              interactive={interactive}
              onPointerDown={onStickerPointerDown(i)} />
          ))}
        </div>

        {/* Active-sticker hint ring */}
        {interactive && activeStickerKind && selectedIndex == null && (
          <div style={{
            position:'absolute', inset:8, borderRadius:'50%',
            border:`1.5px dashed ${team.primary}80`,
            pointerEvents:'none', animation:'ballspin 22s linear infinite',
          }}/>
        )}

        <div style={{
          position: 'absolute', top: '8%', left: '18%', width: '40%', height: '28%',
          background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.8), transparent 70%)',
          filter: 'blur(6px)', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          boxShadow: `inset 0 -30px 60px ${team.primary}22, inset 0 -4px 20px rgba(0,0,0,0.35)`,
          pointerEvents: 'none',
        }} />
      </div>
    </div>
  );
}

function BaseballSeam({ cx, cy, r, color, flip }) {
  const startA = flip ? Math.PI * 0.75 : Math.PI * 0.25;
  const endA   = flip ? Math.PI * 1.25 : -Math.PI * 0.25;
  const startX = cx + r * Math.cos(startA);
  const startY = cy + r * Math.sin(startA);
  const endX   = cx + r * Math.cos(endA);
  const endY   = cy + r * Math.sin(endA);

  const stitches = [];
  const steps = 14;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const a = startA + (endA - startA) * t;
    const px = cx + r * Math.cos(a);
    const py = cy + r * Math.sin(a);
    const tx = -Math.sin(a);
    const ty = Math.cos(a);
    const len = 10;
    stitches.push(<line key={i} x1={px - tx*len} y1={py - ty*len} x2={px + tx*len} y2={py + ty*len}
      stroke={color} strokeWidth="2.3" strokeLinecap="round" />);
  }

  return (
    <g>
      <path d={`M ${startX} ${startY} A ${r} ${r} 0 0 ${flip?0:1} ${endX} ${endY}`}
        stroke={color} strokeWidth="2.5" fill="none" opacity="0.7" />
      {stitches}
    </g>
  );
}

function Sticker({ idx, sticker, team, size, selected, interactive, onPointerDown }) {
  const { x, y, rot = 0, scale = 1, kind, payload } = sticker;
  const s = 64 * scale;
  return (
    <div
      data-sticker-idx={idx}
      onPointerDown={onPointerDown}
      style={{
        position: 'absolute', left: `${x}%`, top: `${y}%`,
        width: s, height: s,
        transform: `translate(-50%,-50%) rotate(${rot}deg)`,
        pointerEvents: interactive ? 'auto' : 'none',
        cursor: interactive ? 'grab' : 'default',
        touchAction: 'none',
      }}>
      {selected && (
        <div style={{
          position:'absolute', inset:-6, borderRadius:8,
          border:`1.5px dashed ${team.primary}`,
          background:`${team.primary}10`,
          pointerEvents:'none',
        }}/>
      )}
      <StickerArt kind={kind} team={team} payload={payload} size={s} />
    </div>
  );
}

function StickerArt({ kind, team, payload, size }) {
  if (kind === 'logo') {
    return (
      <div style={{
        width: size, height: size, borderRadius: '50%',
        background: team.primary, color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'Space Grotesk, sans-serif', fontWeight: 900,
        fontSize: size * 0.36, letterSpacing: -1,
        boxShadow: `0 0 0 3px #fff, 0 0 0 5px ${team.secondary}`,
      }}>{team.short.length > 2 ? team.short.slice(0,2) : team.short}</div>
    );
  }
  if (kind === 'number') {
    return (
      <div style={{
        width: size, height: size, borderRadius: 10,
        background: team.secondary === '#FFFFFF' ? '#fff' : team.secondary,
        color: team.secondary === '#FFFFFF' ? team.primary : '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'Space Grotesk, sans-serif', fontWeight: 900, fontStyle: 'italic',
        fontSize: size * 0.52, lineHeight: 1,
        border: `3px solid ${team.primary}`,
        boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
      }}>{payload || '10'}</div>
    );
  }
  if (kind === 'cheer') {
    return (
      <div style={{
        width: size, height: size * 0.5, marginTop: size * 0.25,
        background: team.primary, color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'IBM Plex Sans KR, sans-serif', fontWeight: 800,
        fontSize: size * 0.22, borderRadius: 4,
        transform: 'skewX(-8deg)', padding: '0 6px',
        whiteSpace: 'nowrap',
      }}>{payload || '최강'}</div>
    );
  }
  if (kind === 'star') {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size}>
        <path d="M12 2 L14.5 9 L22 9 L16 13.5 L18.5 21 L12 16.5 L5.5 21 L8 13.5 L2 9 L9.5 9 Z"
          fill={team.primary} stroke={team.secondary === '#FFFFFF' ? '#fff' : team.secondary} strokeWidth="1" />
      </svg>
    );
  }
  if (kind === 'mascot') {
    return (
      <div style={{
        width: size, height: size, borderRadius: '50%',
        background: team.secondary === '#FFFFFF' ? '#fff' : team.secondary,
        border: `3px solid ${team.primary}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: size * 0.5,
      }}>
        <div style={{ color: team.primary, fontFamily: 'Space Grotesk', fontWeight: 900 }}>{team.mascot[0]}</div>
      </div>
    );
  }
  return null;
}

window.Baseball = Baseball;
window.StickerArt = StickerArt;
