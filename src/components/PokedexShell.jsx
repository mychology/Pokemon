// src/components/PokedexShell.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { Typography, IconButton, InputBase } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import pokeballLarge from '../assets/pokeball-large.png';
import pokeballSmall from '../assets/pokeball-small.png';
import backgroundImg from '../assets/background.png';

const VARS = {
  SHELL_W: 1100,
  SHELL_H: 620,
  BIG_CIRCLE: 480,
  SMALL_CIRCLE: 120,
  RED: '#d43b2b',
  PANEL_BG_1: '#d0d0d0',
  PANEL_BG_2: '#bfbfbf',
};

const ShellWrap = styled.div`
  width: 100%;
  max-width: ${VARS.SHELL_W}px;
  aspect-ratio: ${VARS.SHELL_W}/${VARS.SHELL_H};
  position: relative;
  margin: 18px auto;

  /* Replace linear-gradient with background image */
  background: url(${backgroundImg}) no-repeat center center;
  background-size: cover;

  border-radius: 18px;
  padding: 18px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.18);
  overflow: visible;
`;

const PanelBase = styled.div`
  position: relative;
  border-radius: 14px;
  background: linear-gradient(180deg, ${VARS.PANEL_BG_1}, ${VARS.PANEL_BG_2});
  box-shadow:
    0 2px 0 rgba(255,255,255,0.5) inset,
    0 0 0 8px ${VARS.RED};
`;

const BigCircle = styled(PanelBase)`
  position: absolute;
  left: 20px;
  top: 20px;
  width: ${VARS.BIG_CIRCLE}px;
  height: ${VARS.BIG_CIRCLE}px;
  border-radius: 50%;
  overflow: hidden;
  background-image: url(${pokeballLarge});
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100%;
  z-index: 2;
  display:flex;
  align-items:center;
  justify-content:center;
`;

const MainSprite = styled.img`
  width: 80%;
  height: auto;
  object-fit: contain;
  filter: drop-shadow(0 12px 22px rgba(0,0,0,0.32));
  transform: translateY(-8px);
`;

const SmallCircle = styled(PanelBase)`
  position: absolute;
  left: 30px;
  bottom: 70px;
  width: ${VARS.SMALL_CIRCLE}px;
  height: ${VARS.SMALL_CIRCLE}px;
  border-radius: 50%;
  display:flex;
  align-items:center;
  justify-content:center;
  background-image: url(${pokeballSmall});
  background-repeat: no-repeat;
  background-position: center;
  background-size: 115%;
  z-index: 5;
  padding: 6px;
`;

const SmallSprite = styled.img`
  width: 120%;
  height: auto;
  object-fit: contain;
  border-radius: 50%;
  box-shadow: 0 6px 12px rgba(0,0,0,0.18);
`;

const NameStrip = styled(PanelBase)`
  position: absolute;
  left: ${VARS.BIG_CIRCLE + 40}px;
  top: 20px;
  right: 18px;
  height: 78px;
  border-radius: 18px;
  padding: 10px 18px;
  display:flex;
  align-items:center;
  justify-content:space-between;
  z-index: 12;
`;

const DexBox = styled(PanelBase)`
  position: absolute;
  left: ${VARS.BIG_CIRCLE + 40}px;
  top: 120px;
  width: 420px;
  height: 220px;
  padding: 18px;
  overflow-y: auto;
  z-index: 10;
  border-radius: 18px;
  display:flex;
  flex-direction:column;
`;

const RightColumn = styled.div`
  position: absolute;
  right: 18px;
  top: 120px;
  width: 230px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  z-index: 10;
`;

const StatPanel = styled(PanelBase)`
  padding: 12px;
  width: 100%;
  height: 220px;
  border-radius: 14px;
`;

const SizePanel = styled(PanelBase)`
  width: 100%;
  height: 120px;
  padding: 12px;
  border-radius: 14px;
`;

const BottomEvo = styled(PanelBase)`
  position: absolute;
  left: ${VARS.BIG_CIRCLE + 40}px;
  right: 270px;
  bottom: 18px;
  height: 120px;
  padding: 12px 18px;
  display:flex;
  align-items:center;
  gap: 12px;
  border-radius: 24px;
  z-index: 8;
`;

const EvoTile = styled.div`
  width: 78px;
  height: 78px;
  border-radius: 10px;
  background: linear-gradient(180deg,#f0f0f0,#e6e6e6);
  border: 4px solid #dedede;
  display:flex;
  align-items:center;
  justify-content:center;
  flex-direction:column;
  cursor: pointer;
  transition: transform 0.2s ease;
  &:hover { transform: scale(1.08); }
`;

const EvoSprite = styled.img`
  width: 52px;
  height: 52px;
  object-fit: contain;
`;

const StatRow = styled.div`
  display:flex;
  align-items:center;
  gap:10px;
  margin-bottom:8px;
`;

