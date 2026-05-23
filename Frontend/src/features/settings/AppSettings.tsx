import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Panel } from '../../components/ui/Panel'
import { ComicBtn } from '../../components/ui/ComicBtn'
import { Tag } from '../../components/ui/Tag'
import { Topbar } from '../../components/ui/Topbar'
import { C, S, FS, BW, R, mkShadow } from '../../styles/tokens'

interface ToggleRowProps {
  label: string
  sub: string
  value: boolean
  onChange: (v: boolean) => void
}

function ToggleRow({ label, sub, value, onChange }: ToggleRowProps) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: `${S[2.5]} ${S[3]}`,
      border: `${BW.base} solid ${C.ink}`,
      borderRadius: R.sm,
      boxShadow: mkShadow(),
      background: value ? C.yellowLt : C.paper,
      transition: 'background 0.15s',
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: S[0.5] }}>
        <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.sm, color: C.ink }}>{label}</span>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: FS.xs, color: C.muted }}>{sub}</span>
      </div>
      <button
        onClick={() => onChange(!value)}
        style={{
          width: 44, height: 24, borderRadius: 12,
          background: value ? C.green : C.mutedLt,
          border: `${BW.base} solid ${C.ink}`,
          boxShadow: mkShadow(),
          cursor: 'pointer',
          position: 'relative',
          transition: 'background 0.15s',
          flexShrink: 0,
        }}
      >
        <div style={{
          position: 'absolute',
          top: 2, left: value ? 20 : 2,
          width: 16, height: 16,
          borderRadius: '50%',
          background: C.paper,
          border: `${BW.base} solid ${C.ink}`,
          transition: 'left 0.15s',
        }} />
      </button>
    </div>
  )
}

interface InputFieldProps {
  label: string
  value: string
  onChange?: (v: string) => void
  readOnly?: boolean
  placeholder?: string
}

function InputField({ label, value, onChange, readOnly, placeholder }: InputFieldProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: S[1] }}>
      <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.xs, color: C.muted, letterSpacing: 1 }}>{label}</span>
      <input
        type="text"
        value={value}
        onChange={e => onChange?.(e.target.value)}
        readOnly={readOnly}
        placeholder={placeholder}
        style={{
          padding: `${S[2]} ${S[3]}`,
          border: `${BW.base} solid ${C.ink}`,
          borderRadius: R.sm,
          boxShadow: mkShadow(),
          background: readOnly ? C.cream : C.paper,
          fontFamily: "'Space Mono', monospace",
          fontSize: FS.sm,
          color: readOnly ? C.muted : C.ink,
          outline: 'none',
          width: '100%',
          boxSizing: 'border-box',
          cursor: readOnly ? 'default' : 'text',
        }}
      />
    </div>
  )
}

function SelectField({ label, value, onChange, options }: {
  label: string
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: S[1] }}>
      <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.xs, color: C.muted, letterSpacing: 1 }}>{label}</span>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          padding: `${S[2]} ${S[3]}`,
          border: `${BW.base} solid ${C.ink}`,
          borderRadius: R.sm,
          boxShadow: mkShadow(),
          background: C.paper,
          fontFamily: "'Archivo Black', sans-serif",
          fontSize: FS.sm,
          color: C.ink,
          outline: 'none',
          cursor: 'pointer',
          appearance: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%232d2a26' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: `right ${S[3]} center`,
          paddingRight: S[8],
        }}
      >
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  )
}

export function AppSettings() {
  const { profil } = useAuth()
  const navigate = useNavigate()

  const [displayName, setDisplayName] = useState(profil?.username ?? '')
  const [language, setLanguage] = useState('en')
  const [dateFormat, setDateFormat] = useState('dmy')
  const [saved, setSaved] = useState(false)

  // Notification toggles
  const [notifEmail, setNotifEmail] = useState(true)
  const [notifQuiz, setNotifQuiz] = useState(true)
  const [notifModule, setNotifModule] = useState(false)
  const [notifWeekly, setNotifWeekly] = useState(true)
  const [notifSystem, setNotifSystem] = useState(false)

  // Appearance toggles
  const [compactMode, setCompactMode] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [highContrast, setHighContrast] = useState(false)

  // Sound
  const [volume, setVolume] = useState(70)
  const [soundEffects, setSoundEffects] = useState(true)
  const [soundQuiz, setSoundQuiz] = useState(true)
  const [soundXp, setSoundXp] = useState(true)
  const [soundAmbient, setSoundAmbient] = useState(false)

  // Privacy toggles
  const [privacyLeaderboard, setPrivacyLeaderboard] = useState(true)
  const [privacyActivity, setPrivacyActivity] = useState(false)

  const notifActiveCount = [notifEmail, notifQuiz, notifModule, notifWeekly, notifSystem].filter(Boolean).length

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="dashboard-main">
      <Topbar
        title="SETTINGS"
        subtitle="Account · notifications · appearance · sound"
        back={() => navigate('/profile')}
        actions={
          <ComicBtn sm color={saved ? C.greenLt : C.yellow} onClick={handleSave}>
            {saved ? '✓ SAVED' : 'SAVE CHANGES'}
          </ComicBtn>
        }
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: S[4] }}>

        {/* Account */}
        <Panel title="ACCOUNT" accent={C.yellow}
          action={<Tag label="PROFILE" bg={C.yellowLt} />}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: S[3] }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: S[3] }}>
              <InputField label="DISPLAY NAME" value={displayName} onChange={setDisplayName} />
              <SelectField
                label="LANGUAGE"
                value={language}
                onChange={setLanguage}
                options={[
                  { value: 'en', label: 'English' },
                  { value: 'sl', label: 'Slovenščina' },
                  { value: 'de', label: 'Deutsch' },
                  { value: 'hr', label: 'Hrvatski' },
                ]}
              />
              <SelectField
                label="DATE FORMAT"
                value={dateFormat}
                onChange={setDateFormat}
                options={[
                  { value: 'dmy', label: 'DD / MM / YYYY' },
                  { value: 'mdy', label: 'MM / DD / YYYY' },
                  { value: 'ymd', label: 'YYYY / MM / DD' },
                ]}
              />
            </div>
            <div style={{ display: 'flex', gap: S[2], flexWrap: 'wrap' }}>
              <ComicBtn sm color={C.paper} hoverColor={C.yellowLt}>EXPORT MY DATA</ComicBtn>
              <ComicBtn sm color={C.redLt} hoverColor={C.red} dark={false}>DELETE ACCOUNT</ComicBtn>
            </div>
          </div>
        </Panel>

        {/* Notifications */}
        <Panel title="NOTIFICATIONS" accent={C.cyan}
          action={<Tag label={`${notifActiveCount} / 5 ON`} bg={C.cyanLt} />}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: S[2] }}>
            <ToggleRow
              label="EMAIL NOTIFICATIONS"
              sub="Receive updates and summaries via email"
              value={notifEmail}
              onChange={setNotifEmail}
            />
            <ToggleRow
              label="QUIZ REMINDERS"
              sub="Remind me about upcoming and pending quizzes"
              value={notifQuiz}
              onChange={setNotifQuiz}
            />
            <ToggleRow
              label="MODULE UPDATES"
              sub="Notify when new content is added to enrolled modules"
              value={notifModule}
              onChange={setNotifModule}
            />
            <ToggleRow
              label="WEEKLY DIGEST"
              sub="Summary of progress and activity every Monday"
              value={notifWeekly}
              onChange={setNotifWeekly}
            />
            <ToggleRow
              label="SYSTEM ANNOUNCEMENTS"
              sub="Platform updates and maintenance notices"
              value={notifSystem}
              onChange={setNotifSystem}
            />
          </div>
        </Panel>

        {/* Appearance */}
        <Panel title="APPEARANCE" accent={C.purple}
          action={<Tag label="DISPLAY" bg={C.purpleLt} />}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: S[3] }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: S[2] }}>
              <ToggleRow
                label="COMPACT MODE"
                sub="Reduce spacing and card sizes across the app"
                value={compactMode}
                onChange={setCompactMode}
              />
              <ToggleRow
                label="REDUCED MOTION"
                sub="Disable animations and transitions"
                value={reducedMotion}
                onChange={setReducedMotion}
              />
              <ToggleRow
                label="HIGH CONTRAST"
                sub="Increase border and text contrast for readability"
                value={highContrast}
                onChange={setHighContrast}
              />
            </div>
          </div>
        </Panel>

        {/* Sound */}
        <Panel title="SOUND" accent={C.orange}
          action={<Tag label="AUDIO" bg={C.orangeLt} />}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: S[3] }}>

            {/* Volume slider */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: S[3],
              padding: `${S[2.5]} ${S[3]}`,
              border: `${BW.base} solid ${C.ink}`,
              borderRadius: R.sm,
              boxShadow: mkShadow(),
              background: C.paper,
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: S[0.5], flexShrink: 0 }}>
                <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.sm, color: C.ink }}>MASTER VOLUME</span>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: FS.xs, color: C.muted }}>Controls all in-app audio levels</span>
              </div>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: S[3] }}>
                <input
                  type="range"
                  min={0} max={100} value={volume}
                  onChange={e => setVolume(Number(e.target.value))}
                  style={{
                    flex: 1, height: 6, cursor: 'pointer',
                    accentColor: C.orange, outline: 'none',
                    border: 'none', background: 'transparent',
                  }}
                />
                <Tag label={`${volume}%`} bg={C.orangeLt} />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: S[2] }}>
            <ToggleRow
              label="SOUND EFFECTS"
              sub="Master toggle for all in-app sounds"
              value={soundEffects}
              onChange={setSoundEffects}
            />
            <ToggleRow
              label="QUIZ FEEDBACK SOUNDS"
              sub="Play sounds on correct / incorrect answers"
              value={soundQuiz}
              onChange={setSoundQuiz}
            />
            <ToggleRow
              label="XP & ACHIEVEMENT SOUNDS"
              sub="Play fanfare when earning XP or unlocking badges"
              value={soundXp}
              onChange={setSoundXp}
            />
            <ToggleRow
              label="AMBIENT BACKGROUND"
              sub="Soft background music while studying"
              value={soundAmbient}
              onChange={setSoundAmbient}
            />
            </div>
          </div>
        </Panel>

        {/* Privacy */}
        <Panel title="PRIVACY" accent={C.green}
          action={<Tag label="DATA" bg={C.greenLt} />}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: S[2] }}>
            <ToggleRow
              label="LEADERBOARD VISIBILITY"
              sub="Show my rank and XP on the public leaderboard"
              value={privacyLeaderboard}
              onChange={setPrivacyLeaderboard}
            />
            <ToggleRow
              label="ACTIVITY SHARING"
              sub="Share my module progress with classmates"
              value={privacyActivity}
              onChange={setPrivacyActivity}
            />
          </div>
        </Panel>

      </div>
    </div>
  )
}