const StatLabel = styled.div`
  min-width: 80px;
  font-size: 12px;
  color: #222;
  font-weight: 600;
`;

const StatBarsColumn = styled.div`
  display:flex;
  flex-direction:column;
  gap: 8px;
  flex:1;
`;

const StatBarBg = styled.div`
  height: 12px;
  border-radius: 8px;
  background: #e9e9e9;
  overflow:hidden;
  position:relative;
`;

const StatFill = styled.div`
  height:100%;
  border-radius: 8px;
  background: linear-gradient(90deg, ${VARS.RED}, #ff6b5a);
  box-shadow: inset 0 -2px 4px rgba(0,0,0,0.12);
  transition: width 420ms ease;
`;

const PanelTitle = styled.div`
  font-weight: 700;
  font-size: 18px;
  margin-bottom: 8px;
  letter-spacing: 0.6px;
`;

export default function PokedexShell({ pokemon, onClose, onSelectPokemon, onSearch }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');

  if (!pokemon) return null;
  const { name, sprites, types, stats, abilities, flavorText, height, weight, evolutionChain } = pokemon;

  const mainSprite = sprites?.other?.['official-artwork']?.front_default || sprites?.front_default || null;
  const smallSprite = sprites?.front_default || sprites?.other?.['official-artwork']?.front_default || null;

  const statToPct = (val, max = 255) => `${Math.max(0, Math.min(100, Math.round((val / max) * 100)))}%`;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch?.(query.trim().toLowerCase());
      setQuery('');
      setSearchOpen(false);
    }
  };

  return (
    <ShellWrap>
      <BigCircle>
        {mainSprite ? <MainSprite src={mainSprite} alt={name} /> : null}
      </BigCircle>

      <SmallCircle hasSprite={!!smallSprite}>
        {smallSprite ? <SmallSprite src={smallSprite} alt={`${name}-small`} /> : null}
      </SmallCircle>

      <NameStrip>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <IconButton size="small" onClick={() => setSearchOpen(!searchOpen)}>
            <SearchIcon />
          </IconButton>
          {searchOpen && (
            <form onSubmit={handleSearchSubmit} style={{ display: 'flex', alignItems: 'center' }}>
              <InputBase
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search Pokémon"
                style={{ background: '#fff', padding: '2px 8px', borderRadius: 6, fontSize: 14 }}
              />
            </form>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant="h4" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: 36 }}>
            {name?.toUpperCase()}
          </Typography>
          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
  {types?.map(t => {
    const iconPath = new URL(`../assets/${t.type.name}.png`, import.meta.url).href;
    return (
      <img
        key={t.type.name}
        src={iconPath}
        alt={t.type.name}
        style={{
          maxHeight: 48,   // bigger size, taller icons
          objectFit: 'contain',
        }}
      />
    );
  })}
</div>


        </div>

        <IconButton size="small" onClick={onClose}><CloseIcon/></IconButton>
      </NameStrip>

      <DexBox>
        <PanelTitle>Dex entry</PanelTitle>
        <Typography variant="body2" style={{ lineHeight: 1.5 }}>
          {flavorText || 'No dex entry available.'}
        </Typography>
      </DexBox>

      <RightColumn>
        <StatPanel>
          <PanelTitle>Ability</PanelTitle>
          <div style={{ marginBottom: 10 }}>
            {abilities?.map(a => <div key={a.ability.name} style={{ textTransform: 'capitalize' }}>{a.ability.name}</div>)}
          </div>

          <div style={{ marginTop: 6 }}>
            {stats?.map(s => (
              <StatRow key={s.stat.name}>
                <StatLabel>{s.stat.name.toUpperCase()}: {s.base_stat}</StatLabel>
                <StatBarsColumn>
                  <StatBarBg>
                    <StatFill style={{ width: statToPct(s.base_stat, 255) }} />
                  </StatBarBg>
                </StatBarsColumn>
              </StatRow>
            ))}
          </div>
        </StatPanel>

        <SizePanel>
          <PanelTitle>Size comp.</PanelTitle>
          <div>Ht: {height ? `${height / 10} m` : 'N/A'}</div>
          <div>Wt: {weight ? `${weight / 10} kg` : 'N/A'}</div>
        </SizePanel>
      </RightColumn>

      <BottomEvo>
        <div style={{ flex: 1 }}>
          <PanelTitle style={{ marginBottom: 6 }}>Evolution</PanelTitle>
          <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
            {(evolutionChain || []).map((ev, idx) => (
              <EvoTile key={ev.name ?? idx} onClick={() => onSelectPokemon?.(ev.name)}>
                {ev.sprite ? <EvoSprite src={ev.sprite} alt={ev.name} /> : null}
                <div style={{ fontSize: 12, marginTop: 6, textTransform: 'capitalize' }}>{ev.name}</div>
              </EvoTile>
            ))}
          </div>
        </div>
      </BottomEvo>
    </ShellWrap>
  );
}
